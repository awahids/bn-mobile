'use client'

import { useEffect, useMemo, useState } from 'react'
import { getProviders, signIn, type ClientSafeProvider } from 'next-auth/react'
import { Eye, EyeOff } from 'lucide-react'
import { FaFacebook, FaGoogle } from 'react-icons/fa'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

interface LoginFormProps {
  callbackUrl?: string
  title?: string
  description?: string
}

const socialProviders = [
  { id: 'google', label: 'Google', icon: FaGoogle },
  { id: 'facebook', label: 'Facebook', icon: FaFacebook },
] as const

type SocialProvider = (typeof socialProviders)[number]['id']

export function LoginForm({
  callbackUrl = '/',
  title,
  description,
}: LoginFormProps) {
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login')
  const [loadingProvider, setLoadingProvider] = useState<SocialProvider | null>(null)
  const [showLoginPassword, setShowLoginPassword] = useState(false)
  const [showRegisterPassword, setShowRegisterPassword] = useState(false)
  const [showRegisterConfirm, setShowRegisterConfirm] = useState(false)
  const [providers, setProviders] = useState<Record<string, ClientSafeProvider> | null>(null)
  const [providersError, setProvidersError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    getProviders()
      .then((result) => {
        if (cancelled) return
        setProviders(result)
      })
      .catch((error) => {
        if (cancelled) return
        console.error('Failed to load auth providers:', error)
        setProvidersError('Layanan login sedang tidak tersedia')
      })

    return () => {
      cancelled = true
    }
  }, [])

  const availableSocialProviders = useMemo(() => {
    if (!providers) return socialProviders
    return socialProviders.filter((p) => Boolean(providers[p.id]))
  }, [providers])

  const handleSocialSignIn = async (provider: SocialProvider) => {
    try {
      setLoadingProvider(provider)
      await signIn(provider, { callbackUrl, redirect: true })
    } catch (error) {
      console.error(`Error signing in with ${provider}:`, error)
    } finally {
      setLoadingProvider(null)
    }
  }

  return (
    <div className="w-full">
      {title && (
        <div className="text-center mb-6">
          <h2 className="text-xl font-bold text-foreground mb-2">{title}</h2>
          {description && (
            <p className="text-sm text-muted-foreground">{description}</p>
          )}
        </div>
      )}

      <Card className="border border-border/60 shadow-sm">
        <CardContent className="p-6">
          <Tabs
            value={activeTab}
            onValueChange={(value) => setActiveTab(value as 'login' | 'register')}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-2 rounded-full bg-muted p-1">
              <TabsTrigger value="login" className="rounded-full text-sm">
                Masuk
              </TabsTrigger>
              <TabsTrigger value="register" className="rounded-full text-sm">
                Daftar
              </TabsTrigger>
            </TabsList>

            <TabsContent value="login" className="mt-6">
              <form
                className="space-y-4"
                onSubmit={(event) => event.preventDefault()}
              >
                <div className="space-y-2">
                  <Label htmlFor="login-email">Email</Label>
                  <Input
                    id="login-email"
                    type="email"
                    autoComplete="email"
                    placeholder="nama@email.com"
                    className="rounded-full"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="login-password">Kata sandi</Label>
                  <div className="relative">
                    <Input
                      id="login-password"
                      type={showLoginPassword ? 'text' : 'password'}
                      autoComplete="current-password"
                      placeholder="Masukkan kata sandi"
                      className="rounded-full pr-10"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-1 top-1/2 h-8 w-8 -translate-y-1/2"
                      onClick={() => setShowLoginPassword((prev) => !prev)}
                      aria-label={showLoginPassword ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'}
                    >
                      {showLoginPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>

                <div className="flex items-center justify-end">
                  <Button variant="link" className="h-auto p-0 text-xs" type="button">
                    Lupa kata sandi?
                  </Button>
                </div>

                <Button className="w-full rounded-full" type="submit">
                  Masuk
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="register" className="mt-6">
              <form
                className="space-y-4"
                onSubmit={(event) => event.preventDefault()}
              >
                <div className="space-y-2">
                  <Label htmlFor="register-name">Nama lengkap</Label>
                  <Input
                    id="register-name"
                    type="text"
                    autoComplete="name"
                    placeholder="Nama lengkap"
                    className="rounded-full"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="register-email">Email</Label>
                  <Input
                    id="register-email"
                    type="email"
                    autoComplete="email"
                    placeholder="nama@email.com"
                    className="rounded-full"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="register-password">Kata sandi</Label>
                  <div className="relative">
                    <Input
                      id="register-password"
                      type={showRegisterPassword ? 'text' : 'password'}
                      autoComplete="new-password"
                      placeholder="Buat kata sandi"
                      className="rounded-full pr-10"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-1 top-1/2 h-8 w-8 -translate-y-1/2"
                      onClick={() => setShowRegisterPassword((prev) => !prev)}
                      aria-label={showRegisterPassword ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'}
                    >
                      {showRegisterPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="register-confirm">Konfirmasi kata sandi</Label>
                  <div className="relative">
                    <Input
                      id="register-confirm"
                      type={showRegisterConfirm ? 'text' : 'password'}
                      autoComplete="new-password"
                      placeholder="Ulangi kata sandi"
                      className="rounded-full pr-10"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-1 top-1/2 h-8 w-8 -translate-y-1/2"
                      onClick={() => setShowRegisterConfirm((prev) => !prev)}
                      aria-label={showRegisterConfirm ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'}
                    >
                      {showRegisterConfirm ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>

                <Button className="w-full rounded-full" type="submit">
                  Buat akun
                </Button>
              </form>
            </TabsContent>
          </Tabs>

          <div className="mt-6">
            <div className="flex items-center gap-3">
              <Separator className="flex-1" />
              <span className="text-xs text-muted-foreground">
                {activeTab === 'login' ? 'atau lanjutkan dengan' : 'atau daftar dengan'}
              </span>
              <Separator className="flex-1" />
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3">
              {availableSocialProviders.map((provider) => {
                const Icon = provider.icon
                const isLoading = loadingProvider === provider.id

                return (
                  <Button
                    key={provider.id}
                    variant="outline"
                    className="w-full rounded-full"
                    onClick={() => handleSocialSignIn(provider.id)}
                    disabled={loadingProvider !== null}
                  >
                    {isLoading ? (
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-muted-foreground border-t-transparent" />
                    ) : (
                      <Icon className="h-4 w-4" />
                    )}
                    {provider.label}
                  </Button>
                )
              })}
            </div>

            {providersError && (
              <p className="mt-4 text-xs text-destructive text-center">
                {providersError}
              </p>
            )}

            {providers && availableSocialProviders.length === 0 && (
              <p className="mt-4 text-xs text-muted-foreground text-center">
                Provider OAuth belum dikonfigurasi. Set `GOOGLE_CLIENT_ID` dan `GOOGLE_CLIENT_SECRET` di env.
              </p>
            )}

            <div className="mt-6 text-center text-xs text-muted-foreground">
              {activeTab === 'login' ? (
                <>
                  Belum punya akun?{' '}
                  <button
                    type="button"
                    className="text-primary hover:underline"
                    onClick={() => setActiveTab('register')}
                  >
                    Daftar
                  </button>
                </>
              ) : (
                <>
                  Sudah punya akun?{' '}
                  <button
                    type="button"
                    className="text-primary hover:underline"
                    onClick={() => setActiveTab('login')}
                  >
                    Masuk
                  </button>
                </>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="text-center text-xs text-muted-foreground mt-4">
        Dengan masuk, Anda menyetujui{' '}
        <button className="underline hover:text-foreground transition-colors" type="button">
          syarat dan ketentuan
        </button>{' '}
        aplikasi
      </div>
    </div>
  )
}
