'use client'

import { formatDistance, formatDuration } from '../../utils/formatters'
import type { StravaActivity } from '@/features/strava'

interface WeekSummaryProps {
  activities: StravaActivity[]
  isLoading?: boolean
}

function SkeletonStat() {
  return (
    <div className="flex-1 flex flex-col items-center gap-1">
      <div className="h-6 w-12 rounded bg-background-tertiary animate-shimmer bg-[length:200%_100%] bg-gradient-to-r from-background-tertiary via-background-secondary to-background-tertiary" />
      <div className="h-3 w-16 rounded bg-background-tertiary animate-shimmer bg-[length:200%_100%] bg-gradient-to-r from-background-tertiary via-background-secondary to-background-tertiary" />
    </div>
  )
}

export function WeekSummary({ activities, isLoading }: WeekSummaryProps) {
  const totalDistance = activities.reduce((sum, a) => sum + a.distance, 0)
  const totalRuns = activities.length
  const totalTime = activities.reduce((sum, a) => sum + a.moving_time, 0)

  return (
    <div className="bg-background-secondary rounded-xl p-4 border border-border">
      <div className="flex items-center justify-around">
        {isLoading ? (
          <>
            <SkeletonStat />
            <SkeletonStat />
            <SkeletonStat />
          </>
        ) : (
          <>
            <div className="flex flex-col items-center">
              <span className="text-lg font-bold text-foreground">{formatDistance(totalDistance)}</span>
              <span className="text-xs text-foreground-muted">Distancia</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-lg font-bold text-foreground">{totalRuns}</span>
              <span className="text-xs text-foreground-muted">Corridas</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-lg font-bold text-foreground">{formatDuration(totalTime)}</span>
              <span className="text-xs text-foreground-muted">Tempo</span>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
