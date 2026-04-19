'use client'

/**
 * Reusable Error Boundary Component
 * 
 * This component provides a consistent error UI across different pages
 * with customizable messages and actions.
 */

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertTriangle, RefreshCw, Home, ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"

interface ErrorBoundaryProps {
  error?: Error & { digest?: string }
  reset?: () => void
  title?: string
  message?: string
  showBackButton?: boolean
  showHomeButton?: boolean
  showRetryButton?: boolean
}

export function ErrorBoundary({
  error,
  reset,
  title = "Oops! Terjadi Kesalahan",
  message = "Maaf, terjadi kesalahan yang tidak terduga. Silakan coba lagi atau kembali ke halaman sebelumnya.",
  showBackButton = true,
  showHomeButton = true,
  showRetryButton = true
}: ErrorBoundaryProps) {
  const router = useRouter()

  return (
    <div className="min-h-screen max-w-md mx-auto bg-background relative safe-area-top">
      <div className="flex items-center justify-center min-h-screen p-4">
        <Card className="w-full max-w-sm">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-8 h-8 text-destructive" />
            </div>
            <CardTitle className="text-xl">{title}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground text-center">
              {message}
            </p>

            {error && process.env.NODE_ENV === 'development' && (
              <details className="text-xs bg-muted p-3 rounded-lg">
                <summary className="cursor-pointer font-medium mb-2">
                  Detail Error (Development)
                </summary>
                <pre className="whitespace-pre-wrap break-words">
                  {error.message}
                  {error.stack && '\n\nStack trace:\n' + error.stack}
                </pre>
              </details>
            )}

            <div className="space-y-2">
              {showRetryButton && reset && (
                <Button
                  onClick={reset}
                  className="w-full"
                  variant="default"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Coba Lagi
                </Button>
              )}

              {showBackButton && (
                <Button
                  onClick={() => router.back()}
                  className="w-full"
                  variant="outline"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Kembali
                </Button>
              )}

              {showHomeButton && (
                <Button
                  onClick={() => router.push('/')}
                  className="w-full"
                  variant="outline"
                >
                  <Home className="w-4 h-4 mr-2" />
                  Beranda
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

/**
 * Network Error Component
 * Specialized error component for network/API errors
 */
export function NetworkError({
  onRetry,
  message = "Tidak dapat terhubung ke server. Periksa koneksi internet Anda dan coba lagi."
}: {
  onRetry?: () => void
  message?: string
}) {
  return (
    <ErrorBoundary
      title="Masalah Koneksi"
      message={message}
      reset={onRetry}
      showBackButton={false}
      showRetryButton={!!onRetry}
    />
  )
}

/**
 * Not Found Error Component
 * Specialized error component for 404 errors
 */
export function NotFoundError({
  title = "Halaman Tidak Ditemukan",
  message = "Halaman yang Anda cari tidak dapat ditemukan. Mungkin telah dipindahkan atau dihapus."
}: {
  title?: string
  message?: string
}) {
  return (
    <ErrorBoundary
      title={title}
      message={message}
      showRetryButton={false}
    />
  )
}

/**
 * Authentication Error Component
 * Specialized error component for auth errors
 */
export function AuthError({
  onLogin,
  message = "Anda perlu masuk untuk mengakses halaman ini."
}: {
  onLogin?: () => void
  message?: string
}) {
  const router = useRouter()

  return (
    <div className="min-h-screen max-w-md mx-auto bg-background relative safe-area-top">
      <div className="flex items-center justify-center min-h-screen p-4">
        <Card className="w-full max-w-sm">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-8 h-8 text-primary" />
            </div>
            <CardTitle className="text-xl">Perlu Masuk</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground text-center">
              {message}
            </p>

            <div className="space-y-2">
              <Button
                onClick={onLogin || (() => router.push('/login'))}
                className="w-full"
                variant="default"
              >
                Masuk Sekarang
              </Button>

              <Button
                onClick={() => router.push('/')}
                className="w-full"
                variant="outline"
              >
                <Home className="w-4 h-4 mr-2" />
                Kembali ke Beranda
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}