'use client'

import { Activity, Bike, Footprints } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { formatDistance, formatPace, formatRelativeDate } from '../../utils/formatters'
import type { StravaActivity } from '@/features/strava/types/activities.types'

interface RecentActivityCardProps {
  activity: StravaActivity
}

function ActivityIcon({ type }: { type: string }) {
  const iconClass = 'shrink-0'
  if (type === 'Run') return <Footprints size={16} className={iconClass} />
  if (type === 'Ride') return <Bike size={16} className={iconClass} />
  return <Activity size={16} className={iconClass} />
}

export function RecentActivityCard({ activity }: RecentActivityCardProps) {
  return (
    <Card className="flex items-center gap-3 py-3">
      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent/10 text-accent shrink-0">
        <ActivityIcon type={activity.type} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-foreground truncate">{activity.name}</p>
        <div className="flex items-center gap-2 text-[11px] text-foreground-muted">
          <span>{formatDistance(activity.distance)}</span>
          <span>·</span>
          <span>{formatPace(activity.average_speed)}</span>
        </div>
      </div>
      <span className="text-[11px] text-foreground-muted shrink-0">
        {formatRelativeDate(activity.start_date_local)}
      </span>
    </Card>
  )
}
