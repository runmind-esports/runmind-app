---
phase: 18-tela-de-consumo-de-mana
verified: 2026-04-28T22:00:00Z
status: human_needed
score: 9/9
overrides_applied: 0
human_verification:
  - test: "Navigate to /settings and click Consumo tab"
    expected: "Circular gauge displays with RunPoints count, 7-day bar chart below, and if points < 10% a motivational card with upgrade button"
    why_human: "Visual layout, SVG rendering, color thresholds, and animation transitions cannot be verified programmatically"
  - test: "Click 'Fazer upgrade' button on low RunPoints card"
    expected: "Redirects to Stripe checkout for the first available plan"
    why_human: "Requires authenticated session with low RunPoints and live Stripe integration"
  - test: "Verify gauge colors at different percentage levels"
    expected: "Green > 30%, yellow 10-30%, red < 10%"
    why_human: "Requires backend to return different mana values or mocking data to test thresholds visually"
---

# Phase 18: Tela de Consumo de Mana Verification Report

**Phase Goal:** Adicionar tab "Consumo" nas configuracoes com gauge circular de RunPoints, grafico de barras 7 dias, e card motivacional com upgrade CTA quando RunPoints estiver baixo. Dados via GET /api/v1/mana/status do chat-agent.
**Verified:** 2026-04-28T22:00:00Z
**Status:** human_needed
**Re-verification:** No -- initial verification

## Goal Achievement

### Observable Truths

| # | Truth | Status | Evidence |
|---|-------|--------|----------|
| 1 | Settings page has 3 tabs: Integracoes, Planos, Consumo | VERIFIED | `src/app/settings/page.tsx` TABS array has 3 entries with ids integrations, plans, consumption and labels matching |
| 2 | Consumo tab shows a circular SVG gauge with current RunPoints / max RunPoints | VERIFIED | `CircularGauge.tsx` renders SVG with viewBox 200x200, circle r=80, strokeDashoffset animation, center text showing `{current}` and `de {max} RunPoints` |
| 3 | Gauge color is green when >30%, yellow between 10-30%, red <10% | VERIFIED | `getColor()` function: >30 returns #00F048, >10 returns #F59E0B, else #EF4444 |
| 4 | 7-day bar chart shows daily consumption with day-of-week labels | VERIFIED | `WeeklyBarChart.tsx` renders history array with proportional height bars and day.day labels (Seg-Dom) |
| 5 | When RunPoints < 10%, a motivational card appears with upgrade CTA | VERIFIED | `LowRunPointsCard.tsx` returns null when percentage >= 10, otherwise shows card with "Fazer upgrade" button calling `checkout(plans[0].id)` |
| 6 | When RunPoints = 0, gauge is red with "Sem calorias" text and upgrade button opens Stripe checkout | VERIFIED | `CircularGauge.tsx` line 48-57 shows "Sem calorias" when current === 0; `LowRunPointsCard.tsx` handles currentPoints === 0 with "Suas calorias do dia acabaram" + checkout button |
| 7 | runPointsApi calls GET /api/v1/mana/status via chatApiClient | VERIFIED | `runPointsApi.ts` imports chatApiClient and calls `chatApiClient.get<RunPointsStatus>('/api/v1/mana/status')` |
| 8 | Feature module exports service, hook, types, and ConsumptionSection via barrel file | VERIFIED | `index.ts` exports ConsumptionSection, runPointsApi, useRunPointsStatus, RunPointsStatus, RunPointsHistoryDay |
| 9 | useRunPointsStatus hook returns currentPoints, maxPoints, percentage, nextResetAt, tier, history | VERIFIED | Hook returns all fields with percentage computed as `Math.round((currentPoints / maxPoints) * 100)`, staleTime 2min, retry false |

**Score:** 9/9 truths verified

### Required Artifacts

| Artifact | Expected | Status | Details |
|----------|----------|--------|---------|
| `src/features/runPoints/types/runPoints.types.ts` | RunPointsStatus and RunPointsHistoryDay interfaces | VERIFIED | Both interfaces exported with correct fields |
| `src/features/runPoints/services/runPointsApi.ts` | API service for mana status endpoint | VERIFIED | Uses chatApiClient, calls /api/v1/mana/status |
| `src/features/runPoints/hooks/useRunPointsStatus.ts` | React Query hook for RunPoints status | VERIFIED | useQuery with staleTime 2min, mock history for 7 days |
| `src/features/runPoints/index.ts` | Barrel exports for feature module | VERIFIED | Exports components, services, hooks, types |
| `src/features/runPoints/components/CircularGauge.tsx` | SVG circular gauge with color thresholds | VERIFIED | 83 lines, SVG with animated strokeDashoffset, 3 color thresholds |
| `src/features/runPoints/components/WeeklyBarChart.tsx` | 7-day vertical bar chart | VERIFIED | 33 lines, renders history with proportional bars and day labels |
| `src/features/runPoints/components/LowRunPointsCard.tsx` | Motivational card with upgrade CTA and reset timer | VERIFIED | 63 lines, conditional render, useSubscription for checkout, reset timer computed once |
| `src/features/runPoints/components/ConsumptionSection.tsx` | Main section composing gauge, chart, and low-points card | VERIFIED | 53 lines, uses useRunPointsStatus, renders all sub-components, has loading/error states |
| `src/app/settings/page.tsx` | Updated settings page with 3rd Consumo tab | VERIFIED | 3 tabs in TABS array, ConsumptionSection rendered for consumption tab |

### Key Link Verification

| From | To | Via | Status | Details |
|------|----|-----|--------|---------|
| `runPointsApi.ts` | `apiClient.ts` | chatApiClient import | WIRED | Line 1: `import { chatApiClient } from '@/shared/lib/apiClient'` |
| `useRunPointsStatus.ts` | `runPointsApi.ts` | runPointsApi.getStatus() call | WIRED | Line 4: import, Line 24: `runPointsApi.getStatus()` in queryFn |
| `ConsumptionSection.tsx` | `useRunPointsStatus.ts` | useManaStatus() hook call | WIRED | Line 3: import, Line 9: destructured call |
| `LowRunPointsCard.tsx` | `useSubscription.ts` | useSubscription().checkout() | WIRED | Line 3: import from @/features/subscription, Line 21: destructured, Line 27: checkout(plans[0].id) |
| `settings/page.tsx` | `ConsumptionSection.tsx` | ConsumptionSection import and tab rendering | WIRED | Line 10: import, Line 142: rendered when activeTab === 'consumption' |

### Data-Flow Trace (Level 4)

| Artifact | Data Variable | Source | Produces Real Data | Status |
|----------|---------------|--------|--------------------|--------|
| `ConsumptionSection.tsx` | currentPoints, maxPoints, percentage, etc. | `useRunPointsStatus()` -> `runPointsApi.getStatus()` -> `chatApiClient.get('/api/v1/mana/status')` | Yes (real API call to chat-agent backend) | FLOWING |
| `WeeklyBarChart.tsx` | history | `getMockHistory()` in useRunPointsStatus | No (mock random data) | STATIC (intentional per D-04, backend endpoint pending) |

### Behavioral Spot-Checks

Step 7b: SKIPPED (requires running dev server with authenticated session and live chat-agent backend)

### Requirements Coverage

No requirement IDs assigned to this phase (TBD in ROADMAP.md).

### Anti-Patterns Found

| File | Line | Pattern | Severity | Impact |
|------|------|---------|----------|--------|
| `useRunPointsStatus.ts` | 10 | TODO: Replace mock history with real endpoint (D-04) | Info | Mock 7-day history data is intentional; real endpoint not yet available on backend |
| `LowRunPointsCard.tsx` | 23 | `return null` when percentage >= 10 | Info | Intentional self-hiding behavior, not a stub |

### Human Verification Required

### 1. Visual Rendering of Consumo Tab

**Test:** Navigate to /settings and click the "Consumo" tab
**Expected:** Circular gauge displays with RunPoints count in center, "de {max} RunPoints" subtitle, 7-day bar chart below with day labels, and if points < 10% a motivational card with upgrade button
**Why human:** SVG rendering, CSS transitions, layout composition, and dark mode appearance cannot be verified programmatically

### 2. Stripe Checkout Flow

**Test:** With RunPoints < 10%, click "Fazer upgrade" button on the low RunPoints card
**Expected:** Redirects to Stripe checkout for the first available subscription plan
**Why human:** Requires authenticated session with low RunPoints data from backend, plus live Stripe integration

### 3. Gauge Color Thresholds

**Test:** Verify gauge colors at different RunPoints percentage levels (>30%, 10-30%, <10%, 0%)
**Expected:** Green (#00F048) when >30%, yellow (#F59E0B) when 10-30%, red (#EF4444) when <10%, "Sem calorias" text when 0
**Why human:** Requires backend to return varying mana values or browser dev tools to override props

### Gaps Summary

No gaps found. All 9 must-haves verified at code level. The feature module was intentionally renamed from "mana" to "runPoints" per user preference, with all files under `src/features/runPoints/` instead of `src/features/mana/`. The weekly history chart uses mock data (flagged as Info, not a gap) because the backend endpoint is not yet available (documented as D-04 decision).

Three items require human visual verification before full sign-off.

---

_Verified: 2026-04-28T22:00:00Z_
_Verifier: Claude (gsd-verifier)_
