'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import ProductCard, { type ProductCardProps } from './ProductCard'
import ActiveFilters from './ActiveFilters'

interface ShopGridProps {
  products: ProductCardProps[]
  totalCount: number
  hasNextPage: boolean
  endCursor: string
  activeFilters: Record<string, string>
  searchKey: string
}

const SORT_OPTIONS = [
  { label: 'Newest',             value: 'newest' },
  { label: 'Price: Low to High', value: 'price-asc' },
  { label: 'Price: High to Low', value: 'price-desc' },
  { label: 'Bestselling',        value: 'bestselling' },
]

export default function ShopGrid({
  products,
  totalCount,
  hasNextPage,
  endCursor,
  activeFilters,
  searchKey,
}: ShopGridProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const [allProducts, setAllProducts] = useState(products)
  const [cursor, setCursor] = useState(endCursor)
  const [hasMore, setHasMore] = useState(hasNextPage)
  const [loadingMore, setLoadingMore] = useState(false)
  const [loadMoreError, setLoadMoreError] = useState(false)

  // Reset when server re-fetches (URL/filters changed)
  useEffect(() => {
    setAllProducts(products)
    setCursor(endCursor)
    setHasMore(hasNextPage)
    setLoadMoreError(false)
  }, [searchKey]) // eslint-disable-line react-hooks/exhaustive-deps

  const currentSort = searchParams.get('sort') ?? 'newest'
  const hasActiveFilters = Object.values(activeFilters).some((v) => v)

  function handleSortChange(sort: string) {
    const params = new URLSearchParams(searchParams.toString())
    if (sort && sort !== 'newest') params.set('sort', sort)
    else params.delete('sort')
    router.push(`${pathname}?${params.toString()}`)
  }

  async function loadMore() {
    setLoadingMore(true)
    setLoadMoreError(false)
    try {
      const res = await fetch('/api/shop-products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cursor, filters: activeFilters }),
      })
      if (!res.ok) throw new Error('Failed')
      const data = await res.json()
      setAllProducts((prev) => [...prev, ...data.products])
      setCursor(data.endCursor)
      setHasMore(data.hasNextPage)
    } catch {
      setLoadMoreError(true)
    } finally {
      setLoadingMore(false)
    }
  }

  return (
    <>
      <style>{`
        .sg-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 20px;
        }
        .sg-load-btn {
          border: 1px solid var(--color-border);
          background: var(--color-white);
          color: var(--color-text);
          font-family: var(--font-sans, 'DM Sans', sans-serif);
          font-size: 12px; text-transform: uppercase; letter-spacing: 0.1em;
          font-weight: 400; padding: 14px 48px; border-radius: 0;
          cursor: pointer; transition: border-color 0.25s ease, color 0.25s ease;
        }
        .sg-load-btn:hover:not(:disabled) {
          border-color: var(--color-gold);
          color: var(--color-gold);
        }
        .sg-load-btn:disabled { opacity: 0.6; cursor: not-allowed; }
        @keyframes sgSpin {
          to { transform: rotate(360deg); }
        }
        .sg-spinner {
          width: 18px; height: 18px;
          border: 2px solid var(--color-border);
          border-top-color: var(--color-gold);
          border-radius: 50%;
          animation: sgSpin 0.7s linear infinite;
          display: inline-block;
        }
        @media (max-width: 640px) {
          .sg-grid { grid-template-columns: repeat(2, 1fr); }
        }
      `}</style>

      <div>
        {/* Results bar */}
        <div
          style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            marginBottom: 24, paddingBottom: 20,
            borderBottom: '1px solid var(--color-border)',
          }}
        >
          <p
            style={{
              fontFamily: 'var(--font-sans, "DM Sans", sans-serif)',
              fontSize: 13, color: 'var(--color-muted)', margin: 0,
            }}
          >
            {hasActiveFilters
              ? `Showing ${allProducts.length} result${allProducts.length !== 1 ? 's' : ''}`
              : `${totalCount} product${totalCount !== 1 ? 's' : ''}`}
          </p>

          <select
            value={currentSort}
            onChange={(e) => handleSortChange(e.target.value)}
            style={{
              border: '1px solid var(--color-border)',
              borderRadius: 0,
              background: 'var(--color-white)',
              fontFamily: 'var(--font-sans, "DM Sans", sans-serif)',
              fontSize: 12, color: 'var(--color-text)',
              padding: '8px 12px',
              cursor: 'pointer',
              outline: 'none',
            }}
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>

        {/* Active filter pills */}
        <ActiveFilters activeFilters={activeFilters} />

        {/* Grid or empty state */}
        {allProducts.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 24px' }}>
            <p
              style={{
                fontFamily: "'Times New Roman', Times, serif",
                fontWeight: 400, fontSize: 24, color: 'var(--color-text)',
                marginBottom: 12,
              }}
            >
              No pieces found
            </p>
            <p
              style={{
                fontFamily: 'var(--font-sans, "DM Sans", sans-serif)',
                fontSize: 14, fontWeight: 300, color: 'var(--color-muted)',
                marginBottom: 24,
              }}
            >
              Try adjusting your filters or browse our full collection.
            </p>
            <Link
              href="/shop"
              style={{
                fontFamily: 'var(--font-sans, "DM Sans", sans-serif)',
                fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.1em',
                color: 'var(--color-text)', textDecoration: 'none',
                border: '1px solid var(--color-border)',
                padding: '12px 36px', display: 'inline-block',
              }}
            >
              View all jewellery
            </Link>
          </div>
        ) : (
          <div className="sg-grid">
            {allProducts.map((product) => (
              <ProductCard key={product.id} {...product} />
            ))}
          </div>
        )}

        {/* Load more */}
        {hasMore && (
          <div style={{ marginTop: 48, textAlign: 'center' }}>
            {loadMoreError ? (
              <p
                style={{
                  fontFamily: 'var(--font-sans, "DM Sans", sans-serif)',
                  fontSize: 13, color: 'var(--color-muted)',
                }}
              >
                Unable to load more. Please try again.
              </p>
            ) : (
              <button
                className="sg-load-btn"
                onClick={loadMore}
                disabled={loadingMore}
              >
                {loadingMore ? <span className="sg-spinner" /> : 'Load 12 more'}
              </button>
            )}
          </div>
        )}
      </div>
    </>
  )
}
