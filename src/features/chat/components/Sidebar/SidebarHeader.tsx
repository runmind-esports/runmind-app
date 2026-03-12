'use client'

import { Plus, X } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface SidebarHeaderProps {
  onNewConversation: () => void
  onClose: () => void
}

export function SidebarHeader({ onNewConversation, onClose }: SidebarHeaderProps) {
  return (
    <div className="flex items-center justify-between p-3 border-b border-border">
      <Button
        variant="ghost"
        size="sm"
        onClick={onNewConversation}
        className="h-8 gap-1.5 text-foreground-muted hover:text-foreground"
      >
        <Plus className="h-4 w-4" />
        <span className="text-sm">Nova conversa</span>
      </Button>

      <Button
        variant="ghost"
        size="icon"
        onClick={onClose}
        className="h-8 w-8 text-foreground-muted hover:text-foreground"
      >
        <X className="h-4 w-4" />
      </Button>
    </div>
  )
}
