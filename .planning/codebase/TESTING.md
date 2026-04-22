# Testing Patterns

**Analysis Date:** 2026-04-22

## Test Framework

**Runner:**
- No test framework is installed or configured
- No Jest, Vitest, Playwright, or Cypress dependencies in `package.json`
- No test configuration files detected (`jest.config.*`, `vitest.config.*`, `playwright.config.*`)

**Assertion Library:**
- Not applicable (no testing framework)

**Run Commands:**
```bash
# No test commands defined in package.json scripts
# Only available scripts: dev, build, start, lint
```

## Test File Organization

**Location:**
- No test files exist anywhere in the codebase
- No `*.test.*`, `*.spec.*`, or `__tests__/` directories found

**Naming:**
- Not established

**Structure:**
- Not established

## Test Structure

**No tests exist.** The following recommendations are based on the codebase's architecture and conventions.

### Recommended Setup

**Framework:** Vitest (aligns with Vite/Next.js ecosystem, fast, TypeScript-native)

**Install:**
```bash
npm install -D vitest @testing-library/react @testing-library/jest-dom @testing-library/user-event jsdom
```

**Config file:** Create `vitest.config.ts` at project root:
```typescript
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test/setup.ts'],
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
```

**Add to `package.json` scripts:**
```json
{
  "test": "vitest run",
  "test:watch": "vitest",
  "test:coverage": "vitest run --coverage"
}
```

## Recommended Test Patterns

### Unit Tests for Utility Functions

**Target files:**
- `src/lib/utils.ts` - `cn()` and `generateId()`
- `src/features/chat/utils/imageValidation.ts` - `validateImageFile()`, `validateImageFiles()`, `isImageFile()`

**Pattern:**
```typescript
// src/features/chat/utils/__tests__/imageValidation.test.ts
import { describe, it, expect } from 'vitest'
import { validateImageFile, validateImageFiles, isImageFile } from '../imageValidation'

describe('validateImageFile', () => {
  it('returns null for valid JPEG file', () => {
    const file = new File([''], 'photo.jpg', { type: 'image/jpeg' })
    expect(validateImageFile(file)).toBeNull()
  })

  it('returns error for unsupported file type', () => {
    const file = new File([''], 'doc.pdf', { type: 'application/pdf' })
    expect(validateImageFile(file)).toContain('Formato não suportado')
  })

  it('returns error for file exceeding 20MB', () => {
    const file = new File([new ArrayBuffer(21 * 1024 * 1024)], 'big.jpg', { type: 'image/jpeg' })
    expect(validateImageFile(file)).toContain('muito grande')
  })
})
```

### Unit Tests for API Service Modules

**Target files:**
- `src/features/chat/services/chatApi.ts`
- `src/features/auth/services/authApi.ts`
- `src/features/strava/services/stravaApi.ts`

**Mocking pattern (axios clients):**
```typescript
// src/features/auth/services/__tests__/authApi.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { authApi } from '../authApi'
import { authApiClient, tokenStorage } from '@/shared/lib/apiClient'

vi.mock('@/shared/lib/apiClient', () => ({
  authApiClient: {
    post: vi.fn(),
    get: vi.fn(),
  },
  tokenStorage: {
    setTokens: vi.fn(),
    getAccessToken: vi.fn(),
    clearTokens: vi.fn(),
    getUsername: vi.fn(),
  },
}))

describe('authApi.login', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('stores tokens on successful login', async () => {
    const mockResponse = {
      data: {
        accessToken: 'eyJ...',
        refreshToken: 'refresh...',
        userId: '123',
        email: 'user@test.com',
      },
    }
    vi.mocked(authApiClient.post).mockResolvedValue(mockResponse)

    await authApi.login({ email: 'user@test.com', password: 'password' })

    expect(tokenStorage.setTokens).toHaveBeenCalledWith(
      'eyJ...',
      'refresh...',
      expect.any(String)
    )
  })
})
```

### Hook Tests

**Target files:**
- `src/features/chat/hooks/useChat.ts`
- `src/features/chat/hooks/useChatInput.ts`
- `src/features/auth/hooks/useAuth.ts`

**Pattern (with @testing-library/react):**
```typescript
// src/features/chat/hooks/__tests__/useChatInput.test.ts
import { describe, it, expect, vi } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useChatInput } from '../useChatInput'

describe('useChatInput', () => {
  it('clears value after submit', async () => {
    const onSubmit = vi.fn()
    const { result } = renderHook(() => useChatInput({ onSubmit }))

    act(() => {
      result.current.setValue('Hello')
    })

    expect(result.current.value).toBe('Hello')

    await act(async () => {
      await result.current.handleSubmit()
    })

    expect(result.current.value).toBe('')
    expect(onSubmit).toHaveBeenCalledWith('Hello')
  })
})
```

### Component Tests

**Target files:**
- `src/features/chat/components/MessageBubble.tsx`
- `src/features/chat/components/ChatInput.tsx`
- `src/features/chat/components/WelcomeScreen.tsx`

**Pattern:**
```typescript
// src/features/chat/components/__tests__/MessageBubble.test.tsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MessageBubble } from '../MessageBubble'

describe('MessageBubble', () => {
  it('renders user message content', () => {
    render(
      <MessageBubble
        message={{
          id: '1',
          role: 'user',
          content: 'Hello coach',
          createdAt: new Date(),
        }}
      />
    )
    expect(screen.getByText('Hello coach')).toBeInTheDocument()
  })
})
```

## Mocking

**Framework:** Would use Vitest's built-in `vi.mock()` and `vi.fn()`

**What to Mock:**
- Axios API clients (`authApiClient`, `chatApiClient`, `runmidApiClient`)
- `tokenStorage` methods (localStorage wrapper)
- `next/navigation` (`useRouter`, `useSearchParams`)
- `next/image` (for component tests)

**What NOT to Mock:**
- Utility functions (`cn()`, `generateId()`, validation functions)
- Zod schemas (test them directly)
- Component rendering logic (test via @testing-library)
- Type definitions

## Fixtures and Factories

**Recommended location:** `src/test/fixtures/`

**Recommended factory pattern:**
```typescript
// src/test/fixtures/messages.ts
import { Message } from '@/features/chat/types'

export function createMessage(overrides: Partial<Message> = {}): Message {
  return {
    id: 'msg-1',
    role: 'user',
    content: 'Test message',
    createdAt: new Date('2026-01-01'),
    ...overrides,
  }
}

export function createConversation(overrides: Partial<Conversation> = {}): Conversation {
  return {
    id: 'conv-1',
    title: 'Test conversation',
    messages: [],
    folderId: null,
    projectId: null,
    createdAt: new Date('2026-01-01'),
    updatedAt: new Date('2026-01-01'),
    ...overrides,
  }
}
```

## Coverage

**Requirements:** None enforced (no testing infrastructure exists)

**Recommended initial targets:**
- Utility functions: 100% (`src/lib/utils.ts`, `src/features/chat/utils/imageValidation.ts`)
- API service modules: 80%+ (`src/features/*/services/*.ts`)
- Custom hooks: 70%+ (`src/features/*/hooks/*.ts`)
- Components: 50%+ (focus on logic-heavy components first)

## Test Types

**Unit Tests:**
- Priority targets: utility functions, API service modules, Zod schemas, custom hooks
- Co-locate with source: `src/features/chat/utils/__tests__/imageValidation.test.ts`

**Integration Tests:**
- Priority targets: `useAuth` hook (combines React Query + API + token storage + routing)
- Requires wrapping with `QueryClientProvider` in test setup

**E2E Tests:**
- Not configured
- Recommended: Playwright for critical user flows (login, send message, conversation management)

## Validation Testing

**Zod schemas should be tested directly:**
```typescript
// src/features/auth/schemas/__tests__/auth.schema.test.ts
import { describe, it, expect } from 'vitest'
import { loginSchema, registerSchema } from '../auth.schema'

describe('loginSchema', () => {
  it('rejects invalid email', () => {
    const result = loginSchema.safeParse({ email: 'invalid', password: '123456' })
    expect(result.success).toBe(false)
  })

  it('rejects short password', () => {
    const result = loginSchema.safeParse({ email: 'user@test.com', password: '12345' })
    expect(result.success).toBe(false)
  })

  it('accepts valid credentials', () => {
    const result = loginSchema.safeParse({ email: 'user@test.com', password: '123456' })
    expect(result.success).toBe(true)
  })
})
```

## Priority Test Files to Create

| Priority | File to Test | Test File Path | Reason |
|----------|-------------|----------------|--------|
| 1 | `src/features/chat/utils/imageValidation.ts` | `src/features/chat/utils/__tests__/imageValidation.test.ts` | Pure functions, easy wins |
| 2 | `src/features/auth/schemas/auth.schema.ts` | `src/features/auth/schemas/__tests__/auth.schema.test.ts` | Validation logic, pure |
| 3 | `src/lib/utils.ts` | `src/lib/__tests__/utils.test.ts` | Shared utilities |
| 4 | `src/features/auth/services/authApi.ts` | `src/features/auth/services/__tests__/authApi.test.ts` | Auth is critical path |
| 5 | `src/features/chat/services/chatApi.ts` | `src/features/chat/services/__tests__/chatApi.test.ts` | Core feature |
| 6 | `src/features/chat/hooks/useChatInput.ts` | `src/features/chat/hooks/__tests__/useChatInput.test.ts` | Complex input logic |
| 7 | `src/shared/lib/apiClient.ts` | `src/shared/lib/__tests__/apiClient.test.ts` | Token refresh, interceptors |

---

*Testing analysis: 2026-04-22*
