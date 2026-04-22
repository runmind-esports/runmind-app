# Codebase Structure

**Analysis Date:** 2026-04-22

## Directory Layout

```
runmid-app/
├── public/                    # Static assets
│   └── brand/                 # Brand SVGs (Strava, Garmin logos)
├── scripts/                   # Deployment scripts
│   └── deploy.sh              # Cloud Run deploy script
├── src/
│   ├── app/                   # Next.js App Router pages
│   │   ├── (auth)/            # Auth route group (login, signup, etc.)
│   │   │   ├── login/
│   │   │   ├── signup/
│   │   │   ├── forgot-password/
│   │   │   └── connect-apps/
│   │   ├── auth/
│   │   │   └── strava/
│   │   │       └── callback/  # Strava OAuth callback
│   │   ├── chat/              # Main chat interface
│   │   ├── settings/          # User settings
│   │   ├── privacy/           # Privacy policy page
│   │   ├── terms/             # Terms of service page
│   │   ├── layout.tsx         # Root layout (providers)
│   │   ├── globals.css        # Global styles + CSS variables
│   │   └── page.tsx           # Landing page
│   ├── components/
│   │   └── ui/                # Shared Radix UI primitives
│   ├── features/              # Feature modules
│   │   ├── auth/              # Authentication feature
│   │   │   ├── components/    # AuthLayout, PasswordInput, PlatformButton
│   │   │   ├── hooks/         # useAuth
│   │   │   ├── schemas/       # Zod validation schemas
│   │   │   ├── services/      # authApi
│   │   │   ├── types/         # auth.types.ts
│   │   │   └── index.ts       # Barrel file
│   │   ├── chat/              # Chat feature
│   │   │   ├── components/    # Chat, ChatHeader, ChatInput, MessageBubble, etc.
│   │   │   │   └── Sidebar/   # Sidebar component
│   │   │   ├── hooks/         # useChat, useChatInput, useConversations, etc.
│   │   │   ├── services/      # chatApi
│   │   │   ├── types/         # Message, Conversation, etc.
│   │   │   ├── utils/         # imageValidation
│   │   │   └── index.ts       # Barrel file
│   │   ├── settings/          # Settings feature
│   │   │   └── components/    # IntegrationCard, IntegrationsSection
│   │   └── strava/            # Strava integration feature
│   │       ├── hooks/         # useStrava
│   │       ├── services/      # stravaApi
│   │       └── utils/         # OAuth helpers
│   ├── lib/
│   │   └── utils.ts           # cn() and generateId() helpers
│   └── shared/
│       ├── hooks/             # useTheme
│       ├── lib/
│       │   └── apiClient.ts   # Axios clients + token management
│       └── providers/
│           ├── QueryProvider.tsx   # React Query provider
│           └── ThemeProvider.tsx   # Theme context provider
├── CLAUDE.md                  # AI assistant instructions
├── Dockerfile                 # Docker build config
├── cloudbuild.yaml            # Google Cloud Build config
├── next.config.js             # Next.js configuration
├── tailwind.config.ts         # Tailwind CSS configuration
├── tsconfig.json              # TypeScript configuration
├── package.json               # Dependencies and scripts
└── components.json            # shadcn/ui component config
```

## Directory Purposes

**`src/app/`:**
- Purpose: Next.js App Router pages -- thin wrappers that import from feature modules
- Contains: `page.tsx` files, `layout.tsx`, `globals.css`
- Key files: `src/app/layout.tsx` (root layout with providers), `src/app/page.tsx` (landing page -- 950+ lines, self-contained)

**`src/features/`:**
- Purpose: Business domain modules, each self-contained with its own components, hooks, services, and types
- Contains: Four feature modules: `auth`, `chat`, `settings`, `strava`
- Key files: Each module has an `index.ts` barrel file for public exports

**`src/features/auth/`:**
- Purpose: User authentication (login, register, password reset)
- Contains: Components (`AuthLayout`, `PasswordInput`, `PlatformButton`), `useAuth` hook, `authApi` service, Zod schemas, auth types
- Key files: `src/features/auth/hooks/useAuth.ts`, `src/features/auth/services/authApi.ts`, `src/features/auth/schemas/auth.schema.ts`

**`src/features/chat/`:**
- Purpose: AI chat interface -- the primary feature of the app
- Contains: Chat UI components, conversation management, message handling, image attachments
- Key files: `src/features/chat/components/Chat.tsx` (main orchestrator), `src/features/chat/hooks/useChat.ts` (message state/API), `src/features/chat/hooks/useConversations.ts` (conversation list), `src/features/chat/services/chatApi.ts` (API calls)

**`src/features/settings/`:**
- Purpose: User settings page with integration management
- Contains: `IntegrationCard.tsx`, `IntegrationsSection.tsx`
- Key files: `src/features/settings/components/IntegrationsSection.tsx`

**`src/features/strava/`:**
- Purpose: Strava OAuth integration (connect/disconnect, token exchange)
- Contains: `useStrava` hook, `stravaApi` service, OAuth utility functions
- Key files: `src/features/strava/services/stravaApi.ts`, `src/features/strava/utils/oauth.ts`

**`src/shared/`:**
- Purpose: Cross-cutting infrastructure shared by all features
- Contains: API clients with auth interceptors, React Query provider, theme provider/hook
- Key files: `src/shared/lib/apiClient.ts` (4 axios clients + tokenStorage), `src/shared/providers/QueryProvider.tsx`, `src/shared/providers/ThemeProvider.tsx`

**`src/components/ui/`:**
- Purpose: Reusable UI primitives based on Radix UI (shadcn/ui pattern)
- Contains: `button.tsx`, `textarea.tsx`, `avatar.tsx`, `scroll-area.tsx`, `theme-toggle.tsx`

**`src/lib/`:**
- Purpose: General utility functions
- Contains: `utils.ts` with `cn()` (Tailwind class merge) and `generateId()` (random ID)

## Key File Locations

**Entry Points:**
- `src/app/layout.tsx`: Root layout -- QueryProvider, ThemeProvider wrappers
- `src/app/page.tsx`: Marketing landing page (standalone, ~955 lines)
- `src/app/chat/page.tsx`: Chat page -- delegates to `<Chat />` component
- `src/app/(auth)/login/page.tsx`: Login form page
- `src/app/(auth)/signup/page.tsx`: Registration form page

**Configuration:**
- `next.config.js`: Standalone output mode, unoptimized images
- `tsconfig.json`: ES2022 target, strict mode, `@/*` path alias to `./src/*`
- `tailwind.config.ts`: Custom theme colors, font families
- `components.json`: shadcn/ui component configuration
- `.eslintrc.json`: ESLint config (extends `next/core-web-vitals`)
- `Dockerfile`: Multi-stage Docker build for Cloud Run
- `cloudbuild.yaml`: Google Cloud Build pipeline

**Core Logic:**
- `src/shared/lib/apiClient.ts`: All axios clients, token storage, auth interceptors, refresh logic
- `src/features/chat/hooks/useChat.ts`: Chat message state management and API interaction
- `src/features/chat/services/chatApi.ts`: Chat REST API calls (send message, conversations CRUD)
- `src/features/auth/services/authApi.ts`: Auth API calls (login, register, JWT decode)
- `src/features/auth/hooks/useAuth.ts`: Auth state hook with React Query
- `src/features/strava/services/stravaApi.ts`: Strava token exchange and status check

**Styling:**
- `src/app/globals.css`: CSS custom properties (light/dark themes), font imports, scrollbar styles, animations

## Naming Conventions

**Files:**
- Components: PascalCase (`ChatHeader.tsx`, `MessageBubble.tsx`, `AuthLayout.tsx`)
- Hooks: camelCase with `use` prefix (`useChat.ts`, `useAuth.ts`, `useStrava.ts`)
- Services: camelCase with `Api` suffix (`chatApi.ts`, `authApi.ts`, `stravaApi.ts`)
- Types: camelCase with descriptive suffix (`auth.types.ts`)
- Schemas: camelCase with `.schema` suffix (`auth.schema.ts`)
- Utils: camelCase (`imageValidation.ts`, `oauth.ts`, `utils.ts`)
- Barrel files: `index.ts`

**Directories:**
- Feature modules: lowercase (`auth`, `chat`, `settings`, `strava`)
- Sub-directories: lowercase plural (`components`, `hooks`, `services`, `types`, `utils`, `schemas`)
- Component sub-folders: PascalCase when component has its own directory (`Sidebar/`)
- Route groups: parenthesized (`(auth)`)

## Where to Add New Code

**New Feature Module:**
- Create directory: `src/features/{feature-name}/`
- Add sub-directories as needed: `components/`, `hooks/`, `services/`, `types/`, `utils/`
- Create barrel file: `src/features/{feature-name}/index.ts`
- Create page route: `src/app/{feature-name}/page.tsx` that imports from the barrel file

**New Page Route:**
- Create: `src/app/{route-name}/page.tsx`
- Keep the page thin -- import and render a component from `src/features/`
- For auth-grouped routes, place under `src/app/(auth)/`

**New Chat Component:**
- Component: `src/features/chat/components/{ComponentName}.tsx`
- Export from barrel: add to `src/features/chat/index.ts`

**New API Service Method:**
- Add method to the relevant service object in `src/features/{feature}/services/{feature}Api.ts`
- Use the appropriate axios client from `src/shared/lib/apiClient.ts`

**New Hook:**
- Create: `src/features/{feature}/hooks/use{HookName}.ts`
- Export from barrel file

**New Shared UI Component:**
- Create: `src/components/ui/{component-name}.tsx`
- Follow shadcn/ui pattern (Radix UI base, `cn()` for class merging)

**New Validation Schema:**
- Add to existing schema file or create new: `src/features/{feature}/schemas/{feature}.schema.ts`
- Export both the schema and the inferred TypeScript type

**New Shared Utility:**
- Add to `src/lib/utils.ts` for general utilities
- For feature-specific utils, use `src/features/{feature}/utils/`

**New Provider:**
- Create: `src/shared/providers/{ProviderName}.tsx`
- Wrap in `src/app/layout.tsx`

## Special Directories

**`public/`:**
- Purpose: Static assets served at root URL
- Generated: No
- Committed: Yes

**`.next/`:**
- Purpose: Next.js build output
- Generated: Yes (by `npm run build` or `npm run dev`)
- Committed: No (in `.gitignore`)

**`node_modules/`:**
- Purpose: npm dependencies
- Generated: Yes (by `npm install`)
- Committed: No (in `.gitignore`)

**`.planning/`:**
- Purpose: GSD planning and codebase analysis documents
- Generated: By analysis tools
- Committed: No

**`scripts/`:**
- Purpose: Deployment and operational scripts
- Contains: `deploy.sh` for Google Cloud Run deployment
- Committed: Yes

---

*Structure analysis: 2026-04-22*
