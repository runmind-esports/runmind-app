'use client'

import { TrendingUp, TrendingDown } from 'lucide-react'

interface MetricCardProps {
  label: string
  value: string
  icon: React.ReactNode
  trend?: { value: string, isPositive: boolean }
  isLoading?: boolean
  className?: string
}

export function MetricCard({ label, value, icon, trend, isLoading, className }: MetricCardProps) {
  if (isLoading) {
    return (
      <div className={`bg-background-secondary rounded-2xl p-4 border border-border ${className ?? ''}`}>
        <div className="h-6 w-6 rounded bg-background-tertiary animate-shimmer bg-[length:200%_100%] bg-gradient-to-r from-background-tertiary via-background-secondary to-background-tertiary" />
        <div className="mt-3 h-7 w-16 rounded bg-background-tertiary animate-shimmer bg-[length:200%_100%] bg-gradient-to-r from-background-tertiary via-background-secondary to-background-tertiary" />
        <div className="mt-1 h-4 w-20 rounded bg-background-tertiary animate-shimmer bg-[length:200%_100%] bg-gradient-to-r from-background-tertiary via-background-secondary to-background-tertiary" />
      </div>
    )
  }

  return (
    <div className={`bg-background-secondary rounded-2xl p-4 border border-border ${className ?? ''}`}>
      <div className="text-accent">{icon}</div>
      <p className="mt-2 text-2xl font-bold text-foreground font-body">{value}</p>
      <p className="text-sm text-foreground-muted">{label}</p>
      {trend && (
        <div className={`mt-1 flex items-center gap-1 text-xs ${trend.isPositive ? 'text-green-500' : 'text-red-500'}`}>
          {trend.isPositive ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
          <span>{trend.value}</span>
        </div>
      )}
    </div>
  )
}
