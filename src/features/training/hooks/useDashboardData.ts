'use client'

import { useState, useMemo, useCallback, useEffect } from 'react'
import { useStravaStats, useStravaActivities } from '@/features/strava'
import {
  filterCurrentWeek,
  filterPreviousWeek,
  sumDistance,
  calculateWeekStreak,
  generateCoachSuggestion,
  getWeeklyGoal,
  setWeeklyGoal,
  computeDefaultGoal,
} from '../utils/dashboardHelpers'
import type { CoachSuggestion } from '../utils/dashboardHelpers'
import type { StravaActivity } from '@/features/strava/types/activities.types'

export function useDashboardData() {
  const { activities, isLoading: isLoadingActivities } = useStravaActivities(1, 200)
  const { stats, isLoading: isLoadingStats } = useStravaStats()

  const [weeklyGoal, setGoalState] = useState(() => getWeeklyGoal())

  // Auto-set default goal when stats arrive and no stored goal exists
  useEffect(() => {
    if (weeklyGoal === 0 && stats?.recent_run_totals) {
      const defaultGoal = computeDefaultGoal(stats.recent_run_totals.distance)
      setWeeklyGoal(defaultGoal)
      setGoalState(defaultGoal)
    }
  }, [stats, weeklyGoal])

  const updateGoal = useCallback((km: number) => {
    setWeeklyGoal(km)
    setGoalState(km)
  }, [])

  const {
    currentWeekKm,
    previousWeekKm,
    streak,
    recentThree,
    suggestion,
  } = useMemo(() => {
    const currentWeekActivities = filterCurrentWeek(activities)
    const previousWeekActivities = filterPreviousWeek(activities)

    const curKm = sumDistance(currentWeekActivities) / 1000
    const prevKm = sumDistance(previousWeekActivities) / 1000

    const streakCount = calculateWeekStreak(activities)

    // Most recent 3 runs
    const runs = activities.filter((a: StravaActivity) => a.type === 'Run')
    const recent: StravaActivity[] = runs.slice(0, 3)

    // Days since last run
    let daysSinceLastRun = Infinity
    if (runs.length > 0) {
      const lastRunDate = new Date(runs[0].start_date_local)
      const now = new Date()
      daysSinceLastRun = Math.floor(
        (now.getTime() - lastRunDate.getTime()) / (1000 * 60 * 60 * 24),
      )
    }

    const sug = generateCoachSuggestion(
      currentWeekActivities.length,
      daysSinceLastRun,
      curKm,
      prevKm,
    )

    return {
      currentWeekKm: curKm,
      previousWeekKm: prevKm,
      streak: streakCount,
      recentThree: recent,
      suggestion: sug,
    }
  }, [activities])

  return {
    currentWeekKm,
    previousWeekKm,
    weeklyGoal,
    updateGoal,
    streak,
    recentThree,
    suggestion,
    isLoading: isLoadingStats || isLoadingActivities,
  } as {
    currentWeekKm: number
    previousWeekKm: number
    weeklyGoal: number
    updateGoal: (km: number) => void
    streak: number
    recentThree: StravaActivity[]
    suggestion: CoachSuggestion
    isLoading: boolean
  }
}
