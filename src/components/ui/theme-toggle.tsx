'use client'

import { Sun, Moon } from 'lucide-react'
import { useTheme } from '@/shared/providers/ThemeProvider'

export function ThemeToggle() {
  const { theme, toggleTheme, mounted } = useTheme()

  if (!mounted) return null

  return (
    <button
      onClick={toggleTheme}
      className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-foreground-muted hover:bg-background-secondary hover:text-foreground transition-colors"
    >
      {theme === 'dark' ? (
        <>
          <Sun className="h-4 w-4" />
          <span className="text-sm">Tema claro</span>
        </>
      ) : (
        <>
          <Moon className="h-4 w-4" />
          <span className="text-sm">Tema escuro</span>
        </>
      )}
    </button>
  )
}
