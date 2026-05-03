'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export function DeepLinkListener() {
  const router = useRouter()

  useEffect(() => {
    const setupListener = async () => {
      try {
        const { App } = await import('@capacitor/app')
        const { Capacitor } = await import('@capacitor/core')

        if (!Capacitor.isNativePlatform()) return

        App.addListener('appUrlOpen', (event) => {
          const url = new URL(event.url)
          const path = url.pathname + url.search
          if (path) {
            router.replace(path)
          }
        })
      } catch {
        // Not running in Capacitor — ignore
      }
    }

    setupListener()
  }, [router])

  return null
}
