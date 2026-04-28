---
phase: 18-tela-de-consumo-de-mana
plan: 01
status: complete
started: 2026-04-28
completed: 2026-04-28
---

## Summary

Created the RunPoints feature module (`src/features/runPoints/`) with TypeScript types, API service, React Query hook, and barrel exports. The data layer follows existing subscription module patterns.

## Key Files

### Created
- `src/features/runPoints/types/runPoints.types.ts` — RunPointsStatus and RunPointsHistoryDay interfaces
- `src/features/runPoints/services/runPointsApi.ts` — API service using chatApiClient for GET /api/v1/mana/status
- `src/features/runPoints/hooks/useRunPointsStatus.ts` — React Query hook with percentage calculation and mock 7-day history
- `src/features/runPoints/index.ts` — Barrel exports for the feature module

## Decisions
- Used `chatApiClient` (not `runmidApiClient`) per D-03 — mana endpoint lives in chat-agent service
- Mock history data until backend supports GET /api/v1/mana/history (per D-04)
- staleTime set to 2 minutes (more frequent than tier's 5 minutes since points change more often)

## Deviations
- Renamed from "mana" to "runPoints" per user preference — all types, files, and exports use RunPoints naming
