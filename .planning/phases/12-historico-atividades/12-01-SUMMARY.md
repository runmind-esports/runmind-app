---
phase: 12-historico-atividades
plan: 01
subsystem: training-history
tags: [infinite-scroll, activity-detail, filters, hr-zones, splits]
dependency_graph:
  requires: [09-01]
  provides: [history-list, activity-detail, infinite-scroll]
  affects: [training-barrel, training-routes]
tech_stack:
  added: []
  patterns: [useInfiniteQuery, IntersectionObserver, page-based-pagination]
key_files:
  created:
    - src/features/training/hooks/useInfiniteActivities.ts
    - src/features/training/components/history/ActivityListItem.tsx
    - src/features/training/components/history/ActivityFilters.tsx
    - src/features/training/components/history/HistoryScreen.tsx
    - src/features/training/components/history/SplitsTable.tsx
    - src/features/training/components/history/HRZonesChart.tsx
    - src/features/training/components/history/ActivityDetailScreen.tsx
    - src/app/training/history/[id]/page.tsx
  modified:
    - src/app/training/history/page.tsx
    - src/features/training/index.ts
decisions:
  - Used IntersectionObserver for infinite scroll instead of scroll event listener (better perf)
  - Inline StravaConnectCTA in HistoryScreen rather than importing from dashboard (avoids circular deps)
  - Used LucideIcon type for MetricCard icon prop to match lucide-react ForwardRef pattern
metrics:
  duration: 4min
  completed: 2026-04-24
  tasks: 3/3
---

# Phase 12 Plan 01: Activity History with Infinite Scroll and Detail Screen Summary

Activity history list with useInfiniteQuery pagination, type/period filters, and full detail screen with splits table and HR zones horizontal bar chart

## What Was Built

### Task 1: Infinite scroll hook, list components, and filters

- **useInfiniteActivities** hook using `useInfiniteQuery` with page-based pagination (20 per page), period-based `after` timestamp calculation, and client-side type filtering
- **ActivityListItem** showing activity type icon, name, distance/pace/duration metrics, and optional HR badge
- **ActivityFilters** with horizontal scrollable pill buttons for type (Todos/Corrida/Caminhada/Ciclismo) and period (Tudo/Semana/Mes/3 meses)
- **HistoryScreen** composing filters + list + IntersectionObserver sentinel for infinite scroll, with loading skeletons, empty state, and Strava connect CTA

### Task 2: Activity detail screen with splits and HR zones

- **SplitsTable** rendering per-km splits in a grid layout with pace, HR, and elevation columns
- **HRZonesChart** showing 5 heart rate zones as horizontal bars with proportional widths and color coding (blue through red)
- **ActivityDetailScreen** with sticky header, 4 primary metric cards (distance, duration, pace, calories), secondary metrics row (elevation, HR, cadence), splits section, HR zones section, and "Analisar com IA" button that navigates to /chat with activity context params

### Task 3: Route wiring and barrel exports

- Replaced HistoryPlaceholder with HistoryScreen at /training/history
- Created dynamic route /training/history/[id] with activityId validation
- Added all new history components and hooks to training barrel file

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Fixed LucideIcon type mismatch**
- **Found during:** Task 2
- **Issue:** `React.ComponentType<{ size?: number; className?: string }>` doesn't accept LucideIcon (ForwardRefExoticComponent with different prop types)
- **Fix:** Used `LucideIcon` type import from lucide-react
- **Files modified:** ActivityDetailScreen.tsx
- **Commit:** 0504616

**2. [Rule 2 - Missing functionality] Created inline StravaConnectCTA**
- **Found during:** Task 1
- **Issue:** Plan referenced `StravaConnectCTA` from `@/features/training` but it exists in `./components/dashboard/StravaConnectCTA` and is not suitable for direct import (different context)
- **Fix:** Created inline StravaConnectCTA component within HistoryScreen with connect button
- **Files modified:** HistoryScreen.tsx
- **Commit:** 5625144

## Verification Results

- `npm run build` succeeds with all routes present
- `/training/history` route renders at 295B
- `/training/history/[id]` route renders at 457B (dynamic)
- No TypeScript errors in new files (pre-existing error in WeekScreen.tsx is out of scope)

## Commits

| Task | Commit | Message |
|------|--------|---------|
| 1 | 5625144 | feat(12-01): add infinite scroll hook, activity list, filters, and history screen |
| 2 | 0504616 | feat(12-01): add activity detail screen with splits table and HR zones chart |
| 3 | 041a25c | feat(12-01): wire history routes and update barrel exports |

## Self-Check: PASSED

All 9 created files verified present on disk. All 3 commits verified in git log. Build succeeds.
