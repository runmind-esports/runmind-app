---
phase: 10-dashboard-metricas
plan: 01
subsystem: training-dashboard
tags: [dashboard, strava, metrics, ui]
dependency_graph:
  requires: [09-01]
  provides: [training-dashboard, metric-cards, last-activity-card]
  affects: [/training route]
tech_stack:
  added: []
  patterns: [formatters-utility, conditional-rendering-by-connection-status]
key_files:
  created:
    - src/features/training/utils/formatters.ts
    - src/features/training/components/dashboard/MetricCard.tsx
    - src/features/training/components/dashboard/LastActivityCard.tsx
    - src/features/training/components/dashboard/StravaConnectCTA.tsx
    - src/features/training/components/dashboard/DashboardScreen.tsx
  modified:
    - src/features/training/index.ts
    - src/app/training/page.tsx
decisions:
  - formatDateShort accepts string | Date to support both ISO strings and Date objects used by useWeekNavigation
  - Average pace calculated from total distance / total moving_time of recent_run_totals
metrics:
  duration: 2.5min
  completed: "2026-04-24T19:02:19Z"
  tasks_completed: 2
  tasks_total: 2
---

# Phase 10 Plan 01: Training Dashboard with Strava Metrics Summary

Dashboard showing real Strava running metrics (km, runs, pace), last activity card, Strava connect CTA, and coach chat button on /training route.

## Tasks Completed

| Task | Name | Commit | Key Files |
|------|------|--------|-----------|
| 1 | Dashboard components and formatters | 1119f77 | formatters.ts, MetricCard.tsx, LastActivityCard.tsx, StravaConnectCTA.tsx, DashboardScreen.tsx |
| 2 | Wire DashboardScreen into /training route and update barrel | f2ec432 | page.tsx, index.ts |

## What Was Built

### Formatters (formatters.ts)
- `formatDistance` -- meters to km/m display
- `formatPace` -- m/s to min:sec /km pace
- `formatDuration` -- seconds to human readable (Xh XXmin)
- `formatDateShort` -- ISO date or Date object to PT-BR short (e.g., "23 abr")
- `formatTrend` -- difference with sign and positive/negative flag

### MetricCard
Reusable card with icon, value, label, optional trend indicator (green/red with arrow), and shimmer loading skeleton.

### LastActivityCard
Shows latest Strava activity with name, date, distance, pace, duration, and optional heart rate. Empty state and loading skeleton included.

### StravaConnectCTA
Full CTA card with icon, heading, description, and connect button for users without Strava linked.

### DashboardScreen
Main composition component:
- Checks Strava connection via `useStrava()`
- Shows loading skeletons while status loads
- Shows StravaConnectCTA if not connected
- If connected: 2-column metric grid (km, runs, pace) + last activity card + "Falar com coach" button linking to /chat
- Data sourced from `useStravaStats()` and `useStravaActivities(1, 5)`

### Route and Barrel
- `/training` now renders DashboardScreen instead of DashboardPlaceholder
- All new components and formatters exported from training barrel file

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] formatDateShort signature widened to accept Date | string**
- **Found during:** Task 1 verification
- **Issue:** Existing `useWeekNavigation.ts` hook already imported `formatDateShort` from `../utils/formatters` and passed `Date` objects. The plan specified `string` parameter only.
- **Fix:** Changed parameter type to `string | Date` with runtime check
- **Files modified:** src/features/training/utils/formatters.ts
- **Commit:** 1119f77

## Verification

- TypeScript compilation (`tsc --noEmit`): PASSED (0 errors)
- `npm run build`: Pre-existing error in untracked `WeekScreen.tsx` (uses `status` property not in `useStrava` return type) -- not caused by this plan's changes. All plan files compile cleanly.

## Known Stubs

None -- all components are wired to real Strava hooks and display actual data.

## Self-Check: PASSED

- All 7 files verified present on disk
- Commit 1119f77 verified in git log
- Commit f2ec432 verified in git log
- TypeScript compilation clean (0 errors)
