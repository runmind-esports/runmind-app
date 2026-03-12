'use client'

import { Briefcase, ChevronRight, MoreHorizontal, Trash2, Edit2, FolderPlus, Plus } from 'lucide-react'
import { Project, Folder, Conversation } from '../../types'
import { FolderItem } from './FolderItem'
import { ConversationItem } from './ConversationItem'
import { cn } from '@/lib/utils'
import { useState, useRef, useEffect } from 'react'

interface ProjectItemProps {
  project: Project
  folders: Folder[]
  conversations: Conversation[]
  activeConversationId: string | null
  onToggle: () => void
  onDelete: () => void
  onRename: (name: string) => void
  onAddFolder: () => void
  onAddConversation: () => void
  onSelectConversation: (id: string) => void
  onDeleteConversation: (id: string) => void
  onRenameConversation: (id: string, title: string) => void
  onToggleFolder: (id: string) => void
  onDeleteFolder: (id: string) => void
  onRenameFolder: (id: string, name: string) => void
  getConversationsInFolder: (folderId: string, projectId: string) => Conversation[]
}

export function ProjectItem({
  project,
  folders,
  conversations,
  activeConversationId,
  onToggle,
  onDelete,
  onRename,
  onAddFolder,
  onAddConversation,
  onSelectConversation,
  onDeleteConversation,
  onRenameConversation,
  onToggleFolder,
  onDeleteFolder,
  onRenameFolder,
  getConversationsInFolder,
}: ProjectItemProps) {
  const [showMenu, setShowMenu] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [editValue, setEditValue] = useState(project.name)
  const inputRef = useRef<HTMLInputElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus()
      inputRef.current.select()
    }
  }, [isEditing])

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setShowMenu(false)
      }
    }

    if (showMenu) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showMenu])

  const handleRename = () => {
    if (editValue.trim() && editValue !== project.name) {
      onRename(editValue.trim())
    }
    setIsEditing(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleRename()
    } else if (e.key === 'Escape') {
      setEditValue(project.name)
      setIsEditing(false)
    }
  }

  const totalItems = folders.length + conversations.length

  return (
    <div className="mb-1">
      <div
        className="group flex items-center gap-2 rounded-lg px-3 py-2 cursor-pointer hover:bg-background-secondary/50 transition-colors"
        onClick={onToggle}
      >
        <ChevronRight
          className={cn(
            'h-4 w-4 shrink-0 text-foreground-muted transition-transform',
            project.isExpanded && 'rotate-90'
          )}
        />
        <Briefcase className="h-4 w-4 shrink-0 text-accent" />

        {isEditing ? (
          <input
            ref={inputRef}
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onBlur={handleRename}
            onKeyDown={handleKeyDown}
            onClick={(e) => e.stopPropagation()}
            className="flex-1 bg-transparent text-sm font-medium text-foreground outline-none"
          />
        ) : (
          <span className="flex-1 truncate text-sm font-medium text-foreground">{project.name}</span>
        )}

        <span className="text-xs text-foreground-muted">{totalItems}</span>

        <div className="relative" ref={menuRef}>
          <button
            onClick={(e) => {
              e.stopPropagation()
              setShowMenu(!showMenu)
            }}
            className={cn(
              'p-1 rounded hover:bg-background-tertiary text-foreground-muted hover:text-foreground transition-opacity',
              showMenu ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
            )}
          >
            <MoreHorizontal className="h-4 w-4" />
          </button>

          {showMenu && (
            <div className="absolute right-0 top-full mt-1 z-50 w-44 rounded-lg bg-background-tertiary border border-border shadow-lg py-1">
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  setShowMenu(false)
                  onAddConversation()
                }}
                className="flex w-full items-center gap-2 px-3 py-2 text-sm text-foreground hover:bg-background-secondary"
              >
                <Plus className="h-4 w-4" />
                Nova conversa
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  setShowMenu(false)
                  onAddFolder()
                }}
                className="flex w-full items-center gap-2 px-3 py-2 text-sm text-foreground hover:bg-background-secondary"
              >
                <FolderPlus className="h-4 w-4" />
                Nova pasta
              </button>
              <div className="my-1 border-t border-border" />
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  setShowMenu(false)
                  setIsEditing(true)
                }}
                className="flex w-full items-center gap-2 px-3 py-2 text-sm text-foreground hover:bg-background-secondary"
              >
                <Edit2 className="h-4 w-4" />
                Renomear
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  setShowMenu(false)
                  onDelete()
                }}
                className="flex w-full items-center gap-2 px-3 py-2 text-sm text-red-400 hover:bg-background-secondary"
              >
                <Trash2 className="h-4 w-4" />
                Excluir projeto
              </button>
            </div>
          )}
        </div>
      </div>

      {project.isExpanded && (
        <div className="ml-4 border-l border-border pl-2">
          {/* Pastas do projeto */}
          {folders.map((folder) => (
            <FolderItem
              key={folder.id}
              folder={folder}
              conversations={getConversationsInFolder(folder.id, project.id)}
              activeConversationId={activeConversationId}
              onToggle={() => onToggleFolder(folder.id)}
              onDelete={() => onDeleteFolder(folder.id)}
              onRename={(name) => onRenameFolder(folder.id, name)}
              onSelectConversation={onSelectConversation}
              onDeleteConversation={onDeleteConversation}
              onRenameConversation={onRenameConversation}
            />
          ))}

          {/* Conversas soltas no projeto */}
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

          {folders.length === 0 && conversations.length === 0 && (
            <div className="px-3 py-2 text-xs text-foreground-muted">
              Projeto vazio
            </div>
          )}
        </div>
      )}
    </div>
  )
}
