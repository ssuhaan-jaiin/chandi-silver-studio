'use client'

import { useRouter } from 'next/navigation'
import * as LucideIcons from 'lucide-react'

const INTENTIONS = [
  { name: 'Love',           icon: 'Heart',    description: 'Open your heart',   bg: 'var(--color-blush)'    },
  { name: 'Anxiety Relief', icon: 'Moon',     description: 'Find your calm',    bg: 'var(--color-lavender)' },
  { name: 'Protection',     icon: 'Shield',   description: 'Guard your energy', bg: 'var(--color-blush)'    },
  { name: 'Clarity',        icon: 'Eye',      description: 'See your path',     bg: 'var(--color-lavender)' },
  { name: 'Abundance',      icon: 'Sparkles', description: 'Attract the good',  bg: 'var(--color-blush)'    },
  { name: 'Grounding',      icon: 'Leaf',     description: 'Stay rooted',       bg: 'var(--color-lavender)' },
  { name: 'Healing',        icon: 'Flower2',  description: 'Restore yourself',  bg: 'var(--color-blush)'    },
  { name: 'Confidence',     icon: 'Zap',      description: 'Own your power',    bg: 'var(--color-lavender)' },
]

export default function ShopByIntention() {
  const router = useRouter()

  return (
    <>
      <style>{`
        .sbi-section  { padding: 100px 24px; }
        .sbi-heading  { font-size: 48px; }
        .sbi-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 2px;
        }
        .sbi-card {
          border: 2px solid transparent;
          transition: border-color 0.3s ease, transform 0.3s ease;
        }
        .sbi-card:hover {
          border-color: var(--color-gold);
          transform: scale(1.02);
        }
        @media (max-width: 1023px) and (min-width: 641px) {
          .sbi-grid { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 640px) {
          .sbi-section { padding: 64px 0 64px; }
          .sbi-heading { font-size: 32px; }
          .sbi-section-inner { padding: 0 24px; }
          .sbi-grid {
            display: flex;
            overflow-x: auto;
            gap: 2px;
            scroll-snap-type: x mandatory;
            padding: 0 24px 12px;
            scrollbar-width: none;
          }
          .sbi-grid::-webkit-scrollbar { display: none; }
          .sbi-card {
            flex-shrink: 0;
            width: 72vw;
            scroll-snap-align: start;
          }
        }
      `}</style>

      <section className="sbi-section" style={{ background: 'var(--color-blush)' }}>
        <div className="sbi-section-inner" style={{ maxWidth: 1200, margin: '0 auto' }}>

          <h2
            className="sbi-heading"
            style={{
              fontFamily: "'Times New Roman', Times, serif",
              fontWeight: 400,
              textAlign: 'center',
              color: 'var(--color-text)',
              margin: '0 0 8px',
            }}
          >
            Shop by Intention
          </h2>
          <p
            style={{
              fontFamily: 'var(--font-sans, "DM Sans", sans-serif)',
              fontSize: 14,
              fontWeight: 300,
              color: 'var(--color-muted)',
              textAlign: 'center',
              margin: '0 0 52px',
            }}
          >
            Every piece carries a purpose. Find yours.
          </p>

          <div className="sbi-grid">
            {INTENTIONS.map((intention) => {
              const Icon = LucideIcons[intention.icon as keyof typeof LucideIcons] as React.ElementType
              return (
                <div
                  key={intention.name}
                  className="sbi-card"
                  role="button"
                  tabIndex={0}
                  onClick={() => router.push(`/shop?intention=${encodeURIComponent(intention.name)}`)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      router.push(`/shop?intention=${encodeURIComponent(intention.name)}`)
                    }
                  }}
                  style={{
                    background: intention.bg,
                    padding: '40px 28px',
                    textAlign: 'center',
                    borderRadius: 0,
                    cursor: 'pointer',
                    position: 'relative',
                    overflow: 'hidden',
                  }}
                >
                  {/* Corner accent */}
                  <div
                    style={{
                      position: 'absolute',
                      top: 12,
                      right: 12,
                      width: 20,
                      height: 20,
                      borderTop: '1px solid var(--color-gold)',
                      borderRight: '1px solid var(--color-gold)',
                      opacity: 0.4,
                    }}
                  />

                  {/* Icon circle */}
                  <div
                    style={{
                      width: 52,
                      height: 52,
                      margin: '0 auto 22px',
                      border: '1px solid var(--color-gold)',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: 'rgba(201,169,110,0.08)',
                    }}
                  >
                    {Icon && <Icon size={20} stroke="var(--color-gold)" strokeWidth={1.5} />}
                  </div>

                  {/* Intention name */}
                  <p
                    style={{
                      fontFamily: "'Times New Roman', Times, serif",
                      fontWeight: 400,
                      fontSize: 21,
                      color: 'var(--color-text)',
                      letterSpacing: '0.01em',
                      margin: '0 0 10px',
                    }}
                  >
                    {intention.name}
                  </p>

                  {/* Description */}
                  <p
                    style={{
                      fontFamily: 'var(--font-sans, "DM Sans", sans-serif)',
                      fontSize: 11,
                      fontWeight: 300,
                      letterSpacing: '0.08em',
                      textTransform: 'uppercase',
                      color: 'var(--color-muted)',
                      margin: 0,
                    }}
                  >
                    {intention.description}
                  </p>
                </div>
              )
            })}
          </div>

        </div>
      </section>
    </>
  )
}
