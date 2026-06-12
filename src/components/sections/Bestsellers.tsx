'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Heart } from 'lucide-react'

type Product = {
  id: string
  title: string
  handle: string
  price: string
  intention: string
  totalInventory: number
  image: string
}

const MOCK_PRODUCTS: Product[] = [
  {
    id: '1',
    title: 'Rose Quartz Ring',
    handle: 'rose-quartz-ring',
    price: '£68.00',
    intention: 'Love',
    totalInventory: 1,
    image: '/images/back.png',
  },
  {
    id: '2',
    title: 'Amethyst Pendant Necklace',
    handle: 'amethyst-pendant-necklace',
    price: '£120.00',
    intention: 'Anxiety Relief',
    totalInventory: 3,
    image: '/images/back2.png',
  },
  {
    id: '3',
    title: 'Moonstone Bracelet',
    handle: 'moonstone-bracelet',
    price: '£95.00',
    intention: 'Clarity',
    totalInventory: 1,
    image: '/images/back3.png',
  },
  {
    id: '4',
    title: 'Labradorite Drop Earrings',
    handle: 'labradorite-drop-earrings',
    price: '£84.00',
    intention: 'Protection',
    totalInventory: 2,
    image: '/images/back4.png',
  },
]

const WISHLIST_KEY = 'chandi-wishlist'

function ProductCard({ product }: { product: Product }) {
  const [wishlisted, setWishlisted] = useState(false)

  useEffect(() => {
    try {
      const raw = localStorage.getItem(WISHLIST_KEY)
      const ids: string[] = raw ? JSON.parse(raw) : []
      setWishlisted(ids.includes(product.id))
    } catch {
      // ignore malformed storage
    }
  }, [product.id])

  function toggleWishlist(e: React.MouseEvent) {
    e.preventDefault()
    e.stopPropagation()
    try {
      const raw = localStorage.getItem(WISHLIST_KEY)
      const ids: string[] = raw ? JSON.parse(raw) : []
      const next = wishlisted
        ? ids.filter((id) => id !== product.id)
        : [...ids, product.id]
      localStorage.setItem(WISHLIST_KEY, JSON.stringify(next))
      setWishlisted(!wishlisted)
    } catch {
      // ignore storage errors
    }
  }

  return (
    <div className="bs-card" style={{ position: 'relative' }}>
      <Link
        href={`/shop/${product.handle}`}
        style={{ textDecoration: 'none', display: 'block' }}
      >
        <div
          style={{
            background: 'var(--color-white)',
            border: '1px solid var(--color-border)',
            borderRadius: 0,
            overflow: 'hidden',
          }}
        >
          {/* Image container */}
          <div style={{ aspectRatio: '1 / 1', position: 'relative', overflow: 'hidden' }}>
            <div className="bs-card-img-wrap" style={{ position: 'absolute', inset: 0 }}>
              <Image
                src={product.image}
                alt={product.title}
                fill
                sizes="(max-width: 768px) 50vw, 25vw"
                style={{ objectFit: 'cover' }}
              />
            </div>

            {/* Only 1 left badge */}
            {product.totalInventory === 1 && (
              <div
                style={{
                  position: 'absolute',
                  top: 12,
                  left: 12,
                  zIndex: 10,
                  background: 'var(--color-gold)',
                  color: 'var(--color-white)',
                  fontFamily: 'var(--font-sans, "DM Sans", sans-serif)',
                  fontSize: 9,
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                  fontWeight: 500,
                  padding: '5px 10px',
                }}
              >
                Only 1 Left
              </div>
            )}

            {/* Wishlist button */}
            <button
              onClick={toggleWishlist}
              aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
              style={{
                position: 'absolute',
                top: 10,
                right: 10,
                zIndex: 10,
                width: 34,
                height: 34,
                background: 'rgba(255,255,255,0.92)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: 'none',
                cursor: 'pointer',
                boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                transition: 'transform 0.2s ease',
              }}
              className="bs-wishlist-btn"
            >
              <Heart
                size={15}
                strokeWidth={1.5}
                stroke={wishlisted ? 'var(--color-gold)' : 'var(--color-muted)'}
                fill={wishlisted ? 'var(--color-gold)' : 'transparent'}
                style={{ transition: 'all 0.2s ease' }}
              />
            </button>

            {/* Add to cart */}
            <button
              className="bs-card-cta"
              onClick={(e) => {
                e.preventDefault()
                console.log('add:', product.id)
              }}
              style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                zIndex: 10,
                background: 'var(--color-gold)',
                color: 'var(--color-white)',
                fontFamily: 'var(--font-sans, "DM Sans", sans-serif)',
                fontSize: 10,
                textTransform: 'uppercase',
                letterSpacing: '0.12em',
                fontWeight: 500,
                padding: 13,
                textAlign: 'center',
                border: 'none',
                cursor: 'pointer',
                width: '100%',
              }}
            >
              Add to Cart
            </button>
          </div>

          {/* Text area */}
          <div style={{ padding: '18px 16px' }}>
            {/* Intention pill */}
            <span
              style={{
                display: 'inline-block',
                background: 'var(--color-lavender)',
                color: 'var(--color-text)',
                fontFamily: 'var(--font-sans, "DM Sans", sans-serif)',
                fontSize: 9,
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                fontWeight: 400,
                padding: '4px 12px',
                marginBottom: 12,
              }}
            >
              {product.intention}
            </span>

            {/* Title */}
            <p
              style={{
                fontFamily: "'Times New Roman', Times, serif",
                fontWeight: 400,
                fontSize: 18,
                color: 'var(--color-text)',
                lineHeight: 1.3,
                marginBottom: 10,
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
              } as React.CSSProperties}
            >
              {product.title}
            </p>

            {/* Price row */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span
                style={{
                  fontFamily: 'var(--font-sans, "DM Sans", sans-serif)',
                  fontSize: 16,
                  fontWeight: 500,
                  color: 'var(--color-gold)',
                }}
              >
                {product.price}
              </span>
              <span
                style={{
                  fontFamily: 'var(--font-sans, "DM Sans", sans-serif)',
                  fontSize: 10,
                  color: 'var(--color-muted)',
                  fontWeight: 300,
                }}
              >
                or Klarna
              </span>
            </div>
          </div>
        </div>
      </Link>
    </div>
  )
}

export default function Bestsellers() {
  return (
    <>
      <style>{`
        .bs-section  { padding: 100px 24px; }
        .bs-heading  { font-size: 48px; }
        .bs-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 24px;
        }
        .bs-card > a > div {
          transition: box-shadow 0.4s ease;
        }
        .bs-card:hover > a > div {
          box-shadow: 0 12px 40px rgba(44,44,44,0.09);
        }
        .bs-card-img-wrap {
          transition: transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }
        .bs-card:hover .bs-card-img-wrap { transform: scale(1.05); }
        .bs-card-cta {
          transform: translateY(100%);
          transition: transform 0.35s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }
        .bs-card:hover .bs-card-cta { transform: translateY(0); }
        .bs-wishlist-btn:hover { transform: scale(1.1); }
        .bs-view-all {
          display: inline-block;
          border: 1px solid var(--color-text);
          color: var(--color-text);
          font-family: var(--font-sans, 'DM Sans', sans-serif);
          font-size: 12px;
          text-transform: uppercase;
          letter-spacing: 0.12em;
          font-weight: 400;
          padding: 14px 48px;
          border-radius: 0;
          text-decoration: none;
          transition: all 0.3s ease;
        }
        .bs-view-all:hover {
          background: var(--color-text);
          color: var(--color-white);
        }
        @media (max-width: 768px) {
          .bs-section { padding: 64px 24px; }
          .bs-heading  { font-size: 32px; }
          .bs-grid { grid-template-columns: repeat(2, 1fr); gap: 16px; }
        }
      `}</style>

      <section className="bs-section" style={{ background: 'var(--color-bg)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>

          <h2
            className="bs-heading"
            style={{
              fontFamily: "'Times New Roman', Times, serif",
              fontWeight: 400,
              textAlign: 'center',
              color: 'var(--color-text)',
              margin: '0 0 8px',
            }}
          >
            Our Bestsellers
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
            The pieces our community loves most
          </p>

          <div className="bs-grid">
            {MOCK_PRODUCTS.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          <div style={{ marginTop: 52, textAlign: 'center' }}>
            <Link href="/shop" className="bs-view-all">
              View All Jewellery
            </Link>
          </div>

        </div>
      </section>
    </>
  )
}
