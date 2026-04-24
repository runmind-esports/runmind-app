'use client'

import { useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { useWeekNavigation, getDaysOfWeek } from '../../hooks/useWeekNavigation'
import { useStravaActivities, useStrava } from '@/features/strava'
import { StravaConnectCTA } from '../dashboard/StravaConnectCTA'
import { WeekSelector } from './WeekSelector'
import { WeekSummary } from './WeekSummary'
import { DayCard } from './DayCard'
import type { StravaActivity } from '@/features/strava'

function isSameDay(d1: Date, d2: Date): boolean {
  return (
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate()
  )
}

export function WeekScreen() {
  const router = useRouter()
  const {
    weekStart,
    weekEnd,
    weekLabel,
    isCurrentWeek,
    goToPreviousWeek,
    goToNextWeek,
  } = useWeekNavigation()

  const { isConnected, isLoadingStatus } = useStrava()
  const { activities, isLoading } = useStravaActivities(1, 100)

  // Filter activities for the current week range
  const weekActivities = useMemo(() => {
    if (!activities?.length) return []
    return activities.filter((a: StravaActivity) => {
      const d = new Date(a.start_date_local)
      return d >= weekStart && d <= weekEnd
    })
  }, [activities, weekStart, weekEnd])

  // Get 7 days of the week (Mon-Sun)
  const days = useMemo(() => getDaysOfWeek(weekStart), [weekStart])

  const today = useMemo(() => new Date(), [])

  // Map each day to its activity (if any)
  const dayActivities = useMemo(() => {
    return days.map((day) => {
      const activity = weekActivities.find((a: StravaActivity) =>
        isSameDay(new Date(a.start_date_local), day)
      )
      return { day, activity }
    })
  }, [days, weekActivities])

  if (isLoadingStatus) {
    return (
      <div className="p-4 space-y-4 max-w-lg mx-auto">
        <WeekSelector
          weekLabel={weekLabel}
          isCurrentWeek={isCurrentWeek}
          onPrev={goToPreviousWeek}
          onNext={goToNextWeek}
        />
        <WeekSummary activities={[]} isLoading />
      </div>
    )
  }

  if (!isConnected) {
    return (
      <div className="p-4 space-y-4 max-w-lg mx-auto">
        <StravaConnectCTA onConnect={() => router.push('/settings')} />
      </div>
    )
  }

  return (
    <div className="p-4 space-y-4 max-w-lg mx-auto">
      <WeekSelector
        weekLabel={weekLabel}
        isCurrentWeek={isCurrentWeek}
        onPrev={goToPreviousWeek}
        onNext={goToNextWeek}
      />

      <WeekSummary activities={weekActivities} isLoading={isLoading} />

      <div className="space-y-2">
        {dayActivities.map(({ day, activity }) => (
          <DayCard
            key={day.toISOString()}
            date={day}
            activity={activity}
            isToday={isSameDay(day, today)}
          />
        ))}
      </div>
    </div>
  )
}
