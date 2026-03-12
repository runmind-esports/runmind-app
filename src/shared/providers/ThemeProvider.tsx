'use client'

import { createContext, useContext } from 'react'
import { useTheme as useThemeHook } from '../hooks/useTheme'

type ThemeContextType = ReturnType<typeof useThemeHook>

const ThemeContext = createContext<ThemeContextType | null>(null)

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const theme = useThemeHook()
  return (
    <ThemeContext.Provider value={theme}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) throw new Error('useTheme must be used within ThemeProvider')
  return context
}
