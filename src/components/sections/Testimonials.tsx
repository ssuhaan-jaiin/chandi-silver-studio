'use client'

import { Star } from 'lucide-react'

type Testimonial = {
  id: number
  name: string
  location: string
  rating: number
  text: string
}

const TESTIMONIALS: Testimonial[] = [
  { id: 1, name: 'Sarah M.',     location: 'London',     rating: 5, text: 'I wear my rose quartz ring every day. It feels like armour — beautiful and intentional.' },
  { id: 2, name: 'Priya K.',     location: 'Manchester', rating: 5, text: 'The packaging alone made me cry. This brand truly understands the meaning behind each piece.' },
  { id: 3, name: 'Emma L.',      location: 'Edinburgh',  rating: 5, text: 'My amethyst pendant has genuinely helped with my anxiety. I\'m a convert forever.' },
  { id: 4, name: 'Aisha R.',     location: 'Birmingham', rating: 5, text: 'Gifted the moonstone bracelet to my sister and she hasn\'t taken it off in three months.' },
  { id: 5, name: 'Charlotte W.', location: 'Bristol',    rating: 5, text: 'Every piece I\'ve ordered has been even more beautiful in person. The quality is exceptional.' },
  { id: 6, name: 'Nadia F.',     location: 'Leeds',      rating: 5, text: 'Chandi pieces are the only jewellery I wear. They hold space for who I\'m becoming.' },
]

const DOUBLED = [...TESTIMONIALS, ...TESTIMONIALS]

export default function Testimonials() {
  return (
    <>
      <style>{`
        @keyframes testimonialScroll {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
        .testimonials-fade-track {
          position: relative;
          overflow: hidden;
          width: 100%;
        }
        .testimonials-fade-track::before,
        .testimonials-fade-track::after {
          content: '';
          position: absolute;
          top: 0; bottom: 0;
          width: 120px;
          z-index: 2;
          pointer-events: none;
        }
        .testimonials-fade-track::before {
          left: 0;
          background: linear-gradient(to right, var(--color-blush), transparent);
        }
        .testimonials-fade-track::after {
          right: 0;
          background: linear-gradient(to left, var(--color-blush), transparent);
        }
        .testimonials-track {
          display: flex;
          width: max-content;
          animation: testimonialScroll 50s linear infinite;
          gap: 24px;
          padding: 8px 0;
        }
        .testimonials-track:hover {
          animation-play-state: paused;
        }
        .testimonials-heading { font-size: 38px; }
        @media (max-width: 640px) {
          .testimonials-heading { font-size: 26px; }
          .testimonials-fade-track::before,
          .testimonials-fade-track::after { width: 60px; }
        }
      `}</style>

      <section
        style={{
          padding: '100px 0',
          background: 'var(--color-blush)',
          overflow: 'hidden',
        }}
      >
        {/* Header */}
        <div style={{ padding: '0 24px', textAlign: 'center', marginBottom: 52 }}>
          {/* Star row */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: 4, marginBottom: 20 }}>
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} size={16} fill="var(--color-gold)" stroke="var(--color-gold)" />
            ))}
          </div>

          <h2
            className="testimonials-heading"
            style={{
              fontFamily: "'Times New Roman', Times, serif",
              fontWeight: 400,
              color: 'var(--color-text)',
              margin: '0 0 12px',
            }}
          >
            Loved by Our Community
          </h2>

          <p
            style={{
              fontFamily: 'var(--font-sans, "DM Sans", sans-serif)',
              fontSize: 14,
              fontWeight: 300,
              color: 'var(--color-muted)',
              margin: '0 0 28px',
            }}
          >
            Over 2,000 intentional women wearing Chandi
          </p>

          {/* Gold divider */}
          <div
            style={{
              width: 48,
              height: 1,
              background: 'var(--color-gold)',
              margin: '0 auto',
              opacity: 0.6,
            }}
          />
        </div>

        {/* Scrolling strip */}
        <div className="testimonials-fade-track">
          <div className="testimonials-track">
            {DOUBLED.map((t, idx) => (
              <div
                key={`${t.id}-${idx}`}
                style={{
                  width: 320,
                  flexShrink: 0,
                  background: 'var(--color-white)',
                  border: '1px solid var(--color-border)',
                  padding: '32px 28px',
                }}
              >
                {/* Stars */}
                <div style={{ display: 'flex', gap: 3, marginBottom: 18 }}>
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star key={i} size={12} fill="var(--color-gold)" stroke="var(--color-gold)" />
                  ))}
                </div>

                {/* Quote */}
                <p
                  style={{
                    fontFamily: "'Times New Roman', Times, serif",
                    fontWeight: 400,
                    fontSize: 16,
                    lineHeight: 1.65,
                    color: 'var(--color-text)',
                    margin: '0 0 24px',
                    fontStyle: 'italic',
                  }}
                >
                  &ldquo;{t.text}&rdquo;
                </p>

                {/* Divider */}
                <div
                  style={{
                    width: 28,
                    height: 1,
                    background: 'var(--color-gold)',
                    marginBottom: 16,
                    opacity: 0.5,
                  }}
                />

                {/* Attribution */}
                <div>
                  <p
                    style={{
                      fontFamily: 'var(--font-sans, "DM Sans", sans-serif)',
                      fontSize: 13,
                      fontWeight: 500,
                      color: 'var(--color-text)',
                      margin: '0 0 2px',
                    }}
                  >
                    {t.name}
                  </p>
                  <p
                    style={{
                      fontFamily: 'var(--font-sans, "DM Sans", sans-serif)',
                      fontSize: 11,
                      fontWeight: 300,
                      color: 'var(--color-muted)',
                      margin: 0,
                      textTransform: 'uppercase',
                      letterSpacing: '0.08em',
                    }}
                  >
                    {t.location}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
