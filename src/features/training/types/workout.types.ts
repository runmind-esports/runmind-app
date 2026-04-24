export interface WorkoutStep {
  id: string
  description: string // e.g., "Corrida leve 10min"
  type: 'warmup' | 'main' | 'cooldown' | 'interval' | 'recovery'
  duration?: number // seconds
  distance?: number // meters
  targetPace?: string // e.g., "5:30-6:00"
  targetHR?: string // e.g., "Z2-Z3"
}

export interface WorkoutPart {
  id: string
  name: string // e.g., "Parte 1 - Aquecimento"
  steps: WorkoutStep[]
}

export interface Workout {
  id: string
  title: string
  date: string // ISO
  description?: string
  parts: WorkoutPart[]
  totalDuration?: number // planned total seconds
  totalDistance?: number // planned total meters
  stravaActivityId?: number // linked Strava activity if completed
}

export interface WorkoutCompletion {
  workoutId: string
  completedAt: string
  distance?: number
  duration?: number
  avgPace?: string
  avgHR?: number
  feeling?: 'easy' | 'moderate' | 'hard' | 'very_hard'
  notes?: string
}
