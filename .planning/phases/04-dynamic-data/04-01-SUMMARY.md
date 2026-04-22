---
phase: 04-dynamic-data
plan: 01
subsystem: ui
tags: [react, requestAnimationFrame, intl-numberformat, axios, animation, i18n]

# Dependency graph
requires:
  - phase: 02-landing-sections
    provides: SectionWrapper, ScrollReveal, useInView, useLanguage, translations dictionary
  - phase: 03-extended-content
    provides: FlowSection and GapSection (NumbersSection sits between them)
provides:
  - NumbersSection component with animated Big Numbers (Volume, Pace, Engagement)
  - fetchLandingMetrics service with fallback-first pattern
  - useCountUp hook for requestAnimationFrame counter animation
  - AnimatedCounter UI primitive with useInView trigger and aria-live
  - Complete PT-BR and EN translations for numbers section
affects: []

# Tech tracking
tech-stack:
  added: []
  patterns: [fallback-first data fetching, rAF counter animation with easeOutCubic, locale-aware Intl.NumberFormat]

key-files:
  created:
    - src/features/landing/services/metricsApi.ts
    - src/features/landing/hooks/useCountUp.ts
    - src/features/landing/components/ui/AnimatedCounter.tsx
    - src/features/landing/components/sections/NumbersSection.tsx
  modified:
    - src/features/landing/i18n/translations.ts
    - src/features/landing/index.ts
    - src/app/(marketing)/page.tsx

key-decisions:
  - "Used requestAnimationFrame with easeOutCubic instead of animation library (zero bundle cost)"
  - "Fallback-first pattern: render hardcoded values immediately, replace silently on API success"

patterns-established:
  - "Fallback-first data fetching: useState initialized with fallback, useEffect fires fetch, silent replacement"
  - "rAF counter hook: useCountUp captures target via ref on enable, respects prefers-reduced-motion"
  - "Pace M:SS formatting with seconds >= 60 edge case handling"

requirements-completed: [PERF-01, PERF-02]

# Metrics
duration: 3min
completed: 2026-04-22
---

# Phase 4 Plan 1: Dynamic Data Summary

**API-driven Big Numbers section with animated counters (Volume 125K km, Pace 5:24 min/km, Engagement 94%), fallback-first fetch, and bilingual PT-BR/EN copy**

## Performance

- **Duration:** 3 min
- **Started:** 2026-04-22T19:21:25Z
- **Completed:** 2026-04-22T19:24:42Z
- **Tasks:** 2
- **Files modified:** 7

## Accomplishments
- Three animated Big Numbers render with locale-aware formatting in a responsive 3-column grid
- Fallback values display instantly on mount; API values replace silently if available
- Counter animation uses requestAnimationFrame with easeOutCubic easing and prefers-reduced-motion support
- All [Phase 4] translation placeholders replaced with final bilingual copy

## Task Commits

Each task was committed atomically:

1. **Task 1: Create service, hook, AnimatedCounter primitive, and update translations** - `46ed146` (feat)
2. **Task 2: Create NumbersSection, wire into page orchestrator, update barrel exports** - `f5391e4` (feat)

## Files Created/Modified
- `src/features/landing/services/metricsApi.ts` - fetchLandingMetrics with 5s timeout, FALLBACK_METRICS, LandingMetrics interface
- `src/features/landing/hooks/useCountUp.ts` - rAF counter hook with easeOutCubic, reduced-motion, SSR guard
- `src/features/landing/components/ui/AnimatedCounter.tsx` - Animated number display with useInView trigger and aria-live
- `src/features/landing/components/sections/NumbersSection.tsx` - Section with 3 number cards, API fetch, ScrollReveal stagger
- `src/features/landing/i18n/translations.ts` - Complete numbers copy for PT-BR and EN
- `src/features/landing/index.ts` - Added NumbersSection, AnimatedCounter, useCountUp exports
- `src/app/(marketing)/page.tsx` - Replaced numbers placeholder with NumbersSection

## Decisions Made
- Used requestAnimationFrame with easeOutCubic instead of animation library (zero bundle cost per UI-SPEC directive)
- Fallback-first pattern: useState initialized with FALLBACK_METRICS, useEffect fires fetch, silent replacement on success

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered
None

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- Landing page Dynamic Data section complete
- All 4 phases of the landing page milestone are now implemented
- API endpoint `/metrics/landing` not yet confirmed on backend; section works fully with fallback values

---
*Phase: 04-dynamic-data*
*Completed: 2026-04-22*
