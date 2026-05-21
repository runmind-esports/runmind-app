'use client'

import { useState, useCallback } from 'react'
import { Copy, Share2, Check, Loader2 } from 'lucide-react'
import { Message } from '../types'
import { cn } from '@/lib/utils'
import Image from 'next/image'
import { useSubscription } from '@/features/subscription'

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

function stripHtml(html: string): string {
  return html.replace(/<[^>]+>/g, '').replace(/&[^;]+;/g, ' ').trim()
}

function MessageActions({ content }: { content: string }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = useCallback(() => {
    const text = stripHtml(content)
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }, [content])

  const handleShare = useCallback(() => {
    const text = stripHtml(content)
    if (navigator.share) {
      navigator.share({ text })
    } else {
      navigator.clipboard.writeText(text)
    }
  }, [content])

  return (
    <div className="flex items-center gap-1 mt-2">
      <button
        onClick={handleCopy}
        className="flex h-8 w-8 items-center justify-center rounded-lg text-foreground-muted hover:text-foreground hover:bg-background-secondary transition-colors"
        aria-label="Copiar"
      >
        {copied ? <Check className="h-4 w-4 text-accent" /> : <Copy className="h-4 w-4" />}
      </button>
      <button
        onClick={handleShare}
        className="flex h-8 w-8 items-center justify-center rounded-lg text-foreground-muted hover:text-foreground hover:bg-background-secondary transition-colors"
        aria-label="Compartilhar"
      >
        <Share2 className="h-4 w-4" />
      </button>
    </div>
  )
}

function UpgradeButton({ label }: { label: string }) {
  const { checkout, isCheckingOut } = useSubscription()

  const handleUpgrade = useCallback(async () => {
    await checkout('pro_monthly')
  }, [checkout])

  return (
    <button
      onClick={handleUpgrade}
      disabled={isCheckingOut}
      className="mt-3 inline-flex items-center gap-2 rounded-full bg-accent px-4 py-2 text-sm font-semibold text-background transition-opacity hover:opacity-90 disabled:opacity-60"
    >
      {isCheckingOut && <Loader2 className="h-4 w-4 animate-spin" />}
      {label}
    </button>
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

        {/* Upgrade action button */}
        {message.action?.type === 'upgrade' && (
          <UpgradeButton label={message.action.label} />
        )}

        {/* Action icons for assistant messages */}
        {!isUser && content && <MessageActions content={content} />}
      </div>
    </div>
  )
}
