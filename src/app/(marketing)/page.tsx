'use client'

import { SectionWrapper } from '@/features/landing/components/ui/SectionWrapper'
import { HeroSection } from '@/features/landing/components/sections/HeroSection'
import { FeaturesSection } from '@/features/landing/components/sections/FeaturesSection'
import { ProfilesSection } from '@/features/landing/components/sections/ProfilesSection'
import { CTASection } from '@/features/landing/components/sections/CTASection'
import { FooterSection } from '@/features/landing/components/sections/FooterSection'

export default function LandingPage() {
  return (
    <main>
      <HeroSection />
      <FeaturesSection />
      <ProfilesSection />
      <SectionWrapper id="flow" dark>
        {/* Phase 3: FlowSection */}
      </SectionWrapper>
      <SectionWrapper id="numbers">
        {/* Phase 4: NumbersSection */}
      </SectionWrapper>
      <SectionWrapper id="gap" dark>
        {/* Phase 3: GapSection */}
      </SectionWrapper>
      <CTASection />
      <FooterSection />
    </main>
  )
}
