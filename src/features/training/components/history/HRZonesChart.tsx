'use client'

import type { StravaZone } from '@/features/strava'
import { formatDuration } from '../../utils/formatters'

interface HRZonesChartProps {
  zones: StravaZone[]
}

const ZONE_LABELS = [
  'Zona 1 - Repouso',
  'Zona 2 - Facil',
  'Zona 3 - Moderado',
  'Zona 4 - Intenso',
  'Zona 5 - Maximo',
]

const ZONE_COLORS = [
  'bg-blue-400',
  'bg-green-400',
  'bg-yellow-400',
  'bg-orange-400',
  'bg-red-400',
]

export function HRZonesChart({ zones }: HRZonesChartProps) {
  const hrZone = zones.find((z) => z.type === 'heartrate')

  if (!hrZone) {
    return (
      <div className="rounded-xl border border-border bg-background-secondary p-4">
        <h3 className="mb-3 text-sm font-semibold text-foreground">
          Zonas de FC
        </h3>
        <p className="py-4 text-center text-sm italic text-foreground-muted">
          Sem dados de frequencia cardiaca
        </p>
      </div>
    )
  }

  const buckets = hrZone.distribution_buckets
  const totalTime = buckets.reduce((sum, b) => sum + b.time, 0)

  return (
    <div className="rounded-xl border border-border bg-background-secondary p-4">
      <h3 className="mb-3 text-sm font-semibold text-foreground">
        Zonas de FC
      </h3>

      <div className="space-y-2">
        {buckets.map((bucket, idx) => {
          const pct = totalTime > 0 ? (bucket.time / totalTime) * 100 : 0
          const label = ZONE_LABELS[idx] ?? `Zona ${idx + 1}`
          const color = ZONE_COLORS[idx] ?? 'bg-gray-400'

          return (
            <div key={idx} className="flex items-center gap-2">
              <span className="w-28 shrink-0 text-xs text-foreground-muted">
                {label}
              </span>
              <div className="mx-2 h-5 flex-1 overflow-hidden rounded-full bg-background-tertiary">
                <div
                  className={`h-full rounded-full ${color}`}
                  style={{ width: `${Math.max(pct, 1)}%` }}
                />
              </div>
              <span className="w-14 shrink-0 text-right text-xs text-foreground-muted">
                {formatDuration(bucket.time)}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
