'use client'

import { SectionWrapper } from '@/features/landing/components/ui/SectionWrapper'

export default function LandingPage() {
  return (
    <main>
      <SectionWrapper id="hero">
        {/* Phase 2: HeroSection */}
      </SectionWrapper>
      <SectionWrapper id="features" dark>
        {/* Phase 2: FeaturesSection */}
      </SectionWrapper>
      <SectionWrapper id="profiles">
        {/* Phase 2: ProfilesSection */}
      </SectionWrapper>
      <SectionWrapper id="flow" dark>
        {/* Phase 3: FlowSection */}
      </SectionWrapper>
      <SectionWrapper id="numbers">
        {/* Phase 4: NumbersSection */}
      </SectionWrapper>
      <SectionWrapper id="gap" dark>
        {/* Phase 3: GapSection */}
      </SectionWrapper>
      <SectionWrapper id="cta-section">
        {/* Phase 2: CTASection */}
      </SectionWrapper>
      <SectionWrapper id="footer" dark>
        {/* Phase 2: FooterSection */}
      </SectionWrapper>
    </main>
  )
}
