'use client'

import { Link2 } from 'lucide-react'

interface StravaConnectCTAProps {
  onConnect: () => void
}

export function StravaConnectCTA({ onConnect }: StravaConnectCTAProps) {
  return (
    <div className="bg-background-secondary rounded-2xl p-6 border border-border text-center">
      <Link2 size={40} className="text-accent mx-auto mb-4" />
      <h2 className="text-lg font-semibold text-foreground mb-2">Conecte seu Strava</h2>
      <p className="text-sm text-foreground-muted mb-4">
        Conecte sua conta do Strava para ver suas metricas de treino aqui.
      </p>
      <button
        onClick={onConnect}
        className="bg-accent text-white rounded-xl px-6 py-3 font-medium hover:bg-accent-hover transition-colors"
      >
        Conectar Strava
      </button>
    </div>
  )
}
