'use client'

import { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Bot, CheckCircle } from 'lucide-react'
import { useActivityDetail, useStrava } from '@/features/strava'
import type { StravaSplit } from '@/features/strava'
import { formatDateShort, formatPace } from '../../utils/formatters'
import { WorkoutParts } from './WorkoutParts'
import { WorkoutSummary } from './WorkoutSummary'
import { SplitsTable } from '../history/SplitsTable'
import type { WorkoutPart, WorkoutStep } from '../../types/workout.types'

interface WorkoutScreenProps {
  activityId: number
}

type Feeling = 'easy' | 'moderate' | 'hard' | 'very_hard'

const FEELINGS: Array<{ key: Feeling; label: string }> = [
  { key: 'easy', label: 'Facil' },
  { key: 'moderate', label: 'Moderado' },
  { key: 'hard', label: 'Intenso' },
  { key: 'very_hard', label: 'Muito intenso' },
]

function splitToStep(split: StravaSplit, type: WorkoutStep['type']): WorkoutStep {
  return {
    id: `split-${split.split}`,
    description: `Km ${split.split} — ${formatPace(split.average_speed)}`,
    type,
    distance: split.distance,
    duration: split.moving_time,
  }
}

function derivePartsFromSplits(splits: StravaSplit[]): WorkoutPart[] {
  if (splits.length <= 2) {
    return [
      {
        id: 'part-1',
        name: 'Parte 1 — Treino',
        steps: splits.map((s) => splitToStep(s, 'main')),
      },
    ]
  }

  const first = splits[0]
  const middle = splits.slice(1, -1)
  const last = splits[splits.length - 1]

  return [
    {
      id: 'part-1',
      name: 'Parte 1 — Aquecimento',
      steps: [splitToStep(first, 'warmup')],
    },
    {
      id: 'part-2',
      name: 'Parte 2 — Principal',
      steps: middle.map((s) => splitToStep(s, 'main')),
    },
    {
      id: 'part-3',
      name: 'Parte 3 — Desaquecimento',
      steps: [splitToStep(last, 'cooldown')],
    },
  ]
}

function SkeletonWorkout() {
  return (
    <div className="animate-pulse space-y-4 p-4">
      <div className="h-8 w-48 rounded bg-background-tertiary" />
      <div className="space-y-2">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-12 rounded-xl bg-background-tertiary" />
        ))}
      </div>
      <div className="h-12 rounded-xl bg-background-tertiary" />
    </div>
  )
}

export function WorkoutScreen({ activityId }: WorkoutScreenProps) {
  const router = useRouter()
  const { activity, isLoading } = useActivityDetail(activityId)
  const { isConnected } = useStrava()
  const [isCompleted, setIsCompleted] = useState(false)
  const [feeling, setFeeling] = useState<Feeling | null>(null)

  const derivedParts = useMemo<WorkoutPart[]>(() => {
    if (!activity) return []

    if (activity.splits_metric && activity.splits_metric.length > 0) {
      return derivePartsFromSplits(activity.splits_metric)
    }

    return [
      {
        id: 'part-single',
        name: 'Parte 1 — Treino',
        steps: [
          {
            id: 'step-activity',
            description: activity.name,
            type: 'main',
            distance: activity.distance,
            duration: activity.moving_time,
          },
        ],
      },
    ]
  }, [activity])

  if (isLoading || !activity) {
    return <SkeletonWorkout />
  }

  function handleUpdateAI() {
    const params = new URLSearchParams({
      context: 'workout',
      activityId: String(activityId),
      feeling: feeling || '',
      distance: String(activity?.distance || ''),
    })
    router.push(`/chat?${params.toString()}`)
  }

  return (
    <div className="mx-auto max-w-lg pb-8">
      {/* Header */}
      <div className="sticky top-0 z-10 flex items-center gap-3 border-b border-border bg-background px-4 py-3">
        <button
          onClick={() => router.back()}
          className="text-foreground-muted transition-colors hover:text-foreground"
        >
          <ArrowLeft size={20} />
        </button>
        <div className="min-w-0 flex-1">
          <h1 className="truncate text-lg font-semibold text-foreground">
            {activity.name}
          </h1>
          <p className="text-xs text-foreground-muted">
            {formatDateShort(activity.start_date_local)}
          </p>
        </div>
      </div>

      {/* Workout parts */}
      <div className="px-4 pt-4">
        <WorkoutParts parts={derivedParts} />
      </div>

      {/* Completion section */}
      <div className="px-4 py-4">
        {!isCompleted ? (
          <button
            onClick={() => setIsCompleted(true)}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-green-600 py-3 font-medium text-white transition-colors hover:bg-green-700"
          >
            <CheckCircle size={20} />
            Marcar como concluido
          </button>
        ) : (
          <div className="space-y-4">
            {/* Feeling selector */}
            <div>
              <p className="mb-2 text-sm font-semibold text-foreground">
                Como foi o treino?
              </p>
              <div className="flex flex-wrap gap-2">
                {FEELINGS.map((f) => (
                  <button
                    key={f.key}
                    onClick={() => setFeeling(f.key)}
                    className={`rounded-full px-3 py-1.5 text-sm font-medium transition-colors ${
                      feeling === f.key
                        ? 'bg-accent text-white'
                        : 'bg-background-tertiary text-foreground-muted hover:text-foreground'
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Summary */}
            {isConnected && (
              <WorkoutSummary
                distance={activity.distance}
                duration={activity.moving_time}
                avgSpeed={activity.average_speed}
                avgHR={activity.average_heartrate}
                calories={activity.calories}
              />
            )}

            {/* Splits */}
            {activity.splits_metric && activity.splits_metric.length > 0 && (
              <SplitsTable splits={activity.splits_metric} />
            )}
          </div>
        )}
      </div>

      {/* Atualizar a IA button */}
      {isCompleted && (
        <div className="px-4 pb-8">
          <button
            onClick={handleUpdateAI}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-accent py-3 font-medium text-white transition-colors hover:bg-accent-hover"
          >
            <Bot size={20} />
            Atualizar a IA
          </button>
        </div>
      )}
    </div>
  )
}
