---
phase: 19-whatsapp-deep-link-handler
plan: 01
subsystem: whatsapp-cta
tags: [feature-module, tanstack-query, qrcode, i18n, cross-repo-contract]
requires: []
provides:
  - "WhatsAppCTA component (full conversion CTA — button + QR + loading/error states)"
  - "useWhatsAppInitToken hook (TanStack Query, 23h staleTime, per-user cache, no auto-retry)"
  - "whatsappCtaApi service (POST /api/v1/whatsapp/init-token wrapper)"
  - "InitTokenResponse + WhatsAppCTAVariant types"
  - "pt-BR + en i18n dictionary for the CTA"
affects:
  - "package.json (qrcode.react ^4.2.0 added)"
tech-stack:
  added:
    - "qrcode.react ^4.2.0 (QR rendering on desktop)"
  patterns:
    - "feature module under src/features/{name}/ with types/services/hooks/i18n/components/index.ts"
    - "TanStack Query with enabled-gate on tokenStorage.getAccessToken() + per-user queryKey"
    - "Tailwind responsive classes (hidden md:block) for adaptive UI — no UA detection"
    - "AxiosError narrowing without `any` (response.data shaped via ErrorBodyShape)"
key-files:
  created:
    - src/features/whatsapp-cta/types/whatsapp-cta.types.ts
    - src/features/whatsapp-cta/services/whatsappCtaApi.ts
    - src/features/whatsapp-cta/hooks/useWhatsAppInitToken.ts
    - src/features/whatsapp-cta/i18n/translations.ts
    - src/features/whatsapp-cta/components/WhatsAppCTAButton.tsx
    - src/features/whatsapp-cta/components/WhatsAppQR.tsx
    - src/features/whatsapp-cta/components/WhatsAppCTA.tsx
    - src/features/whatsapp-cta/index.ts
  modified:
    - package.json
    - package-lock.json
key-decisions:
  - "Analytics tracking deferred: runmid-app has no tracker SDK installed; exposed `onCtaClick` prop as a hook for future wiring (D-F15)"
  - "i18n: getTranslations() returns static pt-BR — mirrors src/features/onboarding pattern, swap when a global LanguageProvider lands"
  - "queryKey is per-user ['whatsapp-init-token', username] to prevent cache bleed across logins (T-19-06); falls back to 'anonymous' when no username — `enabled` gate prevents it from running unauth"
  - "Adaptive layout uses Tailwind `hidden md:block` instead of navigator.userAgent (D-F9) — survives bot detection, SSR, and works identically with Next.js streaming"
  - "qrcode.react ^4.2.0 chosen by `npm install qrcode.react` letting npm pick latest; package is ~10 years old, ~3M+ weekly downloads, widely vetted (T-19-05 accepted via npm-policy: no checkpoint needed for established packages)"
requirements-completed: []
duration: 22 min
completed: 2026-05-22
---

# Phase 19 Plan 01: WhatsApp Conversion CTA — Feature Module Scaffold Summary

Feature module `src/features/whatsapp-cta/` scaffolded with TanStack Query hook (`useWhatsAppInitToken`), service wrapper (`whatsappCtaApi.initToken`), pt-BR/en i18n dictionary, and three React components (`WhatsAppCTAButton`, `WhatsAppQR`, `WhatsAppCTA`). Adaptive button/QR rendering via Tailwind responsive classes (`hidden md:block`) — no UA detection. `qrcode.react ^4.2.0` added as dependency.

## What was built

- **Types layer** — `InitTokenResponse` matching the canonical runmid-api Phase 5 contract (`token`, `walink`, `expiresAt`, optional `qrPayload`); `WhatsAppCTAVariant` alias (`'primary' | 'secondary'`).
- **Service layer** — `whatsappCtaApi.initToken()` POSTs `/api/v1/whatsapp/init-token` via `runmidApiClient`. No try/catch — axios throws on HTTP >= 400, the hook handles narrowing.
- **Hook layer** — `useWhatsAppInitToken`:
  - `queryKey: ['whatsapp-init-token', username]` (per-user cache key)
  - `staleTime: 23 * 60 * 60 * 1000` (23h — under the backend 24h TTL so we never deliver a near-expiry token)
  - `retry: false` (load-bearing per D-F13 — 429 and 503 must NOT auto-retry)
  - `enabled: tokenStorage.getAccessToken()` (only runs when authenticated, gated like `useRunPointsStatus`)
  - Returns `{ walink, qrValue (qrPayload ?? walink), expiresAt, isLoading, error, errorCode }`
  - `errorCode` is `'RATE_LIMITED' | 'WHATSAPP_NOT_CONFIGURED' | null`, narrowed from `AxiosError.response.data.code` via explicit type guard (no `any`, strict TS friendly).
- **i18n** — `translations.ts` with `ptBR` + `en` (same shape). Keys: `buttonLabel`, `qrInstruction`, `loading`, `errorGeneric`, `errorRateLimited`, `errorUnavailable`. `getTranslations()` returns static pt-BR (no LanguageProvider yet in authenticated shell).
- **Components**:
  - `WhatsAppCTAButton` — `<a href={walink} target="_blank" rel="noopener noreferrer">` with `MessageCircle` icon. Variants map to brand `#00F048` (primary) or `background-tertiary` (secondary). Mitigates T-19-01 (referrer) and T-19-02 (window.opener hijack).
  - `WhatsAppQR` — `<QRCodeSVG />` from `qrcode.react`, 160px default, white backdrop + dark FG so it stays readable in the app's default dark mode.
  - `WhatsAppCTA` — composite. Loading skeleton, error banner mapped from `errorCode`, success layout with button + responsive QR. `showQR` prop allows callers (settings modal etc.) to suppress the QR even on desktop. Defensive null-return when query is disabled / no data.
- **Barrel** — `index.ts` exporting `WhatsAppCTA`, `WhatsAppCTAButton`, `WhatsAppQR`, `useWhatsAppInitToken`, `whatsappCtaApi`, `getWhatsAppCtaTranslations`, plus types.

## Verification results

| Gate | Command | Result |
|------|---------|--------|
| Dependency present | `grep '"qrcode.react"' package.json` | PASS — `"qrcode.react": "^4.2.0"` |
| Types exported | Task 1 verify grep | PASS |
| Hook contract | Task 2 verify grep (useQuery, queryKey, staleTime 23h, retry false, RATE_LIMITED) | PASS |
| Components + responsive + barrel | Task 3 verify grep (QRCodeSVG, target=_blank, rel=noopener, hidden md:block, RATE_LIMITED, WhatsAppCTA in index) | PASS |
| No UA detection | `grep -rn "navigator.userAgent\|navigator.platform" src/features/whatsapp-cta/` | CLEAN (zero matches) |
| No `any` cast | `grep -rn ": any\b\| any\[" src/features/whatsapp-cta/` | CLEAN (one comment match, no code) |
| `npm run lint` | `next lint` | PASS — only pre-existing `<img>` warnings in unrelated features |
| `npm run build` | `next build` | PASS — `✓ Compiled successfully`, 17 static pages generated, zero TS errors |

## Commits

| Task | Commit | Title |
|------|--------|-------|
| 1 | `03e6f18` | feat(19-01): add qrcode.react dep + WhatsApp CTA types and API service |
| 2 | `7df5ac3` | feat(19-01): add useWhatsAppInitToken hook + i18n dictionary |
| 3 | `a4d7a39` | feat(19-01): add WhatsApp CTA components + barrel export |

## Deviations from Plan

None — plan executed exactly as written.

The plan called for `npm install qrcode.react` to let npm pick latest; npm chose `^4.2.0`. This matches the plan's instruction "deixe o npm escolher o latest" verbatim, so it's not a deviation. The `<task type="auto">` <action> step explicitly instructed not to pin the version, and v4.2.0 is fully compatible with React 18 (which runmid-app uses).

## Threat model coverage

| Threat ID | Status | Mitigation in this plan |
|-----------|--------|------------------------|
| T-19-01 (referrer leak to wa.me) | mitigated | `<a rel="noopener noreferrer">` in WhatsAppCTAButton |
| T-19-02 (window.opener hijack) | mitigated | same `rel="noopener noreferrer"` attribute |
| T-19-03 (init token in browser URL logs) | accepted | Token is single-use, TTL 24h, scoped per user — risk accepted per plan |
| T-19-04 (rate-limit spam / DoS) | mitigated | `retry: false` + specific `errorRateLimited` message — no client-side amplification |
| T-19-05 (npm install supply chain) | mitigated | `qrcode.react` is `zpao/qrcode.react`, ~10y old, ~3M+ weekly downloads |
| T-19-06 (cross-user cache bleed) | mitigated | `queryKey` includes `username`; on logout `queryClient.clear()` (existing in useAuth) wipes all caches |

## Decisions recorded

1. **Analytics deferred.** runmid-app has no tracker SDK; `WhatsAppCTA` exposes an `onCtaClick` callback prop instead of importing any analytics package. When a tracker lands, Plan 02 (or a follow-up) wires it in the consumer layer — this module stays tracker-agnostic.
2. **Static pt-BR i18n.** `getTranslations()` returns the pt-BR dictionary directly because the authenticated app shell does not yet expose a `LanguageProvider`. The signature matches `src/features/onboarding/i18n/translations.ts` so swapping to dynamic locale is a one-line change.
3. **Per-user queryKey.** `['whatsapp-init-token', tokenStorage.getUsername() ?? 'anonymous']` prevents cache bleed across logged-in users. The `enabled` gate keeps the query off entirely when unauth.
4. **Responsive via CSS only.** `hidden md:block` on the QR wrapper — no UA detection, no SSR mismatch, works identically on bot crawlers and real browsers.

## Cross-repo dependency status

- **runmid-api Phase 5** (`POST /api/v1/whatsapp/init-token`) is still pending implementation. This module is wired against the canonical contract documented in `~/Documents/runmid/runmid-api/.planning/phases/05-whatsapp-linking-endpoints/05-CONTEXT.md`.
- Plan 02 (CTA integration into pages) can build/lint/type-check without the backend, but **smoke testing the full flow requires runmid-api Phase 5 to be shipped**. Document this as a soft blocker for Plan 02's manual verification step.

## Notes for Plan 02

- Consumer side is simple: `import { WhatsAppCTA } from '@/features/whatsapp-cta'` and render it. No extra wiring needed — auth state is auto-detected, fetching is automatic, errors are self-contained.
- For the settings modal (smaller surface), pass `showQR={false}` to render only the button.
- The `onCtaClick` prop is optional and currently unused; reserve it for analytics once a tracker is added.
- When runmid-api Phase 5 ships, verify the response body shape matches `InitTokenResponse` exactly — particularly the optional `qrPayload` field.

## Self-Check: PASSED

- All 8 declared `key-files.created` exist on disk (verified via `find`).
- 3 task commits exist (`03e6f18`, `7df5ac3`, `a4d7a39`) — verified via `git log`.
- All `<verify>` grep expressions in the plan pass.
- `npm run lint` exits clean (zero errors).
- `npm run build` exits clean (`✓ Compiled successfully`).
- Plan-level verification (`<verification>` block) satisfied: build/lint pass; greps for `WhatsAppCTA` and `qrcode.react` find the expected files; barrel import path works.

Ready for Plan 02 (`19-02`).
