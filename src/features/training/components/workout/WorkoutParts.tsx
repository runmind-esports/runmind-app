'use client'

import { useState } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'
import type { WorkoutPart } from '../../types/workout.types'

interface WorkoutPartsProps {
  parts: WorkoutPart[]
}

const stepTypeColors: Record<string, string> = {
  warmup: 'bg-green-500',
  main: 'bg-accent',
  cooldown: 'bg-blue-500',
  interval: 'bg-orange-500',
  recovery: 'bg-foreground-muted',
}

function formatStepMeta(step: { duration?: number; distance?: number }): string | null {
  if (step.distance) {
    const km = step.distance / 1000
    return km >= 1 ? `${km.toFixed(1)} km` : `${Math.round(step.distance)} m`
  }
  if (step.duration) {
    const mins = Math.floor(step.duration / 60)
    const secs = step.duration % 60
    return secs > 0 ? `${mins}:${secs.toString().padStart(2, '0')}` : `${mins}min`
  }
  return null
}

export function WorkoutParts({ parts }: WorkoutPartsProps) {
  const [expandedPartId, setExpandedPartId] = useState<string | null>(null)

  function handleToggle(partId: string) {
    setExpandedPartId((prev) => (prev === partId ? null : partId))
  }

  return (
    <div className="space-y-2">
      {parts.map((part) => {
        const isExpanded = expandedPartId === part.id
        return (
          <div
            key={part.id}
            className="rounded-xl border border-border bg-background-secondary"
          >
            <button
              type="button"
              onClick={() => handleToggle(part.id)}
              className="flex w-full items-center justify-between p-3"
            >
              <span className="text-sm font-semibold text-foreground">
                {part.name}
              </span>
              {isExpanded ? (
                <ChevronUp size={16} className="text-foreground-muted" />
              ) : (
                <ChevronDown size={16} className="text-foreground-muted" />
              )}
            </button>

            <div
              className={`overflow-hidden transition-all duration-200 ${
                isExpanded ? 'max-h-96' : 'max-h-0'
              }`}
            >
              <div className="space-y-2 px-3 pb-3">
                {part.steps.map((step) => {
                  const meta = formatStepMeta(step)
                  return (
                    <div key={step.id} className="flex items-center gap-2">
                      <span
                        className={`h-2 w-2 flex-shrink-0 rounded-full ${
                          stepTypeColors[step.type] || 'bg-foreground-muted'
                        }`}
                      />
                      <span className="flex-1 font-body text-sm text-foreground">
                        {step.description}
                      </span>
                      {meta && (
                        <span className="rounded-full bg-background-tertiary px-2 py-0.5 text-xs text-foreground-muted">
                          {meta}
                        </span>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
