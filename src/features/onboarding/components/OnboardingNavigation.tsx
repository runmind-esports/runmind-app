'use client'

import { getTranslations } from '../i18n/translations'

export function OnboardingNavigation({
  onBack,
  onNext,
  isFirst,
  isLast,
  isSubmitting,
  canProceed,
}: {
  onBack: () => void
  onNext: () => void
  isFirst: boolean
  isLast: boolean
  isSubmitting: boolean
  canProceed: boolean
}) {
  const t = getTranslations()

  return (
    <div
      className="flex items-center justify-between mt-auto pb-8"
      onKeyDown={(e) => {
        if (e.key === 'Enter' && canProceed && !isSubmitting) onNext()
      }}
    >
      {isFirst ? (
        <div />
      ) : (
        <button
          type="button"
          onClick={onBack}
          className="text-[#6B7088] font-bold font-display text-sm tracking-tight active:motion-safe:animate-button-press"
        >
          {t.navigation.back}
        </button>
      )}

      {isLast ? (
        <button
          type="button"
          onClick={onNext}
          disabled={!canProceed || isSubmitting}
          className={`rounded-xl py-4 font-bold font-display text-sm tracking-tight min-w-[160px] transition-all ${
            !canProceed || isSubmitting
              ? 'bg-[#00F048]/50 text-[#14162E]/50 cursor-not-allowed'
              : 'bg-[#00F048] text-[#14162E] hover:-translate-y-px hover:shadow-lg active:motion-safe:animate-button-press'
          }`}
        >
          {isSubmitting ? t.states.submitting : t.navigation.submit}
        </button>
      ) : (
        <button
          type="button"
          onClick={onNext}
          disabled={!canProceed}
          className={`rounded-xl py-4 font-bold font-display text-sm tracking-tight min-w-[140px] transition-all ${
            !canProceed
              ? 'bg-[#14162E]/50 text-white/50 cursor-not-allowed'
              : 'bg-[#14162E] text-white hover:-translate-y-px hover:shadow-lg active:motion-safe:animate-button-press'
          }`}
        >
          {t.navigation.next}
        </button>
      )}
    </div>
  )
}
