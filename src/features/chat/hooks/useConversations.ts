'use client'

import { useState, useCallback, useEffect } from 'react'
import { Conversation, Message } from '../types'
import { chatApi, ApiConversation, ApiMessage } from '../services/chatApi'
import { authApi } from '@/features/auth/services/authApi'

// Convert API conversation to local format
const toLocalConversation = (api: ApiConversation): Conversation => ({
  id: api.id,
  title: api.title,
  messages: (api.messages || []).map((m: ApiMessage) => ({
    id: m.id,
    role: m.role,
    content: m.content,
    createdAt: new Date(m.created_at),
  })),
  folderId: null,
  projectId: api.projectId || api.project_id || null,
  createdAt: new Date(api.createdAt || api.created_at || ''),
  updatedAt: new Date(api.updatedAt || api.updated_at || ''),
})

export function useConversations() {
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const activeConversation = conversations.find((c) => c.id === activeConversationId) || null

  // Fetch conversations from API
  const fetchConversations = useCallback(async () => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await chatApi.listConversations()
      const localConversations = response.conversations.map(toLocalConversation)
      setConversations(localConversations)
    } catch (err) {
      const axiosErr = err as { response?: { status?: number } }
      if (axiosErr?.response?.status === 404) {
        setConversations([])
      } else {
        console.error('Error fetching conversations:', err)
        setError('Erro ao carregar conversas')
      }
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Load conversations on mount (only if authenticated)
  useEffect(() => {
    if (authApi.isAuthenticated()) {
      fetchConversations()
    }
  }, [fetchConversations])

  // Create new conversation
  const createConversation = useCallback(async (title?: string): Promise<Conversation | null> => {
    try {
      const apiConversation = await chatApi.createConversation(title || 'Nova conversa')
      const newConversation = toLocalConversation(apiConversation)

      setConversations((prev) => [newConversation, ...prev])
      setActiveConversationId(newConversation.id)

      return newConversation
    } catch (err) {
      console.error('Error creating conversation:', err)
      setError('Erro ao criar conversa')
      return null
    }
  }, [])

  // Delete conversation
  const deleteConversation = useCallback(async (id: string) => {
    try {
      await chatApi.deleteConversation(id)
      setConversations((prev) => prev.filter((c) => c.id !== id))

      if (activeConversationId === id) {
        setActiveConversationId(null)
      }
    } catch (err) {
      console.error('Error deleting conversation:', err)
      setError('Erro ao excluir conversa')
    }
  }, [activeConversationId])

  // Rename conversation
  const renameConversation = useCallback(async (id: string, title: string) => {
    try {
      await chatApi.updateTitle(id, title)
      setConversations((prev) =>
        prev.map((c) =>
          c.id === id ? { ...c, title, updatedAt: new Date() } : c
        )
      )
    } catch (err) {
      console.error('Error renaming conversation:', err)
      setError('Erro ao renomear conversa')
    }
  }, [])

  // Update conversation messages locally (used after sending a message)
  const updateConversationMessages = useCallback((id: string, messages: Message[]) => {
    setConversations((prev) =>
      prev.map((c) =>
        c.id === id
          ? {
              ...c,
              messages,
              title: messages[0]?.content.slice(0, 30) || c.title,
              updatedAt: new Date(),
            }
          : c
      )
    )
  }, [])

  // Add conversation to local state (used when API creates a conversation on first message)
  const addConversation = useCallback((conversation: Conversation) => {
    setConversations((prev) => {
      // Check if already exists
      if (prev.some((c) => c.id === conversation.id)) {
        return prev
      }
      return [conversation, ...prev]
    })
  }, [])

  // Select conversation
  const selectConversation = useCallback((id: string | null) => {
    setActiveConversationId(id)
  }, [])

  // Get root conversations (for sidebar)
  const getRootConversations = useCallback(() => {
    return conversations
  }, [conversations])

  return {
    conversations,
    activeConversationId,
    activeConversation,
    isLoading,
    error,
    // Actions
    fetchConversations,
    createConversation,
    deleteConversation,
    renameConversation,
    updateConversationMessages,
    addConversation,
    selectConversation,
    // Getters
    getRootConversations,
  }
}
