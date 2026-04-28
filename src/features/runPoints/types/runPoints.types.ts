export interface RunPointsStatus {
  currentPoints: number
  maxPoints: number
  periodType: string    // e.g. "daily"
  periodStart: string   // ISO date
  nextResetAt: string   // ISO date
  tier: string          // "free" | "pro" | "premium"
}

export interface RunPointsHistoryDay {
  day: string           // "Seg", "Ter", "Qua", "Qui", "Sex", "Sab", "Dom"
  used: number
}
