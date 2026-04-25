'use client'

import { MapPin, Footprints, Timer } from 'lucide-react'
import { useStrava, useStravaStats, useStravaActivities } from '@/features/strava'
import { MetricCard } from '@/features/training/components/dashboard/MetricCard'
import { LastActivityCard } from '@/features/training/components/dashboard/LastActivityCard'
import { formatDistance, formatPace } from '@/features/training/utils/formatters'

interface WelcomeScreenProps {
  onSelectPrompt: (prompt: string) => void
}

const suggestions = [
  'Que treino devo fazer hoje?',
  'Mostra meus treinos da semana',
  'Como melhorar meu pace?',
  'Monte uma planilha para 10km',
]

export function WelcomeScreen({ onSelectPrompt }: WelcomeScreenProps) {
  const { isConnected, isLoadingStatus } = useStrava()
  const { stats, isLoading: isLoadingStats } = useStravaStats()
  const { activities, isLoading: isLoadingActivities } = useStravaActivities(1, 5)

  const isLoading = isLoadingStats || isLoadingStatus
  const recentTotals = stats?.recent_run_totals
  const avgPaceSpeed = recentTotals && recentTotals.moving_time > 0
    ? recentTotals.distance / recentTotals.moving_time
    : 0

  return (
    <div className="flex flex-1 flex-col px-4 py-6 overflow-y-auto">
      <div className="mx-auto w-full max-w-lg space-y-5">
        {/* Metric cards — same as training dashboard */}
        {isConnected && (
          <>
            <div className="grid grid-cols-2 gap-3">
              <MetricCard
                label="Km no Mês"
                value={recentTotals ? formatDistance(recentTotals.distance) : '--'}
                icon={<MapPin size={24} />}
                isLoading={isLoading}
                accent="green"
              />
              <MetricCard
                label="Corridas"
                value={recentTotals ? String(recentTotals.count) : '--'}
                icon={<Footprints size={24} />}
                isLoading={isLoading}
                accent="orange"
              />
              <MetricCard
                label="Pace Médio"
                value={avgPaceSpeed > 0 ? formatPace(avgPaceSpeed) : '--'}
                icon={<Timer size={24} />}
                isLoading={isLoading}
                accent="blue"
                className="col-span-2"
              />
            </div>

            <LastActivityCard
              activity={activities?.[0]}
              isLoading={isLoadingActivities}
            />
          </>
        )}

        {/* Suggestion prompts — text style */}
        <div className="space-y-2">
          <p className="text-xs font-medium text-foreground-muted uppercase tracking-wider">Sugestões</p>
          <div className="flex flex-wrap gap-2">
            {suggestions.map((text) => (
              <button
                key={text}
                onClick={() => onSelectPrompt(text)}
                className="rounded-full border border-border px-3.5 py-2 text-xs text-foreground-muted hover:text-foreground hover:border-foreground-muted transition-colors"
              >
                {text}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
