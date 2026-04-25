'use client'

import { useEffect, useRef, useCallback } from 'react'
import { Loader2 } from 'lucide-react'
import { Conversation, Project } from '../../types'
import { ConversationItem } from './ConversationItem'
import { ProjectSection } from './ProjectSection'

interface SidebarContentProps {
  conversations: Conversation[]
  activeConversationId: string | null
  isLoading?: boolean
  isLoadingMore?: boolean
  hasMore?: boolean
  error?: string | null
  onSelectConversation: (id: string) => void
  onDeleteConversation: (id: string) => void
  onRenameConversation: (id: string, title: string) => void
  onLoadMore?: () => void
  projects: Project[]
  onToggleProject: (id: string) => void
  onDeleteProject: (id: string) => void
  onRenameProject: (id: string, name: string) => void
  onChangeProjectIcon: (id: string, icon: string) => void
  onCreateProject: (name: string, icon: string) => void
  onMoveConversation: (conversationId: string, projectId: string | null) => void
}

export function SidebarContent({
  conversations,
  activeConversationId,
  isLoading,
  isLoadingMore,
  hasMore,
  error,
  onSelectConversation,
  onDeleteConversation,
  onRenameConversation,
  onLoadMore,
  projects,
  onToggleProject,
  onDeleteProject,
  onRenameProject,
  onChangeProjectIcon,
  onCreateProject,
  onMoveConversation,
}: SidebarContentProps) {
  const sentinelRef = useRef<HTMLDivElement>(null)

  const handleIntersect = useCallback((entries: IntersectionObserverEntry[]) => {
    if (entries[0].isIntersecting && hasMore && !isLoadingMore && onLoadMore) {
      onLoadMore()
    }
  }, [hasMore, isLoadingMore, onLoadMore])

  useEffect(() => {
    const el = sentinelRef.current
    if (!el) return
    const observer = new IntersectionObserver(handleIntersect, { threshold: 0.1 })
    observer.observe(el)
    return () => observer.disconnect()
  }, [handleIntersect])

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

  const unassignedConversations = conversations.filter(
    (c) => !c.projectId
  )

  return (
    <div className="p-2">
      {/* Projects section */}
      <ProjectSection
        projects={projects}
        conversations={conversations}
        activeConversationId={activeConversationId}
        onToggleProject={onToggleProject}
        onDeleteProject={onDeleteProject}
        onRenameProject={onRenameProject}
        onChangeProjectIcon={onChangeProjectIcon}
        onCreateProject={onCreateProject}
        onSelectConversation={onSelectConversation}
        onDeleteConversation={onDeleteConversation}
        onRenameConversation={onRenameConversation}
        onMoveConversation={onMoveConversation}
      />

      {/* Unassigned conversations */}
      {unassignedConversations.length > 0 ? (
        <div>
          <div className="px-3 py-1.5 text-sm font-medium text-foreground-muted">
            Recentes
          </div>

          {unassignedConversations.map((conversation) => (
            <ConversationItem
              key={conversation.id}
              conversation={conversation}
              isActive={activeConversationId === conversation.id}
              onSelect={() => onSelectConversation(conversation.id)}
              onDelete={() => onDeleteConversation(conversation.id)}
              onRename={(title) => onRenameConversation(conversation.id, title)}
              projects={projects}
              onMoveToProject={(projectId) =>
                onMoveConversation(conversation.id, projectId)
              }
            />
          ))}

          {/* Infinite scroll sentinel / load more */}
          {hasMore && (
            <div ref={sentinelRef} className="py-2">
              {isLoadingMore ? (
                <div className="flex justify-center py-2">
                  <Loader2 className="h-4 w-4 animate-spin text-foreground-muted" />
                </div>
              ) : (
                <button
                  onClick={onLoadMore}
                  className="w-full py-2 text-xs text-foreground-muted hover:text-foreground transition-colors"
                >
                  Carregar mais
                </button>
              )}
            </div>
          )}
        </div>
      ) : (
        conversations.length === 0 && projects.length === 0 && (
          <div className="flex flex-col items-center justify-center h-40 text-foreground-muted text-sm">
            <p>Nenhuma conversa ainda</p>
            <p className="text-xs mt-1">Comece uma nova conversa</p>
          </div>
        )
      )}
    </div>
  )
}
