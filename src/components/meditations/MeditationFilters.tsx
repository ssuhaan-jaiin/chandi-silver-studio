'use client'

import { useRouter, useSearchParams, usePathname } from 'next/navigation'

const INTENTIONS = ['Love', 'Anxiety', 'Protection', 'Grounding', 'Sleep', 'Clarity', 'Abundance']

export default function MeditationFilters() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const active = searchParams.get('intention') ?? 'All'

  function select(value: string) {
    const params = new URLSearchParams(searchParams.toString())
    if (value === 'All') {
      params.delete('intention')
    } else {
      params.set('intention', value)
    }
    router.push(`${pathname}?${params.toString()}`)
  }

  const pills = ['All', ...INTENTIONS]

  return (
    <div
      style={{
        display: 'flex', flexWrap: 'wrap', justifyContent: 'center',
        gap: 10, marginBottom: 56,
      }}
    >
      {pills.map((pill) => {
        const isActive = pill === active || (pill === 'All' && active === 'All')
        return (
          <button
            key={pill}
            onClick={() => select(pill)}
            style={{
              padding: '8px 22px',
              border: `1px solid ${isActive ? 'var(--color-gold)' : 'var(--color-border)'}`,
              background: isActive ? 'var(--color-gold)' : 'var(--color-white)',
              color: isActive ? 'white' : 'var(--color-text)',
              fontFamily: 'var(--font-sans, "DM Sans", sans-serif)',
              fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.1em',
              borderRadius: 100,
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
          >
            {pill}
          </button>
        )
      })}
    </div>
  )
}
