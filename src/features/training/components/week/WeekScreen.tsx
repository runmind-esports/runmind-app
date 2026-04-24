'use client'

import { useMemo } from 'react'
import { Link2 } from 'lucide-react'
import { useWeekNavigation, getDaysOfWeek } from '../../hooks/useWeekNavigation'
import { useStravaActivities, useStrava } from '@/features/strava'
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

function StravaConnectCTA() {
  return (
    <div className="bg-background-secondary rounded-xl p-6 border border-border text-center space-y-3">
      <div className="flex justify-center">
        <Link2 size={32} className="text-foreground-muted" />
      </div>
      <h3 className="text-sm font-medium text-foreground">Conecte seu Strava</h3>
      <p className="text-xs text-foreground-muted">
        Conecte sua conta do Strava para ver suas atividades no calendario semanal.
      </p>
      <a
        href="/settings"
        className="inline-block text-sm font-medium text-accent hover:text-accent-hover"
      >
        Ir para Configuracoes
      </a>
    </div>
  )
}

export function WeekScreen() {
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
        <StravaConnectCTA />
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
