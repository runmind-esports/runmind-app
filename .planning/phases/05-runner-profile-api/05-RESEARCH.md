# Phase 5: Runner Profile API - Research

**Researched:** 2026-04-22
**Domain:** Go backend API (Gin + PostgreSQL) + Frontend TypeScript service layer
**Confidence:** HIGH

## Summary

Phase 5 extends an existing, well-structured Go backend (runmid-api) to support onboarding profile persistence and XLSX spreadsheet generation. The backend already has a `RunnerProfile` domain model, `SaveProfile` handler with UPSERT behavior, and a full repository layer in PostgreSQL. The work is additive: 4 new fields on the domain model, 4 new columns in the database, an extended DTO, and one new endpoint for spreadsheet generation using the `excelize` library. On the frontend, a new `src/features/onboarding/` module provides TypeScript types and service functions consuming `runmidApiClient`.

The codebase follows clean hexagonal architecture (domain -> ports -> adapters) with Gin framework patterns (ShouldBindJSON, ErrorResponse, MustGet user). All patterns are established and well-documented in the existing code -- this phase is pure extension, not invention.

**Primary recommendation:** Follow the existing handler/DTO/repo extension pattern exactly. Add excelize as the only new Go dependency. Frontend service layer mirrors the stravaApi.ts pattern.

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions
- D-01: Extend RunnerProfile domain model with 4 new fields (HasRacedBefore, OtherActivities, TrainingPreference, IncludeStrengthTraining)
- D-02: Specific onboarding question-to-field mapping table (ONB-03 through ONB-11)
- D-03: XLSX format using excelize Go library
- D-04: 3-sheet spreadsheet structure (Resumo, Plano Semanal, Dicas) with template selection by goal+fitness+days
- D-05: POST /api/v1/training/profile (extend existing) + GET /api/v1/training/profile/spreadsheet (new)
- D-06: Validation rules following existing gin binding pattern
- D-07: Frontend service layer in src/features/onboarding/ using runmidApiClient

### Claude's Discretion
- Database migration approach (ALTER TABLE vs schema auto-migration)
- Spreadsheet template design details (colors, fonts, cell formatting)
- Error message wording in Portuguese
- Internal code organization within the Go training module

### Deferred Ideas (OUT OF SCOPE)
- AI-powered spreadsheet generation (ONB-F03)
- Strava data import to pre-fill profile (ONB-F02)
- Profile editing after onboarding
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| API-01 | POST endpoint to persist runner profile | Existing SaveProfile handler + CreateOrUpdateProfile repo method -- extend with 4 new fields |
| API-02 | GET endpoint to generate and return personalized spreadsheet | New GenerateSpreadsheet handler using excelize library, profile-based template selection |
</phase_requirements>

## Project Constraints (from CLAUDE.md)

- Tech stack: Next.js 14 + React 18 + TypeScript + Tailwind CSS (frontend)
- Backend: Go with Gin framework, PostgreSQL, hexagonal architecture
- API client: Use `runmidApiClient` from `src/shared/lib/apiClient.ts` for training endpoints
- Naming: Services use camelCase with Api suffix (e.g., `onboardingApi.ts`), types use PascalCase
- Code style: Single quotes, no semicolons, 2-space indent, trailing commas
- Feature modules: Barrel file exports via `index.ts`
- Error messages: Portuguese (pt-BR) for user-facing, English for code identifiers
- No test framework configured

## Standard Stack

### Core (Backend - Go)
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| gin-gonic/gin | 1.11.0 | HTTP framework | Already in go.mod, all handlers use it [VERIFIED: go.mod] |
| xuri/excelize/v2 | v2.9.x (latest) | XLSX generation | De facto Go XLSX library, pure Go, no CGO [CITED: github.com/qax-os/excelize] |
| lib/pq | 1.10.9 | PostgreSQL driver | Already in go.mod [VERIFIED: go.mod] |
| google/uuid | 1.6.0 | UUID generation | Already in go.mod [VERIFIED: go.mod] |

### Core (Frontend - TypeScript)
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| axios | ^1.13.6 | HTTP client | Already used via runmidApiClient [VERIFIED: apiClient.ts] |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| excelize | tealeg/xlsx | excelize is more actively maintained, better API, streaming support |
| XLSX download | CSV | XLSX chosen per D-03 for phone/desktop accessibility |

**Installation (backend only):**
```bash
cd /Users/douglas.mesquita/Documents/runmid/runmid-api
go get github.com/xuri/excelize/v2
```

**No frontend packages needed** -- all dependencies already exist.

## Architecture Patterns

### Backend: Extend Existing Hexagonal Architecture

The training module already follows domain -> ports -> adapters. Extend each layer:

```
internal/training/
  domain/
    runner_profile.go    # ADD 4 fields to RunnerProfile struct
    errors.go            # No changes needed (ErrProfileNotFound exists)
  ports/
    repository.go        # No changes needed (CreateOrUpdateProfile + GetProfileByUserID exist)
  adapters/
    dto.go               # EXTEND SaveProfileRequest + RunnerProfileDTO with 4 new fields
    handler.go           # ADD GenerateSpreadsheet handler, EXTEND SaveProfile field mapping
    postgres_repo.go     # EXTEND InitSchema (ALTER TABLE), EXTEND UPSERT query
    spreadsheet.go       # NEW file - spreadsheet generation logic
    templates.go         # NEW file - training plan templates data
```

### Frontend: New Feature Module

```
src/features/onboarding/
  index.ts               # Barrel exports
  services/
    onboardingApi.ts     # saveProfile() + downloadSpreadsheet()
  types/
    onboarding.types.ts  # SaveProfileRequest, RunnerProfile, API response types
```

### Pattern 1: Extending SaveProfileRequest DTO
**What:** Add 4 new fields to the existing request struct with gin binding tags
**When to use:** When the existing endpoint needs more data
**Example:**
```go
// Source: existing pattern in dto.go lines 71-82
type SaveProfileRequest struct {
    // ... existing fields ...
    HasRacedBefore         bool            `json:"hasRacedBefore,omitempty"`
    OtherActivities        json.RawMessage `json:"otherActivities,omitempty"`
    TrainingPreference     string          `json:"trainingPreference,omitempty"`    // short_intense, long_moderate, any
    IncludeStrengthTraining bool           `json:"includeStrengthTraining,omitempty"`
}
```
[VERIFIED: existing DTO pattern in adapters/dto.go]

### Pattern 2: File Download Response in Gin
**What:** Return binary file with proper Content-Type and Content-Disposition headers
**When to use:** Spreadsheet download endpoint
**Example:**
```go
// Source: Gin framework standard pattern
func (h *Handler) GenerateSpreadsheet(c *gin.Context) {
    user := c.MustGet("user").(*auth.User)
    
    profile, err := h.repo.GetProfileByUserID(c.Request.Context(), user.ID)
    if err != nil {
        if err == domain.ErrProfileNotFound {
            c.JSON(http.StatusNotFound, ErrorResponse{
                Error: "Perfil nao encontrado. Complete o onboarding primeiro.",
                Code:  "PROFILE_NOT_FOUND",
            })
            return
        }
        // ... error handling
    }
    
    // Generate XLSX
    buf, err := generateSpreadsheet(profile)
    // ...
    
    filename := "planilha-runmind.xlsx"
    c.Header("Content-Disposition", "attachment; filename=\""+filename+"\"")
    c.Data(http.StatusOK, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", buf.Bytes())
}
```
[VERIFIED: Gin c.Data pattern for binary responses]

### Pattern 3: Frontend Service for File Download
**What:** Axios request with responseType blob for downloading binary files
**When to use:** When the frontend needs to trigger a file download
**Example:**
```typescript
// Source: existing stravaApi.ts pattern + axios blob download
import { runmidApiClient } from '@/shared/lib/apiClient'

export const onboardingApi = {
  saveProfile: async (data: SaveProfileRequest): Promise<RunnerProfileResponse> => {
    const { data: response } = await runmidApiClient.post<RunnerProfileResponse>(
      '/api/v1/training/profile',
      data
    )
    return response
  },

  downloadSpreadsheet: async (): Promise<Blob> => {
    const { data } = await runmidApiClient.get('/api/v1/training/profile/spreadsheet', {
      responseType: 'blob',
    })
    return data
  },
}
```
[VERIFIED: runmidApiClient pattern from apiClient.ts + stravaApi.ts service pattern]

### Anti-Patterns to Avoid
- **Generating spreadsheet on POST**: Keep POST for profile persistence only, GET for spreadsheet generation (per D-05). This separates concerns and allows re-downloading.
- **Storing XLSX files on disk**: Generate on-the-fly from profile data using excelize's in-memory buffer. No file storage needed.
- **Duplicating validation logic**: Frontend types should mirror backend DTOs but validation runs server-side via gin binding tags.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| XLSX file creation | Custom binary XLSX writer | excelize library | XLSX format is complex (ZIP of XML files), excelize handles it correctly |
| UUID generation | String concatenation | google/uuid (already in project) | RFC 4122 compliant, already used everywhere |
| Request validation | Manual if/else chains | Gin binding tags + custom validators | Consistent with all existing endpoints |
| File download response | Manual header construction | Gin c.Data() method | Handles Content-Length and proper streaming |

## Common Pitfalls

### Pitfall 1: ALTER TABLE with JSONB defaults
**What goes wrong:** Adding JSONB columns without DEFAULT values can fail for existing rows or cause NULL handling issues
**Why it happens:** PostgreSQL requires explicit handling of NULLable JSONB columns
**How to avoid:** Use `DEFAULT NULL` for new JSONB columns (OtherActivities). Use `DEFAULT false` for booleans (HasRacedBefore, IncludeStrengthTraining). Use `DEFAULT ''` or `DEFAULT 'any'` for string columns (TrainingPreference).
**Warning signs:** NULL pointer dereferences when reading existing profiles that predate the migration

### Pitfall 2: Excelize buffer not closed
**What goes wrong:** Memory leak if excelize File is not closed after writing
**Why it happens:** excelize.NewFile() allocates internal buffers
**How to avoid:** Always `defer f.Close()` after creating an excelize file, and use `f.WriteToBuffer()` to get bytes for the HTTP response
**Warning signs:** Increasing memory usage under load

### Pitfall 3: Frontend blob download not triggering browser save
**What goes wrong:** Axios returns blob data but browser doesn't show "Save As" dialog
**Why it happens:** Need to create a temporary URL and click a hidden anchor element
**How to avoid:** Use the standard blob-to-download pattern:
```typescript
const blob = await onboardingApi.downloadSpreadsheet()
const url = window.URL.createObjectURL(blob)
const a = document.createElement('a')
a.href = url
a.download = 'planilha-runmind.xlsx'
a.click()
window.URL.revokeObjectURL(url)
```
**Warning signs:** File data received but nothing happens visually [ASSUMED]

### Pitfall 4: UPSERT query not including new columns
**What goes wrong:** New columns are not included in the ON CONFLICT DO UPDATE SET clause, so updates lose data
**Why it happens:** The existing UPSERT in postgres_repo.go explicitly lists all columns
**How to avoid:** Add all 4 new columns to both INSERT values and the ON CONFLICT update list
**Warning signs:** New fields save on first POST but revert to defaults on subsequent updates

### Pitfall 5: Schema migration race condition with InitSchema
**What goes wrong:** InitSchema uses CREATE TABLE IF NOT EXISTS but this won't add new columns to existing tables
**Why it happens:** The table already exists, so CREATE TABLE IF NOT EXISTS is a no-op
**How to avoid:** Add ALTER TABLE statements after the CREATE TABLE block, using `IF NOT EXISTS` pattern: `ALTER TABLE runner_profiles ADD COLUMN IF NOT EXISTS has_raced_before BOOLEAN DEFAULT false`
**Warning signs:** New columns don't appear in the database despite successful deployment

## Code Examples

### Extending RunnerProfile Domain Model
```go
// Source: existing runner_profile.go pattern
type RunnerProfile struct {
    // ... existing 12 fields ...
    HasRacedBefore          bool            `json:"hasRacedBefore"`
    OtherActivities         json.RawMessage `json:"otherActivities"`
    TrainingPreference      string          `json:"trainingPreference"`      // short_intense, long_moderate, any
    IncludeStrengthTraining bool            `json:"includeStrengthTraining"`
}
```
[VERIFIED: existing struct pattern in domain/runner_profile.go]

### Excelize Spreadsheet Generation
```go
// Source: excelize official API pattern
import "github.com/xuri/excelize/v2"

func generateSpreadsheet(profile *domain.RunnerProfile) (*bytes.Buffer, error) {
    f := excelize.NewFile()
    defer f.Close()

    // Sheet 1: Resumo
    f.SetSheetName("Sheet1", "Resumo")
    f.SetCellValue("Resumo", "A1", "Perfil do Corredor")
    f.SetCellValue("Resumo", "A2", "Nivel")
    f.SetCellValue("Resumo", "B2", string(profile.FitnessLevel))
    // ... more profile data

    // Sheet 2: Plano Semanal
    f.NewSheet("Plano Semanal")
    // ... weekly plan based on template selection

    // Sheet 3: Dicas
    f.NewSheet("Dicas")
    // ... tips based on profile

    buf, err := f.WriteToBuffer()
    if err != nil {
        return nil, err
    }
    return buf, nil
}
```
[ASSUMED: excelize API based on training knowledge, confirmed library exists via web search]

### ALTER TABLE Migration
```go
// Source: existing InitSchema pattern in postgres_repo.go
// Add after CREATE TABLE IF NOT EXISTS runner_profiles block:
ALTER TABLE runner_profiles ADD COLUMN IF NOT EXISTS has_raced_before BOOLEAN DEFAULT false;
ALTER TABLE runner_profiles ADD COLUMN IF NOT EXISTS other_activities JSONB;
ALTER TABLE runner_profiles ADD COLUMN IF NOT EXISTS training_preference VARCHAR(20) DEFAULT 'any';
ALTER TABLE runner_profiles ADD COLUMN IF NOT EXISTS include_strength_training BOOLEAN DEFAULT false;
```
[VERIFIED: PostgreSQL ALTER TABLE ADD COLUMN IF NOT EXISTS syntax]

### Route Registration
```go
// Source: existing RegisterRoutes in handler.go line 49
// Add within the training route group:
training.GET("/profile/spreadsheet", h.GenerateSpreadsheet)
```
[VERIFIED: existing route registration pattern in handler.go]

### Frontend Types
```typescript
// Source: mirrors backend SaveProfileRequest DTO
export interface SaveProfileRequest {
  fitnessLevel: string
  weeklyKmCapacity: number
  longestRunKm?: number
  pace5kSeconds: number
  preferredDays: string[]
  longRunDay?: string
  injuriesHistory?: Record<string, unknown>
  goals: string[]
  runningExpMonths?: number
  stravaConnected?: boolean
  hasRacedBefore: boolean
  otherActivities?: Record<string, unknown>
  trainingPreference: string
  includeStrengthTraining: boolean
}

export interface RunnerProfileResponse {
  id: string
  userId: string
  fitnessLevel: string
  weeklyKmCapacity: number
  pace5kSeconds: number
  pace5kFormatted: string
  preferredDays: string[]
  goals: unknown[]
  hasRacedBefore: boolean
  otherActivities: unknown
  trainingPreference: string
  includeStrengthTraining: boolean
  createdAt: string
  updatedAt: string
}
```
[VERIFIED: mirrors existing RunnerProfileDTO + SaveProfileRequest patterns]

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| tealeg/xlsx | xuri/excelize/v2 | 2020+ | excelize is the de facto standard Go XLSX library |
| Manual SQL migrations | ALTER TABLE IF NOT EXISTS in InitSchema | Project convention | Keeps migration inline with schema init |

## Assumptions Log

| # | Claim | Section | Risk if Wrong |
|---|-------|---------|---------------|
| A1 | excelize WriteToBuffer returns bytes.Buffer compatible with Gin c.Data | Code Examples | Would need alternative approach to stream XLSX to response |
| A2 | Blob download with hidden anchor pattern works for XLSX on mobile browsers | Common Pitfalls | Mobile Safari may need different download approach |
| A3 | excelize v2.9.x is the latest stable version | Standard Stack | Version may differ, but API is stable across v2.x |

## Open Questions

1. **Spreadsheet template content granularity**
   - What we know: Templates selected by goal distance + fitness level + days per week
   - What's unclear: Exact workout content for each template combination (could be 3 goals x 3 levels x 4 day options = 36 templates)
   - Recommendation: Start with a simplified matrix (goal x fitness level = ~9 templates, adapt days count within each). This is Claude's discretion per CONTEXT.md.

2. **Personalized filename with user name**
   - What we know: CONTEXT.md specifics section mentions `planilha-runmind-{nome}.xlsx`
   - What's unclear: The RunnerProfile domain model does not store user name -- it's in the auth service
   - Recommendation: Use generic `planilha-runmind.xlsx` unless username is available from the auth user context (check if `auth.User` has a Name field)

## Environment Availability

| Dependency | Required By | Available | Version | Fallback |
|------------|------------|-----------|---------|----------|
| Go runtime | Backend compilation | N/A (backend deploys separately) | 1.23.0 (go.mod) | -- |
| PostgreSQL | Data persistence | N/A (backend infra) | -- | -- |
| Node.js | Frontend dev/build | Assumed available | 20+ | -- |
| npm | Package management | Assumed available | -- | -- |

**Note:** This phase modifies two separate repos. The backend (runmid-api) runs independently. No new external dependencies needed on the frontend. The only new dependency is `excelize` in the Go backend.

## Security Domain

### Applicable ASVS Categories

| ASVS Category | Applies | Standard Control |
|---------------|---------|-----------------|
| V2 Authentication | yes | Existing JWT via gin middleware (c.MustGet("user")) |
| V3 Session Management | no | Handled by existing interceptors |
| V4 Access Control | yes | User can only access own profile (user.ID from JWT) |
| V5 Input Validation | yes | Gin binding tags + domain enum validation |
| V6 Cryptography | no | No crypto operations in this phase |

### Known Threat Patterns

| Pattern | STRIDE | Standard Mitigation |
|---------|--------|---------------------|
| IDOR on profile/spreadsheet | Spoofing/Elevation | Profile fetched by authenticated user.ID, not URL param [VERIFIED: handler.go GetProfile pattern] |
| JSONB injection | Tampering | json.RawMessage handled by Go stdlib, PostgreSQL JSONB is safe |
| Oversized XLSX causing OOM | DoS | Profile-based generation is bounded (max 8 weeks x 7 days) |

## Sources

### Primary (HIGH confidence)
- Backend codebase: `runner_profile.go`, `handler.go`, `dto.go`, `postgres_repo.go`, `repository.go` -- all read and analyzed
- Frontend codebase: `apiClient.ts`, `stravaApi.ts` -- patterns confirmed
- `go.mod` -- current dependency versions verified

### Secondary (MEDIUM confidence)
- [excelize GitHub](https://github.com/qax-os/excelize) -- confirmed as active, latest release Feb 2026
- [excelize Go Packages](https://pkg.go.dev/github.com/xuri/excelize/v2) -- import path confirmed

### Tertiary (LOW confidence)
- Excelize exact API details (WriteToBuffer, cell styling) -- based on training knowledge, needs verification during implementation

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH -- all libraries verified in go.mod or via web search
- Architecture: HIGH -- extending verified existing patterns, no new architecture
- Pitfalls: HIGH -- identified from direct code analysis of existing UPSERT, InitSchema, and download patterns

**Research date:** 2026-04-22
**Valid until:** 2026-05-22 (stable -- extending existing codebase)
