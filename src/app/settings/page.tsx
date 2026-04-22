'use client'

import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { IntegrationsSection } from '@/features/settings/components/IntegrationsSection'

function RunmindLogo() {
  return (
    <svg width="26" height="26" viewBox="0 0 80 80" fill="none">
      <circle cx="40" cy="40" r="40" fill="#00F048"/>
      <path d="M22 58L22 22L44 22C54 22 62 29.5 62 38.5C62 47.5 54 55 44 55L22 55" stroke="white" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M42 55L62 65" stroke="white" strokeWidth="6" strokeLinecap="round"/>
    </svg>
  )
}

export default function SettingsPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-background border-b border-border">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center gap-4">
          <Link
            href="/chat"
            className="flex items-center gap-2 text-foreground-muted hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="text-sm font-medium">Voltar</span>
          </Link>
          <div className="flex-1" />
          <Link href="/" className="flex items-center gap-2">
            <RunmindLogo />
            <span className="font-display font-bold text-[14px] text-foreground tracking-tight">
              runmind
            </span>
          </Link>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-2xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="font-display font-bold text-[24px] text-foreground tracking-tight">
            Configuracoes
          </h1>
          <p className="text-[14px] text-foreground-muted mt-1">
            Gerencie suas preferencias e integracoes
          </p>
        </div>

        <div className="bg-background-secondary rounded-2xl border border-border p-6">
          <IntegrationsSection />
        </div>
      </main>
    </div>
  )
}
