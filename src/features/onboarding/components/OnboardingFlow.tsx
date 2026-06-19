'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/features/auth/hooks/useAuth'
import { cn } from '@/lib/utils'
import { useOnboarding } from '../hooks/useOnboarding'
import { getTranslations } from '../i18n/translations'
import { WelcomeStep } from './WelcomeStep'
import { QuestionStep, QUESTIONS } from './QuestionStep'
import { ProgressBar } from './ProgressBar'
import { OnboardingNavigation } from './OnboardingNavigation'
import { SuccessScreen } from './SuccessScreen'

export function OnboardingFlow() {
  const router = useRouter()
  const { isAuthenticated, isLoading: authLoading } = useAuth()
  const {
    currentStep,
    direction,
    answers,
    userName,
    isSubmitting,
    submitError,
    canProceed,
    isLastQuestion,
    totalQuestions,
    goNext,
    goBack,
    setAnswer,
    confirmName,
    showSuccess,
    submitProfile,
  } = useOnboarding()
  const t = getTranslations()

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login')
    }
  }, [authLoading, isAuthenticated, router])

  if (authLoading || !isAuthenticated) return null

  if (showSuccess) {
    return <SuccessScreen />
  }

  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-lg mx-auto px-6 py-8 lg:px-8 lg:py-12 flex flex-col min-h-screen">
        {/* Header zone */}
        <div className="flex items-center justify-between">
          <span className="font-display font-bold text-sm text-[#14162E]">Runmind</span>
          {currentStep > 0 && (
            <span className="text-xs text-[#6B7088]">
              {t.navigation.progress.replace('{n}', String(currentStep))}
            </span>
          )}
        </div>
        {currentStep > 0 && <ProgressBar current={currentStep} total={totalQuestions} />}

        {/* Content zone - animated */}
        <div className="flex-1 flex flex-col justify-center">
          <div
            key={currentStep}
            className={cn(
              'motion-safe:animate-slide-in-right',
              direction === 'backward' && 'motion-safe:animate-slide-in-left'
            )}
          >
            {currentStep === 0 ? (
              <WelcomeStep name={userName} onConfirm={confirmName} />
            ) : (
              <QuestionStep
                questionIndex={currentStep - 1}
                value={(answers[QUESTIONS[currentStep - 1].key] as string | boolean | number | null) ?? null}
                onChange={setAnswer}
                conditionalValue={currentStep === 3 ? (answers.weeklyKm as string | null) : undefined}
                onConditionalChange={currentStep === 3 ? (v) => setAnswer('weeklyKm', v) : undefined}
                paceDistance={currentStep === 5 ? (answers.paceDistance as string | null) ?? null : undefined}
                onPaceDistanceChange={currentStep === 5 ? (v) => setAnswer('paceDistance', v) : undefined}
                multiValue={currentStep === 7 ? ((answers.otherActivities as string[] | undefined) ?? []) : undefined}
                onMultiChange={currentStep === 7 ? (v) => setAnswer('otherActivities', v) : undefined}
                detailsValue={currentStep === 8 ? ((answers.injuryDetails as string | undefined) ?? '') : undefined}
                onDetailsChange={currentStep === 8 ? (v) => setAnswer('injuryDetails', v) : undefined}
              />
            )}
          </div>
        </div>

        {/* Footer zone - navigation (only on question steps) */}
        {currentStep > 0 && (
          <OnboardingNavigation
            onBack={goBack}
            onNext={goNext}
            isFirst={currentStep === 1}
            isLast={isLastQuestion}
            isSubmitting={isSubmitting}
            canProceed={canProceed}
          />
        )}

        {/* Error message */}
        {submitError && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600 text-center">
            {submitError}
          </div>
        )}
      </div>
    </div>
  )
}
