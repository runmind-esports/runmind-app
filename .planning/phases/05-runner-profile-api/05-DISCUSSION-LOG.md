# Phase 5: Runner Profile API - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-04-22
**Phase:** 05-runner-profile-api
**Areas discussed:** Field mapping, Spreadsheet generation, API contract, Frontend integration
**Mode:** Auto (all recommendations accepted)

---

## Field Mapping

| Option | Description | Selected |
|--------|-------------|----------|
| Extend RunnerProfile with 4 new fields | Add HasRacedBefore, OtherActivities, TrainingPreference, IncludeStrengthTraining | ✓ |
| Create separate OnboardingProfile model | New domain model specific to onboarding | |
| Use only existing fields with JSONB overload | Pack everything into Goals/InjuriesHistory JSONB | |

**User's choice:** Extend RunnerProfile with 4 new fields (auto-selected recommended)
**Notes:** Existing model covers 7/11 onboarding questions. Only 4 new fields needed.

---

## Spreadsheet Generation

| Option | Description | Selected |
|--------|-------------|----------|
| XLSX via excelize | Standard Excel format, works on phone/desktop | ✓ |
| PDF via gofpdf | Read-only, universally viewable | |
| CSV | Simplest but poor mobile experience | |

**User's choice:** XLSX via excelize (auto-selected recommended)
**Notes:** Requirements explicitly exclude AI generation. Template-based approach selected.

---

## API Contract

| Option | Description | Selected |
|--------|-------------|----------|
| Extend existing endpoints | Reuse POST /training/profile, add GET /training/profile/spreadsheet | ✓ |
| New onboarding-specific endpoints | POST /onboarding/profile, GET /onboarding/spreadsheet | |
| Single endpoint with query params | POST /training/profile?generate=true returns spreadsheet inline | |

**User's choice:** Extend existing endpoints (auto-selected recommended)
**Notes:** Follows existing patterns, avoids route duplication.

---

## Frontend Integration

| Option | Description | Selected |
|--------|-------------|----------|
| Include TS types + service in this phase | Creates integration surface for Phase 6 | ✓ |
| Defer entirely to Phase 6 | Phase 5 is backend-only | |

**User's choice:** Include TS types + service in this phase (auto-selected recommended)
**Notes:** Phase 6 depends on these types. Including them removes a blocker.

---

## Claude's Discretion

- Database migration approach
- Spreadsheet template design details
- Error message wording
- Internal Go code organization

## Deferred Ideas

- AI-powered spreadsheet generation (ONB-F03)
- Strava data import for pre-fill (ONB-F02)
- Post-onboarding profile editing
