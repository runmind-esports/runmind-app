'use client'

import { MessageSquare, MoreHorizontal, Trash2, Edit2, FolderInput } from 'lucide-react'
import { Conversation } from '../../types'
import { cn } from '@/lib/utils'
import { useState, useRef, useEffect } from 'react'

interface ConversationItemProps {
  conversation: Conversation
  isActive: boolean
  onSelect: () => void
  onDelete: () => void
  onRename: (title: string) => void
}

function formatRelativeDate(date: Date): string {
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

  if (diffDays === 0) return 'Hoje'
  if (diffDays === 1) return 'Ontem'
  if (diffDays < 7) return `${diffDays} dias atrás`
  return date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })
}

export function ConversationItem({
  conversation,
  isActive,
  onSelect,
  onDelete,
  onRename,
}: ConversationItemProps) {
  const [showMenu, setShowMenu] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [editValue, setEditValue] = useState(conversation.title)
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
    if (editValue.trim() && editValue !== conversation.title) {
      onRename(editValue.trim())
    }
    setIsEditing(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleRename()
    } else if (e.key === 'Escape') {
      setEditValue(conversation.title)
      setIsEditing(false)
    }
  }

  return (
    <div
      className={cn(
        'group relative flex items-center gap-2 rounded-lg px-3 py-2.5 cursor-pointer transition-colors',
        isActive
          ? 'bg-background-secondary'
          : 'hover:bg-background-secondary/50'
      )}
      onClick={onSelect}
    >
      <MessageSquare className="h-4 w-4 shrink-0 text-foreground-muted" />

      <div className="flex-1 min-w-0">
        {isEditing ? (
          <input
            ref={inputRef}
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onBlur={handleRename}
            onKeyDown={handleKeyDown}
            onClick={(e) => e.stopPropagation()}
            className="w-full bg-transparent text-sm text-foreground outline-none"
          />
        ) : (
          <>
            <p className="truncate text-sm text-foreground">{conversation.title}</p>
            <p className="text-xs text-foreground-muted">
              {formatRelativeDate(conversation.updatedAt)}
            </p>
          </>
        )}
      </div>

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
  )
}
