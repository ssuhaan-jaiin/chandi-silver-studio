'use client'

import { useState, useEffect } from 'react'
import { Heart } from 'lucide-react'

const WISHLIST_KEY = 'chandi-wishlist'

interface WishlistButtonProps {
  id: string
  variant?: 'icon' | 'full'
}

export default function WishlistButton({ id, variant = 'icon' }: WishlistButtonProps) {
  const [wishlisted, setWishlisted] = useState(false)

  useEffect(() => {
    try {
      const raw = localStorage.getItem(WISHLIST_KEY)
      const ids: string[] = raw ? JSON.parse(raw) : []
      setWishlisted(ids.includes(id))
    } catch {
      // ignore malformed storage
    }
  }, [id])

  function toggle(e: React.MouseEvent) {
    e.preventDefault()
    e.stopPropagation()
    try {
      const raw = localStorage.getItem(WISHLIST_KEY)
      const ids: string[] = raw ? JSON.parse(raw) : []
      const next = wishlisted ? ids.filter((i) => i !== id) : [...ids, id]
      localStorage.setItem(WISHLIST_KEY, JSON.stringify(next))
      setWishlisted(!wishlisted)
    } catch {
      // ignore storage errors
    }
  }

  if (variant === 'icon') {
    return (
      <button
        onClick={toggle}
        aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
        style={{
          width: 34, height: 34,
          background: 'rgba(255,255,255,0.92)',
          borderRadius: '50%',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          border: 'none', cursor: 'pointer',
          boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
          transition: 'transform 0.2s ease',
          flexShrink: 0,
        }}
      >
        <Heart
          size={15} strokeWidth={1.5}
          stroke={wishlisted ? 'var(--color-gold)' : 'var(--color-muted)'}
          fill={wishlisted ? 'var(--color-gold)' : 'transparent'}
          style={{ transition: 'all 0.2s ease' }}
        />
      </button>
    )
  }

  return (
    <button
      onClick={toggle}
      aria-label={wishlisted ? 'Remove from wishlist' : 'Save to wishlist'}
      style={{
        width: '100%', height: 44,
        border: `1px solid ${wishlisted ? 'var(--color-gold)' : 'var(--color-border)'}`,
        background: 'transparent',
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
        cursor: 'pointer',
        fontFamily: 'var(--font-sans, "DM Sans", sans-serif)',
        fontSize: 12,
        color: wishlisted ? 'var(--color-gold)' : 'var(--color-muted)',
        transition: 'border-color 0.25s ease, color 0.25s ease',
        borderRadius: 0,
      }}
      onMouseEnter={(e) => {
        if (!wishlisted) {
          e.currentTarget.style.borderColor = 'var(--color-gold)'
          e.currentTarget.style.color = 'var(--color-gold)'
        }
      }}
      onMouseLeave={(e) => {
        if (!wishlisted) {
          e.currentTarget.style.borderColor = 'var(--color-border)'
          e.currentTarget.style.color = 'var(--color-muted)'
        }
      }}
    >
      <Heart
        size={16} strokeWidth={1.5}
        stroke={wishlisted ? 'var(--color-gold)' : 'currentColor'}
        fill={wishlisted ? 'var(--color-gold)' : 'transparent'}
        style={{ transition: 'all 0.2s ease' }}
      />
      {wishlisted ? 'Saved' : 'Save to Wishlist'}
    </button>
  )
}
