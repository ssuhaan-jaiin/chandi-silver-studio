import { revalidatePath } from 'next/cache'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const secret = req.headers.get('x-revalidation-secret')
  if (secret !== process.env.SHOPIFY_REVALIDATION_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await req.json()
    const { topic, payload } = body

    switch (topic) {
      case 'products/update':
      case 'products/create':
        if (payload?.handle) {
          revalidatePath(`/shop/${payload.handle}`)
        }
        revalidatePath('/shop')
        revalidatePath('/')
        break

      case 'inventory_levels/update':
        revalidatePath('/shop', 'layout')
        break

      case 'collections/update':
        revalidatePath('/shop')
        revalidatePath('/')
        break

      default:
        revalidatePath('/', 'layout')
    }

    return NextResponse.json({ revalidated: true })
  } catch (err) {
    console.error('Revalidation error:', err)
    return NextResponse.json({ error: 'Revalidation failed' }, { status: 500 })
  }
}
