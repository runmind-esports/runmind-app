# Coding Conventions

**Analysis Date:** 2026-04-22

## Naming Patterns

**Files:**
- React components: PascalCase (`ChatInput.tsx`, `MessageBubble.tsx`, `AuthLayout.tsx`)
- Hooks: camelCase with `use` prefix (`useChat.ts`, `useChatInput.ts`, `useConversations.ts`)
- Services/API modules: camelCase with `Api` suffix (`chatApi.ts`, `authApi.ts`, `stravaApi.ts`)
- Types: camelCase with `.types.ts` suffix for standalone type files (`auth.types.ts`), or `index.ts` inside `types/` directory
- Schemas: camelCase with `.schema.ts` suffix (`auth.schema.ts`)
- Utilities: camelCase (`imageValidation.ts`, `oauth.ts`, `utils.ts`)
- UI primitives: kebab-case (`button.tsx`, `scroll-area.tsx`, `avatar.tsx`)

**Functions:**
- Use camelCase for all functions: `sendMessage`, `loadConversation`, `clearMessages`
- React components use PascalCase function declarations: `export function Chat() {}`
- Event handlers use `handle` prefix: `handleSubmit`, `handleKeyDown`, `handleSendMessage`
- Callback props use `on` prefix: `onSend`, `onClose`, `onSelectConversation`, `onClear`
- API methods are grouped as object literals: `chatApi.sendMessage()`, `authApi.login()`

**Variables:**
- Use camelCase: `isLoading`, `hasMessages`, `activeConversationId`
- Boolean variables use `is`/`has`/`can` prefix: `isSubmitting`, `hasAttachments`, `canSubmit`
- Constants use UPPER_SNAKE_CASE: `ACCESS_TOKEN_KEY`, `MAX_FILE_SIZE`, `ACCEPTED_TYPES`
- Refs use `Ref` suffix: `textareaRef`, `justCreatedRef`

**Types:**
- Interfaces use PascalCase: `Message`, `ChatState`, `AuthTokens`
- Props interfaces use component name + `Props` suffix: `ChatInputProps`, `MessageBubbleProps`, `AuthLayoutProps`
- Type aliases from Zod schemas use `Input` suffix: `LoginInput`, `RegisterInput`
- API-specific types use `Api` prefix: `ApiMessage`, `ApiConversation`
- Request/response types use descriptive suffixes: `SendMessageRequest`, `SendMessageResponse`

## Code Style

**Formatting:**
- No Prettier config detected; formatting is handled by default ESLint/editor settings
- Single quotes for strings (consistent across codebase)
- No semicolons at end of statements
- 2-space indentation
- Trailing commas in multi-line constructs

**Linting:**
- ESLint with `next/core-web-vitals` preset (see `.eslintrc.json`)
- Run with `npm run lint`
- Occasional `eslint-disable-next-line` for `react-hooks/exhaustive-deps` when dependency arrays are intentionally incomplete (see `src/features/chat/components/Chat.tsx` line 49)

**TypeScript:**
- Strict mode enabled (`tsconfig.json`)
- Target: ES2022
- Use `interface` for object shapes, `type` for unions/intersections and Zod inferred types
- Generic typing on axios calls: `chatApiClient.post<SendMessageResponse>(...)`
- Avoid `any`; use specific types or `unknown` with narrowing

## Import Organization

**Order:**
1. `'use client'` directive (first line, when needed)
2. React/Next.js imports (`react`, `next/navigation`, `next/image`)
3. Third-party libraries (`@tanstack/react-query`, `react-hook-form`, `zod`, `lucide-react`, `axios`)
4. Internal shared modules via path alias (`@/components/ui/...`, `@/shared/...`, `@/lib/...`)
5. Feature-relative imports (`../hooks/useChat`, `./ChatInput`, `../types`)

**Path Aliases:**
- `@/*` maps to `./src/*` (defined in `tsconfig.json`)
- Use `@/components/ui/button` for shared UI components
- Use `@/shared/lib/apiClient` for shared library code
- Use `@/features/auth/hooks/useAuth` for cross-feature imports
- Use relative paths (`../`, `./`) for intra-feature imports

## Component Patterns

**Component Declaration:**
- Use named function exports: `export function ComponentName() {}` (not arrow functions for components)
- UI primitives use `React.forwardRef` with `displayName` (see `src/components/ui/button.tsx`)
- All client components start with `'use client'` directive
- Page components use `export default function PageName()` (Next.js App Router convention)

**Props:**
- Define props interface inline above the component or in the same file
- Use destructuring in function parameters: `function ChatInput({ onSend, disabled }: ChatInputProps)`
- Optional props use `?` syntax: `disabled?: boolean`

**Component Composition:**
```typescript
// Pattern: Hooks extract logic, components handle rendering
export function Chat() {
  const chat = useChat()
  const sidebar = useSidebar()
  const conversations = useConversations()
  // ... rendering logic
}
```

## Service/API Layer Patterns

**API modules are object literals with async methods:**
```typescript
export const chatApi = {
  sendMessage: async (data: SendMessageRequest): Promise<SendMessageResponse> => {
    const response = await chatApiClient.post<SendMessageResponse>('/api/v1/chat/message', {
      message: data.message,
      conversationId: data.conversationId,
    })
    return response.data
  },
  // ... more methods
}
```

**Key conventions:**
- Each API module uses its designated axios client from `src/shared/lib/apiClient.ts`
- Methods return `response.data` (unwrap axios response)
- Request/response types are defined in the service file or imported from types
- API paths follow REST conventions: `/api/v1/{resource}/{action}`

## Hook Patterns

**Custom hooks follow this structure:**
```typescript
export function useFeatureName(options?: Options) {
  const [state, setState] = useState<StateType>(initialState)

  const action = useCallback(async () => {
    // ... implementation
  }, [dependencies])

  return {
    // State
    data: state.data,
    isLoading: state.isLoading,
    error: state.error,
    // Actions
    action,
  }
}
```

**React Query hooks (auth feature):**
```typescript
export const authKeys = {
  profile: ['auth', 'profile'] as const,
}

export function useAuth() {
  const { data: profile } = useQuery({
    queryKey: authKeys.profile,
    queryFn: authApi.getProfile,
    enabled: authApi.isAuthenticated(),
    staleTime: 1000 * 60 * 5,
  })

  const loginMutation = useMutation({
    mutationFn: (credentials: LoginCredentials) => authApi.login(credentials),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: authKeys.profile })
      router.push('/chat')
    },
  })
}
```

**Non-React-Query hooks (chat feature):**
- Chat hooks use `useState` + `useCallback` for manual state management
- State updates use functional form: `setState((prev) => ({ ...prev, ... }))`
- Optimistic updates pattern: update UI immediately, then call API

## Error Handling

**Patterns:**
- API errors caught with try/catch in hooks, set error state as user-facing string
- Error messages are in Portuguese (pt-BR): `'Erro ao enviar mensagem. Tente novamente.'`
- Errors logged to `console.error` with descriptive prefix: `console.error('Error sending message:', error)`
- No global error boundary detected
- Auth errors (401) handled by axios interceptors with automatic token refresh and redirect to `/login`

**Error display:**
- Inline error messages below form fields (validation errors from Zod)
- Banner-style error messages above forms (API errors)
- Auto-dismissing errors in chat input (5-second timeout)

## Logging

**Framework:** `console` (browser console)

**Patterns:**
- Use `console.error` for caught exceptions: `console.error('Error fetching conversations:', err)`
- No structured logging library
- No server-side logging framework

## Comments

**When to Comment:**
- Section dividers in barrel files: `// Components`, `// Hooks`, `// Services`, `// Types`, `// Utils`
- Inline explanations for non-obvious logic: `// Optimistic update: add user message immediately`
- ESLint disable comments with no explanation
- JSDoc-style `/** */` comments on Strava API methods (see `src/features/strava/services/stravaApi.ts`)

**JSDoc/TSDoc:**
- Minimal usage; primarily in the Strava service module
- Not enforced across the codebase

## Barrel File / Module Export Pattern

**Every feature has an `index.ts` barrel file exporting its public API:**
```typescript
// Components
export { Chat } from './components/Chat'
// Services
export { chatApi } from './services/chatApi'
// Hooks
export { useChat } from './hooks/useChat'
// Types
export type { Message, ChatState } from './types'
```

**Sub-directories with multiple components also have barrel files:**
- `src/features/chat/components/Sidebar/index.ts`
- `src/features/auth/components/index.ts`

## Form Handling

**Pattern:** React Hook Form + Zod resolver
```typescript
const { register, handleSubmit, formState: { errors } } = useForm<LoginInput>({
  resolver: zodResolver(loginSchema),
  defaultValues: { email: '', password: '' },
})
```

- Schemas defined in `src/features/auth/schemas/auth.schema.ts`
- Validation messages in Portuguese
- Inferred types exported alongside schemas: `type LoginInput = z.infer<typeof loginSchema>`

## Styling

**Approach:** Tailwind CSS utility classes directly in JSX

**Class merging:** Use `cn()` utility from `src/lib/utils.ts` (clsx + tailwind-merge)
```typescript
className={cn('base-classes', conditional && 'conditional-classes')}
```

**CSS Variables:** Theme colors defined as CSS custom properties, referenced in `tailwind.config.ts`:
- `var(--background)`, `var(--foreground)`, `var(--accent)`, `var(--border)`
- Dark mode enabled via `darkMode: 'class'`

**UI Components:** Radix UI primitives with CVA (class-variance-authority) for variants:
```typescript
const buttonVariants = cva('base-classes', {
  variants: { variant: { default: '...', ghost: '...' }, size: { default: '...', sm: '...' } },
  defaultVariants: { variant: 'default', size: 'default' },
})
```

## Language

- UI text is in **Portuguese (pt-BR)**: buttons, labels, error messages, placeholders
- Code identifiers (variables, functions, types) are in **English**
- Comments are in **English**

---

*Convention analysis: 2026-04-22*
