'use client'

import { Loader2 } from 'lucide-react'
import { Conversation } from '../../types'
import { ConversationItem } from './ConversationItem'

interface SidebarContentProps {
  conversations: Conversation[]
  activeConversationId: string | null
  isLoading?: boolean
  error?: string | null
  onSelectConversation: (id: string) => void
  onDeleteConversation: (id: string) => void
  onRenameConversation: (id: string, title: string) => void
}

export function SidebarContent({
  conversations,
  activeConversationId,
  isLoading,
  error,
  onSelectConversation,
  onDeleteConversation,
  onRenameConversation,
}: SidebarContentProps) {
  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-foreground-muted" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-4 text-center">
        <p className="text-destructive text-sm">{error}</p>
      </div>
    )
  }

  return (
    <div className="flex-1 overflow-y-auto p-2">
      {conversations.length > 0 ? (
        <div>
          <div className="px-3 py-1.5 text-xs text-foreground-muted uppercase tracking-wider">
            Conversas
          </div>

          {conversations.map((conversation) => (
            <ConversationItem
              key={conversation.id}
              conversation={conversation}
              isActive={activeConversationId === conversation.id}
              onSelect={() => onSelectConversation(conversation.id)}
              onDelete={() => onDeleteConversation(conversation.id)}
              onRename={(title) => onRenameConversation(conversation.id, title)}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-40 text-foreground-muted text-sm">
          <p>Nenhuma conversa ainda</p>
          <p className="text-xs mt-1">Comece uma nova conversa</p>
        </div>
      )}
    </div>
  )
}
