'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Link2, CreditCard, Zap, CheckCircle2, X, LogOut } from 'lucide-react'
import { cn } from '@/lib/utils'
import { IntegrationsSection } from '@/features/settings/components/IntegrationsSection'
import { PlansSection } from '@/features/settings/components/PlansSection'
import { ConsumptionSection } from '@/features/runPoints/components/ConsumptionSection'
import { useUserTier } from '@/features/subscription'
import { useAuth } from '@/features/auth/hooks/useAuth'

const TABS = [
  { id: 'integrations', label: 'Integrações', icon: Link2 },
  { id: 'plans', label: 'Planos', icon: CreditCard },
  { id: 'consumption', label: 'Consumo', icon: Zap },
] as const

type TabId = typeof TABS[number]['id']

function SettingsContent() {
  const [activeTab, setActiveTab] = useState<TabId>('integrations')
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const searchParams = useSearchParams()
  const router = useRouter()
  const { invalidateTier } = useUserTier()
  const { logout } = useAuth()

  useEffect(() => {
    const subscription = searchParams.get('subscription')
    if (subscription === 'success') {
      invalidateTier()
      setShowSuccessModal(true)
      setActiveTab('plans')
      window.history.replaceState({}, '', '/settings')
    } else if (subscription === 'cancelled') {
      window.history.replaceState({}, '', '/settings')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams])

  return (
    <div className="min-h-screen bg-background">
      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="relative mx-4 w-full max-w-sm bg-background-secondary rounded-2xl border border-border p-8 text-center animate-in zoom-in-95 fade-in duration-300">
            <button
              onClick={() => setShowSuccessModal(false)}
              className="absolute top-4 right-4 text-foreground-muted hover:text-foreground transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 rounded-full bg-green-500/15 flex items-center justify-center animate-in zoom-in-50 duration-500">
                <CheckCircle2 className="w-10 h-10 text-green-400" />
              </div>
            </div>

            <h2 className="font-display font-bold text-xl text-foreground mb-2">
              Assinatura ativada!
            </h2>
            <p className="text-sm text-foreground-muted mb-6">
              Seu plano foi atualizado com sucesso.
            </p>

            <div className="flex flex-col gap-3">
              <button
                onClick={() => router.push('/chat')}
                className="w-full px-4 py-2.5 rounded-full bg-accent text-background text-sm font-bold hover:bg-accent/90 transition-colors"
              >
                Voltar ao chat
              </button>
              <button
                onClick={() => setShowSuccessModal(false)}
                className="w-full px-4 py-2.5 rounded-full bg-background-tertiary text-foreground text-sm font-bold hover:bg-background-tertiary/80 transition-colors"
              >
                Ver meu plano
              </button>
            </div>
          </div>
        </div>
      )}

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
          <button
            onClick={logout}
            className="flex items-center gap-1.5 text-foreground-muted hover:text-red-400 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span className="text-sm font-medium">Sair</span>
          </button>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-2xl mx-auto px-4 py-6">
        <div className="mb-5">
          <h1 className="font-display font-bold text-[22px] text-foreground tracking-tight">
            Configurações
          </h1>
        </div>

        {/* Tabs — horizontal scroll on mobile */}
        <div className="overflow-x-auto -mx-4 px-4 mb-6 scrollbar-hide">
          <div className="flex gap-2 w-max">
            {TABS.map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    'flex items-center gap-1.5 px-3.5 py-2 rounded-full text-[12px] font-bold transition-all whitespace-nowrap',
                    activeTab === tab.id
                      ? 'bg-foreground text-background'
                      : 'bg-background-secondary text-foreground-muted'
                  )}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {tab.label}
                </button>
              )
            })}
          </div>
        </div>

        {/* Section content */}
        <div>
          {activeTab === 'integrations' && <IntegrationsSection />}
          {activeTab === 'plans' && <PlansSection />}
          {activeTab === 'consumption' && <ConsumptionSection />}
        </div>

      </main>
    </div>
  )
}

export default function SettingsPage() {
  return (
    <Suspense>
      <SettingsContent />
    </Suspense>
  )
}
