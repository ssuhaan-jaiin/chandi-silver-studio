'use client'

import { useSearchParams } from 'next/navigation'
import MeditationCard from './MeditationCard'

interface Track {
  _id: string
  title: string
  intention: string
  description: string
  videoUrl: string
  duration: string
  isPremium: boolean
  coverImageUrl: string
}

interface MeditationGridProps {
  tracks: Track[]
}

export default function MeditationGrid({ tracks }: MeditationGridProps) {
  const searchParams = useSearchParams()
  const active = searchParams.get('intention')

  const filtered = active
    ? tracks.filter((t) => t.intention === active)
    : tracks

  return (
    <>
      <style>{`
        .med-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 28px;
        }
        @media (max-width: 900px) {
          .med-grid { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 580px) {
          .med-grid { grid-template-columns: 1fr; }
        }
      `}</style>

      <div
        style={{
          background: 'var(--color-bg)',
          padding: '0 24px 100px',
          maxWidth: 1200, margin: '0 auto',
        }}
      >
        {filtered.length === 0 ? (
          <div style={{ textAlign: 'center', paddingTop: 60 }}>
            <p
              style={{
                fontFamily: "'Times New Roman', Times, serif",
                fontWeight: 400, fontSize: 24, color: 'var(--color-muted)',
              }}
            >
              No meditations found for this intention.
            </p>
          </div>
        ) : (
          <div className="med-grid">
            {filtered.map((track) => (
              <MeditationCard key={track._id} {...track} />
            ))}
          </div>
        )}
      </div>
    </>
  )
}
