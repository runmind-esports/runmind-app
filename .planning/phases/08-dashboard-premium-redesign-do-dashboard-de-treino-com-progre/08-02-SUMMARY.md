---
phase: 08-dashboard-premium
plan: 02
subsystem: training-dashboard
tags: [dashboard-ui, coach-cta, chat-prefill, strava-activities]
dependency_graph:
  requires: [useDashboardData, WeeklyProgressRing, dashboardHelpers, formatters]
  provides: [RecentActivityCard, WeekComparison, StreakBadge, CoachCTA, premium-DashboardScreen, chat-prompt-prefill]
  affects: [training-dashboard, chat-page]
tech_stack:
  added: []
  patterns: [Suspense boundary for useSearchParams, URL query param chat pre-fill]
key_files:
  created:
    - src/features/training/components/dashboard/RecentActivityCard.tsx
    - src/features/training/components/dashboard/WeekComparison.tsx
    - src/features/training/components/dashboard/StreakBadge.tsx
    - src/features/training/components/dashboard/CoachCTA.tsx
  modified:
    - src/features/training/components/dashboard/DashboardScreen.tsx
    - src/features/training/index.ts
    - src/app/chat/page.tsx
    - src/features/chat/components/Chat.tsx
decisions:
  - CoachCTA wrapped in div with role=button instead of passing onClick to Card (Card only accepts children+className)
  - Chat page uses Suspense boundary for useSearchParams (Next.js 14 requirement)
  - initialPrompt useEffect placed after handleSendMessage definition to avoid reference-before-definition
metrics:
  duration: 7min
  completed: 2026-04-25
  tasks_completed: 2
  tasks_total: 2
  files_created: 4
  files_modified: 4
---

# Phase 08 Plan 02: Dashboard UI Components & Chat Pre-fill Summary

4 new premium dashboard UI components (RecentActivityCard, WeekComparison, StreakBadge, CoachCTA), rebuilt DashboardScreen with full premium layout, and chat prompt pre-fill integration via URL query param.

## What Was Built

### RecentActivityCard.tsx
Compact horizontal activity card displaying activity type icon (Footprints/Bike/Activity), name (truncated), distance + pace with dot separator, and relative date. Uses Card base, formatDistance, formatPace, formatRelativeDate from existing formatters.

### WeekComparison.tsx
Week-over-week km comparison display. Shows TrendingUp/TrendingDown icon with colored trend value and "vs semana passada" label. Handles edge case of previousKm=0 with "Primeira semana de treino!" message. Uses formatTrend (converts km to meters for the formatter).

### StreakBadge.tsx
Streak counter with Flame icon in orange. Shows "{N} semana(s) consecutiva(s)" with "Mantenha o ritmo!" subtitle. Returns null when weeks=0.

### CoachCTA.tsx
Contextual coach suggestion card with emoji, "Coach IA" label, dynamic suggestion message, and "Conversar com o coach" action row. Navigates to `/chat?prompt=` with encoded chatPrompt on click. Has gradient glow accent matching MetricCard style.

### DashboardScreen.tsx (rebuilt)
Premium layout composing: WeeklyProgressRing (with goal editing), WeekComparison, StreakBadge, Recent Activities section (3 cards + "Ver todas" link), and CoachCTA. Removed old MetricCard grid and LastActivityCard. Shimmer loading skeleton for connected-loading state. StravaConnectCTA for disconnected state.

### Chat Pre-fill Integration
- `src/app/chat/page.tsx`: Reads `?prompt=` search param via useSearchParams (wrapped in Suspense), passes to Chat component
- `src/features/chat/components/Chat.tsx`: Accepts `initialPrompt` prop, useEffect auto-sends message and clears URL param via router.replace

### Barrel Exports (training/index.ts)
Added exports for: WeeklyProgressRing, RecentActivityCard, WeekComparison, StreakBadge, CoachCTA, useDashboardData, formatRelativeDate, CoachSuggestion type.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Card component lacks onClick prop**
- **Found during:** Task 1 (CoachCTA)
- **Issue:** Card component only accepts `children` and `className` props, no `onClick`
- **Fix:** Wrapped Card in a div with `role="button"`, `tabIndex={0}`, `onClick`, and `onKeyDown` handlers
- **Files modified:** CoachCTA.tsx
- **Commit:** 82b5497

**2. [Rule 3 - Blocking] useSearchParams requires Suspense boundary**
- **Found during:** Task 2 (build verification)
- **Issue:** Next.js 14 requires useSearchParams to be wrapped in Suspense for static generation
- **Fix:** Split ChatPage into ChatPageInner (with useSearchParams) wrapped in Suspense
- **Files modified:** src/app/chat/page.tsx
- **Commit:** 66033ab

## Decisions Made

1. CoachCTA uses wrapper div for click handling rather than modifying shared Card component interface
2. Chat pre-fill auto-sends immediately then clears URL to prevent re-send on refresh
3. Suspense boundary with no fallback for chat page (renders null during SSG, hydrates on client)

## Commits

| Task | Commit | Description |
|------|--------|-------------|
| 1 | 82b5497 | RecentActivityCard, WeekComparison, StreakBadge, CoachCTA components |
| 2 | 66033ab | Rebuilt DashboardScreen, chat pre-fill, barrel exports |

## Self-Check: PASSED
