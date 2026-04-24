---
phase: 13-treino-dia-execucao
plan: 01
subsystem: training-workout
tags: [workout, strava, completion, ai-feedback]
dependency_graph:
  requires: [11-01, 12-01]
  provides: [workout-detail-screen, workout-types]
  affects: [training-barrel, app-routes]
tech_stack:
  added: []
  patterns: [accordion-ui, split-derivation, feeling-selector]
key_files:
  created:
    - src/features/training/types/workout.types.ts
    - src/features/training/components/workout/WorkoutParts.tsx
    - src/features/training/components/workout/WorkoutSummary.tsx
    - src/features/training/components/workout/WorkoutScreen.tsx
    - src/app/training/workout/[id]/page.tsx
  modified:
    - src/features/training/index.ts
decisions:
  - Derive workout parts from Strava splits (warmup/main/cooldown) since no workout planning API exists yet
  - Use URLSearchParams for chat context to avoid encoding issues
metrics:
  duration: 3min
  completed: 2026-04-24
---

# Phase 13 Plan 01: Workout Detail Screen Summary

Workout detail screen with expandable accordion parts derived from Strava splits, completion flow with feeling selector, real activity metrics summary, and AI feedback button that navigates to chat with workout context.

## Tasks Completed

| Task | Name | Commit | Files |
|------|------|--------|-------|
| 1 | Workout types and components | 1029dde | workout.types.ts, WorkoutParts.tsx, WorkoutSummary.tsx, WorkoutScreen.tsx |
| 2 | Wire route and update barrel | 1e8002c | /training/workout/[id]/page.tsx, index.ts |

## Implementation Details

### Workout Types (workout.types.ts)
- `WorkoutStep`: individual step with type (warmup/main/cooldown/interval/recovery), duration, distance, target pace/HR
- `WorkoutPart`: named section containing steps
- `Workout`: full workout with parts, planned totals, optional Strava link
- `WorkoutCompletion`: completion record with metrics and feeling

### WorkoutParts (accordion)
- Expandable sections with chevron toggle
- Color-coded step type dots (green=warmup, accent=main, blue=cooldown, orange=interval, gray=recovery)
- Duration/distance badges on each step
- Accordion behavior: one section open at a time

### WorkoutSummary (post-completion)
- Metrics grid: distance, duration, pace, avg HR, calories
- Populated from Strava activity data when connected
- Shimmer skeleton loading state

### WorkoutScreen (main orchestrator)
- Derives workout parts from Strava splits: first split as warmup, middle as main, last as cooldown
- Falls back to single part if fewer than 3 splits
- Completion flow: "Marcar como concluido" button -> feeling selector -> summary + splits
- "Atualizar a IA" button sends workout context to /chat via query params
- Sticky header with back navigation and activity name/date

### Route (/training/workout/[id])
- Dynamic route parsing activityId from URL params
- Number validation with isNaN guard (T-13-01 mitigation)
- Protected by TrainingLayout auth guard (T-13-02 mitigation)

## Deviations from Plan

None - plan executed exactly as written.

## Known Stubs

None. All components wire to real Strava data via useActivityDetail hook. Workout parts are derived from live splits data rather than a workout planning API (documented design decision, not a stub).

## Self-Check: PASSED

- All 5 created files verified on disk
- Both commits (1029dde, 1e8002c) verified in git log
