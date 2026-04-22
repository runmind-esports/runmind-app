# Codebase Concerns

**Analysis Date:** 2026-04-22

## Tech Debt

**Duplicated Token Refresh Interceptors:**
- Issue: The 401 response interceptor with token refresh logic is copy-pasted three times -- once for `apiClient`, once for `runmidApiClient`, and once for `chatApiClient`. Each copy is ~50 lines of identical logic.
- Files: `src/shared/lib/apiClient.ts` (lines 89-147, 170-226, 249-305)
- Impact: Any bug fix or behavior change must be applied in three places. Shared `isRefreshing` and `failedQueue` state creates potential race conditions if refresh triggers from different clients simultaneously.
- Fix approach: Extract a `createRefreshInterceptor(client)` factory function. Apply it to each axios instance. Share the refresh state module-level as today, but through a single code path.

**Massive Landing Page Component:**
- Issue: `page.tsx` is 955 lines containing 10+ inline component definitions (RunmindLogo, CheckIcon, XIcon, ArrowIcon, PlayIcon, StarIcon, FeatureCard, IntegrationCard, PricingCard, TestimonialCard) plus the full page layout and inline CSS animations.
- Files: `src/app/page.tsx`
- Impact: Slow to parse, hard to maintain, impossible to reuse individual components. CSS-in-JS via `<style jsx>` at the bottom is inconsistent with Tailwind approach used elsewhere.
- Fix approach: Extract each component to `src/features/landing/components/`. Move animations to `globals.css` or Tailwind config. Consider splitting the page into section components.

**Manual State Management in Chat:**
- Issue: `useConversations` and `useChat` use raw `useState` for server state (conversations list, messages), while the rest of the app (auth, strava) correctly uses React Query. This creates inconsistency and misses caching, deduplication, and background refetching.
- Files: `src/features/chat/hooks/useConversations.ts`, `src/features/chat/hooks/useChat.ts`
- Impact: No automatic cache invalidation, no optimistic update rollback, no stale-while-revalidate. Manual loading/error states duplicate what React Query provides.
- Fix approach: Migrate to `useQuery` for conversation list and conversation detail. Use `useMutation` for send/delete/rename with optimistic updates.

**Unused Type Definitions:**
- Issue: `Folder`, `Project`, and `SidebarState` types are defined but never used by any component or hook. `Conversation` type has `folderId` and `projectId` fields that are always set to `null`.
- Files: `src/features/chat/types/index.ts` (lines 43-66)
- Impact: Dead code that confuses future developers about feature scope. Suggests an abandoned folder/project feature.
- Fix approach: Remove unused types. Remove `folderId` and `projectId` from `Conversation` type.

**`rememberMe` Checkbox Has No Effect:**
- Issue: The login page has a "Manter conectado por 30 dias" checkbox with state, but the value is never sent to the API or used to configure token persistence.
- Files: `src/app/(auth)/login/page.tsx` (lines 16, 121-132)
- Impact: Users expect the checkbox to do something. Token persistence is always the same (localStorage) regardless of checkbox state.
- Fix approach: Either pass `rememberMe` to the login API call and adjust token storage (e.g., sessionStorage vs localStorage), or remove the checkbox.

## Security Considerations

**No Next.js Middleware for Route Protection:**
- Risk: Authentication checks happen client-side only, inside components via `useEffect` redirects. There is no `middleware.ts` file at the project root. Unauthenticated users can briefly see protected page content before the redirect fires.
- Files: `src/features/chat/components/Chat.tsx` (lines 21-25), no `src/middleware.ts` exists
- Current mitigation: Components return `null` while checking auth, but the page shell still renders.
- Recommendations: Add a `middleware.ts` at the project root to protect `/chat`, `/settings`, and other authenticated routes server-side. Check for the JWT cookie/token before the page even loads.

**`dangerouslySetInnerHTML` Usage:**
- Risk: Testimonial text is rendered with `dangerouslySetInnerHTML` in the AuthLayout component. While the current content is hardcoded (not user-generated), this pattern is dangerous if testimonials ever come from a CMS or API.
- Files: `src/features/auth/components/AuthLayout.tsx` (line 163)
- Current mitigation: Content is currently static strings defined in page components.
- Recommendations: Replace with JSX (React nodes) for testimonial text. The landing page already does this correctly with `<>` fragments and `<strong>` tags. The login/signup pages should follow the same approach.

**JWT Decoded Client-Side Without Verification:**
- Risk: `authApi.getProfile()` decodes the JWT payload with `atob()` without verifying the signature. `authApi.isAuthenticated()` trusts the client-side expiry check. A tampered token would pass client-side checks.
- Files: `src/features/auth/services/authApi.ts` (lines 10-28, 91-100)
- Current mitigation: Backend APIs validate tokens server-side on every request. Client-side decode is for display purposes only.
- Recommendations: This is acceptable for UI-only decisions, but document that the client should never trust JWT claims for authorization. The `getProfile` function returns fabricated data (e.g., `createdAt: new Date().toISOString()`) which is misleading -- consider fetching real profile data from an API endpoint.

**`.env.production` Not Ignored Properly:**
- Risk: `.env.production` is listed in `.gitignore` but it exists in the working directory. If `.gitignore` rules are misconfigured or the file is force-added, production API URLs could leak.
- Files: `.env.production`, `.gitignore`
- Current mitigation: The `.gitignore` file does list `.env.production`.
- Recommendations: Verify the file is not tracked. Consider using only `.env.local` and build-time args (already done via Dockerfile ARGs) to avoid any `.env.production` file on disk.

## Performance Bottlenecks

**Character-by-Character Typing Effect:**
- Problem: Every assistant message triggers a typing animation that calls `setDisplayedText` once per character via `setInterval`. For a 500-character response, this is 500 React state updates and re-renders.
- Files: `src/features/chat/hooks/useTypingEffect.ts`, `src/features/chat/components/MessageBubble.tsx`
- Cause: `setInterval` with 15ms delay calling `setState` on every tick. React batching helps, but the component tree still reconciles 500 times.
- Improvement path: Use `requestAnimationFrame` with chunked updates (e.g., 5-10 characters per frame). Or use a CSS animation approach. Or render chunks of text rather than character-by-character.

**No Pagination for Conversation Messages:**
- Problem: `chatApi.getConversation(id)` loads all messages at once. Long conversations will have slow initial loads and high memory usage.
- Files: `src/features/chat/services/chatApi.ts` (line 116-119), `src/features/chat/hooks/useChat.ts` (line 136-157)
- Cause: No pagination params on the message fetch endpoint.
- Improvement path: Add cursor-based pagination to the messages API. Load recent messages first, fetch older on scroll-up.

**Unoptimized Images in Next.js Config:**
- Problem: `images.unoptimized: true` disables all Next.js image optimization (resizing, WebP conversion, lazy loading).
- Files: `next.config.js` (line 8)
- Cause: Set for "static export compatibility" per the comment, but the app uses `standalone` output mode (not static export).
- Improvement path: Remove `unoptimized: true` since the app runs as a Node.js server (`standalone` mode), which supports the Image Optimization API. This will significantly improve LCP for image-heavy pages.

## Fragile Areas

**Chat State Synchronization:**
- Files: `src/features/chat/components/Chat.tsx`, `src/features/chat/hooks/useChat.ts`, `src/features/chat/hooks/useConversations.ts`
- Why fragile: Three pieces of state must stay in sync: `useChat.conversationId`, `useConversations.activeConversationId`, and the actual messages. The `justCreatedRef` in `Chat.tsx` is a manual workaround to prevent double-loading when a new conversation is created. The `eslint-disable-next-line react-hooks/exhaustive-deps` suppression on the effect (line 49) signals a dependency issue.
- Safe modification: When changing conversation-related logic, trace both hooks simultaneously. Test new conversation creation, switching between conversations, and starting fresh conversations carefully.
- Test coverage: No tests exist.

**Token Refresh Race Condition:**
- Files: `src/shared/lib/apiClient.ts`
- Why fragile: Three axios instances share `isRefreshing` and `failedQueue` module-level variables. If `apiClient` and `chatApiClient` both get 401s at nearly the same time, the shared `isRefreshing` flag prevents duplicate refreshes -- but the `failedQueue` mixes requests from different clients. When the queue is processed, each request's `resolve` callback retries with the correct client, so it works, but the interleaving is hard to reason about.
- Safe modification: Always test concurrent 401 scenarios from multiple API clients.
- Test coverage: No tests exist.

**Strava OAuth Flow:**
- Files: `src/features/strava/utils/oauth.ts`, `src/app/auth/strava/callback/page.tsx`
- Why fragile: OAuth state is stored in `localStorage` and validated on callback. If the user opens multiple tabs or the page reloads during the flow, the state can be lost. The `console.log('Exchanging code with backend...')` on line 69 of the callback page is debug logging left in production code.
- Safe modification: Test the full OAuth flow end-to-end. Verify behavior when callback is hit without prior state in localStorage.
- Test coverage: No tests exist.

## Test Coverage Gaps

**No Tests Exist:**
- What's not tested: The entire codebase. There are zero test files (`*.test.*` or `*.spec.*`). No test framework is configured (no `jest.config.*` or `vitest.config.*`).
- Files: All files in `src/`
- Risk: Every change is deployed without automated verification. Regressions are caught only by manual testing or user reports. The token refresh logic, chat state management, and OAuth flow are all high-risk areas with no safety net.
- Priority: **High** -- Add at minimum: (1) unit tests for `tokenStorage` and auth utilities, (2) unit tests for `useChat` and `useConversations` hooks, (3) integration test for the token refresh interceptor, (4) test for image validation utility.

## Missing Critical Features

**No Error Boundary:**
- Problem: There is no React Error Boundary in the component tree. An unhandled error in any component will crash the entire app with a white screen.
- Blocks: Graceful error recovery, user-facing error messages for unexpected failures.

**No Loading/Skeleton States for Auth Check:**
- Problem: Protected pages return `null` while checking authentication (`Chat.tsx` line 83-85). Users see a blank screen until the auth check completes.
- Blocks: Good perceived performance on protected routes.

**No Logging Infrastructure:**
- Problem: All error handling uses `console.error`. There is no structured logging, no error tracking service (Sentry, etc.), and no way to monitor production errors.
- Files: `src/features/chat/hooks/useConversations.ts`, `src/features/chat/hooks/useChat.ts`
- Blocks: Production debugging, error alerting, usage analytics.

**No Rate Limiting or Debouncing on Chat Input:**
- Problem: Users can rapidly submit messages with no client-side throttling or debounce. The `isSubmitting` flag in `useChatInput` prevents concurrent submissions but not rapid sequential ones.
- Files: `src/features/chat/hooks/useChatInput.ts`
- Blocks: Protection against accidental double-sends or abuse.

## Dependencies at Risk

**None Critical:**
- The dependency set is standard and well-maintained (Next.js 14, React 18, React Query, axios, Radix UI, Tailwind CSS). No abandoned or vulnerable packages detected.
- Note: Package versions should be audited periodically with `npm audit`.

---

*Concerns audit: 2026-04-22*
