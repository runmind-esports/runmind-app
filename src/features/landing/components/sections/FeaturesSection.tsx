'use client'

import { MessageCircle, Calendar, RefreshCw } from 'lucide-react'
import { useLanguage } from '@/features/landing/hooks/useLanguage'
import { SectionWrapper } from '../ui/SectionWrapper'
import { FeatureCard } from '../ui/FeatureCard'
import { IntegrationBadge } from '../ui/IntegrationBadge'

export function FeaturesSection() {
  const { t } = useLanguage()

  return (
    <SectionWrapper id="features" dark>
      <div className="text-center max-w-2xl mx-auto mb-12">
        <h2 className="text-2xl font-bold font-display leading-[1.2]">
          {t.features.title}
        </h2>
        <p className="text-base text-foreground-muted leading-relaxed mt-4">
          {t.features.subtitle}
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
        <FeatureCard icon={MessageCircle} title={t.features.chat.title} description={t.features.chat.description} />
        <FeatureCard icon={Calendar} title={t.features.plans.title} description={t.features.plans.description} />
        <FeatureCard icon={RefreshCw} title={t.features.sync.title} description={t.features.sync.description} />
      </div>
      <div className="flex justify-center gap-6 mt-8">
        <IntegrationBadge provider="strava" label={t.features.badge} />
        <IntegrationBadge provider="garmin" label={t.features.badge} />
      </div>
    </SectionWrapper>
  )
}
