"use client"

import { useCallback } from "react"
import { useRouter } from "next/navigation"
import { useAuth as useAuthContext } from "@/components/auth/auth-provider"

export function useAuth() {
  const auth = useAuthContext()
  const router = useRouter()

  const requireAuth = useCallback(
    (redirectTo = "/login") => {
      if (auth.status !== "loading" && !auth.isAuthenticated) {
        router.push(redirectTo)
        return false
      }
      return true
    },
    [auth.isAuthenticated, auth.status, router]
  )

  const redirectIfAuthenticated = useCallback(
    (redirectTo = "/") => {
      if (auth.status !== "loading" && auth.isAuthenticated) {
        router.push(redirectTo)
        return true
      }
      return false
    },
    [auth.isAuthenticated, auth.status, router]
  )

  const session = auth.user
    ? {
        user: {
          id: auth.user.id,
          name: auth.user.name,
          email: auth.user.email,
          image: auth.user.avatarUrl ?? null,
        },
      }
    : null

  return {
    ...auth,
    session,
    isLoading: auth.status === "loading",
    requireAuth,
    redirectIfAuthenticated,
  }
}

