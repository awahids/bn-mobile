const ACCESS_TOKEN_KEY = "bn_access_token"
const AUTH_STATE_EVENT = "bn-auth-state-changed"

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
}

export function clearAccessToken() {
  if (!isBrowser()) return
  window.localStorage.removeItem(ACCESS_TOKEN_KEY)
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

