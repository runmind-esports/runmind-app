'use client'

import { useRouter } from 'next/navigation'
import { MapPin, Footprints, Timer, MessageCircle } from 'lucide-react'
import { useStrava, useStravaActivities, useStravaStats } from '@/features/strava'
import { MetricCard } from './MetricCard'
import { LastActivityCard } from './LastActivityCard'
import { StravaConnectCTA } from './StravaConnectCTA'
import { formatDistance, formatPace } from '../../utils/formatters'

export function DashboardScreen() {
  const router = useRouter()
  const { isConnected, connect, isLoadingStatus } = useStrava()
  const { stats, isLoading: isLoadingStats } = useStravaStats()
  const { activities, isLoading: isLoadingActivities } = useStravaActivities(1, 5)

  const isLoadingMetrics = isLoadingStats || isLoadingStatus

  if (isLoadingStatus) {
    return (
      <div className="p-4 space-y-4 max-w-lg mx-auto">
        <div className="grid grid-cols-2 gap-3">
          <MetricCard label="" value="" icon={null} isLoading />
          <MetricCard label="" value="" icon={null} isLoading />
          <MetricCard label="" value="" icon={null} isLoading className="col-span-2" />
        </div>
        <LastActivityCard activity={undefined} isLoading />
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

  const recentTotals = stats?.recent_run_totals
  const avgPaceSpeed = recentTotals && recentTotals.moving_time > 0
    ? recentTotals.distance / recentTotals.moving_time
    : 0

  return (
    <div className="p-4 space-y-4 max-w-lg mx-auto">
      <div className="grid grid-cols-2 gap-3">
        <MetricCard
          label="Km no Mes"
          value={recentTotals ? formatDistance(recentTotals.distance) : '--'}
          icon={<MapPin size={24} />}
          isLoading={isLoadingMetrics}
        />
        <MetricCard
          label="Corridas"
          value={recentTotals ? String(recentTotals.count) : '--'}
          icon={<Footprints size={24} />}
          isLoading={isLoadingMetrics}
        />
        <MetricCard
          label="Pace Medio"
          value={avgPaceSpeed > 0 ? formatPace(avgPaceSpeed) : '--'}
          icon={<Timer size={24} />}
          isLoading={isLoadingMetrics}
          className="col-span-2"
        />
      </div>

      <LastActivityCard
        activity={activities?.[0]}
        isLoading={isLoadingActivities}
      />

      <button
        onClick={() => router.push('/chat')}
        className="bg-accent hover:bg-accent-hover text-white rounded-xl py-3 font-medium w-full flex items-center justify-center gap-2 transition-colors"
      >
        <MessageCircle size={20} />
        Falar com coach
      </button>
    </div>
  )
}
