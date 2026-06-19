'use client'

import { useCallback, useEffect, useState } from 'react'

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[]
  readonly userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>
  prompt(): Promise<void>
}

function DownloadIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d="M8 2.5 V10.5 M4.5 7 L8 10.5 L11.5 7 M3 13 H13"
        stroke="#14162E"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function ShareIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d="M8 10 V2.5 M5 5.5 L8 2.5 L11 5.5 M3.5 9 V13 H12.5 V9"
        stroke="#14162E"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function InstallPWAButton() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [canInstall, setCanInstall] = useState(false)
  const [isIOS, setIsIOS] = useState(false)
  const [isStandalone, setIsStandalone] = useState(false)
  const [showIOSModal, setShowIOSModal] = useState(false)

  // Detect environment on mount + capture beforeinstallprompt
  useEffect(() => {
    if (typeof window === 'undefined') return

    const ua = navigator.userAgent
    const iOSDetected = /iPad|iPhone|iPod/.test(ua) && !(window as unknown as { MSStream?: unknown }).MSStream
    const standaloneDetected =
      window.matchMedia('(display-mode: standalone)').matches ||
      (navigator as unknown as { standalone?: boolean }).standalone === true

    setIsIOS(iOSDetected)
    setIsStandalone(standaloneDetected)

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e as BeforeInstallPromptEvent)
      setCanInstall(true)
    }

    const handleAppInstalled = () => {
      setCanInstall(false)
      setDeferredPrompt(null)
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    window.addEventListener('appinstalled', handleAppInstalled)

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
      window.removeEventListener('appinstalled', handleAppInstalled)
    }
  }, [])

  // Escape key closes iOS modal
  useEffect(() => {
    if (!showIOSModal) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setShowIOSModal(false)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [showIOSModal])

  const handleInstallClick = useCallback(async () => {
    if (deferredPrompt) {
      try {
        await deferredPrompt.prompt()
        await deferredPrompt.userChoice
      } catch (err) {
        console.error('PWA install prompt failed:', err)
      } finally {
        setDeferredPrompt(null)
        setCanInstall(false)
      }
      return
    }

    if (isIOS) {
      setShowIOSModal(true)
    }
  }, [deferredPrompt, isIOS])

  // Hide button when already installed/standalone
  if (isStandalone) return null

  // Hide button when neither install prompt is available nor iOS
  if (!canInstall && !isIOS) return null

  return (
    <>
      <button
        type="button"
        onClick={handleInstallClick}
        aria-label="Instalar app Runmind"
        className="inline-flex items-center justify-center gap-2 rounded-full border-[1.5px] border-[rgba(20,22,46,0.08)] px-5 sm:px-6 py-3.5 sm:py-4 text-[14px] sm:text-[15px] font-semibold text-[#14162E] transition-all hover:border-[#14162E] hover:bg-[#F5F6F7]"
      >
        <DownloadIcon />
        Instalar app
      </button>

      {showIOSModal && (
        <div
          className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4"
          onClick={() => setShowIOSModal(false)}
          role="presentation"
        >
          <div
            className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="install-modal-title"
          >
            <h3
              id="install-modal-title"
              className="font-display font-bold text-[18px] text-[#14162E] mb-4"
            >
              Adicionar à Tela de Início
            </h3>
            <ol className="space-y-3 text-[14px] text-[#14162E] mb-6">
              <li className="flex items-start gap-2">
                <span className="font-bold mr-1">1.</span>
                <span className="flex-1">
                  Toque no ícone de Compartilhar{' '}
                  <span className="inline-flex align-middle ml-1">
                    <ShareIcon />
                  </span>
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold mr-1">2.</span>
                <span className="flex-1">
                  Role para baixo e escolha <strong>Adicionar à Tela de Início</strong>
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold mr-1">3.</span>
                <span className="flex-1">
                  Toque em <strong>Adicionar</strong> no canto superior direito
                </span>
              </li>
            </ol>
            <button
              type="button"
              onClick={() => setShowIOSModal(false)}
              className="w-full rounded-full bg-[#00F048] text-[#14162E] font-bold px-6 py-3 transition-all hover:-translate-y-0.5"
            >
              Entendi
            </button>
          </div>
        </div>
      )}
    </>
  )
}
