'use client'

import { useEffect, useState } from 'react'
import { Download, CheckCircle2, Smartphone, X, Share, Plus } from 'lucide-react'
import { subscribePWAInstall, triggerPWAInstall, type BeforeInstallPromptEvent } from '@/shared/lib/pwaInstall'

export function InstallAppSection() {
  const [prompt, setPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [isInstalled, setIsInstalled] = useState(false)
  const [isIOS, setIsIOS] = useState(false)
  const [showIOSInstructions, setShowIOSInstructions] = useState(false)
  const [justInstalled, setJustInstalled] = useState(false)
  const [isInstalling, setIsInstalling] = useState(false)

  useEffect(() => {
    setIsIOS(/iPad|iPhone|iPod/.test(navigator.userAgent))
    let alreadyInstalled = false
    return subscribePWAInstall((p, installed) => {
      setPrompt(p)
      setIsInstalled(installed)
      if (installed && !alreadyInstalled) setJustInstalled(true)
      alreadyInstalled = installed
    })
  }, [])

  const handleInstall = async () => {
    if (prompt) {
      setIsInstalling(true)
      try {
        await triggerPWAInstall()
      } finally {
        setIsInstalling(false)
      }
      return
    }
    if (isIOS) {
      setShowIOSInstructions(true)
    }
  }

  const canTriggerInstall = !!prompt || isIOS

  return (
    <section className="space-y-4">
      <div>
        <h2 className="font-display font-bold text-lg text-foreground mb-1">
          Instalar aplicativo
        </h2>
        <p className="text-sm text-foreground-muted">
          Tenha o Runmind direto na sua tela inicial — abre rápido, em tela cheia, sem precisar buscar no navegador.
        </p>
      </div>

      {isInstalled ? (
        <AlreadyInstalledCard />
      ) : canTriggerInstall ? (
        <InstallableCard
          onInstall={handleInstall}
          isInstalling={isInstalling}
          variant={prompt ? 'prompt' : 'ios'}
        />
      ) : (
        <UnsupportedCard />
      )}

      {showIOSInstructions && <IOSInstructionsDialog onClose={() => setShowIOSInstructions(false)} />}
      {justInstalled && <InstallSuccessDialog onClose={() => setJustInstalled(false)} />}
    </section>
  )
}

function AlreadyInstalledCard() {
  return (
    <div className="p-4 rounded-2xl bg-accent/5 flex items-center gap-3">
      <div className="w-10 h-10 rounded-xl bg-accent/15 flex items-center justify-center flex-shrink-0">
        <CheckCircle2 className="w-5 h-5 text-accent" />
      </div>
      <div className="flex-1">
        <h3 className="font-display font-semibold text-sm text-foreground">
          Runmind já instalado
        </h3>
        <p className="text-xs text-foreground-muted mt-0.5">
          Você está usando o app instalado neste dispositivo.
        </p>
      </div>
    </div>
  )
}

function InstallableCard({
  onInstall,
  isInstalling,
  variant,
}: {
  onInstall: () => void
  isInstalling: boolean
  variant: 'prompt' | 'ios'
}) {
  return (
    <div className="p-5 rounded-2xl bg-background flex flex-col sm:flex-row items-start sm:items-center gap-4">
      <div className="w-12 h-12 rounded-xl bg-accent/15 flex items-center justify-center flex-shrink-0">
        <Smartphone className="w-6 h-6 text-accent" />
      </div>
      <div className="flex-1">
        <h3 className="font-display font-semibold text-sm text-foreground">
          {variant === 'prompt' ? 'Pronto pra instalar' : 'Instalar no iPhone'}
        </h3>
        <p className="text-xs text-foreground-muted mt-0.5">
          {variant === 'prompt'
            ? 'Toque em "Instalar app" e confirme no diálogo do navegador.'
            : 'Toque em "Instalar app" pra ver o passo-a-passo no Safari.'}
        </p>
      </div>
      <button
        type="button"
        onClick={onInstall}
        disabled={isInstalling}
        className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full bg-accent px-5 py-2.5 text-sm font-bold text-background transition-colors hover:bg-accent/90 disabled:opacity-50"
      >
        <Download className="w-4 h-4" />
        {isInstalling ? 'Instalando…' : 'Instalar app'}
      </button>
    </div>
  )
}

function UnsupportedCard() {
  return (
    <div className="p-5 rounded-2xl bg-background">
      <div className="flex items-start gap-3">
        <div className="w-12 h-12 rounded-xl bg-background-tertiary flex items-center justify-center flex-shrink-0">
          <Download className="w-6 h-6 text-foreground-muted" />
        </div>
        <div className="flex-1">
          <h3 className="font-display font-semibold text-sm text-foreground">
            Instale pelo menu do navegador
          </h3>
          <p className="text-xs text-foreground-muted mt-1">
            Seu navegador atual não expôs o botão de instalação direta. Abra o menu (⋮) do navegador
            e procure por <strong>&ldquo;Instalar app&rdquo;</strong> ou <strong>&ldquo;Adicionar à tela inicial&rdquo;</strong>.
          </p>
          <p className="text-xs text-foreground-muted mt-2">
            Funciona melhor no Chrome (Android/desktop), Edge e Safari (iOS).
          </p>
        </div>
      </div>
    </div>
  )
}

function IOSInstructionsDialog({ onClose }: { onClose: () => void }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
      onClick={onClose}
      role="presentation"
    >
      <div
        className="relative mx-4 w-full max-w-sm bg-background-secondary rounded-2xl border border-border p-6 animate-in zoom-in-95 fade-in duration-300"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="ios-instructions-title"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-foreground-muted hover:text-foreground transition-colors"
          aria-label="Fechar"
        >
          <X className="w-5 h-5" />
        </button>
        <h3 id="ios-instructions-title" className="font-display font-bold text-lg text-foreground mb-4">
          Adicionar à Tela de Início
        </h3>
        <ol className="space-y-3 text-sm text-foreground mb-6">
          <li className="flex items-start gap-2">
            <span className="font-bold text-accent">1.</span>
            <span className="flex-1 flex items-center gap-1.5 flex-wrap">
              Toque no ícone <Share className="w-4 h-4 inline" /> Compartilhar
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="font-bold text-accent">2.</span>
            <span className="flex-1 flex items-center gap-1.5 flex-wrap">
              Escolha <Plus className="w-4 h-4 inline" /> <strong>Adicionar à Tela de Início</strong>
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="font-bold text-accent">3.</span>
            <span className="flex-1">
              Toque em <strong>Adicionar</strong> no canto superior direito
            </span>
          </li>
        </ol>
        <button
          type="button"
          onClick={onClose}
          className="w-full px-4 py-2.5 rounded-full bg-accent text-background text-sm font-bold hover:bg-accent/90 transition-colors"
        >
          Entendi
        </button>
      </div>
    </div>
  )
}

function InstallSuccessDialog({ onClose }: { onClose: () => void }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={onClose} role="presentation">
      <div
        className="relative mx-4 w-full max-w-sm bg-background-secondary rounded-2xl border border-border p-8 text-center animate-in zoom-in-95 fade-in duration-300"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="install-success-title"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-foreground-muted hover:text-foreground transition-colors"
          aria-label="Fechar"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 rounded-full bg-green-500/15 flex items-center justify-center animate-in zoom-in-50 duration-500">
            <CheckCircle2 className="w-10 h-10 text-green-400" />
          </div>
        </div>

        <h2 id="install-success-title" className="font-display font-bold text-xl text-foreground mb-2">
          App instalado!
        </h2>
        <p className="text-sm text-foreground-muted mb-6">
          O Runmind agora está na sua tela inicial. Pode fechar essa janela e abrir pelo ícone do app.
        </p>

        <button
          onClick={onClose}
          className="w-full px-4 py-2.5 rounded-full bg-accent text-background text-sm font-bold hover:bg-accent/90 transition-colors"
        >
          Entendi
        </button>
      </div>
    </div>
  )
}
