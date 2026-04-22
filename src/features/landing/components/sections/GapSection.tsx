'use client'

import { useLanguage } from '@/features/landing/hooks/useLanguage'
import { SectionWrapper } from '../ui/SectionWrapper'
import { ScrollReveal } from '../ui/ScrollReveal'
import { StatCard } from '../ui/StatCard'

export function GapSection() {
  const { t } = useLanguage()

  return (
    <SectionWrapper id="gap" dark>
      <ScrollReveal>
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold font-display leading-[1.2]">
            {t.gap.title}
          </h2>
          <p className="text-base text-foreground-muted leading-relaxed mt-4">
            {t.gap.subtitle}
          </p>
        </div>
      </ScrollReveal>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mt-8">
        {t.gap.stats.map((stat, index) => (
          <ScrollReveal key={index} delay={index * 100}>
            <StatCard number={stat.number} label={stat.label} />
          </ScrollReveal>
        ))}
      </div>
      <ScrollReveal delay={300}>
        <blockquote className="border-l-2 border-accent pl-6 max-w-2xl mx-auto mt-8">
          <p className="text-base font-bold">{t.gap.message}</p>
        </blockquote>
      </ScrollReveal>
    </SectionWrapper>
  )
}
