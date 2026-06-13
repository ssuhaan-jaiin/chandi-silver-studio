'use client'

import { useState } from 'react'
import Script from 'next/script'
import { Clock, Plane, RefreshCcw, Package, BadgeCheck } from 'lucide-react'
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import WishlistButton from './WishlistButton'
import { useCartContext } from '@/context/CartContext'

interface Variant {
  id: string
  title: string
  price: string
  availableForSale: boolean
  selectedOptions: Array<{ name: string; value: string }>
}

interface ProductInfoProps {
  id: string
  title: string
  handle: string
  descriptionHtml: string
  totalInventory: number
  price: string
  currencyCode: string
  variants: Variant[]
  intention: string
  crystalType: string
  origin: string
  madeIn: string
  onlyOne: boolean
  healingProperties: string
  sourcingStory: string
}

type WaitlistStatus = 'idle' | 'loading' | 'success' | 'error'

export default function ProductInfo({
  id,
  title,
  handle,
  descriptionHtml,
  totalInventory,
  price,
  currencyCode,
  variants,
  intention,
  crystalType,
  origin,
  madeIn,
  onlyOne,
  healingProperties,
  sourcingStory,
}: ProductInfoProps) {
  const { addToCart, isLoading: cartLoading } = useCartContext()
  const firstAvailable = variants.find((v) => v.availableForSale) ?? variants[0]
  const [selectedVariantId, setSelectedVariantId] = useState(firstAvailable?.id ?? '')
  const [added, setAdded] = useState(false)
  const [waitlistOpen, setWaitlistOpen] = useState(false)
  const [waitlistEmail, setWaitlistEmail] = useState('')
  const [waitlistHoneypot, setWaitlistHoneypot] = useState('')
  const [waitlistStatus, setWaitlistStatus] = useState<WaitlistStatus>('idle')
  const [waitlistError, setWaitlistError] = useState('')
  const [activeTab, setActiveTab] = useState<'about' | 'crystal' | 'origin'>('about')

  const isSoldOut = totalInventory === 0
  const isLimited = (totalInventory === 1 || onlyOne) && !isSoldOut

  const displayPrice = currencyCode === 'GBP' ? `£${price}` : currencyCode === 'USD' ? `$${price}` : `${currencyCode} ${price}`
  const klarnaMonthly = currencyCode === 'GBP'
    ? `£${Math.ceil(parseFloat(price) / 3).toFixed(2)}`
    : `${Math.ceil(parseFloat(price) / 3).toFixed(2)}`

  const showVariants = variants.length > 1
  const variantLabel = variants[0]?.selectedOptions?.[0]?.name ?? 'Size'

  async function handleAddToBag() {
    if (isSoldOut || added || cartLoading) return
    setAdded(true)
    await addToCart(selectedVariantId, 1)
    setTimeout(() => setAdded(false), 1500)
  }

  async function handleWaitlistSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setWaitlistStatus('loading')
    setWaitlistError('')
    try {
      const res = await fetch('/api/klaviyo-waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: waitlistEmail,
          website: waitlistHoneypot,
          productHandle: handle,
          productTitle: title,
        }),
      })
      if (res.ok) {
        setWaitlistStatus('success')
        setTimeout(() => setWaitlistOpen(false), 2000)
      } else {
        const data = await res.json().catch(() => ({}))
        setWaitlistError(data.error ?? 'Something went wrong.')
        setWaitlistStatus('error')
      }
    } catch {
      setWaitlistError('Network error. Please try again.')
      setWaitlistStatus('error')
    }
  }

  const tabs = [
    { key: 'about',   label: 'About this piece' },
    { key: 'crystal', label: 'Crystal Details' },
    { key: 'origin',  label: 'Origin' },
  ] as const

  return (
    <>
      <style>{`
        .pi-heading { font-size: 36px; }
        .variant-pill { position: relative; overflow: hidden; }
        .variant-unavailable {
          opacity: 0.35; cursor: not-allowed !important;
        }
        .variant-unavailable::after {
          content: '';
          position: absolute; inset: 0;
          background: linear-gradient(
            to bottom right,
            transparent calc(50% - 0.5px),
            var(--color-border) calc(50% - 0.5px),
            var(--color-border) calc(50% + 0.5px),
            transparent calc(50% + 0.5px)
          );
        }
        .product-prose { font-family: var(--font-sans, "DM Sans", sans-serif); font-size: 15px; font-weight: 300; line-height: 1.85; color: var(--color-text); }
        .product-prose h1, .product-prose h2, .product-prose h3 { font-family: 'Times New Roman', Times, serif; font-weight: 400; margin-bottom: 16px; }
        .product-prose a { color: var(--color-gold); }
        .product-prose p { margin-bottom: 16px; }
        @media (max-width: 640px) {
          .pi-heading { font-size: 26px; }
        }
      `}</style>

      {/* Intention badge */}
      {intention && (
        <div style={{ marginBottom: 16 }}>
          <span
            style={{
              display: 'inline-block',
              background: 'var(--color-lavender)', color: 'var(--color-text)',
              fontFamily: 'var(--font-sans, "DM Sans", sans-serif)',
              fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.1em',
              fontWeight: 400, padding: '5px 14px',
            }}
          >
            {intention}
          </span>
        </div>
      )}

      {/* Title */}
      <h1
        className="pi-heading"
        style={{
          fontFamily: "'Times New Roman', Times, serif",
          fontWeight: 400, color: 'var(--color-text)',
          lineHeight: 1.2, marginBottom: 12,
        }}
      >
        {title}
      </h1>

      {/* Crystal + origin */}
      {(crystalType || origin) && (
        <p
          style={{
            fontFamily: 'var(--font-sans, "DM Sans", sans-serif)',
            fontSize: 13, fontWeight: 300, color: 'var(--color-muted)',
            letterSpacing: '0.02em', marginBottom: 20,
          }}
        >
          {[crystalType, origin ? `Sourced from ${origin}` : null].filter(Boolean).join('  ·  ')}
        </p>
      )}

      {/* Stock status */}
      {isLimited && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 16 }}>
          <Clock size={14} stroke="var(--color-gold-dark)" />
          <span
            style={{
              fontFamily: 'var(--font-sans, "DM Sans", sans-serif)',
              fontSize: 12, fontWeight: 500, color: 'var(--color-gold-dark)',
            }}
          >
            Only 1 available
          </span>
        </div>
      )}
      {isSoldOut && (
        <div style={{ marginBottom: 16 }}>
          <span
            style={{
              fontFamily: 'var(--font-sans, "DM Sans", sans-serif)',
              fontSize: 12, color: 'var(--color-muted)',
              background: '#F0EBE3', padding: '4px 12px',
              display: 'inline-block',
            }}
          >
            Sold out
          </span>
        </div>
      )}

      {/* Divider */}
      <div style={{ height: 1, background: 'var(--color-border)', margin: '20px 0' }} />

      {/* Price */}
      <p
        style={{
          fontFamily: 'var(--font-sans, "DM Sans", sans-serif)',
          fontSize: 28, fontWeight: 500, color: 'var(--color-gold-dark)', marginBottom: 8,
        }}
      >
        {displayPrice}
      </p>
      <p
        style={{
          fontFamily: 'var(--font-sans, "DM Sans", sans-serif)',
          fontSize: 12, fontWeight: 300, color: 'var(--color-muted)', marginBottom: 24,
        }}
      >
        Or from {klarnaMonthly} / month with Klarna
      </p>

      {/* Variant selector */}
      {showVariants && (
        <div style={{ marginBottom: 24 }}>
          <p
            style={{
              fontFamily: 'var(--font-sans, "DM Sans", sans-serif)',
              fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.1em',
              color: 'var(--color-text)', marginBottom: 10,
            }}
          >
            {variantLabel}
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {variants.map((v) => {
              const isSelected = v.id === selectedVariantId
              const isUnavailable = !v.availableForSale
              return (
                <button
                  key={v.id}
                  onClick={() => !isUnavailable && setSelectedVariantId(v.id)}
                  className={`variant-pill${isUnavailable ? ' variant-unavailable' : ''}`}
                  style={{
                    padding: '8px 16px',
                    border: `1px solid ${isSelected ? 'var(--color-gold)' : 'var(--color-border)'}`,
                    fontFamily: 'var(--font-sans, "DM Sans", sans-serif)',
                    fontSize: 13, color: isSelected ? 'var(--color-gold-dark)' : 'var(--color-text)',
                    background: isSelected ? 'rgba(201,169,110,0.06)' : 'transparent',
                    cursor: isUnavailable ? 'not-allowed' : 'pointer',
                    borderRadius: 0,
                    transition: 'all 0.2s ease',
                  }}
                >
                  {v.title}
                </button>
              )
            })}
          </div>
        </div>
      )}

      {/* Add to bag */}
      <button
        onClick={handleAddToBag}
        disabled={isSoldOut}
        style={{
          width: '100%', height: 52, marginTop: 24,
          background: isSoldOut ? '#D4C9BE' : added ? 'var(--color-gold-dark)' : 'var(--color-gold)',
          color: isSoldOut ? '#8A8A8A' : 'var(--color-white)',
          fontFamily: 'var(--font-sans, "DM Sans", sans-serif)',
          fontSize: 13, textTransform: 'uppercase', letterSpacing: '0.12em', fontWeight: 500,
          border: 'none', borderRadius: 0,
          cursor: isSoldOut ? 'not-allowed' : 'pointer',
          pointerEvents: isSoldOut ? 'none' : 'auto',
          transition: 'background 0.25s ease',
        }}
        onMouseEnter={(e) => {
          if (!isSoldOut && !added) e.currentTarget.style.background = 'var(--color-gold-dark)'
        }}
        onMouseLeave={(e) => {
          if (!isSoldOut && !added) e.currentTarget.style.background = 'var(--color-gold)'
        }}
      >
        {isSoldOut ? 'Sold Out' : added ? 'Added ✓' : 'Add to Bag'}
      </button>

      {/* Waitlist (sold out only) */}
      {isSoldOut && (
        <>
          <button
            onClick={() => setWaitlistOpen(true)}
            style={{
              width: '100%', height: 48, marginTop: 12,
              border: '1px solid var(--color-text)',
              background: 'transparent', color: 'var(--color-text)',
              fontFamily: 'var(--font-sans, "DM Sans", sans-serif)',
              fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.1em',
              cursor: 'pointer', borderRadius: 0,
              transition: 'border-color 0.25s ease, color 0.25s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'var(--color-gold)'
              e.currentTarget.style.color = 'var(--color-gold)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'var(--color-text)'
              e.currentTarget.style.color = 'var(--color-text)'
            }}
          >
            Join Waitlist
          </button>

          <Dialog open={waitlistOpen} onOpenChange={setWaitlistOpen}>
            <DialogContent
              className="!rounded-none !p-0 !gap-0 sm:!max-w-[440px] !ring-0"
              style={{ background: 'var(--color-bg)', border: '1px solid var(--color-border)', overflow: 'hidden' }}
            >
              <div style={{ height: 4, background: 'var(--color-gold)' }} />
              <div style={{ padding: '40px 36px 44px' }}>
                {waitlistStatus === 'success' ? (
                  <div style={{ textAlign: 'center', padding: '12px 0' }}>
                    <p style={{ fontFamily: "'Times New Roman', Times, serif", fontWeight: 400, fontSize: 22, color: 'var(--color-text)', marginBottom: 8 }}>
                      You&rsquo;re on the list ✓
                    </p>
                    <p style={{ fontFamily: 'var(--font-sans, "DM Sans", sans-serif)', fontSize: 14, fontWeight: 300, color: 'var(--color-muted)' }}>
                      We&rsquo;ll email you the moment this piece is back.
                    </p>
                  </div>
                ) : (
                  <>
                    <DialogTitle style={{ fontFamily: "'Times New Roman', Times, serif", fontWeight: 400, fontSize: 24, color: 'var(--color-text)', marginBottom: 8 }}>
                      Join the waitlist
                    </DialogTitle>
                    <DialogDescription style={{ fontFamily: 'var(--font-sans, "DM Sans", sans-serif)', fontSize: 13, fontWeight: 300, color: 'var(--color-muted)', marginBottom: 24 }}>
                      We&rsquo;ll email you the moment this piece is back.
                    </DialogDescription>
                    <form onSubmit={handleWaitlistSubmit}>
                      {/* Honeypot */}
                      <input
                        type="text" name="website" value={waitlistHoneypot}
                        onChange={(e) => setWaitlistHoneypot(e.target.value)}
                        tabIndex={-1} autoComplete="off" aria-hidden="true"
                        style={{ position: 'absolute', left: '-9999px', opacity: 0, width: 0, height: 0 }}
                      />
                      <input
                        type="email" value={waitlistEmail} required
                        onChange={(e) => setWaitlistEmail(e.target.value)}
                        placeholder="Your email address"
                        disabled={waitlistStatus === 'loading'}
                        style={{
                          width: '100%', height: 44, border: '1px solid var(--color-border)',
                          borderRadius: 0, background: 'var(--color-white)',
                          padding: '0 14px', fontSize: 14,
                          fontFamily: 'var(--font-sans, "DM Sans", sans-serif)',
                          fontWeight: 300, color: 'var(--color-text)',
                          outline: 'none', boxSizing: 'border-box', marginBottom: 12,
                        }}
                        onFocus={(e) => { e.currentTarget.style.borderColor = 'var(--color-gold)' }}
                        onBlur={(e) => { e.currentTarget.style.borderColor = 'var(--color-border)' }}
                      />
                      {waitlistStatus === 'error' && waitlistError && (
                        <p style={{ fontSize: 12, color: '#c0392b', marginBottom: 10, fontFamily: 'var(--font-sans)' }}>
                          {waitlistError}
                        </p>
                      )}
                      <button
                        type="submit"
                        disabled={waitlistStatus === 'loading'}
                        style={{
                          width: '100%', height: 44,
                          background: waitlistStatus === 'loading' ? 'var(--color-gold-dark)' : 'var(--color-gold)',
                          color: 'var(--color-white)', border: 'none', borderRadius: 0,
                          fontFamily: 'var(--font-sans, "DM Sans", sans-serif)',
                          fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.12em',
                          cursor: waitlistStatus === 'loading' ? 'not-allowed' : 'pointer',
                          opacity: waitlistStatus === 'loading' ? 0.75 : 1,
                        }}
                      >
                        {waitlistStatus === 'loading' ? 'Joining…' : 'Notify Me'}
                      </button>
                    </form>
                  </>
                )}
              </div>
            </DialogContent>
          </Dialog>
        </>
      )}

      {/* Wishlist button */}
      <div style={{ marginTop: 12 }}>
        <WishlistButton id={id} variant="full" />
      </div>

      {/* Trust strip */}
      <div
        style={{
          marginTop: 28, paddingTop: 24,
          borderTop: '1px solid var(--color-border)',
          display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, textAlign: 'center',
        }}
      >
        {[
          { Icon: Plane,       label: 'Worldwide\nShipping' },
          { Icon: RefreshCcw,  label: '14-Day\nReturns' },
          { Icon: Package,     label: 'Luxury\nPackaging' },
        ].map(({ Icon, label }) => (
          <div key={label}>
            <Icon size={20} stroke="var(--color-gold)" strokeWidth={1.5} style={{ margin: '0 auto 6px', display: 'block' }} />
            <p
              style={{
                fontFamily: 'var(--font-sans, "DM Sans", sans-serif)',
                fontSize: 11, color: 'var(--color-muted)', lineHeight: 1.4, margin: 0,
                whiteSpace: 'pre-line',
              }}
            >
              {label}
            </p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div style={{ marginTop: 40 }}>
        {/* Tab triggers */}
        <div style={{ display: 'flex', borderBottom: '1px solid var(--color-border)', marginBottom: 24 }}>
          {tabs.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              style={{
                fontFamily: 'var(--font-sans, "DM Sans", sans-serif)',
                fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.08em',
                color: activeTab === key ? 'var(--color-text)' : 'var(--color-muted)',
                borderTop: 'none', borderLeft: 'none', borderRight: 'none',
                borderBottom: `2px solid ${activeTab === key ? 'var(--color-gold)' : 'transparent'}`,
                background: 'none', padding: '12px 0', marginRight: 28,
                marginBottom: '-1px', cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Tab content */}
        {activeTab === 'about' && (
          <div
            className="product-prose"
            dangerouslySetInnerHTML={{ __html: descriptionHtml || '<p>Product details coming soon.</p>' }}
          />
        )}

        {activeTab === 'crystal' && (
          <div className="product-prose">
            {healingProperties
              ? healingProperties.split('\n').filter(Boolean).map((para, i) => (
                  <p key={i}>{para}</p>
                ))
              : <p style={{ color: 'var(--color-muted)' }}>Crystal properties coming soon.</p>
            }
          </div>
        )}

        {activeTab === 'origin' && (
          <div>
            {origin && (
              <div style={{ marginBottom: 16 }}>
                <p style={{ fontFamily: 'var(--font-sans, "DM Sans", sans-serif)', fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--color-muted)', marginBottom: 2 }}>
                  Gemstone Origin
                </p>
                <p style={{ fontFamily: 'var(--font-sans, "DM Sans", sans-serif)', fontSize: 14, color: 'var(--color-text)', margin: 0 }}>
                  {origin}
                </p>
              </div>
            )}
            {madeIn && (
              <div style={{ marginBottom: 16 }}>
                <p style={{ fontFamily: 'var(--font-sans, "DM Sans", sans-serif)', fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--color-muted)', marginBottom: 2 }}>
                  Made in
                </p>
                <p style={{ fontFamily: 'var(--font-sans, "DM Sans", sans-serif)', fontSize: 14, color: 'var(--color-text)', margin: 0 }}>
                  {madeIn}
                </p>
              </div>
            )}
            {sourcingStory && (
              <p style={{ fontFamily: 'var(--font-sans, "DM Sans", sans-serif)', fontSize: 14, fontWeight: 300, lineHeight: 1.75, color: 'var(--color-text)', marginTop: 16 }}>
                {sourcingStory}
              </p>
            )}
            {/* Certifications */}
            <div style={{ marginTop: 24, display: 'flex', gap: 20, flexWrap: 'wrap' }}>
              {['Crystal Healing Diploma', 'Reiki Level 2'].map((cert) => (
                <div key={cert} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <BadgeCheck size={14} stroke="var(--color-gold)" />
                  <span style={{ fontFamily: 'var(--font-sans, "DM Sans", sans-serif)', fontSize: 11, color: 'var(--color-muted)' }}>
                    {cert}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Judge.me reviews */}
      <div style={{ marginTop: 40, paddingTop: 32, borderTop: '1px solid var(--color-border)' }}>
        <h2
          style={{
            fontFamily: "'Times New Roman', Times, serif",
            fontWeight: 400, fontSize: 24, color: 'var(--color-text)', marginBottom: 24,
          }}
        >
          Customer Reviews
        </h2>
        <div
          id="judgeme_product_reviews"
          data-id={id.split('/').pop()}
          data-handle={handle}
        />
        <Script
          src="https://cdn.judge.me/assets/shopify_install.js"
          strategy="lazyOnload"
        />
      </div>
    </>
  )
}
