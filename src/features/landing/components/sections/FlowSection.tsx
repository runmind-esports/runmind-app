'use client'

import { Link, UserCircle, MapPin, Calendar, TrendingUp } from 'lucide-react'
import { useLanguage } from '@/features/landing/hooks/useLanguage'
import { SectionWrapper } from '../ui/SectionWrapper'
import { ScrollReveal } from '../ui/ScrollReveal'
import { TimelineStep } from '../ui/TimelineStep'

const stepIcons = [Link, UserCircle, MapPin, Calendar, TrendingUp]

export function FlowSection() {
  const { t } = useLanguage()

  return (
    <SectionWrapper id="flow" dark>
      <ScrollReveal>
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold font-display leading-[1.2]">
            {t.flow.title}
          </h2>
          <p className="text-base text-foreground-muted leading-relaxed mt-4">
            {t.flow.subtitle}
          </p>
        </div>
      </ScrollReveal>
      <ol className="max-w-2xl mx-auto mt-8 list-none">
        {t.flow.steps.map((step, index) => (
          <ScrollReveal key={index} delay={index * 100}>
            <TimelineStep
              step={index + 1}
              icon={stepIcons[index]}
              title={step.title}
              description={step.description}
              metric={step.metric || undefined}
              isLast={index === t.flow.steps.length - 1}
            />
          </ScrollReveal>
        ))}
      </ol>
    </SectionWrapper>
  )
}
