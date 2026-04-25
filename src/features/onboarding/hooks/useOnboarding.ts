'use client'

import { useState, useCallback, useMemo } from 'react'
import { tokenStorage } from '@/shared/lib/apiClient'
import { onboardingApi } from '../services/onboardingApi'
import type { SaveProfileRequest } from '../types/onboarding.types'

// Question keys mapped to step indices (1-10)
const QUESTION_KEYS = [
  'goal',           // Q1 - step 1
  'fitness',        // Q2 - step 2
  'running',        // Q3 - step 3
  'raced',          // Q4 - step 4
  'pace',           // Q5 - step 5
  'days',           // Q6 - step 6
  'otherActivities',// Q7 - step 7
  'injury',         // Q8 - step 8
  'preference',     // Q9 - step 9
  'strength',       // Q10 - step 10
] as const

type AnswerValue = string | boolean | number | null
type Answers = Record<string, AnswerValue>

function getInitialUserName(): string {
  const stored = tokenStorage.getUsername()
  if (!stored) return ''
  if (stored.includes('@')) {
    return stored.split('@')[0]
  }
  return stored
}

function mapAnswersToRequest(answers: Answers, userName: string): SaveProfileRequest {
  // fitnessLevel: map number 1-2 to beginner, 3 to intermediate, 4-5 to advanced
  const fitnessValue = answers.fitness as number
  let fitnessLevel = 'beginner'
  if (fitnessValue === 3) fitnessLevel = 'intermediate'
  else if (fitnessValue >= 4) fitnessLevel = 'advanced'

  // weeklyKmCapacity: map string keys to midpoints
  const weeklyKmMap: Record<string, number> = {
    upTo5: 2.5,
    upTo10: 7.5,
    '11to20': 15.5,
    '21to30': 25.5,
    over30: 40.0,
  }
  const weeklyKmCapacity = answers.running === false
    ? 0
    : weeklyKmMap[answers.weeklyKm as string] ?? 0

  // pace5kSeconds: map string keys to seconds
  const paceMap: Record<string, number> = {
    dontKnow: 0,
    above7: 450,
    '6to7': 390,
    '5to6': 330,
    below5: 270,
  }
  const pace5kSeconds = paceMap[answers.pace as string] ?? 0

  // preferredDays: map string keys to day arrays
  const daysMap: Record<string, string[]> = {
    '2days': ['tuesday', 'thursday'],
    '3days': ['monday', 'wednesday', 'friday'],
    '4days': ['monday', 'tuesday', 'thursday', 'saturday'],
    '5plus': ['monday', 'tuesday', 'wednesday', 'thursday', 'saturday'],
  }
  const preferredDays = daysMap[answers.days as string] ?? []

  // trainingPreference: map UI keys to API values
  const preferenceMap: Record<string, string> = {
    shortIntense: 'short_intense',
    longModerate: 'long_moderate',
    any: 'any',
  }
  const trainingPreference = preferenceMap[answers.preference as string] ?? 'any'

  return {
    goals: [answers.goal as string],
    fitnessLevel,
    weeklyKmCapacity,
    hasRacedBefore: answers.raced as boolean,
    pace5kSeconds,
    preferredDays,
    otherActivities: { active: answers.otherActivities as boolean },
    injuriesHistory: { hasInjury: answers.injury as boolean },
    trainingPreference,
    includeStrengthTraining: answers.strength as boolean,
  }
}

export function useOnboarding() {
  const [currentStep, setCurrentStep] = useState(0)
  const [direction, setDirection] = useState<'forward' | 'backward'>('forward')
  const [answers, setAnswers] = useState<Answers>({})
  const [userName, setUserName] = useState(getInitialUserName)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [showSuccess, setShowSuccess] = useState(false)

  const totalQuestions = 10
  const isLastQuestion = currentStep === 10

  const canProceed = useMemo(() => {
    if (currentStep === 0) {
      return userName.trim().length > 0
    }
    const questionKey = QUESTION_KEYS[currentStep - 1]
    const answer = answers[questionKey]
    if (answer === null || answer === undefined) return false

    // Q3 (running): if yes, also require weeklyKm
    if (questionKey === 'running' && answer === true) {
      return answers.weeklyKm !== null && answers.weeklyKm !== undefined
    }

    return true
  }, [currentStep, userName, answers])

  const submitProfile = useCallback(async () => {
    setIsSubmitting(true)
    setSubmitError(null)
    try {
      const request = mapAnswersToRequest(answers, userName)
      const response = await onboardingApi.saveProfile(request)
      return response
    } catch (error) {
      console.error('Error saving profile:', error)
      setSubmitError('Erro ao salvar perfil. Tente novamente.')
      setIsSubmitting(false)
      return undefined
    }
  }, [answers, userName])

  const goNext = useCallback(async () => {
    if (currentStep === 10) {
      const result = await submitProfile()
      if (result) {
        setShowSuccess(true)
      }
      return
    }
    setDirection('forward')
    setCurrentStep((prev) => Math.min(prev + 1, 10))
  }, [currentStep, submitProfile])

  const goBack = useCallback(() => {
    if (currentStep === 0) return
    setDirection('backward')
    setCurrentStep((prev) => prev - 1)
  }, [currentStep])

  const setAnswer = useCallback((key: string, value: AnswerValue) => {
    setAnswers((prev) => {
      const next = { ...prev, [key]: value }
      // Q3: when running is set to false, clear weeklyKm
      if (key === 'running' && value === false) {
        delete next.weeklyKm
      }
      return next
    })
  }, [])

  const confirmName = useCallback((name: string) => {
    setUserName(name)
    setDirection('forward')
    setCurrentStep(1)
  }, [])

  return {
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
    showSuccess,
    confirmName,
    submitProfile,
  }
}
