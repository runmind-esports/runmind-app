'use client'

import { useEffect, useCallback, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useChat } from '../hooks/useChat'
import { useSidebar } from '../hooks/useSidebar'
import { useConversations } from '../hooks/useConversations'
import { useProjects } from '../hooks/useProjects'
import { useAuth } from '@/features/auth/hooks/useAuth'
import { ChatHeader } from './ChatHeader'
import { MessageList } from './MessageList'
import { ChatInput } from './ChatInput'
import { WelcomeScreen } from './WelcomeScreen'
import { Sidebar } from './Sidebar'
import { ImageAttachment } from '../hooks/useImageAttachments'

export function Chat() {
  const router = useRouter()
  const { isAuthenticated, isLoading: authLoading } = useAuth()

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login')
    }
  }, [authLoading, isAuthenticated, router])
  const chat = useChat()
  const sidebar = useSidebar()
  const conversations = useConversations()
  const { projects, createProject, updateProject, deleteProject, moveConversation, toggleProject } = useProjects()
  // Track conversation IDs we've just created via sendMessage to skip reloading
  const justCreatedRef = useRef<Set<string>>(new Set())
  // Track if messages were loaded from history (skip typing animation)
  const [isLoadedConversation, setIsLoadedConversation] = useState(false)

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
        setIsLoadedConversation(true)
        chat.loadConversation(conversations.activeConversationId)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [conversations.activeConversationId])

  // Handle sending message
  const handleSendMessage = useCallback(async (content: string, attachments?: ImageAttachment[]) => {
    setIsLoadedConversation(false)
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

  // Show nothing while checking auth or redirecting
  if (authLoading || !isAuthenticated) {
    return null
  }

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
        projects={projects}
        onToggleProject={toggleProject}
        onDeleteProject={(id) => deleteProject(id)}
        onRenameProject={(id, name) => updateProject(id, { name })}
        onChangeProjectIcon={(id, icon) => updateProject(id, { icon })}
        onCreateProject={(name, icon) => createProject({ name, icon })}
        onMoveConversation={(convId, projId) => moveConversation(convId, projId)}
      />

      <ChatHeader
        onClear={handleClear}
        onToggleSidebar={sidebar.toggle}
        hasMessages={hasMessages}
      />

      {hasMessages ? (
        <MessageList messages={chat.messages} isLoading={chat.isLoading} animate={!isLoadedConversation} />
      ) : (
        <WelcomeScreen onSelectPrompt={handleSendMessage} />
      )}

      <ChatInput onSend={handleSendMessage} disabled={chat.isLoading} />
    </div>
  )
}
