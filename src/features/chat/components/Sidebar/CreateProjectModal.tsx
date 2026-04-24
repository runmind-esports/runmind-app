'use client'

import { useState, useEffect, useCallback } from 'react'
import { createPortal } from 'react-dom'
import { IconPicker } from './IconPicker'

interface CreateProjectModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (name: string, icon: string) => void
  initialName?: string
  initialIcon?: string
  title?: string
}

export function CreateProjectModal({
  isOpen,
  onClose,
  onSubmit,
  initialName = '',
  initialIcon = 'Folder',
  title,
}: CreateProjectModalProps) {
  const [name, setName] = useState(initialName)
  const [icon, setIcon] = useState(initialIcon)

  useEffect(() => {
    if (isOpen) {
      setName(initialName)
      setIcon(initialIcon)
    }
  }, [isOpen, initialName, initialIcon])

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    },
    [onClose]
  )

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown)
      return () => document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, handleKeyDown])

  const handleSubmit = () => {
    if (name.trim()) {
      onSubmit(name.trim(), icon)
      onClose()
    }
  }

  const isEditing = !!initialName

  if (!isOpen) return null

  return createPortal(
    <div
      className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center"
      onClick={onClose}
    >
      <div
        className="bg-background rounded-xl p-6 w-[90vw] max-w-sm shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-lg font-semibold text-foreground mb-4">
          {title || 'Novo projeto'}
        </h2>

        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value.slice(0, 50))}
          placeholder="Nome do projeto"
          maxLength={50}
          autoFocus
          className="w-full rounded-lg bg-background-secondary px-3 py-2.5 text-sm text-foreground placeholder:text-foreground-muted outline-none mb-4"
        />

        <div className="mb-4">
          <p className="text-xs text-foreground-muted uppercase tracking-wider mb-2">
            Icone
          </p>
          <IconPicker selectedIcon={icon} onSelect={setIcon} />
        </div>

        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-sm text-foreground-muted hover:bg-background-secondary transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            disabled={!name.trim()}
            className="px-4 py-2 rounded-lg text-sm font-medium bg-accent text-white hover:bg-accent/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isEditing ? 'Salvar' : 'Criar'}
          </button>
        </div>
      </div>
    </div>,
    document.body
  )
}
