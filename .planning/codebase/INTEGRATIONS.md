# External Integrations

**Analysis Date:** 2026-04-22

## APIs & External Services

**Authentication Service (cara-cracha):**
- Purpose: User registration, login, password reset, JWT token management
- Client: `authApiClient` in `src/shared/lib/apiClient.ts`
- Base URL env var: `NEXT_PUBLIC_AUTH_API_URL`
- Production URL: `https://runmind-cara-cracha-620849332552.us-central1.run.app`
- Endpoints consumed:
  - `POST /api/auth/login` - User login (`src/features/auth/services/authApi.ts`)
  - `POST /api/auth/register` - User registration
  - `POST /api/auth/forgot-password` - Password reset request
  - `POST /api/auth/reset-password` - Password reset with token
  - `POST /api/auth/refresh` - Token refresh (used by all API client interceptors)
- Auth: JWT Bearer tokens (access + refresh token pair)

**Chat/AI Agent Service:**
- Purpose: AI running coach chat, conversation management, mana (rate limiting) system
- Client: `chatApiClient` in `src/shared/lib/apiClient.ts`
- Base URL env var: `NEXT_PUBLIC_CHAT_API_URL`
- Production URL: `https://runmind-chat-agent-620849332552.us-central1.run.app`
- Endpoints consumed (`src/features/chat/services/chatApi.ts`):
  - `POST /api/v1/chat/message` - Send text message
  - `POST /api/v1/chat/message/attachment` - Send message with single image (multipart/form-data)
  - `POST /api/v1/chat/message/attachments` - Send message with multiple images (multipart/form-data)
  - `POST /api/v1/chat/conversations/${id}/message` - Send message to specific conversation
  - `GET /api/v1/chat/conversations/list` - List conversations (paginated)
  - `GET /api/v1/chat/conversations/${id}` - Get conversation with messages
  - `POST /api/v1/chat/conversations` - Create new conversation
  - `PATCH /api/v1/chat/conversations/${id}/title` - Update conversation title
  - `DELETE /api/v1/chat/conversations/${id}` - Delete conversation
  - `GET /api/v1/mana/status` - Get mana/rate limit status
- Auth: JWT Bearer token (auto-injected via interceptor)

**RunMid Backend API:**
- Purpose: Activities, Strava integration backend
- Client: `runmidApiClient` in `src/shared/lib/apiClient.ts`
- Base URL env var: `NEXT_PUBLIC_RUNMID_API_URL`
- Production URL: `https://runmid-api-620849332552.us-central1.run.app`
- Endpoints consumed (`src/features/strava/services/stravaApi.ts`):
  - `POST /api/v1/strava/token` - Exchange Strava OAuth code for tokens
  - `GET /api/v1/strava/access-token` - Get Strava connection status/token
  - `DELETE /api/v1/strava/disconnect` - Disconnect Strava integration
- Auth: JWT Bearer token (auto-injected via interceptor)

**General API:**
- Client: `apiClient` in `src/shared/lib/apiClient.ts`
- Base URL env var: `NEXT_PUBLIC_API_URL`
- Auth: JWT Bearer token with automatic 401 refresh + retry queue

## Third-Party OAuth

**Strava:**
- OAuth 2.0 Authorization Code flow
- Client ID env var: `NEXT_PUBLIC_STRAVA_CLIENT_ID` (value: `165299`)
- OAuth authorize URL: `https://www.strava.com/oauth/authorize`
- Scopes requested: `read,activity:read_all`
- Redirect URI: `{origin}/auth/strava/callback`
- CSRF protection: random state parameter stored in `localStorage` (`strava_oauth_state`)
- Implementation files:
  - `src/features/strava/utils/oauth.ts` - OAuth URL builder, state validation
  - `src/features/strava/services/stravaApi.ts` - Token exchange via backend
  - `src/features/strava/hooks/useStrava.ts` - React hook for Strava state
  - `src/app/auth/strava/callback/page.tsx` - OAuth callback handler page

**Garmin Connect IQ:**
- Status: Planned but not yet implemented (UI shows "Em breve" / "Coming soon")
- File: `src/features/settings/components/IntegrationsSection.tsx`

## Data Storage

**Databases:**
- None on frontend - All data persisted via backend APIs

**Client-Side Storage (localStorage):**
- `runmind_access_token` - JWT access token
- `runmind_refresh_token` - JWT refresh token
- `runmind_username` - Cached username
- `strava_oauth_state` - Temporary OAuth CSRF state
- Managed via `tokenStorage` in `src/shared/lib/apiClient.ts`

**File Storage:**
- None - Images attached to chat are sent directly to chat API as multipart/form-data

**Caching:**
- React Query in-memory cache for server state
- Strava status cached for 5 minutes (`staleTime: 1000 * 60 * 5` in `src/features/strava/hooks/useStrava.ts`)

## Authentication & Identity

**Auth Provider:**
- Custom JWT-based auth via "cara-cracha" backend service
- Implementation: Access token + refresh token pair stored in localStorage
- Token format: Standard JWT with `sub`, `username`, `email`, `exp` claims
- Profile extraction: Decoded from JWT payload client-side (no dedicated profile API call)
- Token refresh: Automatic on 401 responses via axios interceptors on all API clients
- Refresh queue: Concurrent 401s are queued and retried after single refresh (`src/shared/lib/apiClient.ts` lines 72-147)
- Files:
  - `src/shared/lib/apiClient.ts` - Token storage, interceptors, refresh logic
  - `src/features/auth/services/authApi.ts` - Auth API functions

## Monitoring & Observability

**Error Tracking:**
- None detected - No Sentry, Datadog, or similar SDK

**Logs:**
- `console.log` / `console.error` used directly (e.g., `src/app/auth/strava/callback/page.tsx`)
- Google Cloud Logging via Cloud Build (`options.logging: CLOUD_LOGGING_ONLY` in `cloudbuild.yaml`)

## CI/CD & Deployment

**Hosting:**
- Google Cloud Run (us-central1, project: `runmind-483617`)
- Service name: `runmind-app`
- Publicly accessible (`--allow-unauthenticated`)
- Production URL: `https://runmind-app-620849332552.us-central1.run.app`

**CI Pipeline:**
- Google Cloud Build (`cloudbuild.yaml`)
- Steps: Docker build -> Push to Artifact Registry -> Deploy to Cloud Run
- Container registry: `us-central1-docker.pkg.dev/$PROJECT_ID/cloud-run-source-deploy/runmind-app`
- Build args inject `NEXT_PUBLIC_*` env vars at build time

**Local Deployment:**
- `scripts/deploy.sh` - Supports `prod` (Cloud Run) and `local` (dev server) modes

## Environment Configuration

**Required env vars:**
- `NEXT_PUBLIC_API_URL` - General API URL
- `NEXT_PUBLIC_AUTH_API_URL` - Auth service (cara-cracha) URL
- `NEXT_PUBLIC_RUNMID_API_URL` - RunMid backend URL
- `NEXT_PUBLIC_CHAT_API_URL` - Chat agent service URL
- `NEXT_PUBLIC_STRAVA_CLIENT_ID` - Strava OAuth client ID

**Env files present:**
- `.env.example` - Template
- `.env.local` - Local development values
- `.env.production` - Production values

**Note:** All env vars are `NEXT_PUBLIC_` prefixed (client-side exposed). No server-side secrets are managed in this frontend app.

## Webhooks & Callbacks

**Incoming:**
- `GET /auth/strava/callback` - Strava OAuth callback page (`src/app/auth/strava/callback/page.tsx`)

**Outgoing:**
- None detected

---

*Integration audit: 2026-04-22*
