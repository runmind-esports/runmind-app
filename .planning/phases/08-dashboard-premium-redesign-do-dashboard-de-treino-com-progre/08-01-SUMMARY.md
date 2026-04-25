---
phase: 08-dashboard-premium
plan: 01
subsystem: training-dashboard
tags: [data-layer, svg-ring, strava-aggregation, coach-suggestion]
dependency_graph:
  requires: [strava-hooks, strava-types]
  provides: [useDashboardData, WeeklyProgressRing, dashboardHelpers]
  affects: [training-dashboard]
tech_stack:
  added: []
  patterns: [SVG stroke-dasharray circular progress, localStorage goal persistence, rule-based coach suggestions]
key_files:
  created:
    - src/features/training/utils/dashboardHelpers.ts
    - src/features/training/components/dashboard/WeeklyProgressRing.tsx
    - src/features/training/hooks/useDashboardData.ts
  modified:
    - src/features/training/utils/formatters.ts
decisions:
  - Weekly goal stored in localStorage (key: runmind_weekly_goal), auto-computed from recent_run_totals/4
  - Coach suggestions are rule-based (3+ runs -> long run, 3+ days idle -> easy run, volume up -> congrats)
  - Streak counts consecutive Monday-Sunday weeks with at least 1 Run activity
  - Single Strava fetch (page=1, perPage=200) for all dashboard data needs
metrics:
  duration: 3min
  completed: 2026-04-25
  tasks_completed: 2
  tasks_total: 2
  files_created: 3
  files_modified: 1
---

# Phase 08 Plan 01: Dashboard Data Layer & SVG Ring Summary

Dashboard data aggregation hook with Strava weekly stats, streak calculation, rule-based coach suggestions in PT-BR, and Apple Fitness+ style SVG circular progress ring with editable weekly goal.

## What Was Built

### dashboardHelpers.ts
Utility module with 11 exports: `getMonday`, `filterCurrentWeek`, `filterPreviousWeek`, `sumDistance`, `calculateWeekStreak`, `getWeeklyGoal`, `setWeeklyGoal`, `computeDefaultGoal`, `generateCoachSuggestion`, `CoachSuggestion` interface, and `WEEKLY_GOAL_KEY` constant. All week math uses Monday-Sunday boundaries matching existing `useWeekNavigation` pattern.

### WeeklyProgressRing.tsx
SVG circular progress component with two `<circle>` elements (background track + progress arc using `stroke-dasharray`/`stroke-dashoffset`). Animated with CSS `transition-[stroke-dashoffset] duration-1000 ease-out`. Includes inline goal editing (Pencil icon -> number input on blur/Enter). Wrapped in card-style container with "Meta Semanal" label.

### useDashboardData.ts
Aggregation hook consuming `useStravaActivities(1, 200)` and `useStravaStats()`. Returns `currentWeekKm`, `previousWeekKm`, `weeklyGoal`, `updateGoal`, `streak`, `recentThree`, `suggestion`, `isLoading`. Auto-computes default goal from `recent_run_totals.distance / 4` when no stored goal exists.

### formatRelativeDate (in formatters.ts)
Returns PT-BR relative dates: 'hoje' (0d), 'ontem' (1d), `${n}d` (2-6d), `${n}sem` (7-29d), else `formatDateShort`.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Card component does not exist**
- **Found during:** Task 2
- **Issue:** Plan references `Card` from `@/components/ui/card.tsx` but this file does not exist in the codebase
- **Fix:** Used the same card styling pattern as existing `MetricCard.tsx` (div with `bg-background-secondary rounded-2xl border border-border`)
- **Files modified:** `WeeklyProgressRing.tsx`
- **Commit:** 45e896b

## Decisions Made

1. Used div with Tailwind card classes instead of non-existent Card component
2. Coach suggestion emoji uses unicode characters directly (fire, muscle, target)
3. useDashboardData uses `useEffect` for auto-setting default goal to avoid render loop

## Self-Check: PASSED
