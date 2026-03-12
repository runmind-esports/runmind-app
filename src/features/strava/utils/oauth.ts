const STRAVA_CLIENT_ID = process.env.NEXT_PUBLIC_STRAVA_CLIENT_ID || ''

export function buildStravaAuthUrl(): string {
  if (typeof window === 'undefined') return ''

  const redirectUri = `${window.location.origin}/auth/strava/callback`
  const state = crypto.randomUUID()

  // Store state for validation on callback
  localStorage.setItem('strava_oauth_state', state)

  const params = new URLSearchParams({
    client_id: STRAVA_CLIENT_ID,
    redirect_uri: redirectUri,
    response_type: 'code',
    scope: 'read,activity:read_all',
    state: state,
  })

  return `https://www.strava.com/oauth/authorize?${params}`
}

export function validateOAuthState(state: string | null): boolean {
  if (typeof window === 'undefined' || !state) return false

  const storedState = localStorage.getItem('strava_oauth_state')
  return storedState === state
}

export function clearOAuthState(): void {
  if (typeof window === 'undefined') return
  localStorage.removeItem('strava_oauth_state')
}
