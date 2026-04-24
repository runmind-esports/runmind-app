const MONTHS_PT = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez']

export function formatDistance(meters: number): string {
  if (meters < 1000) {
    return `${Math.round(meters)} m`
  }
  const km = meters / 1000
  return `${km.toFixed(1)} km`
}

export function formatPace(avgSpeedMs: number): string {
  if (avgSpeedMs <= 0) return '--'
  const totalSeconds = 1000 / avgSpeedMs
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = Math.floor(totalSeconds % 60)
  return `${minutes}:${seconds.toString().padStart(2, '0')} /km`
}

export function formatDuration(seconds: number): string {
  if (seconds < 60) return `${Math.round(seconds)}s`
  const hours = Math.floor(seconds / 3600)
  const mins = Math.floor((seconds % 3600) / 60)
  if (hours === 0) return `${mins}min`
  return `${hours}h ${mins.toString().padStart(2, '0')}min`
}

export function formatDateShort(isoDate: string | Date | undefined | null): string {
  if (!isoDate) return '--'
  const date = typeof isoDate === 'string' ? new Date(isoDate) : isoDate
  if (isNaN(date.getTime())) return '--'
  const day = date.getDate()
  const month = MONTHS_PT[date.getMonth()]
  return `${day} ${month}`
}

export function formatTrend(
  current: number,
  previous: number,
): { value: string, isPositive: boolean } {
  const diff = current - previous
  const isPositive = diff >= 0
  const sign = isPositive ? '+' : ''
  const formatted = diff >= 1000
    ? `${sign}${(diff / 1000).toFixed(1)} km`
    : `${sign}${Math.round(diff)} m`
  return { value: formatted, isPositive }
}
