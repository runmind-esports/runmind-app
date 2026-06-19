import type { Metadata, Viewport } from 'next'
import { ThemeProvider } from '@/shared/providers/ThemeProvider'
import { QueryProvider } from '@/shared/providers/QueryProvider'
import { RegisterSW } from '@/components/RegisterSW'
import './globals.css'

export const metadata: Metadata = {
  title: 'Runmind - Seu Treinador de Corrida com IA',
  description: 'Assistente inteligente para corredores',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Runmind',
  },
  icons: {
    icon: '/icon.svg',
    apple: '/apple-icon.svg',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: '#00F048',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR" className="dark" suppressHydrationWarning>
      <body className="antialiased overflow-hidden">
        <RegisterSW />
        <QueryProvider>
          <ThemeProvider>
            {children}
          </ThemeProvider>
        </QueryProvider>
      </body>
    </html>
  )
}
