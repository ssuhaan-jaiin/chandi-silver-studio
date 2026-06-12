import Image from 'next/image'
import Link from 'next/link'

function InstagramIcon({ size = 20, color = 'currentColor', strokeWidth = 1.5 }: { size?: number; color?: string; strokeWidth?: number }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  )
}

const PLACEHOLDER_IMAGES = [
  '/images/back.png',
  '/images/back2.png',
  '/images/back3.png',
  '/images/back4.png',
  '/images/back.png',
  '/images/back2.png',
]

const IG_URL = 'https://instagram.com/chandisilverstudio'

export default function InstagramFeed() {
  return (
    <>
      <style>{`
        .ig-section  { padding: 100px 24px; }
        .ig-heading  { font-size: 42px; }
        .ig-grid {
          display: grid;
          grid-template-columns: repeat(6, 1fr);
          gap: 3px;
        }
        .ig-cell { display: block; position: relative; overflow: hidden; aspect-ratio: 1 / 1; }
        .ig-cell-overlay {
          position: absolute; inset: 0;
          background: rgba(154,122,74,0.35);
          display: flex; align-items: center; justify-content: center;
          opacity: 0;
          transition: opacity 0.3s ease;
        }
        .ig-cell:hover .ig-cell-overlay { opacity: 1; }
        .ig-cell-img {
          transition: transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }
        .ig-cell:hover .ig-cell-img { transform: scale(1.06); }
        .ig-follow-btn {
          display: inline-flex;
          align-items: center;
          gap: 9px;
          border: 1px solid var(--color-gold);
          color: var(--color-gold);
          font-family: var(--font-sans, 'DM Sans', sans-serif);
          font-size: 12px;
          text-transform: uppercase;
          letter-spacing: 0.12em;
          font-weight: 400;
          padding: 13px 36px;
          text-decoration: none;
          transition: background 0.3s ease, color 0.3s ease;
        }
        .ig-follow-btn:hover {
          background: var(--color-gold);
          color: var(--color-white);
        }
        @media (max-width: 768px) {
          .ig-section { padding: 64px 24px; }
          .ig-heading  { font-size: 28px; }
          .ig-grid { grid-template-columns: repeat(3, 1fr); }
        }
        @media (max-width: 480px) {
          .ig-grid { grid-template-columns: repeat(2, 1fr); }
        }
      `}</style>

      <section className="ig-section" style={{ background: 'var(--color-bg)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>

          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                marginBottom: 16,
              }}
            >
              <InstagramIcon size={16} color="var(--color-gold)" />
              <span
                style={{
                  fontFamily: 'var(--font-sans, "DM Sans", sans-serif)',
                  fontSize: 11,
                  textTransform: 'uppercase',
                  letterSpacing: '0.16em',
                  color: 'var(--color-gold)',
                  fontWeight: 400,
                }}
              >
                @chandisilverstudio
              </span>
            </div>

            <h2
              className="ig-heading"
              style={{
                fontFamily: "'Times New Roman', Times, serif",
                fontWeight: 400,
                color: 'var(--color-text)',
                margin: '0 0 8px',
              }}
            >
              As Worn &amp; Loved
            </h2>

            <p
              style={{
                fontFamily: 'var(--font-sans, "DM Sans", sans-serif)',
                fontSize: 14,
                fontWeight: 300,
                color: 'var(--color-muted)',
                margin: 0,
              }}
            >
              Our community in their Chandi pieces
            </p>
          </div>

          {/* Grid */}
          <div className="ig-grid" style={{ marginBottom: 40 }}>
            {PLACEHOLDER_IMAGES.map((src, i) => (
              <Link
                key={i}
                href={IG_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="ig-cell"
              >
                <div className="ig-cell-img" style={{ position: 'absolute', inset: 0 }}>
                  <Image
                    src={src}
                    alt={`Instagram post ${i + 1}`}
                    fill
                    sizes="(max-width: 480px) 50vw, (max-width: 768px) 33vw, 16vw"
                    style={{ objectFit: 'cover' }}
                  />
                </div>
                <div className="ig-cell-overlay">
                  <InstagramIcon size={28} color="var(--color-white)" strokeWidth={1.5} />
                </div>
              </Link>
            ))}
          </div>

          {/* Follow button */}
          <div style={{ textAlign: 'center' }}>
            <Link
              href={IG_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="ig-follow-btn"
            >
              <InstagramIcon size={14} color="currentColor" />
              Follow on Instagram
            </Link>
          </div>

        </div>
      </section>
    </>
  )
}
