'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { useLogoContext } from '@/context/LogoContext'

type LogoTarget = { top: number; left: number; width: number; height: number }

export default function HeroSection() {
  const { navLogoRef, showNavLogo } = useLogoContext()

  const [logoMoved, setLogoMoved] = useState(false)
  const [logoTarget, setLogoTarget] = useState<LogoTarget | null>(null)
  const [overlayLogoVisible, setOverlayLogoVisible] = useState(true)
  const [overlayFading, setOverlayFading] = useState(false)
  const [overlayGone, setOverlayGone] = useState(false)
  const [heroVisible, setHeroVisible] = useState(false)

  const roseRef = useRef<HTMLDivElement>(null)
  const amethystRef = useRef<HTMLDivElement>(null)
  const moonstoneRef = useRef<HTMLDivElement>(null)
  const crystal4Ref = useRef<HTMLDivElement>(null)
  const crystal5Ref = useRef<HTMLDivElement>(null)
  const crystal6Ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const t1 = setTimeout(() => {
      // Capture exact navbar logo position for pixel-perfect fly-to target
      if (navLogoRef.current) {
        const rect = navLogoRef.current.getBoundingClientRect()
        setLogoTarget({ top: rect.top, left: rect.left, width: rect.width, height: rect.height })
      }
      setLogoMoved(true)
    }, 1200)

    const t2 = setTimeout(() => setOverlayFading(true), 2000)
    const t3 = setTimeout(() => setHeroVisible(true), 2200)

    // Instant swap: overlay logo out, navbar logo in — same frame
    const t4 = setTimeout(() => {
      setOverlayLogoVisible(false)
      showNavLogo()
    }, 2400)

    // DOM cleanup after overlay background finishes fading (starts 2000ms, 900ms duration)
    const t5 = setTimeout(() => setOverlayGone(true), 3000)

    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
      clearTimeout(t3)
      clearTimeout(t4)
      clearTimeout(t5)
    }
  }, [navLogoRef, showNavLogo])

  useEffect(() => {
    const handleScroll = () => {
      const sy = window.scrollY
      if (roseRef.current) {
        roseRef.current.style.transform = `translateY(${-sy * 0.18}px) translateX(${Math.sin(sy * 0.008) * 24}px) rotate(${sy * 0.03}deg)`
      }
      if (amethystRef.current) {
        amethystRef.current.style.transform = `translateY(${-sy * 0.12}px) rotate(${-sy * 0.02}deg)`
      }
      if (moonstoneRef.current) {
        moonstoneRef.current.style.transform = `translateY(${-sy * 0.22}px)`
      }
      if (crystal4Ref.current) {
        crystal4Ref.current.style.transform = `translateY(${-sy * 0.15}px) rotate(${sy * 0.015}deg)`
      }
      if (crystal5Ref.current) {
        crystal5Ref.current.style.transform = `translateY(${-sy * 0.20}px)`
      }
      if (crystal6Ref.current) {
        crystal6Ref.current.style.transform = `translateY(${-sy * 0.10}px) rotate(${-sy * 0.025}deg)`
      }
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const flyingStyle: React.CSSProperties = (logoMoved && logoTarget)
    ? {
        position: 'absolute',
        top: logoTarget.top,
        left: logoTarget.left,
        width: logoTarget.width,
        transform: 'none',
        transition: 'top 1s cubic-bezier(0.76, 0, 0.24, 1), left 1s cubic-bezier(0.76, 0, 0.24, 1), width 1s cubic-bezier(0.76, 0, 0.24, 1), transform 1s cubic-bezier(0.76, 0, 0.24, 1)',
      }
    : {
        position: 'absolute',
        top: '50%',
        left: '50%',
        width: 180,
        transform: 'translate(-50%, -50%)',
        transition: 'top 1s cubic-bezier(0.76, 0, 0.24, 1), left 1s cubic-bezier(0.76, 0, 0.24, 1), width 1s cubic-bezier(0.76, 0, 0.24, 1), transform 1s cubic-bezier(0.76, 0, 0.24, 1)',
      }

  return (
    <>
      <style>{`
        @keyframes floatD {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50%       { transform: translateY(-16px) rotate(-4deg); }
        }
        @keyframes floatE {
          0%, 100% { transform: translateY(0px); }
          40%       { transform: translateY(-12px) rotate(2deg); }
          80%       { transform: translateY(-8px) rotate(-1deg); }
        }
        @keyframes floatF {
          0%, 100% { transform: translateY(0px); }
          50%       { transform: translateY(-18px) rotate(3deg); }
        }
        @media (max-width: 767px) {
          .crystal4-container,
          .crystal5-container,
          .crystal6-container { display: none; }
        }
      `}</style>

      {/* INTRO OVERLAY — background and logo are separate so swap is instant */}
      {!overlayGone && (
        <>
          {/* Gold background — fades from 2000ms over 900ms */}
          <div
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 100,
              background: 'var(--color-gold-dark)',
              opacity: overlayFading ? 0 : 1,
              transition: 'opacity 0.9s ease',
              pointerEvents: overlayFading ? 'none' : 'auto',
            }}
          />

          {/* Overlay logo — removed from DOM instantly at 2400ms for seamless swap */}
          {overlayLogoVisible && (
            <div
              style={{
                position: 'fixed',
                inset: 0,
                zIndex: 101,
                pointerEvents: 'none',
              }}
            >
              <div style={flyingStyle}>
                <Image
                  src="/images/logo1.png"
                  alt="Chandi Silver Studio"
                  width={180}
                  height={180}
                  priority
                  style={{ filter: 'brightness(10)', width: '100%', height: 'auto', display: 'block' }}
                />
              </div>
            </div>
          )}
        </>
      )}

      {/* HERO SECTION */}
      <section
        style={{
          height: '100svh',
          position: 'relative',
          overflow: 'hidden',
          background: heroVisible ? 'var(--color-bg)' : 'var(--color-gold-dark)',
          transition: 'background-color 1.4s ease',
        }}
      >
        {/* LAYER 1 — Background crystals */}
        <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
          {/* Desktop: 4 corners */}
          <div
            className="hidden md:block"
            style={{ position: 'absolute', top: '-5%', left: '-5%', width: 280, height: 280, transform: 'rotate(-7deg)' }}
          >
            <Image src="/images/back.png" alt="" width={280} height={280}
              style={{ width: '100%', height: '100%', objectFit: 'contain', opacity: 0.08 }}
            />
          </div>
          <div
            className="hidden md:block"
            style={{ position: 'absolute', top: '10%', right: '-3%', width: 240, height: 240, transform: 'rotate(5deg)' }}
          >
            <Image src="/images/back2.png" alt="" width={240} height={240}
              style={{ width: '100%', height: '100%', objectFit: 'contain', opacity: 0.08 }}
            />
          </div>
          <div
            className="hidden md:block"
            style={{ position: 'absolute', bottom: '-5%', left: '5%', width: 260, height: 260, transform: 'rotate(4deg)' }}
          >
            <Image src="/images/back3.png" alt="" width={260} height={260}
              style={{ width: '100%', height: '100%', objectFit: 'contain', opacity: 0.08 }}
            />
          </div>
          <div
            className="hidden md:block"
            style={{ position: 'absolute', bottom: '0%', right: '8%', width: 220, height: 220, transform: 'rotate(-5deg)' }}
          >
            <Image src="/images/back4.png" alt="" width={220} height={220}
              style={{ width: '100%', height: '100%', objectFit: 'contain', opacity: 0.08 }}
            />
          </div>

          {/* Mobile: 2 corners */}
          <div
            className="md:hidden"
            style={{ position: 'absolute', top: '-5%', left: '-5%', width: 150, height: 150, transform: 'rotate(-7deg)' }}
          >
            <Image src="/images/back.png" alt="" width={150} height={150}
              style={{ width: '100%', height: '100%', objectFit: 'contain', opacity: 0.08 }}
            />
          </div>
          <div
            className="md:hidden"
            style={{ position: 'absolute', bottom: '0%', right: '-3%', width: 150, height: 150, transform: 'rotate(5deg)' }}
          >
            <Image src="/images/back2.png" alt="" width={150} height={150}
              style={{ width: '100%', height: '100%', objectFit: 'contain', opacity: 0.08 }}
            />
          </div>
        </div>

        {/* LAYER 2 — Parallax crystals */}
        <div style={{ position: 'absolute', inset: 0, zIndex: 10, pointerEvents: 'none' }}>
          {/* Rose Quartz */}
          <div ref={roseRef} style={{ position: 'absolute', left: '6%', top: '25%' }}>
            <div className="crystal-float-a" style={{ filter: 'drop-shadow(0 12px 32px rgba(201,169,110,0.25))' }}>
              <Image src="/images/crystal-rose-quartz.png" alt="" width={140} height={160}
                className="crystal-rose-img" style={{ display: 'block' }}
              />
            </div>
          </div>

          {/* Amethyst */}
          <div ref={amethystRef} style={{ position: 'absolute', right: '8%', top: '15%' }}>
            <div className="crystal-float-b">
              <Image src="/images/crystal-amethyst.png" alt="" width={120} height={150}
                className="crystal-amethyst-img" style={{ display: 'block' }}
              />
            </div>
          </div>

          {/* Moonstone */}
          <div ref={moonstoneRef} className="crystal-moonstone-container"
            style={{ position: 'absolute', left: '18%', bottom: '20%' }}
          >
            <div className="crystal-float-c">
              <Image src="/images/crystal-moonstone.png" alt="" width={100} height={120}
                style={{ display: 'block' }}
              />
            </div>
          </div>

          {/* Crystal 4 */}
          <div ref={crystal4Ref} className="crystal4-container"
            style={{ position: 'absolute', right: '22%', bottom: '12%' }}
          >
            <div style={{ animation: 'floatD 10s ease-in-out 2s infinite',
              filter: 'drop-shadow(0 8px 20px rgba(201,169,110,0.2))' }}
            >
              <Image src="/images/crystal4.png" alt="" width={90} height={110} style={{ display: 'block' }} />
            </div>
          </div>

          {/* Crystal 5 */}
          <div ref={crystal5Ref} className="crystal5-container"
            style={{ position: 'absolute', left: '40%', top: '5%' }}
          >
            <div style={{ animation: 'floatE 11s ease-in-out 4s infinite',
              filter: 'drop-shadow(0 8px 20px rgba(201,169,110,0.2))' }}
            >
              <Image src="/images/crystal5.png" alt="" width={80} height={95} style={{ display: 'block' }} />
            </div>
          </div>

          {/* Crystal 6 */}
          <div ref={crystal6Ref} className="crystal6-container"
            style={{ position: 'absolute', right: '5%', bottom: '35%' }}
          >
            <div style={{ animation: 'floatF 8s ease-in-out 1s infinite',
              filter: 'drop-shadow(0 8px 20px rgba(201,169,110,0.2))' }}
            >
              <Image src="/images/crystal6.png" alt="" width={85} height={100} style={{ display: 'block' }} />
            </div>
          </div>
        </div>

        {/* LAYER 3 — Foreground text */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            zIndex: 20,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            padding: '0 24px',
            opacity: heroVisible ? 1 : 0,
            transform: heroVisible ? 'translateY(0)' : 'translateY(20px)',
            transition: 'opacity 1.1s ease 0.5s, transform 1.1s ease 0.5s',
          }}
        >
          <p
            style={{
              fontFamily: 'var(--font-sans, "DM Sans", sans-serif)',
              fontSize: 11,
              textTransform: 'uppercase',
              letterSpacing: '0.18em',
              color: 'var(--color-gold)',
              fontWeight: 400,
              margin: '0 0 20px',
            }}
          >
            Intentional Gemstone Jewellery
          </p>

          <div style={{ width: 48, height: 1, background: 'var(--color-gold)', margin: '0 auto 28px' }} />

          <h1
            className="hero-headline"
            style={{
              fontFamily: "'Times New Roman', Times, serif",
              fontWeight: 400,
              lineHeight: 1.08,
              letterSpacing: '0.015em',
              color: 'var(--color-text)',
              margin: '0 0 24px',
            }}
          >
            Timeless Intentional
            <br />
            Jewellery
          </h1>

          <p
            style={{
              fontFamily: 'var(--font-sans, "DM Sans", sans-serif)',
              fontSize: 16,
              fontWeight: 300,
              lineHeight: 1.75,
              color: 'var(--color-muted)',
              maxWidth: 440,
              margin: '0 auto 44px',
            }}
          >
            Thoughtfully sourced gemstone jewellery, designed with emotional meaning.
          </p>

          <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', justifyContent: 'center' }}>
            <Link href="/shop" className="hero-btn-primary">Shop Now</Link>
            <Link href="/about" className="hero-btn-secondary">Our Story</Link>
          </div>
        </div>

        {/* Scroll indicator */}
        <div
          className="hero-scroll-indicator hero-scroll-anim"
          style={{
            position: 'absolute',
            bottom: 28,
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <div style={{ width: 1, height: 44, background: 'var(--color-gold)', marginBottom: 4 }} />
          <ChevronDown size={16} color="var(--color-gold)" />
        </div>
      </section>
    </>
  )
}
