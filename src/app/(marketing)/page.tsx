'use client'

import { Navbar } from '@/features/landing/components/sections/Navbar'
import { HeroSection } from '@/features/landing/components/sections/HeroSection'
import { FeaturesSection } from '@/features/landing/components/sections/FeaturesSection'
import { ProfilesSection } from '@/features/landing/components/sections/ProfilesSection'
import { FlowSection } from '@/features/landing/components/sections/FlowSection'
import { NumbersSection } from '@/features/landing/components/sections/NumbersSection'
import { GapSection } from '@/features/landing/components/sections/GapSection'
import { PricingSection } from '@/features/landing/components/sections/PricingSection'
import { CTASection } from '@/features/landing/components/sections/CTASection'
import { FooterSection } from '@/features/landing/components/sections/FooterSection'

export default function LandingPage() {
  return (
    <main className="pt-16">
      <Navbar />
      <HeroSection />
      <FeaturesSection />
      <ProfilesSection />
      <FlowSection />
      <NumbersSection />
      <GapSection />
      <PricingSection />
      <CTASection />
      <FooterSection />
    </main>
  )
}
