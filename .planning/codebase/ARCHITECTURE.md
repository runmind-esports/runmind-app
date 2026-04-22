# Architecture

**Analysis Date:** 2026-04-22

## Pattern Overview

**Overall:** Feature-based modular frontend (Next.js App Router) with multiple backend microservices accessed via REST APIs.

**Key Characteristics:**
- Client-side rendered SPA behavior within Next.js App Router shell (all feature components are `'use client'`)
- Feature modules encapsulate components, hooks, services, types, and utilities with barrel file exports
- No server-side data fetching -- all data flows through client-side axios API clients
- Multiple independent backend services (auth, chat, strava/activities) accessed via separate axios instances
- JWT-based authentication with localStorage token storage and automatic refresh

## Layers

**Routing Layer (Next.js App Router):**
- Purpose: Page entry points and layout composition
- Location: `src/app/`
- Contains: Thin page components that delegate to feature modules, plus the root layout
- Depends on: Feature modules (imports via barrel files)
- Used by: Next.js framework (file-system routing)

**Feature Modules:**
- Purpose: Self-contained business domains with all related code
- Location: `src/features/`
- Contains: Components, hooks, services (API calls), types, schemas, utilities
- Depends on: Shared lib (`src/shared/`), shared UI (`src/components/ui/`)
- Used by: Page components in `src/app/`

**Shared Infrastructure:**
- Purpose: Cross-cutting utilities, providers, and hooks
- Location: `src/shared/`
- Contains: API clients with auth interceptors, React Query provider, theme provider/hook
- Depends on: External libraries (axios, react-query)
- Used by: All feature modules

**Shared UI Components:**
- Purpose: Reusable Radix UI-based primitives
- Location: `src/components/ui/`
- Contains: `button.tsx`, `textarea.tsx`, `avatar.tsx`, `scroll-area.tsx`, `theme-toggle.tsx`
- Depends on: Radix UI, `src/lib/utils.ts` (`cn` helper)
- Used by: Feature components

**Utility Layer:**
- Purpose: General-purpose helpers
- Location: `src/lib/utils.ts`
- Contains: `cn()` (Tailwind class merging), `generateId()` (random ID generation)
- Depends on: `clsx`, `tailwind-merge`
- Used by: All components

## Data Flow

**Chat Message Flow:**

1. User types message in `ChatInput` component (`src/features/chat/components/ChatInput.tsx`)
2. `Chat` component (`src/features/chat/components/Chat.tsx`) calls `handleSendMessage`
3. `useChat` hook (`src/features/chat/hooks/useChat.ts`) performs optimistic update (adds user message to local state immediately)
4. `chatApi.sendMessage()` or `chatApi.sendMessageWithAttachment()` (`src/features/chat/services/chatApi.ts`) sends POST to chat backend via `chatApiClient`
5. Response parsed via `parseResponseContent()` (handles both plain text and JSON block format)
6. Assistant message added to local state
7. If new conversation created, `useConversations` refreshes sidebar list

**Authentication Flow:**

1. User submits login form on `src/app/(auth)/login/page.tsx`
2. `useAuth` hook (`src/features/auth/hooks/useAuth.ts`) calls `authApi.login()` via React Query mutation
3. `authApi.login()` (`src/features/auth/services/authApi.ts`) POSTs to `authApiClient` (`/api/auth/login`)
4. JWT tokens stored in localStorage via `tokenStorage.setTokens()` (`src/shared/lib/apiClient.ts`)
5. React Query invalidates profile query, router pushes to `/chat`
6. All subsequent API calls include `Authorization: Bearer <token>` via axios request interceptors

**Token Refresh Flow:**

1. Any API client receives 401 response
2. Response interceptor on that client queues the failed request
3. Calls `authApiClient.post('/api/auth/refresh')` with stored refresh token
4. On success: updates stored tokens, retries all queued requests with new token
5. On failure: clears tokens, redirects to `/login`

**Strava OAuth Flow:**

1. User clicks "Connect Strava" in settings (`src/features/settings/components/IntegrationsSection.tsx`)
2. `useStrava` hook (`src/features/strava/hooks/useStrava.ts`) calls `connect()` which builds auth URL via `buildStravaAuthUrl()` (`src/features/strava/utils/oauth.ts`)
3. User redirected to Strava OAuth page
4. Strava redirects back to `src/app/auth/strava/callback/page.tsx`
5. Callback validates state (CSRF protection), exchanges code via `stravaApi.exchangeCode()` (`src/features/strava/services/stravaApi.ts`)
6. Backend (`runmidApiClient`) exchanges code for Strava tokens
7. On success, redirects to `/settings?strava=connected`

**State Management:**

- **Server state**: React Query (`@tanstack/react-query`) for auth profile and Strava status queries
- **Local component state**: `useState` hooks for chat messages, conversations, sidebar state, UI state
- **Form state**: React Hook Form + Zod schemas for auth forms (`src/features/auth/schemas/auth.schema.ts`)
- **Persisted state**: localStorage for JWT tokens (`runmind_access_token`, `runmind_refresh_token`, `runmind_username`), theme (`runmind-theme`), and OAuth state (`strava_oauth_state`)

## Key Abstractions

**API Clients:**
- Purpose: Centralized HTTP clients with auth token injection and refresh logic
- Location: `src/shared/lib/apiClient.ts`
- Pattern: Four axios instances (`apiClient`, `authApiClient`, `runmidApiClient`, `chatApiClient`) each with request interceptors for JWT and response interceptors for token refresh
- Usage: Feature service files import the appropriate client

**Feature Service Objects:**
- Purpose: Encapsulate all API calls for a feature domain
- Examples: `src/features/chat/services/chatApi.ts`, `src/features/auth/services/authApi.ts`, `src/features/strava/services/stravaApi.ts`
- Pattern: Exported const object with async methods that call the appropriate API client and return typed data

**Feature Hooks:**
- Purpose: Encapsulate stateful logic and side effects for feature domains
- Examples: `src/features/chat/hooks/useChat.ts`, `src/features/auth/hooks/useAuth.ts`, `src/features/strava/hooks/useStrava.ts`
- Pattern: Custom React hooks that combine local state, service calls, and React Query mutations. Return an object with state values and action functions.

**Barrel File Exports:**
- Purpose: Public API for each feature module
- Examples: `src/features/chat/index.ts`
- Pattern: Re-export components, hooks, services, types, and utils. Consumers import from `@/features/chat` rather than deep paths.

**Validation Schemas:**
- Purpose: Form validation rules with type inference
- Location: `src/features/auth/schemas/auth.schema.ts`
- Pattern: Zod schemas with `z.infer<>` for TypeScript type derivation

## Entry Points

**Root Layout:**
- Location: `src/app/layout.tsx`
- Triggers: Every page render
- Responsibilities: Wraps app in `QueryProvider` and `ThemeProvider`, sets HTML lang to `pt-BR`, applies dark class

**Landing Page:**
- Location: `src/app/page.tsx`
- Triggers: Root URL `/`
- Responsibilities: Marketing landing page with hero, features, pricing, testimonials (fully self-contained, no feature imports)

**Chat Page:**
- Location: `src/app/chat/page.tsx`
- Triggers: `/chat` route
- Responsibilities: Renders `<Chat />` from `@/features/chat`. The Chat component handles auth check and redirect.

**Auth Pages:**
- Location: `src/app/(auth)/login/page.tsx`, `src/app/(auth)/signup/page.tsx`, `src/app/(auth)/forgot-password/page.tsx`, `src/app/(auth)/connect-apps/page.tsx`
- Triggers: `/login`, `/signup`, `/forgot-password`, `/connect-apps`
- Responsibilities: Authentication forms using `useAuth` hook and Zod-validated React Hook Form

**Settings Page:**
- Location: `src/app/settings/page.tsx`
- Triggers: `/settings`
- Responsibilities: Renders `IntegrationsSection` from `@/features/settings`

**Strava Callback:**
- Location: `src/app/auth/strava/callback/page.tsx`
- Triggers: `/auth/strava/callback` (Strava OAuth redirect)
- Responsibilities: Validates OAuth state, exchanges code for tokens, redirects to settings

## Error Handling

**Strategy:** Try-catch at the hook/service layer with user-facing error messages in Portuguese

**Patterns:**
- API errors caught in hook `useCallback` functions, stored in local `error` state, displayed in UI
- Auth errors (401) handled globally by axios response interceptors -- attempt token refresh, redirect to `/login` on failure
- Optimistic updates in chat: user message added immediately, error state set if API call fails
- Strava OAuth errors: dedicated error UI in callback page with specific messages per error type
- React Query `retry: false` for auth and Strava queries to avoid hammering backend on auth failures

## Cross-Cutting Concerns

**Logging:** `console.error()` for caught exceptions in hooks and services. No structured logging framework.

**Validation:** Zod schemas in `src/features/auth/schemas/auth.schema.ts` for form inputs. Image validation in `src/features/chat/utils/imageValidation.ts`. No server-side validation (frontend-only app).

**Authentication:** JWT tokens in localStorage, injected via axios request interceptors on all four API clients. Token refresh handled automatically on 401 responses. Auth state checked via `authApi.isAuthenticated()` which decodes and validates JWT expiry client-side.

**Theming:** CSS custom properties in `src/app/globals.css` with `.dark` class toggle. `useTheme` hook in `src/shared/hooks/useTheme.ts` persists preference to localStorage. Default theme is dark.

---

*Architecture analysis: 2026-04-22*
