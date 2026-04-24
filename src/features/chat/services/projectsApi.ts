import { chatApiClient } from '@/shared/lib/apiClient'
import {
  ApiProject,
  CreateProjectRequest,
  UpdateProjectRequest,
  MoveConversationRequest,
} from '../types'

export const projectsApi = {
  // Create a new project
  createProject: async (data: CreateProjectRequest): Promise<ApiProject> => {
    const response = await chatApiClient.post<ApiProject>('/api/v1/chat/projects', data)
    return response.data
  },

  // List all projects for the authenticated user
  listProjects: async (): Promise<ApiProject[]> => {
    const response = await chatApiClient.get<ApiProject[]>('/api/v1/chat/projects')
    return response.data
  },

  // Update a project
  updateProject: async (id: string, data: UpdateProjectRequest): Promise<ApiProject> => {
    const response = await chatApiClient.put<ApiProject>(`/api/v1/chat/projects/${id}`, data)
    return response.data
  },

  // Delete a project
  deleteProject: async (id: string): Promise<void> => {
    await chatApiClient.delete(`/api/v1/chat/projects/${id}`)
  },

  // Move a conversation to a project (or unassign with null)
  moveConversation: async (conversationId: string, data: MoveConversationRequest): Promise<void> => {
    await chatApiClient.patch(`/api/v1/chat/conversations/${conversationId}/move`, data)
  },
}
