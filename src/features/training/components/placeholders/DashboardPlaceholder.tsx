'use client'

import { LayoutDashboard } from 'lucide-react'

export function DashboardPlaceholder() {
  return (
    <div className="flex h-full flex-col items-center justify-center px-4">
      <LayoutDashboard className="h-12 w-12 text-accent" />
      <h2 className="mt-4 text-lg font-semibold text-foreground">Dashboard</h2>
      <p className="mt-2 text-center text-sm text-muted-foreground">
        Suas metricas de treino aparecerao aqui
      </p>
    </div>
  )
}
