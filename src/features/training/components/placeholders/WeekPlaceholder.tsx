'use client'

import { Calendar } from 'lucide-react'

export function WeekPlaceholder() {
  return (
    <div className="flex h-full flex-col items-center justify-center px-4">
      <Calendar className="h-12 w-12 text-accent" />
      <h2 className="mt-4 text-lg font-semibold text-foreground">Semana</h2>
      <p className="mt-2 text-center text-sm text-muted-foreground">
        Calendario semanal de treinos aparecera aqui
      </p>
    </div>
  )
}
