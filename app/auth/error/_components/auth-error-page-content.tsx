'use client'

import { useEffect, useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

const errorMessages: Record<string, string> = {
  Configuration: 'Terjadi kesalahan konfigurasi server. Silakan hubungi administrator.',
  AccessDenied: 'Akses ditolak. Anda tidak memberikan izin yang diperlukan.',
  Verification: 'Token verifikasi tidak valid atau sudah kedaluwarsa.',
  Default: 'Terjadi kesalahan saat login. Silakan coba lagi.',
  OAuthSignin: 'Terjadi kesalahan saat memulai proses OAuth.',
  OAuthCallback: 'Terjadi kesalahan saat memproses callback OAuth.',
  OAuthCreateAccount: 'Gagal membuat akun OAuth.',
  EmailCreateAccount: 'Gagal membuat akun dengan email.',
  Callback: 'Terjadi kesalahan pada callback URL.',
  OAuthAccountNotLinked: 'Akun OAuth tidak dapat dihubungkan. Email mungkin sudah digunakan dengan provider lain.',
  EmailSignin: 'Gagal mengirim email signin.',
  CredentialsSignin: 'Kredensial login tidak valid.',
  SessionRequired: 'Sesi diperlukan untuk mengakses halaman ini.'
}

function ErrorContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [errorType, setErrorType] = useState<string>('')
  const [errorMessage, setErrorMessage] = useState<string>('')

  useEffect(() => {
    const error = searchParams?.get('error') || 'Default'
    setErrorType(error)
    setErrorMessage(errorMessages[error] || errorMessages.Default)
  }, [searchParams])

  const handleRetry = () => {
    router.push('/login')
  }

  const handleHome = () => {
    router.push('/')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-orange-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-red-800">
            Kesalahan Autentikasi
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-6">
          <div className="flex flex-col items-center gap-4">
            <div className="rounded-full bg-red-100 p-4">
              <svg className="h-12 w-12 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>

            <div className="space-y-2">
              <p className="text-red-700 font-medium text-lg">
                {errorMessage}
              </p>

              {errorType && (
                <p className="text-sm text-gray-600">
                  Kode kesalahan: {errorType}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-3">
            <Button
              onClick={handleRetry}
              className="w-full bg-red-600 hover:bg-red-700 text-white"
              size="lg"
            >
              Coba Login Lagi
            </Button>

            <Button
              onClick={handleHome}
              variant="outline"
              className="w-full border-red-300 text-red-700 hover:bg-red-50"
              size="lg"
            >
              Kembali ke Beranda
            </Button>
          </div>

          <div className="text-xs text-gray-500 mt-4">
            Jika masalah terus berlanjut, silakan hubungi tim dukungan
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export function AuthErrorPageContent() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-orange-50 p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-red-800">
              Memuat...
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto" />
            <p className="text-gray-600 mt-4">Memproses error...</p>
          </CardContent>
        </Card>
      </div>
    }>
      <ErrorContent />
    </Suspense>
  )
}
