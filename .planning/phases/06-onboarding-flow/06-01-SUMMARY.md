---
phase: 06-onboarding-flow
plan: 01
subsystem: onboarding
tags: [hooks, translations, components, state-management]
dependency_graph:
  requires: [onboardingApi, SaveProfileRequest, tokenStorage]
  provides: [useOnboarding, translations, OptionButton, ScaleInput, YesNoInput]
  affects: [onboarding/index.ts]
tech_stack:
  added: []
  patterns: [useState-based wizard state, answer-to-request mapping, i18n standalone module]
key_files:
  created:
    - src/features/onboarding/hooks/useOnboarding.ts
    - src/features/onboarding/i18n/translations.ts
    - src/features/onboarding/components/OptionButton.tsx
    - src/features/onboarding/components/ScaleInput.tsx
    - src/features/onboarding/components/YesNoInput.tsx
  modified: []
decisions:
  - Used useState over useReducer per D-01 for linear wizard state
  - Username from tokenStorage.getUsername() with email split per D-02
  - Standalone translations module (not integrated into provider) per D-07
metrics:
  duration: 137s
  completed: 2026-04-23T14:53:16Z
  tasks_completed: 2
  tasks_total: 2
  files_created: 5
  files_modified: 0
---

# Phase 06 Plan 01: Onboarding Foundation (Hook, Translations, Input Primitives) Summary

useState-based useOnboarding hook with 10-question step navigation, mapAnswersToRequest converting UI answers to SaveProfileRequest fields, complete PT-BR/EN translations, and three input primitives (OptionButton, ScaleInput, YesNoInput) matching UI-SPEC visual contract.

## What Was Built

### useOnboarding Hook
- Step navigation: 0 (welcome) through 10 (questions) with forward/backward direction tracking
- Answer state: `Record<string, string | boolean | number | null>` accumulated per question key
- `mapAnswersToRequest`: Internal helper converting all 10 UI answers to SaveProfileRequest fields per D-04 mapping (fitnessLevel ranges, weeklyKm midpoints, pace seconds, day arrays, preference strings)
- `canProceed`: Computed boolean with compound check for Q3 (running=true requires weeklyKm)
- `submitProfile`: Async function calling onboardingApi.saveProfile with Portuguese error message
- `confirmName`: Sets userName and advances to step 1
- Username initialization from tokenStorage with email detection (splits at `@`)

### Translations Module
- Complete PT-BR and EN copy for all 10 questions matching UI-SPEC copywriting contract
- Welcome screen, navigation, states, and yes/no option labels
- `getTranslations()` helper checking `navigator.language` with PT-BR as default
- Exported `OnboardingTranslations` type for type safety

### Input Primitives
- **OptionButton**: Selectable card with `#F5F6F7` default, `#00F048` green border on select, Lucide Check icon, hover states
- **ScaleInput**: 5 circular buttons (48px) in radiogroup with labels below, green fill on select
- **YesNoInput**: Side-by-side buttons with ThumbsUp/ThumbsDown icons, same visual states as OptionButton

## Commits

| Task | Commit | Description |
|------|--------|-------------|
| 1 | bf545dc | useOnboarding hook with step navigation and API mapping |
| 2 | 423d840 | Translations module and three input primitive components |

## Deviations from Plan

None - plan executed exactly as written.

## Verification

- TypeScript compilation: `npx tsc --noEmit --project tsconfig.json` passes with zero errors
- All 5 files created at specified paths
- useOnboarding exports all required state, computed values, and action functions
- Translations contain complete copy for all 10 questions in both languages
- Input components implement exact visual specs from UI-SPEC

## Self-Check: PASSED
