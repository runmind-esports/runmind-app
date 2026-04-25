'use client'

import { Message } from '../types'
import { cn } from '@/lib/utils'
import Image from 'next/image'

// Convert basic markdown to HTML (bold, italic, line breaks)
function markdownToHtml(text: string): string {
  return text
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/\n/g, '<br/>')
}

function hasRichContent(text: string): boolean {
  return (text.includes('<') && text.includes('>')) || /\*\*.+?\*\*/.test(text)
}

interface MessageBubbleProps {
  message: Message
  isLatest?: boolean
  animate?: boolean
}

export function MessageBubble({ message, isLatest = false, animate = true }: MessageBubbleProps) {
  const isUser = message.role === 'user'
  const shouldAnimate = !isUser && isLatest && animate
  const content = message.content
  const hasAttachments = message.attachments && message.attachments.length > 0

  const contentClasses = 'text-sm leading-[1.7] break-words text-foreground'
  const richClasses = `${contentClasses} [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:my-2 [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:my-2 [&_li]:mb-1 [&_p]:mb-2 [&_p:last-child]:mb-0 [&_strong]:font-semibold [&_em]:italic`

  return (
    <div
      className={cn(
        'flex w-full gap-3',
        isUser ? 'justify-end' : 'justify-start'
      )}
    >
      <div
        className={cn(
          'max-w-[95%] sm:max-w-[85%]',
          isUser
            ? 'rounded-2xl rounded-br-md bg-bubble-user px-3.5 py-2'
            : 'py-0.5',
          shouldAnimate && 'animate-fade-in'
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
          hasRichContent(content) ? (
            <div
              className={richClasses}
              dangerouslySetInnerHTML={{ __html: content.includes('<') ? content : markdownToHtml(content) }}
            />
          ) : (
            <p className={`${contentClasses} whitespace-pre-wrap`}>
              {content}
            </p>
          )
        )}
      </div>
    </div>
  )
}
