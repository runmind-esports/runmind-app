'use client'

import { useState, useCallback } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { projectsApi } from '../services/projectsApi'
import {
  Project,
  ApiProject,
  CreateProjectRequest,
  UpdateProjectRequest,
} from '../types'

// Convert API project to local format
const toLocalProject = (api: ApiProject): Project => ({
  id: api.id,
  name: api.name,
  icon: api.icon,
  isExpanded: false,
  createdAt: new Date(api.created_at),
  updatedAt: new Date(api.updated_at),
})

export function useProjects() {
  const queryClient = useQueryClient()
  const [expandedState, setExpandedState] = useState<Record<string, boolean>>({})
  const [error, setError] = useState<string | null>(null)

  // Auto-dismiss errors after 5 seconds
  const setErrorWithDismiss = useCallback((message: string) => {
    setError(message)
    setTimeout(() => setError(null), 5000)
  }, [])

  // Fetch projects
  const {
    data: apiProjects,
    isLoading,
  } = useQuery({
    queryKey: ['projects'],
    queryFn: projectsApi.listProjects,
    staleTime: 30_000,
  })

  // Map API projects to local format, merging expanded state
  const projects: Project[] = (apiProjects || []).map((api) => ({
    ...toLocalProject(api),
    isExpanded: expandedState[api.id] ?? false,
  }))

  // Create project mutation
  const createMutation = useMutation({
    mutationFn: (data: CreateProjectRequest) => projectsApi.createProject(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] })
    },
    onError: (err) => {
      console.error('Error creating project:', err)
      setErrorWithDismiss('Erro ao criar projeto')
    },
  })

  // Update project mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateProjectRequest }) =>
      projectsApi.updateProject(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] })
    },
    onError: (err) => {
      console.error('Error updating project:', err)
      setErrorWithDismiss('Erro ao atualizar projeto')
    },
  })

  // Delete project mutation
  const deleteMutation = useMutation({
    mutationFn: (id: string) => projectsApi.deleteProject(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] })
      queryClient.invalidateQueries({ queryKey: ['conversations'] })
    },
    onError: (err) => {
      console.error('Error deleting project:', err)
      setErrorWithDismiss('Erro ao excluir projeto')
    },
  })

  // Move conversation mutation
  const moveMutation = useMutation({
    mutationFn: ({ conversationId, projectId }: { conversationId: string; projectId: string | null }) =>
      projectsApi.moveConversation(conversationId, { projectId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] })
      queryClient.invalidateQueries({ queryKey: ['conversations'] })
    },
    onError: (err) => {
      console.error('Error moving conversation:', err)
      setErrorWithDismiss('Erro ao mover conversa')
    },
  })

  // Public API
  const createProject = useCallback(async (data: CreateProjectRequest) => {
    await createMutation.mutateAsync(data)
  }, [createMutation])

  const updateProject = useCallback(async (id: string, data: UpdateProjectRequest) => {
    await updateMutation.mutateAsync({ id, data })
  }, [updateMutation])

  const deleteProject = useCallback(async (id: string) => {
    await deleteMutation.mutateAsync(id)
  }, [deleteMutation])

  const moveConversation = useCallback(async (conversationId: string, projectId: string | null) => {
    await moveMutation.mutateAsync({ conversationId, projectId })
  }, [moveMutation])

  // Toggle expanded state (local only)
  const toggleProject = useCallback((id: string) => {
    setExpandedState((prev) => ({
      ...prev,
      [id]: !prev[id],
    }))
  }, [])

  return {
    projects,
    isLoading,
    error,
    createProject,
    updateProject,
    deleteProject,
    moveConversation,
    toggleProject,
  }
}
