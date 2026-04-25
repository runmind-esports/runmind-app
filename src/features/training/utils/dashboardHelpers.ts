import type { StravaActivity } from '@/features/strava/types/activities.types'

// --- Week helpers ---

export function getMonday(date: Date): Date {
  const d = new Date(date)
  const day = d.getDay()
  // getDay(): 0=Sun, 1=Mon, ..., 6=Sat
  const diff = day === 0 ? -6 : 1 - day
  d.setDate(d.getDate() + diff)
  d.setHours(0, 0, 0, 0)
  return d
}

export function filterCurrentWeek(activities: StravaActivity[]): StravaActivity[] {
  const monday = getMonday(new Date())
  const sunday = new Date(monday)
  sunday.setDate(sunday.getDate() + 6)
  sunday.setHours(23, 59, 59, 999)

  return activities.filter((a) => {
    if (a.type !== 'Run') return false
    const d = new Date(a.start_date_local)
    return d >= monday && d <= sunday
  })
}

export function filterPreviousWeek(activities: StravaActivity[]): StravaActivity[] {
  const currentMonday = getMonday(new Date())
  const prevMonday = new Date(currentMonday)
  prevMonday.setDate(prevMonday.getDate() - 7)

  const prevSunday = new Date(prevMonday)
  prevSunday.setDate(prevSunday.getDate() + 6)
  prevSunday.setHours(23, 59, 59, 999)

  return activities.filter((a) => {
    if (a.type !== 'Run') return false
    const d = new Date(a.start_date_local)
    return d >= prevMonday && d <= prevSunday
  })
}

export function sumDistance(activities: StravaActivity[]): number {
  return activities.reduce((sum, a) => sum + a.distance, 0)
}

// --- Streak calculation ---

export function calculateWeekStreak(activities: StravaActivity[]): number {
  const runs = activities.filter((a) => a.type === 'Run')
  if (runs.length === 0) return 0

  // Bucket activities by Monday ISO date string
  const weekSet = new Set<string>()
  runs.forEach((a) => {
    const monday = getMonday(new Date(a.start_date_local))
    weekSet.add(monday.toISOString().split('T')[0])
  })

  // Count consecutive weeks backwards from current week
  let streak = 0
  const checkWeek = getMonday(new Date())

  while (weekSet.has(checkWeek.toISOString().split('T')[0])) {
    streak++
    checkWeek.setDate(checkWeek.getDate() - 7)
  }

  return streak
}

// --- Weekly goal (localStorage) ---

export const WEEKLY_GOAL_KEY = 'runmind_weekly_goal'

export function getWeeklyGoal(): number {
  if (typeof window === 'undefined') return 0
  const stored = localStorage.getItem(WEEKLY_GOAL_KEY)
  if (!stored) return 0
  const parsed = Number(stored)
  return isNaN(parsed) ? 0 : parsed
}

export function setWeeklyGoal(km: number): void {
  if (typeof window === 'undefined') return
  localStorage.setItem(WEEKLY_GOAL_KEY, String(km))
}

export function computeDefaultGoal(recentRunTotalsDistance: number): number {
  if (recentRunTotalsDistance <= 0) return 10
  const avgWeeklyKm = Math.round(recentRunTotalsDistance / 1000 / 4)
  return Math.max(avgWeeklyKm, 5)
}

// --- Coach suggestion ---

export interface CoachSuggestion {
  message: string
  chatPrompt: string
  emoji: string
}

export function generateCoachSuggestion(
  weeklyRuns: number,
  daysSinceLastRun: number,
  weeklyKm: number,
  previousWeekKm: number,
): CoachSuggestion {
  // Rule: 3+ runs this week -> suggest long run
  if (weeklyRuns >= 3) {
    return {
      message: `Voce correu ${weeklyRuns}x essa semana! Que tal um longao no domingo?`,
      chatPrompt: `Corri ${weeklyRuns} vezes essa semana totalizando ${weeklyKm.toFixed(1)}km. Pode sugerir um longao para o fim de semana?`,
      emoji: '🔥',
    }
  }

  // Rule: no run in 3+ days -> suggest easy run
  if (daysSinceLastRun >= 3 && isFinite(daysSinceLastRun)) {
    return {
      message: `Faz ${daysSinceLastRun} dias sem correr. Uma corrida leve hoje?`,
      chatPrompt: `Estou ha ${daysSinceLastRun} dias sem correr. Pode sugerir um treino leve para retomar?`,
      emoji: '💪',
    }
  }

  // Rule: weekly volume up -> congratulate
  if (weeklyKm > previousWeekKm && previousWeekKm > 0) {
    const diff = (weeklyKm - previousWeekKm).toFixed(1)
    return {
      message: `+${diff}km comparado a semana passada. Continue assim!`,
      chatPrompt: `Essa semana corri ${weeklyKm.toFixed(1)}km, ${diff}km a mais que semana passada. O que recomenda para a proxima semana?`,
      emoji: '🔥',
    }
  }

  // Default
  return {
    message: 'Pronto para o proximo treino? Pergunte ao coach!',
    chatPrompt: 'Pode me sugerir um treino para hoje baseado no meu historico recente?',
    emoji: '🎯',
  }
}
