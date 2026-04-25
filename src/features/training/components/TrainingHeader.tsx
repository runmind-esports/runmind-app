'use client'

import { ArrowLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'

export function TrainingHeader() {
  const router = useRouter()

  return (
    <header className="flex h-14 items-center border-b border-border bg-background px-4">
      <div className="flex items-center gap-2">
        <button
          onClick={() => router.push('/chat')}
          className="flex min-h-[44px] min-w-[44px] items-center justify-center text-foreground-muted hover:text-foreground"
          aria-label="Voltar ao chat"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <h1 className="font-display text-lg font-bold text-foreground tracking-tight">
          Progressão
        </h1>
      </div>
    </header>
  )
}
