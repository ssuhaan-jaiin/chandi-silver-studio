import type { Metadata } from 'next'
import Image from 'next/image'
import { BadgeCheck, Leaf, Heart, Sparkles } from 'lucide-react'
import { buildMetadata } from '@/lib/seo'

export const revalidate = 86400

export const metadata: Metadata = buildMetadata({
  title: 'Our Story',
  description:
    'The story behind Chandi Silver Studio — a Crystal Healing Diploma holder and Reiki Level 2 practitioner sourcing intentional gems worldwide.',
})
import { PortableText } from '@portabletext/react'
import { sanityClient } from '@/lib/sanity'
import SourcingTimeline from '@/components/about/SourcingTimeline'

interface SourcingPhoto {
  photoUrl: string
  caption: string
  location: string
  year: string
}

interface AboutContent {
  founderName: string
  founderTitle: string
  founderPhotoUrl: string
  story: unknown[] | null
  sourcingPhotos: SourcingPhoto[]
}

const ABOUT_QUERY = `*[_type == "aboutContent"][0] {
  founderName, founderTitle,
  "founderPhotoUrl": founderPhoto.asset->url,
  story,
  sourcingPhotos[] {
    caption, location, year,
    "photoUrl": photo.asset->url
  }
}`

const MOCK_ABOUT: AboutContent = {
  founderName: 'Chandi',
  founderTitle: 'Founder & Crystal Healing Practitioner',
  founderPhotoUrl: '/images/back.png',
  story: null,
  sourcingPhotos: [
    { photoUrl: '/images/back.png',  caption: 'Jaipur Gem Show 2023',       location: 'Jaipur, India',   year: '2023' },
    { photoUrl: '/images/back2.png', caption: 'Crystal sourcing in Rajasthan', location: 'Rajasthan, India', year: '2023' },
    { photoUrl: '/images/back3.png', caption: 'London Gem Fair',             location: 'London, UK',      year: '2024' },
    { photoUrl: '/images/back4.png', caption: 'Selecting moonstone',         location: 'Mumbai, India',   year: '2024' },
  ],
}

async function fetchAbout(): Promise<AboutContent> {
  try {
    const data = await sanityClient.fetch<AboutContent | null>(ABOUT_QUERY)
    return data ?? MOCK_ABOUT
  } catch {
    return MOCK_ABOUT
  }
}

const VALUES = [
  {
    Icon: Leaf,
    title: 'Intentional',
    text: 'Every piece begins with a purpose, not a trend.',
  },
  {
    Icon: Heart,
    title: 'Ethical',
    text: 'Responsibly sourced from trusted suppliers worldwide.',
  },
  {
    Icon: Sparkles,
    title: 'Meaningful',
    text: 'Jewellery that carries energy, intention, and story.',
  },
]

const CERTS = [
  { title: 'Crystal Healing Diploma', subtitle: 'Certified Crystal Healing Practitioner' },
  { title: 'Reiki Level 2', subtitle: 'Usui Reiki Ryoho Practitioner' },
]

export default async function AboutPage() {
  const about = await fetchAbout()

  return (
    <>
      <style>{`
        .about-hero-h1 { font-size: 56px; }
        .about-founder-grid { display: grid; grid-template-columns: 35% 65%; gap: 60px; align-items: start; }
        .about-certs-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; }
        .about-values-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 40px; }
        @media (max-width: 768px) {
          .about-hero-h1 { font-size: 36px; }
          .about-founder-grid { grid-template-columns: 1fr; gap: 32px; }
          .about-certs-grid { grid-template-columns: 1fr; }
          .about-values-grid { grid-template-columns: 1fr; gap: 32px; }
        }
      `}</style>

      <main style={{ paddingTop: 80 }}>

        {/* Section 1 — Hero */}
        <section
          style={{
            background: 'linear-gradient(to bottom, var(--color-blush) 0%, var(--color-bg) 100%)',
            padding: '100px 24px 80px',
            textAlign: 'center',
          }}
        >
          <p
            style={{
              fontFamily: 'var(--font-sans, "DM Sans", sans-serif)',
              fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.16em',
              color: 'var(--color-gold)', marginBottom: 20,
            }}
          >
            Our Story
          </p>
          <h1
            className="about-hero-h1"
            style={{
              fontFamily: "'Times New Roman', Times, serif",
              fontWeight: 400, color: 'var(--color-text)',
              lineHeight: 1.1, marginBottom: 8,
            }}
          >
            More than jewellery.
          </h1>
          <h2
            className="about-hero-h1"
            style={{
              fontFamily: "'Times New Roman', Times, serif",
              fontStyle: 'italic', fontWeight: 400, color: 'var(--color-muted)',
              lineHeight: 1.1, marginBottom: 32,
            }}
          >
            A way of living.
          </h2>
          <p
            style={{
              fontFamily: 'var(--font-sans, "DM Sans", sans-serif)',
              fontSize: 16, fontWeight: 300, lineHeight: 1.8,
              color: 'var(--color-text)',
              maxWidth: 560, margin: '0 auto',
            }}
          >
            Chandi Silver Studio was born from a personal journey into crystal healing,
            spirituality, and the belief that what we wear should carry meaning.
          </p>
        </section>

        {/* Section 2 — Founder Story */}
        <section style={{ maxWidth: 760, margin: '0 auto', padding: '80px 24px' }}>
          <div className="about-founder-grid">
            {/* Photo */}
            <div style={{ position: 'relative', aspectRatio: '3 / 4', width: '100%' }}>
              <Image
                src={about.founderPhotoUrl ?? '/images/back.png'}
                alt={about.founderName ?? 'Founder'}
                fill
                sizes="(max-width: 768px) 100vw, 260px"
                style={{ objectFit: 'cover' }}
              />
            </div>

            {/* Text */}
            <div>
              <p
                style={{
                  fontFamily: "'Times New Roman', Times, serif",
                  fontWeight: 400, fontSize: 28, color: 'var(--color-text)',
                  marginBottom: 4,
                }}
              >
                {about.founderName ?? 'Chandi'}
              </p>
              <p
                style={{
                  fontFamily: 'var(--font-sans, "DM Sans", sans-serif)',
                  fontSize: 13, textTransform: 'uppercase', letterSpacing: '0.1em',
                  color: 'var(--color-gold)', marginBottom: 32,
                }}
              >
                {about.founderTitle ?? 'Founder & Crystal Healing Practitioner'}
              </p>

              {about.story ? (
                <div
                  style={{
                    fontFamily: 'var(--font-sans, "DM Sans", sans-serif)',
                    fontSize: 16, fontWeight: 300, lineHeight: 1.85,
                    color: 'var(--color-text)',
                  }}
                >
                  <PortableText value={about.story as Parameters<typeof PortableText>[0]['value']} />
                </div>
              ) : (
                <div
                  style={{
                    fontFamily: 'var(--font-sans, "DM Sans", sans-serif)',
                    fontSize: 16, fontWeight: 300, lineHeight: 1.85,
                    color: 'var(--color-text)',
                  }}
                >
                  <p style={{ marginBottom: 20 }}>
                    I started Chandi Silver Studio after a period of deep personal transformation. Struggling with anxiety and disconnection, I found my way back to myself through crystal healing — and everything changed.
                  </p>
                  <p style={{ marginBottom: 20 }}>
                    I began sourcing crystals directly from the mines and gem shows of India, forming relationships with the families who have worked these stones for generations. Each piece I bring home carries that story.
                  </p>
                  <p>
                    Chandi is not just jewellery. It is a reminder to live with intention — to wear what matters, and to let it matter.
                  </p>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Section 3 — Sourcing Timeline */}
        {about.sourcingPhotos && about.sourcingPhotos.length > 0 && (
          <SourcingTimeline photos={about.sourcingPhotos} />
        )}

        {/* Section 4 — Certifications */}
        <section
          style={{
            background: 'var(--color-blush)',
            padding: '80px 24px',
            textAlign: 'center',
          }}
        >
          <h2
            style={{
              fontFamily: "'Times New Roman', Times, serif",
              fontWeight: 400, fontSize: 36, color: 'var(--color-text)',
              marginBottom: 48,
            }}
          >
            Our Credentials
          </h2>
          <div
            className="about-certs-grid"
            style={{ maxWidth: 720, margin: '0 auto' }}
          >
            {CERTS.map(({ title, subtitle }) => (
              <div
                key={title}
                style={{
                  background: 'var(--color-white)',
                  padding: 40,
                  border: '1px solid var(--color-border)',
                  borderTop: '3px solid var(--color-gold)',
                  textAlign: 'center',
                }}
              >
                <BadgeCheck
                  size={32}
                  stroke="var(--color-gold)"
                  strokeWidth={1.5}
                  style={{ display: 'block', margin: '0 auto 16px' }}
                />
                <p
                  style={{
                    fontFamily: "'Times New Roman', Times, serif",
                    fontWeight: 400, fontSize: 22, color: 'var(--color-text)',
                    marginBottom: 8,
                  }}
                >
                  {title}
                </p>
                <p
                  style={{
                    fontFamily: 'var(--font-sans, "DM Sans", sans-serif)',
                    fontSize: 13, fontWeight: 300, color: 'var(--color-muted)',
                    margin: 0,
                  }}
                >
                  {subtitle}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Section 5 — Values */}
        <section
          style={{
            background: 'var(--color-bg)',
            padding: '80px 24px',
          }}
        >
          <div style={{ maxWidth: 900, margin: '0 auto', textAlign: 'center' }}>
            <h2
              style={{
                fontFamily: "'Times New Roman', Times, serif",
                fontWeight: 400, fontSize: 36, color: 'var(--color-text)',
                marginBottom: 56,
              }}
            >
              What we stand for
            </h2>
            <div className="about-values-grid">
              {VALUES.map(({ Icon, title, text }) => (
                <div key={title}>
                  <Icon
                    size={28}
                    stroke="var(--color-gold)"
                    strokeWidth={1.5}
                    style={{ display: 'block', margin: '0 auto 16px' }}
                  />
                  <p
                    style={{
                      fontFamily: "'Times New Roman', Times, serif",
                      fontWeight: 400, fontSize: 22, color: 'var(--color-text)',
                      marginBottom: 10,
                    }}
                  >
                    {title}
                  </p>
                  <p
                    style={{
                      fontFamily: 'var(--font-sans, "DM Sans", sans-serif)',
                      fontSize: 14, fontWeight: 300, lineHeight: 1.7,
                      color: 'var(--color-muted)', margin: 0,
                    }}
                  >
                    {text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

      </main>
    </>
  )
}
