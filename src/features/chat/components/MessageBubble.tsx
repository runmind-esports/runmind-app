'use client'

import { Message } from '../types'
import { cn } from '@/lib/utils'
import { useTypingEffect } from '../hooks/useTypingEffect'
import Image from 'next/image'

function AssistantAvatar() {
  return (
    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-accent/15">
      <svg width="14" height="14" viewBox="0 0 80 80" fill="none">
        <circle cx="40" cy="40" r="40" fill="currentColor" className="text-accent" />
        <path d="M22 58L22 22L44 22C54 22 62 29.5 62 38.5C62 47.5 54 55 44 55L22 55" stroke="white" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M42 55L62 65" stroke="white" strokeWidth="6" strokeLinecap="round"/>
      </svg>
    </div>
  )
}

interface MessageBubbleProps {
  message: Message
  isLatest?: boolean
  animate?: boolean
}

export function MessageBubble({ message, isLatest = false, animate = true }: MessageBubbleProps) {
  const isUser = message.role === 'user'
  const shouldAnimate = !isUser && isLatest && animate

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
      {!isUser && <AssistantAvatar />}
      <div
        className={cn(
          'max-w-[85%]',
          isUser
            ? 'rounded-2xl rounded-br-md bg-bubble-user px-4 py-2.5'
            : 'ml-2.5 rounded-2xl rounded-tl-md bg-background-secondary px-4 py-2.5'
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
          content.includes('<') && content.includes('>') ? (
            <div
              className="text-[15px] leading-relaxed break-words text-foreground [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:my-2 [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:my-2 [&_li]:mb-1 [&_p]:mb-2 [&_p:last-child]:mb-0"
              dangerouslySetInnerHTML={{ __html: content }}
            />
          ) : (
            <p className="text-[15px] leading-relaxed whitespace-pre-wrap break-words text-foreground">
              {content}
              {isTyping && <span className="ml-0.5 inline-block h-4 w-0.5 animate-pulse bg-foreground" />}
            </p>
          )
        )}
      </div>
    </div>
  )
}
