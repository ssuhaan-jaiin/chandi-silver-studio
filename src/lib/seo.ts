import type { Metadata } from 'next'

export const SITE_NAME = 'Chandi Silver Studio'
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? 'https://chandisilverstudio.com'
export const SITE_DESCRIPTION =
  'Intentional gemstone jewellery thoughtfully sourced from India and global gem shows. Designed with emotional meaning.'

export function buildMetadata({
  title,
  description,
  image,
  noIndex = false,
}: {
  title: string
  description: string
  image?: string
  noIndex?: boolean
}): Metadata {
  const fullTitle = title.includes(SITE_NAME)
    ? title
    : `${title} | ${SITE_NAME}`

  const desc = description.slice(0, 155)

  return {
    title: fullTitle,
    description: desc,
    metadataBase: new URL(SITE_URL),
    openGraph: {
      title: fullTitle,
      description: desc,
      siteName: SITE_NAME,
      images: image
        ? [{ url: image, width: 1200, height: 630, alt: fullTitle }]
        : [],
      type: 'website',
      locale: 'en_GB',
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description: desc,
      images: image ? [image] : [],
    },
    robots: noIndex
      ? { index: false, follow: false }
      : { index: true, follow: true },
    alternates: { canonical: SITE_URL },
  }
}

export function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim()
}
