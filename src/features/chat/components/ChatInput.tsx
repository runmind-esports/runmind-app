'use client'

import { ArrowUp } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { useChatInput } from '../hooks/useChatInput'
import { useImageAttachments, ImageAttachment } from '../hooks/useImageAttachments'
import { AttachmentButton } from './AttachmentButton'
import { ImagePreview } from './ImagePreview'
import { cn } from '@/lib/utils'
import { useEffect } from 'react'

interface ChatInputProps {
  onSend: (message: string, attachments?: ImageAttachment[]) => void | Promise<void>
  disabled?: boolean
}

export function ChatInput({ onSend, disabled }: ChatInputProps) {
  const {
    attachments,
    addFiles,
    removeAttachment,
    clearAttachments,
    hasAttachments,
    errors,
    clearErrors,
  } = useImageAttachments()

  const handleSubmit = async (message: string) => {
    const currentAttachments = attachments.length > 0 ? [...attachments] : undefined
    clearAttachments() // Clear immediately for better UX
    await onSend(message, currentAttachments)
  }

  const {
    value,
    setValue,
    isSubmitting,
    textareaRef,
    handleSubmit: submitMessage,
    handleKeyDown,
  } = useChatInput({
    onSubmit: handleSubmit,
    disabled,
  })

  // Auto-clear errors after 5 seconds
  useEffect(() => {
    if (errors.length > 0) {
      const timer = setTimeout(clearErrors, 5000)
      return () => clearTimeout(timer)
    }
  }, [errors, clearErrors])

  const isDisabled = disabled || isSubmitting
  const canSubmit = value.trim() || hasAttachments

  return (
    <div className="border-t border-border bg-background px-4 py-4">
      <div className="mx-auto max-w-chat">
        {/* Error messages */}
        {errors.length > 0 && (
          <div className="mb-2 rounded-lg bg-red-500/10 px-3 py-2 text-sm text-red-500">
            {errors.map((error, i) => (
              <p key={i}>{error}</p>
            ))}
          </div>
        )}

        <div className="rounded-input bg-background-secondary px-3 py-1.5">
          {/* Image previews inside input container */}
          {hasAttachments && (
            <div className="mb-2 flex flex-col items-center gap-1">
              <div className="flex flex-wrap justify-center gap-1.5">
                {attachments.map((attachment) => (
                  <ImagePreview
                    key={attachment.id}
                    src={attachment.previewUrl}
                    onRemove={() => removeAttachment(attachment.id)}
                  />
                ))}
              </div>
              <span className="text-xs text-foreground-muted">
                {attachments.length}/5
              </span>
            </div>
          )}

          {/* Input row */}
          <div className="flex items-center gap-2">
            <AttachmentButton
              onFilesSelected={addFiles}
              disabled={isDisabled}
            />

            <Textarea
              ref={textareaRef}
              value={value}
              onChange={(e) => setValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Pergunte sobre seu treino..."
              disabled={isDisabled}
              rows={1}
              className="min-h-[22px] flex-1 border-0 bg-transparent pl-2 py-0 focus-visible:ring-0 resize-none text-sm"
            />

            <Button
              onClick={submitMessage}
              disabled={isDisabled || !canSubmit}
              size="icon"
              className={cn(
                'h-7 w-7 shrink-0 rounded-full',
                canSubmit
                  ? 'bg-foreground text-background hover:bg-foreground/90'
                  : 'bg-background-tertiary text-foreground-muted'
              )}
            >
              <ArrowUp className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <p className="mt-2 text-center text-xs text-foreground-muted">
          Runmind pode cometer erros. Verifique informações importantes.
        </p>
      </div>
    </div>
  )
}
