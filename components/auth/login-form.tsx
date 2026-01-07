'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { OAuthButton } from './oauth-button'

interface LoginFormProps {
  callbackUrl?: string
  title?: string
  description?: string
}

export function LoginForm({
  callbackUrl = '/',
  title = 'Masuk ke Belajar Ngaji',
  description = 'Pilih metode login untuk melanjutkan pembelajaran'
}: LoginFormProps) {
  return (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold text-green-800">
          {title}
        </CardTitle>
        <CardDescription>
          {description}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <OAuthButton
          provider="google"
          callbackUrl={callbackUrl}
          className="w-full"
          size="lg"
        />

        <OAuthButton
          provider="facebook"
          callbackUrl={callbackUrl}
          className="w-full"
          size="lg"
        />

        <OAuthButton
          provider="instagram"
          callbackUrl={callbackUrl}
          className="w-full"
          size="lg"
        />

        <div className="text-center text-sm text-gray-600 mt-6">
          Dengan masuk, Anda menyetujui syarat dan ketentuan aplikasi
        </div>
      </CardContent>
    </Card>
  )
}