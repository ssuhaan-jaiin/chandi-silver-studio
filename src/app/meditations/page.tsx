import { Suspense } from 'react'
import type { Metadata } from 'next'
import { Sparkles } from 'lucide-react'
import { sanityClient } from '@/lib/sanity'
import MeditationFilters from '@/components/meditations/MeditationFilters'
import MeditationGrid from '@/components/meditations/MeditationGrid'
import { buildMetadata } from '@/lib/seo'

export const revalidate = 1800

export const metadata: Metadata = buildMetadata({
  title: 'Guided Meditations',
  description:
    'Free and premium guided meditations for every intention. Find your peace with crystal healing practices from Chandi Silver Studio.',
})

interface Track {
  _id: string
  title: string
  intention: string
  description: string
  videoUrl: string
  previewClip?: string
  duration: string
  isPremium: boolean
  coverImageUrl: string
}

const SANITY_QUERY = `*[_type == "meditationTrack"] | order(_createdAt desc) {
  _id, title, intention, description, videoUrl,
  previewClip, duration, isPremium,
  "coverImageUrl": coverImage.asset->url
}`

const MOCK_TRACKS: Track[] = [
  {
    _id: '1', title: 'Morning Heart Opening', intention: 'Love',
    description: 'A gentle morning meditation to open your heart chakra.',
    videoUrl: 'https://www.youtube.com/embed/placeholder',
    duration: '12 min', isPremium: false, coverImageUrl: '/images/back.png',
  },
  {
    _id: '2', title: 'Anxiety Release', intention: 'Anxiety',
    description: 'Release tension and find stillness with this calming practice.',
    videoUrl: 'https://www.youtube.com/embed/placeholder',
    duration: '18 min', isPremium: false, coverImageUrl: '/images/back2.png',
  },
  {
    _id: '3', title: 'Deep Protection Shield', intention: 'Protection',
    description: 'Build an energetic shield for your day ahead.',
    videoUrl: 'https://www.youtube.com/embed/placeholder',
    duration: '20 min', isPremium: true, coverImageUrl: '/images/back3.png',
  },
  {
    _id: '4', title: 'Root & Ground', intention: 'Grounding',
    description: 'Come back to your body and find your centre.',
    videoUrl: 'https://www.youtube.com/embed/placeholder',
    duration: '15 min', isPremium: false, coverImageUrl: '/images/back4.png',
  },
  {
    _id: '5', title: 'Sleep Descent', intention: 'Sleep',
    description: 'Drift into deep, restful sleep guided by crystal energy.',
    videoUrl: 'https://www.youtube.com/embed/placeholder',
    duration: '25 min', isPremium: true, coverImageUrl: '/images/back.png',
  },
  {
    _id: '6', title: 'Crystal Clarity', intention: 'Clarity',
    description: 'Clear mental fog and align with your true purpose.',
    videoUrl: 'https://www.youtube.com/embed/placeholder',
    duration: '14 min', isPremium: true, coverImageUrl: '/images/back2.png',
  },
]

async function fetchTracks(): Promise<Track[]> {
  try {
    const data = await sanityClient.fetch<Track[]>(SANITY_QUERY)
    return data && data.length > 0 ? data : MOCK_TRACKS
  } catch {
    return MOCK_TRACKS
  }
}

export default async function MeditationsPage() {
  const tracks = await fetchTracks()

  return (
    <>
      <style>{`
        .med-hero-heading { font-size: 56px; }
        @media (max-width: 640px) { .med-hero-heading { font-size: 36px; } }
      `}</style>

      <main style={{ paddingTop: 80 }}>
        {/* Page header */}
        <div
          style={{
            background: 'linear-gradient(160deg, var(--color-lavender) 0%, var(--color-bg) 60%)',
            padding: '80px 24px 64px',
          }}
        >
          <div style={{ textAlign: 'center', maxWidth: 700, margin: '0 auto' }}>
            <Sparkles
              size={24}
              stroke="var(--color-gold)"
              strokeWidth={1.5}
              style={{ marginBottom: 16, display: 'block', margin: '0 auto 16px' }}
            />
            <h1
              className="med-hero-heading"
              style={{
                fontFamily: "'Times New Roman', Times, serif",
                fontWeight: 400, color: 'var(--color-text)',
                lineHeight: 1.1, marginBottom: 12,
              }}
            >
              Find Your Peace
            </h1>
            <p
              style={{
                fontFamily: 'var(--font-sans, "DM Sans", sans-serif)',
                fontSize: 16, fontWeight: 300, color: 'var(--color-muted)',
                marginBottom: 48,
              }}
            >
              Guided meditations for every intention
            </p>

            {/* Filters */}
            <Suspense>
              <MeditationFilters />
            </Suspense>
          </div>
        </div>

        {/* Grid */}
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <Suspense>
            <MeditationGrid tracks={tracks} />
          </Suspense>
        </div>
      </main>
    </>
  )
}
