---
phase: 03-extended-content
plan: 01
subsystem: ui
tags: [react, intersection-observer, css-animation, i18n, tailwind]

# Dependency graph
requires:
  - phase: 02-sections-polish
    provides: SectionWrapper, LanguageProvider, translation dictionary structure, barrel file pattern
provides:
  - useInView hook (IntersectionObserver wrapper)
  - ScrollReveal component (scroll-triggered fade-up animation)
  - TimelineStep component (timeline step primitive with icon, connector, metric badge)
  - StatCard component (stat number + label card)
  - Populated flow and gap translations in ptBR and en
  - scroll-reveal CSS with prefers-reduced-motion override
affects: [03-extended-content plan 02, FlowSection, GapSection, HeroSection]

# Tech tracking
tech-stack:
  added: []
  patterns: [IntersectionObserver via custom hook, CSS data-attribute animation trigger, scroll-reveal with reduced-motion]

key-files:
  created:
    - src/features/landing/hooks/useInView.ts
    - src/features/landing/components/ui/ScrollReveal.tsx
    - src/features/landing/components/ui/TimelineStep.tsx
    - src/features/landing/components/ui/StatCard.tsx
  modified:
    - src/features/landing/i18n/translations.ts
    - src/features/landing/index.ts
    - src/app/globals.css

key-decisions:
  - "Used null! assertion on useRef to satisfy React 18 @types/react ref compatibility (avoids RefObject<T | null> vs LegacyRef<T> mismatch)"

patterns-established:
  - "useInView hook: returns [ref, isInView] tuple, observer disconnects after first intersection when once=true"
  - "ScrollReveal: CSS class + data-inview attribute pattern for scroll animations (no JS style manipulation)"
  - "Metric badge pattern: inline-flex with bg-accent-dim rounded badge for optional stat highlights"

requirements-completed: [JRNY-02, JRNY-03, ONBR-01]

# Metrics
duration: 4min
completed: 2026-04-22
---

# Phase 3 Plan 01: Animation Infrastructure & UI Primitives Summary

**useInView hook, ScrollReveal wrapper, TimelineStep/StatCard primitives, and fully populated flow/gap translations in ptBR and en**

## Performance

- **Duration:** 4 min
- **Started:** 2026-04-22T18:55:48Z
- **Completed:** 2026-04-22T18:59:26Z
- **Tasks:** 2
- **Files modified:** 7

## Accomplishments
- Built scroll-triggered animation infrastructure: useInView hook wrapping IntersectionObserver with configurable threshold/once/rootMargin, ScrollReveal component applying CSS fade-up via data-inview attribute
- Created TimelineStep primitive with icon circle, vertical connector line (hidden on last), title, description, and optional metric badge
- Created StatCard primitive with accent-colored number and muted label in bordered card
- Populated translation dictionary with 5 flow steps and 3 gap stats plus democratization message in both ptBR and en
- Added scroll-reveal CSS with prefers-reduced-motion override to globals.css
- Exported all new components and hook from barrel file

## Task Commits

Each task was committed atomically:

1. **Task 1: Create animation infrastructure** - `dbcd971` (feat)
2. **Task 2: Create UI primitives and populate translations** - `7799f55` (feat)

## Files Created/Modified
- `src/features/landing/hooks/useInView.ts` - IntersectionObserver hook returning [ref, isInView] tuple
- `src/features/landing/components/ui/ScrollReveal.tsx` - Scroll-triggered fade-up animation wrapper with configurable delay
- `src/features/landing/components/ui/TimelineStep.tsx` - Timeline step with icon circle, connector line, title, description, metric badge
- `src/features/landing/components/ui/StatCard.tsx` - Stat display card with accent number and muted label
- `src/features/landing/i18n/translations.ts` - Replaced Phase 3 placeholders with final copy (flow.steps, gap.stats, gap.message)
- `src/features/landing/index.ts` - Added exports for ScrollReveal, TimelineStep, StatCard, useInView
- `src/app/globals.css` - Added scroll-reveal CSS with reduced-motion override

## Decisions Made
- Used `null!` assertion on useRef to resolve React 18 `@types/react` ref type incompatibility (RefObject<T | null> vs LegacyRef<T>). This is a known React 18 typing quirk; safe because the ref is only read inside useEffect after mount.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Fixed useRef type incompatibility with React 18 @types/react**
- **Found during:** Task 1 (animation infrastructure)
- **Issue:** `useRef<HTMLDivElement | null>(null)` produces `RefObject<HTMLDivElement | null>` which is not assignable to the `ref` prop expecting `LegacyRef<HTMLDivElement>` in React 18 types
- **Fix:** Changed to `useRef<HTMLDivElement>(null!)` which produces `RefObject<HTMLDivElement>` compatible with the ref prop
- **Files modified:** src/features/landing/hooks/useInView.ts
- **Verification:** TypeScript compilation passes cleanly
- **Committed in:** dbcd971 (Task 1 commit)

**2. [Rule 2 - Missing Critical] Added barrel file exports for new components and hook**
- **Found during:** Task 2 (UI primitives)
- **Issue:** Plan listed barrel file update in files_modified but Task 2 action did not explicitly include index.ts updates
- **Fix:** Added exports for ScrollReveal, TimelineStep, StatCard, and useInView to src/features/landing/index.ts
- **Files modified:** src/features/landing/index.ts
- **Verification:** TypeScript compilation passes, exports available
- **Committed in:** 7799f55 (Task 2 commit)

---

**Total deviations:** 2 auto-fixed (1 bug, 1 missing critical)
**Impact on plan:** Both auto-fixes necessary for correctness. No scope creep.

## Issues Encountered
None

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- All primitives ready for Plan 02 to compose FlowSection and GapSection
- ScrollReveal ready for HeroSection entrance animation modifications
- Translation dictionary fully populated for flow and gap sections
- Phase 4 placeholders remain intact for future work

---
*Phase: 03-extended-content*
*Completed: 2026-04-22*
