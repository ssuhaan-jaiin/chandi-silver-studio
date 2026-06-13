import { NextRequest, NextResponse } from 'next/server'
import { checkRateLimit, getClientIp } from '@/lib/rateLimit'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const HANDLE_RE = /^[a-z0-9-]+$/

export async function POST(req: NextRequest) {
  const ip = getClientIp(req)
  if (!checkRateLimit(ip, 3, 10 * 60 * 1000)) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 })
  }

  let body: { email?: string; website?: string; productHandle?: string; productTitle?: string }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
  }

  if (body.website) {
    return NextResponse.json({ ok: true })
  }

  const email = typeof body.email === 'string' ? body.email.trim() : ''
  if (!email || !EMAIL_RE.test(email) || email.length > 254) {
    return NextResponse.json({ error: 'Invalid email address' }, { status: 400 })
  }

  const productHandle = typeof body.productHandle === 'string'
    ? body.productHandle.trim().slice(0, 255)
    : ''
  const productTitle = typeof body.productTitle === 'string'
    ? body.productTitle.trim().slice(0, 500)
    : ''

  if (productHandle && !HANDLE_RE.test(productHandle)) {
    return NextResponse.json({ error: 'Invalid product handle' }, { status: 400 })
  }

  const listId = process.env.KLAVIYO_WAITLIST_LIST_ID
  const privateKey = process.env.KLAVIYO_PRIVATE_KEY

  if (!listId || !privateKey) {
    console.error('Klaviyo env vars missing: KLAVIYO_WAITLIST_LIST_ID or KLAVIYO_PRIVATE_KEY')
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
                    properties: {
                      waitlist_product: productHandle,
                      waitlist_product_title: productTitle,
                    },
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

    if (!res.ok && res.status !== 202) {
      console.error('Klaviyo waitlist error:', res.status)
      return NextResponse.json({ error: 'Waitlist signup failed' }, { status: 500 })
    }

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('Klaviyo waitlist fetch error:', err)
    return NextResponse.json({ error: 'Network error' }, { status: 500 })
  }
}
