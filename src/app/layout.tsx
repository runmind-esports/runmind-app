import type { Metadata } from 'next'
import { ThemeProvider } from '@/shared/providers/ThemeProvider'
import { QueryProvider } from '@/shared/providers/QueryProvider'
import './globals.css'

export const metadata: Metadata = {
  title: 'Runmind - Seu Treinador de Corrida com IA',
  description: 'Assistente inteligente para corredores',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR" className="dark" suppressHydrationWarning>
      <body className="antialiased">
        <QueryProvider>
          <ThemeProvider>
            {children}
          </ThemeProvider>
        </QueryProvider>
      </body>
    </html>
  )
}
