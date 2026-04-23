# Phase 7: Planilha & Completion - Context

**Gathered:** 2026-04-23
**Status:** Ready for planning

<domain>
## Phase Boundary

"Momento aha" success screen after onboarding: personalized message, spreadsheet download button, and redirect to chat. This is the final step of the onboarding funnel — the user sees their effort rewarded with a tangible deliverable.

</domain>

<decisions>
## Implementation Decisions

### D-01: Route Location — /planilha
New Next.js page at `src/app/planilha/page.tsx`. Same visual pattern as onboarding (full-screen white, centered content, no sidebar/nav). Auth protected.

### D-02: Download UX — Browser Blob Download
Call `onboardingApi.downloadSpreadsheet()` (from Phase 5) which returns a `Blob`. Create a temporary blob URL, trigger download via a hidden `<a>` element with `download` attribute. Filename: `planilha-runmind.xlsx`.

### D-03: Post-Download Redirect — Manual CTA to /chat
After download completes (or on explicit skip), show a "Ir para o chat" button that navigates to `/chat` via `router.push`. Do NOT auto-redirect — let the user choose when to proceed.

### D-04: Success Screen Content
- Checkmark or celebration icon at top
- Heading: "Seu plano está pronto!" / "Your plan is ready!"
- Subtitle with personalized message mentioning the user's goal and fitness level
- Primary CTA: "Baixar minha planilha" (green button, triggers download)
- Secondary CTA: "Ir para o chat →" (text link/button, navigates to /chat)
- Loading state while spreadsheet generates: "Gerando sua planilha..."
- Error state if download fails: "Erro ao gerar planilha. Tente novamente."

### D-05: Visual Style — Light Mode, Centered Card
Same light-mode centered layout as onboarding (white background, max-w-lg, centered). RunMind logo in header. No progress bar (not a step — it's a completion screen). Visual celebration element (green checkmark circle or confetti-like accent).

### D-06: State Source — Profile Data from API
Get user profile data for personalized message by calling `onboardingApi` or reading from the onboarding flow state. If navigated directly to `/planilha` without onboarding context, the download still works (backend generates from saved profile).

### D-07: Translation
Add `planilha` namespace to the onboarding translations module with PT-BR and EN copy.

### Claude's Discretion
- Celebration visual design (icon vs animation vs illustration)
- Exact motivational copy wording
- Whether to show a preview/summary of what's in the spreadsheet
- Loading spinner design

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Phase 5 Integration
- `src/features/onboarding/services/onboardingApi.ts` — downloadSpreadsheet() function
- `src/features/onboarding/types/onboarding.types.ts` — RunnerProfileResponse type

### Phase 6 Integration
- `src/features/onboarding/hooks/useOnboarding.ts` — navigates to `/planilha` after submit
- `src/features/onboarding/components/OnboardingFlow.tsx` — completion flow

### Project Requirements
- `.planning/REQUIREMENTS.md` — ONB-12, ONB-13

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `onboardingApi.downloadSpreadsheet()` — returns Blob, ready to use
- `tokenStorage.getAccessToken()` — for route protection
- `useAuth()` — auth check pattern
- `getTranslations()` — extend with planilha namespace
- `cn()` — Tailwind class merging

### Established Patterns
- Full-screen centered layout from onboarding (max-w-lg, flex column)
- Auth protection via useAuth + useEffect redirect
- Green accent (#00F048) for primary actions
- Portuguese UI text with English fallback

### Integration Points
- `src/app/planilha/page.tsx` — new route
- Onboarding translations — extend with planilha keys
- After download → `/chat` navigation

</code_context>

<specifics>
## Specific Ideas

- The download button should feel rewarding — large, green, prominent
- Show the user they accomplished something: "Parabéns, {name}!" feel
- Consider showing what the spreadsheet contains (3 sheets: Resumo, Plano Semanal, Dicas) as a preview
- The transition to chat should feel like "you're ready to start" — not just a redirect

</specifics>

<deferred>
## Deferred Ideas

- Spreadsheet preview in-browser (render sheets as HTML tables)
- Share spreadsheet via email or WhatsApp
- Re-download from settings page
- Generate new spreadsheet after profile edit

</deferred>

---

*Phase: 07-planilha-completion*
*Context gathered: 2026-04-23 via auto mode*
