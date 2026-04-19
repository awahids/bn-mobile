"use client"

import Script from "next/script"
import { useRouter } from "next/navigation"
import { useEffect, useMemo, useRef, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AlertCircle } from "lucide-react"

declare global {
  interface Window {
    google?: any
  }
}

interface LoginFormProps {
  callbackUrl?: string
  title?: string
  description?: string
}

const googleScope = "openid email profile"

function sanitizeCallbackUrl(callbackUrl: string): string {
  if (!callbackUrl.startsWith("/") || callbackUrl.startsWith("//")) {
    return "/"
  }
  return callbackUrl
}

export function LoginForm({
  callbackUrl = "/",
  title,
  description,
}: LoginFormProps) {
  const router = useRouter()
  const safeCallbackUrl = useMemo(
    () => sanitizeCallbackUrl(callbackUrl),
    [callbackUrl]
  )
  const codeClientRef = useRef<any>(null)
  const [hydrated, setHydrated] = useState(false)
  const [googleClientId, setGoogleClientId] = useState<string | null>(null)
  const [scriptLoaded, setScriptLoaded] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isGoogleReady, setIsGoogleReady] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setHydrated(true)
    setGoogleClientId(process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || null)
  }, [])

  useEffect(() => {
    if (!scriptLoaded || !window.google || !googleClientId) {
      setIsGoogleReady(false)
      return
    }

    try {
      codeClientRef.current = window.google.accounts.oauth2.initCodeClient({
        client_id: googleClientId,
        scope: googleScope,
        ux_mode: "redirect",
        redirect_uri: `${window.location.origin}/auth/callback`,
        state: JSON.stringify({ callbackUrl: safeCallbackUrl }),
      })

      setIsGoogleReady(true)
      setError(null)
    } catch {
      codeClientRef.current = null
      setIsGoogleReady(false)
      setError("Google OAuth gagal diinisialisasi.")
    }
  }, [googleClientId, safeCallbackUrl, scriptLoaded])

  const handleGoogleLogin = () => {
    if (!googleClientId) {
      setError("`NEXT_PUBLIC_GOOGLE_CLIENT_ID` belum diset.")
      return
    }

    if (!codeClientRef.current) {
      setError("Google OAuth belum siap, coba beberapa detik lagi.")
      return
    }

    try {
      setIsSubmitting(true)
      setError(null)
      codeClientRef.current.requestCode()
    } catch {
      setIsSubmitting(false)
      setError("Gagal memulai login Google.")
    }
  }

  const hasGoogleClientId = !!googleClientId

  return (
    <div className="w-full">
      <Script
        src="https://accounts.google.com/gsi/client"
        strategy="afterInteractive"
        onLoad={() => setScriptLoaded(true)}
      />

      {title && (
        <div className="mb-6 text-center">
          <h2 className="mb-2 text-xl font-bold text-foreground">{title}</h2>
          {description && <p className="text-sm text-muted-foreground">{description}</p>}
        </div>
      )}

      <Card className="border border-border/60 shadow-sm">
        <CardContent className="space-y-5 p-6">
          <div className="text-center">
            <h3 className="text-lg font-semibold">Masuk dengan Google</h3>
            {/* <p className="mt-1 text-sm text-muted-foreground">
              Login menggunakan Google OAuth 2.0 (authorization code flow).
            </p> */}
          </div>

          {hydrated && !hasGoogleClientId && (
            <div className="flex items-start gap-2 rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
              <AlertCircle className="mt-0.5 h-4 w-4" />
              <span>`NEXT_PUBLIC_GOOGLE_CLIENT_ID` belum diset.</span>
            </div>
          )}

          {error && (
            <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
              {error}
            </div>
          )}

          <Button
            type="button"
            className="w-full"
            onClick={handleGoogleLogin}
            disabled={isSubmitting || !hydrated || !hasGoogleClientId}
          >
            {isSubmitting ? "Mengalihkan ke Google..." : "Lanjutkan dengan Google"}
          </Button>

          {scriptLoaded && !isGoogleReady && hasGoogleClientId && (
            <p className="text-center text-xs text-muted-foreground">Menyiapkan Google OAuth...</p>
          )}

          <Button
            variant="ghost"
            className="w-full"
            onClick={() => router.push("/")}
            disabled={isSubmitting}
          >
            Lanjut sebagai tamu
          </Button>
        </CardContent>
      </Card>

      <div className="mt-4 text-center text-xs text-muted-foreground">
        Dengan masuk, Anda menyetujui{" "}
        <button className="underline transition-colors hover:text-foreground" type="button">
          syarat dan ketentuan
        </button>{" "}
        aplikasi
      </div>
    </div>
  )
}
