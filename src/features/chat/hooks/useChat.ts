'use client'

import { useState, useCallback } from 'react'
import { Message, MessageAttachment, ChatState } from '../types'
import { chatApi, ApiMessage } from '../services/chatApi'
import { generateId } from '@/lib/utils'
import { ImageAttachment } from './useImageAttachments'

// Convert API message to local message format
const toLocalMessage = (apiMessage: ApiMessage): Message => ({
  id: apiMessage.id,
  role: apiMessage.role,
  content: apiMessage.role === 'assistant'
    ? parseResponseContent(apiMessage.content)
    : apiMessage.content,
  createdAt: new Date(apiMessage.created_at),
})

// Parse API response content (may be JSON with blocks or plain text)
const parseResponseContent = (response: string): string => {
  try {
    const parsed = JSON.parse(response)

    // Handle blocks format
    if (parsed.blocks && Array.isArray(parsed.blocks)) {
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

    // Handle { message: "..." } or { text: "..." } or { response: "..." } or { content: "..." }
    if (typeof parsed === 'object' && parsed !== null) {
      const textField = parsed.message || parsed.text || parsed.response || parsed.content || parsed.answer
      if (typeof textField === 'string') {
        return textField
      }
    }

    // Handle plain string wrapped in JSON
    if (typeof parsed === 'string') {
      return parsed
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

  const sendMessage = useCallback(async (content: string, attachments?: ImageAttachment[]): Promise<string | null> => {
    if (!content.trim() && (!attachments || attachments.length === 0)) return null

    // Create attachment data for user message display
    const messageAttachments: MessageAttachment[] | undefined = attachments?.map((a) => ({
      id: a.id,
      url: a.previewUrl,
      type: 'image' as const,
    }))

    // Optimistic update: add user message immediately
    const userMessage: Message = {
      id: generateId(),
      role: 'user',
      content: content.trim(),
      createdAt: new Date(),
      attachments: messageAttachments,
    }

    setState((prev) => ({
      ...prev,
      messages: [...prev.messages, userMessage],
      isLoading: true,
      error: null,
    }))

    try {
      let response

      if (attachments && attachments.length > 0) {
        const files = attachments.map((a) => a.file)
        if (files.length === 1) {
          response = await chatApi.sendMessageWithAttachment({
            message: content.trim(),
            image: files[0],
            conversationId: currentConversationId || undefined,
          })
        } else {
          response = await chatApi.sendMessageWithAttachments({
            message: content.trim(),
            images: files,
            conversationId: currentConversationId || undefined,
          })
        }
      } else {
        response = await chatApi.sendMessage({
          message: content.trim(),
          conversationId: currentConversationId || undefined,
        })
      }

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

      // Check for rate limit (429)
      const isRateLimit = error instanceof Error && 'response' in error &&
        (error as { response?: { status?: number } }).response?.status === 429

      if (isRateLimit) {
        const limitMessage: Message = {
          id: generateId(),
          role: 'assistant',
          content: 'Você atingiu o limite diário de uso do plano gratuito. Seu limite será renovado amanhã. Para continuar agora, considere fazer upgrade para o plano Pro.',
          createdAt: new Date(),
        }
        setState((prev) => ({
          ...prev,
          messages: [...prev.messages, limitMessage],
          isLoading: false,
          error: null,
        }))
      } else {
        setState((prev) => ({
          ...prev,
          isLoading: false,
          error: 'Erro ao enviar mensagem. Tente novamente.',
        }))
      }
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
