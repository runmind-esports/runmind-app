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
        relative flex items-center gap-4 p-5 rounded-2xl border
        transition-all duration-200
        ${isConnected
          ? 'border-accent/45 bg-accent-dim'
          : 'border-border bg-background'
        }
      `}
    >
      {/* Connected badge */}
      {isConnected && (
        <div className="absolute -top-2 -right-2 w-[22px] h-[22px] rounded-full bg-accent border-[2.5px] border-background flex items-center justify-center">
          <Check className="w-3 h-3 text-background" strokeWidth={3} />
        </div>
      )}

      {/* Platform logo */}
      <div
        className="w-[50px] h-[50px] rounded-[14px] flex items-center justify-center flex-shrink-0"
        style={{ backgroundColor: color }}
      >
        {icon}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <h3 className="font-display font-semibold text-sm text-foreground tracking-tight mb-1">
          {name}
        </h3>
        <p className="text-xs text-foreground-muted leading-[1.45]">
          {description}
        </p>
      </div>

      {/* Action button */}
      <div className="flex-shrink-0">
        {disabled ? (
          <div className="px-4 py-2.5 rounded-full bg-background-tertiary text-foreground-muted text-xs font-bold">
            {disabledMessage || 'Em breve'}
          </div>
        ) : isLoading ? (
          <div className="flex items-center gap-1.5 px-4 py-2.5 rounded-full bg-background-tertiary text-foreground-muted text-xs font-bold min-w-[106px] justify-center">
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
            {isConnected ? 'Desconectando' : 'Conectando'}
          </div>
        ) : isConnected ? (
          <button
            onClick={onDisconnect}
            className="px-4 py-2.5 rounded-full border border-border bg-background text-foreground-muted text-xs font-bold transition-all hover:border-red-400 hover:text-red-500 hover:bg-red-500/10"
          >
            Desconectar
          </button>
        ) : (
          <button
            onClick={onConnect}
            className="px-4 py-2.5 rounded-full bg-foreground text-background text-xs font-bold transition-all hover:opacity-90"
          >
            Conectar
          </button>
        )}
      </div>
    </div>
  )
}
