'use client'

import { useState, useCallback } from 'react'
import { Message, ChatState } from '../types'
import { chatApi, ApiMessage } from '../services/chatApi'
import { generateId } from '@/lib/utils'

// Convert API message to local message format
const toLocalMessage = (apiMessage: ApiMessage): Message => ({
  id: apiMessage.id,
  role: apiMessage.role,
  content: apiMessage.content,
  createdAt: new Date(apiMessage.created_at),
})

// Parse API response content (may be JSON with blocks or plain text)
const parseResponseContent = (response: string): string => {
  try {
    const parsed = JSON.parse(response)
    if (parsed.blocks && Array.isArray(parsed.blocks)) {
      // Extract text content from blocks
      return parsed.blocks
        .map((block: { content?: string; items?: { content: string }[]; type: string }) => {
          if (block.type === 'paragraph' && block.content) {
            return block.content
          }
          if (block.type === 'list' && block.items) {
            return block.items.map((item) => `• ${item.content}`).join('\n')
          }
          return ''
        })
        .filter(Boolean)
        .join('\n\n')
    }
    return response
  } catch {
    // Not JSON, return as-is
    return response
  }
}

export function useChat(conversationId?: string | null) {
  const [state, setState] = useState<ChatState>({
    messages: [],
    isLoading: false,
    error: null,
  })
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(
    conversationId || null
  )

  const sendMessage = useCallback(async (content: string): Promise<string | null> => {
    if (!content.trim()) return null

    // Optimistic update: add user message immediately
    const userMessage: Message = {
      id: generateId(),
      role: 'user',
      content: content.trim(),
      createdAt: new Date(),
    }

    setState((prev) => ({
      ...prev,
      messages: [...prev.messages, userMessage],
      isLoading: true,
      error: null,
    }))

    try {
      const response = await chatApi.sendMessage({
        message: content.trim(),
        conversationId: currentConversationId || undefined,
      })

      // Update conversation ID if it was created
      if (response.conversationId && !currentConversationId) {
        setCurrentConversationId(response.conversationId)
      }

      // Create assistant message from response
      const assistantMessage: Message = {
        id: generateId(),
        role: 'assistant',
        content: parseResponseContent(response.response),
        createdAt: new Date(response.timestamp),
      }

      // Add assistant response
      setState((prev) => ({
        ...prev,
        messages: [...prev.messages, assistantMessage],
        isLoading: false,
      }))

      return response.conversationId
    } catch (error) {
      console.error('Error sending message:', error)
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: 'Erro ao enviar mensagem. Tente novamente.',
      }))
      return null
    }
  }, [currentConversationId])

  const loadConversation = useCallback(async (id: string) => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }))

    try {
      const conversation = await chatApi.getConversation(id)
      const messages = (conversation.messages || []).map(toLocalMessage)

      setState({
        messages,
        isLoading: false,
        error: null,
      })
      setCurrentConversationId(id)
    } catch (error) {
      console.error('Error loading conversation:', error)
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: 'Erro ao carregar conversa.',
      }))
    }
  }, [])

  const clearMessages = useCallback(() => {
    setState({
      messages: [],
      isLoading: false,
      error: null,
    })
    setCurrentConversationId(null)
  }, [])

  const setMessages = useCallback((messages: Message[]) => {
    setState((prev) => ({
      ...prev,
      messages,
    }))
  }, [])

  return {
    messages: state.messages,
    isLoading: state.isLoading,
    error: state.error,
    conversationId: currentConversationId,
    sendMessage,
    loadConversation,
    clearMessages,
    setMessages,
    setConversationId: setCurrentConversationId,
  }
}
