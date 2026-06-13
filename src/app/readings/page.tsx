import type { Metadata } from 'next'
import { Moon, Star, Heart, Calendar } from 'lucide-react'
import { buildMetadata } from '@/lib/seo'
import ReadingsEmailCapture from './ReadingsEmailCapture'

export const revalidate = 86400

export const metadata: Metadata = buildMetadata({
  title: 'Cosmic Readings — Coming Soon',
  description:
    'Birth chart readings, love readings, and monthly forecasts launching soon from Chandi Silver Studio. Join the waitlist for early access.',
})

const READING_TYPES = [
  {
    Icon: Star,
    title: 'Birth Chart Reading',
    description: 'A deep dive into your natal chart — your personality, life path, and cosmic blueprint.',
  },
  {
    Icon: Heart,
    title: 'Love Reading',
    description: 'Explore your romantic patterns, compatibility, and what the stars say about your relationships.',
  },
  {
    Icon: Calendar,
    title: 'Monthly Forecast',
    description: 'Your personalised monthly cosmic weather report — what to expect and how to navigate it.',
  },
]

export default function ReadingsPage() {
  return (
    <>
      <style>{`
        .readings-heading { font-size: 64px; }
        .readings-card-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 24px;
          max-width: 900px;
          margin: 0 auto 80px;
        }
        @media (max-width: 768px) {
          .readings-heading { font-size: 40px; }
          .readings-card-grid { grid-template-columns: 1fr; }
        }
      `}</style>

      <main style={{ paddingTop: 80 }}>
        {/* Hero */}
        <section
          style={{
            background: 'linear-gradient(160deg, var(--color-lavender) 0%, var(--color-bg) 70%)',
            padding: '100px 24px 80px',
            textAlign: 'center',
          }}
        >
          <Moon
            size={28}
            stroke="var(--color-gold)"
            strokeWidth={1.5}
            style={{ display: 'block', margin: '0 auto 20px' }}
          />
          <h1
            className="readings-heading"
            style={{
              fontFamily: "'Times New Roman', Times, serif",
              fontWeight: 400, color: 'var(--color-text)',
              lineHeight: 1.0, marginBottom: 12,
            }}
          >
            Coming Soon
          </h1>
          <p
            style={{
              fontFamily: 'var(--font-sans, "DM Sans", sans-serif)',
              fontSize: 16, fontWeight: 300, color: 'var(--color-muted)',
              marginBottom: 48,
            }}
          >
            Cosmic readings and guidance — launching soon
          </p>

          {/* Reading type cards */}
          <div className="readings-card-grid" style={{ padding: '0 24px' }}>
            {READING_TYPES.map(({ Icon, title, description }) => (
              <div
                key={title}
                style={{
                  background: 'var(--color-white)', opacity: 0.6,
                  border: '1px solid var(--color-border)',
                  padding: '40px 32px', textAlign: 'center',
                  pointerEvents: 'none',
                  filter: 'grayscale(0.3)',
                  position: 'relative',
                }}
              >
                <Icon
                  size={28}
                  stroke="var(--color-muted)"
                  strokeWidth={1.5}
                  style={{ display: 'block', margin: '0 auto 16px' }}
                />
                <p
                  style={{
                    fontFamily: "'Times New Roman', Times, serif",
                    fontWeight: 400, fontSize: 24, color: 'var(--color-muted)',
                    marginBottom: 10,
                  }}
                >
                  {title}
                </p>
                <p
                  style={{
                    fontFamily: 'var(--font-sans, "DM Sans", sans-serif)',
                    fontSize: 13, fontWeight: 300, lineHeight: 1.65,
                    color: 'var(--color-muted)', marginBottom: 24,
                  }}
                >
                  {description}
                </p>
                <button
                  disabled
                  style={{
                    background: '#D4C9BE', color: '#8A8A8A', border: 'none',
                    fontFamily: 'var(--font-sans, "DM Sans", sans-serif)',
                    fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.1em',
                    padding: '10px 24px', cursor: 'not-allowed',
                  }}
                >
                  Coming Soon
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* Email capture */}
        <ReadingsEmailCapture />
      </main>
    </>
  )
}
