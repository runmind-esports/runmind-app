'use client'

import { Flame } from 'lucide-react'
import { Card } from '@/components/ui/card'

interface StreakBadgeProps {
  weeks: number
}

export function StreakBadge({ weeks }: StreakBadgeProps) {
  if (weeks === 0) return null

  return (
    <Card className="flex items-center gap-3 py-3 px-4">
      <Flame size={20} className="text-orange-500 shrink-0" />
      <div>
        <p className="text-sm font-semibold text-foreground">
          {weeks} semana{weeks !== 1 ? 's' : ''} consecutiva{weeks !== 1 ? 's' : ''}
        </p>
        <p className="text-[11px] text-foreground-muted">Mantenha o ritmo!</p>
      </div>
    </Card>
  )
}
