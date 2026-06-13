'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Clock, Lock } from 'lucide-react'

interface MeditationCardProps {
  _id: string
  title: string
  intention: string
  description: string
  videoUrl: string
  duration: string
  isPremium: boolean
  coverImageUrl: string
}

function isYouTube(url: string): boolean {
  return url.includes('youtube.com') || url.includes('youtu.be')
}

export default function MeditationCard({
  title,
  intention,
  description,
  videoUrl,
  duration,
  isPremium,
  coverImageUrl,
}: MeditationCardProps) {
  const [expanded, setExpanded] = useState(false)

  return (
    <>
      <style>{`
        .mc-card { transition: box-shadow 0.3s ease; }
        .mc-card:hover { box-shadow: 0 8px 32px rgba(44,44,44,0.08); }
        .mc-player {
          max-height: 0; opacity: 0; overflow: hidden;
          transition: max-height 0.4s ease, opacity 0.4s ease;
        }
        .mc-player.open { max-height: 400px; opacity: 1; }
      `}</style>

      <div
        className="mc-card"
        style={{
          background: 'var(--color-white)',
          border: '1px solid var(--color-border)',
          borderRadius: 0,
          overflow: 'hidden',
        }}
      >
        {/* Image area */}
        <div style={{ aspectRatio: '16 / 9', position: 'relative', overflow: 'hidden' }}>
          <Image
            src={coverImageUrl}
            alt={title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            style={{ objectFit: 'cover' }}
          />

          {/* Premium overlay */}
          {isPremium && (
            <div
              style={{
                position: 'absolute', inset: 0, zIndex: 2,
                background: 'rgba(44,44,44,0.5)',
                display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center',
              }}
            >
              <Lock size={28} stroke="white" strokeWidth={1.5} />
              <p
                style={{
                  fontFamily: 'var(--font-sans, "DM Sans", sans-serif)',
                  fontSize: 11, color: 'white', textTransform: 'uppercase',
                  letterSpacing: '0.1em', margin: '6px 0 0',
                }}
              >
                Premium
              </p>
            </div>
          )}

          {/* Badge */}
          <div
            style={{
              position: 'absolute', top: 12, right: 12, zIndex: 3,
              background: isPremium ? 'var(--color-gold)' : '#3A6B47',
              color: 'white',
              fontFamily: 'var(--font-sans, "DM Sans", sans-serif)',
              fontSize: 9, textTransform: 'uppercase', letterSpacing: '0.1em',
              padding: '4px 10px',
            }}
          >
            {isPremium ? 'Premium' : 'Free'}
          </div>
        </div>

        {/* Content */}
        <div style={{ padding: 20 }}>
          {intention && (
            <span
              style={{
                display: 'inline-block',
                background: 'var(--color-lavender)', color: 'var(--color-text)',
                fontFamily: 'var(--font-sans, "DM Sans", sans-serif)',
                fontSize: 9, textTransform: 'uppercase', letterSpacing: '0.08em',
                padding: '3px 10px', marginBottom: 10,
              }}
            >
              {intention}
            </span>
          )}

          <p
            style={{
              fontFamily: "'Times New Roman', Times, serif",
              fontWeight: 400, fontSize: 20, color: 'var(--color-text)',
              lineHeight: 1.3, marginBottom: 8,
            }}
          >
            {title}
          </p>

          <p
            style={{
              fontFamily: 'var(--font-sans, "DM Sans", sans-serif)',
              fontSize: 13, fontWeight: 300, lineHeight: 1.6,
              color: 'var(--color-muted)', marginBottom: 16,
              display: '-webkit-box', WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical', overflow: 'hidden',
            } as React.CSSProperties}
          >
            {description}
          </p>

          {/* Duration row */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              <Clock size={12} stroke="var(--color-muted)" strokeWidth={1.5} />
              <span
                style={{
                  fontFamily: 'var(--font-sans, "DM Sans", sans-serif)',
                  fontSize: 11, color: 'var(--color-muted)',
                }}
              >
                {duration}
              </span>
            </div>

            {isPremium ? (
              <Link
                href="/meditations/premium"
                style={{
                  display: 'inline-block',
                  border: '1px solid var(--color-gold)',
                  color: 'var(--color-gold)', background: 'transparent',
                  fontFamily: 'var(--font-sans, "DM Sans", sans-serif)',
                  fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.1em',
                  padding: '8px 16px', textDecoration: 'none',
                }}
              >
                Unlock Full Track
              </Link>
            ) : (
              <button
                onClick={() => setExpanded(true)}
                style={{
                  background: 'var(--color-gold)', color: 'white', border: 'none',
                  fontFamily: 'var(--font-sans, "DM Sans", sans-serif)',
                  fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.1em',
                  padding: '8px 16px', cursor: 'pointer',
                }}
              >
                ▶ Play Meditation
              </button>
            )}
          </div>
        </div>

        {/* Expanded video player */}
        <div className={`mc-player${expanded ? ' open' : ''}`}>
          <div style={{ padding: '0 20px 8px', textAlign: 'right' }}>
            <button
              onClick={() => setExpanded(false)}
              style={{
                fontFamily: 'var(--font-sans, "DM Sans", sans-serif)',
                fontSize: 11, color: 'var(--color-muted)', background: 'none',
                border: 'none', cursor: 'pointer', padding: '8px 0',
              }}
            >
              ✕ Close
            </button>
          </div>
          <div style={{ width: '100%', aspectRatio: '16 / 9', background: 'black' }}>
            {isYouTube(videoUrl) ? (
              <iframe
                src={`${videoUrl}?autoplay=1&rel=0`}
                width="100%"
                height="100%"
                allow="autoplay; fullscreen"
                frameBorder="0"
                title={title}
                style={{ display: 'block', border: 'none' }}
              />
            ) : (
              <video controls autoPlay width="100%" height="100%" style={{ display: 'block' }}>
                <source src={videoUrl} />
              </video>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
