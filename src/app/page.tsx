export const revalidate = 3600

import type { Metadata } from 'next'
import HeroSection from '@/components/sections/HeroSection'
import BrandIntro from '@/components/sections/BrandIntro'
import FeaturedCollections from '@/components/sections/FeaturedCollections'
import ShopByIntention from '@/components/sections/ShopByIntention'
import Bestsellers from '@/components/sections/Bestsellers'
import Testimonials from '@/components/sections/Testimonials'
import InstagramFeed from '@/components/sections/InstagramFeed'
import EmailPopup from '@/components/EmailPopup'
import { JsonLd } from '@/components/seo/JsonLd'
import { buildMetadata, SITE_URL, SITE_DESCRIPTION, SITE_NAME } from '@/lib/seo'

export const metadata: Metadata = buildMetadata({
  title: 'Chandi Silver Studio | Intentional Gemstone Jewellery',
  description:
    'Discover intentional gemstone jewellery thoughtfully sourced from India. Each piece designed with emotional meaning — love, protection, clarity.',
  image: '/images/back.png',
})

export default function Home() {
  return (
    <>
      <JsonLd data={{
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: SITE_NAME,
        url: SITE_URL,
        logo: `${SITE_URL}/images/logo1.png`,
        description: SITE_DESCRIPTION,
        contactPoint: {
          '@type': 'ContactPoint',
          contactType: 'customer service',
          availableLanguage: 'English',
        },
        sameAs: ['https://instagram.com/chandisilverstudio'],
      }} />
      <HeroSection />
      <BrandIntro />
      <FeaturedCollections />
      <ShopByIntention />
      <Bestsellers />
      <Testimonials />
      <InstagramFeed />
      <EmailPopup />
    </>
  )
}
