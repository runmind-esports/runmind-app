'use client'
import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'
import { translations } from '../i18n/translations'
import type { Locale, TranslationKeys } from '../i18n/types'

type LanguageContextType = {
  locale: Locale
  setLocale: (locale: Locale) => void
  t: TranslationKeys
}

const LanguageContext = createContext<LanguageContextType | null>(null)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(() => {
    if (typeof document !== 'undefined') {
      const cookie = document.cookie
        .split('; ')
        .find(row => row.startsWith('runmind_locale='))
      return (cookie?.split('=')[1] as Locale) || 'pt-BR'
    }
    return 'pt-BR'
  })

  const setLocale = useCallback((newLocale: Locale) => {
    setLocaleState(newLocale)
    document.cookie = `runmind_locale=${newLocale};path=/;max-age=31536000`
  }, [])

  return (
    <LanguageContext.Provider value={{ locale, setLocale, t: translations[locale] }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const ctx = useContext(LanguageContext)
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider')
  return ctx
}
