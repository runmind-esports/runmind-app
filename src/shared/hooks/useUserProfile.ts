'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/features/auth/hooks/useAuth'
import { useStrava } from '@/features/strava/hooks/useStrava'
import { stravaActivitiesApi } from '@/features/strava/services/stravaActivitiesApi'
import { useUserTier } from '@/features/subscription'

const AVATAR_CACHE_KEY = 'runmind_avatar_url'
const AVATAR_NAME_KEY = 'runmind_avatar_name'

const TIER_DISPLAY_NAMES: Record<'free' | 'pro' | 'premium', string> = {
  free: 'Free',
  pro: 'Pro',
  premium: 'Premium',
}

export interface UserProfileData {
  name: string
  avatarUrl: string | null
  plan: string
  tier: 'free' | 'pro' | 'premium'
  isLoading: boolean
}

export function useUserProfile(): UserProfileData {
  const { profile, username } = useAuth()
  const { isConnected } = useStrava()
  const { tier, isLoading: tierLoading } = useUserTier()
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null)
  const [stravaName, setStravaName] = useState<string | null>(null)
  const [isLoadingAvatar, setIsLoadingAvatar] = useState(false)

  // Load cached avatar on mount
  useEffect(() => {
    if (typeof window === 'undefined') return
    const cached = localStorage.getItem(AVATAR_CACHE_KEY)
    const cachedName = localStorage.getItem(AVATAR_NAME_KEY)
    if (cached) setAvatarUrl(cached)
    if (cachedName) setStravaName(cachedName)
  }, [])

  // Fetch from Strava when connected
  useEffect(() => {
    if (!isConnected) return

    const cached = localStorage.getItem(AVATAR_CACHE_KEY)
    if (cached) return // Already have it

    setIsLoadingAvatar(true)
    stravaActivitiesApi.getAthleteProfile()
      .then((athlete) => {
        if (athlete.profile_medium) {
          setAvatarUrl(athlete.profile_medium)
          localStorage.setItem(AVATAR_CACHE_KEY, athlete.profile_medium)
        }
        if (athlete.firstname) {
          const fullName = [athlete.firstname, athlete.lastname].filter(Boolean).join(' ')
          setStravaName(fullName)
          localStorage.setItem(AVATAR_NAME_KEY, fullName)
        }
      })
      .catch((err) => {
        console.error('Error fetching Strava profile:', err)
      })
      .finally(() => setIsLoadingAvatar(false))
  }, [isConnected])

  // Clear cache when Strava disconnects
  useEffect(() => {
    if (!isConnected && avatarUrl) {
      localStorage.removeItem(AVATAR_CACHE_KEY)
      localStorage.removeItem(AVATAR_NAME_KEY)
      setAvatarUrl(null)
      setStravaName(null)
    }
  }, [isConnected, avatarUrl])

  const name = stravaName || profile?.firstName || username || ''

  return {
    name,
    avatarUrl,
    plan: TIER_DISPLAY_NAMES[tier],
    tier,
    isLoading: isLoadingAvatar || tierLoading,
  }
}
