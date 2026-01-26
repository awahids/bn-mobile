'use client'

import Image from 'next/image'
import { useSession } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, Suspense, useState } from 'react'
import { LoginForm } from '@/components/auth/login-form'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'

function LoginContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get('callbackUrl') || '/'
  const { status } = useSession()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (status === 'authenticated') {
      router.push(callbackUrl)
    }
  }, [status, router, callbackUrl])

  return (
    <div className="min-h-screen max-w-md mx-auto bg-background relative flex flex-col safe-area-top">
      <header className="flex items-center justify-between p-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.back()}
          className="rounded-full"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div className="text-center">
          <h1 className="text-lg font-semibold text-foreground">Masuk</h1>
        </div>
        <div className="w-10" />
      </header>

      <div className="flex-1 px-4 pb-10">
        <div className="text-center mt-2 mb-6">
          <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
            {mounted ? (
              <Image
                src="/images/logo/image.png"
                alt="Belajar Ngaji"
                width={64}
                height={64}
                className="h-full w-full object-cover rounded-full"
                priority
                unoptimized
              />
            ) : (
              <span className="text-2xl font-bold text-primary">ن</span>
            )}
          </div>
          <h2 className="text-2xl font-semibold text-foreground mb-2">
            Mulai Perjalanan Ngaji
          </h2>
          <p className="text-sm text-muted-foreground">
            Masuk atau daftar untuk melanjutkan belajar Al-Qur&apos;an.
          </p>
        </div>

        <LoginForm callbackUrl={callbackUrl} title="" />

        <div className="mt-6 text-center">
          <p className="text-xs text-muted-foreground">
            Kami menghormati privasi Anda. Data hanya digunakan untuk
            meningkatkan pengalaman pembelajaran.
          </p>
        </div>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    }>
      <LoginContent />
    </Suspense>
  )
}
