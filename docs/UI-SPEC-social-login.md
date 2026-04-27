# UI-SPEC: Social Login (Google + Strava)

**Date:** 2026-04-27
**Scope:** Substituir login email/password (cara-cracha) por login social OAuth (Google + Strava)

## Overview

Tela de login unificada com dois botões de login social. Remove completamente o sistema de email/password. O AuthLayout existente (split screen: branding left + form right) é mantido.

## Screens

### 1. Login Page (`/login`)

**Layout:** Mantém AuthLayout com painel esquerdo (branding navy) + painel direito (form).

**Painel direito — conteúdo novo:**

```
┌──────────────────────────────┐
│      [RunMind logo + nome]   │  ← só no mobile
│                              │
│  Entrar no Runmind           │  ← h1, font-display, text-[26px], bold, #14162E
│  Escolha como quer treinar   │  ← text-sm, #6B7088
│                              │
│  ┌──────────────────────────┐│
│  │ [G] Entrar com Google    ││  ← botão branco, borda, ícone Google colorido
│  └──────────────────────────┘│
│                              │
│  ┌──────────────────────────┐│
│  │ [S] Entrar com Strava    ││  ← botão laranja Strava (#FC4C02), ícone branco
│  └──────────────────────────┘│
│                              │
│  ─── ou ───                  │  ← divider com texto
│                              │
│  Ao entrar, você concorda    │  ← text-xs, #A8ADBE
│  com os Termos e Privacidade │
│                              │
└──────────────────────────────┘
```

**Painel esquerdo (branding):**
- Mantém estrutura do AuthLayout atual
- Badge: "Coach IA ativo"
- Título: "Seu coach de corrida com IA."
- Description: "Conecte seu Strava ou Google, e em 2 minutos você tem seu plano de treino personalizado."
- Steps:
  1. "Conecte sua conta"
  2. "Converse com o Coach IA"
  3. "Receba seu plano personalizado"
- Testimonial mantém

### 2. Google Callback Page (`/auth/google/callback`)

**URL recebida do backend:**
```
/auth/google/callback?accessToken=X&refreshToken=Y&userId=Z&username=U
```

**Fluxo:**
1. Lê `accessToken`, `refreshToken`, `userId`, `username` dos search params
2. Salva tokens no localStorage via `tokenStorage.setTokens(accessToken, refreshToken, username)`
3. Mostra tela de sucesso (1.5s)
4. Redireciona para `/onboarding` (novo user) ou `/chat` (user existente)

**UI:** Mesma estrutura da callback atual (card central, spinner → check → redirect)

**Estados:**
- `processing` — spinner + "Conectando com Google..."
- `success` — check verde + "Conectado!" + redirect
- `error` — X vermelho + mensagem + botão "Tentar novamente"

**Erros:**
- Sem accessToken → "Erro na autenticação. Tente novamente."
- Params incompletos → "Dados de autenticação incompletos."

### 3. Strava Login Callback (`/auth/strava/callback`)

**Mantém callback existente** mas adapta para login (além de conexão):
- Se user não tem token (login flow) → salva JWT retornado pelo POST /strava/token
- Se user já tem token (conexão flow) → mantém comportamento atual

### 4. Páginas removidas

- `/signup` — removida (signup acontece automaticamente no primeiro login social)
- `/forgot-password` — removida (sem password)
- `/connect-apps` — removida (conexão de providers vai para `/settings`)

## Components

### SocialLoginButton

```tsx
interface SocialLoginButtonProps {
  provider: 'google' | 'strava'
  onClick: () => void
  isLoading: boolean
}
```

**Google button:**
- Background: `white`
- Border: `1.5px solid rgba(20,22,46,0.09)`
- Text: `#14162E`, font-bold, text-sm
- Icon: Google "G" colorido (oficial, 20x20)
- Hover: `border-[#14162E]`, shadow sutil
- Height: `48px`, rounded-xl
- Width: `100%`

**Strava button:**
- Background: `#FC4C02` (Strava brand)
- Text: `white`, font-bold, text-sm
- Icon: Strava chevron branco (20x20)
- Hover: `opacity-90`, shadow sutil
- Height: `48px`, rounded-xl
- Width: `100%`

**Loading state:** Spinner substitui ícone, texto muda para "Conectando..."

### Divider

```
──────── ou ────────
```
- Linha: `border-t border-[rgba(20,22,46,0.09)]`
- Texto: `text-xs text-[#A8ADBE]` centralizado

## Service Layer

### `authApi` (modificações)

```typescript
// Remove
- login(credentials)
- register(credentials)
- forgotPassword(email)

// Add
+ getGoogleAuthUrl(): Promise<{ url: string }>
  // GET /api/v1/auth/google (pública, sem token)

// Keep
- getProfile()
- isAuthenticated()
- logout()
```

### `useAuth` hook (modificações)

```typescript
// Remove
- login, loginError, isLoggingIn
- register, registerError, isRegistering
- forgotPassword, forgotPasswordError

// Add
+ loginWithGoogle(): void
  // Chama getGoogleAuthUrl() → redirect

+ loginWithStrava(): void
  // Monta URL Strava OAuth → redirect

+ processGoogleCallback(params): void
  // Salva tokens no localStorage

// Keep
- isAuthenticated, isLoading, profile
- logout
```

## Auth Flow

### Google Login
```
1. User clica "Entrar com Google"
2. Frontend: GET /api/v1/auth/google (sem auth)
3. Response: { url: "https://accounts.google.com/..." }
4. Frontend: window.location.href = url
5. User autoriza no Google
6. Google → backend callback
7. Backend gera JWT → redirect frontend:
   /auth/google/callback?accessToken=X&refreshToken=Y&userId=Z&username=U
8. Frontend salva tokens → redirect /chat ou /onboarding
```

### Strava Login
```
1. User clica "Entrar com Strava"
2. Frontend monta URL: https://www.strava.com/oauth/authorize?client_id=...
3. User autoriza no Strava
4. Strava → backend callback → deep-link/redirect → frontend
5. Frontend: POST /api/v1/strava/token { code }
6. Backend retorna JWT
7. Frontend salva tokens → redirect /chat ou /onboarding
```

### New vs Existing User
- Backend decide: se `google_user_id`/`strava_athlete_id` já existe → login (retorna JWT)
- Se não existe → cria user + retorna JWT
- Frontend não precisa saber: sempre recebe JWT e redireciona
- Se user é novo (sem runner profile) → onboarding detecta e redireciona

## Files to Create/Modify

| Action | File | Description |
|--------|------|-------------|
| CREATE | `src/features/auth/components/SocialLoginButton.tsx` | Botão Google/Strava |
| CREATE | `src/features/auth/components/LoginDivider.tsx` | Divisor "ou" |
| MODIFY | `src/app/(auth)/login/page.tsx` | Substituir form por botões social |
| MODIFY | `src/app/auth/google/callback/page.tsx` | Adaptar para login (salvar JWT) |
| MODIFY | `src/app/auth/strava/callback/page.tsx` | Adaptar para login flow |
| MODIFY | `src/features/auth/services/authApi.ts` | Add getGoogleAuthUrl, remove email/password |
| MODIFY | `src/features/auth/hooks/useAuth.ts` | Add social login methods |
| DELETE | `src/app/(auth)/signup/page.tsx` | Removida |
| DELETE | `src/app/(auth)/forgot-password/page.tsx` | Removida |
| DELETE | `src/app/(auth)/connect-apps/page.tsx` | Removida |
| DELETE | `src/features/auth/components/PasswordInput.tsx` | Não usado mais |
| DELETE | `src/features/auth/schemas/auth.schema.ts` | Não usado mais |

## Design Tokens (from existing AuthLayout)

- Background form: `white`
- Text primary: `#14162E`
- Text muted: `#6B7088`
- Text micro: `#A8ADBE`
- Accent: `#00F048`
- Border: `rgba(20,22,46,0.09)`
- Strava orange: `#FC4C02`
- Google blue: `#4285F4` (ícone only)
- Font heading: `font-display` (Poppins)
- Font body: `font-sans` (Manrope)
- Border radius: `rounded-xl` (12px)

## Responsive

- **Desktop (lg+):** Split screen — branding panel left (52%) + form right
- **Mobile:** Full screen form com logo RunMind no topo, sem painel branding

## Accessibility

- Botões com `aria-label`: "Entrar com Google", "Entrar com Strava"
- Loading state: `aria-busy="true"`, `disabled`
- Focus visible em todos os botões interativos
- Contraste: botão Google (text dark on white), botão Strava (white on orange)
