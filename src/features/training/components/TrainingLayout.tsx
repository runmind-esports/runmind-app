'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/features/auth/hooks/useAuth'
import { cn } from '@/lib/utils'
import { TrainingHeader } from './TrainingHeader'
import { BottomTabs } from './BottomTabs'

interface TrainingLayoutProps {
  children: React.ReactNode
}

export function TrainingLayout({ children }: TrainingLayoutProps) {
  const router = useRouter()
  const { isAuthenticated, isLoading: authLoading } = useAuth()
  const [mounted, setMounted] = useState(false)

  // Auth guard: redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login')
    }
  }, [authLoading, isAuthenticated, router])

  // Fade-in animation on mount
  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 10)
    return () => clearTimeout(timer)
  }, [])

  // Show nothing while checking auth
  if (authLoading || !isAuthenticated) {
    return null
  }

  return (
    <div
      className={cn(
        'flex h-screen flex-col bg-background transition-opacity duration-300 ease-in-out',
        mounted ? 'opacity-100' : 'opacity-0'
      )}
    >
      <TrainingHeader />
      <main className="flex-1 overflow-y-auto pb-20">
        {children}
      </main>
      <BottomTabs />
    </div>
  )
}
