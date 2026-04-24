---
phase: 11-calendario-semanal
plan: 01
subsystem: training-week
tags: [week-calendar, strava, navigation, ui]
dependency_graph:
  requires: [09-01-strava-activities]
  provides: [week-view, week-navigation]
  affects: [training-barrel, training-week-route]
tech_stack:
  added: []
  patterns: [week-date-filtering, client-side-activity-grouping]
key_files:
  created:
    - src/features/training/hooks/useWeekNavigation.ts
    - src/features/training/components/week/WeekSelector.tsx
    - src/features/training/components/week/DayCard.tsx
    - src/features/training/components/week/WeekSummary.tsx
    - src/features/training/components/week/WeekScreen.tsx
  modified:
    - src/features/training/index.ts
    - src/app/training/week/page.tsx
decisions:
  - "Client-side week filtering from large activity fetch (page=1, perPage=100) rather than per-week API calls"
  - "Reused shared StravaConnectCTA from dashboard module for Strava disconnected state"
metrics:
  duration: ~4min
  completed: 2026-04-23
  tasks: 2/2
---

# Phase 11 Plan 01: Weekly Calendar View Summary

Weekly calendar showing 7 day cards (Mon-Sun) with Strava activities, week navigation with PT-BR date labels, and aggregated weekly totals (distance, runs, time).

## What Was Built

### useWeekNavigation Hook
- Manages `weekOffset` state (0 = current week, negative = past weeks)
- Computes `weekStart` (Monday 00:00) and `weekEnd` (Sunday 23:59:59) date range
- PT-BR formatted `weekLabel` (e.g., "21 abr - 27 abr")
- `goToPreviousWeek`, `goToNextWeek` (capped at 0), `goToCurrentWeek` actions
- Exported `getDaysOfWeek()` helper returning 7 Date objects for a given Monday

### WeekSelector Component
- Horizontal flex row: ChevronLeft, date range label, ChevronRight
- Next button disabled with opacity-30 when on current week
- Accessible aria-labels in PT-BR

### DayCard Component
- Shows abbreviated PT-BR day name + date number on the left
- Activity present: green left border, type icon (Footprints/Bike/PersonStanding), name, distance, pace, duration
- Today without activity: accent left border
- Rest day: gray border, "Descanso" italic text
- Tap navigates to `/training/history/{id}` (Phase 12 route, will 404 until built)

### WeekSummary Component
- Aggregates filtered activities: total distance, run count, total time
- Loading state with shimmer skeleton animations
- Horizontal stat row in a bordered card

### WeekScreen Composition
- Wires `useWeekNavigation` + `useStravaActivities(1, 100)` with client-side date filtering
- Strava disconnected: shows shared `StravaConnectCTA` with link to settings
- Loading: shows skeleton summary
- Connected: WeekSelector + WeekSummary + 7 DayCards (Mon-Sun)

### Route and Barrel
- `/training/week` now renders `WeekScreen` (replaced `WeekPlaceholder`)
- Barrel exports all week components and hooks

## Deviations from Plan

None - plan executed exactly as written.

## Commits

| Task | Commit | Description |
|------|--------|-------------|
| 1 | 885fe3f | Week navigation hook and all week components |
| 2 | 6a4f5cb | Route wiring and barrel exports |

## Self-Check: PASSED
