'use client'

import { useState, useCallback } from 'react'
import { generateId } from '@/lib/utils'
import { validateImageFiles } from '../utils/imageValidation'

export interface ImageAttachment {
  id: string
  file: File
  previewUrl: string
}

export interface UseImageAttachmentsReturn {
  attachments: ImageAttachment[]
  addFiles: (files: FileList | File[]) => void
  removeAttachment: (id: string) => void
  clearAttachments: () => void
  hasAttachments: boolean
  errors: string[]
  clearErrors: () => void
}

export function useImageAttachments(): UseImageAttachmentsReturn {
  const [attachments, setAttachments] = useState<ImageAttachment[]>([])
  const [errors, setErrors] = useState<string[]>([])

  const addFiles = useCallback((files: FileList | File[]) => {
    const fileArray = Array.from(files)
    const existingFiles = attachments.map((a) => a.file)

    const validation = validateImageFiles(fileArray, existingFiles)

    if (validation.errors.length > 0) {
      setErrors(validation.errors)
    }

    if (validation.validFiles.length > 0) {
      const newAttachments: ImageAttachment[] = validation.validFiles.map((file) => ({
        id: generateId(),
        file,
        previewUrl: URL.createObjectURL(file),
      }))

      setAttachments((prev) => [...prev, ...newAttachments])
    }
  }, [attachments])

  const removeAttachment = useCallback((id: string) => {
    setAttachments((prev) => {
      const attachment = prev.find((a) => a.id === id)
      if (attachment) {
        URL.revokeObjectURL(attachment.previewUrl)
      }
      return prev.filter((a) => a.id !== id)
    })
  }, [])

  const clearAttachments = useCallback(() => {
    setAttachments((prev) => {
      prev.forEach((a) => URL.revokeObjectURL(a.previewUrl))
      return []
    })
  }, [])

  const clearErrors = useCallback(() => {
    setErrors([])
  }, [])

  return {
    attachments,
    addFiles,
    removeAttachment,
    clearAttachments,
    hasAttachments: attachments.length > 0,
    errors,
    clearErrors,
  }
}
