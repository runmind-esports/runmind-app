'use client'

import { useState, useEffect } from 'react'
import { SectionWrapper } from '../ui/SectionWrapper'
import { ScrollReveal } from '../ui/ScrollReveal'
import { AnimatedCounter } from '../ui/AnimatedCounter'
import { useLanguage } from '../../hooks/useLanguage'
import { fetchLandingMetrics, FALLBACK_METRICS, LandingMetrics } from '../../services/metricsApi'

export function NumbersSection() {
  const { t, locale } = useLanguage()
  const [metrics, setMetrics] = useState<LandingMetrics>(FALLBACK_METRICS)

  useEffect(() => {
    fetchLandingMetrics().then((data) => {
      if (data) setMetrics(data)
    })
  }, [])

  const volumeFormatter = (n: number) =>
    new Intl.NumberFormat(locale).format(Math.round(n))

  const paceFormatter = (n: number) => {
    const minutes = Math.floor(n)
    let seconds = Math.round((n - minutes) * 60)
    if (seconds >= 60) {
      return `${minutes + 1}:00`
    }
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  const engagementFormatter = (n: number) => Math.round(n).toString()

  return (
    <SectionWrapper id="numbers">
      <ScrollReveal delay={0}>
        <h2 className="text-2xl font-bold font-display leading-[1.2] text-center">
          {t.numbers.title}
        </h2>
      </ScrollReveal>
      <ScrollReveal delay={100}>
        <p className="text-base text-foreground-muted leading-relaxed text-center max-w-2xl mx-auto mt-2">
          {t.numbers.subtitle}
        </p>
      </ScrollReveal>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mt-8">
        <ScrollReveal delay={0}>
          <div className="bg-background-secondary rounded-xl border border-border border-t-2 border-t-accent p-6 md:p-8 text-center">
            <AnimatedCounter
              value={metrics.volume}
              suffix={` ${t.numbers.volumeSuffix}`}
              formatter={volumeFormatter}
            />
            <p className="text-base font-bold font-display mt-2">{t.numbers.volume}</p>
            <p className="text-[13px] text-foreground-muted mt-1">{t.numbers.volumeSublabel}</p>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={100}>
          <div className="bg-background-secondary rounded-xl border border-border border-t-2 border-t-accent p-6 md:p-8 text-center">
            <AnimatedCounter
              value={metrics.pace}
              suffix={` ${t.numbers.paceSuffix}`}
              formatter={paceFormatter}
            />
            <p className="text-base font-bold font-display mt-2">{t.numbers.pace}</p>
            <p className="text-[13px] text-foreground-muted mt-1">{t.numbers.paceSublabel}</p>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={200}>
          <div className="bg-background-secondary rounded-xl border border-border border-t-2 border-t-accent p-6 md:p-8 text-center">
            <AnimatedCounter
              value={metrics.engagement}
              suffix={t.numbers.engagementSuffix}
              formatter={engagementFormatter}
            />
            <p className="text-base font-bold font-display mt-2">{t.numbers.engagement}</p>
            <p className="text-[13px] text-foreground-muted mt-1">{t.numbers.engagementSublabel}</p>
          </div>
        </ScrollReveal>
      </div>
    </SectionWrapper>
  )
}
