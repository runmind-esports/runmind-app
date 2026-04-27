'use client'

import { ArrowLeft } from 'lucide-react'
import { useRouter, usePathname } from 'next/navigation'

export function TrainingHeader() {
  const router = useRouter()
  const pathname = usePathname()

  const title = pathname?.startsWith('/training/history') ? 'Atividades' : 'Progresso'

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
        <img src="/brand/runmind-logo.svg" alt="Runmind" width={22} height={22} />
        <span className="font-display font-bold text-sm text-foreground tracking-tight">{title}</span>
      </div>
    </header>
  )
}
