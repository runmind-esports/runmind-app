'use client'

import { Folder, FolderOpen, ChevronRight, MoreHorizontal, Trash2, Edit2 } from 'lucide-react'
import { Folder as FolderType, Conversation } from '../../types'
import { ConversationItem } from './ConversationItem'
import { cn } from '@/lib/utils'
import { useState, useRef, useEffect } from 'react'

interface FolderItemProps {
  folder: FolderType
  conversations: Conversation[]
  activeConversationId: string | null
  onToggle: () => void
  onDelete: () => void
  onRename: (name: string) => void
  onSelectConversation: (id: string) => void
  onDeleteConversation: (id: string) => void
  onRenameConversation: (id: string, title: string) => void
}

export function FolderItem({
  folder,
  conversations,
  activeConversationId,
  onToggle,
  onDelete,
  onRename,
  onSelectConversation,
  onDeleteConversation,
  onRenameConversation,
}: FolderItemProps) {
  const [showMenu, setShowMenu] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [editValue, setEditValue] = useState(folder.name)
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
    if (editValue.trim() && editValue !== folder.name) {
      onRename(editValue.trim())
    }
    setIsEditing(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleRename()
    } else if (e.key === 'Escape') {
      setEditValue(folder.name)
      setIsEditing(false)
    }
  }

  const FolderIcon = folder.isExpanded ? FolderOpen : Folder

  return (
    <div>
      <div
        className="group flex items-center gap-2 rounded-lg px-3 py-2 cursor-pointer hover:bg-background-secondary/50 transition-colors"
        onClick={onToggle}
      >
        <ChevronRight
          className={cn(
            'h-4 w-4 shrink-0 text-foreground-muted transition-transform',
            folder.isExpanded && 'rotate-90'
          )}
        />
        <FolderIcon className="h-4 w-4 shrink-0 text-foreground-muted" />

        {isEditing ? (
          <input
            ref={inputRef}
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onBlur={handleRename}
            onKeyDown={handleKeyDown}
            onClick={(e) => e.stopPropagation()}
            className="flex-1 bg-transparent text-sm text-foreground outline-none"
          />
        ) : (
          <span className="flex-1 truncate text-sm text-foreground">{folder.name}</span>
        )}

        <span className="text-xs text-foreground-muted">{conversations.length}</span>

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
            <div className="absolute right-0 top-full mt-1 z-50 w-40 rounded-lg bg-background-tertiary border border-border shadow-lg py-1">
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
                Excluir
              </button>
            </div>
          )}
        </div>
      </div>

      {folder.isExpanded && conversations.length > 0 && (
        <div className="ml-4 border-l border-border pl-2">
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
      )}
    </div>
  )
}
