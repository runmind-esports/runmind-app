'use client'

import { usePathname, useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'

interface Tab {
  id: string
  label: string
  href: string
}

const tabs: Tab[] = [
  { id: 'dashboard', label: 'Dashboard', href: '/training' },
  { id: 'week', label: 'Semana', href: '/training/week' },
  { id: 'history', label: 'Histórico', href: '/training/history' },
]

function isTabActive(tabHref: string, pathname: string): boolean {
  if (tabHref === '/training') {
    return pathname === '/training'
  }
  return pathname.startsWith(tabHref)
}

export function TrainingTabs() {
  const pathname = usePathname()
  const router = useRouter()

  return (
    <div className="shrink-0 border-b border-border px-4">
      <div className="flex gap-1 max-w-lg mx-auto">
        {tabs.map((tab) => {
          const active = isTabActive(tab.href, pathname)

          return (
            <button
              key={tab.id}
              onClick={() => router.push(tab.href)}
              className={cn(
                'relative flex-1 py-2.5 text-xs font-semibold transition-colors',
                active ? 'text-accent' : 'text-foreground-muted hover:text-foreground'
              )}
              aria-current={active ? 'page' : undefined}
            >
              {tab.label}
              {active && (
                <div className="absolute bottom-0 left-2 right-2 h-0.5 rounded-full bg-accent" />
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}
