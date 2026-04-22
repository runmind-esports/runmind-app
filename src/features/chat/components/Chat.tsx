'use client'

import { useEffect, useCallback, useRef } from 'react'
import { useChat } from '../hooks/useChat'
import { useSidebar } from '../hooks/useSidebar'
import { useConversations } from '../hooks/useConversations'
import { ChatHeader } from './ChatHeader'
import { MessageList } from './MessageList'
import { ChatInput } from './ChatInput'
import { WelcomeScreen } from './WelcomeScreen'
import { Sidebar } from './Sidebar'
import { ImageAttachment } from '../hooks/useImageAttachments'

export function Chat() {
  const chat = useChat()
  const sidebar = useSidebar()
  const conversations = useConversations()
  // Track conversation IDs we've just created via sendMessage to skip reloading
  const justCreatedRef = useRef<Set<string>>(new Set())

  const hasMessages = chat.messages.length > 0

  // Load conversation when selected from sidebar
  useEffect(() => {
    if (
      conversations.activeConversationId &&
      conversations.activeConversationId !== chat.conversationId
    ) {
      // Skip loading if we just created this conversation via sendMessage
      if (justCreatedRef.current.has(conversations.activeConversationId)) {
        justCreatedRef.current.delete(conversations.activeConversationId)
        // Just sync the conversationId without reloading
        chat.setConversationId(conversations.activeConversationId)
      } else {
        chat.loadConversation(conversations.activeConversationId)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [conversations.activeConversationId])

  // Handle sending message
  const handleSendMessage = useCallback(async (content: string, attachments?: ImageAttachment[]) => {
    const conversationId = await chat.sendMessage(content, attachments)

    // If a new conversation was created, mark it and refresh the list
    if (conversationId && !conversations.activeConversationId) {
      justCreatedRef.current.add(conversationId)
      conversations.selectConversation(conversationId)
      conversations.fetchConversations()
    }
  }, [chat, conversations])

  // Handle new conversation
  const handleNewConversation = useCallback(() => {
    conversations.selectConversation(null)
    chat.clearMessages()
    sidebar.close()
  }, [conversations, chat, sidebar])

  // Handle clear (same as new conversation in simplified version)
  const handleClear = useCallback(() => {
    conversations.selectConversation(null)
    chat.clearMessages()
  }, [conversations, chat])

  // Handle select conversation
  const handleSelectConversation = useCallback((id: string) => {
    conversations.selectConversation(id)
  }, [conversations])

  return (
    <div className="flex h-screen flex-col bg-background">
      <Sidebar
        isOpen={sidebar.isOpen}
        onClose={sidebar.close}
        conversations={conversations.conversations}
        activeConversationId={conversations.activeConversationId}
        isLoading={conversations.isLoading}
        error={conversations.error}
        onNewConversation={handleNewConversation}
        onSelectConversation={handleSelectConversation}
        onDeleteConversation={conversations.deleteConversation}
        onRenameConversation={conversations.renameConversation}
      />

      <ChatHeader
        onClear={handleClear}
        onToggleSidebar={sidebar.toggle}
        hasMessages={hasMessages}
      />

      {hasMessages ? (
        <MessageList messages={chat.messages} isLoading={chat.isLoading} />
      ) : (
        <WelcomeScreen onSelectPrompt={handleSendMessage} />
      )}

      <ChatInput onSend={handleSendMessage} disabled={chat.isLoading} />
    </div>
  )
}
