const ACCESS_TOKEN_KEY = "bn_access_token"
const AUTH_STATE_EVENT = "bn-auth-state-changed"
const AUTH_HINT_COOKIE = "bn_auth_hint"
const AUTH_HINT_COOKIE_MAX_AGE_SECONDS = 7 * 24 * 60 * 60

export type AuthStateChangeReason =
  | "login"
  | "logout"
  | "refresh"
  | "token-cleared"
  | "token-updated"

function isBrowser() {
  return typeof window !== "undefined"
}

export function getAccessToken(): string | null {
  if (!isBrowser()) return null
  return window.localStorage.getItem(ACCESS_TOKEN_KEY)
}

export function setAccessToken(token: string) {
  if (!isBrowser()) return
  window.localStorage.setItem(ACCESS_TOKEN_KEY, token)
  document.cookie = `${AUTH_HINT_COOKIE}=1; Path=/; Max-Age=${AUTH_HINT_COOKIE_MAX_AGE_SECONDS}; SameSite=Lax`
}

export function clearAccessToken() {
  if (!isBrowser()) return
  window.localStorage.removeItem(ACCESS_TOKEN_KEY)
  document.cookie = `${AUTH_HINT_COOKIE}=; Path=/; Max-Age=0; SameSite=Lax`
}

export function emitAuthStateChanged(reason: AuthStateChangeReason) {
  if (!isBrowser()) return
  window.dispatchEvent(
    new CustomEvent(AUTH_STATE_EVENT, {
      detail: { reason },
    })
  )
}

export function onAuthStateChanged(listener: () => void): () => void {
  if (!isBrowser()) return () => {}
  const handler = () => listener()
  window.addEventListener(AUTH_STATE_EVENT, handler)
  return () => window.removeEventListener(AUTH_STATE_EVENT, handler)
}
