'use client'

import { TrendingUp, TrendingDown } from 'lucide-react'
import { formatTrend } from '../../utils/formatters'

interface WeekComparisonProps {
  currentKm: number
  previousKm: number
}

export function WeekComparison({ currentKm, previousKm }: WeekComparisonProps) {
  if (previousKm === 0) {
    return (
      <div className="flex items-center gap-2 px-1">
        <span className="text-sm font-semibold text-foreground-muted">
          Primeira semana de treino!
        </span>
      </div>
    )
  }

  const trend = formatTrend(currentKm * 1000, previousKm * 1000)
  const TrendIcon = trend.isPositive ? TrendingUp : TrendingDown

  return (
    <div className="flex items-center gap-2 px-1">
      <TrendIcon
        size={14}
        className={trend.isPositive ? 'text-[#00F048]' : 'text-red-500'}
      />
      <span className={`text-sm font-semibold ${trend.isPositive ? 'text-[#00F048]' : 'text-red-500'}`}>
        {trend.value}
      </span>
      <span className="text-xs text-foreground-muted">vs semana passada</span>
    </div>
  )
}
