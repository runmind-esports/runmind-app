'use client'

import { MessageCircle, Calendar, RefreshCw } from 'lucide-react'
import { useLanguage } from '@/features/landing/hooks/useLanguage'
import { SectionWrapper } from '../ui/SectionWrapper'
import { FeatureCard } from '../ui/FeatureCard'
import { IntegrationBadge } from '../ui/IntegrationBadge'

export function FeaturesSection() {
  const { t } = useLanguage()

  return (
    <section id="features" className="relative overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: 'url(/images/features-bg.jpg)' }}
      />
      <div className="absolute inset-0 bg-[#14162E]/90" />
      <div className="relative px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-24 max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-2xl font-bold font-display leading-[1.2] text-white">
            {t.features.title}
          </h2>
          <p className="text-base text-white/60 leading-relaxed mt-4">
            {t.features.subtitle}
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          <FeatureCard icon={MessageCircle} title={t.features.chat.title} description={t.features.chat.description} />
          <FeatureCard icon={Calendar} title={t.features.plans.title} description={t.features.plans.description} />
          <FeatureCard icon={RefreshCw} title={t.features.sync.title} description={t.features.sync.description} />
        </div>
        <div className="flex flex-col items-center mt-12">
          <p className="text-[13px] text-white/50 mb-4 uppercase tracking-wider font-semibold">Integrações</p>
          <div className="flex flex-wrap justify-center gap-4">
            <IntegrationBadge provider="strava" label={t.features.badge} />
            <IntegrationBadge provider="garmin" label={t.features.badge} />
          </div>
        </div>
      </div>
    </section>
  )
}
