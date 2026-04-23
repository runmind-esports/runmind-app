# Phase 5: Runner Profile API - Context

**Gathered:** 2026-04-22
**Status:** Ready for planning

<domain>
## Phase Boundary

Backend API endpoints (Go/runmid-api) to receive and persist a runner's onboarding profile and generate a personalized training spreadsheet for download. Also includes frontend TypeScript types and service functions so Phase 6 can consume the API.

</domain>

<decisions>
## Implementation Decisions

### D-01: RunnerProfile Model Extension
The existing `RunnerProfile` domain model in `internal/training/domain/runner_profile.go` already has most fields needed. Add these 4 missing fields to support the 11 onboarding questions:
- `HasRacedBefore bool` — ONB-06 (participated in official races)
- `OtherActivities json.RawMessage` — ONB-09 (other activities practiced)
- `TrainingPreference string` — ONB-10 (short-intense / long-moderate / any)
- `IncludeStrengthTraining bool` — ONB-11 (include strength workouts)

### D-02: Onboarding Question → Field Mapping
Map frontend onboarding values to backend types:
| Question | Frontend Value | Backend Field | Type |
|----------|---------------|---------------|------|
| ONB-03: Goal | "correr_5k", "correr_10k", "melhorar_5k", "melhorar_10k" | `Goals` (JSONB) | json array |
| ONB-04: Fitness level 1-5 | integer 1-5 | `FitnessLevel` mapped: 1-2→beginner, 3→intermediate, 4-5→advanced | string enum |
| ONB-05: Weekly km range | "ate_5", "ate_10", "11_20", "21_30", "30_plus" | `WeeklyKmCapacity` mapped to midpoint: 2.5, 7.5, 15.5, 25.5, 40.0 | float64 |
| ONB-06: Raced before | true/false | `HasRacedBefore` | bool |
| ONB-07: Average pace | "nao_sei", "acima_7", "6_7", "5_6", "abaixo_5" | `Pace5kSeconds` mapped: 0, 450, 390, 330, 270 | int |
| ONB-08: Days per week | 2, 3, 4, 5 | `PreferredDays` (JSONB) | json array of day names |
| ONB-09: Other activities + injury | {activities: bool, injury: bool, details: string} | `OtherActivities` + `InjuriesHistory` (both JSONB) | json |
| ONB-10: Training preference | "short_intense", "long_moderate", "any" | `TrainingPreference` | string |
| ONB-11: Strength training | true/false | `IncludeStrengthTraining` | bool |

### D-03: Spreadsheet Format — XLSX
Generate downloadable spreadsheet in XLSX (Excel) format using the `excelize` Go library. XLSX is the most accessible format for Brazilian runners (opens on phone and desktop). The spreadsheet is template-based (per requirements — AI generation is out of scope for v1.1).

### D-04: Spreadsheet Content Structure
The spreadsheet should contain:
- **Sheet 1: Resumo** — Runner profile summary, goal, fitness level
- **Sheet 2: Plano Semanal** — Weekly training plan (4-8 weeks based on fitness level) with day-by-day workouts
- **Sheet 3: Dicas** — Tips based on profile (injury prevention, nutrition basics, etc.)

Template selection based on combination of: goal distance + fitness level + days per week.

### D-05: API Endpoints
Reuse and extend existing endpoints (same route group `/api/v1/training`):
- `POST /api/v1/training/profile` — Already exists via `SaveProfile`. Extend `SaveProfileRequest` DTO to accept the 4 new fields. CreateOrUpdate behavior stays.
- `GET /api/v1/training/profile/spreadsheet` — NEW endpoint. Returns XLSX file as `application/vnd.openxmlformats-officedocument.spreadsheetml.sheet` with `Content-Disposition: attachment; filename="planilha-runmind.xlsx"`. Returns 404 if no profile exists.

### D-06: Validation Rules
Follow existing gin binding validation pattern:
- `fitnessLevel` must be "beginner", "intermediate", or "advanced" (validated via domain enum)
- `weeklyKmCapacity` must be > 0
- `goals` must be non-empty JSONB array
- `preferredDays` must have at least 2 days
- New fields: `trainingPreference` must be one of "short_intense", "long_moderate", "any"
- Return existing `ErrorResponse{Error, Code}` format on validation failure

### D-07: Frontend Service Layer
Add to frontend (`src/features/onboarding/`) in this phase:
- TypeScript types matching the API DTOs (`RunnerProfile`, `SaveProfileRequest`, `SpreadsheetResponse`)
- Service functions using `runmidApiClient`: `saveProfile(data)` and `downloadSpreadsheet()`
- These are the integration surface Phase 6 (Onboarding Flow) will consume

### Claude's Discretion
- Database migration approach (ALTER TABLE vs schema auto-migration)
- Spreadsheet template design details (colors, fonts, cell formatting)
- Error message wording in Portuguese
- Internal code organization within the Go training module

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Backend (Go - runmid-api)
- `/Users/douglas.mesquita/Documents/runmid/runmid-api/internal/training/domain/runner_profile.go` — Current RunnerProfile domain model (extend this)
- `/Users/douglas.mesquita/Documents/runmid/runmid-api/internal/training/adapters/handler.go` — Current HTTP handlers with SaveProfile/GetProfile (extend this)
- `/Users/douglas.mesquita/Documents/runmid/runmid-api/internal/training/adapters/dto.go` — Request/response DTOs (extend SaveProfileRequest)
- `/Users/douglas.mesquita/Documents/runmid/runmid-api/internal/training/ports/repository.go` — Repository interface (may need extension)
- `/Users/douglas.mesquita/Documents/runmid/runmid-api/internal/training/adapters/postgres_repo.go` — PostgreSQL implementation (extend schema + queries)
- `/Users/douglas.mesquita/Documents/runmid/runmid-api/go.mod` — Dependencies (add excelize)

### Frontend (Next.js - runmid-app)
- `src/shared/lib/apiClient.ts` — runmidApiClient instance (use for service functions)
- `.planning/REQUIREMENTS.md` — ONB-* and API-* requirements

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `RunnerProfile` domain model with 10 existing fields — extend with 4 new fields
- `SaveProfile` handler with CreateOrUpdate pattern — works for onboarding too
- `SaveProfileRequest` DTO with gin binding tags — extend for new fields
- `RunnerProfileFromDomain` conversion function — extend for new fields
- `PostgresRepository.CreateOrUpdateProfile` with UPSERT — extend SQL
- `ErrorResponse` struct for consistent error format
- `GetPlanTemplate` returns JSON training templates — reference for spreadsheet content
- `runmidApiClient` in frontend with JWT interceptor — ready to use

### Established Patterns
- Gin framework with `c.ShouldBindJSON` for request validation
- `c.MustGet("user").(*auth.User)` for authenticated user context
- `ErrorResponse{Error, Code}` for all error responses
- `json.RawMessage` for flexible JSONB fields (PreferredDays, Goals, Injuries)
- UUID primary keys with `gen_random_uuid()`
- Schema initialization via `InitSchema()` method
- Portuguese error messages in user-facing responses

### Integration Points
- Route registration: `training.POST("/profile/spreadsheet", h.GenerateSpreadsheet)` in handler.go RegisterRoutes
- Frontend: New `src/features/onboarding/` module with service + types
- Database: ALTER TABLE `runner_profiles` ADD COLUMN for 4 new fields

</code_context>

<specifics>
## Specific Ideas

- Spreadsheet filename should be personalized: `planilha-runmind-{nome}.xlsx`
- Spreadsheet should feel premium — use RunMind brand colors (dark/green neon) in header rows
- Template logic: beginner gets 4 weeks, intermediate 6 weeks, advanced 8 weeks
- "Não sei" pace option should map to 0 in backend (handled gracefully in spreadsheet generation)

</specifics>

<deferred>
## Deferred Ideas

- AI-powered spreadsheet generation (ONB-F03 — explicitly out of scope for v1.1)
- Strava data import to pre-fill profile (ONB-F02 — future requirement)
- Profile editing after onboarding (noted in REQUIREMENTS.md out of scope)

</deferred>

---

*Phase: 05-runner-profile-api*
*Context gathered: 2026-04-22 via auto mode*
