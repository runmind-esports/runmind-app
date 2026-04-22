'use client'

import { useLanguage } from '@/features/landing/hooks/useLanguage'
import { SectionWrapper } from '../ui/SectionWrapper'
import { CTAButton } from '../ui/CTAButton'

export function CTASection() {
  const { t } = useLanguage()

  return (
    <SectionWrapper id="cta-section">
      <div className="text-center max-w-2xl mx-auto">
        <h2 className="text-2xl font-bold font-display leading-[1.2]">
          {t.cta.title}
        </h2>
        <p className="text-base text-foreground-muted leading-relaxed mt-4">
          {t.cta.subtitle}
        </p>
        <div className="mt-6">
          <CTAButton variant="primary" href="/signup">{t.cta.button}</CTAButton>
        </div>
      </div>
    </SectionWrapper>
  )
}
