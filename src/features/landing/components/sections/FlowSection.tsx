'use client'

import Image from 'next/image'
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
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8 items-start">
        <ol className="list-none">
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
        <ScrollReveal delay={200}>
          <div className="relative rounded-2xl overflow-hidden aspect-[16/9] lg:aspect-[3/4] lg:sticky lg:top-24">
            <Image
              src="/images/runner-group.jpg"
              alt="Grupo de corredores treinando juntos"
              fill
              className="object-cover"
              unoptimized
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#14162E]/70 via-transparent to-transparent" />
            <div className="absolute bottom-6 left-6 right-6">
              <p className="text-white text-sm font-bold font-display">Do login ao primeiro treino em menos de 2 minutos</p>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </SectionWrapper>
  )
}
