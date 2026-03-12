'use client'

import { Message } from '../types'
import { cn } from '@/lib/utils'
import { useTypingEffect } from '../hooks/useTypingEffect'

interface MessageBubbleProps {
  message: Message
  isLatest?: boolean
}

export function MessageBubble({ message, isLatest = false }: MessageBubbleProps) {
  const isUser = message.role === 'user'
  const shouldAnimate = !isUser && isLatest

  const { displayedText, isTyping } = useTypingEffect({
    text: message.content,
    speed: 15,
    enabled: shouldAnimate,
  })

  const content = shouldAnimate ? displayedText : message.content

  return (
    <div
      className={cn(
        'flex w-full',
        isUser ? 'justify-end' : 'justify-start'
      )}
    >
      <div
        className={cn(
          'max-w-[85%]',
          isUser
            ? 'rounded-2xl rounded-br-md bg-bubble-user px-4 py-2.5'
            : 'py-1'
        )}
      >
        <p className="text-[15px] leading-relaxed whitespace-pre-wrap break-words text-foreground">
          {content}
          {isTyping && <span className="ml-0.5 inline-block h-4 w-0.5 animate-pulse bg-foreground" />}
        </p>
      </div>
    </div>
  )
}
