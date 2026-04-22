'use client'

import { SectionWrapper } from '@/features/landing/components/ui/SectionWrapper'
import { HeroSection } from '@/features/landing/components/sections/HeroSection'
import { FeaturesSection } from '@/features/landing/components/sections/FeaturesSection'
import { ProfilesSection } from '@/features/landing/components/sections/ProfilesSection'
import { FlowSection } from '@/features/landing/components/sections/FlowSection'
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
      <SectionWrapper id="numbers">
        {/* Phase 4: NumbersSection */}
      </SectionWrapper>
      <GapSection />
      <CTASection />
      <FooterSection />
    </main>
  )
}
