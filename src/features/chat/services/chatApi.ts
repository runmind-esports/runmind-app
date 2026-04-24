import { chatApiClient } from '@/shared/lib/apiClient'

// API Response Types
export interface ApiMessage {
  id: string
  content: string
  role: 'user' | 'assistant'
  created_at: string
}

export interface ApiConversation {
  id: string
  title: string
  messages?: ApiMessage[]
  created_at?: string
  updated_at?: string
  createdAt?: string
  updatedAt?: string
  project_id?: string | null
  projectId?: string | null
}

export interface SendMessageRequest {
  message: string
  conversationId?: string
}

export interface SendMessageWithAttachmentRequest {
  message: string
  image: File
  conversationId?: string
}

export interface SendMessageWithAttachmentsRequest {
  message: string
  images: File[]
  conversationId?: string
}

export interface SendMessageResponse {
  response: string
  timestamp: string
  conversationId: string
  title: string
}

export interface ListConversationsResponse {
  conversations: ApiConversation[]
  total: number
  page: number
  limit: number
}

export interface ManaStatus {
  current: number
  max: number
  reset_at: string
}

export const chatApi = {
  // Send message (creates conversation if not provided)
  sendMessage: async (data: SendMessageRequest): Promise<SendMessageResponse> => {
    const response = await chatApiClient.post<SendMessageResponse>('/api/v1/chat/message', {
      message: data.message,
      conversationId: data.conversationId,
    })
    return response.data
  },

  // Send message with single image attachment
  sendMessageWithAttachment: async (data: SendMessageWithAttachmentRequest): Promise<SendMessageResponse> => {
    const formData = new FormData()
    formData.append('message', data.message)
    formData.append('image', data.image)
    if (data.conversationId) {
      formData.append('conversationId', data.conversationId)
    }
    const response = await chatApiClient.post<SendMessageResponse>(
      '/api/v1/chat/message/attachment',
      formData,
      { headers: { 'Content-Type': 'multipart/form-data' } }
    )
    return response.data
  },

  // Send message with multiple image attachments
  sendMessageWithAttachments: async (data: SendMessageWithAttachmentsRequest): Promise<SendMessageResponse> => {
    const formData = new FormData()
    formData.append('message', data.message)
    data.images.forEach((img, i) => formData.append(`image_${i}`, img))
    if (data.conversationId) {
      formData.append('conversationId', data.conversationId)
    }
    const response = await chatApiClient.post<SendMessageResponse>(
      '/api/v1/chat/message/attachments',
      formData,
      { headers: { 'Content-Type': 'multipart/form-data' } }
    )
    return response.data
  },

  // Send message to specific conversation
  sendMessageToConversation: async (conversationId: string, message: string): Promise<SendMessageResponse> => {
    const response = await chatApiClient.post<SendMessageResponse>(
      `/api/v1/chat/conversations/${conversationId}/message`,
      { message }
    )
    return response.data
  },

  // List conversations (paginated, optionally filtered by project)
  listConversations: async (page = 1, limit = 20, projectId?: string): Promise<ListConversationsResponse> => {
    let url = `/api/v1/chat/conversations/list?page=${page}&limit=${limit}`
    if (projectId) url += `&project_id=${projectId}`
    const response = await chatApiClient.get<ListConversationsResponse>(url)
    return response.data
  },

  // Get conversation with messages
  getConversation: async (id: string): Promise<ApiConversation> => {
    const response = await chatApiClient.get<ApiConversation>(`/api/v1/chat/conversations/${id}`)
    return response.data
  },

  // Create new conversation
  createConversation: async (title: string): Promise<ApiConversation> => {
    const response = await chatApiClient.post<ApiConversation>('/api/v1/chat/conversations', { title })
    return response.data
  },

  // Update conversation title
  updateTitle: async (id: string, title: string): Promise<void> => {
    await chatApiClient.patch(`/api/v1/chat/conversations/${id}/title`, { title })
  },

  // Delete conversation
  deleteConversation: async (id: string): Promise<void> => {
    await chatApiClient.delete(`/api/v1/chat/conversations/${id}`)
  },

  // Get mana status
  getManaStatus: async (): Promise<ManaStatus> => {
    const response = await chatApiClient.get<ManaStatus>('/api/v1/mana/status')
    return response.data
  },
}
