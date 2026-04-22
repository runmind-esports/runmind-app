import type { translations } from './translations'

export type Locale = keyof typeof translations
export type TranslationKeys = (typeof translations)['pt-BR']
