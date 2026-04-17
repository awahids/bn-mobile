"use client"

import Script from "next/script"
import { useRouter } from "next/navigation"
import { useEffect, useRef, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AlertCircle } from "lucide-react"
import { getErrorMessage } from "@/lib/api-core"
import { useAuth } from "@/hooks/use-auth"

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

const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID

export function LoginForm({
  callbackUrl = "/",
  title,
  description,
}: LoginFormProps) {
  const router = useRouter()
  const { loginWithGoogleIdToken } = useAuth()
  const buttonRef = useRef<HTMLDivElement>(null)
  const [scriptLoaded, setScriptLoaded] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!scriptLoaded || !buttonRef.current || !window.google || !googleClientId) {
      return
    }

    const element = buttonRef.current
    element.innerHTML = ""

    window.google.accounts.id.initialize({
      client_id: googleClientId,
      callback: async (response: { credential?: string }) => {
        if (!response?.credential) {
          setError("Google tidak mengembalikan ID token.")
          return
        }

        try {
          setIsSubmitting(true)
          setError(null)
          await loginWithGoogleIdToken(response.credential)
          router.push(callbackUrl)
        } catch (err) {
          setError(getErrorMessage(err))
        } finally {
          setIsSubmitting(false)
        }
      },
      auto_select: false,
      cancel_on_tap_outside: true,
      use_fedcm_for_prompt: true,
    })

    window.google.accounts.id.renderButton(element, {
      theme: "outline",
      size: "large",
      shape: "pill",
      text: "continue_with",
      width: 320,
    })
  }, [callbackUrl, loginWithGoogleIdToken, router, scriptLoaded])

  return (
    <div className="w-full">
      <Script
        src="https://accounts.google.com/gsi/client"
        strategy="afterInteractive"
        onLoad={() => setScriptLoaded(true)}
      />

      {title && (
        <div className="text-center mb-6">
          <h2 className="text-xl font-bold text-foreground mb-2">{title}</h2>
          {description && <p className="text-sm text-muted-foreground">{description}</p>}
        </div>
      )}

      <Card className="border border-border/60 shadow-sm">
        <CardContent className="p-6 space-y-5">
          <div className="text-center">
            <h3 className="text-lg font-semibold">Masuk dengan Google</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Autentikasi sekarang diproses oleh backend Golang.
            </p>
          </div>

          {!googleClientId && (
            <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive flex items-start gap-2">
              <AlertCircle className="h-4 w-4 mt-0.5" />
              <span>`NEXT_PUBLIC_GOOGLE_CLIENT_ID` belum diset.</span>
            </div>
          )}

          {error && (
            <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
              {error}
            </div>
          )}

          <div className="flex justify-center">
            <div ref={buttonRef} />
          </div>

          {isSubmitting && (
            <div className="text-center text-sm text-muted-foreground">
              Memproses login...
            </div>
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

      <div className="text-center text-xs text-muted-foreground mt-4">
        Dengan masuk, Anda menyetujui{" "}
        <button className="underline hover:text-foreground transition-colors" type="button">
          syarat dan ketentuan
        </button>{" "}
        aplikasi
      </div>
    </div>
  )
}

