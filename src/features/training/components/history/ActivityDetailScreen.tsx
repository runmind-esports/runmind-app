'use client'

import { useRouter } from 'next/navigation'
import {
  ArrowLeft,
  MapPin,
  Timer,
  Zap,
  Mountain,
  Footprints,
  Heart,
  Bot,
  type LucideIcon,
} from 'lucide-react'
import { useActivityDetail, useActivityLaps, useActivityZones } from '@/features/strava'
import { formatDistance, formatPace, formatDuration, formatDateShort } from '../../utils/formatters'
import { SplitsTable } from './SplitsTable'
import { HRZonesChart } from './HRZonesChart'

interface ActivityDetailScreenProps {
  activityId: number
}

function MetricCard({
  icon: Icon,
  value,
  label,
}: {
  icon: LucideIcon
  value: string
  label: string
}) {
  return (
    <div className="rounded-xl border border-border bg-background-secondary p-3">
      <Icon size={16} className="text-accent" />
      <p className="mt-1 text-2xl font-bold text-foreground">{value}</p>
      <p className="text-xs text-foreground-muted">{label}</p>
    </div>
  )
}

function SkeletonDetail() {
  return (
    <div className="animate-pulse space-y-4 p-4">
      <div className="h-8 w-48 rounded bg-background-tertiary" />
      <div className="grid grid-cols-2 gap-3">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-24 rounded-xl bg-background-tertiary" />
        ))}
      </div>
      <div className="h-40 rounded-xl bg-background-tertiary" />
      <div className="h-40 rounded-xl bg-background-tertiary" />
    </div>
  )
}

export function ActivityDetailScreen({ activityId }: ActivityDetailScreenProps) {
  const router = useRouter()
  const { activity, isLoading: isLoadingDetail } = useActivityDetail(activityId)
  const { laps, isLoading: isLoadingLaps } = useActivityLaps(activityId)
  const { zones, isLoading: isLoadingZones } = useActivityZones(activityId)

  const isLoading = isLoadingDetail || isLoadingLaps || isLoadingZones

  if (isLoading || !activity) {
    return <SkeletonDetail />
  }

  return (
    <div className="mx-auto max-w-lg pb-8">
      {/* Header */}
      <div className="sticky top-0 z-10 flex items-center gap-3 border-b border-border bg-background px-4 py-3">
        <button
          onClick={() => router.push('/training/history')}
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

      {/* Primary metrics */}
      <div className="grid grid-cols-2 gap-3 p-4">
        <MetricCard
          icon={MapPin}
          value={formatDistance(activity.distance)}
          label="Distancia"
        />
        <MetricCard
          icon={Timer}
          value={formatDuration(activity.moving_time)}
          label="Duracao"
        />
        <MetricCard
          icon={Footprints}
          value={formatPace(activity.average_speed)}
          label="Pace"
        />
        <MetricCard
          icon={Zap}
          value={`${activity.calories} kcal`}
          label="Calorias"
        />
      </div>

      {/* Secondary metrics */}
      <div className="flex gap-4 px-4 pb-4">
        <div className="flex items-center gap-1 text-sm text-foreground-muted">
          <Mountain size={14} />
          <span>{Math.round(activity.total_elevation_gain)}m</span>
        </div>
        {activity.has_heartrate && activity.average_heartrate && (
          <div className="flex items-center gap-1 text-sm text-foreground-muted">
            <Heart size={14} className="text-red-500" />
            <span>{Math.round(activity.average_heartrate)} bpm</span>
          </div>
        )}
        {activity.average_cadence && (
          <div className="flex items-center gap-1 text-sm text-foreground-muted">
            <Footprints size={14} />
            <span>{Math.round(activity.average_cadence)} spm</span>
          </div>
        )}
      </div>

      {/* Splits */}
      {activity.splits_metric && activity.splits_metric.length > 0 && (
        <div className="px-4 pb-4">
          <SplitsTable splits={activity.splits_metric} />
        </div>
      )}

      {/* HR Zones */}
      {zones.length > 0 && (
        <div className="px-4 pb-4">
          <HRZonesChart zones={zones} />
        </div>
      )}

      {/* Analisar com IA button */}
      <div className="px-4 pb-8">
        <button
          onClick={() =>
            router.push(
              `/chat?context=activity&activityId=${activityId}&activityName=${encodeURIComponent(activity.name)}`,
            )
          }
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-accent py-3 font-medium text-white transition-colors hover:bg-accent-hover"
        >
          <Bot size={20} />
          Analisar com IA
        </button>
      </div>
    </div>
  )
}
