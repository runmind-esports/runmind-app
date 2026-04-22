# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

RunMind is an AI-powered running coach frontend application built with Next.js 14, React 18, TypeScript, and Tailwind CSS. The app provides a chat-based interface for users to interact with an AI coach.

## Commands

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run lint     # Run ESLint
npm start        # Start production server
```

## Deployment

Use the deploy script (ensures correct project `runmind-483617`):
```bash
./scripts/deploy.sh prod   # Deploy to Cloud Run
./scripts/deploy.sh local  # Run local dev server
```

Production URL: https://runmind-app-620849332552.us-central1.run.app

## Architecture

### Feature-Based Organization

Code is organized by feature modules in `src/features/`:

- **auth** - Authentication (login, register, password reset)
- **chat** - AI chat interface (messages, conversations, sidebar)
- **strava** - Strava integration
- **settings** - User settings and integrations

Each feature module exports its public API through an `index.ts` barrel file with:
- Components
- Hooks
- Services (API functions)
- Types

### API Layer

Multiple backend services are accessed via axios clients in `src/shared/lib/apiClient.ts`:

| Client | Environment Variable | Purpose |
|--------|---------------------|---------|
| `authApiClient` | `NEXT_PUBLIC_AUTH_API_URL` | Authentication service (cara-cracha) |
| `chatApiClient` | `NEXT_PUBLIC_CHAT_API_URL` | Chat/AI agent service |
| `runmidApiClient` | `NEXT_PUBLIC_RUNMID_API_URL` | Activities, Strava |
| `apiClient` | `NEXT_PUBLIC_API_URL` | General API |

All clients include automatic JWT token injection via request interceptors. The main `apiClient` also handles token refresh on 401 responses.

### Token Management

`tokenStorage` in `apiClient.ts` manages JWT tokens in localStorage:
- `runmind_access_token` - JWT access token
- `runmind_refresh_token` - Refresh token
- `runmind_username` - Cached username

### State Management

- **React Query** (`@tanstack/react-query`) for server state via `QueryProvider`
- **React Hook Form** with **Zod** for form validation (schemas in `features/auth/schemas/`)

### UI Components

- Shared UI primitives in `src/components/ui/` (Radix UI-based)
- Feature-specific components in `src/features/*/components/`

### Routing

Next.js App Router with route groups:
- `(auth)` - Authentication pages (login, register, etc.)
- `auth/strava/callback` - Strava OAuth callback
- `chat` - Main chat interface
- `settings` - User settings

## Build Configuration

- Output mode: `standalone` (for Docker deployment)
- Images: unoptimized (for static export compatibility)

<!-- GSD:project-start source:PROJECT.md -->
## Project

**RunMind Landing Page**

Landing page estruturada para o RunMind — um coach de corrida com IA que conecta Strava/Garmin e oferece planos de treino personalizados e suporte 24/7 via chat. A landing page será uma rota separada (`/`) que espelha o pitch de vendas do produto, com 5 dobras alinhadas à jornada do usuário e ao modelo de negócio. Disponível em PT-BR e inglês.

**Core Value:** Converter visitantes em usuários demonstrando que o RunMind entrega treinamento de elite acessível — preenchendo o gap do mercado brasileiro onde coaching humano é caro e planilhas são genéricas.

### Constraints

- **Tech Stack**: Next.js 14 + React 18 + Tailwind CSS — manter stack existente
- **Rota**: Landing page em `/`, sem alterar rotas existentes (`/login`, `/signup`, `/chat`, `/settings`)
- **i18n**: PT-BR como padrão, inglês como segunda língua
- **API**: Big Numbers via `runmidApiClient` existente
- **Responsividade**: Mobile-first (público brasileiro usa muito celular)
- **Performance**: Landing page deve carregar rápido — SSR/SSG quando possível
<!-- GSD:project-end -->

<!-- GSD:stack-start source:codebase/STACK.md -->
## Technology Stack

## Languages
- TypeScript 5.x - All application code (`src/**/*.ts`, `src/**/*.tsx`)
- JavaScript - Configuration files (`next.config.js`, `postcss.config.js`)
## Runtime
- Node.js 20 (Alpine) - Specified in `Dockerfile` (`node:20-alpine`)
- npm
- Lockfile: `package-lock.json` (present)
## Frameworks
- Next.js 14.2.21 - App Router, standalone output mode (`next.config.js`)
- React 18.x - UI rendering
- React DOM 18.x - DOM bindings
- Not detected - No test framework configured (no jest/vitest config, no test scripts in `package.json`)
- Next.js built-in compiler (SWC) - Build and dev server
- TypeScript 5.x - Type checking (`tsconfig.json`)
- ESLint 8.x with `eslint-config-next` 14.2.21 - Linting
- PostCSS 8.x - CSS processing (`postcss.config.js`)
## Key Dependencies
- `next` 14.2.21 - Application framework, standalone output for Docker deployment
- `react` ^18 / `react-dom` ^18 - UI framework
- `axios` ^1.13.6 - HTTP client for all backend API communication (`src/shared/lib/apiClient.ts`)
- `@tanstack/react-query` ^5.90.21 - Server state management, caching, mutations (`src/shared/providers/QueryProvider.tsx`)
- `react-hook-form` ^7.71.2 - Form state management
- `@hookform/resolvers` ^5.2.2 - Schema-based validation resolvers
- `zod` ^4.3.6 - Schema validation (used in `src/features/auth/schemas/`)
- `tailwindcss` ^3.4.1 - Utility-first CSS framework (`tailwind.config.ts`)
- `@radix-ui/react-avatar` ^1.0.4 - Accessible avatar component
- `@radix-ui/react-scroll-area` ^1.0.5 - Accessible scroll area
- `@radix-ui/react-slot` ^1.0.2 - Polymorphic component support
- `lucide-react` ^0.312.0 - Icon library
- `class-variance-authority` ^0.7.0 - Component variant styling
- `clsx` ^2.1.0 - Conditional class joining
- `tailwind-merge` ^2.2.0 - Tailwind class deduplication
- `autoprefixer` ^10.4.27 - CSS vendor prefixing
## Configuration
- Target: ES2022 with bundler module resolution (`tsconfig.json`)
- Strict mode enabled
- Path alias: `@/*` maps to `./src/*`
- Dark mode: class-based (`tailwind.config.ts`)
- Custom design tokens via CSS variables (colors, fonts, spacing)
- Primary font: Manrope (sans), Display font: Poppins
- Custom animations: shimmer
- Output: `standalone` (optimized for Docker)
- Images: `unoptimized: true` (no image optimization server)
- SVG: `dangerouslyAllowSVG: false`
- `NEXT_PUBLIC_API_URL` - General API base URL
- `NEXT_PUBLIC_AUTH_API_URL` - Authentication service (cara-cracha) URL
- `NEXT_PUBLIC_RUNMID_API_URL` - RunMid backend API URL
- `NEXT_PUBLIC_CHAT_API_URL` - Chat/AI agent service URL
- `NEXT_PUBLIC_STRAVA_CLIENT_ID` - Strava OAuth client ID
- `.env.example` - Template with required vars
- `.env.local` - Local development (present, not read)
- `.env.production` - Production values (present, not read)
## Platform Requirements
- Node.js 20+
- npm
- Environment variables configured in `.env.local`
- Google Cloud Run (us-central1)
- Docker container (node:20-alpine, standalone Next.js)
- Google Cloud Build for CI/CD (`cloudbuild.yaml`)
- Google Artifact Registry for container images
<!-- GSD:stack-end -->

<!-- GSD:conventions-start source:CONVENTIONS.md -->
## Conventions

## Naming Patterns
- React components: PascalCase (`ChatInput.tsx`, `MessageBubble.tsx`, `AuthLayout.tsx`)
- Hooks: camelCase with `use` prefix (`useChat.ts`, `useChatInput.ts`, `useConversations.ts`)
- Services/API modules: camelCase with `Api` suffix (`chatApi.ts`, `authApi.ts`, `stravaApi.ts`)
- Types: camelCase with `.types.ts` suffix for standalone type files (`auth.types.ts`), or `index.ts` inside `types/` directory
- Schemas: camelCase with `.schema.ts` suffix (`auth.schema.ts`)
- Utilities: camelCase (`imageValidation.ts`, `oauth.ts`, `utils.ts`)
- UI primitives: kebab-case (`button.tsx`, `scroll-area.tsx`, `avatar.tsx`)
- Use camelCase for all functions: `sendMessage`, `loadConversation`, `clearMessages`
- React components use PascalCase function declarations: `export function Chat() {}`
- Event handlers use `handle` prefix: `handleSubmit`, `handleKeyDown`, `handleSendMessage`
- Callback props use `on` prefix: `onSend`, `onClose`, `onSelectConversation`, `onClear`
- API methods are grouped as object literals: `chatApi.sendMessage()`, `authApi.login()`
- Use camelCase: `isLoading`, `hasMessages`, `activeConversationId`
- Boolean variables use `is`/`has`/`can` prefix: `isSubmitting`, `hasAttachments`, `canSubmit`
- Constants use UPPER_SNAKE_CASE: `ACCESS_TOKEN_KEY`, `MAX_FILE_SIZE`, `ACCEPTED_TYPES`
- Refs use `Ref` suffix: `textareaRef`, `justCreatedRef`
- Interfaces use PascalCase: `Message`, `ChatState`, `AuthTokens`
- Props interfaces use component name + `Props` suffix: `ChatInputProps`, `MessageBubbleProps`, `AuthLayoutProps`
- Type aliases from Zod schemas use `Input` suffix: `LoginInput`, `RegisterInput`
- API-specific types use `Api` prefix: `ApiMessage`, `ApiConversation`
- Request/response types use descriptive suffixes: `SendMessageRequest`, `SendMessageResponse`
## Code Style
- No Prettier config detected; formatting is handled by default ESLint/editor settings
- Single quotes for strings (consistent across codebase)
- No semicolons at end of statements
- 2-space indentation
- Trailing commas in multi-line constructs
- ESLint with `next/core-web-vitals` preset (see `.eslintrc.json`)
- Run with `npm run lint`
- Occasional `eslint-disable-next-line` for `react-hooks/exhaustive-deps` when dependency arrays are intentionally incomplete (see `src/features/chat/components/Chat.tsx` line 49)
- Strict mode enabled (`tsconfig.json`)
- Target: ES2022
- Use `interface` for object shapes, `type` for unions/intersections and Zod inferred types
- Generic typing on axios calls: `chatApiClient.post<SendMessageResponse>(...)`
- Avoid `any`; use specific types or `unknown` with narrowing
## Import Organization
- `@/*` maps to `./src/*` (defined in `tsconfig.json`)
- Use `@/components/ui/button` for shared UI components
- Use `@/shared/lib/apiClient` for shared library code
- Use `@/features/auth/hooks/useAuth` for cross-feature imports
- Use relative paths (`../`, `./`) for intra-feature imports
## Component Patterns
- Use named function exports: `export function ComponentName() {}` (not arrow functions for components)
- UI primitives use `React.forwardRef` with `displayName` (see `src/components/ui/button.tsx`)
- All client components start with `'use client'` directive
- Page components use `export default function PageName()` (Next.js App Router convention)
- Define props interface inline above the component or in the same file
- Use destructuring in function parameters: `function ChatInput({ onSend, disabled }: ChatInputProps)`
- Optional props use `?` syntax: `disabled?: boolean`
## Service/API Layer Patterns
- Each API module uses its designated axios client from `src/shared/lib/apiClient.ts`
- Methods return `response.data` (unwrap axios response)
- Request/response types are defined in the service file or imported from types
- API paths follow REST conventions: `/api/v1/{resource}/{action}`
## Hook Patterns
- Chat hooks use `useState` + `useCallback` for manual state management
- State updates use functional form: `setState((prev) => ({ ...prev, ... }))`
- Optimistic updates pattern: update UI immediately, then call API
## Error Handling
- API errors caught with try/catch in hooks, set error state as user-facing string
- Error messages are in Portuguese (pt-BR): `'Erro ao enviar mensagem. Tente novamente.'`
- Errors logged to `console.error` with descriptive prefix: `console.error('Error sending message:', error)`
- No global error boundary detected
- Auth errors (401) handled by axios interceptors with automatic token refresh and redirect to `/login`
- Inline error messages below form fields (validation errors from Zod)
- Banner-style error messages above forms (API errors)
- Auto-dismissing errors in chat input (5-second timeout)
## Logging
- Use `console.error` for caught exceptions: `console.error('Error fetching conversations:', err)`
- No structured logging library
- No server-side logging framework
## Comments
- Section dividers in barrel files: `// Components`, `// Hooks`, `// Services`, `// Types`, `// Utils`
- Inline explanations for non-obvious logic: `// Optimistic update: add user message immediately`
- ESLint disable comments with no explanation
- JSDoc-style `/** */` comments on Strava API methods (see `src/features/strava/services/stravaApi.ts`)
- Minimal usage; primarily in the Strava service module
- Not enforced across the codebase
## Barrel File / Module Export Pattern
- `src/features/chat/components/Sidebar/index.ts`
- `src/features/auth/components/index.ts`
## Form Handling
- Schemas defined in `src/features/auth/schemas/auth.schema.ts`
- Validation messages in Portuguese
- Inferred types exported alongside schemas: `type LoginInput = z.infer<typeof loginSchema>`
## Styling
- `var(--background)`, `var(--foreground)`, `var(--accent)`, `var(--border)`
- Dark mode enabled via `darkMode: 'class'`
## Language
- UI text is in **Portuguese (pt-BR)**: buttons, labels, error messages, placeholders
- Code identifiers (variables, functions, types) are in **English**
- Comments are in **English**
<!-- GSD:conventions-end -->

<!-- GSD:architecture-start source:ARCHITECTURE.md -->
## Architecture

## Pattern Overview
- Client-side rendered SPA behavior within Next.js App Router shell (all feature components are `'use client'`)
- Feature modules encapsulate components, hooks, services, types, and utilities with barrel file exports
- No server-side data fetching -- all data flows through client-side axios API clients
- Multiple independent backend services (auth, chat, strava/activities) accessed via separate axios instances
- JWT-based authentication with localStorage token storage and automatic refresh
## Layers
- Purpose: Page entry points and layout composition
- Location: `src/app/`
- Contains: Thin page components that delegate to feature modules, plus the root layout
- Depends on: Feature modules (imports via barrel files)
- Used by: Next.js framework (file-system routing)
- Purpose: Self-contained business domains with all related code
- Location: `src/features/`
- Contains: Components, hooks, services (API calls), types, schemas, utilities
- Depends on: Shared lib (`src/shared/`), shared UI (`src/components/ui/`)
- Used by: Page components in `src/app/`
- Purpose: Cross-cutting utilities, providers, and hooks
- Location: `src/shared/`
- Contains: API clients with auth interceptors, React Query provider, theme provider/hook
- Depends on: External libraries (axios, react-query)
- Used by: All feature modules
- Purpose: Reusable Radix UI-based primitives
- Location: `src/components/ui/`
- Contains: `button.tsx`, `textarea.tsx`, `avatar.tsx`, `scroll-area.tsx`, `theme-toggle.tsx`
- Depends on: Radix UI, `src/lib/utils.ts` (`cn` helper)
- Used by: Feature components
- Purpose: General-purpose helpers
- Location: `src/lib/utils.ts`
- Contains: `cn()` (Tailwind class merging), `generateId()` (random ID generation)
- Depends on: `clsx`, `tailwind-merge`
- Used by: All components
## Data Flow
- **Server state**: React Query (`@tanstack/react-query`) for auth profile and Strava status queries
- **Local component state**: `useState` hooks for chat messages, conversations, sidebar state, UI state
- **Form state**: React Hook Form + Zod schemas for auth forms (`src/features/auth/schemas/auth.schema.ts`)
- **Persisted state**: localStorage for JWT tokens (`runmind_access_token`, `runmind_refresh_token`, `runmind_username`), theme (`runmind-theme`), and OAuth state (`strava_oauth_state`)
## Key Abstractions
- Purpose: Centralized HTTP clients with auth token injection and refresh logic
- Location: `src/shared/lib/apiClient.ts`
- Pattern: Four axios instances (`apiClient`, `authApiClient`, `runmidApiClient`, `chatApiClient`) each with request interceptors for JWT and response interceptors for token refresh
- Usage: Feature service files import the appropriate client
- Purpose: Encapsulate all API calls for a feature domain
- Examples: `src/features/chat/services/chatApi.ts`, `src/features/auth/services/authApi.ts`, `src/features/strava/services/stravaApi.ts`
- Pattern: Exported const object with async methods that call the appropriate API client and return typed data
- Purpose: Encapsulate stateful logic and side effects for feature domains
- Examples: `src/features/chat/hooks/useChat.ts`, `src/features/auth/hooks/useAuth.ts`, `src/features/strava/hooks/useStrava.ts`
- Pattern: Custom React hooks that combine local state, service calls, and React Query mutations. Return an object with state values and action functions.
- Purpose: Public API for each feature module
- Examples: `src/features/chat/index.ts`
- Pattern: Re-export components, hooks, services, types, and utils. Consumers import from `@/features/chat` rather than deep paths.
- Purpose: Form validation rules with type inference
- Location: `src/features/auth/schemas/auth.schema.ts`
- Pattern: Zod schemas with `z.infer<>` for TypeScript type derivation
## Entry Points
- Location: `src/app/layout.tsx`
- Triggers: Every page render
- Responsibilities: Wraps app in `QueryProvider` and `ThemeProvider`, sets HTML lang to `pt-BR`, applies dark class
- Location: `src/app/page.tsx`
- Triggers: Root URL `/`
- Responsibilities: Marketing landing page with hero, features, pricing, testimonials (fully self-contained, no feature imports)
- Location: `src/app/chat/page.tsx`
- Triggers: `/chat` route
- Responsibilities: Renders `<Chat />` from `@/features/chat`. The Chat component handles auth check and redirect.
- Location: `src/app/(auth)/login/page.tsx`, `src/app/(auth)/signup/page.tsx`, `src/app/(auth)/forgot-password/page.tsx`, `src/app/(auth)/connect-apps/page.tsx`
- Triggers: `/login`, `/signup`, `/forgot-password`, `/connect-apps`
- Responsibilities: Authentication forms using `useAuth` hook and Zod-validated React Hook Form
- Location: `src/app/settings/page.tsx`
- Triggers: `/settings`
- Responsibilities: Renders `IntegrationsSection` from `@/features/settings`
- Location: `src/app/auth/strava/callback/page.tsx`
- Triggers: `/auth/strava/callback` (Strava OAuth redirect)
- Responsibilities: Validates OAuth state, exchanges code for tokens, redirects to settings
## Error Handling
- API errors caught in hook `useCallback` functions, stored in local `error` state, displayed in UI
- Auth errors (401) handled globally by axios response interceptors -- attempt token refresh, redirect to `/login` on failure
- Optimistic updates in chat: user message added immediately, error state set if API call fails
- Strava OAuth errors: dedicated error UI in callback page with specific messages per error type
- React Query `retry: false` for auth and Strava queries to avoid hammering backend on auth failures
## Cross-Cutting Concerns
<!-- GSD:architecture-end -->

<!-- GSD:skills-start source:skills/ -->
## Project Skills

No project skills found. Add skills to any of: `.claude/skills/`, `.agents/skills/`, `.cursor/skills/`, or `.github/skills/` with a `SKILL.md` index file.
<!-- GSD:skills-end -->

<!-- GSD:workflow-start source:GSD defaults -->
## GSD Workflow Enforcement

Before using Edit, Write, or other file-changing tools, start work through a GSD command so planning artifacts and execution context stay in sync.

Use these entry points:
- `/gsd-quick` for small fixes, doc updates, and ad-hoc tasks
- `/gsd-debug` for investigation and bug fixing
- `/gsd-execute-phase` for planned phase work

Do not make direct repo edits outside a GSD workflow unless the user explicitly asks to bypass it.
<!-- GSD:workflow-end -->

<!-- GSD:profile-start -->
## Developer Profile

> Profile not yet configured. Run `/gsd-profile-user` to generate your developer profile.
> This section is managed by `generate-claude-profile` -- do not edit manually.
<!-- GSD:profile-end -->
