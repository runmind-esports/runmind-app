'use client'

import { Settings, User, HelpCircle } from 'lucide-react'
import { SidebarHeader } from './SidebarHeader'
import { SidebarContent } from './SidebarContent'
import { ThemeToggle } from '@/components/ui/theme-toggle'
import { Conversation } from '../../types'
import { cn } from '@/lib/utils'

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
  conversations: Conversation[]
  activeConversationId: string | null
  isLoading?: boolean
  error?: string | null
  onNewConversation: () => void
  onSelectConversation: (id: string) => void
  onDeleteConversation: (id: string) => void
  onRenameConversation: (id: string, title: string) => void
}

export function Sidebar({
  isOpen,
  onClose,
  conversations,
  activeConversationId,
  isLoading,
  error,
  onNewConversation,
  onSelectConversation,
  onDeleteConversation,
  onRenameConversation,
}: SidebarProps) {
  return (
    <>
      {/* Overlay */}
      <div
        className={cn(
          'fixed inset-0 bg-black/50 z-40 transition-opacity duration-300',
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        )}
        onClick={onClose}
      />

      {/* Drawer */}
      <aside
        className={cn(
          'fixed left-0 top-0 h-full w-[280px] bg-sidebar z-50 flex flex-col',
          'transition-transform duration-300 ease-in-out',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <SidebarHeader
          onNewConversation={onNewConversation}
          onClose={onClose}
        />

        <SidebarContent
          conversations={conversations}
          activeConversationId={activeConversationId}
          isLoading={isLoading}
          error={error}
          onSelectConversation={(id) => {
            onSelectConversation(id)
            onClose()
          }}
          onDeleteConversation={onDeleteConversation}
          onRenameConversation={onRenameConversation}
        />

        {/* Configuracoes */}
        <div className="border-t border-border p-2">
          <ThemeToggle />
          <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-foreground-muted hover:bg-background-secondary hover:text-foreground transition-colors">
            <User className="h-4 w-4" />
            <span className="text-sm">Meu perfil</span>
          </button>
          <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-foreground-muted hover:bg-background-secondary hover:text-foreground transition-colors">
            <Settings className="h-4 w-4" />
            <span className="text-sm">Configuracoes</span>
          </button>
          <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-foreground-muted hover:bg-background-secondary hover:text-foreground transition-colors">
            <HelpCircle className="h-4 w-4" />
            <span className="text-sm">Ajuda</span>
          </button>
        </div>
      </aside>
    </>
  )
}
