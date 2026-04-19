'use client'

import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { useAuth } from '@/hooks/use-auth'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface SessionGuardProps {
  children: React.ReactNode
  requireAuth?: boolean
  redirectTo?: string
  fallback?: React.ReactNode
}

export function SessionGuard({
  children,
  requireAuth = true,
  redirectTo = '/login',
  fallback
}: SessionGuardProps) {
  const { isAuthenticated, status } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (status === 'loading') return // Still loading

    if (requireAuth && !isAuthenticated) {
      router.push(redirectTo)
    }
  }, [isAuthenticated, status, requireAuth, redirectTo, router])

  if (status === 'loading') {
    return fallback || (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle>Memuat...</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto" />
            <p className="text-gray-600 mt-4">Memeriksa status login...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (requireAuth && !isAuthenticated) {
    return null // Will redirect
  }

  return <>{children}</>
}
