'use client'

import { Activity, Heart } from 'lucide-react'
import type { StravaActivity } from '@/features/strava'
import { formatDistance, formatPace, formatDuration, formatDateShort } from '../../utils/formatters'

interface LastActivityCardProps {
  activity: StravaActivity | undefined
  isLoading?: boolean
}

export function LastActivityCard({ activity, isLoading }: LastActivityCardProps) {
  if (isLoading) {
    return (
      <div className="bg-background-secondary rounded-2xl p-4 border border-border space-y-3">
        <div className="h-5 w-32 rounded bg-background-tertiary animate-shimmer bg-[length:200%_100%] bg-gradient-to-r from-background-tertiary via-background-secondary to-background-tertiary" />
        <div className="h-4 w-20 rounded bg-background-tertiary animate-shimmer bg-[length:200%_100%] bg-gradient-to-r from-background-tertiary via-background-secondary to-background-tertiary" />
        <div className="flex gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-10 w-16 rounded bg-background-tertiary animate-shimmer bg-[length:200%_100%] bg-gradient-to-r from-background-tertiary via-background-secondary to-background-tertiary" />
          ))}
        </div>
      </div>
    )
  }

  if (!activity) {
    return (
      <div className="bg-background-secondary rounded-2xl p-4 border border-border flex flex-col items-center justify-center py-8 text-foreground-muted">
        <Activity size={32} className="mb-2" />
        <p className="text-sm">Nenhuma atividade recente</p>
      </div>
    )
  }

  return (
    <div className="bg-background-secondary rounded-2xl p-4 border border-border">
      <div className="flex items-center justify-between mb-3">
        <p className="font-semibold text-foreground">{activity.name}</p>
        <span className="text-xs text-foreground-muted">{formatDateShort(activity.start_date_local)}</span>
      </div>
      <div className="flex gap-4">
        <div>
          <p className="font-semibold text-foreground">{formatDistance(activity.distance)}</p>
          <p className="text-xs text-foreground-muted">Distancia</p>
        </div>
        <div>
          <p className="font-semibold text-foreground">{formatPace(activity.average_speed)}</p>
          <p className="text-xs text-foreground-muted">Pace</p>
        </div>
        <div>
          <p className="font-semibold text-foreground">{formatDuration(activity.moving_time)}</p>
          <p className="text-xs text-foreground-muted">Tempo</p>
        </div>
        {activity.has_heartrate && activity.average_heartrate && (
          <div>
            <p className="font-semibold text-foreground flex items-center gap-1">
              <Heart size={14} className="text-red-500" />
              {Math.round(activity.average_heartrate)}
            </p>
            <p className="text-xs text-foreground-muted">BPM</p>
          </div>
        )}
      </div>
    </div>
  )
}
