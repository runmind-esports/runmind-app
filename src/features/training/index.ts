// Components
export { FAB } from './components/FAB'
export { TrainingLayout } from './components/TrainingLayout'
export { TrainingHeader } from './components/TrainingHeader'
export { TrainingTabs } from './components/BottomTabs'
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

// Dashboard components (premium)
export { WeeklyProgressRing } from './components/dashboard/WeeklyProgressRing'
export { RecentActivityCard } from './components/dashboard/RecentActivityCard'
export { WeekComparison } from './components/dashboard/WeekComparison'
export { StreakBadge } from './components/dashboard/StreakBadge'
export { CoachCTA } from './components/dashboard/CoachCTA'

// Dashboard hooks
export { useDashboardData } from './hooks/useDashboardData'

// Utils
export { formatDistance, formatPace, formatDuration, formatDateShort, formatTrend, formatRelativeDate } from './utils/formatters'

// Dashboard types
export type { CoachSuggestion } from './utils/dashboardHelpers'

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

// Workout components
export { WorkoutScreen } from './components/workout/WorkoutScreen'
export { WorkoutParts } from './components/workout/WorkoutParts'
export { WorkoutSummary } from './components/workout/WorkoutSummary'

// Types
export type { TrainingTab } from './types'
export type { Workout, WorkoutPart, WorkoutStep, WorkoutCompletion } from './types/workout.types'
