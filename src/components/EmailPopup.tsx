'use client'

import { useEffect, useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'

type Status = 'idle' | 'loading' | 'success' | 'error'

const COOKIE = 'chandi_popup_seen=true'
const COOKIE_MAX = 7 * 24 * 60 * 60 // 7 days

function hasCookie() {
  return typeof document !== 'undefined' && document.cookie.includes('chandi_popup_seen=true')
}

function setCookie() {
  document.cookie = `chandi_popup_seen=true; max-age=${COOKIE_MAX}; path=/`
}

export default function EmailPopup() {
  const [open, setOpen] = useState(false)
  const [email, setEmail] = useState('')
  const [website, setWebsite] = useState('') // honeypot
  const [status, setStatus] = useState<Status>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  useEffect(() => {
    if (hasCookie()) return

    // 5-second timer
    const timer = setTimeout(() => {
      setCookie()
      setOpen(true)
    }, 5000)

    // Exit intent
    const handleExit = (e: MouseEvent) => {
      if (e.clientY <= 0 && !hasCookie()) {
        setCookie()
        setOpen(true)
        document.documentElement.removeEventListener('mouseleave', handleExit)
      }
    }
    document.documentElement.addEventListener('mouseleave', handleExit)

    return () => {
      clearTimeout(timer)
      document.documentElement.removeEventListener('mouseleave', handleExit)
    }
  }, [])

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setStatus('loading')
    setErrorMsg('')

    try {
      const res = await fetch('/api/klaviyo-subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, website }),
      })

      if (res.ok) {
        setStatus('success')
        setTimeout(() => setOpen(false), 2200)
      } else {
        const data = await res.json().catch(() => ({}))
        setErrorMsg(data.error ?? 'Something went wrong. Please try again.')
        setStatus('error')
      }
    } catch {
      setErrorMsg('Network error. Please check your connection.')
      setStatus('error')
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent
        className="!rounded-none !p-0 !gap-0 sm:!max-w-[480px] !ring-0"
        style={{
          background: 'var(--color-bg)',
          border: '1px solid var(--color-border)',
          overflow: 'hidden',
          boxShadow: '0 20px 60px rgba(44,44,44,0.18)',
          fontFamily: 'var(--font-sans, "DM Sans", sans-serif)',
        }}
      >
        {/* Gold accent band */}
        <div style={{ height: 4, background: 'var(--color-gold)', flexShrink: 0 }} />

        <div style={{ padding: '44px 40px 48px' }}>
          {status === 'success' ? (
            /* Success state */
            <div style={{ textAlign: 'center', padding: '16px 0' }}>
              <div
                style={{
                  width: 52,
                  height: 52,
                  margin: '0 auto 20px',
                  border: '1px solid var(--color-gold)',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--color-gold)',
                  fontSize: 22,
                }}
              >
                ✓
              </div>
              <p
                style={{
                  fontFamily: "'Times New Roman', Times, serif",
                  fontWeight: 400,
                  fontSize: 22,
                  color: 'var(--color-text)',
                  margin: '0 0 10px',
                }}
              >
                You&rsquo;re on the list
              </p>
              <p
                style={{
                  fontSize: 14,
                  fontWeight: 300,
                  color: 'var(--color-muted)',
                  margin: 0,
                  lineHeight: 1.6,
                }}
              >
                Check your email for your 20% discount code.
              </p>
            </div>
          ) : (
            /* Form state */
            <>
              {/* Accessible title (visually styled) */}
              <DialogTitle
                style={{
                  fontFamily: "'Times New Roman', Times, serif",
                  fontWeight: 400,
                  fontSize: 30,
                  lineHeight: 1.15,
                  color: 'var(--color-text)',
                  marginBottom: 12,
                  letterSpacing: '0.01em',
                }}
              >
                Get 20% off your first order
              </DialogTitle>

              <DialogDescription
                style={{
                  fontSize: 14,
                  fontWeight: 300,
                  color: 'var(--color-muted)',
                  lineHeight: 1.65,
                  marginBottom: 28,
                }}
              >
                Join thousands of intentional women and receive your exclusive welcome discount.
              </DialogDescription>

              {/* Gold divider */}
              <div
                style={{
                  width: 36,
                  height: 1,
                  background: 'var(--color-gold)',
                  marginBottom: 28,
                  opacity: 0.7,
                }}
              />

              <form onSubmit={handleSubmit}>
                {/* Honeypot — hidden from real users */}
                <input
                  type="text"
                  name="website"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  tabIndex={-1}
                  autoComplete="off"
                  aria-hidden="true"
                  style={{ position: 'absolute', left: '-9999px', opacity: 0, width: 0, height: 0 }}
                />

                {/* Email input */}
                <div style={{ marginBottom: 14 }}>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Your email address"
                    required
                    disabled={status === 'loading'}
                    style={{
                      width: '100%',
                      height: 48,
                      border: '1px solid var(--color-border)',
                      borderRadius: 0,
                      background: 'var(--color-white)',
                      padding: '0 16px',
                      fontSize: 14,
                      fontFamily: 'var(--font-sans, "DM Sans", sans-serif)',
                      fontWeight: 300,
                      color: 'var(--color-text)',
                      outline: 'none',
                      boxSizing: 'border-box',
                      transition: 'border-color 0.2s ease',
                    }}
                    onFocus={(e) => {
                      e.currentTarget.style.borderColor = 'var(--color-gold)'
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.borderColor = 'var(--color-border)'
                    }}
                  />
                </div>

                {/* Error message */}
                {status === 'error' && errorMsg && (
                  <p
                    style={{
                      fontSize: 12,
                      color: '#c0392b',
                      marginBottom: 12,
                      fontFamily: 'var(--font-sans, "DM Sans", sans-serif)',
                    }}
                  >
                    {errorMsg}
                  </p>
                )}

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={status === 'loading'}
                  style={{
                    width: '100%',
                    height: 48,
                    background: status === 'loading' ? 'var(--color-gold-dark)' : 'var(--color-gold)',
                    color: 'var(--color-white)',
                    fontFamily: 'var(--font-sans, "DM Sans", sans-serif)',
                    fontSize: 12,
                    textTransform: 'uppercase',
                    letterSpacing: '0.14em',
                    fontWeight: 400,
                    border: 'none',
                    cursor: status === 'loading' ? 'not-allowed' : 'pointer',
                    opacity: status === 'loading' ? 0.75 : 1,
                    transition: 'background 0.3s ease, opacity 0.3s ease',
                    marginBottom: 16,
                  }}
                >
                  {status === 'loading' ? 'Subscribing…' : 'Claim My Discount'}
                </button>

                {/* Privacy note */}
                <p
                  style={{
                    fontSize: 11,
                    fontWeight: 300,
                    color: 'var(--color-muted)',
                    textAlign: 'center',
                    margin: 0,
                    lineHeight: 1.5,
                  }}
                >
                  No spam, ever. Unsubscribe at any time.
                </p>
              </form>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
