export const revalidate = 300

import { Suspense } from 'react'
import type { Metadata } from 'next'
import { shopifyClient } from '@/lib/shopify'
import ShopFilters from '@/components/shop/ShopFilters'
import ShopGrid from '@/components/shop/ShopGrid'
import { type ProductCardProps } from '@/components/shop/ProductCard'
import { buildMetadata } from '@/lib/seo'

// ─── Types ───────────────────────────────────────────────────────────────────

interface RawParams {
  type?: string
  intention?: string
  crystal?: string
  price?: string
  sort?: string
}

interface FetchResult {
  products: ProductCardProps[]
  hasNextPage: boolean
  endCursor: string
}

// ─── Mock data ───────────────────────────────────────────────────────────────

const MOCK_PRODUCTS_RAW = [
  { id: '1', title: 'Rose Quartz Ring',           handle: 'rose-quartz-ring',           price: '68.00',  currencyCode: 'GBP', intention: 'Love',           crystalType: 'Rose Quartz',     type: 'rings',     totalInventory: 1, image: '/images/back.png' },
  { id: '2', title: 'Amethyst Pendant Necklace',  handle: 'amethyst-pendant-necklace',  price: '120.00', currencyCode: 'GBP', intention: 'Anxiety Relief', crystalType: 'Amethyst',        type: 'necklaces', totalInventory: 3, image: '/images/back2.png' },
  { id: '3', title: 'Moonstone Bracelet',          handle: 'moonstone-bracelet',          price: '95.00',  currencyCode: 'GBP', intention: 'Clarity',        crystalType: 'Moonstone',       type: 'bracelets', totalInventory: 1, image: '/images/back3.png' },
  { id: '4', title: 'Labradorite Drop Earrings',   handle: 'labradorite-drop-earrings',   price: '84.00',  currencyCode: 'GBP', intention: 'Protection',     crystalType: 'Labradorite',     type: 'earrings',  totalInventory: 2, image: '/images/back4.png' },
  { id: '5', title: 'Citrine Abundance Ring',      handle: 'citrine-abundance-ring',      price: '74.00',  currencyCode: 'GBP', intention: 'Abundance',      crystalType: 'Citrine',         type: 'rings',     totalInventory: 1, image: '/images/back.png' },
  { id: '6', title: 'Rose Quartz Necklace',        handle: 'rose-quartz-necklace',        price: '110.00', currencyCode: 'GBP', intention: 'Love',           crystalType: 'Rose Quartz',     type: 'necklaces', totalInventory: 2, image: '/images/back2.png' },
  { id: '7', title: 'Black Tourmaline Bracelet',   handle: 'black-tourmaline-bracelet',   price: '88.00',  currencyCode: 'GBP', intention: 'Protection',     crystalType: 'Black Tourmaline',type: 'bracelets', totalInventory: 1, image: '/images/back3.png' },
  { id: '8', title: 'Amethyst Stud Earrings',      handle: 'amethyst-stud-earrings',      price: '52.00',  currencyCode: 'GBP', intention: 'Anxiety Relief', crystalType: 'Amethyst',        type: 'earrings',  totalInventory: 4, image: '/images/back4.png' },
]

function filterMockProducts(params: RawParams): ProductCardProps[] {
  let results = [...MOCK_PRODUCTS_RAW]

  if (params.type) {
    const types = params.type.split(',')
    results = results.filter((p) => types.includes(p.type))
  }
  if (params.intention) {
    const intentions = params.intention.split(',')
    results = results.filter((p) =>
      intentions.some((i) => p.intention.toLowerCase().replace(/\s+/g, '-') === i)
    )
  }
  if (params.crystal) {
    const crystals = params.crystal.split(',')
    results = results.filter((p) =>
      crystals.some((c) => p.crystalType.toLowerCase().replace(/\s+/g, '-') === c)
    )
  }
  if (params.price) {
    const [min, max] = params.price.split('-').map(Number)
    results = results.filter((p) => {
      const n = parseFloat(p.price)
      return n >= min && (max >= 999 ? true : n <= max)
    })
  }

  // Sort
  if (params.sort === 'price-asc') {
    results.sort((a, b) => parseFloat(a.price) - parseFloat(b.price))
  } else if (params.sort === 'price-desc') {
    results.sort((a, b) => parseFloat(b.price) - parseFloat(a.price))
  }

  return results.map((p) => ({
    id: p.id,
    title: p.title,
    handle: p.handle,
    price: p.price,
    currencyCode: p.currencyCode,
    intention: p.intention,
    totalInventory: p.totalInventory,
    imageUrl: p.image,
    imageAlt: p.title,
  }))
}

// ─── Sort key mapping ────────────────────────────────────────────────────────

const SORT_MAP: Record<string, { sortKey: string; reverse: boolean }> = {
  'newest':      { sortKey: 'CREATED_AT',   reverse: true  },
  'price-asc':   { sortKey: 'PRICE',        reverse: false },
  'price-desc':  { sortKey: 'PRICE',        reverse: true  },
  'bestselling': { sortKey: 'BEST_SELLING', reverse: false },
}

// ─── Shopify fetch ────────────────────────────────────────────────────────────

async function fetchProducts(params: RawParams): Promise<FetchResult> {
  const { sortKey, reverse } = SORT_MAP[params.sort ?? ''] ?? SORT_MAP['newest']

  const queryParts: string[] = []
  if (params.type) queryParts.push(`tag:${params.type.split(',')[0]}`)
  if (params.intention) queryParts.push(`tag:${params.intention.split(',')[0].toLowerCase().replace(/ /g, '-')}`)
  if (params.crystal) queryParts.push(`tag:${params.crystal.split(',')[0]}`)
  if (params.price) {
    const [min, max] = params.price.split('-')
    queryParts.push(`variants.price:>=${min}`)
    if (parseInt(max) < 999) queryParts.push(`variants.price:<=${max}`)
  }
  const queryString = queryParts.join(' AND ')

  const QUERY = `{
    products(
      first: 12
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
          tags
          priceRange {
            minVariantPrice { amount currencyCode }
          }
          images(first: 1) {
            edges { node { url altText width height } }
          }
          metafield(namespace: "custom", key: "intention") { value }
          metafield(namespace: "custom", key: "crystal_type") { value }
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

    if (!edges.length) return { products: filterMockProducts(params), hasNextPage: false, endCursor: '' }

    const products: ProductCardProps[] = edges.map(({ node }: any) => ({
      id:             node.id,
      title:          node.title,
      handle:         node.handle,
      price:          node.priceRange?.minVariantPrice?.amount ?? '0',
      currencyCode:   node.priceRange?.minVariantPrice?.currencyCode ?? 'GBP',
      intention:      node.metafield?.value ?? node.tags?.find((t: string) => INTENTION_TAGS.has(t)) ?? '',
      totalInventory: node.totalInventory ?? 0,
      imageUrl:       node.images?.edges?.[0]?.node?.url ?? '/images/back.png',
      imageAlt:       node.images?.edges?.[0]?.node?.altText ?? node.title,
    }))

    return {
      products,
      hasNextPage: data.products.pageInfo.hasNextPage,
      endCursor:   data.products.pageInfo.endCursor ?? '',
    }
  } catch {
    return { products: filterMockProducts(params), hasNextPage: false, endCursor: '' }
  }
}

const INTENTION_TAGS = new Set(['love','anxiety-relief','protection','clarity','abundance','grounding','healing','confidence'])

// ─── Heading helper ───────────────────────────────────────────────────────────

function getHeading(params: RawParams): string {
  const typeMap: Record<string, string> = {
    rings: 'Rings', necklaces: 'Necklaces', bracelets: 'Bracelets', earrings: 'Earrings',
  }
  if (params.type && !params.type.includes(',')) {
    return typeMap[params.type] ?? 'All Jewellery'
  }
  if (params.intention && !params.intention.includes(',')) {
    const name = params.intention
      .split('-')
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ')
    return `${name} Collection`
  }
  if (params.crystal && !params.crystal.includes(',')) {
    const name = params.crystal
      .split('-')
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ')
    return name
  }
  return 'All Jewellery'
}

// ─── Metadata ─────────────────────────────────────────────────────────────────

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<RawParams>
}): Promise<Metadata> {
  const params = await searchParams
  const heading = getHeading(params)
  const title = heading === 'All Jewellery' ? 'Shop Intentional Jewellery' : `Shop ${heading}`
  return buildMetadata({
    title,
    description:
      'Browse our full collection of intentional gemstone jewellery. Filter by crystal type, intention, or jewellery type. Free UK shipping over £75.',
  })
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<RawParams>
}) {
  const params = await searchParams
  const { products, hasNextPage, endCursor } = await fetchProducts(params)

  const heading = getHeading(params)
  const hasActiveFilters = Object.entries(params).some(
    ([k, v]) => v && k !== 'sort'
  )

  // Build active filters record for client components
  const activeFilters: Record<string, string> = {}
  for (const [k, v] of Object.entries(params)) {
    if (v) activeFilters[k] = v
  }

  const searchKey = new URLSearchParams(
    Object.entries(params).filter(([, v]) => !!v) as [string, string][]
  ).toString()

  return (
    <>
      <style>{`
        .shop-heading { font-size: 48px; }
        .shop-grid-layout {
          display: grid;
          grid-template-columns: 220px 1fr;
          gap: 48px;
          align-items: start;
          margin-top: 40px;
        }
        @media (max-width: 767px) {
          .shop-heading { font-size: 32px; }
          .shop-grid-layout {
            grid-template-columns: 1fr;
            gap: 24px;
          }
        }
      `}</style>

      {/* Page header */}
      <div
        style={{
          background: 'var(--color-bg)',
          padding: '64px 24px 48px',
          borderBottom: '1px solid var(--color-border)',
        }}
      >
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <p
            style={{
              fontFamily: 'var(--font-sans, "DM Sans", sans-serif)',
              fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.16em',
              color: 'var(--color-gold)', marginBottom: 12, fontWeight: 400,
            }}
          >
            Our Collection
          </p>
          <h1
            className="shop-heading"
            style={{
              fontFamily: "'Times New Roman', Times, serif",
              fontWeight: 400, color: 'var(--color-text)', margin: 0,
            }}
          >
            {heading}
          </h1>
        </div>
      </div>

      {/* Main layout */}
      <div
        style={{
          maxWidth: 1200,
          margin: '0 auto',
          padding: '0 24px 100px',
        }}
      >
        <div className="shop-grid-layout">
          {/* Filter sidebar */}
          <Suspense fallback={null}>
            <ShopFilters />
          </Suspense>

          {/* Product grid */}
          <Suspense fallback={
            <div style={{ padding: 40, textAlign: 'center', color: 'var(--color-muted)', fontFamily: 'var(--font-sans)' }}>
              Loading...
            </div>
          }>
            <ShopGrid
              products={products}
              totalCount={products.length}
              hasNextPage={hasNextPage}
              endCursor={endCursor}
              activeFilters={activeFilters}
              searchKey={searchKey}
            />
          </Suspense>
        </div>
      </div>
    </>
  )
}
