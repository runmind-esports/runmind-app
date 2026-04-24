'use client'

import { usePathname, useRouter } from 'next/navigation'
import { LayoutDashboard, Calendar, History } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { LucideIcon } from 'lucide-react'

interface Tab {
  id: string
  label: string
  href: string
  icon: LucideIcon
}

const tabs: Tab[] = [
  { id: 'dashboard', label: 'Dashboard', href: '/training', icon: LayoutDashboard },
  { id: 'week', label: 'Semana', href: '/training/week', icon: Calendar },
  { id: 'history', label: 'Historico', href: '/training/history', icon: History },
]

function isTabActive(tabHref: string, pathname: string): boolean {
  if (tabHref === '/training') {
    return pathname === '/training'
  }
  return pathname.startsWith(tabHref)
}

export function BottomTabs() {
  const pathname = usePathname()
  const router = useRouter()

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-40 border-t border-border bg-background"
      style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
    >
      <div className="flex min-h-[56px]">
        {tabs.map((tab) => {
          const active = isTabActive(tab.href, pathname)
          const Icon = tab.icon

          return (
            <button
              key={tab.id}
              onClick={() => router.push(tab.href)}
              className={cn(
                'flex flex-1 flex-col items-center justify-center gap-1 py-2',
                active ? 'text-accent' : 'text-muted-foreground'
              )}
              aria-current={active ? 'page' : undefined}
              aria-label={tab.label}
            >
              <Icon className="h-6 w-6" />
              <span className="text-xs">{tab.label}</span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}
