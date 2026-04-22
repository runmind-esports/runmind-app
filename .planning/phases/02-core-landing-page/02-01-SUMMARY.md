---
phase: 02-core-landing-page
plan: 01
subsystem: ui
tags: [i18n, translations, react, tailwind, landing-page, lucide-react]

# Dependency graph
requires:
  - phase: 01-foundation
    provides: SectionWrapper, useLanguage hook, i18n type system, brand SVG assets
provides:
  - Complete PT-BR and EN translation dictionaries with all Phase 2 copy
  - 5 UI primitive components (CTAButton, FeatureCard, ProfileCard, AppMockup, IntegrationBadge)
  - DeepStringify and DeepWiden type utilities supporting readonly object arrays
  - scroll-behavior smooth CSS
affects: [02-02-PLAN, phase-03, phase-04]

# Tech tracking
tech-stack:
  added: []
  patterns: [readonly-array-type-utilities, anchor-vs-route-detection, css-only-mockup]

key-files:
  created:
    - src/features/landing/components/ui/CTAButton.tsx
    - src/features/landing/components/ui/FeatureCard.tsx
    - src/features/landing/components/ui/ProfileCard.tsx
    - src/features/landing/components/ui/AppMockup.tsx
    - src/features/landing/components/ui/IntegrationBadge.tsx
  modified:
    - src/features/landing/i18n/types.ts
    - src/features/landing/i18n/translations.ts
    - src/features/landing/index.ts
    - src/app/globals.css

key-decisions:
  - "DeepStringify and DeepWiden updated with readonly (infer U)[] pattern to support populated profile and link arrays"

patterns-established:
  - "Anchor vs route detection: CTAButton uses href.startsWith('#') to choose <a> vs <Link>"
  - "CSS-only mockup: AppMockup uses div placeholders instead of images for zero-dependency hero visual"

requirements-completed: [HERO-01, HERO-02, FEAT-01, FEAT-02, FEAT-03, CONV-01, SOCL-02]

# Metrics
duration: 2min
completed: 2026-04-22
---

# Phase 2 Plan 01: UI Primitives and Translation Dictionary Summary

**Complete PT-BR/EN translation dictionary with 4 profile items and 5 footer links, plus 5 UI primitive components (CTAButton, FeatureCard, ProfileCard, AppMockup, IntegrationBadge) with scroll-behavior smooth CSS**

## Performance

- **Duration:** 2 min
- **Started:** 2026-04-22T17:53:07Z
- **Completed:** 2026-04-22T17:55:28Z
- **Tasks:** 2
- **Files modified:** 9

## Accomplishments
- Updated translation dictionary replacing all [Phase 2] placeholders with final PT-BR and EN copy
- Fixed DeepStringify and DeepWiden type utilities to handle readonly object arrays (profiles.items, footer.links)
- Created 5 UI primitive components with proper Tailwind classes, accessibility attributes, and brand SVG references
- Added scroll-behavior: smooth to globals.css for anchor link navigation
- Updated barrel file with all new component exports

## Task Commits

Each task was committed atomically:

1. **Task 1: Update type system and translation dictionary** - `692f37f` (feat)
2. **Task 2: Create 5 UI primitive components** - `092e99c` (feat)

## Files Created/Modified
- `src/features/landing/i18n/types.ts` - DeepWiden with readonly array support
- `src/features/landing/i18n/translations.ts` - Complete Phase 2 copy in PT-BR and EN
- `src/features/landing/components/ui/CTAButton.tsx` - CTA button with primary/secondary variants and anchor/route detection
- `src/features/landing/components/ui/FeatureCard.tsx` - Feature card with LucideIcon, title, description
- `src/features/landing/components/ui/ProfileCard.tsx` - Profile card with emoji, name, stat, description
- `src/features/landing/components/ui/AppMockup.tsx` - CSS-only chat interface mockup with Strava button silhouette
- `src/features/landing/components/ui/IntegrationBadge.tsx` - Brand badge with SVG image and label
- `src/features/landing/index.ts` - Barrel file updated with 5 new component exports
- `src/app/globals.css` - Added scroll-behavior: smooth

## Decisions Made
- DeepStringify and DeepWiden updated with `readonly (infer U)[]` pattern to support populated profile and link arrays while maintaining `as const` compatibility

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered
None

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- All UI primitives ready for Plan 02 section composition (Hero, Features, Profiles, CTA, Footer)
- Translation dictionary complete for Phase 2 sections
- Phase 3 and Phase 4 placeholder strings remain untouched

---
*Phase: 02-core-landing-page*
*Completed: 2026-04-22*
