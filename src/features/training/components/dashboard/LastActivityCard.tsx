'use client'

import { Activity, Heart, MapPin, Timer, Zap } from 'lucide-react'
import type { StravaActivity } from '@/features/strava'
import { Card } from '@/components/ui/card'
import { Shimmer } from '@/components/ui/shimmer'
import { formatDistance, formatPace, formatDuration, formatDateShort } from '../../utils/formatters'

interface LastActivityCardProps {
  activity: StravaActivity | undefined
  isLoading?: boolean
}

export function LastActivityCard({ activity, isLoading }: LastActivityCardProps) {
  if (isLoading) {
    return (
      <Card>
        <Shimmer className="h-4 w-32 rounded-lg" />
        <Shimmer className="mt-1.5 h-3 w-16" />
        <div className="mt-3 grid grid-cols-4 gap-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="space-y-1.5">
              <Shimmer className="h-4 w-10" />
              <Shimmer className="h-2.5 w-12" />
            </div>
          ))}
        </div>
      </Card>
    )
  }

  if (!activity) {
    return (
      <Card className="flex flex-col items-center justify-center py-10 text-foreground-muted">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-background-tertiary mb-3">
          <Activity size={24} />
        </div>
        <p className="text-sm font-medium">Nenhuma atividade recente</p>
        <p className="text-xs mt-1 text-foreground-muted/60">Conecte o Strava para ver seus treinos</p>
      </Card>
    )
  }

  const stats = [
    { icon: <MapPin size={14} />, value: formatDistance(activity.distance), label: 'Distância' },
    { icon: <Zap size={14} />, value: formatPace(activity.average_speed), label: 'Pace' },
    { icon: <Timer size={14} />, value: formatDuration(activity.moving_time), label: 'Tempo' },
    ...(activity.has_heartrate && activity.average_heartrate ? [{
      icon: <Heart size={14} className="text-red-500" />,
      value: `${Math.round(activity.average_heartrate)}`,
      label: 'BPM',
    }] : []),
  ]

  return (
    <Card>
      {/* Accent bar */}
      <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-gradient-to-b from-accent to-accent/30 rounded-l-2xl" />

      <div className="flex items-start justify-between mb-3">
        <div>
          <p className="font-display font-bold text-sm text-foreground">{activity.name}</p>
          <p className="text-[10px] text-foreground-muted mt-0.5">{formatDateShort(activity.start_date_local)}</p>
        </div>
        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-accent/10 text-accent">
          <Activity size={14} />
        </div>
      </div>

      <div className="grid grid-cols-4 gap-3">
        {stats.map((stat) => (
          <div key={stat.label}>
            <div className="flex items-center gap-1 text-foreground-muted mb-0.5">
              {stat.icon}
            </div>
            <p className="font-display font-bold text-sm text-foreground">{stat.value}</p>
            <p className="text-[9px] uppercase tracking-wider text-foreground-muted">{stat.label}</p>
          </div>
        ))}
      </div>
    </Card>
  )
}
