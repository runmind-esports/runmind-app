'use client'

import { Footprints, Bike, PersonStanding, Activity, Heart } from 'lucide-react'
import type { StravaActivity } from '@/features/strava'
import { formatDistance, formatPace, formatDuration, formatDateShort } from '../../utils/formatters'

interface ActivityListItemProps {
  activity: StravaActivity
  onTap: (id: number) => void
}

function getActivityIcon(type: string) {
  switch (type) {
    case 'Run':
      return Footprints
    case 'Ride':
      return Bike
    case 'Walk':
      return PersonStanding
    default:
      return Activity
  }
}

export function ActivityListItem({ activity, onTap }: ActivityListItemProps) {
  const Icon = getActivityIcon(activity.type)

  return (
    <div
      onClick={() => onTap(activity.id)}
      className="flex cursor-pointer items-center gap-3 rounded-xl border border-border bg-background-secondary p-3 transition-colors hover:bg-background-tertiary"
    >
      <div className="flex flex-col items-center gap-1">
        <Icon size={20} className="text-accent" />
        <span className="text-xs text-foreground-muted">
          {formatDateShort(activity.start_date_local)}
        </span>
      </div>

      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-foreground">
          {activity.name}
        </p>
        <p className="text-xs text-foreground-muted">
          {formatDistance(activity.distance)}
          {' · '}
          {formatPace(activity.average_speed)}
          {' · '}
          {formatDuration(activity.moving_time)}
        </p>
      </div>

      {activity.has_heartrate && activity.average_heartrate && (
        <div className="flex items-center gap-1">
          <Heart size={14} className="text-red-500" />
          <span className="text-sm text-foreground">
            {Math.round(activity.average_heartrate)}
          </span>
        </div>
      )}
    </div>
  )
}
