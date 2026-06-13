'use client'

import Link from 'next/link'
import Image from 'next/image'
import { X, ShoppingBag, Heart, Trash2, Lock, RefreshCcw, Plane } from 'lucide-react'
import {
  Sheet,
  SheetContent,
} from '@/components/ui/sheet'
import { useCartContext } from '@/context/CartContext'
import type { CartLine } from '@/types/cart'

function formatPrice(amount: string, currencyCode: string): string {
  try {
    return new Intl.NumberFormat('en-GB', { style: 'currency', currency: currencyCode }).format(parseFloat(amount))
  } catch {
    return `£${parseFloat(amount).toFixed(2)}`
  }
}

function addToWishlist(handle: string) {
  try {
    const raw = localStorage.getItem('chandi-wishlist')
    const ids: string[] = raw ? JSON.parse(raw) : []
    if (!ids.includes(handle)) {
      ids.push(handle)
      localStorage.setItem('chandi-wishlist', JSON.stringify(ids))
    }
  } catch { /* ignore */ }
}

const FREE_SHIPPING_THRESHOLD = 75

function CartLineItem({ line }: { line: CartLine }) {
  const { removeFromCart, updateQuantity } = useCartContext()
  const { merchandise, quantity } = line
  const price = formatPrice(merchandise.price.amount, merchandise.price.currencyCode)

  return (
    <div
      style={{
        padding: '20px 24px',
        borderBottom: '1px solid var(--color-border)',
        display: 'flex',
        gap: 16,
      }}
    >
      {/* Image */}
      <div
        style={{
          width: 80, height: 90, flexShrink: 0,
          position: 'relative',
          background: 'var(--color-blush)',
          overflow: 'hidden',
        }}
      >
        {merchandise.product.image?.url ? (
          <Image
            src={merchandise.product.image.url}
            alt={merchandise.product.image.altText || merchandise.product.title}
            fill
            sizes="80px"
            style={{ objectFit: 'cover' }}
          />
        ) : (
          <div style={{ width: '100%', height: '100%', background: 'var(--color-blush)' }} />
        )}
      </div>

      {/* Content */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <p
          style={{
            fontFamily: 'var(--font-sans, "DM Sans", sans-serif)',
            fontSize: 14, fontWeight: 500, color: 'var(--color-text)',
            marginBottom: 4,
            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
          }}
        >
          {merchandise.product.title}
        </p>
        {merchandise.title !== 'Default Title' && (
          <p
            style={{
              fontFamily: 'var(--font-sans, "DM Sans", sans-serif)',
              fontSize: 12, color: 'var(--color-muted)', marginBottom: 10,
            }}
          >
            {merchandise.title}
          </p>
        )}
        <p
          style={{
            fontFamily: 'var(--font-sans, "DM Sans", sans-serif)',
            fontSize: 14, fontWeight: 500, color: 'var(--color-gold)',
          }}
        >
          {price}
        </p>

        {/* Controls */}
        <div
          style={{
            display: 'flex', alignItems: 'center',
            justifyContent: 'space-between', marginTop: 12,
          }}
        >
          {/* Quantity stepper */}
          <div
            style={{
              display: 'flex', alignItems: 'center',
              border: '1px solid var(--color-border)', height: 32,
            }}
          >
            <button
              onClick={() => updateQuantity(line.id, quantity - 1)}
              style={{
                width: 32, height: '100%', border: 'none',
                background: 'transparent', cursor: 'pointer',
                fontFamily: 'var(--font-sans, "DM Sans", sans-serif)',
                fontSize: 16, color: 'var(--color-text)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--color-gold)' }}
              onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--color-text)' }}
            >
              −
            </button>
            <span
              style={{
                width: 40, textAlign: 'center',
                fontFamily: 'var(--font-sans, "DM Sans", sans-serif)',
                fontSize: 13, color: 'var(--color-text)',
              }}
            >
              {quantity}
            </span>
            <button
              onClick={() => updateQuantity(line.id, quantity + 1)}
              style={{
                width: 32, height: '100%', border: 'none',
                background: 'transparent', cursor: 'pointer',
                fontFamily: 'var(--font-sans, "DM Sans", sans-serif)',
                fontSize: 16, color: 'var(--color-text)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--color-gold)' }}
              onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--color-text)' }}
            >
              +
            </button>
          </div>

          {/* Save + Remove */}
          <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            <SaveButton handle={merchandise.product.handle} />
            <button
              onClick={() => removeFromCart(line.id)}
              style={{
                display: 'flex', alignItems: 'center', gap: 4,
                fontFamily: 'var(--font-sans, "DM Sans", sans-serif)',
                fontSize: 11, color: 'var(--color-muted)',
                background: 'none', border: 'none', cursor: 'pointer',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = '#B85C5C'
                e.currentTarget.querySelector('svg')?.setAttribute('stroke', '#B85C5C')
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = 'var(--color-muted)'
                e.currentTarget.querySelector('svg')?.setAttribute('stroke', 'var(--color-muted)')
              }}
            >
              <Trash2 size={14} stroke="var(--color-muted)" strokeWidth={1.5} />
              Remove
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

function SaveButton({ handle }: { handle: string }) {
  const [saved, setSaved] = React.useState(false)

  function handleSave() {
    addToWishlist(handle)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <button
      onClick={handleSave}
      style={{
        display: 'flex', alignItems: 'center', gap: 4,
        fontFamily: 'var(--font-sans, "DM Sans", sans-serif)',
        fontSize: 11, color: saved ? 'var(--color-gold)' : 'var(--color-muted)',
        background: 'none', border: 'none', cursor: 'pointer',
        transition: 'color 0.2s ease',
      }}
      onMouseEnter={(e) => { if (!saved) e.currentTarget.style.color = 'var(--color-gold)' }}
      onMouseLeave={(e) => { if (!saved) e.currentTarget.style.color = 'var(--color-muted)' }}
    >
      <Heart size={14} stroke="currentColor" strokeWidth={1.5} />
      {saved ? 'Saved ✓' : 'Save'}
    </button>
  )
}

// Need React for SaveButton's useState
import React from 'react'

export default function CartDrawer() {
  const { cart, cartCount, cartTotal, checkoutUrl, isOpen, isLoading, closeCart } = useCartContext()

  const subtotal = cart ? parseFloat(cart.cost.subtotalAmount.amount) : 0
  const remaining = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal)
  const progress = Math.min(100, (subtotal / FREE_SHIPPING_THRESHOLD) * 100)
  const freeShipping = remaining === 0

  const klarnaAmount = cart
    ? `£${(subtotal / 3).toFixed(2)}`
    : '£0.00'

  return (
    <>
      <style>{`
        @keyframes cdSpin {
          to { transform: rotate(360deg); }
        }
        .cd-loading-overlay {
          position: absolute; inset: 0; z-index: 20;
          background: rgba(250,247,242,0.6);
          display: flex; align-items: center; justify-content: center;
          pointer-events: all;
        }
        .cd-spinner {
          width: 24px; height: 24px;
          border: 2px solid var(--color-border);
          border-top-color: var(--color-gold);
          border-radius: 50%;
          animation: cdSpin 0.7s linear infinite;
        }
      `}</style>

      <Sheet open={isOpen} onOpenChange={(o) => !o && closeCart()}>
        <SheetContent
          side="right"
          showCloseButton={false}
          style={{ maxWidth: 'min(420px, 100vw)', width: '100%', padding: 0, display: 'flex', flexDirection: 'column', height: '100%' }}
        >
          {/* Header */}
          <div
            style={{
              padding: 24, flexShrink: 0,
              borderBottom: '1px solid var(--color-border)',
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            }}
          >
            <div>
              <span
                style={{
                  fontFamily: "'Times New Roman', Times, serif",
                  fontWeight: 400, fontSize: 22, color: 'var(--color-text)',
                }}
              >
                Your Bag
              </span>
              <span
                style={{
                  fontFamily: 'var(--font-sans, "DM Sans", sans-serif)',
                  fontSize: 12, color: 'var(--color-muted)', marginLeft: 8,
                }}
              >
                {cartCount} {cartCount === 1 ? 'item' : 'items'}
              </span>
            </div>
            <button
              onClick={closeCart}
              style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, color: 'var(--color-text)' }}
              onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--color-gold)' }}
              onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--color-text)' }}
            >
              <X size={20} strokeWidth={1.5} />
            </button>
          </div>

          {/* Items */}
          <div style={{ flex: 1, overflowY: 'auto', position: 'relative' }}>
            {isLoading && (
              <div className="cd-loading-overlay">
                <div className="cd-spinner" />
              </div>
            )}

            {!cart || cart.lines.length === 0 ? (
              /* Empty state */
              <div style={{ textAlign: 'center', padding: '60px 24px' }}>
                <ShoppingBag
                  size={40}
                  stroke="var(--color-muted)"
                  strokeWidth={1.25}
                  style={{ display: 'block', margin: '0 auto 16px' }}
                />
                <p
                  style={{
                    fontFamily: "'Times New Roman', Times, serif",
                    fontWeight: 400, fontSize: 22, color: 'var(--color-muted)', marginBottom: 8,
                  }}
                >
                  Your bag is empty
                </p>
                <p
                  style={{
                    fontFamily: 'var(--font-sans, "DM Sans", sans-serif)',
                    fontSize: 13, color: 'var(--color-muted)', marginBottom: 28,
                  }}
                >
                  Discover our collection
                </p>
                <Link
                  href="/shop"
                  onClick={closeCart}
                  style={{
                    display: 'inline-block',
                    border: '1px solid var(--color-text)',
                    color: 'var(--color-text)', textDecoration: 'none',
                    fontFamily: 'var(--font-sans, "DM Sans", sans-serif)',
                    fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.1em',
                    padding: '12px 32px',
                    transition: 'background 0.25s ease, color 0.25s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'var(--color-text)'
                    e.currentTarget.style.color = 'white'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'transparent'
                    e.currentTarget.style.color = 'var(--color-text)'
                  }}
                >
                  Continue Shopping
                </Link>
              </div>
            ) : (
              cart.lines.map((line) => (
                <CartLineItem key={line.id} line={line} />
              ))
            )}
          </div>

          {/* Footer */}
          {cart && cart.lines.length > 0 && (
            <div
              style={{
                flexShrink: 0, padding: '20px 24px',
                borderTop: '1px solid var(--color-border)',
                background: 'var(--color-bg)',
              }}
            >
              {/* Free shipping progress */}
              <div style={{ marginBottom: 16 }}>
                {freeShipping ? (
                  <p
                    style={{
                      fontFamily: 'var(--font-sans, "DM Sans", sans-serif)',
                      fontSize: 12, color: '#3A6B47',
                    }}
                  >
                    ✓ You qualify for free UK shipping
                  </p>
                ) : (
                  <>
                    <p
                      style={{
                        fontFamily: 'var(--font-sans, "DM Sans", sans-serif)',
                        fontSize: 12, color: 'var(--color-muted)', marginBottom: 6,
                      }}
                    >
                      Spend £{remaining.toFixed(2)} more for free UK shipping
                    </p>
                    <div
                      style={{
                        height: 3, background: 'var(--color-border)',
                        borderRadius: 2, overflow: 'hidden',
                      }}
                    >
                      <div
                        style={{
                          height: '100%', background: 'var(--color-gold)',
                          width: `${progress}%`, transition: 'width 0.3s ease',
                        }}
                      />
                    </div>
                  </>
                )}
              </div>

              {/* Order summary */}
              <div style={{ marginBottom: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                  <span style={{ fontFamily: 'var(--font-sans)', fontSize: 14, color: 'var(--color-text)' }}>Subtotal</span>
                  <span style={{ fontFamily: 'var(--font-sans)', fontSize: 14, color: 'var(--color-text)' }}>{cartTotal}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
                  <span style={{ fontFamily: 'var(--font-sans)', fontSize: 12, color: 'var(--color-muted)' }}>Shipping</span>
                  <span style={{ fontFamily: 'var(--font-sans)', fontSize: 12, color: 'var(--color-muted)' }}>Calculated at checkout</span>
                </div>
                <div style={{ height: 1, background: 'var(--color-border)', margin: '10px 0' }} />
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontFamily: 'var(--font-sans)', fontSize: 15, fontWeight: 500, color: 'var(--color-text)' }}>Estimated Total</span>
                  <span style={{ fontFamily: 'var(--font-sans)', fontSize: 15, fontWeight: 500, color: 'var(--color-text)' }}>{cartTotal}</span>
                </div>
              </div>

              {/* Klarna */}
              <p
                style={{
                  fontFamily: 'var(--font-sans, "DM Sans", sans-serif)',
                  fontSize: 11, color: 'var(--color-muted)',
                  textAlign: 'center', marginBottom: 20,
                }}
              >
                Or 3 interest-free payments of {klarnaAmount}
              </p>

              {/* Checkout button */}
              <button
                onClick={() => { window.location.href = checkoutUrl }}
                disabled={!cart || cart.lines.length === 0 || isLoading}
                style={{
                  width: '100%', height: 52,
                  background: (!cart || cart.lines.length === 0 || isLoading) ? '#D4C9BE' : 'var(--color-gold)',
                  color: 'var(--color-white)',
                  fontFamily: 'var(--font-sans, "DM Sans", sans-serif)',
                  fontSize: 13, textTransform: 'uppercase', letterSpacing: '0.12em', fontWeight: 500,
                  border: 'none', borderRadius: 0,
                  cursor: (!cart || cart.lines.length === 0 || isLoading) ? 'not-allowed' : 'pointer',
                  pointerEvents: (!cart || cart.lines.length === 0 || isLoading) ? 'none' : 'auto',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                  transition: 'background 0.25s ease',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--color-gold-dark)' }}
                onMouseLeave={(e) => { e.currentTarget.style.background = 'var(--color-gold)' }}
              >
                <Lock size={14} stroke="white" strokeWidth={1.5} />
                Secure Checkout
              </button>

              {/* Trust line */}
              <div style={{ display: 'flex', justifyContent: 'center', gap: 16, marginTop: 12 }}>
                {[
                  { Icon: Lock, label: 'SSL Secure' },
                  { Icon: RefreshCcw, label: 'Free Returns' },
                  { Icon: Plane, label: 'Worldwide' },
                ].map(({ Icon, label }) => (
                  <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <Icon size={12} stroke="var(--color-muted)" strokeWidth={1.5} />
                    <span
                      style={{
                        fontFamily: 'var(--font-sans, "DM Sans", sans-serif)',
                        fontSize: 10, color: 'var(--color-muted)',
                      }}
                    >
                      {label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </>
  )
}
