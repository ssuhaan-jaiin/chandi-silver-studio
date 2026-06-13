import { NextRequest, NextResponse } from 'next/server'
import { shopifyClient } from '@/lib/shopify'
import { checkRateLimit, getClientIp } from '@/lib/rateLimit'

// ─── Allowed filter values ────────────────────────────────────────────────────

const ALLOWED_TYPES      = new Set(['rings', 'necklaces', 'bracelets', 'earrings'])
const ALLOWED_SORTS      = new Set(['newest', 'price-asc', 'price-desc', 'bestselling'])
const ALLOWED_INTENTIONS = new Set(['love','anxiety-relief','protection','clarity','abundance','grounding','healing','confidence'])
const ALLOWED_CRYSTALS   = new Set(['rose-quartz','amethyst','moonstone','labradorite','citrine','black-tourmaline'])
const ALLOWED_PRICES     = new Set(['0-100','100-200','200-300','300-999'])

function sanitiseFilters(raw: Record<string, string>): Record<string, string> {
  const out: Record<string, string> = {}

  if (raw.type) {
    const valid = raw.type.split(',').filter((v) => ALLOWED_TYPES.has(v))
    if (valid.length) out.type = valid.join(',')
  }
  if (raw.sort && ALLOWED_SORTS.has(raw.sort)) out.sort = raw.sort
  if (raw.intention) {
    const valid = raw.intention.split(',').filter((v) => ALLOWED_INTENTIONS.has(v))
    if (valid.length) out.intention = valid.join(',')
  }
  if (raw.crystal) {
    const valid = raw.crystal.split(',').filter((v) => ALLOWED_CRYSTALS.has(v))
    if (valid.length) out.crystal = valid.join(',')
  }
  if (raw.price && ALLOWED_PRICES.has(raw.price)) out.price = raw.price

  return out
}

// ─── Sort key mapping ─────────────────────────────────────────────────────────

const SORT_MAP: Record<string, { sortKey: string; reverse: boolean }> = {
  'newest':      { sortKey: 'CREATED_AT',   reverse: true  },
  'price-asc':   { sortKey: 'PRICE',        reverse: false },
  'price-desc':  { sortKey: 'PRICE',        reverse: true  },
  'bestselling': { sortKey: 'BEST_SELLING', reverse: false },
}

// ─── Handler ──────────────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  const ip = getClientIp(req)
  if (!checkRateLimit(ip, 30, 60 * 1000)) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 })
  }

  let body: { cursor?: unknown; filters?: unknown }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
  }

  // Validate cursor
  if (!body.cursor || typeof body.cursor !== 'string' || body.cursor.length > 512) {
    return NextResponse.json({ error: 'Invalid cursor' }, { status: 400 })
  }
  const cursor = body.cursor

  // Sanitise filters
  const rawFilters = typeof body.filters === 'object' && body.filters !== null
    ? (body.filters as Record<string, string>)
    : {}
  const filters = sanitiseFilters(rawFilters)

  const { sortKey, reverse } = SORT_MAP[filters.sort ?? ''] ?? SORT_MAP['newest']

  const queryParts: string[] = []
  if (filters.type) queryParts.push(`tag:${filters.type.split(',')[0]}`)
  if (filters.intention) queryParts.push(`tag:${filters.intention.split(',')[0]}`)
  if (filters.crystal) queryParts.push(`tag:${filters.crystal.split(',')[0]}`)
  if (filters.price) {
    const [min, max] = filters.price.split('-')
    queryParts.push(`variants.price:>=${min}`)
    if (parseInt(max) < 999) queryParts.push(`variants.price:<=${max}`)
  }
  const queryString = queryParts.join(' AND ')

  const QUERY = `{
    products(
      first: 12
      after: "${cursor}"
      ${queryString ? `query: "${queryString}"` : ''}
      sortKey: ${sortKey}
      reverse: ${reverse}
    ) {
      edges {
        node {
          id
          title
          handle
          totalInventory
          priceRange {
            minVariantPrice { amount currencyCode }
          }
          images(first: 1) {
            edges { node { url altText } }
          }
          metafield(namespace: "custom", key: "intention") { value }
        }
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }`

  try {
    const response = await shopifyClient.request(QUERY)
    const data = response.data as any
    const edges = data?.products?.edges ?? []

    const products = edges.map(({ node }: any) => ({
      id:             node.id,
      title:          node.title,
      handle:         node.handle,
      price:          node.priceRange?.minVariantPrice?.amount ?? '0',
      currencyCode:   node.priceRange?.minVariantPrice?.currencyCode ?? 'GBP',
      intention:      node.metafield?.value ?? '',
      totalInventory: node.totalInventory ?? 0,
      imageUrl:       node.images?.edges?.[0]?.node?.url ?? '/images/back.png',
      imageAlt:       node.images?.edges?.[0]?.node?.altText ?? node.title,
    }))

    return NextResponse.json({
      products,
      hasNextPage: data?.products?.pageInfo?.hasNextPage ?? false,
      endCursor:   data?.products?.pageInfo?.endCursor ?? '',
    })
  } catch (err) {
    console.error('shop-products fetch error:', err)
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 })
  }
}
