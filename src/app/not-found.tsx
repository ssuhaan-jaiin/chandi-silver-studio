import Link from 'next/link'

export default function NotFound() {
  return (
    <main
      style={{
        minHeight: '80vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: '40px 24px',
        background: 'var(--color-bg)',
      }}
    >
      <p
        style={{
          fontFamily: "'Times New Roman', Times, serif",
          fontWeight: 400,
          fontSize: 'clamp(72px, 20vw, 120px)',
          color: 'var(--color-blush)',
          lineHeight: 1,
          margin: 0,
          userSelect: 'none',
        }}
      >
        404
      </p>
      <h1
        style={{
          fontFamily: "'Times New Roman', Times, serif",
          fontWeight: 400,
          fontSize: 'clamp(22px, 5vw, 32px)',
          color: 'var(--color-text)',
          marginTop: 8,
          marginBottom: 16,
        }}
      >
        Page not found
      </h1>
      <p
        style={{
          fontFamily: 'var(--font-sans, "DM Sans", sans-serif)',
          fontSize: 15,
          fontWeight: 300,
          color: 'var(--color-muted)',
          marginBottom: 40,
          maxWidth: 400,
        }}
      >
        The page you&rsquo;re looking for doesn&rsquo;t exist.
      </p>
      <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', justifyContent: 'center' }}>
        <Link
          href="/"
          style={{
            background: 'var(--color-gold)',
            color: 'var(--color-white)',
            fontFamily: 'var(--font-sans, "DM Sans", sans-serif)',
            fontSize: 12,
            textTransform: 'uppercase',
            letterSpacing: '0.12em',
            padding: '14px 32px',
            textDecoration: 'none',
            display: 'inline-block',
          }}
        >
          Go home
        </Link>
        <Link
          href="/shop"
          style={{
            border: '1px solid var(--color-text)',
            color: 'var(--color-text)',
            fontFamily: 'var(--font-sans, "DM Sans", sans-serif)',
            fontSize: 12,
            textTransform: 'uppercase',
            letterSpacing: '0.12em',
            padding: '14px 32px',
            textDecoration: 'none',
            display: 'inline-block',
          }}
        >
          Shop now
        </Link>
      </div>
    </main>
  )
}
