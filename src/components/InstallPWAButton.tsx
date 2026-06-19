'use client'

import { useEffect, useState } from 'react'

type BeforeInstallPromptEvent = Event & {
  prompt(): Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

export function InstallPWAButton() {
  const [prompt, setPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [isIOS, setIsIOS] = useState(false)
  const [isStandalone, setIsStandalone] = useState(false)
  const [showIOSModal, setShowIOSModal] = useState(false)

  useEffect(() => {
    setIsIOS(/iPad|iPhone|iPod/.test(navigator.userAgent))
    setIsStandalone(window.matchMedia('(display-mode: standalone)').matches)

    const onPrompt = (e: Event) => {
      e.preventDefault()
      setPrompt(e as BeforeInstallPromptEvent)
    }
    const onInstalled = () => setPrompt(null)

    window.addEventListener('beforeinstallprompt', onPrompt)
    window.addEventListener('appinstalled', onInstalled)
    return () => {
      window.removeEventListener('beforeinstallprompt', onPrompt)
      window.removeEventListener('appinstalled', onInstalled)
    }
  }, [])

  if (isStandalone) return null
  if (!prompt && !isIOS) return null

  const handleInstall = async () => {
    if (prompt) {
      await prompt.prompt()
      await prompt.userChoice
      setPrompt(null)
      return
    }
    setShowIOSModal(true)
  }

  return (
    <>
      <button
        type="button"
        onClick={handleInstall}
        aria-label="Instalar app Runmind"
        className="fixed bottom-5 right-5 z-[60] inline-flex items-center gap-2 rounded-full bg-[#14162E] pl-2 pr-5 py-2.5 text-[13px] font-bold text-white shadow-[0_8px_28px_rgba(20,22,46,0.3)] transition-all hover:-translate-y-0.5 hover:bg-[#252952]"
      >
        <span className="relative inline-flex items-center justify-center w-7 h-7 rounded-full bg-[#00F048] text-[#14162E]">
          <span className="absolute inset-0 rounded-full bg-[#00F048] animate-ping opacity-60" />
          <DownloadArrow />
        </span>
        Instalar app
      </button>

      {showIOSModal && <IOSInstructionsModal onClose={() => setShowIOSModal(false)} />}
    </>
  )
}

function DownloadArrow() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true" className="relative">
      <path
        d="M8 2.5V10.5M4.5 7L8 10.5L11.5 7M3 13H13"
        stroke="#14162E"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function IOSInstructionsModal({ onClose }: { onClose: () => void }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  return (
    <div
      className="fixed inset-0 z-[70] bg-black/60 flex items-center justify-center p-4"
      onClick={onClose}
      role="presentation"
    >
      <div
        className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="ios-install-title"
      >
        <h3
          id="ios-install-title"
          className="font-display font-bold text-[18px] text-[#14162E] mb-4"
        >
          Adicionar à Tela de Início
        </h3>
        <ol className="space-y-3 text-[14px] text-[#14162E] mb-6">
          <li><strong>1.</strong> Toque no ícone de Compartilhar na barra do Safari</li>
          <li><strong>2.</strong> Role e escolha <strong>Adicionar à Tela de Início</strong></li>
          <li><strong>3.</strong> Toque em <strong>Adicionar</strong> no canto superior direito</li>
        </ol>
        <button
          type="button"
          onClick={onClose}
          className="w-full rounded-full bg-[#00F048] text-[#14162E] font-bold px-6 py-3 transition-all hover:-translate-y-0.5"
        >
          Entendi
        </button>
      </div>
    </div>
  )
}
