'use client'

import { useState } from 'react'
import { Check, Zap, Loader2, ExternalLink } from 'lucide-react'
import { useSubscription, useUserTier } from '@/features/subscription'
import type { BillingInterval } from '@/features/subscription'

function formatCurrency(amountInCentavos: number): string {
  return (amountInCentavos / 100).toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  })
}

function formatDate(dateStr: string | null): string {
  if (!dateStr) return '—'
  return new Date(dateStr).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  })
}

function calcAnnualSavingsPercent(monthlyAmount: number, yearlyAmount: number): number {
  const yearlyEquivalent = monthlyAmount * 12
  if (yearlyEquivalent <= 0) return 0
  return Math.round(((yearlyEquivalent - yearlyAmount) / yearlyEquivalent) * 100)
}

const TIER_DISPLAY: Record<string, string> = {
  free: 'Gratuito',
  pro: 'Pro',
  premium: 'Premium',
}

const INTERVAL_DISPLAY: Record<string, string> = {
  monthly: 'Mensal',
  yearly: 'Anual',
}

export function PlansSection() {
  const { plans, isLoadingPlans, isCheckingOut, isOpeningPortal, error, checkout, openPortal } = useSubscription()
  const { tier: userTier, interval: userInterval, expiresAt, customerId, isLoading: isLoadingTier } = useUserTier()
  const [billingInterval, setBillingInterval] = useState<BillingInterval>('monthly')

  const isLoading = isLoadingPlans || isLoadingTier
  const isBusy = isCheckingOut || isOpeningPortal
  const isPaid = userTier === 'pro' || userTier === 'premium'

  const filteredPlans = plans.filter((p) => p.interval === billingInterval)
  const monthlyPlans = plans.filter((p) => p.interval === 'monthly')

  const proPlan = filteredPlans.find((p) => p.tier === 'pro')
  const premiumPlan = filteredPlans.find((p) => p.tier === 'premium')
  const proMonthly = monthlyPlans.find((p) => p.tier === 'pro')
  const premiumMonthly = monthlyPlans.find((p) => p.tier === 'premium')

  if (isLoading) {
    return (
      <div className="space-y-4 animate-pulse">
        <div className="h-24 bg-background-tertiary rounded-2xl" />
        <div className="h-48 bg-background-tertiary rounded-2xl" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Current plan banner */}
      <div className="p-5 rounded-2xl border border-border">
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-xs text-foreground-muted mb-1">Seu plano</p>
            <h2 className="font-display font-bold text-xl text-foreground">
              {TIER_DISPLAY[userTier] || userTier}
              {isPaid && userInterval && (
                <span className="text-sm font-normal text-foreground-muted ml-2">
                  {INTERVAL_DISPLAY[userInterval] || userInterval}
                </span>
              )}
            </h2>
          </div>
          <span className="px-3 py-1 bg-accent/15 text-accent text-xs font-bold rounded-full">
            Ativo
          </span>
        </div>

        {isPaid && expiresAt && (
          <p className="text-xs text-foreground-muted mb-4">
            Renova em {formatDate(expiresAt)}
          </p>
        )}

        {isPaid && customerId && (
          <button
            onClick={() => openPortal(customerId)}
            disabled={isBusy}
            className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-background-tertiary text-foreground text-xs font-bold hover:bg-background-tertiary/80 transition-colors disabled:opacity-50"
          >
            {isOpeningPortal ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <ExternalLink className="w-3.5 h-3.5" />
            )}
            Gerenciar conta
          </button>
        )}
      </div>

      {/* Error banner */}
      {error && (
        <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs text-center">
          {error}
        </div>
      )}

      {/* Upgrade section — only show if there are plans above current tier */}
      {((userTier === 'free' && (proPlan || premiumPlan)) ||
        (userTier === 'pro' && premiumPlan)) && (
        <>
          <div>
            <h3 className="text-sm font-bold text-foreground mb-1">Fazer upgrade</h3>
            <p className="text-xs text-foreground-muted">
              Desbloqueie mais RunPoints e funcionalidades
            </p>
          </div>

          {/* Billing interval toggle */}
          <div className="flex items-center justify-center gap-3">
            <span
              className={`text-xs font-medium transition-colors ${
                billingInterval === 'monthly' ? 'text-foreground' : 'text-foreground-muted'
              }`}
            >
              Mensal
            </span>
            <button
              type="button"
              role="switch"
              aria-checked={billingInterval === 'yearly'}
              onClick={() => setBillingInterval(billingInterval === 'monthly' ? 'yearly' : 'monthly')}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                billingInterval === 'yearly' ? 'bg-accent' : 'bg-background-tertiary'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  billingInterval === 'yearly' ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
            <span
              className={`text-xs font-medium transition-colors ${
                billingInterval === 'yearly' ? 'text-foreground' : 'text-foreground-muted'
              }`}
            >
              Anual
            </span>
          </div>

          <div className="space-y-3">
            {/* Pro plan — show for free users, or pro users who can switch to yearly */}
            {proPlan && (userTier === 'free' || (userTier === 'pro' && billingInterval !== userInterval)) && (
              <UpgradeCard
                name={proPlan.name}
                description={userTier === 'pro' ? 'Mude para o plano anual e economize' : 'Para corredores que querem evoluir'}
                price={formatCurrency(proPlan.amount)}
                period={billingInterval === 'monthly' ? '/mês' : '/ano'}
                features={proPlan.features}
                highlighted={userTier === 'free'}
                isBusy={isBusy}
                onAction={() => checkout(proPlan.id)}
                actionLabel={userTier === 'pro' ? 'Mudar para anual' : undefined}
                savingsPercent={
                  billingInterval === 'yearly' && proMonthly
                    ? calcAnnualSavingsPercent(proMonthly.amount, proPlan.amount)
                    : undefined
                }
              />
            )}

            {/* Premium plan — show for free and pro users */}
            {premiumPlan && (
              <UpgradeCard
                name={premiumPlan.name}
                description="Para quem compete e quer resultado"
                price={formatCurrency(premiumPlan.amount)}
                period={billingInterval === 'monthly' ? '/mês' : '/ano'}
                features={premiumPlan.features}
                highlighted={userTier === 'pro'}
                isBusy={isBusy}
                onAction={() => checkout(premiumPlan.id)}
                savingsPercent={
                  billingInterval === 'yearly' && premiumMonthly
                    ? calcAnnualSavingsPercent(premiumMonthly.amount, premiumPlan.amount)
                    : undefined
                }
              />
            )}
          </div>
        </>
      )}
    </div>
  )
}

interface UpgradeCardProps {
  name: string
  description: string
  price: string
  period: string
  features: string[]
  highlighted?: boolean
  isBusy: boolean
  onAction: () => void
  actionLabel?: string
  savingsPercent?: number
}

function UpgradeCard({
  name,
  description,
  price,
  period,
  features,
  highlighted,
  isBusy,
  onAction,
  actionLabel,
  savingsPercent,
}: UpgradeCardProps) {
  return (
    <div
      className={`relative p-5 rounded-2xl border transition-all duration-200 ${
        highlighted
          ? 'border-[#00F048]/30 bg-background'
          : 'border-border bg-background'
      }`}
    >
      {highlighted && (
        <div className="absolute -top-2.5 left-5 px-2.5 py-0.5 bg-[#00F048] text-[#14162E] text-[10px] font-bold rounded-full tracking-wide uppercase">
          Recomendado
        </div>
      )}

      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="font-display font-semibold text-sm text-foreground tracking-tight">
            {name}
          </h3>
          <p className="text-xs text-foreground-muted mt-0.5">{description}</p>
        </div>
        <div className="text-right flex-shrink-0">
          <span className="font-display font-bold text-xl text-foreground tracking-tight">
            {price}
          </span>
          <span className="text-xs text-foreground-muted">{period}</span>
          {savingsPercent != null && savingsPercent > 0 && (
            <div className="mt-0.5">
              <span className="px-1.5 py-0.5 bg-green-500/15 text-green-400 text-[9px] font-bold rounded-full">
                Economia de {savingsPercent}%
              </span>
            </div>
          )}
        </div>
      </div>

      <ul className="space-y-1.5 mb-4">
        {features.map((feature) => (
          <li key={feature} className="flex items-center gap-2 text-xs text-foreground-muted">
            <Check className="w-3.5 h-3.5 text-accent flex-shrink-0" />
            {feature}
          </li>
        ))}
      </ul>

      <button
        onClick={onAction}
        disabled={isBusy}
        className={`w-full px-4 py-2.5 rounded-full text-xs font-bold flex items-center justify-center gap-1.5 transition-colors ${
          highlighted
            ? 'bg-[#00F048] text-[#14162E] hover:bg-[#00F048]/90'
            : 'bg-background-tertiary text-foreground hover:bg-background-tertiary/80'
        } disabled:opacity-50 disabled:cursor-not-allowed`}
      >
        {isBusy ? (
          <Loader2 className="w-3.5 h-3.5 animate-spin" />
        ) : !actionLabel ? (
          <Zap className="w-3.5 h-3.5" />
        ) : null}
        {actionLabel || `Assinar ${name}`}
      </button>
    </div>
  )
}
