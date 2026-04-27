'use client'

import { useState, useCallback } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { authApi } from '../services/authApi'
import { buildStravaAuthUrl } from '@/features/strava/utils/oauth'
import type { UserProfile } from '../types/auth.types'

export const authKeys = {
  profile: ['auth', 'profile'] as const,
}

export function useAuth() {
  const queryClient = useQueryClient()
  const router = useRouter()
  const [isConnectingGoogle, setIsConnectingGoogle] = useState(false)
  const [isConnectingStrava, setIsConnectingStrava] = useState(false)
  const [socialLoginError, setSocialLoginError] = useState<string | null>(null)

  const {
    data: profile,
    isLoading,
    error,
  } = useQuery({
    queryKey: authKeys.profile,
    queryFn: authApi.getProfile,
    enabled: authApi.isAuthenticated(),
    retry: false,
    staleTime: 1000 * 60 * 5,
  })

  const loginWithGoogle = useCallback(async () => {
    try {
      setIsConnectingGoogle(true)
      setSocialLoginError(null)
      const { url } = await authApi.getGoogleAuthUrl()
      window.location.href = url
    } catch (err) {
      console.error('Error getting Google auth URL:', err)
      setSocialLoginError('Erro ao conectar com Google. Tente novamente.')
      setIsConnectingGoogle(false)
    }
  }, [])

  const loginWithStrava = useCallback(() => {
    setIsConnectingStrava(true)
    setSocialLoginError(null)
    const url = buildStravaAuthUrl()
    window.location.href = url
  }, [])

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

    loginWithGoogle,
    isConnectingGoogle,

    loginWithStrava,
    isConnectingStrava,

    socialLoginError,

    logout,
  }
}
