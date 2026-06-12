import { Leaf, Sparkles, Award } from 'lucide-react'

const PILLARS = [
  {
    Icon: Leaf,
    heading: 'Ethically Sourced',
    description:
      'Every gemstone is sourced responsibly, directly from trusted suppliers in India and global gem shows.',
  },
  {
    Icon: Sparkles,
    heading: 'Made in India',
    description:
      'Handcrafted by skilled artisans in India, honouring centuries of jewellery-making tradition.',
  },
  {
    Icon: Award,
    heading: 'Crystal Healing Certified',
    description:
      'Our founder holds a Crystal Healing Diploma and Reiki Level 2 certification.',
  },
]

export default function BrandIntro() {
  return (
    <section
      className="brand-intro-section"
      style={{ background: 'var(--color-bg)', padding: '110px 24px' }}
    >
      <div style={{ maxWidth: 720, margin: '0 auto', textAlign: 'center' }}>
        {/* Eyebrow pill */}
        <span
          style={{
            display: 'inline-block',
            border: '1px solid var(--color-gold)',
            color: 'var(--color-gold)',
            fontFamily: 'var(--font-sans, "DM Sans", sans-serif)',
            fontSize: 10,
            textTransform: 'uppercase',
            letterSpacing: '0.16em',
            fontWeight: 400,
            padding: '7px 20px',
            borderRadius: 100,
            marginBottom: 32,
          }}
        >
          Our Philosophy
        </span>

        {/* Heading */}
        <h2
          className="brand-intro-heading"
          style={{
            fontFamily: "'Times New Roman', Times, serif",
            fontWeight: 400,
            lineHeight: 1.15,
            color: 'var(--color-text)',
            margin: '0 0 32px',
          }}
        >
          Jewellery with a soul
        </h2>

        {/* Paragraph 1 */}
        <p
          style={{
            fontFamily: 'var(--font-sans, "DM Sans", sans-serif)',
            fontSize: 16,
            fontWeight: 300,
            lineHeight: 1.85,
            color: 'var(--color-text)',
            margin: '0 0 20px',
          }}
        >
          Every piece in our collection begins with a feeling — not a trend. We travel to India
          and source gemstones from around the world with one question in mind: what will this
          crystal help someone feel? From rose quartz for love to amethyst for calm, each stone
          is chosen with intention.
        </p>

        {/* Paragraph 2 */}
        <p
          style={{
            fontFamily: 'var(--font-sans, "DM Sans", sans-serif)',
            fontSize: 16,
            fontWeight: 300,
            lineHeight: 1.85,
            color: 'var(--color-text)',
            margin: 0,
          }}
        >
          Chandi Silver Studio was born from a deeply personal journey into crystal healing and
          spirituality. We believe jewellery should do more than look beautiful — it should mean
          something. Every piece you wear is a reminder of what you are calling into your life.
        </p>

        {/* Gold divider */}
        <div style={{ width: 56, height: 1, background: 'var(--color-gold)', margin: '52px auto' }} />

        {/* Three pillars */}
        <div className="brand-pillars-grid">
          {PILLARS.map(({ Icon, heading, description }) => (
            <div
              key={heading}
              style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}
            >
              <Icon size={22} strokeWidth={1.5} color="var(--color-gold)" />
              <p
                style={{
                  fontFamily: 'var(--font-sans, "DM Sans", sans-serif)',
                  fontSize: 12,
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                  fontWeight: 500,
                  color: 'var(--color-text)',
                  margin: '14px 0 8px',
                }}
              >
                {heading}
              </p>
              <p
                style={{
                  fontFamily: 'var(--font-sans, "DM Sans", sans-serif)',
                  fontSize: 13,
                  fontWeight: 300,
                  lineHeight: 1.65,
                  color: 'var(--color-muted)',
                  margin: 0,
                }}
              >
                {description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
