'use client'

import { Menu, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface ChatHeaderProps {
  onClear: () => void
  onToggleSidebar: () => void
  hasMessages: boolean
}

export function ChatHeader({ onClear, onToggleSidebar, hasMessages }: ChatHeaderProps) {
  return (
    <header className="relative flex h-14 shrink-0 items-center justify-between border-b border-border px-4">
      <Button
        variant="ghost"
        size="icon"
        onClick={onToggleSidebar}
        className="h-9 w-9 text-foreground-muted hover:text-foreground lg:hidden"
      >
        <Menu className="h-5 w-5" />
      </Button>

      <span className="flex-1 text-center font-display font-bold text-[14px] text-foreground tracking-tight">Runmind</span>

      <Button
        variant="ghost"
        size="icon"
        onClick={onClear}
        className="h-9 w-9 text-foreground-muted hover:text-foreground"
      >
        <Plus className="h-5 w-5" />
      </Button>
    </header>
  )
}
