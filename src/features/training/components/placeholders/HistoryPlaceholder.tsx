'use client'

import { History } from 'lucide-react'

export function HistoryPlaceholder() {
  return (
    <div className="flex h-full flex-col items-center justify-center px-4">
      <History className="h-12 w-12 text-accent" />
      <h2 className="mt-4 text-lg font-semibold text-foreground">Historico</h2>
      <p className="mt-2 text-center text-sm text-muted-foreground">
        Historico de atividades aparecera aqui
      </p>
    </div>
  )
}
