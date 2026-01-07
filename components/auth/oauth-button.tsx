'use client'

import { signIn } from 'next-auth/react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { FaGoogle, FaFacebook, FaInstagram } from 'react-icons/fa'

interface OAuthButtonProps {
  provider: 'google' | 'facebook' | 'instagram'
  callbackUrl?: string
  className?: string
  size?: 'sm' | 'default' | 'lg'
}

const providerConfig = {
  google: {
    name: 'Google',
    icon: FaGoogle,
    className: 'bg-red-600 hover:bg-red-700 text-white'
  },
  facebook: {
    name: 'Facebook',
    icon: FaFacebook,
    className: 'bg-blue-600 hover:bg-blue-700 text-white'
  },
  instagram: {
    name: 'Instagram',
    icon: FaInstagram,
    className: 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white'
  }
}

export function OAuthButton({
  provider,
  callbackUrl = '/',
  className = '',
  size = 'default'
}: OAuthButtonProps) {
  const [isLoading, setIsLoading] = useState(false)
  const config = providerConfig[provider]
  const Icon = config.icon

  const handleSignIn = async () => {
    try {
      setIsLoading(true)
      await signIn(provider, {
        callbackUrl,
        redirect: true
      })
    } catch (error) {
      console.error(`Error signing in with ${provider}:`, error)
      setIsLoading(false)
    }
  }

  return (
    <Button
      onClick={handleSignIn}
      disabled={isLoading}
      className={`flex items-center justify-center gap-3 ${config.className} ${className}`}
      size={size}
    >
      {isLoading ? (
        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
      ) : (
        <Icon className="h-5 w-5" />
      )}
      Masuk dengan {config.name}
    </Button>
  )
}