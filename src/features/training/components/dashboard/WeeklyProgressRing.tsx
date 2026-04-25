'use client'

import { useState } from 'react'
import { Pencil } from 'lucide-react'
import { cn } from '@/lib/utils'

interface WeeklyProgressRingProps {
  current: number    // km done this week
  goal: number       // km target
  size?: number      // ring diameter px, default 160
  onGoalEdit?: (newGoal: number) => void
}

export function WeeklyProgressRing({
  current,
  goal,
  size = 160,
  onGoalEdit,
}: WeeklyProgressRingProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editValue, setEditValue] = useState(String(goal))

  const strokeWidth = 12
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const progress = goal > 0 ? Math.min(current / goal, 1) : 0
  const offset = circumference * (1 - progress)

  function handleEditStart() {
    setEditValue(String(goal))
    setIsEditing(true)
  }

  function handleEditConfirm() {
    const parsed = Number(editValue)
    if (!isNaN(parsed) && parsed >= 1 && parsed <= 200) {
      onGoalEdit?.(parsed)
    }
    setIsEditing(false)
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter') handleEditConfirm()
    if (e.key === 'Escape') setIsEditing(false)
  }

  return (
    <div className="bg-background-secondary rounded-2xl border border-border flex flex-col items-center py-6">
      <span className="text-xs font-medium uppercase tracking-wider text-foreground-muted mb-3">
        Meta Semanal
      </span>

      <div className="relative" style={{ width: size, height: size }}>
        {/* Edit button */}
        {onGoalEdit && !isEditing && (
          <button
            onClick={handleEditStart}
            className="absolute top-0 right-0 z-10 p-1 rounded-full hover:bg-background-tertiary transition-colors"
            aria-label="Editar meta"
          >
            <Pencil size={14} className="text-foreground-muted" />
          </button>
        )}

        {/* SVG ring */}
        <svg width={size} height={size} className="-rotate-90">
          {/* Background track */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="var(--background-tertiary)"
            strokeWidth={strokeWidth}
          />
          {/* Progress arc */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="var(--accent)"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            className="transition-[stroke-dashoffset] duration-1000 ease-out"
          />
        </svg>

        {/* Center label */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-extrabold font-display text-foreground">
            {current.toFixed(1)}
          </span>
          {isEditing ? (
            <input
              type="number"
              min={1}
              max={200}
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              onBlur={handleEditConfirm}
              onKeyDown={handleKeyDown}
              className={cn(
                'w-16 text-center text-[10px] uppercase tracking-wider',
                'bg-transparent border-b border-accent text-foreground-muted',
                'outline-none',
              )}
              // eslint-disable-next-line jsx-a11y/no-autofocus
              autoFocus
            />
          ) : (
            <span className="text-[10px] uppercase tracking-wider text-foreground-muted">
              de {goal} km
            </span>
          )}
        </div>
      </div>
    </div>
  )
}
