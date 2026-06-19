'use client'

export type BeforeInstallPromptEvent = Event & {
  prompt(): Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

type Listener = (prompt: BeforeInstallPromptEvent | null, installed: boolean) => void

let deferredPrompt: BeforeInstallPromptEvent | null = null
let isInstalled = false
const listeners = new Set<Listener>()

function emit() {
  listeners.forEach((fn) => fn(deferredPrompt, isInstalled))
}

if (typeof window !== 'undefined') {
  isInstalled = window.matchMedia('(display-mode: standalone)').matches

  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault()
    deferredPrompt = e as BeforeInstallPromptEvent
    emit()
  })

  window.addEventListener('appinstalled', () => {
    deferredPrompt = null
    isInstalled = true
    emit()
  })
}

export function subscribePWAInstall(fn: Listener): () => void {
  listeners.add(fn)
  fn(deferredPrompt, isInstalled)
  return () => {
    listeners.delete(fn)
  }
}

export async function triggerPWAInstall(): Promise<'accepted' | 'dismissed' | 'unavailable'> {
  if (!deferredPrompt) return 'unavailable'
  await deferredPrompt.prompt()
  const { outcome } = await deferredPrompt.userChoice
  if (outcome === 'accepted') {
    deferredPrompt = null
    emit()
  }
  return outcome
}
