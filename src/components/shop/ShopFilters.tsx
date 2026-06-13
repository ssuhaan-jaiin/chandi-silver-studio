'use client'

import { useState } from 'react'
import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import { SlidersHorizontal, Check } from 'lucide-react'
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '@/components/ui/accordion'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'

// ─── Filter definitions ─────────────────────────────────────────────────────

const TYPE_OPTIONS = [
  { label: 'Rings',     value: 'rings',     count: 3 },
  { label: 'Necklaces', value: 'necklaces', count: 2 },
  { label: 'Bracelets', value: 'bracelets', count: 2 },
  { label: 'Earrings',  value: 'earrings',  count: 2 },
]

const CRYSTAL_OPTIONS = [
  { label: 'Rose Quartz',     value: 'rose-quartz' },
  { label: 'Amethyst',        value: 'amethyst' },
  { label: 'Moonstone',       value: 'moonstone' },
  { label: 'Labradorite',     value: 'labradorite' },
  { label: 'Citrine',         value: 'citrine' },
  { label: 'Black Tourmaline',value: 'black-tourmaline' },
]

const INTENTION_OPTIONS = [
  { label: 'Love',           value: 'love' },
  { label: 'Anxiety Relief', value: 'anxiety-relief' },
  { label: 'Protection',     value: 'protection' },
  { label: 'Clarity',        value: 'clarity' },
  { label: 'Abundance',      value: 'abundance' },
  { label: 'Grounding',      value: 'grounding' },
  { label: 'Healing',        value: 'healing' },
  { label: 'Confidence',     value: 'confidence' },
]

const PRICE_OPTIONS = [
  { label: '£0–£100',   value: '0-100' },
  { label: '£100–£200', value: '100-200' },
  { label: '£200–£300', value: '200-300' },
  { label: '£300+',     value: '300-999' },
]

const SORT_OPTIONS = [
  { label: 'Newest',             value: 'newest' },
  { label: 'Price: Low to High', value: 'price-asc' },
  { label: 'Price: High to Low', value: 'price-desc' },
  { label: 'Bestselling',        value: 'bestselling' },
]

// ─── Helpers ────────────────────────────────────────────────────────────────

function useFilterActions() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  function getSelected(key: string): string[] {
    return searchParams.get(key)?.split(',').filter(Boolean) ?? []
  }

  function toggleMulti(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString())
    const current = getSelected(key)
    const idx = current.indexOf(value)
    const next = idx >= 0 ? current.filter((v) => v !== value) : [...current, value]
    if (next.length > 0) params.set(key, next.join(','))
    else params.delete(key)
    router.push(`${pathname}?${params.toString()}`)
  }

  function setSingle(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString())
    const current = params.get(key)
    if (current === value) params.delete(key)
    else params.set(key, value)
    router.push(`${pathname}?${params.toString()}`)
  }

  function clearAll() {
    router.push(pathname)
  }

  const hasFilters = ['type', 'intention', 'crystal', 'price', 'sort'].some(
    (k) => searchParams.has(k)
  )

  return { getSelected, toggleMulti, setSingle, clearAll, hasFilters }
}

// ─── Sub-components ──────────────────────────────────────────────────────────

function CheckboxRow({
  label,
  count,
  checked,
  onToggle,
}: {
  label: string
  count?: number
  checked: boolean
  onToggle: () => void
}) {
  return (
    <div
      onClick={onToggle}
      role="checkbox"
      aria-checked={checked}
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onToggle() }}
      style={{
        display: 'flex', alignItems: 'center', gap: 10,
        padding: '10px 0', cursor: 'pointer', minHeight: 44,
      }}
    >
      <div
        style={{
          width: 16, height: 16, flexShrink: 0,
          border: `1px solid ${checked ? 'var(--color-gold)' : 'var(--color-border)'}`,
          background: checked ? 'var(--color-gold)' : 'var(--color-white)',
          borderRadius: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          transition: 'background 0.15s ease, border-color 0.15s ease',
        }}
      >
        {checked && <Check size={10} stroke="white" strokeWidth={3} />}
      </div>
      <span
        style={{
          fontFamily: 'var(--font-sans, "DM Sans", sans-serif)',
          fontSize: 13, color: 'var(--color-text)', flex: 1,
        }}
      >
        {label}
      </span>
      {count !== undefined && (
        <span
          style={{
            fontFamily: 'var(--font-sans, "DM Sans", sans-serif)',
            fontSize: 11, color: 'var(--color-muted)',
          }}
        >
          ({count})
        </span>
      )}
    </div>
  )
}

function RadioRow({
  label,
  selected,
  onSelect,
}: {
  label: string
  selected: boolean
  onSelect: () => void
}) {
  return (
    <div
      onClick={onSelect}
      role="radio"
      aria-checked={selected}
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onSelect() }}
      style={{
        display: 'flex', alignItems: 'center', gap: 10,
        padding: '10px 0', cursor: 'pointer', minHeight: 44,
      }}
    >
      <div
        style={{
          width: 16, height: 16, flexShrink: 0,
          border: `1px solid ${selected ? 'var(--color-gold)' : 'var(--color-border)'}`,
          borderRadius: '50%',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          transition: 'border-color 0.15s ease',
        }}
      >
        {selected && (
          <div
            style={{
              width: 8, height: 8, borderRadius: '50%',
              background: 'var(--color-gold)',
            }}
          />
        )}
      </div>
      <span
        style={{
          fontFamily: 'var(--font-sans, "DM Sans", sans-serif)',
          fontSize: 13, color: 'var(--color-text)',
        }}
      >
        {label}
      </span>
    </div>
  )
}

// ─── Sidebar content (shared between desktop + mobile sheet) ─────────────────

function FilterContent({ actions }: { actions: ReturnType<typeof useFilterActions> }) {
  const searchParams = useSearchParams()
  const { getSelected, toggleMulti, setSingle, clearAll, hasFilters } = actions
  const currentPrice = searchParams.get('price') ?? ''
  const currentSort = searchParams.get('sort') ?? ''

  return (
    <div>
      <p
        style={{
          fontFamily: 'var(--font-sans, "DM Sans", sans-serif)',
          fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.14em',
          color: 'var(--color-muted)', marginBottom: 20,
        }}
      >
        Refine
      </p>

      <Accordion type="multiple" defaultValue={['jewellery-type', 'crystal-type']}>

        {/* Jewellery Type */}
        <AccordionItem value="jewellery-type" style={{ borderBottom: '1px solid var(--color-border)' }}>
          <AccordionTrigger
            className="!no-underline hover:!no-underline"
            style={{
              fontFamily: 'var(--font-sans, "DM Sans", sans-serif)',
              fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.1em',
              color: 'var(--color-text)', fontWeight: 400, padding: '14px 0',
            }}
          >
            Jewellery Type
          </AccordionTrigger>
          <AccordionContent style={{ padding: '4px 0 16px' }}>
            {TYPE_OPTIONS.map((opt) => (
              <CheckboxRow
                key={opt.value}
                label={opt.label}
                count={opt.count}
                checked={getSelected('type').includes(opt.value)}
                onToggle={() => toggleMulti('type', opt.value)}
              />
            ))}
          </AccordionContent>
        </AccordionItem>

        {/* Crystal Type */}
        <AccordionItem value="crystal-type" style={{ borderBottom: '1px solid var(--color-border)' }}>
          <AccordionTrigger
            className="!no-underline hover:!no-underline"
            style={{
              fontFamily: 'var(--font-sans, "DM Sans", sans-serif)',
              fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.1em',
              color: 'var(--color-text)', fontWeight: 400, padding: '14px 0',
            }}
          >
            Crystal Type
          </AccordionTrigger>
          <AccordionContent style={{ padding: '4px 0 16px' }}>
            {CRYSTAL_OPTIONS.map((opt) => (
              <CheckboxRow
                key={opt.value}
                label={opt.label}
                checked={getSelected('crystal').includes(opt.value)}
                onToggle={() => toggleMulti('crystal', opt.value)}
              />
            ))}
          </AccordionContent>
        </AccordionItem>

        {/* Intention */}
        <AccordionItem value="intention" style={{ borderBottom: '1px solid var(--color-border)' }}>
          <AccordionTrigger
            className="!no-underline hover:!no-underline"
            style={{
              fontFamily: 'var(--font-sans, "DM Sans", sans-serif)',
              fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.1em',
              color: 'var(--color-text)', fontWeight: 400, padding: '14px 0',
            }}
          >
            Intention
          </AccordionTrigger>
          <AccordionContent style={{ padding: '4px 0 16px' }}>
            {INTENTION_OPTIONS.map((opt) => (
              <CheckboxRow
                key={opt.value}
                label={opt.label}
                checked={getSelected('intention').includes(opt.value)}
                onToggle={() => toggleMulti('intention', opt.value)}
              />
            ))}
          </AccordionContent>
        </AccordionItem>

        {/* Price Range */}
        <AccordionItem value="price" style={{ borderBottom: '1px solid var(--color-border)' }}>
          <AccordionTrigger
            className="!no-underline hover:!no-underline"
            style={{
              fontFamily: 'var(--font-sans, "DM Sans", sans-serif)',
              fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.1em',
              color: 'var(--color-text)', fontWeight: 400, padding: '14px 0',
            }}
          >
            Price Range
          </AccordionTrigger>
          <AccordionContent style={{ padding: '4px 0 16px' }}>
            {PRICE_OPTIONS.map((opt) => (
              <RadioRow
                key={opt.value}
                label={opt.label}
                selected={currentPrice === opt.value}
                onSelect={() => setSingle('price', opt.value)}
              />
            ))}
          </AccordionContent>
        </AccordionItem>

        {/* Sort */}
        <AccordionItem value="sort" style={{ borderBottom: 'none' }}>
          <AccordionTrigger
            className="!no-underline hover:!no-underline"
            style={{
              fontFamily: 'var(--font-sans, "DM Sans", sans-serif)',
              fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.1em',
              color: 'var(--color-text)', fontWeight: 400, padding: '14px 0',
            }}
          >
            Sort
          </AccordionTrigger>
          <AccordionContent style={{ padding: '4px 0 16px' }}>
            {SORT_OPTIONS.map((opt) => (
              <RadioRow
                key={opt.value}
                label={opt.label}
                selected={currentSort === opt.value || (opt.value === 'newest' && !currentSort)}
                onSelect={() => setSingle('sort', opt.value)}
              />
            ))}
          </AccordionContent>
        </AccordionItem>

      </Accordion>

      {/* Clear all */}
      {hasFilters && (
        <button
          onClick={clearAll}
          style={{
            marginTop: 20,
            fontFamily: 'var(--font-sans, "DM Sans", sans-serif)',
            fontSize: 11, color: 'var(--color-gold-dark)',
            cursor: 'pointer', textDecoration: 'underline',
            background: 'none', border: 'none', padding: '8px 0',
            minHeight: 44,
          }}
        >
          Clear all filters
        </button>
      )}
    </div>
  )
}

// ─── Main export ─────────────────────────────────────────────────────────────

export default function ShopFilters() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const actions = useFilterActions()
  const { hasFilters } = actions

  return (
    <>
      {/* Mobile trigger */}
      <div className="md:hidden">
        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetTrigger asChild>
            <button
              style={{
                width: '100%',
                border: '1px solid var(--color-border)',
                background: 'var(--color-white)',
                padding: '12px 16px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                cursor: 'pointer',
                borderRadius: 0,
              }}
            >
              <span
                style={{
                  fontFamily: 'var(--font-sans, "DM Sans", sans-serif)',
                  fontSize: 13, color: 'var(--color-text)',
                }}
              >
                Filter
              </span>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                {hasFilters && (
                  <div
                    style={{
                      width: 6, height: 6, borderRadius: '50%',
                      background: 'var(--color-gold)',
                    }}
                  />
                )}
                <SlidersHorizontal size={16} stroke="var(--color-text)" />
              </div>
            </button>
          </SheetTrigger>
          <SheetContent
            side="bottom"
            className="h-[80vh] overflow-y-auto"
            style={{ background: 'var(--color-bg)', padding: '32px 24px' }}
          >
            <FilterContent actions={actions} />
          </SheetContent>
        </Sheet>
      </div>

      {/* Desktop sticky sidebar */}
      <div
        className="hidden md:block"
        style={{ position: 'sticky', top: 100 }}
      >
        <FilterContent actions={actions} />
      </div>
    </>
  )
}
