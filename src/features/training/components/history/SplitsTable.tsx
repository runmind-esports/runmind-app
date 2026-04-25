'use client'

import type { StravaSplit } from '@/features/strava'
import { formatPace } from '../../utils/formatters'

interface SplitsTableProps {
  splits: StravaSplit[]
}

export function SplitsTable({ splits }: SplitsTableProps) {
  if (splits.length === 0) return null

  return (
    <div className="rounded-xl border border-border bg-background-secondary p-4">
      <h3 className="mb-3 text-sm font-semibold text-foreground">
        Splits por Km
      </h3>

      <div className="overflow-x-auto">
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-x-2 gap-y-1">
          <span className="text-xs font-medium text-foreground-muted">Km</span>
          <span className="text-xs font-medium text-foreground-muted">Pace</span>
          <span className="text-xs font-medium text-foreground-muted">FC</span>
          <span className="hidden sm:block text-xs font-medium text-foreground-muted">Elev.</span>

          {splits.map((split, idx) => (
            <div key={split.split} className="col-span-3 sm:col-span-4 grid grid-cols-3 sm:grid-cols-4 gap-x-2">
              <span
                className={`text-sm text-foreground ${
                  idx % 2 === 0 ? 'bg-background-secondary/50' : ''
                } rounded px-1`}
              >
                {split.split}
              </span>
              <span
                className={`text-sm text-foreground ${
                  idx % 2 === 0 ? 'bg-background-secondary/50' : ''
                } rounded px-1`}
              >
                {formatPace(split.average_speed)}
              </span>
              <span
                className={`text-sm text-foreground ${
                  idx % 2 === 0 ? 'bg-background-secondary/50' : ''
                } rounded px-1`}
              >
                {split.average_heartrate
                  ? Math.round(split.average_heartrate)
                  : '--'}
              </span>
              <span
                className={`hidden sm:block text-sm text-foreground ${
                  idx % 2 === 0 ? 'bg-background-secondary/50' : ''
                } rounded px-1`}
              >
                {split.elevation_difference >= 0
                  ? `+${Math.round(split.elevation_difference)}m`
                  : `${Math.round(split.elevation_difference)}m`}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
