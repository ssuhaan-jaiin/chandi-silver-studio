import { NextRequest, NextResponse } from 'next/server'

// In-memory rate limiting: 3 requests per IP per 10 minutes
// Note: resets on serverless cold starts — fine for launch
const RATE_LIMIT = new Map<string, { count: number; firstAt: number }>()
const WINDOW_MS = 10 * 60 * 1000
const MAX_REQUESTS = 3

function getIp(req: NextRequest): string {
  return req.headers.get('x-forwarded-for')?.split(',')[0].trim() ?? 'unknown'
}

function checkRateLimit(ip: string): boolean {
  const now = Date.now()
  const record = RATE_LIMIT.get(ip)
  if (!record) {
    RATE_LIMIT.set(ip, { count: 1, firstAt: now })
    return true
  }
  if (now - record.firstAt >= WINDOW_MS) {
    RATE_LIMIT.set(ip, { count: 1, firstAt: now })
    return true
  }
  if (record.count >= MAX_REQUESTS) return false
  record.count++
  return true
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export async function POST(req: NextRequest) {
  const ip = getIp(req)
  if (!checkRateLimit(ip)) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 })
  }

  let body: { email?: string; website?: string }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
  }

  // Honeypot: filled-in bot submissions are silently accepted
  if (body.website) {
    return NextResponse.json({ ok: true })
  }

  const { email } = body
  if (!email || !EMAIL_RE.test(email)) {
    return NextResponse.json({ error: 'Invalid email address' }, { status: 400 })
  }

  const listId = process.env.KLAVIYO_LIST_ID
  const privateKey = process.env.KLAVIYO_PRIVATE_KEY

  if (!listId || !privateKey) {
    console.error('Klaviyo env vars missing: KLAVIYO_LIST_ID or KLAVIYO_PRIVATE_KEY')
    return NextResponse.json({ error: 'Server configuration error' }, { status: 500 })
  }

  try {
    const res = await fetch('https://a.klaviyo.com/api/profile-subscription-bulk-create-jobs/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Klaviyo-API-Key ${privateKey}`,
        'revision': '2024-02-15',
      },
      body: JSON.stringify({
        data: {
          type: 'profile-subscription-bulk-create-job',
          attributes: {
            profiles: {
              data: [
                {
                  type: 'profile',
                  attributes: {
                    email,
                    subscriptions: {
                      email: { marketing: { consent: 'SUBSCRIBED' } },
                    },
                  },
                },
              ],
            },
          },
          relationships: {
            list: { data: { type: 'list', id: listId } },
          },
        },
      }),
    })

    // Klaviyo returns 202 Accepted for bulk jobs
    if (!res.ok && res.status !== 202) {
      const errText = await res.text()
      console.error('Klaviyo error:', res.status, errText)
      return NextResponse.json({ error: 'Subscription failed' }, { status: 500 })
    }

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('Klaviyo fetch error:', err)
    return NextResponse.json({ error: 'Network error' }, { status: 500 })
  }
}
