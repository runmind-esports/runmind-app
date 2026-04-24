---
phase: 08-fab-button-training-shell
plan: 02
subsystem: training-shell
tags: [training, navigation, layout, bottom-tabs, routes]
dependency_graph:
  requires: [08-01]
  provides: [training-layout, training-routes, bottom-tab-navigation]
  affects: [src/app/training/*, src/features/training/*]
tech_stack:
  added: []
  patterns: [auth-guard, fade-in-mount, bottom-tab-navigation, safe-area-inset]
key_files:
  created:
    - src/features/training/types/index.ts
    - src/features/training/components/TrainingHeader.tsx
    - src/features/training/components/BottomTabs.tsx
    - src/features/training/components/TrainingLayout.tsx
    - src/features/training/components/placeholders/DashboardPlaceholder.tsx
    - src/features/training/components/placeholders/WeekPlaceholder.tsx
    - src/features/training/components/placeholders/HistoryPlaceholder.tsx
    - src/app/training/layout.tsx
    - src/app/training/page.tsx
    - src/app/training/week/page.tsx
    - src/app/training/history/page.tsx
  modified:
    - src/features/training/index.ts
decisions:
  - Used same auth guard pattern as Chat.tsx (useAuth + useEffect redirect)
  - Merged barrel exports with existing Plan 01 FAB exports instead of overwriting
  - Used env(safe-area-inset-bottom) inline style for iOS home indicator spacing
metrics:
  duration: 2min 27s
  completed: 2026-04-23
---

# Phase 8 Plan 2: Training Mode Shell Summary

Training layout shell with header, bottom tab navigation (Dashboard/Semana/Historico), auth guard, and three placeholder route pages under /training.

## Task Commits

| Task | Name | Commit | Files |
|------|------|--------|-------|
| 1 | Create training types, layout components, and bottom tabs | c707b9e | types/index.ts, TrainingHeader.tsx, BottomTabs.tsx, TrainingLayout.tsx, 3 placeholders |
| 2 | Create Next.js routes and update barrel exports | 43847c8 | training/layout.tsx, training/page.tsx, week/page.tsx, history/page.tsx, index.ts |

## What Was Built

- **TrainingHeader**: Top bar with "Treino" title and back-to-chat button (ArrowLeft + "Chat" text navigating to /chat)
- **BottomTabs**: Fixed bottom navigation with Dashboard (LayoutDashboard icon), Semana (Calendar icon), Historico (History icon). Active tab detection via usePathname with exact match for /training and startsWith for sub-routes. iOS safe-area padding via env(safe-area-inset-bottom).
- **TrainingLayout**: Shell combining header + scrollable content + bottom tabs with auth guard (redirects to /login if unauthenticated) and fade-in animation on mount (opacity 0->1, 300ms ease-in-out)
- **Placeholder screens**: DashboardPlaceholder, WeekPlaceholder, HistoryPlaceholder -- centered icon + heading + description text, ready for replacement in future phases
- **Routes**: /training (dashboard), /training/week, /training/history -- all wrapped by TrainingLayout via Next.js layout.tsx

## Deviations from Plan

None -- plan executed exactly as written. Plan 01 had already executed so FAB exports were merged into the barrel file rather than commented out.

## Verification

- TypeScript compilation: PASSED (zero errors)
- Build: PASSED -- all three training routes appear in build output as static pages
- Pre-existing build export errors on /login, /chat, / are unrelated to this plan (auth/API dependency during static export)

## Known Stubs

| Stub | File | Reason |
|------|------|--------|
| DashboardPlaceholder | src/features/training/components/placeholders/DashboardPlaceholder.tsx | Intentional -- replaced in Phase 10+ |
| WeekPlaceholder | src/features/training/components/placeholders/WeekPlaceholder.tsx | Intentional -- replaced in Phase 10+ |
| HistoryPlaceholder | src/features/training/components/placeholders/HistoryPlaceholder.tsx | Intentional -- replaced in Phase 10+ |

## Self-Check: PASSED

All 12 files verified on disk. Both commit hashes (c707b9e, 43847c8) found in git log.
