'use client'

import { ReactNode } from 'react'
import { Loader2, Check } from 'lucide-react'

interface IntegrationCardProps {
  name: string
  description: string
  icon: ReactNode
  color: string
  isConnected: boolean
  isLoading: boolean
  onConnect: () => void
  onDisconnect: () => void
  disabled?: boolean
  disabledMessage?: string
}

export function IntegrationCard({
  name,
  description,
  icon,
  color,
  isConnected,
  isLoading,
  onConnect,
  onDisconnect,
  disabled,
  disabledMessage,
}: IntegrationCardProps) {
  return (
    <div
      className={`
        relative p-4 rounded-2xl transition-all duration-200
        ${isConnected
          ? 'bg-accent/5'
          : 'bg-background'
        }
      `}
    >
      <div className="flex items-center gap-3 mb-3">
        {/* Platform logo */}
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ backgroundColor: color }}
        >
          {icon}
        </div>

        {/* Name + status */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="font-display font-semibold text-sm text-foreground tracking-tight">
              {name}
            </h3>
            {isConnected && (
              <span className="flex items-center gap-1 px-2 py-0.5 bg-accent/15 text-accent text-[10px] font-bold rounded-full">
                <Check className="w-2.5 h-2.5" strokeWidth={3} />
                Conectado
              </span>
            )}
          </div>
          <p className="text-[11px] text-foreground-muted leading-[1.4]">
            {description}
          </p>
        </div>
      </div>

      {/* Action button — full width on mobile */}
      {disabled ? (
        <div className="w-full px-4 py-2.5 rounded-full bg-background-tertiary text-foreground-muted text-xs font-bold text-center">
          {disabledMessage || 'Em breve'}
        </div>
      ) : isLoading ? (
        <div className="w-full flex items-center gap-1.5 px-4 py-2.5 rounded-full bg-background-tertiary text-foreground-muted text-xs font-bold justify-center">
          <Loader2 className="w-3.5 h-3.5 animate-spin" />
          {isConnected ? 'Desconectando...' : 'Conectando...'}
        </div>
      ) : isConnected ? (
        <button
          onClick={onDisconnect}
          className="w-full px-4 py-2.5 rounded-full bg-background-tertiary text-foreground-muted text-xs font-bold transition-all hover:text-red-500 hover:bg-red-500/10"
        >
          Desconectar
        </button>
      ) : (
        <button
          onClick={onConnect}
          className="w-full px-4 py-2.5 rounded-full bg-foreground text-background text-xs font-bold transition-all hover:opacity-90"
        >
          Conectar
        </button>
      )}
    </div>
  )
}
