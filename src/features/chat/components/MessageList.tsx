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
      className="flex-1 overflow-y-auto px-4 py-4"
    >
      <div className="mx-auto max-w-chat space-y-4 font-body">
        {messages.map((message, index) => (
          <MessageBubble
            key={message.id}
            message={message}
            isLatest={index === messages.length - 1}
            animate={animate}
          />
        ))}

        {isLoading && <TypingIndicator />}
      </div>
    </div>
  )
}
