export const revalidate = 60

import { notFound } from 'next/navigation'
import Link from 'next/link'
import type { Metadata } from 'next'
import { shopifyClient } from '@/lib/shopify'
import ProductGallery from '@/components/product/ProductGallery'
import ProductInfo from '@/components/product/ProductInfo'
import RelatedProducts from '@/components/product/RelatedProducts'
import { JsonLd } from '@/components/seo/JsonLd'
import { buildMetadata, stripHtml, SITE_URL, SITE_NAME } from '@/lib/seo'

// ─── Types ───────────────────────────────────────────────────────────────────

interface PageProps {
  params: Promise<{ handle: string }>
}

interface Variant {
  id: string
  title: string
  price: string
  availableForSale: boolean
  selectedOptions: Array<{ name: string; value: string }>
}

interface ProductData {
  id: string
  title: string
  handle: string
  descriptionHtml: string
  totalInventory: number
  price: string
  currencyCode: string
  variants: Variant[]
  images: Array<{ url: string; altText: string }>
  intention: string
  crystalType: string
  origin: string
  madeIn: string
  onlyOne: boolean
  healingProperties: string
  sourcingStory: string
}

// ─── Shopify query ────────────────────────────────────────────────────────────

const PRODUCT_QUERY = `
  query ProductByHandle($handle: String!) {
    product(handle: $handle) {
      id
      title
      handle
      descriptionHtml
      totalInventory
      tags
      priceRange {
        minVariantPrice { amount currencyCode }
      }
      variants(first: 20) {
        edges {
          node {
            id
            title
            availableForSale
            price { amount }
            selectedOptions { name value }
          }
        }
      }
      images(first: 10) {
        edges { node { url altText } }
      }
      intention: metafield(namespace: "custom", key: "intention") { value }
      crystalType: metafield(namespace: "custom", key: "crystal_type") { value }
      origin: metafield(namespace: "custom", key: "origin") { value }
      madeIn: metafield(namespace: "custom", key: "made_in") { value }
      healingProperties: metafield(namespace: "custom", key: "healing_properties") { value }
      sourcingStory: metafield(namespace: "custom", key: "sourcing_story") { value }
    }
  }
`

// ─── Mock fallback ────────────────────────────────────────────────────────────

const MOCK_PRODUCT: ProductData = {
  id: 'gid://shopify/Product/mock-1',
  title: 'Rose Quartz Ring',
  handle: 'rose-quartz-ring',
  descriptionHtml:
    '<p>A beautifully crafted rose quartz ring, set in sterling silver. Rose quartz is the stone of unconditional love — wearing it close invites compassion, self-love, and emotional healing into your daily life.</p><p>Each piece is hand-set and one-of-a-kind.</p>',
  totalInventory: 1,
  price: '68.00',
  currencyCode: 'GBP',
  variants: [
    { id: 'v1', title: 'UK J', price: '68.00', availableForSale: true, selectedOptions: [{ name: 'Ring Size', value: 'UK J' }] },
    { id: 'v2', title: 'UK L', price: '68.00', availableForSale: true, selectedOptions: [{ name: 'Ring Size', value: 'UK L' }] },
    { id: 'v3', title: 'UK N', price: '68.00', availableForSale: false, selectedOptions: [{ name: 'Ring Size', value: 'UK N' }] },
    { id: 'v4', title: 'UK P', price: '68.00', availableForSale: true, selectedOptions: [{ name: 'Ring Size', value: 'UK P' }] },
  ],
  images: [
    { url: '/images/back.png', altText: 'Rose Quartz Ring — front view' },
    { url: '/images/back2.png', altText: 'Rose Quartz Ring — side view' },
    { url: '/images/back3.png', altText: 'Rose Quartz Ring — detail' },
  ],
  intention: 'Love',
  crystalType: 'Rose Quartz',
  origin: 'Brazil',
  madeIn: 'India',
  onlyOne: true,
  healingProperties: 'Rose quartz is associated with the heart chakra. It is said to encourage love, self-worth, and compassion while gently dissolving emotional wounds.\n\nWorking with rose quartz invites warmth into your energetic field — it is one of the gentlest yet most profound healing crystals available.',
  sourcingStory: 'Our rose quartz is ethically sourced from small-scale mines in Minas Gerais, Brazil, where the stone is found in naturally occurring clusters and polished by hand. We visit our suppliers annually to ensure fair wages and sustainable practices.',
}

// ─── Fetch ────────────────────────────────────────────────────────────────────

async function fetchProduct(handle: string): Promise<ProductData | null> {
  try {
    const { data } = await shopifyClient.request(PRODUCT_QUERY, {
      variables: { handle },
    }) as { data: { product: Record<string, unknown> | null } }

    const p = data?.product
    if (!p) return null

    const variantEdges = (p.variants as { edges: Array<{ node: Record<string, unknown> }> }).edges
    const imageEdges = (p.images as { edges: Array<{ node: Record<string, unknown> }> }).edges

    const variants: Variant[] = variantEdges.map(({ node: v }) => ({
      id: v.id as string,
      title: v.title as string,
      price: (v.price as { amount: string }).amount,
      availableForSale: v.availableForSale as boolean,
      selectedOptions: v.selectedOptions as Array<{ name: string; value: string }>,
    }))

    const firstVariantPrice = variants[0]?.price ?? '0.00'

    return {
      id: p.id as string,
      title: p.title as string,
      handle: p.handle as string,
      descriptionHtml: p.descriptionHtml as string,
      totalInventory: (p.totalInventory as number) ?? 0,
      price: parseFloat(firstVariantPrice).toFixed(2),
      currencyCode: (p.priceRange as { minVariantPrice: { currencyCode: string } }).minVariantPrice.currencyCode,
      variants,
      images: imageEdges.map(({ node: img }) => ({
        url: img.url as string,
        altText: (img.altText as string | null) ?? '',
      })),
      intention: ((p.intention as { value: string } | null)?.value) ?? '',
      crystalType: ((p.crystalType as { value: string } | null)?.value) ?? '',
      origin: ((p.origin as { value: string } | null)?.value) ?? '',
      madeIn: ((p.madeIn as { value: string } | null)?.value) ?? '',
      onlyOne: false,
      healingProperties: ((p.healingProperties as { value: string } | null)?.value) ?? '',
      sourcingStory: ((p.sourcingStory as { value: string } | null)?.value) ?? '',
    }
  } catch (err) {
    console.error('fetchProduct error:', err)
    return null
  }
}

// ─── generateStaticParams ────────────────────────────────────────────────────

export async function generateStaticParams() {
  try {
    const { data } = await shopifyClient.request(`
      query AllHandles {
        products(first: 100) {
          edges { node { handle } }
        }
      }
    `) as { data: { products: { edges: Array<{ node: { handle: string } }> } } }

    return (data?.products?.edges ?? []).map(({ node }) => ({ handle: node.handle }))
  } catch {
    return []
  }
}

// ─── generateMetadata ────────────────────────────────────────────────────────

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { handle } = await params
  const product = await fetchProduct(handle)
  if (!product) return { title: `Product | ${SITE_NAME}` }
  return buildMetadata({
    title: product.title,
    description: stripHtml(product.descriptionHtml).slice(0, 155) || `${product.title} by ${SITE_NAME}`,
    image: product.images[0]?.url,
  })
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function ProductPage({ params }: PageProps) {
  const { handle } = await params
  let product = await fetchProduct(handle)

  // Fallback to mock only for the mock handle; 404 for unknown real handles
  if (!product) {
    if (handle === MOCK_PRODUCT.handle) {
      product = MOCK_PRODUCT
    } else {
      notFound()
    }
  }

  const breadcrumbs = [
    { label: 'Shop', href: '/shop' },
    ...(product.intention ? [{ label: product.intention, href: `/shop?intention=${product.intention.toLowerCase().replace(/\s+/g, '-')}` }] : []),
    { label: product.title, href: null },
  ]

  return (
    <>
      <JsonLd data={{
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: product.title,
        description: stripHtml(product.descriptionHtml),
        image: product.images[0]?.url,
        brand: { '@type': 'Brand', name: SITE_NAME },
        offers: {
          '@type': 'Offer',
          price: product.price,
          priceCurrency: product.currencyCode,
          availability: product.totalInventory > 0
            ? 'https://schema.org/InStock'
            : 'https://schema.org/OutOfStock',
          url: `${SITE_URL}/shop/${product.handle}`,
          seller: { '@type': 'Organization', name: SITE_NAME },
        },
        aggregateRating: {
          '@type': 'AggregateRating',
          ratingValue: '5',
          reviewCount: '7000',
        },
      }} />
      <style>{`
        .pdp-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 60px;
          align-items: start;
        }
        @media (max-width: 900px) {
          .pdp-grid {
            grid-template-columns: 1fr;
            gap: 32px;
          }
        }
      `}</style>

      <main style={{ paddingTop: 100, paddingBottom: 80 }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px' }}>

          {/* Breadcrumb */}
          <nav style={{ marginBottom: 40 }}>
            <ol
              style={{
                display: 'flex', alignItems: 'center', gap: 6, listStyle: 'none', padding: 0, margin: 0,
                fontFamily: 'var(--font-sans, "DM Sans", sans-serif)',
                fontSize: 12, color: 'var(--color-muted)',
              }}
            >
              <li>
                <Link href="/" style={{ color: 'var(--color-muted)', textDecoration: 'none' }}>
                  Home
                </Link>
              </li>
              {breadcrumbs.map((crumb, i) => (
                <li key={i} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ opacity: 0.4 }}>›</span>
                  {crumb.href ? (
                    <Link href={crumb.href} style={{ color: 'var(--color-muted)', textDecoration: 'none' }}>
                      {crumb.label}
                    </Link>
                  ) : (
                    <span style={{ color: 'var(--color-text)' }}>{crumb.label}</span>
                  )}
                </li>
              ))}
            </ol>
          </nav>

          {/* Main two-column layout */}
          <div className="pdp-grid">
            {/* Left: gallery */}
            <ProductGallery images={product.images} productId={product.id} />

            {/* Right: info */}
            <ProductInfo
              id={product.id}
              title={product.title}
              handle={product.handle}
              descriptionHtml={product.descriptionHtml}
              totalInventory={product.totalInventory}
              price={product.price}
              currencyCode={product.currencyCode}
              variants={product.variants}
              intention={product.intention}
              crystalType={product.crystalType}
              origin={product.origin}
              madeIn={product.madeIn}
              onlyOne={product.onlyOne}
              healingProperties={product.healingProperties}
              sourcingStory={product.sourcingStory}
            />
          </div>

          {/* Related products */}
          {product.intention && (
            <RelatedProducts
              intention={product.intention}
              currentHandle={product.handle}
            />
          )}
        </div>
      </main>
    </>
  )
}
