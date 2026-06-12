export const revalidate = 300

import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { shopifyClient } from '@/lib/shopify'

type Collection = {
  id: string
  title: string
  handle: string
  count: number
  image: string | null
}

const MOCK_COLLECTIONS: Collection[] = [
  { id: 'm1', title: 'Rings',     handle: 'rings',     count: 0, image: '/images/back.png'  },
  { id: 'm2', title: 'Necklaces', handle: 'necklaces', count: 0, image: '/images/back2.png' },
  { id: 'm3', title: 'Bracelets', handle: 'bracelets', count: 0, image: '/images/back3.png' },
  { id: 'm4', title: 'Earrings',  handle: 'earrings',  count: 0, image: '/images/back4.png' },
]

const QUERY = `{
  collections(first: 4, query: "handle:rings OR handle:necklaces OR handle:bracelets OR handle:earrings") {
    edges {
      node {
        id
        title
        handle
        productsCount { count }
        image { url altText width height }
      }
    }
  }
}`

async function fetchCollections(): Promise<Collection[]> {
  try {
    const response = await shopifyClient.request(QUERY)
    const data = response.data as any
    if (!data?.collections?.edges?.length) return MOCK_COLLECTIONS
    return data.collections.edges.map(({ node }: any) => ({
      id: node.id,
      title: node.title,
      handle: node.handle,
      count: node.productsCount?.count ?? 0,
      image: node.image?.url ?? null,
    }))
  } catch {
    return MOCK_COLLECTIONS
  }
}

export default async function FeaturedCollections() {
  const collections = await fetchCollections()

  return (
    <>
      <style>{`
        .fc-section  { padding: 100px 24px; }
        .fc-heading  { font-size: 48px; }
        .fc-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 3px;
        }
        .fc-card-img-wrap {
          position: absolute; inset: 0;
          transition: transform 0.7s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }
        .fc-card:hover .fc-card-img-wrap { transform: scale(1.06); }
        .fc-card-overlay {
          position: absolute; inset: 0;
          background: linear-gradient(160deg, transparent 30%, rgba(26,20,10,0.65) 100%);
          opacity: 0.8;
          transition: opacity 0.4s ease;
        }
        .fc-card:hover .fc-card-overlay { opacity: 1; }
        .fc-card-shop-now {
          opacity: 0;
          transform: translateX(-6px);
          transition: all 0.35s ease 0.05s;
        }
        .fc-card:hover .fc-card-shop-now { opacity: 1; transform: translateX(0); }
        @media (max-width: 640px) {
          .fc-section { padding: 64px 24px; }
          .fc-heading  { font-size: 32px; }
          .fc-grid { grid-template-columns: 1fr; }
        }
      `}</style>

      <section className="fc-section" style={{ background: 'var(--color-bg)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>

          <h2
            className="fc-heading"
            style={{
              fontFamily: "'Times New Roman', Times, serif",
              fontWeight: 400,
              textAlign: 'center',
              color: 'var(--color-text)',
              margin: '0 0 8px',
            }}
          >
            Explore Our Collections
          </h2>
          <p
            style={{
              fontFamily: 'var(--font-sans, "DM Sans", sans-serif)',
              fontSize: 14,
              fontWeight: 300,
              color: 'var(--color-muted)',
              textAlign: 'center',
              margin: '0 0 56px',
            }}
          >
            Handcrafted pieces for every occasion
          </p>

          <div className="fc-grid">
            {collections.map((col) => (
              <Link
                key={col.id}
                href={`/shop/${col.handle}`}
                className="fc-card"
                style={{
                  position: 'relative',
                  overflow: 'hidden',
                  aspectRatio: '1 / 1',
                  display: 'block',
                  textDecoration: 'none',
                  background: 'var(--color-blush)',
                }}
              >
                {/* Image */}
                {col.image && (
                  <div className="fc-card-img-wrap">
                    <Image
                      src={col.image}
                      alt={col.title}
                      fill
                      sizes="(max-width: 640px) 100vw, 50vw"
                      style={{ objectFit: 'cover' }}
                    />
                  </div>
                )}

                {/* Gradient overlay */}
                <div className="fc-card-overlay" />

                {/* Top-left gold accent line */}
                <div
                  style={{
                    position: 'absolute',
                    top: 20,
                    left: 20,
                    width: 32,
                    height: 1,
                    background: 'rgba(201,169,110,0.6)',
                    zIndex: 2,
                  }}
                />

                {/* Bottom-left text */}
                <div style={{ position: 'absolute', bottom: 0, left: 0, padding: 32, zIndex: 2 }}>
                  <p
                    style={{
                      fontFamily: "'Times New Roman', Times, serif",
                      fontWeight: 400,
                      fontSize: 30,
                      color: 'var(--color-white)',
                      letterSpacing: '0.01em',
                      margin: '0 0 6px',
                    }}
                  >
                    {col.title}
                  </p>
                  <p
                    style={{
                      fontFamily: 'var(--font-sans, "DM Sans", sans-serif)',
                      fontSize: 12,
                      fontWeight: 300,
                      color: 'rgba(255,255,255,0.6)',
                      margin: 0,
                    }}
                  >
                    {col.count > 0 ? `${col.count} pieces` : 'Explore collection'}
                  </p>
                </div>

                {/* Bottom-right "Shop Now" */}
                <div
                  className="fc-card-shop-now"
                  style={{
                    position: 'absolute',
                    bottom: 32,
                    right: 32,
                    zIndex: 2,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                  }}
                >
                  <span
                    style={{
                      fontFamily: 'var(--font-sans, "DM Sans", sans-serif)',
                      fontSize: 11,
                      textTransform: 'uppercase',
                      letterSpacing: '0.14em',
                      color: 'var(--color-gold)',
                    }}
                  >
                    Shop Now
                  </span>
                  <ArrowRight size={14} color="var(--color-gold)" />
                </div>
              </Link>
            ))}
          </div>

        </div>
      </section>
    </>
  )
}
