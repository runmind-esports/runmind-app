'use client'

import Link from 'next/link'
import { Check, X } from 'lucide-react'
import { useLanguage } from '@/features/landing/hooks/useLanguage'
import { SectionWrapper } from '../ui/SectionWrapper'
import { ScrollReveal } from '../ui/ScrollReveal'

interface PricingFeature {
  readonly text: string
  readonly included: boolean
}

interface PricingPlan {
  readonly badge: string
  readonly name: string
  readonly price: string
  readonly period: string
  readonly subtitle: string
  readonly features: readonly PricingFeature[]
  readonly buttonText: string
  readonly featured?: boolean
}

function PricingCard({ plan }: { plan: PricingPlan }) {
  return (
    <div className={`rounded-2xl p-6 sm:p-8 border relative overflow-hidden transition-all hover:-translate-y-1 ${
      plan.featured
        ? 'bg-[#14162E] border-accent/40 lg:scale-[1.05] shadow-[0_0_40px_rgba(0,240,72,0.12)]'
        : 'bg-background-secondary border-border'
    }`}>
      {plan.featured && (
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-accent/60 via-accent to-accent/60" />
      )}
      <span className={`inline-block mb-5 px-3 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase ${
        plan.featured
          ? 'bg-accent/15 text-accent border border-accent/30'
          : 'bg-background/50 text-foreground-muted border border-border'
      }`}>
        {plan.badge}
      </span>
      <h3 className={`font-display font-bold text-xl mb-1 ${plan.featured ? 'text-white' : 'text-foreground'}`}>
        {plan.name}
      </h3>
      <div className={`font-display font-bold text-[40px] tracking-tight leading-none mt-5 mb-1 ${plan.featured ? 'text-accent' : 'text-foreground'}`}>
        {plan.price}
        <span className={`text-sm font-normal ml-1 ${plan.featured ? 'text-white/40' : 'text-foreground-muted'}`}>
          {plan.period}
        </span>
      </div>
      <p className={`text-[13px] mb-7 ${plan.featured ? 'text-white/40' : 'text-foreground-muted'}`}>
        {plan.subtitle}
      </p>
      <div className={`h-px mb-6 ${plan.featured ? 'bg-white/10' : 'bg-border'}`} />
      <ul className="flex flex-col gap-3 mb-8">
        {plan.features.map((feature, i) => (
          <li key={i} className={`flex items-start gap-2.5 text-[13px] leading-relaxed ${
            feature.included
              ? (plan.featured ? 'text-white/80' : 'text-foreground')
              : (plan.featured ? 'text-white/25' : 'text-foreground-muted/40')
          }`}>
            <div className={`w-[18px] h-[18px] rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
              feature.included
                ? (plan.featured ? 'bg-accent/20 border border-accent/40' : 'bg-accent/10 border border-accent/20')
                : (plan.featured ? 'bg-white/5 border border-white/10' : 'bg-background border border-border')
            }`}>
              {feature.included
                ? <Check size={9} className={plan.featured ? 'text-accent' : 'text-accent'} />
                : <X size={9} className={plan.featured ? 'text-white/20' : 'text-foreground-muted/40'} />
              }
            </div>
            {feature.text}
          </li>
        ))}
      </ul>
      <Link
        href="/signup"
        className={`block w-full text-center py-3.5 rounded-full text-sm font-bold transition-all ${
          plan.featured
            ? 'bg-accent text-[#14162E] hover:bg-accent-hover hover:shadow-[0_4px_24px_rgba(0,240,72,0.3)]'
            : 'border border-border text-foreground hover:border-foreground-muted hover:bg-background'
        }`}
      >
        {plan.buttonText}
      </Link>
    </div>
  )
}

export function PricingSection() {
  const { t } = useLanguage()

  return (
    <SectionWrapper id="pricing">
      <ScrollReveal>
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-2xl font-bold font-display leading-[1.2]">
            {t.pricing.title}
          </h2>
          <p className="text-base text-foreground-muted leading-relaxed mt-4">
            {t.pricing.subtitle}
          </p>
        </div>
      </ScrollReveal>
      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
        {t.pricing.plans.map((plan, index) => (
          <ScrollReveal key={index} delay={index * 100}>
            <PricingCard plan={plan} />
          </ScrollReveal>
        ))}
      </div>
    </SectionWrapper>
  )
}
