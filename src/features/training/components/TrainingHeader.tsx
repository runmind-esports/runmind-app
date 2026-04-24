'use client'

import { ArrowLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'

export function TrainingHeader() {
  const router = useRouter()

  return (
    <header className="flex h-14 items-center border-b border-border bg-background px-4">
      <button
        onClick={() => router.push('/chat')}
        className="flex min-h-[44px] min-w-[44px] items-center gap-1.5 text-foreground"
        aria-label="Voltar ao chat"
      >
        <ArrowLeft className="h-5 w-5" />
        <span className="text-sm">Chat</span>
      </button>

      <h1 className="flex-1 text-center font-body text-base font-semibold text-foreground">
        Treino
      </h1>

      {/* Spacer for visual balance */}
      <div className="min-w-[44px]" />
    </header>
  )
}
