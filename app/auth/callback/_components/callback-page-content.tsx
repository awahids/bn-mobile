'use client'

import { Suspense, useEffect, useRef, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAuth } from '@/hooks/use-auth'
import { getErrorMessage, isApiError } from '@/lib/api-core'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

type CallbackStatus = 'loading' | 'success' | 'error'

function sanitizeCallbackUrl(callbackUrl: string): string {
  if (!callbackUrl.startsWith('/') || callbackUrl.startsWith('//')) {
    return '/'
  }
  return callbackUrl
}

function readCallbackUrlFromState(stateValue: string | null): string {
  if (!stateValue) {
    return '/'
  }

  try {
    const parsed = JSON.parse(stateValue)
    if (parsed && typeof parsed.callbackUrl === 'string') {
      return sanitizeCallbackUrl(parsed.callbackUrl)
    }
  } catch {
    return sanitizeCallbackUrl(stateValue)
  }

  return '/'
}

// Turns server / Google OAuth errors into something a user can act on. The
// technical detail is still shown underneath for debugging.
function describeLoginError(error: unknown): string {
  const detail = getErrorMessage(error).toLowerCase()

  if (isApiError(error) && error.status === 0) {
    return 'Tidak bisa terhubung ke server. Periksa koneksi internet lalu coba lagi.'
  }
  if (isApiError(error) && error.status === 429) {
    return 'Terlalu banyak percobaan login. Tunggu sekitar 1 menit lalu coba lagi.'
  }
  if (detail.includes('redirect_uri_mismatch') || detail.includes('redirect uri')) {
    return `Alamat callback belum terdaftar di Google Cloud Console. Tambahkan ${window.location.origin}/auth/callback ke "Authorized redirect URIs".`
  }
  if (detail.includes('invalid_client') || detail.includes('unauthorized_client') || detail.includes('not configured')) {
    return 'Konfigurasi Google OAuth di server belum benar (client ID / client secret).'
  }
  if (detail.includes('not verified')) {
    return 'Email Google Anda belum terverifikasi.'
  }
  if (detail.includes('oauth code') || detail.includes('invalid_grant') || detail.includes('expired')) {
    return 'Kode login dari Google sudah kedaluwarsa atau sudah dipakai. Silakan coba login lagi.'
  }
  return 'Login dengan Google gagal. Silakan coba lagi.'
}

function describeOAuthRedirectError(code: string, description: string | null): string {
  if (code === 'access_denied') {
    return 'Login dibatalkan. Anda bisa mencoba lagi kapan saja.'
  }
  return description || 'Terjadi kesalahan saat login dengan Google.'
}

function CallbackContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { loginWithGoogleOAuthCode } = useAuth()
  const handledRef = useRef(false)

  const [status, setStatus] = useState<CallbackStatus>('loading')
  const [message, setMessage] = useState('Menyelesaikan login Google...')
  const [errorDetail, setErrorDetail] = useState<string | null>(null)
  const [retryUrl, setRetryUrl] = useState('/login')

  useEffect(() => {
    if (handledRef.current) {
      return
    }

    const code = searchParams?.get('code')
    const oauthError = searchParams?.get('error')
    const oauthErrorDescription = searchParams?.get('error_description')
    const callbackUrl = readCallbackUrlFromState(searchParams?.get('state') || null)

    setRetryUrl(`/login?callbackUrl=${encodeURIComponent(callbackUrl)}`)

    if (oauthError) {
      handledRef.current = true
      setStatus('error')
      setMessage(describeOAuthRedirectError(oauthError, oauthErrorDescription))
      setErrorDetail(oauthError)
      return
    }

    if (!code) {
      handledRef.current = true
      setStatus('error')
      setMessage('Kode login dari Google tidak ditemukan. Silakan coba login lagi.')
      return
    }

    handledRef.current = true

    const completeLogin = async () => {
      try {
        const redirectUri = `${window.location.origin}/auth/callback`
        await loginWithGoogleOAuthCode(code, redirectUri)

        setStatus('success')
        setMessage('Login berhasil, mengalihkan...')

        setTimeout(() => {
          router.replace(callbackUrl)
        }, 700)
      } catch (error) {
        console.error('Google login failed:', error)
        setStatus('error')
        setMessage(describeLoginError(error))
        setErrorDetail(getErrorMessage(error))
      }
    }

    void completeLogin()
  }, [loginWithGoogleOAuthCode, router, searchParams])

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">
            {status === 'loading' && 'Memproses Login...'}
            {status === 'success' && 'Login Berhasil'}
            {status === 'error' && 'Login Gagal'}
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          {status === 'loading' && (
            <div className="flex flex-col items-center gap-4">
              <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-primary" />
              <p className="text-muted-foreground">{message}</p>
            </div>
          )}

          {status === 'success' && (
            <div className="flex flex-col items-center gap-4">
              <div className="rounded-full bg-primary/10 p-3">
                <svg className="h-8 w-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <p className="font-medium text-primary">{message}</p>
            </div>
          )}

          {status === 'error' && (
            <div className="flex flex-col items-center gap-4">
              <div className="rounded-full bg-destructive/10 p-3">
                <svg className="h-8 w-8 text-destructive" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <p className="font-medium text-destructive" role="alert">{message}</p>
              {errorDetail ? (
                <p className="break-all text-xs text-muted-foreground">Detail: {errorDetail}</p>
              ) : null}
              <div className="flex w-full flex-col gap-2">
                <Button className="w-full" onClick={() => router.replace(retryUrl)}>
                  Coba lagi
                </Button>
                <Button variant="ghost" className="w-full" onClick={() => router.replace('/')}>
                  Kembali ke beranda
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export function CallbackPageContent() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-background p-4">
          <Card className="w-full max-w-md">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-bold">Memuat...</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <div className="mx-auto h-12 w-12 animate-spin rounded-full border-b-2 border-primary" />
              <p className="mt-4 text-muted-foreground">Memproses callback...</p>
            </CardContent>
          </Card>
        </div>
      }
    >
      <CallbackContent />
    </Suspense>
  )
}
