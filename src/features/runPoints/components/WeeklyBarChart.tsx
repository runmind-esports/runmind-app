'use client'

import { RunPointsHistoryDay } from '../types/runPoints.types'

interface WeeklyBarChartProps {
  history: RunPointsHistoryDay[]
}

export function WeeklyBarChart({ history }: WeeklyBarChartProps) {
  const maxUsed = Math.max(...history.map((d) => d.used), 1)

  return (
    <div className="flex items-end gap-2 h-[120px]">
      {history.map((day) => {
        const heightPercent = (day.used / maxUsed) * 100
        return (
          <div key={day.day} className="flex flex-col items-center flex-1">
            <div
              className="w-8 min-h-[4px] bg-accent rounded-t-sm"
              style={{
                height: `${heightPercent}%`,
                transition: 'height 0.6s ease-out',
              }}
            />
            <span className="text-[11px] text-foreground-muted mt-1">
              {day.day}
            </span>
          </div>
        )
      })}
    </div>
  )
}
