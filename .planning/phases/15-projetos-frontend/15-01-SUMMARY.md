---
phase: 15-projetos-frontend
plan: 01
subsystem: chat/projects
tags: [api-layer, react-query, types, service]
dependency_graph:
  requires: [chatApiClient]
  provides: [projectsApi, useProjects, Project types]
  affects: [chatApi.listConversations]
tech_stack:
  added: []
  patterns: [React Query mutations with cache invalidation, auto-dismiss errors]
key_files:
  created:
    - src/features/chat/services/projectsApi.ts
    - src/features/chat/hooks/useProjects.ts
  modified:
    - src/features/chat/types/index.ts
    - src/features/chat/services/chatApi.ts
    - src/features/chat/index.ts
decisions:
  - Used local useState for project expand/collapse state instead of API persistence
  - Error messages in Portuguese with 5-second auto-dismiss matching existing chat pattern
metrics:
  duration: ~3 min
  completed: 2026-04-24
---

# Phase 15 Plan 01: Projects API Layer Summary

Projects CRUD service and React Query hooks via chatApiClient with typed request/response contracts and cache invalidation.

## Task Results

| Task | Name | Commit | Files |
|------|------|--------|-------|
| 1 | Types + projectsApi service | b0615b7 | types/index.ts, services/projectsApi.ts, services/chatApi.ts |
| 2 | useProjects hook + barrel exports | 6717a39 | hooks/useProjects.ts, index.ts |

## What Was Built

### Types (src/features/chat/types/index.ts)
- Updated `Project` interface with `icon: string` and `updatedAt: Date` fields
- Added `ApiProject` interface for snake_case API response mapping
- Added `CreateProjectRequest`, `UpdateProjectRequest`, `MoveConversationRequest` types

### Service (src/features/chat/services/projectsApi.ts)
- `createProject` - POST /api/v1/chat/projects
- `listProjects` - GET /api/v1/chat/projects (unwraps `{ projects }` envelope)
- `updateProject` - PUT /api/v1/chat/projects/:id
- `deleteProject` - DELETE /api/v1/chat/projects/:id
- `moveConversation` - PATCH /api/v1/chat/conversations/:id/move

### Hook (src/features/chat/hooks/useProjects.ts)
- `useProjects()` returns: projects, isLoading, error, createProject, updateProject, deleteProject, moveConversation, toggleProject
- React Query with `staleTime: 30_000` for projects list
- Mutations invalidate `['projects']` and `['conversations']` query keys as appropriate
- Local `expandedState` via useState for sidebar toggle (not API-persisted)

### chatApi Update
- `listConversations` now accepts optional `projectId` parameter for server-side filtering

### Barrel Exports (src/features/chat/index.ts)
- Added: `projectsApi`, `useProjects`, `ApiProject`, `CreateProjectRequest`, `UpdateProjectRequest`, `MoveConversationRequest`

## Deviations from Plan

None - plan executed exactly as written.

## Known Stubs

None - all methods are fully wired to chatApiClient endpoints.

## Pre-existing Issues (Out of Scope)

- `ProjectItem.tsx` has TS errors passing `projects` and `onMoveToProject` props to `ConversationItem` which doesn't accept them yet. This is UI work for Plan 02, not caused by this plan's changes.

## Self-Check: PASSED
