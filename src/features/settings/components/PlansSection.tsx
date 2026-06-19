'use client'

import { useMemo } from 'react'
import { Check, Zap, Loader2, ExternalLink } from 'lucide-react'
import { useSubscription, useUserTier } from '@/features/subscription'
import type { BillingInterval, SubscriptionPlan } from '@/features/subscription'

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

function effectiveMonthlyCentavos(plan: SubscriptionPlan, interval: BillingInterval): number {
  if (interval === 'yearly') return Math.round(plan.amount / 12)
  if (interval === 'semestral') return Math.round(plan.amount / 6)
  return plan.amount
}

function savingsPercent(plan: SubscriptionPlan, interval: BillingInterval, monthlyAmount: number): number {
  if (interval === 'monthly' || monthlyAmount <= 0) return 0
  const months = interval === 'yearly' ? 12 : 6
  const baseline = monthlyAmount * months
  if (baseline <= 0) return 0
  return Math.round(((baseline - plan.amount) / baseline) * 100)
}

const TIER_DISPLAY: Record<string, string> = {
  free: 'Gratuito',
  pro: 'Pro',
  premium: 'Premium',
}

const INTERVAL_DISPLAY: Record<string, string> = {
  monthly: 'Mensal',
  semestral: 'Semestral',
  yearly: 'Anual',
}

const PRO_INTERVALS: BillingInterval[] = ['monthly', 'semestral', 'yearly']

export function PlansSection() {
  const { plans, isLoadingPlans, isCheckingOut, isOpeningPortal, error, checkout, openPortal } = useSubscription()
  const { tier: userTier, interval: userInterval, expiresAt, customerId, isLoading: isLoadingTier } = useUserTier()

  const isLoading = isLoadingPlans || isLoadingTier
  const isBusy = isCheckingOut || isOpeningPortal
  const isPaid = userTier === 'pro' || userTier === 'premium'

  const freePlan = useMemo(() => plans.find((p) => p.tier === 'free'), [plans])
  const proPlans = useMemo(() => plans.filter((p) => p.tier === 'pro'), [plans])
  const proByInterval = useMemo(() => {
    return {
      monthly: proPlans.find((p) => p.interval === 'monthly'),
      semestral: proPlans.find((p) => p.interval === 'semestral'),
      yearly: proPlans.find((p) => p.interval === 'yearly'),
    } as Record<BillingInterval, SubscriptionPlan | undefined>
  }, [proPlans])

  if (isLoading) {
    return (
      <div className="space-y-4 animate-pulse">
        <div className="h-24 bg-background-tertiary rounded-2xl" />
        <div className="h-48 bg-background-tertiary rounded-2xl" />
      </div>
    )
  }

  const monthlyAnchor = proByInterval.monthly?.amount ?? 0
  const showUpgradeSection = userTier === 'free' || userTier === 'pro'
  const showFreeCard = userTier === 'free'
  const gridCols = showFreeCard ? 'lg:grid-cols-4' : 'lg:grid-cols-3'

  return (
    <div className="space-y-6">
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

      {error && (
        <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs text-center">
          {error}
        </div>
      )}

      {showUpgradeSection && (
        <>
          <div>
            <h3 className="text-sm font-bold text-foreground mb-1">
              {userTier === 'free' ? 'Escolha seu plano' : 'Mudar de frequência'}
            </h3>
            <p className="text-xs text-foreground-muted">
              {userTier === 'free'
                ? 'Comece grátis ou desbloqueie tudo no Pro.'
                : 'Pague menos por mês comprando mais tempo de uma vez.'}
            </p>
          </div>

          <div className={`grid sm:grid-cols-2 ${gridCols} gap-3`}>
            {showFreeCard && <FreeCard plan={freePlan} />}
            {PRO_INTERVALS.map((interval) => (
              <ProVariantCard
                key={interval}
                interval={interval}
                plan={proByInterval[interval]}
                monthlyAnchor={monthlyAnchor}
                userTier={userTier}
                userInterval={userInterval}
                isBusy={isBusy}
                onCheckout={checkout}
              />
            ))}
          </div>
        </>
      )}
    </div>
  )
}

function FreeCard({ plan }: { plan: SubscriptionPlan | undefined }) {
  const features = plan?.features ?? []
  return (
    <div className="relative p-5 rounded-2xl border border-border bg-background flex flex-col">
      <div className="mb-4">
        <span className="inline-block mb-2 px-2 py-0.5 bg-background-tertiary text-foreground-muted text-[10px] font-bold rounded-full tracking-wide uppercase">
          Grátis
        </span>
        <h3 className="font-display font-semibold text-sm text-foreground tracking-tight">
          Gratuito
        </h3>
        <p className="text-xs text-foreground-muted mt-0.5">
          Pra experimentar o coach IA com limites diários.
        </p>
      </div>

      <div className="mb-4">
        <div className="flex items-baseline gap-2">
          <span className="font-display font-bold text-2xl text-foreground tracking-tight">
            R$ 0
          </span>
          <span className="text-xs text-foreground-muted">/mês</span>
        </div>
        <p className="text-[11px] text-foreground-muted mt-0.5">Sem cobrança</p>
      </div>

      <ul className="space-y-1.5 mb-4 flex-1">
        {features.map((feature) => (
          <li key={feature} className="flex items-center gap-2 text-xs text-foreground-muted">
            <Check className="w-3.5 h-3.5 text-accent flex-shrink-0" />
            {feature}
          </li>
        ))}
      </ul>

      <button
        disabled
        className="w-full px-4 py-2.5 rounded-full text-xs font-bold bg-background-tertiary text-foreground-muted cursor-default"
      >
        Seu plano atual
      </button>
    </div>
  )
}

interface ProVariantCardProps {
  interval: BillingInterval
  plan: SubscriptionPlan | undefined
  monthlyAnchor: number
  userTier: string
  userInterval: string | null
  isBusy: boolean
  onCheckout: (planId: string) => void
}

function ProVariantCard({
  interval,
  plan,
  monthlyAnchor,
  userTier,
  userInterval,
  isBusy,
  onCheckout,
}: ProVariantCardProps) {
  const isCurrentVariant = userTier === 'pro' && userInterval === interval
  const highlighted = userTier === 'free' && interval === 'semestral'

  const badge: string | null = (() => {
    if (isCurrentVariant) return 'Plano atual'
    if (interval === 'monthly') return 'Mensal'
    if (interval === 'semestral') return 'Mais popular'
    return 'Melhor oferta'
  })()

  const ctaLabel = (() => {
    if (isCurrentVariant) return 'Plano atual'
    if (userTier === 'pro') return `Mudar para ${INTERVAL_DISPLAY[interval]}`
    return 'Assinar Pro'
  })()

  const handleClick = () => {
    if (!plan || isCurrentVariant) return
    onCheckout(plan.id)
  }

  if (!plan) {
    return (
      <div className="relative p-5 rounded-2xl border border-border bg-background flex flex-col">
        <div className="text-xs text-foreground-muted">
          Plano {INTERVAL_DISPLAY[interval]} indisponível no momento.
        </div>
      </div>
    )
  }

  const monthly = effectiveMonthlyCentavos(plan, interval)
  const saved = savingsPercent(plan, interval, monthlyAnchor)

  return (
    <div
      className={`relative p-5 rounded-2xl border transition-all duration-200 flex flex-col ${
        highlighted ? 'border-[#00F048]/30 bg-background' : 'border-border bg-background'
      }`}
    >
      <div className="mb-4">
        <span
          className={`inline-block mb-2 px-2 py-0.5 text-[10px] font-bold rounded-full tracking-wide uppercase ${
            isCurrentVariant
              ? 'bg-accent/15 text-accent'
              : highlighted
                ? 'bg-[#00F048] text-[#14162E]'
                : 'bg-background-tertiary text-foreground-muted'
          }`}
        >
          {badge}
        </span>
        <h3 className="font-display font-semibold text-sm text-foreground tracking-tight">
          Pro
        </h3>
        <p className="text-xs text-foreground-muted mt-0.5">
          Coach IA com Strava + Health Connect, planilhas e chat ilimitado.
        </p>
      </div>

      <div className="mb-4" role="status">
        <div className="flex items-baseline gap-2">
          <span className="font-display font-bold text-2xl text-foreground tracking-tight">
            {formatCurrency(monthly)}
          </span>
          <span className="text-xs text-foreground-muted">/mês</span>
        </div>
        <p className="text-[11px] text-foreground-muted mt-0.5">
          {interval === 'yearly'
            ? `Cobrado ${formatCurrency(plan.amount)} anualmente`
            : interval === 'semestral'
              ? `Cobrado ${formatCurrency(plan.amount)} a cada 6 meses`
              : 'Cobrado mensalmente'}
        </p>
        {saved > 0 && (
          <span className="inline-block mt-2 px-2 py-0.5 bg-green-500/15 text-green-400 text-[10px] font-bold rounded-full">
            Economize {saved}%
          </span>
        )}
      </div>

      <ul className="space-y-1.5 mb-4 flex-1">
        {(plan.features ?? []).map((feature) => (
          <li key={feature} className="flex items-center gap-2 text-xs text-foreground-muted">
            <Check className="w-3.5 h-3.5 text-accent flex-shrink-0" />
            {feature}
          </li>
        ))}
      </ul>

      <button
        onClick={handleClick}
        disabled={isBusy || isCurrentVariant}
        className={`w-full px-4 py-2.5 rounded-full text-xs font-bold flex items-center justify-center gap-1.5 transition-colors ${
          highlighted
            ? 'bg-[#00F048] text-[#14162E] hover:bg-[#00F048]/90'
            : 'bg-background-tertiary text-foreground hover:bg-background-tertiary/80'
        } disabled:opacity-50 disabled:cursor-not-allowed`}
      >
        {isBusy ? (
          <Loader2 className="w-3.5 h-3.5 animate-spin" />
        ) : !isCurrentVariant ? (
          <Zap className="w-3.5 h-3.5" />
        ) : null}
        {ctaLabel}
      </button>
    </div>
  )
}
