---
phase: 06-onboarding-flow
reviewed: 2026-04-22T12:00:00Z
depth: standard
files_reviewed: 8
files_reviewed_list:
  - src/features/onboarding/hooks/useOnboarding.ts
  - src/features/onboarding/i18n/translations.ts
  - src/features/onboarding/components/OptionButton.tsx
  - src/features/onboarding/components/ScaleInput.tsx
  - src/features/onboarding/components/YesNoInput.tsx
  - src/features/onboarding/index.ts
  - src/features/onboarding/services/onboardingApi.ts
  - src/features/onboarding/types/onboarding.types.ts
files_not_found:
  - src/features/onboarding/components/ProgressBar.tsx
  - src/features/onboarding/components/OnboardingNavigation.tsx
  - src/features/onboarding/components/WelcomeStep.tsx
  - src/features/onboarding/components/QuestionStep.tsx
  - src/features/onboarding/components/OnboardingFlow.tsx
  - src/app/onboarding/page.tsx
findings:
  critical: 1
  warning: 4
  info: 3
  total: 8
status: issues_found
---

# Phase 6: Code Review Report

**Reviewed:** 2026-04-22T12:00:00Z
**Depth:** standard
**Files Reviewed:** 8 (6 files listed in config do not exist yet)
**Status:** issues_found

## Summary

The onboarding feature is partially implemented. Core hook logic (`useOnboarding`), i18n translations, three input components (`OptionButton`, `ScaleInput`, `YesNoInput`), the API service, types, and barrel file are present. The higher-level components (`ProgressBar`, `OnboardingNavigation`, `WelcomeStep`, `QuestionStep`, `OnboardingFlow`) and the page route (`src/app/onboarding/page.tsx`) do not exist yet.

The existing code is generally well-structured and follows project conventions. Key concerns are: (1) `goNext` calls `submitProfile` without awaiting the result or handling post-submit navigation, (2) the barrel file does not export the hook or components, and (3) the `weeklyKm` answer key used in validation is not part of any question step mapping.

Also reviewed: `src/features/auth/hooks/useAuth.ts` and `src/app/(auth)/signup/page.tsx` -- these are unchanged existing files with no new issues introduced.

## Critical Issues

### CR-01: goNext fires submitProfile without await -- no post-submit navigation or error feedback

**File:** `src/features/onboarding/hooks/useOnboarding.ts:137-139`
**Issue:** When `currentStep === 10`, `goNext` calls `submitProfile()` but does not `await` the result. This means:
1. The caller has no way to know when submission completes or fails.
2. `isSubmitting` is set to `true` but never reset to `false` on success (only on error at line 131).
3. There is no navigation after successful submission -- the user is stuck on the last step with a spinner.

**Fix:**
```typescript
const goNext = useCallback(async () => {
  if (currentStep === 10) {
    const result = await submitProfile()
    if (result) {
      // Navigate to chat or success screen
      window.location.href = '/chat'
    }
    return
  }
  setDirection('forward')
  setCurrentStep((prev) => Math.min(prev + 1, 10))
}, [currentStep, submitProfile])
```

Also add `setIsSubmitting(false)` in the success path of `submitProfile`:
```typescript
try {
  const request = mapAnswersToRequest(answers, userName)
  const response = await onboardingApi.saveProfile(request)
  setIsSubmitting(false)
  return response
} catch (error) {
  // ...existing error handling
}
```

## Warnings

### WR-01: weeklyKm answer key is validated but never populated by any question mapping

**File:** `src/features/onboarding/hooks/useOnboarding.ts:114-115`
**Issue:** `canProceed` checks `answers.weeklyKm` when `running === true`, and `mapAnswersToRequest` reads `answers.weeklyKm` at line 50. However, `weeklyKm` is not in `QUESTION_KEYS` and no question step populates it. The `QuestionStep` component (which does not exist yet) must call `setAnswer('weeklyKm', value)` as a follow-up to Q3, but this coupling is implicit and fragile. If the future `QuestionStep` uses a different key, `canProceed` will always return `false` for Q3 when the user answers "yes."

**Fix:** Document this coupling explicitly by adding `weeklyKm` as a dependent key in a comment near `QUESTION_KEYS`, or restructure Q3 to use a compound answer object:
```typescript
// In QUESTION_KEYS or a separate constant:
// Q3 ('running') has a dependent sub-question keyed as 'weeklyKm'
```

### WR-02: mapAnswersToRequest does not validate answer types -- unsafe casts throughout

**File:** `src/features/onboarding/hooks/useOnboarding.ts:34-92`
**Issue:** Every answer is cast with `as string`, `as boolean`, or `as number` without validation. If a question is skipped or the answer has an unexpected type (e.g., `null` slips through despite `canProceed` checks), these casts will silently produce incorrect API payloads. For example, `answers.goal as string` could be `null as string`, and `goals: [null]` would be sent to the API.

**Fix:** Add runtime guards before the API call:
```typescript
if (typeof answers.goal !== 'string') throw new Error('Missing goal')
if (typeof answers.fitness !== 'number') throw new Error('Missing fitness')
// ...etc
```
Or use Zod to validate the answers object before mapping.

### WR-03: Barrel file does not export hook or components

**File:** `src/features/onboarding/index.ts:1-5`
**Issue:** The barrel file only exports `onboardingApi`, `SaveProfileRequest`, `RunnerProfileResponse`, and `ApiErrorResponse`. It does not export `useOnboarding`, `OptionButton`, `ScaleInput`, or `YesNoInput`. Per project conventions, the barrel file should be the public API for the feature module.

**Fix:**
```typescript
// Components
export { OptionButton } from './components/OptionButton'
export { ScaleInput } from './components/ScaleInput'
export { YesNoInput } from './components/YesNoInput'

// Hooks
export { useOnboarding } from './hooks/useOnboarding'

// Services
export { onboardingApi } from './services/onboardingApi'

// Types
export type { SaveProfileRequest, RunnerProfileResponse, ApiErrorResponse } from './types/onboarding.types'
```

### WR-04: ScaleInput radiogroup missing aria-label

**File:** `src/features/onboarding/components/ScaleInput.tsx:13`
**Issue:** The `div` with `role="radiogroup"` has no `aria-label` or `aria-labelledby` attribute. Screen readers will announce it as an unlabeled radio group.

**Fix:**
```tsx
interface ScaleInputProps {
  value: number | null
  onChange: (value: number) => void
  labels: string[]
  ariaLabel?: string
}

export function ScaleInput({ value, onChange, labels, ariaLabel }: ScaleInputProps) {
  return (
    <div role="radiogroup" aria-label={ariaLabel} className="flex gap-2 justify-between">
```

## Info

### IN-01: Translation strings use plain characters instead of proper Portuguese diacritics

**File:** `src/features/onboarding/i18n/translations.ts:4-58`
**Issue:** Multiple PT-BR strings are missing accents and cedillas: `Ola` should be `Ola` (though the greeting likely needs `Ola`), `voce` should be `voce` (needs `voce`), `e` should be `e` (needs accent), `fisico` should be `fisico`, `Nao` should be `Nao`, `opcao` should be `opcao`, `restricao` should be `restricao`, `forca` should be `forca`. Examples:
- Line 4: `'Ola, {name}!'` -> `'Ola, {name}!'`
- Line 18: `'Como voce avalia seu condicionamento fisico?'` -> missing accents
- Line 63: `'Nao'` -> missing til

**Fix:** Review all PT-BR strings and add proper Unicode diacritics (a, e, i, o, u, a, o, c, etc.).

### IN-02: goal options use display strings as answer values

**File:** `src/features/onboarding/hooks/useOnboarding.ts:81`
**Issue:** `goals: [answers.goal as string]` sends the localized display string (e.g., `'Correr 5km'` or `'Run 5km'`) as the API value. If the user's locale is English, the API receives English strings; if PT-BR, Portuguese. This creates inconsistent data in the backend. Other questions (pace, days, preference) correctly use internal keys mapped to API values.

**Fix:** Use internal keys for goal options (like the other questions do) and map display strings in the UI layer only.

### IN-03: Six files listed in review config do not exist

**Files:**
- `src/features/onboarding/components/ProgressBar.tsx`
- `src/features/onboarding/components/OnboardingNavigation.tsx`
- `src/features/onboarding/components/WelcomeStep.tsx`
- `src/features/onboarding/components/QuestionStep.tsx`
- `src/features/onboarding/components/OnboardingFlow.tsx`
- `src/app/onboarding/page.tsx`

**Issue:** These files are listed in the review scope but have not been created yet. They are likely part of a future implementation phase. A follow-up review should be triggered once they are implemented.

**Fix:** No action needed now. Ensure these files are included in the next code review cycle.

---

_Reviewed: 2026-04-22T12:00:00Z_
_Reviewer: Claude (gsd-code-reviewer)_
_Depth: standard_
