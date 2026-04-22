'use client'

import { Message } from '../types'
import { cn } from '@/lib/utils'
import { useTypingEffect } from '../hooks/useTypingEffect'
import Image from 'next/image'

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
  const hasAttachments = message.attachments && message.attachments.length > 0

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
        {/* Image attachments */}
        {hasAttachments && (
          <div className={cn(
            'flex flex-wrap gap-2',
            content ? 'mb-2' : ''
          )}>
            {message.attachments!.map((attachment) => (
              <div
                key={attachment.id}
                className="relative h-32 w-32 overflow-hidden rounded-lg"
              >
                <Image
                  src={attachment.url}
                  alt="Imagem anexada"
                  fill
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        )}

        {/* Text content */}
        {content && (
          <p className="text-[15px] leading-relaxed whitespace-pre-wrap break-words text-foreground">
            {content}
            {isTyping && <span className="ml-0.5 inline-block h-4 w-0.5 animate-pulse bg-foreground" />}
          </p>
        )}
      </div>
    </div>
  )
}
