'use client'

import { useStrava } from '@/features/strava'
import { useDashboardData } from '../../hooks/useDashboardData'
import { WeeklyProgressRing } from './WeeklyProgressRing'
import { RecentActivityCard } from './RecentActivityCard'
import { WeekComparison } from './WeekComparison'
import { StreakBadge } from './StreakBadge'
import { CoachCTA } from './CoachCTA'
import { StravaConnectCTA } from './StravaConnectCTA'
import { Shimmer } from '@/components/ui/shimmer'

export function DashboardScreen() {
  const { isConnected, connect, isLoadingStatus } = useStrava()
  const {
    currentWeekKm,
    previousWeekKm,
    weeklyGoal,
    updateGoal,
    streak,
    recentThree,
    suggestion,
    isLoading,
  } = useDashboardData()

  if (isLoadingStatus) {
    return (
      <div className="p-4 space-y-4 max-w-lg mx-auto">
        <Shimmer className="h-52 w-full rounded-2xl" />
        <Shimmer className="h-8 w-48 rounded-lg" />
        <Shimmer className="h-16 w-full rounded-2xl" />
        <Shimmer className="h-16 w-full rounded-2xl" />
        <Shimmer className="h-16 w-full rounded-2xl" />
      </div>
    )
  }

  if (!isConnected) {
    return (
      <div className="p-4 max-w-lg mx-auto">
        <StravaConnectCTA onConnect={connect} />
      </div>
    )
  }

  return (
    <div className="p-4 space-y-4 max-w-lg mx-auto">
      <WeeklyProgressRing
        current={currentWeekKm}
        goal={weeklyGoal}
        onGoalEdit={updateGoal}
      />

      <WeekComparison
        currentKm={currentWeekKm}
        previousKm={previousWeekKm}
      />

      <StreakBadge weeks={streak} />

      {/* Recent activities section */}
      <div>
        <p className="text-xs font-medium uppercase tracking-wider text-foreground-muted mb-2">
          Atividades Recentes
        </p>
        {isLoading ? (
          <div className="space-y-2">
            <Shimmer className="h-14 w-full rounded-2xl" />
            <Shimmer className="h-14 w-full rounded-2xl" />
            <Shimmer className="h-14 w-full rounded-2xl" />
          </div>
        ) : recentThree.length > 0 ? (
          <>
            <div className="space-y-2">
              {recentThree.map((a) => (
                <RecentActivityCard key={a.id} activity={a} />
              ))}
            </div>
            <a
              href="/training/history"
              className="block text-xs text-accent font-medium cursor-pointer mt-2"
            >
              Ver todas
            </a>
          </>
        ) : (
          <p className="text-sm text-foreground-muted">
            Nenhuma atividade recente
          </p>
        )}
      </div>

      <CoachCTA suggestion={suggestion} />
    </div>
  )
}
