'use client'

import { useRouter } from 'next/navigation'
import { Footprints, Bike, PersonStanding } from 'lucide-react'
import { formatDistance, formatPace, formatDuration } from '../../utils/formatters'
import type { StravaActivity } from '@/features/strava'

const DAY_NAMES = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab', 'Dom']

function getActivityIcon(type: string) {
  switch (type.toLowerCase()) {
    case 'ride':
      return <Bike size={16} className="text-foreground-muted flex-shrink-0" />
    case 'walk':
      return <PersonStanding size={16} className="text-foreground-muted flex-shrink-0" />
    default:
      return <Footprints size={16} className="text-foreground-muted flex-shrink-0" />
  }
}

interface DayCardProps {
  date: Date
  activity?: StravaActivity
  isToday: boolean
}

export function DayCard({ date, activity, isToday }: DayCardProps) {
  const router = useRouter()

  // getDay() returns 0=Sun, 1=Mon... We need Mon=0, Sun=6
  const dayIndex = date.getDay() === 0 ? 6 : date.getDay() - 1
  const dayName = DAY_NAMES[dayIndex]
  const dayNumber = date.getDate()

  const handleClick = () => {
    if (activity) {
      router.push(`/training/history/${activity.id}`)
    }
  }

  let borderClasses: string
  if (activity) {
    borderClasses = 'border-l-4 border-l-green-500 bg-background-secondary'
  } else if (isToday) {
    borderClasses = 'border-l-4 border-l-accent bg-background-secondary'
  } else {
    borderClasses = 'border border-border bg-background-secondary opacity-60'
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={!activity}
      className={`w-full rounded-xl p-3 text-left ${borderClasses} ${activity ? 'cursor-pointer active:scale-[0.98] transition-transform' : 'cursor-default'}`}
    >
      <div className="flex items-start gap-3">
        {/* Day label */}
        <div className="flex flex-col items-center min-w-[32px]">
          <span className="text-xs text-foreground-muted font-body">{dayName}</span>
          <span className="text-sm font-bold text-foreground">{dayNumber}</span>
        </div>

        {/* Content */}
        {activity ? (
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              {getActivityIcon(activity.type)}
              <span className="text-sm font-medium text-foreground truncate">
                {activity.name}
              </span>
            </div>
            <div className="flex items-center gap-3 mt-1">
              <span className="text-xs text-foreground-muted">{formatDistance(activity.distance)}</span>
              <span className="text-xs text-foreground-muted">{formatPace(activity.average_speed)}</span>
              <span className="text-xs text-foreground-muted">{formatDuration(activity.moving_time)}</span>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex items-center">
            <span className="text-xs text-foreground-muted italic">Descanso</span>
          </div>
        )}
      </div>
    </button>
  )
}
