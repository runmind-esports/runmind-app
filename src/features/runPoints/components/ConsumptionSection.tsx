'use client'

import { useRunPointsStatus } from '../hooks/useRunPointsStatus'
import { CircularGauge } from './CircularGauge'
import { WeeklyBarChart } from './WeeklyBarChart'
import { LowRunPointsCard } from './LowRunPointsCard'

export function ConsumptionSection() {
  const { currentPoints, maxPoints, percentage, nextResetAt, tier, history, isLoading, error } = useRunPointsStatus()

  if (isLoading) {
    return (
      <div className="animate-pulse flex flex-col items-center gap-6">
        <div className="w-[200px] h-[200px] rounded-full bg-background-tertiary" />
        <div className="flex items-end gap-2 h-[120px] w-full">
          {Array.from({ length: 7 }).map((_, i) => (
            <div key={i} className="flex-1 bg-background-tertiary rounded-t-sm" style={{ height: `${30 + Math.random() * 50}%` }} />
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <p className="text-red-400 text-sm">
        Erro ao carregar RunPoints. Tente novamente.
      </p>
    )
  }

  return (
    <div>
      <div className="flex items-center gap-2 mb-6">
        <h2 className="font-display font-bold text-lg">RunPoints</h2>
        <span className="bg-accent/15 text-accent text-xs px-2 py-0.5 rounded-full capitalize">
          {tier}
        </span>
      </div>

      <CircularGauge current={currentPoints} max={maxPoints} percentage={percentage} />

      <hr className="border-border my-6" />

      <p className="text-sm font-bold text-foreground-muted mb-3">Últimos 7 dias</p>
      <WeeklyBarChart history={history} />

      <div className="mt-4">
        <LowRunPointsCard percentage={percentage} nextResetAt={nextResetAt} currentPoints={currentPoints} />
      </div>
    </div>
  )
}
