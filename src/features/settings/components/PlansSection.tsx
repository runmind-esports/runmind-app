'use client'

import { useState, useMemo } from 'react'
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

// Effective monthly rate for the segmented control: yearly amount ÷ 12 makes
// the "you actually pay R$ 19,90/mês" comparison legible next to the headline
// total. Same divisor for semestral (÷ 6). Returns centavos.
function effectiveMonthlyCentavos(plan: SubscriptionPlan, interval: BillingInterval): number {
  if (interval === 'yearly') return Math.round(plan.amount / 12)
  if (interval === 'semestral') return Math.round(plan.amount / 6)
  return plan.amount
}

// % saved vs paying the monthly plan for the equivalent duration. Returns 0
// for the monthly itself (no savings to advertise).
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

const INTERVAL_OPTIONS: BillingInterval[] = ['monthly', 'semestral', 'yearly']

// Free tier has no API record (the backend only stores paid plans). The card
// copy lives here so the Free option always renders for unpaid users without
// an extra round-trip.
const FREE_FEATURES = [
  '50 RunPoints por dia',
  '1 anexo por dia',
  '3 conversas',
  'Integração Strava + Google Health',
]

export function PlansSection() {
  const { plans, isLoadingPlans, isCheckingOut, isOpeningPortal, error, checkout, openPortal } = useSubscription()
  const { tier: userTier, interval: userInterval, expiresAt, customerId, isLoading: isLoadingTier } = useUserTier()
  const [selectedInterval, setSelectedInterval] = useState<BillingInterval>('monthly')

  const isLoading = isLoadingPlans || isLoadingTier
  const isBusy = isCheckingOut || isOpeningPortal
  const isPaid = userTier === 'pro' || userTier === 'premium'

  // Premium plans are filtered out of marketing UI per Phase 20 — legacy
  // Premium subscribers keep their entitlements via the "Seu plano" banner
  // (driven by useUserTier, not this list), but the upgrade ladder no longer
  // surfaces Premium as an option.
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

  const selectedProPlan = proByInterval[selectedInterval]
  const monthlyAnchor = proByInterval.monthly?.amount ?? 0
  // Premium users see no upgrade ladder — their banner already says "Premium"
  // and the goal is to keep them rather than offer a downgrade.
  const showUpgradeSection = userTier === 'free' || userTier === 'pro'

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

          <div className="space-y-3">
            {/* Free card — only when the user hasn't upgraded yet. */}
            {userTier === 'free' && <FreeCard />}

            {/* Pro card with the 3-frequency segmented control. */}
            <ProCard
              proByInterval={proByInterval}
              selectedInterval={selectedInterval}
              onIntervalChange={setSelectedInterval}
              selectedPlan={selectedProPlan}
              monthlyAnchor={monthlyAnchor}
              userTier={userTier}
              userInterval={userInterval}
              isBusy={isBusy}
              onCheckout={checkout}
            />
          </div>
        </>
      )}
    </div>
  )
}

function FreeCard() {
  return (
    <div className="relative p-5 rounded-2xl border border-border bg-background">
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="font-display font-semibold text-sm text-foreground tracking-tight">
            Gratuito
          </h3>
          <p className="text-xs text-foreground-muted mt-0.5">
            Pra experimentar o coach IA com limites diários.
          </p>
        </div>
        <div className="text-right flex-shrink-0">
          <span className="font-display font-bold text-xl text-foreground tracking-tight">
            R$ 0
          </span>
          <span className="text-xs text-foreground-muted">/mês</span>
        </div>
      </div>

      <ul className="space-y-1.5 mb-4">
        {FREE_FEATURES.map((feature) => (
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

interface ProCardProps {
  proByInterval: Record<BillingInterval, SubscriptionPlan | undefined>
  selectedInterval: BillingInterval
  onIntervalChange: (next: BillingInterval) => void
  selectedPlan: SubscriptionPlan | undefined
  monthlyAnchor: number
  userTier: string
  userInterval: string | null
  isBusy: boolean
  onCheckout: (planId: string) => void
}

function ProCard({
  proByInterval,
  selectedInterval,
  onIntervalChange,
  selectedPlan,
  monthlyAnchor,
  userTier,
  userInterval,
  isBusy,
  onCheckout,
}: ProCardProps) {
  const highlighted = userTier === 'free'

  // The user is "already on" the selected variant when they're a Pro
  // subscriber AND their server-side interval matches the selector. In that
  // case the CTA degrades to a disabled "Plano atual" badge — keeps the card
  // visible (so the comparison stays in view) without offering a no-op.
  const isCurrentVariant = userTier === 'pro' && userInterval === selectedInterval

  const ctaLabel = (() => {
    if (isCurrentVariant) return 'Plano atual'
    if (userTier === 'pro') return `Mudar para ${INTERVAL_DISPLAY[selectedInterval]}`
    return 'Assinar Pro'
  })()

  const handleClick = () => {
    if (!selectedPlan || isCurrentVariant) return
    onCheckout(selectedPlan.id)
  }

  return (
    <div
      className={`relative p-5 rounded-2xl border transition-all duration-200 ${
        highlighted ? 'border-[#00F048]/30 bg-background' : 'border-border bg-background'
      }`}
    >
      {highlighted && (
        <div className="absolute -top-2.5 left-5 px-2.5 py-0.5 bg-[#00F048] text-[#14162E] text-[10px] font-bold rounded-full tracking-wide uppercase">
          Recomendado
        </div>
      )}

      <div className="mb-4">
        <h3 className="font-display font-semibold text-sm text-foreground tracking-tight">
          Pro
        </h3>
        <p className="text-xs text-foreground-muted mt-0.5">
          Coach IA com Strava + Health Connect, planilhas personalizadas e chat ilimitado.
        </p>
      </div>

      <FrequencySelector
        proByInterval={proByInterval}
        selectedInterval={selectedInterval}
        onIntervalChange={onIntervalChange}
      />

      <PriceDisplay
        plan={selectedPlan}
        interval={selectedInterval}
        monthlyAnchor={monthlyAnchor}
      />

      <ul className="space-y-1.5 mb-4 mt-4">
        {(selectedPlan?.features ?? []).map((feature) => (
          <li key={feature} className="flex items-center gap-2 text-xs text-foreground-muted">
            <Check className="w-3.5 h-3.5 text-accent flex-shrink-0" />
            {feature}
          </li>
        ))}
      </ul>

      <button
        onClick={handleClick}
        disabled={isBusy || isCurrentVariant || !selectedPlan}
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

interface FrequencySelectorProps {
  proByInterval: Record<BillingInterval, SubscriptionPlan | undefined>
  selectedInterval: BillingInterval
  onIntervalChange: (next: BillingInterval) => void
}

function FrequencySelector({ proByInterval, selectedInterval, onIntervalChange }: FrequencySelectorProps) {
  return (
    <div
      role="tablist"
      aria-label="Frequência de cobrança"
      className="flex p-1 mb-3 rounded-full bg-background-tertiary"
    >
      {INTERVAL_OPTIONS.map((interval) => {
        const isActive = interval === selectedInterval
        const available = !!proByInterval[interval]
        return (
          <button
            key={interval}
            type="button"
            role="tab"
            aria-selected={isActive}
            disabled={!available}
            onClick={() => onIntervalChange(interval)}
            className={`flex-1 px-3 py-2 rounded-full text-[13px] font-semibold transition-colors disabled:opacity-40 disabled:cursor-not-allowed ${
              isActive
                ? 'bg-[#00F048] text-[#14162E]'
                : 'bg-transparent text-foreground-muted hover:text-foreground'
            }`}
          >
            {INTERVAL_DISPLAY[interval]}
          </button>
        )
      })}
    </div>
  )
}

interface PriceDisplayProps {
  plan: SubscriptionPlan | undefined
  interval: BillingInterval
  monthlyAnchor: number
}

function PriceDisplay({ plan, interval, monthlyAnchor }: PriceDisplayProps) {
  // aria-live keeps screen readers in sync when the user toggles frequencies;
  // the mount guard avoids announcing the initial value as a "change".
  if (!plan) {
    return (
      <div className="text-xs text-foreground-muted" role="status" aria-live="polite">
        Plano indisponível no momento.
      </div>
    )
  }

  const monthly = effectiveMonthlyCentavos(plan, interval)
  const saved = savingsPercent(plan, interval, monthlyAnchor)
  const headline = formatCurrency(plan.amount)

  const periodLabel: string = (() => {
    if (interval === 'yearly') return 'cobrado anualmente'
    if (interval === 'semestral') return 'cobrado a cada 6 meses'
    return 'cobrado mensalmente'
  })()

  return (
    <div role="status" aria-live="polite" className="mb-1">
      <div className="flex items-baseline gap-2">
        <span className="font-display font-bold text-2xl text-foreground tracking-tight">
          {headline}
        </span>
        {interval !== 'monthly' && (
          <span className="text-xs text-foreground-muted">
            ({formatCurrency(monthly)}/mês)
          </span>
        )}
        {interval === 'monthly' && (
          <span className="text-xs text-foreground-muted">/mês</span>
        )}
      </div>
      <p className="text-[11px] text-foreground-muted mt-0.5">{periodLabel}</p>
      {saved > 0 && (
        <span className="inline-block mt-2 px-2 py-0.5 bg-green-500/15 text-green-400 text-[10px] font-bold rounded-full">
          Economize {saved}%
        </span>
      )}
    </div>
  )
}
