'use client'

import { Suspense, useEffect, useRef, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAuth } from '@/hooks/use-auth'
import { getErrorMessage } from '@/lib/api-core'
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

function CallbackContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { loginWithGoogleOAuthCode } = useAuth()
  const handledRef = useRef(false)

  const [status, setStatus] = useState<CallbackStatus>('loading')
  const [message, setMessage] = useState('Menyelesaikan login Google...')

  useEffect(() => {
    if (handledRef.current) {
      return
    }

    const code = searchParams?.get('code')
    const oauthError = searchParams?.get('error')
    const oauthErrorDescription = searchParams?.get('error_description')
    const callbackUrl = readCallbackUrlFromState(searchParams?.get('state') || null)

    if (oauthError) {
      handledRef.current = true
      setStatus('error')
      setMessage(oauthErrorDescription || 'Terjadi kesalahan saat login dengan Google.')
      setTimeout(() => {
        router.replace(`/login?callbackUrl=${encodeURIComponent(callbackUrl)}`)
      }, 1500)
      return
    }

    if (!code) {
      handledRef.current = true
      setStatus('error')
      setMessage('Kode OAuth Google tidak ditemukan.')
      setTimeout(() => {
        router.replace('/login')
      }, 1500)
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
        setStatus('error')
        setMessage(getErrorMessage(error))

        setTimeout(() => {
          router.replace(`/login?callbackUrl=${encodeURIComponent(callbackUrl)}`)
        }, 1500)
      }
    }

    void completeLogin()
  }, [loginWithGoogleOAuthCode, router, searchParams])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-50 p-4">
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
              <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-green-600" />
              <p className="text-gray-600">{message}</p>
            </div>
          )}

          {status === 'success' && (
            <div className="flex flex-col items-center gap-4">
              <div className="rounded-full bg-green-100 p-3">
                <svg className="h-8 w-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <p className="font-medium text-green-600">{message}</p>
            </div>
          )}

          {status === 'error' && (
            <div className="flex flex-col items-center gap-4">
              <div className="rounded-full bg-red-100 p-3">
                <svg className="h-8 w-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <p className="font-medium text-red-600">{message}</p>
              <p className="text-sm text-gray-500">Mengalihkan kembali ke halaman login...</p>
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
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-50 p-4">
          <Card className="w-full max-w-md">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-bold">Memuat...</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <div className="mx-auto h-12 w-12 animate-spin rounded-full border-b-2 border-green-600" />
              <p className="mt-4 text-gray-600">Memproses callback...</p>
            </CardContent>
          </Card>
        </div>
      }
    >
      <CallbackContent />
    </Suspense>
  )
}
