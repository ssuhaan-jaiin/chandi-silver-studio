'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import WishlistButton from '@/components/product/WishlistButton'
import { useCartContext } from '@/context/CartContext'

export interface ProductCardProps {
  id: string
  title: string
  handle: string
  price: string
  currencyCode: string
  intention?: string
  totalInventory: number
  imageUrl: string
  imageAlt?: string
  variantId?: string
}

export default function ProductCard({
  id,
  title,
  handle,
  price,
  currencyCode,
  intention,
  totalInventory,
  imageUrl,
  imageAlt,
  variantId,
}: ProductCardProps) {
  const { addToCart, isLoading } = useCartContext()
  const [adding, setAdding] = useState(false)

  async function handleAddToCart(e: React.MouseEvent) {
    e.preventDefault()
    setAdding(true)
    await addToCart(variantId ?? id, 1)
    setAdding(false)
  }

  const displayPrice =
    currencyCode === 'GBP' ? `£${price}`
    : currencyCode === 'USD' ? `$${price}`
    : `${currencyCode} ${price}`

  return (
    <>
      <style>{`
        .pc-card-img-wrap { transition: transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94); }
        .pc-card:hover .pc-card-img-wrap { transform: scale(1.05); }
        .pc-card > a > div { transition: box-shadow 0.4s ease; }
        .pc-card:hover > a > div { box-shadow: 0 12px 40px rgba(44,44,44,0.09); }
        .pc-card-cta {
          transform: translateY(100%);
          transition: transform 0.35s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }
        .pc-card:hover .pc-card-cta { transform: translateY(0); }
      `}</style>

      <div className="pc-card" style={{ position: 'relative' }}>
        <Link href={`/shop/${handle}`} style={{ textDecoration: 'none', display: 'block' }}>
          <div
            style={{
              background: 'var(--color-white)',
              border: '1px solid var(--color-border)',
              borderRadius: 0, overflow: 'hidden',
            }}
          >
            <div style={{ aspectRatio: '1 / 1', position: 'relative', overflow: 'hidden' }}>
              <div className="pc-card-img-wrap" style={{ position: 'absolute', inset: 0 }}>
                <Image
                  src={imageUrl}
                  alt={imageAlt ?? title}
                  fill
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  style={{ objectFit: 'cover' }}
                />
              </div>

              {totalInventory === 1 && (
                <div
                  style={{
                    position: 'absolute', top: 12, left: 12, zIndex: 10,
                    background: 'var(--color-gold)', color: 'var(--color-white)',
                    fontFamily: 'var(--font-sans, "DM Sans", sans-serif)',
                    fontSize: 9, textTransform: 'uppercase', letterSpacing: '0.1em',
                    fontWeight: 500, padding: '5px 10px',
                  }}
                >
                  Only 1 Left
                </div>
              )}

              <div style={{ position: 'absolute', top: 10, right: 10, zIndex: 10 }}>
                <WishlistButton id={id} variant="icon" />
              </div>

              <button
                className="pc-card-cta"
                onClick={handleAddToCart}
                disabled={adding || isLoading}
                style={{
                  position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 10,
                  background: adding ? 'var(--color-gold-dark)' : 'var(--color-gold)',
                  color: 'var(--color-white)',
                  fontFamily: 'var(--font-sans, "DM Sans", sans-serif)',
                  fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.12em',
                  fontWeight: 500, padding: 13, textAlign: 'center',
                  border: 'none', cursor: adding ? 'not-allowed' : 'pointer', width: '100%',
                }}
              >
                {adding ? 'Adding…' : 'Add to Cart'}
              </button>
            </div>

            <div style={{ padding: '18px 16px' }}>
              {intention && (
                <span
                  style={{
                    display: 'inline-block',
                    background: 'var(--color-lavender)', color: 'var(--color-text)',
                    fontFamily: 'var(--font-sans, "DM Sans", sans-serif)',
                    fontSize: 9, textTransform: 'uppercase', letterSpacing: '0.1em',
                    fontWeight: 400, padding: '4px 12px', marginBottom: 12,
                  }}
                >
                  {intention}
                </span>
              )}

              <p
                style={{
                  fontFamily: "'Times New Roman', Times, serif",
                  fontWeight: 400, fontSize: 18, color: 'var(--color-text)',
                  lineHeight: 1.3, marginBottom: 10,
                  display: '-webkit-box', WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical', overflow: 'hidden',
                } as React.CSSProperties}
              >
                {title}
              </p>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span
                  style={{
                    fontFamily: 'var(--font-sans, "DM Sans", sans-serif)',
                    fontSize: 16, fontWeight: 500, color: 'var(--color-gold-dark)',
                  }}
                >
                  {displayPrice}
                </span>
                <span
                  style={{
                    fontFamily: 'var(--font-sans, "DM Sans", sans-serif)',
                    fontSize: 10, color: 'var(--color-muted)', fontWeight: 300,
                  }}
                >
                  or Klarna
                </span>
              </div>
            </div>
          </div>
        </Link>
      </div>
    </>
  )
}
