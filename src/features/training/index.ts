// Components
export { FAB } from './components/FAB'
export { TrainingLayout } from './components/TrainingLayout'
export { TrainingHeader } from './components/TrainingHeader'
export { BottomTabs } from './components/BottomTabs'
export { DashboardPlaceholder } from './components/placeholders/DashboardPlaceholder'
export { WeekPlaceholder } from './components/placeholders/WeekPlaceholder'
export { HistoryPlaceholder } from './components/placeholders/HistoryPlaceholder'

// Hooks
export { useDraggable } from './hooks/useDraggable'
export { useFABPosition } from './hooks/useFABPosition'

// Dashboard components
export { DashboardScreen } from './components/dashboard/DashboardScreen'
export { MetricCard } from './components/dashboard/MetricCard'
export { LastActivityCard } from './components/dashboard/LastActivityCard'
export { StravaConnectCTA } from './components/dashboard/StravaConnectCTA'

// Utils
export { formatDistance, formatPace, formatDuration, formatDateShort, formatTrend } from './utils/formatters'

// History components
export { HistoryScreen } from './components/history/HistoryScreen'
export { ActivityDetailScreen } from './components/history/ActivityDetailScreen'
export { ActivityListItem } from './components/history/ActivityListItem'
export { ActivityFilters } from './components/history/ActivityFilters'
export { SplitsTable } from './components/history/SplitsTable'
export { HRZonesChart } from './components/history/HRZonesChart'

// History hooks
export { useInfiniteActivities } from './hooks/useInfiniteActivities'

// Week components
export { WeekScreen } from './components/week/WeekScreen'
export { WeekSelector } from './components/week/WeekSelector'
export { DayCard } from './components/week/DayCard'
export { WeekSummary } from './components/week/WeekSummary'

// Week hooks
export { useWeekNavigation, getDaysOfWeek } from './hooks/useWeekNavigation'

// Types
export type { TrainingTab } from './types'
