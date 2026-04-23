# Phase 7: Planilha & Completion - Research

**Researched:** 2026-04-22
**Domain:** React success screen with blob download
**Confidence:** HIGH

## Summary

Phase 7 is a simple, self-contained completion screen. The user arrives at `/planilha` after profile submission (Phase 6), sees a "momento aha" success message, downloads their personalized spreadsheet via `onboardingApi.downloadSpreadsheet()` (already implemented in Phase 5), and then navigates to `/chat` via a manual CTA button.

The technical surface is minimal: one new page component, one custom hook for download state management, translations for the planilha namespace, and no new dependencies. All building blocks exist -- the API client, auth pattern, layout pattern, and translation system are established in the onboarding feature module.

**Primary recommendation:** Build a single `PlanilhaScreen` component with a `useSpreadsheetDownload` hook, following the exact same layout/auth patterns from `OnboardingFlow.tsx`. No new libraries needed.

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions
- D-01: Route at `/planilha` -- new page at `src/app/planilha/page.tsx`, same full-screen white layout as onboarding, auth protected
- D-02: Download via browser blob -- call `onboardingApi.downloadSpreadsheet()`, create blob URL, trigger via hidden `<a>` with `download` attribute, filename `planilha-runmind.xlsx`
- D-03: Manual CTA to `/chat` after download -- no auto-redirect
- D-04: Success screen content -- checkmark icon, "Seu plano esta pronto!" heading, personalized subtitle, green download button, secondary "Ir para o chat" link, loading and error states
- D-05: Light mode centered card layout (white bg, max-w-lg, centered), RunMind logo header, no progress bar, celebration visual
- D-06: State from API -- profile data for personalized message, works even if navigated directly
- D-07: Add `planilha` namespace to onboarding translations (PT-BR and EN)

### Claude's Discretion
- Celebration visual design (icon vs animation vs illustration)
- Exact motivational copy wording
- Whether to show preview/summary of spreadsheet contents
- Loading spinner design

### Deferred Ideas (OUT OF SCOPE)
- Spreadsheet preview in-browser (render sheets as HTML tables)
- Share spreadsheet via email or WhatsApp
- Re-download from settings page
- Generate new spreadsheet after profile edit
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| ONB-12 | After form, user sees "momento aha" screen with success message and spreadsheet ready for download | PlanilhaScreen component with download button, loading/error states, personalized message |
| ONB-13 | After spreadsheet download, user is redirected to chat screen | "Ir para o chat" CTA button navigating to `/chat` via `router.push` (manual, not auto-redirect) |
</phase_requirements>

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| react | ^18 | UI rendering | Already in project [VERIFIED: package.json] |
| next | 14.2.21 | App Router, page routing | Already in project [VERIFIED: package.json] |
| lucide-react | ^0.312.0 | Icons (CheckCircle, Download, ArrowRight) | Already in project [VERIFIED: package.json] |

### Supporting
No new dependencies required. All needed libraries are already installed.

**Installation:**
```bash
# No installation needed -- all dependencies already present
```

## Architecture Patterns

### Recommended Project Structure
```
src/
  app/
    planilha/
      page.tsx                    # Thin page wrapper (matches onboarding/page.tsx pattern)
  features/
    onboarding/
      components/
        PlanilhaScreen.tsx        # Main completion screen component
      hooks/
        useSpreadsheetDownload.ts # Download state management hook
      i18n/
        translations.ts          # Extended with planilha namespace
```

### Pattern 1: Blob Download via Hidden Anchor
**What:** Standard browser pattern for triggering file downloads from API blob responses
**When to use:** When API returns binary data (blob) that user needs to save as a file
**Example:**
```typescript
// [VERIFIED: standard Web API pattern]
const downloadBlob = (blob: Blob, filename: string) => {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}
```

### Pattern 2: Download State Hook
**What:** Custom hook encapsulating download lifecycle (idle -> loading -> success/error)
**When to use:** When download has loading/error states that affect UI
**Example:**
```typescript
// Follows useOnboarding.ts pattern: useState + useCallback
export function useSpreadsheetDownload() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [error, setError] = useState<string | null>(null)

  const download = useCallback(async () => {
    setStatus('loading')
    setError(null)
    try {
      const blob = await onboardingApi.downloadSpreadsheet()
      downloadBlob(blob, 'planilha-runmind.xlsx')
      setStatus('success')
    } catch (err) {
      console.error('Error downloading spreadsheet:', err)
      setError('Erro ao gerar planilha. Tente novamente.')
      setStatus('error')
    }
  }, [])

  return { status, error, download }
}
```

### Pattern 3: Auth-Protected Page (Same as OnboardingFlow)
**What:** Client component with `useAuth()` + `useEffect` redirect to `/login`
**Example:**
```typescript
// [VERIFIED: src/features/onboarding/components/OnboardingFlow.tsx lines 14-42]
const { isAuthenticated, isLoading: authLoading } = useAuth()
useEffect(() => {
  if (!authLoading && !isAuthenticated) {
    router.push('/login')
  }
}, [authLoading, isAuthenticated, router])
if (authLoading || !isAuthenticated) return null
```

### Pattern 4: Full-Screen Centered Layout (Same as OnboardingFlow)
**What:** White background, max-w-lg, centered content, RunMind logo header
**Example:**
```typescript
// [VERIFIED: src/features/onboarding/components/OnboardingFlow.tsx lines 44-46]
<div className="bg-white min-h-screen">
  <div className="max-w-lg mx-auto px-6 py-8 lg:px-8 lg:py-12 flex flex-col min-h-screen">
    <span className="font-display font-bold text-lg text-[#14162E]">RunMind</span>
    {/* content */}
  </div>
</div>
```

### Anti-Patterns to Avoid
- **Auto-redirecting after download:** User decision D-03 explicitly forbids auto-redirect. Let user click "Ir para o chat" manually.
- **Using `window.open()` for download:** Does not trigger proper file download in all browsers. Use blob URL + hidden anchor.
- **Forgetting `URL.revokeObjectURL()`:** Memory leak if blob URLs are not cleaned up after download.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| File download from blob | Custom fetch + headers | `onboardingApi.downloadSpreadsheet()` + blob anchor pattern | Already implemented, handles auth headers via axios interceptor |
| Auth protection | Manual token checks | `useAuth()` hook | Consistent with all other protected routes |
| Translations | Hardcoded strings | `getTranslations()` + planilha namespace | Established i18n pattern in onboarding module |

**Key insight:** This phase adds zero new technical complexity. Every pattern is already established in the codebase.

## Common Pitfalls

### Pitfall 1: Blob URL Memory Leak
**What goes wrong:** Creating `URL.createObjectURL()` without calling `URL.revokeObjectURL()` after download
**Why it happens:** Easy to forget cleanup step
**How to avoid:** Always revoke URL immediately after triggering download click
**Warning signs:** Memory usage grows on repeated downloads

### Pitfall 2: Download Not Triggering on Mobile Safari
**What goes wrong:** Some mobile browsers block programmatic `<a>` clicks
**Why it happens:** Browser security policies differ across mobile browsers
**How to avoid:** Ensure the anchor element is appended to DOM before clicking, and use `document.body.appendChild(a)` pattern [ASSUMED]
**Warning signs:** Download works on desktop but not on iOS Safari

### Pitfall 3: Missing Error State Recovery
**What goes wrong:** User sees error but has no way to retry
**Why it happens:** Error state set but no retry mechanism
**How to avoid:** Keep the download button clickable after error; reset status to 'idle' or keep at 'error' with same button re-triggering download
**Warning signs:** User stuck on error screen

### Pitfall 4: Navigation Before Download Completes
**What goes wrong:** User clicks "Ir para o chat" while download is still loading, navigates away mid-download
**Why it happens:** Both CTAs visible simultaneously
**How to avoid:** Either disable chat CTA while downloading, or let it work (download continues in background since it's already initiated)
**Warning signs:** Truncated/missing file on user's device

## Code Examples

### Complete PlanilhaScreen Component Structure
```typescript
// [ASSUMED: based on established OnboardingFlow patterns]
'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/features/auth/hooks/useAuth'
import { CheckCircle, Download, ArrowRight } from 'lucide-react'
import { useSpreadsheetDownload } from '../hooks/useSpreadsheetDownload'
import { getTranslations } from '../i18n/translations'

export function PlanilhaScreen() {
  const router = useRouter()
  const { isAuthenticated, isLoading: authLoading } = useAuth()
  const { status, error, download } = useSpreadsheetDownload()
  const t = getTranslations()

  // Auth guard (same pattern as OnboardingFlow)
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login')
    }
  }, [authLoading, isAuthenticated, router])

  if (authLoading || !isAuthenticated) return null

  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-lg mx-auto px-6 py-8 lg:px-8 lg:py-12 flex flex-col min-h-screen items-center justify-center text-center">
        {/* RunMind logo header */}
        <span className="font-display font-bold text-lg text-[#14162E] absolute top-8 left-6">RunMind</span>

        {/* Celebration icon */}
        <div className="w-20 h-20 bg-[#00F048]/10 rounded-full flex items-center justify-center mb-6">
          <CheckCircle className="w-10 h-10 text-[#00F048]" />
        </div>

        {/* Heading + subtitle */}
        <h1 className="font-display font-bold text-2xl text-[#14162E] mb-2">
          {t.planilha.heading}
        </h1>
        <p className="text-[#6B7088] text-base mb-8">
          {t.planilha.subtitle}
        </p>

        {/* Primary CTA: Download */}
        <button
          onClick={download}
          disabled={status === 'loading'}
          className="w-full py-4 bg-[#00F048] text-[#14162E] font-semibold rounded-2xl mb-4 flex items-center justify-center gap-2"
        >
          {status === 'loading' ? t.planilha.loading : t.planilha.downloadCta}
          {status !== 'loading' && <Download className="w-5 h-5" />}
        </button>

        {/* Error message */}
        {error && (
          <p className="text-sm text-red-500 mb-4">{error}</p>
        )}

        {/* Secondary CTA: Go to chat */}
        <button
          onClick={() => router.push('/chat')}
          className="text-[#6B7088] text-sm flex items-center gap-1 hover:text-[#14162E] transition-colors"
        >
          {t.planilha.chatCta} <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}
```

### Translation Extension
```typescript
// Add to translations.ptBR and translations.en
planilha: {
  heading: 'Seu plano esta pronto!',      // EN: 'Your plan is ready!'
  subtitle: 'Sua planilha personalizada foi gerada com sucesso.',  // EN: 'Your personalized spreadsheet has been generated.'
  downloadCta: 'Baixar minha planilha',    // EN: 'Download my spreadsheet'
  chatCta: 'Ir para o chat',              // EN: 'Go to chat'
  loading: 'Gerando sua planilha...',      // EN: 'Generating your spreadsheet...'
  error: 'Erro ao gerar planilha. Tente novamente.',  // EN: 'Error generating spreadsheet. Try again.'
}
```

## Assumptions Log

| # | Claim | Section | Risk if Wrong |
|---|-------|---------|---------------|
| A1 | Mobile Safari requires anchor appended to DOM before programmatic click for blob downloads | Pitfalls | Download may not work on iOS -- easily tested |
| A2 | `onboardingApi.downloadSpreadsheet()` returns a proper Blob (not JSON error) on success | Architecture | Would need response type checking -- but Phase 5 specifies responseType: 'blob' |

**All other claims verified against existing codebase files.**

## Open Questions

1. **Personalized message content**
   - What we know: D-04 says "personalized message mentioning the user's goal and fitness level"
   - What's unclear: Whether to fetch profile data from API for personalization, or use simpler generic message
   - Recommendation: Use a generic success message for v1. Fetching profile just for a personalized subtitle adds unnecessary API call and complexity. The user just completed the form -- they know their goal.

## Sources

### Primary (HIGH confidence)
- `src/features/onboarding/services/onboardingApi.ts` - downloadSpreadsheet() implementation verified
- `src/features/onboarding/components/OnboardingFlow.tsx` - layout and auth patterns verified
- `src/features/onboarding/hooks/useOnboarding.ts` - hook patterns verified
- `src/features/onboarding/i18n/translations.ts` - translation structure verified
- `src/app/onboarding/page.tsx` - thin page wrapper pattern verified

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - no new dependencies, all verified in package.json
- Architecture: HIGH - all patterns directly copied from existing onboarding code
- Pitfalls: HIGH - standard blob download pitfalls, well-documented

**Research date:** 2026-04-22
**Valid until:** 2026-06-22 (stable -- no external dependencies)
