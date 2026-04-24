'use client'

import { CheckCircle } from 'lucide-react'
import { formatDistance, formatPace, formatDuration } from '../../utils/formatters'

interface WorkoutSummaryProps {
  distance?: number
  duration?: number
  avgSpeed?: number
  avgHR?: number
  calories?: number
  isLoading?: boolean
}

function SkeletonSummary() {
  return (
    <div className="animate-pulse rounded-2xl border border-border bg-background-secondary p-4">
      <div className="mb-3 h-5 w-36 rounded bg-background-tertiary" />
      <div className="grid grid-cols-2 gap-3">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-12 rounded bg-background-tertiary" />
        ))}
      </div>
    </div>
  )
}

export function WorkoutSummary({
  distance,
  duration,
  avgSpeed,
  avgHR,
  calories,
  isLoading,
}: WorkoutSummaryProps) {
  if (isLoading) return <SkeletonSummary />

  const metrics: Array<{ value: string; label: string }> = []

  if (distance != null) {
    metrics.push({ value: formatDistance(distance), label: 'Distancia' })
  }
  if (duration != null) {
    metrics.push({ value: formatDuration(duration), label: 'Duracao' })
  }
  if (avgSpeed != null && avgSpeed > 0) {
    metrics.push({ value: formatPace(avgSpeed), label: 'Pace' })
  }
  if (avgHR != null) {
    metrics.push({ value: `${Math.round(avgHR)} bpm`, label: 'FC Media' })
  }
  if (calories != null) {
    metrics.push({ value: `${calories} kcal`, label: 'Calorias' })
  }

  if (metrics.length === 0) return null

  return (
    <div className="rounded-2xl border border-border bg-background-secondary p-4">
      <div className="mb-3 flex items-center gap-2">
        <CheckCircle size={16} className="text-green-500" />
        <h3 className="text-sm font-semibold text-foreground">Resumo do Treino</h3>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {metrics.map((metric) => (
          <div key={metric.label}>
            <p className="text-lg font-bold text-foreground">{metric.value}</p>
            <p className="text-xs text-foreground-muted">{metric.label}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
