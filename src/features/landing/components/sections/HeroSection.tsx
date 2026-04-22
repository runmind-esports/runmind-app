'use client'

import { useLanguage } from '@/features/landing/hooks/useLanguage'
import { SectionWrapper } from '../ui/SectionWrapper'
import { ScrollReveal } from '../ui/ScrollReveal'
import { CTAButton } from '../ui/CTAButton'
import { AppMockup } from '../ui/AppMockup'

export function HeroSection() {
  const { t } = useLanguage()

  return (
    <SectionWrapper id="hero">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        <div>
          <ScrollReveal delay={0}>
            <h1 className="text-[40px] font-bold font-display leading-[1.1]">
              {t.hero.title}
            </h1>
          </ScrollReveal>
          <ScrollReveal delay={100}>
            <p className="text-base font-sans leading-relaxed text-foreground-muted mt-6">
              {t.hero.subtitle}
            </p>
          </ScrollReveal>
          <ScrollReveal delay={200}>
            <div className="flex flex-wrap gap-4 mt-6">
              <CTAButton variant="primary" href="/signup">{t.hero.cta}</CTAButton>
              <CTAButton variant="secondary" href="#features">{t.hero.ctaSecondary}</CTAButton>
            </div>
          </ScrollReveal>
        </div>
        <ScrollReveal delay={300}>
          <div className="hidden lg:block">
            <AppMockup />
          </div>
        </ScrollReveal>
      </div>
    </SectionWrapper>
  )
}
