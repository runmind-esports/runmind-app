'use client'

import { Menu, RotateCcw } from 'lucide-react'
import { Button } from '@/components/ui/button'

function RunmindLogo() {
  return (
    <svg width="22" height="22" viewBox="0 0 80 80" fill="none">
      <circle cx="40" cy="40" r="40" fill="#00F048"/>
      <path d="M22 58L22 22L44 22C54 22 62 29.5 62 38.5C62 47.5 54 55 44 55L22 55" stroke="white" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M42 55L62 65" stroke="white" strokeWidth="6" strokeLinecap="round"/>
    </svg>
  )
}

interface ChatHeaderProps {
  onClear: () => void
  onToggleSidebar: () => void
  hasMessages: boolean
}

export function ChatHeader({ onClear, onToggleSidebar, hasMessages }: ChatHeaderProps) {
  return (
    <header className="flex h-14 shrink-0 items-center justify-between border-b border-border px-4">
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggleSidebar}
          className="h-9 w-9 text-foreground-muted hover:text-foreground"
        >
          <Menu className="h-5 w-5" />
        </Button>
        <div className="flex items-center gap-2">
          <RunmindLogo />
          <span className="font-display font-bold text-[14px] text-foreground tracking-tight">runmind</span>
        </div>
      </div>

      {hasMessages && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onClear}
          className="text-foreground-muted hover:text-foreground"
        >
          <RotateCcw className="mr-2 h-4 w-4" />
          Nova conversa
        </Button>
      )}
    </header>
  )
}
