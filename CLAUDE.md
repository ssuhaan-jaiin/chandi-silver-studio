@AGENTS.md

# Chandi Silver Studio

## Project
Luxury intentional gemstone jewellery e-commerce site.

## Stack
- Next.js 15 App Router (note: installed version is 16.x — read `node_modules/next/dist/docs/` before writing any code)
- Shopify Storefront API v2026-04 — client at `src/lib/shopify.ts`
- Sanity CMS — client at `src/lib/sanity.ts`
- Klaviyo (email/SMS marketing)
- Tailwind CSS v4 (CSS-based config — no `tailwind.config.ts`, all tokens live in `globals.css`)
- shadcn/ui

## Colours
Always use these CSS variables. Never hardcode hex values or use any other colours.

| Token | Hex | Use |
|---|---|---|
| `--color-bg` | `#FAF7F2` | Page background (warm white) |
| `--color-gold` | `#C9A96E` | Primary accent, CTAs, borders |
| `--color-gold-dark` | `#9A7A4A` | Hover states (deep gold) |
| `--color-blush` | `#E8D5C4` | Secondary backgrounds, card surfaces |
| `--color-lavender` | `#D4CAE4` | Intention badges, highlights |
| `--color-text` | `#2C2C2C` | All body text and headings (charcoal) |
| `--color-muted` | `#8A8A8A` | Captions, secondary text |
| `--color-white` | `#FFFFFF` | Card backgrounds |
| `--color-border` | `#DDD4C6` | Borders (warm) |

Tailwind colour utilities: `bg-bg`, `text-gold`, `border-border`, `bg-blush`, etc.

## Fonts
- **Display / Headings**: Times New Roman — system font, no import needed
  - `font-family: 'Times New Roman', Times, serif`
  - CSS variable: `--font-display`
  - Tailwind: `font-display`
  - All `h1`–`h6` use this automatically via `@layer base`
- **Body / UI**: DM Sans — imported via `next/font/google` in `layout.tsx`
  - Weights: 300, 400, 500, 600
  - CSS variable: `--font-sans`
  - Tailwind: `font-sans` (default body font)

## Logo
- "Chandi" — Times New Roman, regular weight
- "Silver Studio" — Times New Roman, italic
- Always render the logo this way. Never use a different font for the logo.

## Style
- Minimal, clean, luxury
- Lots of white space
- No heavy animations — calm and static
- Feminine, premium

## Environment Variables
All secrets live in `.env.local` (never commit). Key vars:
- `NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN` / `NEXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN` — Shopify Storefront API
- `KLAVIYO_PRIVATE_KEY` — server-only, used in API routes
- `KLAVIYO_LIST_ID` — the Klaviyo list ID for email sign-ups (`your_list_id_here` placeholder; replace before going live)
- `SANITY_API_TOKEN` — server-only, sensitive
- `SHOPIFY_REVALIDATION_SECRET` — ISR webhook secret

## Rules
- Always read this file before writing any component.
- Never use a font or colour not listed here.
- Never hardcode hex values — always use CSS variables or Tailwind tokens.
- `src/lib/utils.ts` exports `cn()` for class merging — always use it.
