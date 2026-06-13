import { shopifyClient } from '@/lib/shopify'
import ProductCard from '@/components/shop/ProductCard'

interface RelatedProductsProps {
  intention: string
  currentHandle: string
}

interface ShopifyProduct {
  id: string
  title: string
  handle: string
  totalInventory: number
  priceRange: { minVariantPrice: { amount: string; currencyCode: string } }
  images: { edges: Array<{ node: { url: string; altText: string | null } }> }
  tags: string[]
}

const RELATED_QUERY = `
  query RelatedProducts($query: String!) {
    products(first: 5, query: $query) {
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
          tags
        }
      }
    }
  }
`

async function fetchRelated(intention: string, currentHandle: string) {
  try {
    const { data } = await shopifyClient.request(RELATED_QUERY, {
      variables: { query: `tag:intention-${intention.toLowerCase().replace(/\s+/g, '-')}` },
    }) as { data: { products: { edges: Array<{ node: ShopifyProduct }> } } }

    const edges = data?.products?.edges ?? []
    return edges
      .map(({ node: p }) => ({
        id: p.id,
        title: p.title,
        handle: p.handle,
        price: parseFloat(p.priceRange.minVariantPrice.amount).toFixed(2),
        currencyCode: p.priceRange.minVariantPrice.currencyCode,
        totalInventory: p.totalInventory ?? 0,
        imageUrl: p.images.edges[0]?.node.url ?? '/images/back.png',
        imageAlt: p.images.edges[0]?.node.altText ?? undefined,
        intention: p.tags.find((t) => t.startsWith('intention-'))?.replace('intention-', '').replace(/-/g, ' ') ?? undefined,
      }))
      .filter((p) => p.handle !== currentHandle)
      .slice(0, 4)
  } catch {
    return []
  }
}

export default async function RelatedProducts({ intention, currentHandle }: RelatedProductsProps) {
  const products = await fetchRelated(intention, currentHandle)
  if (products.length === 0) return null

  return (
    <section style={{ marginTop: 80, paddingTop: 60, borderTop: '1px solid var(--color-border)' }}>
      <h2
        style={{
          fontFamily: "'Times New Roman', Times, serif",
          fontWeight: 400, fontSize: 30, color: 'var(--color-text)',
          textAlign: 'center', marginBottom: 8,
        }}
      >
        You may also love
      </h2>
      <p
        style={{
          fontFamily: 'var(--font-sans, "DM Sans", sans-serif)',
          fontSize: 13, fontWeight: 300, color: 'var(--color-muted)',
          textAlign: 'center', marginBottom: 40,
        }}
      >
        More pieces curated for {intention}
      </p>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: 20,
        }}
      >
        {products.map((p) => (
          <ProductCard key={p.id} {...p} />
        ))}
      </div>
      <style>{`
        @media (max-width: 900px) {
          .related-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
      `}</style>
    </section>
  )
}
