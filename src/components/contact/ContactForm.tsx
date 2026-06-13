'use client'

import { useState } from 'react'

type Status = 'idle' | 'loading' | 'success' | 'error'

const LABEL_STYLE: React.CSSProperties = {
  display: 'block',
  fontFamily: 'var(--font-sans, "DM Sans", sans-serif)',
  fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.08em',
  color: 'var(--color-text)', marginBottom: 6,
}

const INPUT_STYLE: React.CSSProperties = {
  width: '100%', height: 44,
  border: '1px solid var(--color-border)', borderRadius: 0,
  background: 'var(--color-white)', padding: '0 14px',
  fontSize: 14, fontFamily: 'var(--font-sans, "DM Sans", sans-serif)',
  fontWeight: 300, color: 'var(--color-text)',
  outline: 'none', boxSizing: 'border-box',
}

export default function ContactForm() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [subject, setSubject] = useState('')
  const [message, setMessage] = useState('')
  const [honeypot, setHoneypot] = useState('')
  const [status, setStatus] = useState<Status>('idle')
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setStatus('loading')
    setError('')
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, subject, message, website: honeypot }),
      })
      if (res.ok) {
        setStatus('success')
      } else {
        const data = await res.json().catch(() => ({}))
        setError(data.error ?? 'Something went wrong. Please try again.')
        setStatus('error')
      }
    } catch {
      setError('Network error. Please try again.')
      setStatus('error')
    }
  }

  function focusBorder(e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) {
    e.currentTarget.style.borderColor = 'var(--color-gold)'
  }
  function blurBorder(e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) {
    e.currentTarget.style.borderColor = 'var(--color-border)'
  }

  return (
    <div>
      <h2
        style={{
          fontFamily: "'Times New Roman', Times, serif",
          fontWeight: 400, fontSize: 26, color: 'var(--color-text)',
          marginBottom: 28,
        }}
      >
        Send a message
      </h2>

      {status === 'success' ? (
        <div>
          <p
            style={{
              fontFamily: "'Times New Roman', Times, serif",
              fontWeight: 400, fontSize: 22, color: 'var(--color-text)',
              marginBottom: 8,
            }}
          >
            Message sent ✓
          </p>
          <p
            style={{
              fontFamily: 'var(--font-sans, "DM Sans", sans-serif)',
              fontSize: 14, color: 'var(--color-gold)',
            }}
          >
            We&rsquo;ll get back to you within 24 hours.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          {/* Honeypot */}
          <input
            type="text" name="website" value={honeypot}
            onChange={(e) => setHoneypot(e.target.value)}
            tabIndex={-1} autoComplete="off" aria-hidden="true"
            style={{ position: 'absolute', left: '-9999px', opacity: 0, width: 0, height: 0 }}
          />

          <div style={{ marginBottom: 16 }}>
            <label style={LABEL_STYLE}>Name</label>
            <input
              type="text" value={name} required
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              disabled={status === 'loading'}
              style={INPUT_STYLE}
              onFocus={focusBorder} onBlur={blurBorder}
            />
          </div>

          <div style={{ marginBottom: 16 }}>
            <label style={LABEL_STYLE}>Email</label>
            <input
              type="email" value={email} required
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              disabled={status === 'loading'}
              style={INPUT_STYLE}
              onFocus={focusBorder} onBlur={blurBorder}
            />
          </div>

          <div style={{ marginBottom: 16 }}>
            <label style={LABEL_STYLE}>Subject</label>
            <input
              type="text" value={subject} required
              onChange={(e) => setSubject(e.target.value)}
              placeholder="What's this about?"
              disabled={status === 'loading'}
              style={INPUT_STYLE}
              onFocus={focusBorder} onBlur={blurBorder}
            />
          </div>

          <div style={{ marginBottom: 16 }}>
            <label style={LABEL_STYLE}>Message</label>
            <textarea
              value={message} required
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Tell us anything..."
              rows={5}
              disabled={status === 'loading'}
              style={{
                ...INPUT_STYLE,
                height: 'auto', padding: '12px 14px',
                resize: 'none', lineHeight: 1.6,
              }}
              onFocus={focusBorder} onBlur={blurBorder}
            />
          </div>

          {status === 'error' && error && (
            <p
              style={{
                fontFamily: 'var(--font-sans, "DM Sans", sans-serif)',
                fontSize: 12, color: '#c0392b', marginBottom: 12,
              }}
            >
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={status === 'loading'}
            style={{
              width: '100%', padding: '14px 40px',
              background: status === 'loading' ? 'var(--color-gold-dark)' : 'var(--color-gold)',
              color: 'var(--color-white)', border: 'none', borderRadius: 0,
              fontFamily: 'var(--font-sans, "DM Sans", sans-serif)',
              fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.12em',
              cursor: status === 'loading' ? 'not-allowed' : 'pointer',
              transition: 'background 0.25s ease',
              opacity: status === 'loading' ? 0.75 : 1,
            }}
            onMouseEnter={(e) => {
              if (status !== 'loading') e.currentTarget.style.background = 'var(--color-gold-dark)'
            }}
            onMouseLeave={(e) => {
              if (status !== 'loading') e.currentTarget.style.background = 'var(--color-gold)'
            }}
          >
            {status === 'loading' ? 'Sending…' : 'Send Message'}
          </button>
        </form>
      )}
    </div>
  )
}
