'use client'

import { TrendingUp, TrendingDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Card } from '@/components/ui/card'
import { Shimmer } from '@/components/ui/shimmer'

interface MetricCardProps {
  label: string
  value: string
  icon: React.ReactNode
  trend?: { value: string, isPositive: boolean }
  isLoading?: boolean
  className?: string
  accent?: 'green' | 'blue' | 'orange'
}

const accentStyles = {
  green: 'from-[#00F048]/15 to-transparent text-[#00F048]',
  blue: 'from-[#3B82F6]/15 to-transparent text-[#3B82F6]',
  orange: 'from-[#F97316]/15 to-transparent text-[#F97316]',
}

export function MetricCard({ label, value, icon, trend, isLoading, className, accent = 'green' }: MetricCardProps) {
  if (isLoading) {
    return (
      <Card className={className}>
        <Shimmer className="h-8 w-8 rounded-lg" />
        <Shimmer className="mt-2.5 h-6 w-16 rounded-lg" />
        <Shimmer className="mt-1.5 h-3 w-20" />
      </Card>
    )
  }

  return (
    <Card className={cn('transition-transform duration-200 hover:scale-[1.02]', className)}>
      {/* Gradient glow */}
      <div className={cn('absolute -top-6 -right-6 h-20 w-20 rounded-full bg-gradient-to-br opacity-60', accentStyles[accent])} />

      <div className={cn('relative flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br', accentStyles[accent])}>
        <div className="scale-75">{icon}</div>
      </div>
      <p className="relative mt-2 text-xl font-extrabold tracking-tight text-foreground font-display">{value}</p>
      <p className="relative text-[10px] font-medium uppercase tracking-wider text-foreground-muted">{label}</p>
      {trend && (
        <div className={cn('relative mt-1 flex items-center gap-1 text-[10px] font-semibold', trend.isPositive ? 'text-[#00F048]' : 'text-red-500')}>
          {trend.isPositive ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
          <span>{trend.value}</span>
        </div>
      )}
    </Card>
  )
}
