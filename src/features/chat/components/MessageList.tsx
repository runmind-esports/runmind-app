'use client'

import { Message } from '../types'
import { MessageBubble } from './MessageBubble'
import { TypingIndicator } from './TypingIndicator'
import { useChatScroll } from '../hooks/useChatScroll'

interface MessageListProps {
  messages: Message[]
  isLoading: boolean
  animate?: boolean
}

export function MessageList({ messages, isLoading, animate = true }: MessageListProps) {
  const { scrollRef } = useChatScroll<HTMLDivElement>([messages, isLoading])

  return (
    <div
      ref={scrollRef}
      className="flex-1 overflow-y-auto px-3 pt-4 pb-8"
    >
      <div className="mx-auto max-w-chat space-y-6 font-body">
        {messages.map((message, index) => (
          <MessageBubble
            key={message.id}
            message={message}
            isLatest={index === messages.length - 1}
            animate={animate}
          />
        ))}

        {isLoading ? (
          <TypingIndicator />
        ) : messages.length > 0 && messages[messages.length - 1].role === 'assistant' && (
          <div className="flex items-center justify-between -mt-4 py-0">
            <div className="h-5 w-5" />
            <div className="text-right">
              <span className="text-[10px] text-foreground-muted/50">
                Runmind é uma IA e pode cometer erros.
              </span>
              <br />
              <span className="text-[10px] text-foreground-muted/50">
                Verifique as respostas.
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
