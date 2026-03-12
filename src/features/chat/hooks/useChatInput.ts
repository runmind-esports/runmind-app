'use client'

import { useState, useCallback, useRef, useEffect, KeyboardEvent } from 'react'

interface UseChatInputOptions {
  onSubmit: (value: string) => void | Promise<void>
  disabled?: boolean
}

export function useChatInput({ onSubmit, disabled }: UseChatInputOptions) {
  const [value, setValue] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const adjustHeight = useCallback(() => {
    const textarea = textareaRef.current
    if (textarea) {
      textarea.style.height = 'auto'
      textarea.style.height = `${Math.min(textarea.scrollHeight, 200)}px`
    }
  }, [])

  useEffect(() => {
    adjustHeight()
  }, [value, adjustHeight])

  const handleChange = useCallback((newValue: string) => {
    setValue(newValue)
  }, [])

  const handleSubmit = useCallback(async () => {
    if (!value.trim() || isSubmitting || disabled) return

    setIsSubmitting(true)
    try {
      await onSubmit(value.trim())
      setValue('')
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto'
      }
    } finally {
      setIsSubmitting(false)
    }
  }, [value, isSubmitting, disabled, onSubmit])

  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault()
        handleSubmit()
      }
    },
    [handleSubmit]
  )

  return {
    value,
    setValue: handleChange,
    isSubmitting,
    textareaRef,
    handleSubmit,
    handleKeyDown,
  }
}
