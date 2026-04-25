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
  center?: boolean
}

const tabs: Tab[] = [
  { id: 'dashboard', label: 'Dashboard', href: '/training', icon: LayoutDashboard },
  { id: 'week', label: 'Semana', href: '/training/week', icon: Calendar, center: true },
  { id: 'history', label: 'Histórico', href: '/training/history', icon: History },
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
      className="fixed bottom-0 left-0 right-0 z-40"
      style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
    >
      <div className="relative mx-3 mb-2 flex items-end justify-around rounded-2xl bg-background/80 backdrop-blur-xl border border-border shadow-[0_-4px_24px_rgba(0,0,0,0.06)] dark:shadow-[0_-4px_24px_rgba(0,0,0,0.3)]">
        {tabs.map((tab) => {
          const active = isTabActive(tab.href, pathname)
          const Icon = tab.icon

          if (tab.center) {
            return (
              <button
                key={tab.id}
                onClick={() => router.push(tab.href)}
                className="relative -top-4 flex flex-col items-center"
                aria-current={active ? 'page' : undefined}
                aria-label={tab.label}
              >
                <div
                  className={cn(
                    'flex h-14 w-14 items-center justify-center rounded-full shadow-lg transition-all duration-200',
                    active
                      ? 'bg-accent text-background shadow-[0_4px_16px_rgba(0,240,72,0.4)]'
                      : 'bg-background-secondary text-foreground-muted border border-border shadow-md'
                  )}
                >
                  <Icon className="h-6 w-6" />
                </div>
                <span
                  className={cn(
                    'mt-1 text-[10px] font-semibold transition-colors',
                    active ? 'text-accent' : 'text-foreground-muted'
                  )}
                >
                  {tab.label}
                </span>
              </button>
            )
          }

          return (
            <button
              key={tab.id}
              onClick={() => router.push(tab.href)}
              className="flex flex-1 flex-col items-center justify-center gap-1 py-3"
              aria-current={active ? 'page' : undefined}
              aria-label={tab.label}
            >
              <div
                className={cn(
                  'flex items-center justify-center rounded-full px-4 py-1.5 transition-all duration-200',
                  active && 'bg-accent/12'
                )}
              >
                <Icon
                  className={cn(
                    'h-5 w-5 transition-colors',
                    active ? 'text-accent' : 'text-foreground-muted'
                  )}
                />
              </div>
              <span
                className={cn(
                  'text-[10px] font-semibold transition-colors',
                  active ? 'text-accent' : 'text-foreground-muted'
                )}
              >
                {tab.label}
              </span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}
