export const translations = {
  ptBR: {
    buttonLabel: 'Conversar no WhatsApp',
    qrInstruction: 'Aponte a câmera do celular pro QR code pra abrir o WhatsApp',
    loading: 'Gerando link...',
    errorGeneric: 'Não foi possível gerar o link agora. Tente novamente em instantes.',
    errorRateLimited: 'Muitos links gerados. Tente em alguns minutos.',
    errorUnavailable: 'WhatsApp temporariamente indisponível. Tente em instantes.',
  },
  en: {
    buttonLabel: 'Chat on WhatsApp',
    qrInstruction: 'Scan with your phone camera to open WhatsApp',
    loading: 'Generating link...',
    errorGeneric: 'Could not generate the link right now. Please try again shortly.',
    errorRateLimited: 'Too many links generated. Try again in a few minutes.',
    errorUnavailable: 'WhatsApp temporarily unavailable. Try again shortly.',
  },
}

export type WhatsAppCtaTranslations = typeof translations.ptBR

/**
 * Returns the static pt-BR dictionary by design: the authenticated app shell
 * does not yet expose a LanguageProvider, so we mirror the same signature
 * used by other features (see src/features/onboarding/i18n/translations.ts).
 * When a global locale context is added, swap the body to honor it.
 */
export function getTranslations(): WhatsAppCtaTranslations {
  return translations.ptBR
}