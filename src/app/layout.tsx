import type { Metadata } from 'next'
import { ThemeProvider } from '@/shared/providers/ThemeProvider'
import { QueryProvider } from '@/shared/providers/QueryProvider'
import { RegisterSW } from '@/components/RegisterSW'
import './globals.css'

export const metadata: Metadata = {
  title: 'Runmind - Seu Treinador de Corrida com IA',
  description: 'Assistente inteligente para corredores',
  manifest: '/manifest.json',
  themeColor: '#00F048',
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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR" className="dark" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
      </head>
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
