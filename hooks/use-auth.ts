'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useCallback } from 'react'

export function useAuth() {
  const { data: session, status } = useSession()
  const router = useRouter()

  const isLoading = status === 'loading'
  const isAuthenticated = !!session
  const user = session?.user

  const requireAuth = useCallback((redirectTo = '/login') => {
    if (!isLoading && !isAuthenticated) {
      router.push(redirectTo)
      return false
    }
    return true
  }, [isLoading, isAuthenticated, router])

  const redirectIfAuthenticated = useCallback((redirectTo = '/') => {
    if (!isLoading && isAuthenticated) {
      router.push(redirectTo)
      return true
    }
    return false
  }, [isLoading, isAuthenticated, router])

  return {
    session,
    user,
    isLoading,
    isAuthenticated,
    requireAuth,
    redirectIfAuthenticated,
  }
}