# Phase 6: Onboarding Flow - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-04-23
**Phase:** 06-onboarding-flow
**Areas discussed:** State management, Auth integration, Route protection, API submission mapping
**Mode:** Auto (all recommendations accepted)

---

## State Management

| Option | Description | Selected |
|--------|-------------|----------|
| useState with step index | Simple hook with currentStep + answers record | ✓ |
| useReducer | More structured but overkill for linear wizard | |
| react-hook-form + Zod | Full form library — too heavy for single-select questions | |

**User's choice:** useState with step index (auto-selected recommended)

---

## Auth Integration

| Option | Description | Selected |
|--------|-------------|----------|
| Decode JWT for username | Reuse existing authApi pattern | ✓ |
| Dedicated profile API call | Extra network request | |

**User's choice:** Decode JWT for username (auto-selected recommended)

---

## Route Protection

| Option | Description | Selected |
|--------|-------------|----------|
| Client-side tokenStorage check | Matches existing /chat pattern | ✓ |
| Next.js middleware | Server-side but not used anywhere in project | |

**User's choice:** Client-side tokenStorage check (auto-selected recommended)

---

## API Submission Mapping

| Option | Description | Selected |
|--------|-------------|----------|
| Map form state to SaveProfileRequest | Use types from Phase 5 directly | ✓ |
| Create separate onboarding DTO | Extra indirection | |

**User's choice:** Map form state to SaveProfileRequest (auto-selected recommended)

---

## Claude's Discretion

- Component file organization
- Helper function naming
- Error retry logic
- Questions config vs individual step components
