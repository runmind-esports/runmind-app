'use client'

import { useState, useCallback, useMemo } from 'react'
import { tokenStorage } from '@/shared/lib/apiClient'
import { onboardingApi } from '../services/onboardingApi'
import type { SaveProfileRequest } from '../types/onboarding.types'

const QUESTION_KEYS = [
  'goal',
  'fitness',
  'running',
  'raced',
  'pace',
  'days',
  'otherActivities',
  'injury',
  'preference',
  'strength',
] as const

type AnswerValue = string | boolean | number | string[] | null
type Answers = Record<string, AnswerValue>

const PACE_DISTANCE_METERS: Record<string, number> = {
  '5k': 5000,
  '10k': 10000,
  '21k': 21097,
  '42k': 42195,
}

const PACE_SECONDS_PER_KM: Record<string, number> = {
  dontKnow: 0,
  above7: 450,
  '6to7': 390,
  '5to6': 330,
  below5: 270,
}

function paceKey5kSecondsFromAnswer(paceKey: string, distanceKey: string | null | undefined): number {
  const base = PACE_SECONDS_PER_KM[paceKey] ?? 0
  if (base === 0) return 0
  const distM = distanceKey ? PACE_DISTANCE_METERS[distanceKey] : 5000
  if (!distM || distM === 5000) return base
  // Riegel's formula: T2 = T1 * (D2/D1)^1.06 where T is total time
  // base is sec/km at distance D2; we want sec/km equivalent at 5k (D1).
  const totalAtDist = base * (distM / 1000)
  const totalAt5k = totalAtDist * Math.pow(5000 / distM, 1.06)
  return Math.round(totalAt5k / 5)
}

function getInitialUserName(): string {
  const stored = tokenStorage.getUsername()
  if (!stored) return ''
  if (stored.includes('@')) {
    return stored.split('@')[0]
  }
  return stored
}

function mapAnswersToRequest(answers: Answers): SaveProfileRequest {
  const fitnessValue = answers.fitness as number
  let fitnessLevel = 'beginner'
  if (fitnessValue === 3) fitnessLevel = 'intermediate'
  else if (fitnessValue >= 4) fitnessLevel = 'advanced'

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

  const pace5kSeconds = paceKey5kSecondsFromAnswer(
    answers.pace as string,
    answers.paceDistance as string | null,
  )

  const daysMap: Record<string, string[]> = {
    '2days': ['tuesday', 'thursday'],
    '3days': ['monday', 'wednesday', 'friday'],
    '4days': ['monday', 'tuesday', 'thursday', 'saturday'],
    '5plus': ['monday', 'tuesday', 'wednesday', 'thursday', 'saturday'],
  }
  const preferredDays = daysMap[answers.days as string] ?? []

  const preferenceMap: Record<string, string> = {
    shortIntense: 'short_intense',
    longModerate: 'long_moderate',
    any: 'any',
  }
  const trainingPreference = preferenceMap[answers.preference as string] ?? 'any'

  const otherActivitiesArr = Array.isArray(answers.otherActivities) ? (answers.otherActivities as string[]) : []
  const otherActivities = otherActivitiesArr.reduce<Record<string, boolean>>((acc, key) => {
    acc[key] = true
    return acc
  }, {})

  const injuriesHistory: Record<string, unknown> = {
    hasInjury: answers.injury === true,
  }
  if (answers.injury === true && typeof answers.injuryDetails === 'string' && answers.injuryDetails.trim()) {
    injuriesHistory.details = (answers.injuryDetails as string).trim()
  }

  return {
    goals: [answers.goal as string],
    fitnessLevel,
    weeklyKmCapacity,
    hasRacedBefore: answers.raced as boolean,
    pace5kSeconds,
    preferredDays,
    otherActivities,
    injuriesHistory,
    trainingPreference,
    includeStrengthTraining: answers.strength as boolean,
  }
}

export function useOnboarding() {
  const [currentStep, setCurrentStep] = useState(0)
  const [direction, setDirection] = useState<'forward' | 'backward'>('forward')
  const [answers, setAnswers] = useState<Answers>({ paceDistance: '5k' })
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

    if (questionKey === 'otherActivities') {
      // Multi-select: zero selections is a valid answer ("nenhuma")
      return Array.isArray(answer)
    }

    if (answer === null || answer === undefined) return false

    if (questionKey === 'running' && answer === true) {
      return answers.weeklyKm !== null && answers.weeklyKm !== undefined
    }

    if (questionKey === 'pace' && answer !== 'dontKnow') {
      return typeof answers.paceDistance === 'string' && answers.paceDistance.length > 0
    }

    if (questionKey === 'injury' && answer === true) {
      const details = answers.injuryDetails
      return typeof details === 'string' && details.trim().length > 0
    }

    return true
  }, [currentStep, userName, answers])

  const submitProfile = useCallback(async () => {
    setIsSubmitting(true)
    setSubmitError(null)
    try {
      const request = mapAnswersToRequest(answers)
      const response = await onboardingApi.saveProfile(request)
      return response
    } catch (error) {
      console.error('Error saving profile:', error)
      setSubmitError('Erro ao salvar perfil. Tente novamente.')
      setIsSubmitting(false)
      return undefined
    }
  }, [answers])

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
      if (key === 'running' && value === false) {
        delete next.weeklyKm
      }
      if (key === 'injury' && value === false) {
        delete next.injuryDetails
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
