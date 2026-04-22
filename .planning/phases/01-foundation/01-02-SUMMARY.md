---
phase: 01-foundation
plan: "02"
status: complete
started: 2026-04-22
completed: 2026-04-22
---

# Plan 01-02 Summary: Marketing Route Group

## Objective
Create the (marketing) route group with isolated layout and page orchestrator, replacing the existing monolithic page.tsx.

## What Was Built

Created `src/app/(marketing)/` route group with:
- `layout.tsx` — Marketing-specific layout wrapping children in LanguageProvider (no QueryProvider or auth state)
- `page.tsx` — Thin page orchestrator with 8 SectionWrapper placeholder slots (hero, features, profiles, flow, numbers, gap, cta-section, footer)

Deleted old `src/app/page.tsx` (955-line monolith) — replaced by the new marketing route group.

## Key Files

### Created
- `src/app/(marketing)/layout.tsx` — Marketing layout with LanguageProvider
- `src/app/(marketing)/page.tsx` — Landing page orchestrator with 8 section slots

### Modified
- `src/features/landing/components/ui/SectionWrapper.tsx` — Made `children` prop optional for empty placeholder slots

### Deleted
- `src/app/page.tsx` — Old monolithic landing page (preserved in git history)

## Deviations
- Made `children` optional in SectionWrapper props — build failed because JSX comments don't count as React children. Minor type change, no functional impact.

## Verification
- `npm run build` passes with zero errors
- Route `/` served by `(marketing)/page.tsx`
- All existing routes present: `/login`, `/signup`, `/chat`, `/settings`, `/auth/strava/callback`
- Marketing layout imports LanguageProvider, NOT QueryProvider

## Self-Check: PASSED
