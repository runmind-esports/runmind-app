'use client'

import { useState } from 'react'
import { Check, Zap, Loader2 } from 'lucide-react'
import { useSubscription, useUserTier } from '@/features/subscription'
import type { BillingInterval } from '@/features/subscription'

const FREE_FEATURES = [
  'Chat com IA coach',
  'Plano de treino básico',
  'Integração Strava',
]

function formatCurrency(amountInCentavos: number): string {
  return (amountInCentavos / 100).toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  })
}

function calcAnnualSavingsPercent(monthlyAmount: number, yearlyAmount: number): number {
  const yearlyEquivalent = monthlyAmount * 12
  if (yearlyEquivalent <= 0) return 0
  return Math.round(((yearlyEquivalent - yearlyAmount) / yearlyEquivalent) * 100)
}

export function PlansSection() {
  const [billingInterval, setBillingInterval] = useState<BillingInterval>('monthly')
  const { plans, isLoadingPlans, isCheckingOut, isOpeningPortal, error, checkout, openPortal } = useSubscription()
  const { tier: userTier, customerId, isLoading: isLoadingTier } = useUserTier()

  const isLoading = isLoadingPlans || isLoadingTier
  const isBusy = isCheckingOut || isOpeningPortal

  const filteredPlans = plans.filter((p) => p.interval === (billingInterval === 'monthly' ? 'monthly' : 'yearly'))

  const monthlyPlans = plans.filter((p) => p.interval === 'monthly')

  const proPlan = filteredPlans.find((p) => p.tier === 'pro')
  const premiumPlan = filteredPlans.find((p) => p.tier === 'premium')

  const proMonthly = monthlyPlans.find((p) => p.tier === 'pro')
  const premiumMonthly = monthlyPlans.find((p) => p.tier === 'premium')

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold font-display text-foreground mb-1">Planos</h2>
        <p className="text-sm text-foreground-muted">
          Escolha o plano ideal para o seu treino
        </p>
      </div>

      {/* Billing interval toggle */}
      <div className="flex items-center justify-center gap-3">
        <span
          className={`text-sm font-medium transition-colors ${
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
          className={`text-sm font-medium transition-colors ${
            billingInterval === 'yearly' ? 'text-foreground' : 'text-foreground-muted'
          }`}
        >
          Anual
        </span>
      </div>

      {/* Error banner */}
      {error && (
        <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs text-center">
          {error}
        </div>
      )}

      {/* Plan cards */}
      <div className="space-y-3">
        {isLoading ? (
          <>
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="p-5 rounded-2xl border border-border bg-background animate-pulse"
              >
                <div className="h-4 w-24 bg-background-tertiary rounded mb-3" />
                <div className="h-3 w-48 bg-background-tertiary rounded mb-4" />
                <div className="space-y-2 mb-4">
                  <div className="h-3 w-40 bg-background-tertiary rounded" />
                  <div className="h-3 w-36 bg-background-tertiary rounded" />
                  <div className="h-3 w-32 bg-background-tertiary rounded" />
                </div>
                <div className="h-9 bg-background-tertiary rounded-full" />
              </div>
            ))}
          </>
        ) : (
          <>
            {/* Free plan card (always shown) */}
            <PlanCard
              name="Gratuito"
              description="Para quem está começando a correr"
              price="R$ 0"
              period={billingInterval === 'monthly' ? '/mês' : '/ano'}
              features={FREE_FEATURES}
              isActive={userTier === 'free'}
              isBusy={isBusy}
              onAction={() => {}}
              actionLabel="Plano atual"
              isCurrentPlan={userTier === 'free'}
            />

            {/* Pro plan card */}
            {proPlan && (
              <PlanCard
                name={proPlan.name}
                description="Para corredores que querem evoluir"
                price={formatCurrency(proPlan.amount)}
                period={billingInterval === 'monthly' ? '/mês' : '/ano'}
                features={proPlan.features}
                isActive={userTier === 'pro'}
                highlighted={proPlan.highlighted}
                isBusy={isBusy}
                onAction={() => {
                  if (userTier === 'pro' && customerId) {
                    openPortal(customerId)
                  } else {
                    checkout(proPlan.id)
                  }
                }}
                actionLabel={userTier === 'pro' ? 'Gerenciar assinatura' : 'Assinar Pro'}
                isCurrentPlan={userTier === 'pro'}
                savingsPercent={
                  billingInterval === 'yearly' && proMonthly
                    ? calcAnnualSavingsPercent(proMonthly.amount, proPlan.amount)
                    : undefined
                }
              />
            )}

            {/* Premium plan card */}
            {premiumPlan && (
              <PlanCard
                name={premiumPlan.name}
                description="Para quem compete e quer resultado"
                price={formatCurrency(premiumPlan.amount)}
                period={billingInterval === 'monthly' ? '/mês' : '/ano'}
                features={premiumPlan.features}
                isActive={userTier === 'premium'}
                isBusy={isBusy}
                onAction={() => {
                  if (userTier === 'premium' && customerId) {
                    openPortal(customerId)
                  } else {
                    checkout(premiumPlan.id)
                  }
                }}
                actionLabel={userTier === 'premium' ? 'Gerenciar assinatura' : 'Assinar Premium'}
                isCurrentPlan={userTier === 'premium'}
                savingsPercent={
                  billingInterval === 'yearly' && premiumMonthly
                    ? calcAnnualSavingsPercent(premiumMonthly.amount, premiumPlan.amount)
                    : undefined
                }
              />
            )}
          </>
        )}
      </div>
    </div>
  )
}

interface PlanCardProps {
  name: string
  description: string
  price: string
  period: string
  features: string[]
  isActive: boolean
  highlighted?: boolean
  isBusy: boolean
  onAction: () => void
  actionLabel: string
  isCurrentPlan: boolean
  savingsPercent?: number
}

function PlanCard({
  name,
  description,
  price,
  period,
  features,
  isActive,
  highlighted,
  isBusy,
  onAction,
  actionLabel,
  isCurrentPlan,
  savingsPercent,
}: PlanCardProps) {
  return (
    <div
      className={`relative p-5 rounded-2xl border transition-all duration-200 ${
        isActive
          ? 'border-accent/45 bg-accent-dim'
          : highlighted
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
          <div className="flex items-center gap-2">
            <h3 className="font-display font-semibold text-sm text-foreground tracking-tight">
              {name}
            </h3>
            {isActive && (
              <span className="px-2 py-0.5 bg-green-500/15 text-green-400 text-[10px] font-bold rounded-full">
                Ativo
              </span>
            )}
          </div>
          <p className="text-xs text-foreground-muted mt-0.5">
            {description}
          </p>
        </div>
        <div className="text-right flex-shrink-0">
          <span className="font-display font-bold text-xl text-foreground tracking-tight">
            {price}
          </span>
          <span className="text-xs text-foreground-muted">{period}</span>
          {savingsPercent && savingsPercent > 0 && (
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

      {isCurrentPlan && name === 'Gratuito' ? (
        <div className="px-4 py-2.5 rounded-full bg-accent/10 text-accent text-xs font-bold text-center">
          Plano atual
        </div>
      ) : (
        <button
          onClick={onAction}
          disabled={isBusy}
          className={`w-full px-4 py-2.5 rounded-full text-xs font-bold flex items-center justify-center gap-1.5 transition-colors ${
            isActive
              ? 'bg-accent/10 text-accent hover:bg-accent/20'
              : highlighted
              ? 'bg-[#00F048] text-[#14162E] hover:bg-[#00F048]/90'
              : 'bg-background-tertiary text-foreground hover:bg-background-tertiary/80'
          } disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          {isBusy ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          ) : !isActive ? (
            <Zap className="w-3.5 h-3.5" />
          ) : null}
          {actionLabel}
        </button>
      )}
    </div>
  )
}
