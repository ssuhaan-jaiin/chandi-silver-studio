'use client'

import { useState } from 'react'

type Status = 'idle' | 'loading' | 'success' | 'error'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export default function ReadingsEmailCapture() {
  const [email, setEmail] = useState('')
  const [honeypot, setHoneypot] = useState('')
  const [status, setStatus] = useState<Status>('idle')
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!EMAIL_RE.test(email)) { setError('Please enter a valid email address.'); return }
    setStatus('loading')
    setError('')
    try {
      const res = await fetch('/api/klaviyo-subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, website: honeypot }),
      })
      if (res.ok) {
        setStatus('success')
      } else {
        const data = await res.json().catch(() => ({}))
        setError(data.error ?? 'Something went wrong.')
        setStatus('error')
      }
    } catch {
      setError('Network error. Please try again.')
      setStatus('error')
    }
  }

  return (
    <section
      style={{
        background: 'var(--color-blush)',
        padding: '64px 24px',
        textAlign: 'center',
      }}
    >
      <h2
        style={{
          fontFamily: "'Times New Roman', Times, serif",
          fontWeight: 400, fontSize: 32, color: 'var(--color-text)',
          marginBottom: 8,
        }}
      >
        Be the first to know
      </h2>
      <p
        style={{
          fontFamily: 'var(--font-sans, "DM Sans", sans-serif)',
          fontSize: 14, fontWeight: 300, color: 'var(--color-muted)',
          marginBottom: 32,
        }}
      >
        Get early access when readings launch.
      </p>

      {status === 'success' ? (
        <p
          style={{
            fontFamily: 'var(--font-sans, "DM Sans", sans-serif)',
            fontSize: 14, color: 'var(--color-gold)',
          }}
        >
          You&rsquo;re on the list ✓
        </p>
      ) : (
        <form
          onSubmit={handleSubmit}
          style={{ maxWidth: 440, margin: '0 auto' }}
        >
          {/* Honeypot */}
          <input
            type="text" name="website" value={honeypot}
            onChange={(e) => setHoneypot(e.target.value)}
            tabIndex={-1} autoComplete="off" aria-hidden="true"
            style={{ position: 'absolute', left: '-9999px', opacity: 0, width: 0, height: 0 }}
          />
          <div style={{ display: 'flex' }}>
            <input
              type="email" value={email} required
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your email address"
              disabled={status === 'loading'}
              style={{
                flex: 1, height: 48,
                border: '1px solid var(--color-border)',
                borderRight: 'none', borderRadius: 0,
                padding: '0 16px', fontSize: 14,
                fontFamily: 'var(--font-sans, "DM Sans", sans-serif)',
                fontWeight: 300, color: 'var(--color-text)',
                background: 'var(--color-white)',
                outline: 'none',
              }}
              onFocus={(e) => { e.currentTarget.style.borderColor = 'var(--color-gold)' }}
              onBlur={(e) => { e.currentTarget.style.borderColor = 'var(--color-border)' }}
            />
            <button
              type="submit"
              disabled={status === 'loading'}
              style={{
                height: 48, padding: '0 24px', flexShrink: 0,
                background: status === 'loading' ? 'var(--color-gold-dark)' : 'var(--color-gold)',
                color: 'var(--color-white)', border: 'none',
                fontFamily: 'var(--font-sans, "DM Sans", sans-serif)',
                fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.1em',
                cursor: status === 'loading' ? 'not-allowed' : 'pointer',
                transition: 'background 0.25s ease',
              }}
              onMouseEnter={(e) => {
                if (status !== 'loading') e.currentTarget.style.background = 'var(--color-gold-dark)'
              }}
              onMouseLeave={(e) => {
                if (status !== 'loading') e.currentTarget.style.background = 'var(--color-gold)'
              }}
            >
              {status === 'loading' ? 'Joining…' : 'Notify Me'}
            </button>
          </div>
          {error && (
            <p
              style={{
                fontFamily: 'var(--font-sans, "DM Sans", sans-serif)',
                fontSize: 12, color: '#c0392b', marginTop: 8, textAlign: 'left',
              }}
            >
              {error}
            </p>
          )}
        </form>
      )}
    </section>
  )
}
