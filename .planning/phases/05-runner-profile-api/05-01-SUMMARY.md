---
phase: 05-runner-profile-api
plan: 01
subsystem: backend-api
tags: [go, runner-profile, domain, dto, handler, postgres, onboarding]
dependency_graph:
  requires: []
  provides: [runner-profile-4-fields, spreadsheet-route-stub]
  affects: [05-02]
tech_stack:
  added: []
  patterns: [TrainingPreference-enum-validation, ALTER-TABLE-IF-NOT-EXISTS-migration]
key_files:
  created: []
  modified:
    - /Users/douglas.mesquita/Documents/runmid/runmid-api/internal/training/domain/runner_profile.go
    - /Users/douglas.mesquita/Documents/runmid/runmid-api/internal/training/adapters/dto.go
    - /Users/douglas.mesquita/Documents/runmid/runmid-api/internal/training/adapters/handler.go
    - /Users/douglas.mesquita/Documents/runmid/runmid-api/internal/training/adapters/postgres_repo.go
decisions:
  - "D-01: TrainingPreference as typed string enum with validation function"
  - "D-02: ALTER TABLE IF NOT EXISTS for safe migration of existing rows with defaults"
  - "D-03: GenerateSpreadsheet stub returns 501 Not Implemented (full impl in Plan 02)"
metrics:
  duration: 812s
  completed: 2026-04-22
  tasks_completed: 2
  tasks_total: 2
  files_modified: 4
---

# Phase 05 Plan 01: Extend Runner Profile API Summary

Extended RunnerProfile backend (Go) with 4 new onboarding fields (HasRacedBefore, OtherActivities, TrainingPreference, IncludeStrengthTraining) across all layers: domain model, DTOs, handler, repository, and DB schema.

## What Was Done

### Task 1: Extend RunnerProfile domain model (3980d19)

- Added `TrainingPreference` type with 3 constants: `short_intense`, `long_moderate`, `any`
- Added `ValidateTrainingPreference()` function for enum validation
- Added 4 new fields to `RunnerProfile` struct: `HasRacedBefore` (bool), `OtherActivities` (json.RawMessage), `TrainingPreference` (TrainingPreference), `IncludeStrengthTraining` (bool)

### Task 2: Extend DTOs, handler, repo, and DB schema (93052be)

- **dto.go**: Extended `SaveProfileRequest` and `RunnerProfileDTO` with 4 new fields; updated `RunnerProfileFromDomain` mapping
- **handler.go**: Added `TrainingPreference` validation in `SaveProfile` (rejects invalid values with 400); mapped 4 new fields in profile creation; registered `GET /profile/spreadsheet` route; added stub `GenerateSpreadsheet` handler (501 Not Implemented)
- **postgres_repo.go**: Added 4 `ALTER TABLE ADD COLUMN IF NOT EXISTS` statements for safe migration; extended `CreateOrUpdateProfile` UPSERT from 14 to 18 columns; extended `GetProfileByUserID` SELECT with null-safe scanning for new columns

## Commits

| Task | Commit  | Description                                           |
|------|---------|-------------------------------------------------------|
| 1    | 3980d19 | Extend RunnerProfile domain with 4 new onboarding fields |
| 2    | 93052be | Extend DTOs, handler, repo, and schema for 4 new fields  |

## Deviations from Plan

None - plan executed exactly as written.

## Known Stubs

| Stub | File | Line | Reason |
|------|------|------|--------|
| GenerateSpreadsheet returns 501 | handler.go | ~712 | Intentional stub; full implementation in Plan 05-02 |

## Verification

- `go build ./internal/training/...` passes with exit code 0
- All 4 new fields confirmed present in domain, DTO, handler, and repo files
- ALTER TABLE migration confirmed in InitSchema
- ON CONFLICT includes all 4 new columns
- Spreadsheet route registered

## Self-Check: PASSED
