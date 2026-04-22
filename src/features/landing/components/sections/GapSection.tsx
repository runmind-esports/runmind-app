'use client'

import Image from 'next/image'
import { useLanguage } from '@/features/landing/hooks/useLanguage'
import { SectionWrapper } from '../ui/SectionWrapper'
import { ScrollReveal } from '../ui/ScrollReveal'
import { StatCard } from '../ui/StatCard'

export function GapSection() {
  const { t } = useLanguage()

  return (
    <SectionWrapper id="gap" dark>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        <div>
          <ScrollReveal>
            <h2 className="text-2xl font-bold font-display leading-[1.2]">
              {t.gap.title}
            </h2>
            <p className="text-base text-foreground-muted leading-relaxed mt-4">
              {t.gap.subtitle}
            </p>
          </ScrollReveal>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8">
            {t.gap.stats.map((stat, index) => (
              <ScrollReveal key={index} delay={index * 100}>
                <StatCard number={stat.number} label={stat.label} />
              </ScrollReveal>
            ))}
          </div>
          <ScrollReveal delay={300}>
            <blockquote className="border-l-2 border-accent pl-6 mt-8">
              <p className="text-base font-bold">{t.gap.message}</p>
            </blockquote>
          </ScrollReveal>
        </div>
        <ScrollReveal delay={200}>
          <div className="relative rounded-2xl overflow-hidden aspect-[4/3] hidden lg:block">
            <Image
              src="/images/solo-runner.jpg"
              alt="Corredor solo treinando"
              fill
              className="object-cover"
              unoptimized
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#14162E]/60 via-transparent to-transparent" />
          </div>
        </ScrollReveal>
      </div>
    </SectionWrapper>
  )
}
