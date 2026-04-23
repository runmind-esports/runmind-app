# Phase 6: Onboarding Flow - Research

**Researched:** 2026-04-22
**Domain:** Multi-step form wizard, React state management, CSS transitions, i18n
**Confidence:** HIGH

## Summary

Phase 6 builds a full-screen, multi-step onboarding wizard at `/onboarding`. The phase extends the existing `src/features/onboarding/` module (created in Phase 5 with types, services, and barrel file) by adding components, hooks, and i18n translations. The technical domain is straightforward: React component composition with useState for step navigation, CSS transitions for step animations, and a standalone translation object for PT-BR/EN copy.

The codebase already provides all integration points: `onboardingApi.saveProfile()` for API submission, `tokenStorage` for route protection, `authApi` for JWT decode (username extraction), and established patterns for client-side routing. No new libraries are needed. The main complexity is UI fidelity to the spec (10 distinct question types, conditional Q3 follow-up, animation direction tracking) and correctly mapping UI answers to the `SaveProfileRequest` interface.

**Primary recommendation:** Build a config-driven question array where each question defines its type (`single-select`, `scale`, `yes-no`, `yes-no-conditional`), options, and field mapping. The `useOnboarding` hook manages step index, accumulated answers, direction state (for animations), and the final mapping to `SaveProfileRequest`. Components are stateless renderers.

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions
- **D-01:** State Management -- useState with step index. No useReducer or react-hook-form. `useOnboarding` hook encapsulates all state.
- **D-02:** Auth Integration -- JWT decode for username. Extract `username` from JWT payload to pre-fill welcome screen.
- **D-03:** Route Protection -- Client-side token check. Same pattern as `/chat`.
- **D-04:** Form to API Mapping -- Explicit mapping from 10 UI answers to `SaveProfileRequest` fields (goal, fitnessLevel, weeklyKmCapacity, hasRacedBefore, pace5kSeconds, preferredDays, otherActivities, injuriesHistory, trainingPreference, includeStrengthTraining).
- **D-05:** Route Location -- `/onboarding` at `src/app/onboarding/page.tsx`. Full-screen white background. No AuthLayout.
- **D-06:** Signup Redirect Change -- Modify signup flow to redirect to `/onboarding` instead of `/chat`.
- **D-07:** Translation System -- Standalone `src/features/onboarding/i18n/translations.ts` with PT-BR and EN.
- **D-08:** Step Transition Animation -- CSS-only slide transitions. 300ms ease-out. Respect `prefers-reduced-motion`.

### Claude's Discretion
- Internal component file organization within `src/features/onboarding/components/`
- Helper function naming and utilities
- Exact Tailwind class ordering
- Error retry logic details
- Whether to use a questions config array or individual step components

### Deferred Ideas (OUT OF SCOPE)
- Onboarding via chat with AI (ONB-F01)
- Strava data import to pre-fill fields (ONB-F02)
- Skip onboarding option
- Profile editing after onboarding
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| ONB-01 | Welcome screen with imported user data (name) | JWT decode pattern in `authApi.ts` line 10-18; `tokenStorage.getUsername()` for cached name |
| ONB-02 | User can confirm/edit name before form | WelcomeStep component with controlled input, pre-filled from JWT |
| ONB-03 | Goal selection (4 options) | Single-select OptionButton component, maps to `goals: [selectedValue]` |
| ONB-04 | Fitness level (scale 1-5) | ScaleInput component, maps 1-2=beginner, 3=intermediate, 4-5=advanced |
| ONB-05 | Running regularity + km/week range | YesNoInput with conditional follow-up (slide-down reveal of 5 km range options) |
| ONB-06 | Race participation (yes/no) | YesNoInput, maps to `hasRacedBefore: boolean` |
| ONB-07 | Current pace (5 options) | Single-select OptionButton, maps to `pace5kSeconds` in seconds |
| ONB-08 | Training days per week (4 options) | Single-select OptionButton, maps to `preferredDays: string[]` |
| ONB-09 | Other activities + injury (2 sub-questions = 2 UI steps) | Two separate YesNoInput steps (Q7 and Q8 in UI) |
| ONB-10 | Training preference (3 options) | Single-select OptionButton, maps to `trainingPreference` |
| ONB-11 | Strength training inclusion (yes/no) | YesNoInput, maps to `includeStrengthTraining: boolean` |
</phase_requirements>

## Standard Stack

### Core (already installed -- no new dependencies)

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| React 18 | ^18 | UI rendering, useState/useCallback hooks | Already in project |
| Next.js 14 | 14.2.21 | App Router, page routing | Already in project |
| Tailwind CSS | ^3.4.1 | Utility-first styling, all component visuals | Already in project |
| Lucide React | ^0.312.0 | Icons (Check, ThumbsUp, ThumbsDown) | Already in project |

### Supporting (already installed)

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| clsx | ^2.1.0 | Conditional class joining | Dynamic state-based classes on option buttons |
| tailwind-merge | ^2.2.0 | Class deduplication | Via `cn()` utility |

### No New Dependencies Required

Phase 6 requires zero npm installs. All functionality is achievable with existing project dependencies. [VERIFIED: read package.json dependencies and existing code]

**Installation:**
```bash
# No installation needed -- all dependencies already present
```

## Architecture Patterns

### Recommended Project Structure

```
src/features/onboarding/
├── components/
│   ├── OnboardingFlow.tsx       # Root orchestrator (step state, renders current step)
│   ├── WelcomeStep.tsx          # Name confirmation screen
│   ├── QuestionStep.tsx         # Renders single question with its input type
│   ├── ProgressBar.tsx          # Horizontal progress bar + "Pergunta N de 10"
│   ├── OptionButton.tsx         # Selectable option card
│   ├── ScaleInput.tsx           # 1-5 circular scale selector
│   ├── YesNoInput.tsx           # Two-button yes/no selector
│   └── OnboardingNavigation.tsx # Back + Next/Submit buttons
├── hooks/
│   └── useOnboarding.ts         # Step navigation, form data, API submission
├── i18n/
│   └── translations.ts         # PT-BR and EN copy (standalone, no provider)
├── services/
│   └── onboardingApi.ts         # EXISTS (Phase 5) -- do not modify
├── types/
│   └── onboarding.types.ts      # EXISTS (Phase 5) -- do not modify
└── index.ts                     # EXISTS -- extend with new exports
```

### Pattern 1: Config-Driven Question Array

**What:** Define all 10 questions as a typed configuration array. Each entry declares the question key, input type, options, and mapping function.
**When to use:** When you have N similar-shaped UI steps that vary only in content and input type.
**Example:**

```typescript
// Source: project convention inference [ASSUMED]
interface QuestionConfig {
  key: string
  type: 'single-select' | 'scale' | 'yes-no' | 'yes-no-conditional'
  optionKeys?: string[]  // keys into translations
  conditionalOptions?: string[]  // for yes-no-conditional (Q3)
}

const QUESTIONS: QuestionConfig[] = [
  { key: 'goal', type: 'single-select', optionKeys: ['run5k', 'run10k', 'improve5k', 'improve10k'] },
  { key: 'fitness', type: 'scale' },
  { key: 'running', type: 'yes-no-conditional', conditionalOptions: ['upTo5', 'upTo10', '11to20', '21to30', 'over30'] },
  { key: 'raced', type: 'yes-no' },
  { key: 'pace', type: 'single-select', optionKeys: ['dontKnow', 'above7', '6to7', '5to6', 'below5'] },
  { key: 'days', type: 'single-select', optionKeys: ['2days', '3days', '4days', '5plus'] },
  { key: 'otherActivities', type: 'yes-no' },
  { key: 'injury', type: 'yes-no' },
  { key: 'preference', type: 'single-select', optionKeys: ['shortIntense', 'longModerate', 'any'] },
  { key: 'strength', type: 'yes-no' },
]
```

### Pattern 2: Step Transition with Direction State

**What:** Track navigation direction (`'forward' | 'backward'`) in the hook. Pass direction to the step container to apply correct CSS animation class.
**When to use:** Bidirectional wizard navigation with different enter/exit animations.
**Example:**

```typescript
// Source: UI-SPEC animation contract [VERIFIED: 06-UI-SPEC.md]
// In useOnboarding hook:
const [direction, setDirection] = useState<'forward' | 'backward'>('forward')

const goNext = useCallback(() => {
  setDirection('forward')
  setCurrentStep(prev => prev + 1)
}, [])

const goBack = useCallback(() => {
  setDirection('backward')
  setCurrentStep(prev => prev - 1)
}, [])

// In component, use key to force remount + CSS animation:
// <div key={currentStep} className={direction === 'forward' ? 'animate-slide-in-right' : 'animate-slide-in-left'}>
```

### Pattern 3: Standalone Translation Module

**What:** A simple object with `ptBR` and `en` keys, consumed directly via import. No React context, no provider.
**When to use:** Feature-scoped i18n where the project has no global i18n system.
**Example:**

```typescript
// src/features/onboarding/i18n/translations.ts
// Source: CONTEXT.md D-07 [VERIFIED: 06-CONTEXT.md]

const translations = {
  ptBR: {
    welcome: {
      greeting: 'Ola, {name}!',
      subtitle: 'Vamos configurar seu perfil de corredor em menos de 2 minutos.',
      nameLabel: 'Seu nome',
      namePlaceholder: 'Como quer ser chamado?',
      cta: 'Continuar',
      nameRequired: 'Por favor, informe seu nome',
    },
    // ... questions, navigation, states, options
  },
  en: {
    // ... same structure, English copy
  },
}

// Usage: import { translations } from '../i18n/translations'
// const t = translations.ptBR  // or detect from browser
export { translations }
```

### Anti-Patterns to Avoid

- **Over-engineering state:** Do NOT use useReducer, Zustand, or React Context for 10 simple form answers. useState with a Record is sufficient per D-01.
- **Auto-advancing on selection:** The spec explicitly says "Does NOT auto-advance -- user must click Continuar." Do not implement auto-advance.
- **Using react-hook-form:** Per D-01, the wizard is single-answer questions. react-hook-form adds unnecessary complexity here.
- **Using AuthLayout:** Per D-05 and UI-SPEC, the onboarding is full-screen centered, not the split-panel auth layout.
- **Modifying Phase 5 files:** The types and services files are locked. Only extend the barrel file.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Class merging | Custom class concat | `cn()` from `src/lib/utils.ts` | Handles Tailwind class conflicts |
| JWT decode | Custom parser | `decodeJwtPayload()` pattern from `authApi.ts` | Already tested, handles errors |
| API calls | Raw fetch/axios | `onboardingApi.saveProfile()` from Phase 5 | Already typed and configured with auth interceptor |
| Route protection | Custom middleware | Copy Chat.tsx pattern (useAuth + useEffect redirect) | Consistent with project convention |

## Common Pitfalls

### Pitfall 1: Q3 Conditional Follow-Up State
**What goes wrong:** The conditional km/week options in Q3 create a compound answer (yes/no + km range). If only "Sim" is selected without a km range, the user shouldn't be able to proceed. If "Nao" is selected, km range must clear.
**Why it happens:** Simple boolean state doesn't capture the compound nature.
**How to avoid:** Store Q3 answer as `{ runsRegularly: boolean, weeklyKm?: string }`. Only enable "Continuar" when either `runsRegularly === false` OR (`runsRegularly === true` AND `weeklyKm` is set). When user switches from "Sim" to "Nao", clear `weeklyKm`.
**Warning signs:** User can proceed with "Sim" but no km range selected.

### Pitfall 2: Animation Key Conflicts
**What goes wrong:** Step transitions don't animate because React reuses the DOM node.
**Why it happens:** Without a unique `key` prop, React sees the same component type and patches in place.
**How to avoid:** Use `key={currentStep}` on the step container to force unmount/remount, triggering CSS animation on mount.
**Warning signs:** Content changes but no slide animation occurs.

### Pitfall 3: Signup Redirect Chain
**What goes wrong:** After signup, user goes to `/connect-apps` (current flow) but should go to `/onboarding`. Or the redirect in `useAuth.ts` conflicts with the signup page redirect.
**Why it happens:** There are multiple redirect points: `useAuth.ts` registerMutation onSuccess pushes to `/connect-apps`, and `signup/page.tsx` has a separate authenticated redirect to `/chat`.
**How to avoid:** Change `useAuth.ts` line 40 (`router.push('/connect-apps')`) to `router.push('/onboarding')`. Also update `connect-apps/page.tsx` line 248 to push to `/onboarding` instead of `/chat` (for users who reach connect-apps via other paths). Update `signup/page.tsx` line 34 authenticated redirect to `/onboarding`.
**Warning signs:** User ends up at `/chat` or `/connect-apps` after signup instead of `/onboarding`.

### Pitfall 4: Form-to-API Mapping Errors
**What goes wrong:** UI answer values don't match `SaveProfileRequest` field types. E.g., sending string "3" instead of number 3 for `weeklyKmCapacity`.
**Why it happens:** UI state stores everything as strings; API expects specific types (number, boolean, string[]).
**How to avoid:** Create an explicit `mapAnswersToRequest()` function that converts UI answers to the typed `SaveProfileRequest`. Test each mapping individually. Reference D-04 in CONTEXT.md for the exact mapping table.
**Warning signs:** API returns 400/422 errors on profile submission.

### Pitfall 5: Username Extraction Inconsistency
**What goes wrong:** Welcome screen shows empty or wrong name.
**Why it happens:** JWT payload structure varies: could have `username`, `email`, or neither. `tokenStorage.getUsername()` returns the cached value which might be an email address.
**How to avoid:** Use `tokenStorage.getUsername()` first (already set during login/register in `authApi.ts`). If it looks like an email, split at `@`. The welcome screen has an editable name input, so the user can always correct it.
**Warning signs:** Welcome screen shows "Ola, undefined!" or "Ola, user@email.com!".

## Code Examples

### Route Protection Pattern (from Chat.tsx)

```typescript
// Source: src/features/chat/components/Chat.tsx [VERIFIED: codebase]
'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/features/auth/hooks/useAuth'

export function OnboardingFlow({ userName }: { userName: string }) {
  const router = useRouter()
  const { isAuthenticated, isLoading: authLoading } = useAuth()

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login')
    }
  }, [authLoading, isAuthenticated, router])

  if (authLoading || !isAuthenticated) return null
  // ... render wizard
}
```

### CSS Animation Classes

```css
/* Source: UI-SPEC interaction contract [VERIFIED: 06-UI-SPEC.md] */
/* Define in Tailwind config or as inline styles */

/* Forward: enter from right */
@keyframes slide-in-right {
  from { transform: translateX(24px); opacity: 0; }
  to { transform: translateX(0); opacity: 1; }
}

/* Backward: enter from left */
@keyframes slide-in-left {
  from { transform: translateX(-24px); opacity: 0; }
  to { transform: translateX(0); opacity: 1; }
}

@media (prefers-reduced-motion: reduce) {
  .animate-slide-in-right,
  .animate-slide-in-left {
    animation: none !important;
  }
}
```

### Answer-to-API Mapping Function

```typescript
// Source: CONTEXT.md D-04 [VERIFIED: 06-CONTEXT.md]
import type { SaveProfileRequest } from '../types/onboarding.types'

function mapAnswersToRequest(
  answers: Record<string, string | boolean | number>,
  name: string,
): SaveProfileRequest {
  const fitnessValue = answers.fitness as number
  const fitnessLevel = fitnessValue <= 2 ? 'beginner'
    : fitnessValue === 3 ? 'intermediate'
    : 'advanced'

  const weeklyKmMap: Record<string, number> = {
    'upTo5': 2.5, 'upTo10': 7.5, '11to20': 15.5, '21to30': 25.5, 'over30': 40.0,
  }

  const paceMap: Record<string, number> = {
    'dontKnow': 0, 'above7': 450, '6to7': 390, '5to6': 330, 'below5': 270,
  }

  const daysMap: Record<string, string[]> = {
    '2days': ['tuesday', 'thursday'],
    '3days': ['monday', 'wednesday', 'friday'],
    '4days': ['monday', 'tuesday', 'thursday', 'saturday'],
    '5plus': ['monday', 'tuesday', 'wednesday', 'thursday', 'saturday'],
  }

  return {
    goals: [answers.goal as string],
    fitnessLevel,
    weeklyKmCapacity: answers.runsRegularly
      ? weeklyKmMap[answers.weeklyKm as string] || 0
      : 0,
    hasRacedBefore: answers.raced as boolean,
    pace5kSeconds: paceMap[answers.pace as string] || 0,
    preferredDays: daysMap[answers.days as string] || [],
    otherActivities: { active: answers.otherActivities as boolean },
    injuriesHistory: { hasInjury: answers.injury as boolean },
    trainingPreference: answers.preference as string,
    includeStrengthTraining: answers.strength as boolean,
  }
}
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Multi-step form with react-hook-form | Simple useState for single-answer wizards | Current best practice | Less boilerplate for linear wizards with no cross-field validation |
| Framer Motion for page transitions | CSS @keyframes with key-based remount | Ongoing trend | Zero bundle size impact, sufficient for simple slide animations |
| Global i18n providers (react-intl, i18next) | Feature-scoped translation objects | Context-dependent | Appropriate when only one feature needs translations |

## Assumptions Log

| # | Claim | Section | Risk if Wrong |
|---|-------|---------|---------------|
| A1 | Config-driven question array is the best approach (vs individual step components) | Architecture Patterns | LOW -- either approach works, this is within Claude's discretion |
| A2 | Browser language detection (`navigator.language`) can select PT-BR vs EN | Architecture Patterns | LOW -- PT-BR is default, EN is secondary |
| A3 | CSS keyframe animations with key-based remount will produce smooth transitions | Code Examples | LOW -- well-established React pattern |

## Open Questions

1. **Post-onboarding navigation target**
   - What we know: After successful profile submission, user navigates to Phase 7 route (`/planilha`)
   - What's unclear: Phase 7 is not yet implemented. Should we navigate to `/planilha` (will 404) or `/chat` as fallback?
   - Recommendation: Navigate to `/planilha`. If Phase 7 isn't built yet, the page can be a placeholder. The redirect target is a one-line change later.

2. **Language selection mechanism**
   - What we know: D-07 says standalone translations module with PT-BR and EN
   - What's unclear: How does the user switch languages? Is there a toggle? Or is it browser-detected?
   - Recommendation: Default to PT-BR (matching project convention). Use `navigator.language` to detect EN. No manual toggle in onboarding -- keep it simple.

## Project Constraints (from CLAUDE.md)

- **Tech stack:** Next.js 14 + React 18 + Tailwind CSS -- no additions
- **Route convention:** New page at `/onboarding`, do not alter existing routes except signup redirect
- **i18n:** PT-BR as default, EN as secondary
- **Code style:** Single quotes, no semicolons, 2-space indentation, trailing commas
- **Components:** Named function exports (`export function X() {}`), not arrow functions
- **Client components:** Must start with `'use client'` directive
- **Naming:** PascalCase components, camelCase hooks with `use` prefix, camelCase services
- **Imports:** `@/*` alias for `src/*`, relative paths within feature
- **Error messages:** Portuguese (pt-BR)
- **Feature organization:** Components, hooks, services, types in `src/features/onboarding/`
- **Barrel exports:** Public API through `index.ts`

## Sources

### Primary (HIGH confidence)
- `src/features/onboarding/` -- Existing Phase 5 types, services, barrel file (read directly)
- `src/features/auth/hooks/useAuth.ts` -- Auth hook with redirect pattern (read directly)
- `src/features/auth/services/authApi.ts` -- JWT decode, tokenStorage usage (read directly)
- `src/features/chat/components/Chat.tsx` -- Route protection pattern (read directly)
- `src/shared/lib/apiClient.ts` -- tokenStorage API (read directly)
- `06-UI-SPEC.md` -- Complete visual and interaction contract (read directly)
- `06-CONTEXT.md` -- Locked decisions D-01 through D-08 (read directly)

### Secondary (MEDIUM confidence)
- `src/app/(auth)/signup/page.tsx` -- Signup redirect flow, lines 32-34 (read directly)
- `src/app/(auth)/connect-apps/page.tsx` -- Connect-apps redirect to chat, line 248 (read directly)

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH -- no new libraries, all verified in codebase
- Architecture: HIGH -- follows established project patterns, all integration points verified
- Pitfalls: HIGH -- based on direct codebase reading (redirect chain, JWT payload structure)

**Research date:** 2026-04-22
**Valid until:** 2026-05-22 (stable -- no external dependency changes)
