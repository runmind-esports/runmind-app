'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Link2, CreditCard } from 'lucide-react'
import { cn } from '@/lib/utils'
import { IntegrationsSection } from '@/features/settings/components/IntegrationsSection'
import { PlansSection } from '@/features/settings/components/PlansSection'

const TABS = [
  { id: 'integrations', label: 'Integrações', icon: Link2 },
  { id: 'plans', label: 'Planos', icon: CreditCard },
] as const

type TabId = typeof TABS[number]['id']

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<TabId>('integrations')

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
            <img src="/brand/runmind-logo.svg" alt="Runmind" width={26} height={26} />
            <span className="font-display font-bold text-[14px] text-foreground tracking-tight">
              runmind
            </span>
          </Link>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-2xl mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="font-display font-bold text-[24px] text-foreground tracking-tight">
            Configurações
          </h1>
          <p className="text-[14px] text-foreground-muted mt-1">
            Gerencie suas preferências e integrações
          </p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          {TABS.map((tab) => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  'flex items-center gap-2 px-4 py-2.5 rounded-full text-[13px] font-bold transition-all',
                  activeTab === tab.id
                    ? 'bg-foreground text-background'
                    : 'bg-background-secondary border border-border text-foreground-muted hover:text-foreground'
                )}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            )
          })}
        </div>

        {/* Section content */}
        <div className="bg-background-secondary rounded-2xl border border-border p-6">
          {activeTab === 'integrations' && <IntegrationsSection />}
          {activeTab === 'plans' && <PlansSection />}
        </div>
      </main>
    </div>
  )
}
