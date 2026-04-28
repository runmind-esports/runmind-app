'use client'

import { useSubscription } from '@/features/subscription'

interface LowRunPointsCardProps {
  percentage: number
  nextResetAt: string | null
  currentPoints: number
}

function getResetLabel(nextResetAt: string | null): string {
  if (!nextResetAt) return 'Reseta à meia-noite'
  const diff = new Date(nextResetAt).getTime() - Date.now()
  if (diff <= 0) return 'Resetando...'
  const hours = Math.floor(diff / 3600000)
  const mins = Math.floor((diff % 3600000) / 60000)
  return `Reseta em ${hours}h ${mins}min`
}

export function LowRunPointsCard({ percentage, nextResetAt, currentPoints }: LowRunPointsCardProps) {
  const { plans, checkout, isCheckingOut } = useSubscription()

  if (percentage >= 10) return null

  const handleUpgrade = () => {
    if (plans.length > 0) {
      checkout(plans[0].id)
    }
  }

  return (
    <div className="bg-background-tertiary rounded-2xl border border-border p-5">
      {currentPoints > 0 ? (
        <>
          <p className="font-bold text-foreground text-sm">
            Hora de reabastecer! 🏃‍♂️
          </p>
          <p className="text-foreground-muted text-xs mt-1">
            Seus RunPoints estão acabando.
          </p>
        </>
      ) : (
        <>
          <p className="font-bold text-red-400 text-sm">
            Suas calorias do dia acabaram
          </p>
        </>
      )}

      <p className="text-foreground-muted text-xs mt-2">
        {getResetLabel(nextResetAt)}
      </p>

      <button
        onClick={handleUpgrade}
        disabled={isCheckingOut || plans.length === 0}
        className="mt-3 bg-accent text-background rounded-full px-4 py-2.5 text-sm font-bold hover:bg-accent/90 transition-colors disabled:opacity-50"
      >
        {isCheckingOut ? 'Redirecionando...' : 'Fazer upgrade'}
      </button>
    </div>
  )
}
