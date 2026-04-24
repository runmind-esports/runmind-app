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
      className="fixed inset-0 bg-black/50 z-[60] flex items-end sm:items-center justify-center p-0 sm:p-4"
      onClick={onClose}
    >
      <div
        className="bg-background rounded-t-2xl sm:rounded-xl w-full sm:w-auto sm:min-w-[360px] sm:max-w-sm shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Handle bar (mobile) */}
        <div className="flex justify-center pt-3 pb-1 sm:hidden">
          <div className="w-10 h-1 rounded-full bg-foreground-muted/30" />
        </div>

        <div className="px-6 pt-4 sm:pt-6 pb-6">
          <h2 className="text-lg font-semibold text-foreground mb-5">
            {title || 'Novo projeto'}
          </h2>

          <label className="block text-xs font-medium text-foreground-muted mb-1.5">
            Nome
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value.slice(0, 50))}
            placeholder="Nome do projeto"
            maxLength={50}
            autoFocus
            className="w-full rounded-lg bg-background-secondary px-4 py-3 text-sm text-foreground placeholder:text-foreground-muted outline-none focus:ring-2 focus:ring-accent/30 mb-5"
          />

          <label className="block text-xs font-medium text-foreground-muted mb-2">
            Ícone
          </label>
          <IconPicker selectedIcon={icon} onSelect={setIcon} />

          <div className="flex gap-3 mt-6">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-3 rounded-lg text-sm font-medium text-foreground-muted hover:bg-background-secondary transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={handleSubmit}
              disabled={!name.trim()}
              className="flex-1 px-4 py-3 rounded-lg text-sm font-medium bg-accent text-white hover:bg-accent/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isEditing ? 'Salvar' : 'Criar'}
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  )
}
