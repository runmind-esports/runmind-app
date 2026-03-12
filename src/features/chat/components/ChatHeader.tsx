'use client'

import { Menu, RotateCcw } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface ChatHeaderProps {
  onClear: () => void
  onToggleSidebar: () => void
  hasMessages: boolean
}

export function ChatHeader({ onClear, onToggleSidebar, hasMessages }: ChatHeaderProps) {
  return (
    <header className="flex h-14 shrink-0 items-center justify-between border-b border-border px-4">
      <Button
        variant="ghost"
        size="icon"
        onClick={onToggleSidebar}
        className="h-9 w-9 text-foreground-muted hover:text-foreground"
      >
        <Menu className="h-5 w-5" />
      </Button>

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
