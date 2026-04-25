# Phase 16: Onboarding Visual Upgrade - Context

**Gathered:** 2026-04-25
**Status:** Ready for planning

<domain>
## Phase Boundary

Visual upgrade das telas de onboarding (welcome + 10 question steps) com SVG illustrations, animações CSS premium e layout aprimorado. Mobile-first, inspirado em NRC e Strava onboarding. A tela de planilha (PlanilhaScreen) foi removida do escopo — não será usada.

</domain>

<decisions>
## Implementation Decisions

### Illustrations & Imagery
- **D-01:** SVG illustrations — flat modern style with gradients using RunMind palette (navy #14162E + neon green #00F048). No external libraries (no Lottie).
- **D-02:** Welcome screen gets a hero SVG illustration in the top ~40% of screen height (runner silhouette / running-themed).
- **D-03:** Each of the 10 question screens gets a small themed SVG icon (48-64px) above the question text. Cohesive set matching the flat gradient style.
- **D-04:** Planilha/celebration screen removed — not used. After last question, show a brief success screen (2-3 seconds) with "Perfil salvo!" message and check animation, then redirect to /chat.

### Animations & Micro-interactions
- **D-05:** Medium animation level — all CSS/Tailwind, no animation library (no framer-motion). Upgrade existing slide transitions + add new patterns.
- **D-06:** Staggered option reveal — options fade+slide in one by one with ~80ms delay per option (CSS animation-delay).
- **D-07:** Selection feedback — selected option does scale(1.02) bounce with a green checkmark icon appearing. CSS transitions.
- **D-08:** Additional animations: fade-in for illustrations on screen enter, progress bar spring/smooth animation, button press scale effect.
- **D-09:** Respect `prefers-reduced-motion` (carried from Phase 6 D-08).

### Layout & Visual Hierarchy
- **D-10:** Welcome screen gets a subtle navy-to-transparent gradient in the top ~40% behind the illustration, fading into white for the form area below.
- **D-11:** Question screens keep open layout — no card wrapper. Question text + icon + options float on white background. Clean breathing room on mobile.
- **D-12:** Existing component structure preserved — upgrade WelcomeStep, QuestionStep, OptionButton, ProgressBar visuals without changing the state management or flow logic.

### Post-Onboarding Transition
- **D-13:** After submitting the last question, show a brief success screen (~2-3 seconds) with animated check + "Perfil salvo!" message, then auto-redirect to /chat. This replaces the removed PlanilhaScreen as the completion signal.

### Claude's Discretion
- Exact SVG illustration designs for each question (runner, target, timer, route, etc.)
- Animation timing fine-tuning (easing curves, durations)
- Gradient exact color stops and opacity
- Success screen visual design details
- Whether to add subtle background patterns or keep pure gradient+white

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Existing Onboarding Code
- `src/features/onboarding/components/WelcomeStep.tsx` — Current welcome screen (upgrade target)
- `src/features/onboarding/components/QuestionStep.tsx` — Current question renderer with QUESTIONS config array
- `src/features/onboarding/components/OnboardingFlow.tsx` — Flow orchestrator (modify for success screen)
- `src/features/onboarding/components/OptionButton.tsx` — Option button (add selection animation)
- `src/features/onboarding/components/ScaleInput.tsx` — Scale input component
- `src/features/onboarding/components/YesNoInput.tsx` — Yes/No input component
- `src/features/onboarding/components/ProgressBar.tsx` — Progress bar (upgrade animation)
- `src/features/onboarding/components/OnboardingNavigation.tsx` — Back/Next buttons
- `src/features/onboarding/components/PlanilhaScreen.tsx` — TO BE REMOVED (not used)
- `src/features/onboarding/i18n/translations.ts` — Add success screen translations

### Phase 6 Context (design decisions carried forward)
- `.planning/phases/06-onboarding-flow/06-CONTEXT.md` — Original onboarding decisions (state mgmt, auth, route, animations)

### Project Requirements
- `.planning/REQUIREMENTS.md` — ONB-01 through ONB-11 (functional requirements unchanged, visual upgrade only)

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `cn()` utility from `src/lib/utils.ts` — Tailwind class merging
- Existing CSS animations: `animate-slide-in-right`, `animate-slide-in-left` in tailwind config
- `useOnboarding` hook — State management stays unchanged
- Green CTA pattern: `bg-[#00F048]` with shadow already established

### Established Patterns
- All onboarding components are `'use client'` with named function exports
- Colors hardcoded as Tailwind arbitrary values: `text-[#14162E]`, `bg-[#00F048]`, `text-[#6B7088]`
- `motion-safe:` prefix for animation classes (prefers-reduced-motion)
- `key={currentStep}` triggers re-mount for slide animations

### Integration Points
- `tailwind.config.ts` — Add new animation keyframes (stagger, bounce, fade-in, pulse)
- `src/app/globals.css` or component-level styles — CSS keyframes for new animations
- `OnboardingFlow.tsx` — Add success screen step after last question
- SVG files — New `src/features/onboarding/assets/` directory for illustrations

</code_context>

<specifics>
## Specific Ideas

- Inspired by Nike Run Club and Strava onboarding — premium, clean, motion-rich
- Welcome screen: navy gradient top → illustration → white bottom with form. NRC hero style.
- Per-question icons should feel like a cohesive set — same stroke weight, color palette, size
- Staggered option cascade gives a "cards dealing" feel — premium micro-interaction
- Success screen is brief (2-3s), not a full page — just enough to confirm profile saved before chat

</specifics>

<deferred>
## Deferred Ideas

- PlanilhaScreen removal/cleanup — the component file can be deleted as part of this phase or left for later cleanup
- Dark mode support for onboarding screens — currently light-only per Phase 6 decision
- Lottie animations — decided against for this phase, could reconsider in future polish pass

</deferred>

---

*Phase: 16-onboarding-visual-upgrade*
*Context gathered: 2026-04-25*
