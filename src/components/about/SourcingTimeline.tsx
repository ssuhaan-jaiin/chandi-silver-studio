'use client'

import { useEffect, useRef } from 'react'
import Image from 'next/image'

interface SourcingPhoto {
  photoUrl: string
  caption: string
  location: string
  year: string
}

interface SourcingTimelineProps {
  photos: SourcingPhoto[]
}

export default function SourcingTimeline({ photos }: SourcingTimelineProps) {
  const itemRefs = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible')
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.2 }
    )
    itemRefs.current.forEach((el) => { if (el) observer.observe(el) })
    return () => observer.disconnect()
  }, [])

  return (
    <>
      <style>{`
        .timeline-wrap {
          position: relative;
          max-width: 900px;
          margin: 0 auto;
          padding: 80px 24px;
        }
        .timeline-line {
          position: absolute;
          left: 50%;
          top: 0; bottom: 0;
          width: 1px;
          background: var(--color-gold);
          transform: translateX(-50%);
        }
        .timeline-item {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 40px;
          margin-bottom: 80px;
          align-items: center;
          position: relative;
          opacity: 0;
          transition: all 0.6s ease;
        }
        .timeline-item.even { --slide-dir: -30px; transform: translateX(-30px); }
        .timeline-item.odd  { --slide-dir: 30px;  transform: translateX(30px); }
        .timeline-item.visible { opacity: 1; transform: translateX(0); }
        .timeline-dot {
          position: absolute;
          left: 50%;
          top: 50%;
          transform: translate(-50%, -50%);
          width: 10px; height: 10px;
          background: var(--color-gold);
          border-radius: 50%;
        }
        .timeline-photo { position: relative; aspect-ratio: 4 / 3; width: 100%; }
        .timeline-text-even { order: -1; text-align: right; }
        .timeline-text-odd  { order: 1;  text-align: left; }
        @media (max-width: 680px) {
          .timeline-line { left: 24px; }
          .timeline-item {
            grid-template-columns: 1fr;
            padding-left: 52px;
          }
          .timeline-item.even,
          .timeline-item.odd  { transform: translateX(-30px); }
          .timeline-dot { left: 24px; top: 20px; transform: translate(-50%, 0); }
          .timeline-text-even,
          .timeline-text-odd  { order: 0; text-align: left; }
        }
      `}</style>

      <section style={{ background: 'var(--color-bg)' }}>
        <div style={{ maxWidth: 900, margin: '0 auto', padding: '80px 24px' }}>
          <h2
            style={{
              fontFamily: "'Times New Roman', Times, serif",
              fontWeight: 400, fontSize: 38, color: 'var(--color-text)',
              textAlign: 'center', marginBottom: 60,
            }}
          >
            Sourcing Journeys
          </h2>

          <div className="timeline-wrap" style={{ padding: 0 }}>
            <div className="timeline-line" />

            {photos.map((photo, i) => {
              const isEven = i % 2 === 0
              return (
                <div
                  key={i}
                  ref={(el) => { itemRefs.current[i] = el }}
                  className={`timeline-item ${isEven ? 'even' : 'odd'}`}
                >
                  <div className="timeline-dot" />

                  {/* Photo */}
                  <div
                    className="timeline-photo"
                    style={{ order: isEven ? 0 : 1 }}
                  >
                    <Image
                      src={photo.photoUrl}
                      alt={photo.caption}
                      fill
                      sizes="(max-width: 680px) 100vw, 420px"
                      style={{ objectFit: 'cover' }}
                    />
                  </div>

                  {/* Text */}
                  <div className={isEven ? 'timeline-text-even' : 'timeline-text-odd'} style={{ order: isEven ? 1 : 0 }}>
                    <span
                      style={{
                        display: 'inline-block',
                        fontFamily: 'var(--font-sans, "DM Sans", sans-serif)',
                        fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.1em',
                        color: 'var(--color-gold)', border: '1px solid var(--color-gold)',
                        padding: '4px 12px', marginBottom: 12,
                      }}
                    >
                      {photo.year}
                    </span>
                    <p
                      style={{
                        fontFamily: "'Times New Roman', Times, serif",
                        fontStyle: 'italic', fontSize: 22,
                        color: 'var(--color-text)', marginBottom: 8,
                      }}
                    >
                      {photo.location}
                    </p>
                    <p
                      style={{
                        fontFamily: 'var(--font-sans, "DM Sans", sans-serif)',
                        fontSize: 14, fontWeight: 300, lineHeight: 1.6,
                        color: 'var(--color-muted)', margin: 0,
                      }}
                    >
                      {photo.caption}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>
    </>
  )
}
