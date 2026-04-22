---
phase: 01-foundation
plan: 01
subsystem: i18n, ui
tags: [react-context, i18n, typescript, tailwindcss, as-const, satisfies]

requires: []
provides:
  - "LanguageProvider React context with cookie-based PT-BR/EN locale toggling"
  - "Typed translation dictionary with all landing page namespace keys"
  - "SectionWrapper responsive section layout primitive"
  - "Barrel file for landing feature module public API"
affects: [02-sections, 03-flow-gap, 04-big-numbers]

tech-stack:
  added: []
  patterns:
    - "DeepStringify/DeepWiden pattern for cross-locale type compatibility with satisfies"
    - "Cookie-based locale persistence via document.cookie API"
    - "Feature module barrel file export pattern for landing page"

key-files:
  created:
    - src/features/landing/i18n/types.ts
    - src/features/landing/i18n/translations.ts
    - src/features/landing/hooks/useLanguage.tsx
    - src/features/landing/components/ui/SectionWrapper.tsx
    - src/features/landing/index.ts
  modified: []

key-decisions:
  - "Used DeepStringify helper type to widen literal string types for satisfies operator, avoiding circular dependency between types.ts and translations.ts"
  - "Renamed useLanguage.ts to useLanguage.tsx since it contains JSX (LanguageProvider returns JSX)"

patterns-established:
  - "Translation dictionary: as const + satisfies DeepStringify for structural parity enforcement"
  - "LanguageProvider: cookie-based persistence with runmind_locale cookie, 1-year max-age"
  - "SectionWrapper: responsive padding px-4/sm:px-6/lg:px-8 py-16/sm:py-20/lg:py-24 max-w-7xl mx-auto"

requirements-completed: [INFRA-01]

duration: 4min
completed: 2026-04-22
---

# Phase 1 Plan 01: i18n Infrastructure and Landing Page Primitives Summary

**Cookie-based LanguageProvider with typed PT-BR/EN translation dictionary, SectionWrapper responsive layout primitive, and barrel file exports for landing feature module**

## Performance

- **Duration:** 4 min
- **Started:** 2026-04-22T16:38:26Z
- **Completed:** 2026-04-22T16:42:30Z
- **Tasks:** 2
- **Files modified:** 5

## Accomplishments
- Translation dictionary with all 10 namespace keys (meta, nav, hero, features, profiles, flow, numbers, gap, cta, footer) and compile-time structural parity via satisfies
- LanguageProvider with cookie persistence (runmind_locale), SSR-safe document check, and descriptive error on misuse
- SectionWrapper with responsive padding contract matching UI-SPEC exactly
- Barrel file exporting public API following existing codebase conventions

## Task Commits

Each task was committed atomically:

1. **Task 1: Create i18n translation system with type safety** - `7fad8fd` (feat)
2. **Task 2: Create LanguageProvider, useLanguage hook, SectionWrapper, and barrel file** - `d924fdc` (feat)

## Files Created/Modified
- `src/features/landing/i18n/types.ts` - Locale and TranslationKeys type exports with DeepWiden utility
- `src/features/landing/i18n/translations.ts` - PT-BR and EN translation dictionaries with all namespace keys
- `src/features/landing/hooks/useLanguage.tsx` - LanguageProvider context and useLanguage hook with cookie persistence
- `src/features/landing/components/ui/SectionWrapper.tsx` - Responsive section wrapper with dark mode variant
- `src/features/landing/index.ts` - Barrel file re-exporting public API

## Decisions Made
- Used DeepStringify/DeepWiden helper types to resolve circular dependency between types.ts and translations.ts while maintaining satisfies structural enforcement
- Renamed useLanguage from .ts to .tsx since LanguageProvider contains JSX
- Used empty readonly arrays (`[] as const`) for Phase 2+ array fields (profiles.items, flow.steps, gap.stats, footer.links) to maintain type structure without inventing content

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Resolved circular type dependency between translations.ts and types.ts**
- **Found during:** Task 1 (i18n system creation)
- **Issue:** Plan specified types.ts derives TranslationKeys from translations, and translations.ts imports TranslationKeys for satisfies -- creating a circular reference (TS2456)
- **Fix:** Added DeepStringify helper type in translations.ts to widen ptBR literals for satisfies check, and DeepWiden in types.ts for the exported TranslationKeys type
- **Files modified:** src/features/landing/i18n/translations.ts, src/features/landing/i18n/types.ts
- **Verification:** npx tsc --noEmit passes with zero errors
- **Committed in:** 7fad8fd (Task 1), d924fdc (Task 2 - types.ts update)

**2. [Rule 3 - Blocking] Renamed useLanguage.ts to useLanguage.tsx for JSX support**
- **Found during:** Task 2 (LanguageProvider creation)
- **Issue:** TypeScript compiler reported JSX parsing errors because LanguageProvider renders JSX but file extension was .ts
- **Fix:** Renamed to .tsx; barrel file import resolves correctly without path change
- **Files modified:** src/features/landing/hooks/useLanguage.tsx
- **Verification:** npx tsc --noEmit passes with zero errors
- **Committed in:** d924fdc (Task 2)

---

**Total deviations:** 2 auto-fixed (2 blocking)
**Impact on plan:** Both fixes necessary for TypeScript compilation. No scope creep.

## Issues Encountered
None beyond the auto-fixed deviations above.

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- Landing feature module foundation complete with i18n and layout primitives
- Phase 1 Plan 02 can build the (marketing) route group and page orchestrator consuming these exports
- Phase 2 can populate translation dictionary placeholders and build section components using SectionWrapper

## Self-Check: PASSED

- All 5 files found on disk
- Both task commits (7fad8fd, d924fdc) found in git history
- npx tsc --noEmit passes with zero landing-related errors

---
*Phase: 01-foundation*
*Completed: 2026-04-22*
