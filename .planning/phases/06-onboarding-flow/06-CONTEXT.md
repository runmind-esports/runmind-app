# Phase 6: Onboarding Flow - Context

**Gathered:** 2026-04-23
**Status:** Ready for planning

<domain>
## Phase Boundary

Multi-step onboarding UI: welcome screen with name confirmation, 10-question runner profile form (11 requirements split into 10 UI steps), progress tracking, and API submission. After form completion, user advances to the planilha screen (Phase 7).

</domain>

<decisions>
## Implementation Decisions

### D-01: State Management — useState with Step Index
Use `useState` for step navigation (`currentStep: number`) and form data accumulation (`answers: Record<string, string | boolean | number>`). No need for useReducer or react-hook-form — the wizard is a linear sequence of single-answer questions with no cross-field validation. The `useOnboarding` hook encapsulates all state.

### D-02: Auth Integration — JWT Decode for Username
Get the user's name from the JWT token using the existing `authApi.isAuthenticated()` pattern which decodes the token. Extract `username` from the JWT payload to pre-fill the welcome screen name input. This is the same pattern used in the chat feature.

### D-03: Route Protection — Client-Side Token Check
Protect `/onboarding` with the same pattern as `/chat`: check `tokenStorage.getAccessToken()` on mount, redirect to `/login` if missing. No server-side middleware needed (matches existing architecture — all routes are client-side protected).

### D-04: Form → API Mapping
Map the 10 UI answers to `SaveProfileRequest` from `src/features/onboarding/types/onboarding.types.ts` (created in Phase 5). The mapping follows D-02 from Phase 5 CONTEXT.md:
- Q1 (goal) → `goals: [selectedValue]`
- Q2 (fitness 1-5) → `fitnessLevel`: 1-2→"beginner", 3→"intermediate", 4-5→"advanced"
- Q3 (weekly km) → `weeklyKmCapacity`: map range to midpoint (2.5, 7.5, 15.5, 25.5, 40.0)
- Q4 (raced before) → `hasRacedBefore: boolean`
- Q5 (pace) → `pace5kSeconds`: map range to seconds (0, 450, 390, 330, 270)
- Q6 (days/week) → `preferredDays: string[]` (generate day names based on count)
- Q7 (other activities) → `otherActivities: { active: boolean }`
- Q8 (injury) → `injuriesHistory: { hasInjury: boolean }`
- Q9 (training preference) → `trainingPreference: "short_intense" | "long_moderate" | "any"`
- Q10 (strength training) → `includeStrengthTraining: boolean`

### D-05: Route Location — /onboarding
New Next.js page at `src/app/onboarding/page.tsx`. Does NOT use AuthLayout. Full-screen white background. After signup, user redirects here instead of `/chat`. After successful profile submission, navigates to Phase 7 route.

### D-06: Signup Redirect Change
Modify the existing signup flow to redirect to `/onboarding` instead of `/chat` after successful registration. This is a single-line change in `src/features/auth/hooks/useAuth.ts` or the signup page.

### D-07: Translation System
Create `src/features/onboarding/i18n/translations.ts` with PT-BR and EN copy as defined in the UI-SPEC. Use the same pattern as the existing landing page translations but as a standalone module (not integrated into the LanguageProvider from Phase 1 which was removed).

### D-08: Step Transition Animation
CSS-only slide transitions as defined in UI-SPEC. Enter from right (translateX(24px) → 0), exit to left (0 → -24px). Reverse for back navigation. 300ms ease-out. Respect `prefers-reduced-motion`.

### Claude's Discretion
- Internal component file organization within `src/features/onboarding/components/`
- Helper function naming and utilities
- Exact Tailwind class ordering
- Error retry logic details
- Whether to use a questions config array or individual step components

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### UI Design Contract
- `.planning/phases/06-onboarding-flow/06-UI-SPEC.md` — Complete visual/interaction spec (component inventory, layout, colors, typography, copy, accessibility)

### Phase 5 Integration
- `src/features/onboarding/types/onboarding.types.ts` — SaveProfileRequest and RunnerProfileResponse types (created in Phase 5)
- `src/features/onboarding/services/onboardingApi.ts` — saveProfile() and downloadSpreadsheet() functions (created in Phase 5)
- `src/features/onboarding/index.ts` — Existing barrel file (extend with new components)
- `.planning/phases/05-runner-profile-api/05-CONTEXT.md` §D-02 — Onboarding question → field mapping table

### Existing Auth Patterns
- `src/features/auth/hooks/useAuth.ts` — JWT decode, auth state, redirect pattern
- `src/shared/lib/apiClient.ts` — tokenStorage for route protection
- `src/app/(auth)/signup/page.tsx` — Current signup redirect target (change to /onboarding)
- `src/features/auth/schemas/auth.schema.ts` — Zod validation pattern reference

### Project Requirements
- `.planning/REQUIREMENTS.md` — ONB-01 through ONB-11

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `onboardingApi.saveProfile()` — Already created in Phase 5, ready to use
- `SaveProfileRequest` interface — TypeScript types matching backend DTOs
- `tokenStorage.getAccessToken()` — For route protection
- `authApi` patterns — JWT decode for username extraction
- `cn()` utility — Tailwind class merging from `src/lib/utils.ts`

### Established Patterns
- Client-side route protection via token check on mount (see Chat.tsx)
- Form validation with Zod schemas + react-hook-form (auth forms) — but NOT needed for onboarding (simple single-select)
- Feature module barrel exports via index.ts
- Error messages in Portuguese
- 'use client' directive on all interactive components

### Integration Points
- `src/app/onboarding/page.tsx` — New route entry point
- `src/features/onboarding/index.ts` — Extend existing barrel file with new components and hooks
- Signup flow — Change redirect from `/chat` to `/onboarding`
- After submission — Navigate to `/planilha` (Phase 7 route, placeholder for now)

</code_context>

<specifics>
## Specific Ideas

- Welcome screen should feel warm and personal — "Olá, Douglas!" with the user's actual name
- The form should feel fast — one question at a time, smooth transitions, no form fatigue
- Progress bar gives sense of completion — "Pergunta 3 de 10" keeps user motivated
- Mobile-first — most Brazilian runners will onboard on their phone
- Light mode only — matches auth pages for visual continuity after signup

</specifics>

<deferred>
## Deferred Ideas

- Onboarding via chat with AI (ONB-F01 — future requirement, v1.1 uses form)
- Strava data import to pre-fill fields (ONB-F02 — future)
- Skip onboarding option — not in v1.1 scope, every user completes profile
- Profile editing after onboarding — future settings feature

</deferred>

---

*Phase: 06-onboarding-flow*
*Context gathered: 2026-04-23 via auto mode*
