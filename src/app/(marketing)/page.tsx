'use client'

import { HeroSection } from '@/features/landing/components/sections/HeroSection'
import { FeaturesSection } from '@/features/landing/components/sections/FeaturesSection'
import { ProfilesSection } from '@/features/landing/components/sections/ProfilesSection'
import { FlowSection } from '@/features/landing/components/sections/FlowSection'
import { NumbersSection } from '@/features/landing/components/sections/NumbersSection'
import { GapSection } from '@/features/landing/components/sections/GapSection'
import { CTASection } from '@/features/landing/components/sections/CTASection'
import { FooterSection } from '@/features/landing/components/sections/FooterSection'

export default function LandingPage() {
  return (
    <main>
      <HeroSection />
      <FeaturesSection />
      <ProfilesSection />
      <FlowSection />
      <NumbersSection />
      <GapSection />
      <CTASection />
      <FooterSection />
    </main>
  )
}
