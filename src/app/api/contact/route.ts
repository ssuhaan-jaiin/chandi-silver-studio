import { NextRequest, NextResponse } from 'next/server'
import { checkRateLimit, getClientIp } from '@/lib/rateLimit'

// TODO: replace with Resend email service for direct email delivery in production.
// npm install resend — see resend.com for setup.

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const URL_RE = /https?:\/\/|www\./i

function sanitise(str: unknown, maxLen: number): string | null {
  if (typeof str !== 'string') return null
  const trimmed = str.trim()
  if (trimmed.length < 1 || trimmed.length > maxLen) return null
  return trimmed
}

function stripHtml(str: string): string {
  return str.replace(/<[^>]*>/g, '')
}

export async function POST(req: NextRequest) {
  const ip = getClientIp(req)
  if (!checkRateLimit(ip, 2, 60 * 60 * 1000)) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 })
  }

  let body: Record<string, unknown>
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
  }

  if (body.website) {
    return NextResponse.json({ ok: true })
  }

  const name = sanitise(body.name, 100)
  const email = sanitise(body.email, 254)
  const subject = sanitise(body.subject, 200)
  const rawMessage = sanitise(body.message, 2000)

  if (!name) return NextResponse.json({ error: 'Name is required (max 100 chars)' }, { status: 400 })
  if (!email || !EMAIL_RE.test(email)) return NextResponse.json({ error: 'Invalid email address' }, { status: 400 })
  if (!subject) return NextResponse.json({ error: 'Subject is required (max 200 chars)' }, { status: 400 })
  if (!rawMessage) return NextResponse.json({ error: 'Message is required (max 2000 chars)' }, { status: 400 })

  const message = stripHtml(rawMessage)

  if (URL_RE.test(message)) {
    return NextResponse.json({ ok: true })
  }

  console.log(`[Contact Form] ${new Date().toISOString()} | from: ${email} | subject: ${subject} | message: ${message.slice(0, 200)}`)

  const privateKey = process.env.KLAVIYO_PRIVATE_KEY
  if (privateKey) {
    try {
      await fetch('https://a.klaviyo.com/api/events/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Klaviyo-API-Key ${privateKey}`,
          'revision': '2024-02-15',
        },
        body: JSON.stringify({
          data: {
            type: 'event',
            attributes: {
              metric: { data: { type: 'metric', attributes: { name: 'Contact Form Submission' } } },
              profile: { data: { type: 'profile', attributes: { email, first_name: name } } },
              properties: { subject, message, name },
            },
          },
        }),
      })
    } catch (err) {
      console.error('Klaviyo contact event error:', err)
    }
  }

  return NextResponse.json({ ok: true })
}
