'use client'

/**
 * Global Error Component
 * 
 * This component is displayed when an error occurs during page rendering.
 * It provides a user-friendly error message and recovery options.
 */

import { useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertTriangle, RefreshCw, Home } from "lucide-react"

interface ErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Application error:', error)
  }, [error])

  return (
    <div className="min-h-screen max-w-md mx-auto bg-background relative safe-area-top">
      <div className="flex items-center justify-center min-h-screen p-4">
        <Card className="w-full max-w-sm">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-8 h-8 text-destructive" />
            </div>
            <CardTitle className="text-xl">Oops! Terjadi Kesalahan</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground text-center">
              Maaf, terjadi kesalahan yang tidak terduga. Silakan coba lagi atau kembali ke beranda.
            </p>

            {process.env.NODE_ENV === 'development' && (
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
              <Button
                onClick={reset}
                className="w-full"
                variant="default"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Coba Lagi
              </Button>

              <Button
                onClick={() => window.location.href = '/'}
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