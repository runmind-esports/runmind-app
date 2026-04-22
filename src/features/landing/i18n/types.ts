import type { translations } from './translations'

export type Locale = keyof typeof translations

// Widen literal string types to string for cross-locale compatibility
type DeepWiden<T> = {
  readonly [K in keyof T]: T[K] extends string
    ? string
    : T[K] extends readonly []
      ? readonly []
      : T[K] extends readonly (infer U)[]
        ? readonly DeepWiden<U>[]
        : DeepWiden<T[K]>
}

export type TranslationKeys = DeepWiden<(typeof translations)['pt-BR']>
