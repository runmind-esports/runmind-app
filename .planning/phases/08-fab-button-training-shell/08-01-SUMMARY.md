---
phase: 08-fab-button-training-shell
plan: 01
subsystem: training
tags: [fab, draggable, navigation, ui]
dependency_graph:
  requires: []
  provides: [training-fab, useDraggable, useFABPosition]
  affects: [chat-screen]
tech_stack:
  added: []
  patterns: [custom-drag-hook, localStorage-persistence, viewport-clamping]
key_files:
  created:
    - src/features/training/hooks/useDraggable.ts
    - src/features/training/hooks/useFABPosition.ts
    - src/features/training/components/FAB.tsx
  modified:
    - src/features/chat/components/Chat.tsx
    - src/features/training/index.ts
decisions:
  - "Used dragMovedRef to distinguish click from drag -- avoids accidental navigation during drag"
  - "Attached move/end listeners to window for reliable drag tracking even when pointer leaves element"
  - "Position defaults to bottom-right (76px from right, 160px from bottom) to avoid overlapping chat input"
metrics:
  duration: "3min"
  completed: "2026-04-24"
---

# Phase 8 Plan 1: FAB Button (Draggable Floating Action Button) Summary

Draggable FAB on chat screen with touch+mouse support, localStorage position persistence, and /training navigation on click.

## What Was Built

### Task 1: useDraggable and useFABPosition hooks

**useDraggable** -- Generic hook for making any element draggable:
- Supports both mouse and touch events
- Clamps element position to viewport boundaries using getBoundingClientRect
- Attaches move/end listeners to window for reliable tracking
- Exposes `dragMovedRef` to distinguish click from drag
- Prevents default on touch move to avoid scroll interference

**useFABPosition** -- Persists FAB coordinates in localStorage:
- Key: `runmind_fab_position`
- SSR-safe with `typeof window` check, defaults to `{0,0}` until mounted
- Default position: bottom-right corner (above chat input area)
- Reads stored position on mount, falls back to default

**Commit:** `e53c398`

### Task 2: FAB component and Chat integration

**FAB.tsx** -- Floating action button component:
- 56px green circle (`bg-accent`) with Dumbbell icon from lucide-react
- Semi-transparent (opacity-70) by default, fully opaque on hover/drag
- `cursor-grab` / `cursor-grabbing` states
- Click (without drag) navigates to `/training` via `router.push`
- `position: fixed`, `z-index: 50`, `touch-action: none`
- `aria-label="Modo treino"` for accessibility

**Chat.tsx** -- Added `<FAB />` after `<ChatInput>` inside auth guard.

**Commit:** `79b8156`

## Deviations from Plan

None -- plan executed exactly as written. Pre-existing training route pages (layout, dashboard, history, week) and their placeholder components already existed in the codebase from a prior plan, so the barrel file auto-included them without requiring additional work.

## Verification

- `npx tsc --noEmit` -- zero errors
- `npm run build` -- successful (after clearing stale `.next` cache)
- All key files created and properly exported

## Known Stubs

None -- FAB is fully functional. The `/training` route it navigates to has placeholder content from a separate plan (08-02).

## Self-Check

PASSED -- all 5 files found, both commits (e53c398, 79b8156) verified.
