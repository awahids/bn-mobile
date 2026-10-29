"use client"

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react"
import { api, type AuthUser } from "@/lib/api-core"
import {
  clearAccessToken,
  getAccessToken,
  onAuthStateChanged,
} from "@/lib/auth-storage"
import { disableWebPushSubscription } from "@/lib/web-push"

type AuthStatus = "loading" | "authenticated" | "unauthenticated"

interface AuthContextValue {
  user: AuthUser | null
  status: AuthStatus
  isAuthenticated: boolean
  loginWithGoogleIdToken: (idToken: string) => Promise<void>
  loginWithGoogleOAuthCode: (code: string, redirectUri: string) => Promise<void>
  logout: () => Promise<void>
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

function toAuthUser(user: AuthUser): AuthUser {
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    avatarUrl: user.avatarUrl,
    role: user.role,
    lastLoginAt: user.lastLoginAt,
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [status, setStatus] = useState<AuthStatus>("loading")
  const wasAuthenticatedRef = useRef(false)
  // Bumped by every session check and login. A check that finishes after a
  // newer one started (e.g. the page-load check resolving after the OAuth
  // callback already logged in) must not overwrite the newer result.
  const sessionVersionRef = useRef(0)

  const refreshUser = useCallback(async () => {
    const version = ++sessionVersionRef.current
    const isStale = () => version !== sessionVersionRef.current

    let token = getAccessToken()
    if (!token) {
      try {
        const refreshed = await api.auth.refresh({ emitEvent: false })
        token = refreshed?.accessToken
      } catch {
        // Ignore: missing/expired refresh cookie should settle to unauthenticated.
      }
    }
    if (isStale()) return

    if (!token) {
      setUser(null)
      setStatus("unauthenticated")
      return
    }

    try {
      const me = await api.auth.me()
      if (isStale()) return
      setUser(toAuthUser(me))
      setStatus("authenticated")
    } catch {
      try {
        await api.auth.refresh({ emitEvent: false })
        const me = await api.auth.me()
        if (isStale()) return
        setUser(toAuthUser(me))
        setStatus("authenticated")
      } catch {
        if (isStale()) return
        if (getAccessToken() === token) {
          clearAccessToken()
        }
        setUser(null)
        setStatus("unauthenticated")
      }
    }
  }, [])

  useEffect(() => {
    let mounted = true

    const bootstrap = async () => {
      if (!mounted) return
      await refreshUser()
    }

    bootstrap()

    const unsubscribe = onAuthStateChanged(() => {
      if (!mounted) return
      refreshUser()
    })

    return () => {
      mounted = false
      unsubscribe()
    }
  }, [refreshUser])

  useEffect(() => {
    const isAuthenticated = status === "authenticated" && !!user

    if (wasAuthenticatedRef.current && !isAuthenticated) {
      void disableWebPushSubscription()
    }

    wasAuthenticatedRef.current = isAuthenticated
  }, [status, user])

  const value = useMemo<AuthContextValue>(() => {
    return {
      user,
      status,
      isAuthenticated: status === "authenticated" && !!user,
      loginWithGoogleIdToken: async (idToken: string) => {
        sessionVersionRef.current++
        const result = await api.auth.loginWithGoogle(idToken)
        setUser(toAuthUser(result.user))
        setStatus("authenticated")
      },
      loginWithGoogleOAuthCode: async (code: string, redirectUri: string) => {
        sessionVersionRef.current++
        const result = await api.auth.loginWithGoogleOAuthCode(code, redirectUri)
        setUser(toAuthUser(result.user))
        setStatus("authenticated")
      },
      logout: async () => {
        try {
          await disableWebPushSubscription()
        } catch {
          // Do not block logout if push cleanup fails.
        }
        await api.auth.logout()
        setUser(null)
        setStatus("unauthenticated")
      },
      refreshUser,
    }
  }, [user, status])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider")
  }
  return context
}
