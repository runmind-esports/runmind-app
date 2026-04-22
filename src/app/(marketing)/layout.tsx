import type { Metadata } from 'next'
import { LanguageProvider } from '@/features/landing/hooks/useLanguage'

export const metadata: Metadata = {
  title: 'RunMind - Seu Coach de Corrida com IA',
  description: 'Treinamento de elite acessivel. Planilhas personalizadas, coach IA 24/7, sincronizacao com Strava e Garmin.',
}

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <LanguageProvider>
      {children}
    </LanguageProvider>
  )
}
