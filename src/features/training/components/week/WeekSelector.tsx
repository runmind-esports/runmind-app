'use client'

import { ChevronLeft, ChevronRight } from 'lucide-react'

interface WeekSelectorProps {
  weekLabel: string
  isCurrentWeek: boolean
  onPrev: () => void
  onNext: () => void
}

export function WeekSelector({ weekLabel, isCurrentWeek, onPrev, onNext }: WeekSelectorProps) {
  return (
    <div className="py-3 px-4 flex items-center justify-between">
      <button
        type="button"
        onClick={onPrev}
        className="p-2 rounded-lg hover:bg-background-secondary text-foreground"
        aria-label="Semana anterior"
      >
        <ChevronLeft size={20} />
      </button>

      <span className="text-sm font-medium text-foreground font-body capitalize">
        {weekLabel}
      </span>

      <button
        type="button"
        onClick={onNext}
        disabled={isCurrentWeek}
        className={`p-2 rounded-lg hover:bg-background-secondary text-foreground ${
          isCurrentWeek ? 'opacity-30 pointer-events-none' : ''
        }`}
        aria-label="Proxima semana"
      >
        <ChevronRight size={20} />
      </button>
    </div>
  )
}
