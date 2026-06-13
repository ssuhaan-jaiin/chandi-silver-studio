'use client'

import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import { X } from 'lucide-react'

interface ActiveFiltersProps {
  activeFilters: Record<string, string>
}

const FILTER_LABELS: Record<string, string> = {
  type:      'Type',
  intention: 'Intention',
  crystal:   'Crystal',
  price:     'Price',
}

const PRICE_LABELS: Record<string, string> = {
  '0-100':   '£0–£100',
  '100-200': '£100–£200',
  '200-300': '£200–£300',
  '300-999': '£300+',
}

function formatValue(key: string, value: string): string {
  if (key === 'price') return PRICE_LABELS[value] ?? value
  return value
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ')
}

export default function ActiveFilters({ activeFilters }: ActiveFiltersProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  // Only show type, intention, crystal, price — not sort
  const filterEntries = Object.entries(activeFilters).filter(
    ([key]) => key in FILTER_LABELS
  )

  if (filterEntries.length === 0) return null

  function removeSingleValue(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString())
    const current = params.get(key)?.split(',').filter(Boolean) ?? []
    const next = current.filter((v) => v !== value)
    if (next.length > 0) params.set(key, next.join(','))
    else params.delete(key)
    router.push(`${pathname}?${params.toString()}`)
  }

  // Expand comma-separated values into individual pills
  const pills: Array<{ key: string; value: string; label: string }> = []
  for (const [key, rawValue] of filterEntries) {
    const values = rawValue.split(',').filter(Boolean)
    for (const value of values) {
      pills.push({
        key,
        value,
        label: `${FILTER_LABELS[key]}: ${formatValue(key, value)}`,
      })
    }
  }

  return (
    <div
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: 8,
        marginBottom: 24,
      }}
    >
      {pills.map(({ key, value, label }) => (
        <div
          key={`${key}-${value}`}
          style={{
            background: 'var(--color-gold)',
            color: 'var(--color-white)',
            fontFamily: 'var(--font-sans, "DM Sans", sans-serif)',
            fontSize: 11,
            fontWeight: 400,
            padding: '6px 12px',
            borderRadius: 0,
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            animation: 'filterPillIn 0.2s ease',
          }}
        >
          <style>{`
            @keyframes filterPillIn { from { opacity: 0 } to { opacity: 1 } }
          `}</style>
          {label}
          <button
            onClick={() => removeSingleValue(key, value)}
            aria-label={`Remove filter: ${label}`}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: 0,
              display: 'flex',
              alignItems: 'center',
              color: 'var(--color-white)',
            }}
          >
            <X size={12} strokeWidth={2} />
          </button>
        </div>
      ))}
    </div>
  )
}
