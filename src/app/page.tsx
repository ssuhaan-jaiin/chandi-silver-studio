import HeroSection from '@/components/sections/HeroSection'
import BrandIntro from '@/components/sections/BrandIntro'
import FeaturedCollections from '@/components/sections/FeaturedCollections'
import ShopByIntention from '@/components/sections/ShopByIntention'
import Bestsellers from '@/components/sections/Bestsellers'
import Testimonials from '@/components/sections/Testimonials'
import InstagramFeed from '@/components/sections/InstagramFeed'
import EmailPopup from '@/components/EmailPopup'

export default function Home() {
  return (
    <>
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
