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
        <svg width="22" height="22" viewBox="0 0 80 80" fill="none">
          <circle cx="40" cy="40" r="40" fill="#00F048"/>
          <path d="M22 58L22 22L44 22C54 22 62 29.5 62 38.5C62 47.5 54 55 44 55L22 55" stroke="white" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M42 55L62 65" stroke="white" strokeWidth="6" strokeLinecap="round"/>
        </svg>
        <span className="font-display font-bold text-[14px] text-foreground tracking-tight">runmind</span>
      </div>
    </header>
  )
}
