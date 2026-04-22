# Technology Stack

**Analysis Date:** 2026-04-22

## Languages

**Primary:**
- TypeScript 5.x - All application code (`src/**/*.ts`, `src/**/*.tsx`)

**Secondary:**
- JavaScript - Configuration files (`next.config.js`, `postcss.config.js`)

## Runtime

**Environment:**
- Node.js 20 (Alpine) - Specified in `Dockerfile` (`node:20-alpine`)

**Package Manager:**
- npm
- Lockfile: `package-lock.json` (present)

## Frameworks

**Core:**
- Next.js 14.2.21 - App Router, standalone output mode (`next.config.js`)
- React 18.x - UI rendering
- React DOM 18.x - DOM bindings

**Testing:**
- Not detected - No test framework configured (no jest/vitest config, no test scripts in `package.json`)

**Build/Dev:**
- Next.js built-in compiler (SWC) - Build and dev server
- TypeScript 5.x - Type checking (`tsconfig.json`)
- ESLint 8.x with `eslint-config-next` 14.2.21 - Linting
- PostCSS 8.x - CSS processing (`postcss.config.js`)

## Key Dependencies

**Critical:**
- `next` 14.2.21 - Application framework, standalone output for Docker deployment
- `react` ^18 / `react-dom` ^18 - UI framework
- `axios` ^1.13.6 - HTTP client for all backend API communication (`src/shared/lib/apiClient.ts`)
- `@tanstack/react-query` ^5.90.21 - Server state management, caching, mutations (`src/shared/providers/QueryProvider.tsx`)

**Forms & Validation:**
- `react-hook-form` ^7.71.2 - Form state management
- `@hookform/resolvers` ^5.2.2 - Schema-based validation resolvers
- `zod` ^4.3.6 - Schema validation (used in `src/features/auth/schemas/`)

**UI:**
- `tailwindcss` ^3.4.1 - Utility-first CSS framework (`tailwind.config.ts`)
- `@radix-ui/react-avatar` ^1.0.4 - Accessible avatar component
- `@radix-ui/react-scroll-area` ^1.0.5 - Accessible scroll area
- `@radix-ui/react-slot` ^1.0.2 - Polymorphic component support
- `lucide-react` ^0.312.0 - Icon library
- `class-variance-authority` ^0.7.0 - Component variant styling
- `clsx` ^2.1.0 - Conditional class joining
- `tailwind-merge` ^2.2.0 - Tailwind class deduplication

**Infrastructure:**
- `autoprefixer` ^10.4.27 - CSS vendor prefixing

## Configuration

**TypeScript:**
- Target: ES2022 with bundler module resolution (`tsconfig.json`)
- Strict mode enabled
- Path alias: `@/*` maps to `./src/*`

**Tailwind:**
- Dark mode: class-based (`tailwind.config.ts`)
- Custom design tokens via CSS variables (colors, fonts, spacing)
- Primary font: Manrope (sans), Display font: Poppins
- Custom animations: shimmer

**Next.js:**
- Output: `standalone` (optimized for Docker)
- Images: `unoptimized: true` (no image optimization server)
- SVG: `dangerouslyAllowSVG: false`

**Environment Variables (all `NEXT_PUBLIC_` client-side):**
- `NEXT_PUBLIC_API_URL` - General API base URL
- `NEXT_PUBLIC_AUTH_API_URL` - Authentication service (cara-cracha) URL
- `NEXT_PUBLIC_RUNMID_API_URL` - RunMid backend API URL
- `NEXT_PUBLIC_CHAT_API_URL` - Chat/AI agent service URL
- `NEXT_PUBLIC_STRAVA_CLIENT_ID` - Strava OAuth client ID

**Environment Files:**
- `.env.example` - Template with required vars
- `.env.local` - Local development (present, not read)
- `.env.production` - Production values (present, not read)

## Platform Requirements

**Development:**
- Node.js 20+
- npm
- Environment variables configured in `.env.local`

**Production:**
- Google Cloud Run (us-central1)
- Docker container (node:20-alpine, standalone Next.js)
- Google Cloud Build for CI/CD (`cloudbuild.yaml`)
- Google Artifact Registry for container images

---

*Stack analysis: 2026-04-22*
