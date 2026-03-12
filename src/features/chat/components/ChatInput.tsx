'use client'

import { ArrowUp } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { useChatInput } from '../hooks/useChatInput'
import { cn } from '@/lib/utils'

interface ChatInputProps {
  onSend: (message: string) => void | Promise<void>
  disabled?: boolean
}

export function ChatInput({ onSend, disabled }: ChatInputProps) {
  const {
    value,
    setValue,
    isSubmitting,
    textareaRef,
    handleSubmit,
    handleKeyDown,
  } = useChatInput({
    onSubmit: onSend,
    disabled,
  })

  const isDisabled = disabled || isSubmitting

  return (
    <div className="border-t border-border bg-background px-4 py-4">
      <div className="mx-auto max-w-chat">
        <div className="relative flex items-end gap-2 rounded-input bg-background-secondary p-2">
          <Textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Pergunte sobre seu treino..."
            disabled={isDisabled}
            rows={1}
            className="min-h-[44px] flex-1 border-0 bg-transparent px-2 py-2 focus-visible:ring-0"
          />

          <Button
            onClick={handleSubmit}
            disabled={isDisabled || !value.trim()}
            size="icon"
            className={cn(
              'h-9 w-9 shrink-0 rounded-full',
              value.trim()
                ? 'bg-foreground text-background hover:bg-foreground/90'
                : 'bg-background-tertiary text-foreground-muted'
            )}
          >
            <ArrowUp className="h-5 w-5" />
          </Button>
        </div>

        <p className="mt-2 text-center text-xs text-foreground-muted">
          Runmind pode cometer erros. Verifique informações importantes.
        </p>
      </div>
    </div>
  )
}
