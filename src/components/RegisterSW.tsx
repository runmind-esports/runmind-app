'use client'

import { useEffect } from 'react'
import '@/shared/lib/pwaInstall'

export function RegisterSW() {
  useEffect(() => {
    if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
      return
    }

    navigator.serviceWorker
      .register('/sw.js', { scope: '/' })
      .catch((err) => console.error('SW registration failed:', err))
  }, [])

  return null
}
