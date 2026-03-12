'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { authApi } from '../services/authApi'
import type { LoginCredentials, RegisterCredentials, UserProfile } from '../types/auth.types'

export const authKeys = {
  profile: ['auth', 'profile'] as const,
}

export function useAuth() {
  const queryClient = useQueryClient()
  const router = useRouter()

  const {
    data: profile,
    isLoading,
    error,
  } = useQuery({
    queryKey: authKeys.profile,
    queryFn: authApi.getProfile,
    enabled: authApi.isAuthenticated(),
    retry: false,
    staleTime: 1000 * 60 * 5, // 5 minutes
  })

  const loginMutation = useMutation({
    mutationFn: (credentials: LoginCredentials) => authApi.login(credentials),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: authKeys.profile })
      router.push('/chat')
    },
  })

  const registerMutation = useMutation({
    mutationFn: (credentials: RegisterCredentials) => authApi.register(credentials),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: authKeys.profile })
      router.push('/connect-apps')
    },
  })

  const forgotPasswordMutation = useMutation({
    mutationFn: (email: string) => authApi.forgotPassword(email),
  })

  const logout = () => {
    authApi.logout()
    queryClient.setQueryData(authKeys.profile, null)
    queryClient.clear()
    router.push('/login')
  }

  return {
    profile: profile as UserProfile | null,
    username: authApi.getUsername(),
    isAuthenticated: authApi.isAuthenticated() && !error,
    isLoading,
    error: error as Error | null,
    login: loginMutation.mutate,
    loginAsync: loginMutation.mutateAsync,
    loginError: loginMutation.error as Error | null,
    isLoggingIn: loginMutation.isPending,
    register: registerMutation.mutate,
    registerAsync: registerMutation.mutateAsync,
    registerError: registerMutation.error as Error | null,
    isRegistering: registerMutation.isPending,
    forgotPassword: forgotPasswordMutation.mutate,
    forgotPasswordAsync: forgotPasswordMutation.mutateAsync,
    forgotPasswordError: forgotPasswordMutation.error as Error | null,
    isSendingForgotPassword: forgotPasswordMutation.isPending,
    forgotPasswordSuccess: forgotPasswordMutation.isSuccess,
    logout,
  }
}
