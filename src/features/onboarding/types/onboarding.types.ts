// Request type for POST /api/v1/training/profile
// Maps frontend onboarding values to backend fields per D-02
export interface SaveProfileRequest {
  fitnessLevel: string  // 'beginner' | 'intermediate' | 'advanced'
  weeklyKmCapacity: number
  longestRunKm?: number
  pace5kSeconds: number
  preferredDays: string[]
  longRunDay?: string
  injuriesHistory?: Record<string, unknown>
  goals: string[]
  runningExpMonths?: number
  stravaConnected?: boolean
  hasRacedBefore: boolean
  otherActivities?: Record<string, unknown>
  trainingPreference: string  // 'short_intense' | 'long_moderate' | 'any'
  includeStrengthTraining: boolean
}

// Response type from GET /api/v1/training/profile and POST /api/v1/training/profile
export interface RunnerProfileResponse {
  id: string
  userId: string
  fitnessLevel: string
  weeklyKmCapacity: number
  longestRunKm: number
  pace5kSeconds: number
  pace5kFormatted: string
  preferredDays: string[]
  longRunDay: string
  injuriesHistory: Record<string, unknown>
  goals: unknown[]
  runningExpMonths: number
  stravaConnected: boolean
  hasRacedBefore: boolean
  otherActivities: Record<string, unknown>
  trainingPreference: string
  includeStrengthTraining: boolean
  createdAt: string
  updatedAt: string
}

// Error response from API
export interface ApiErrorResponse {
  error: string
  code: string
}
