"use client"

import type React from "react"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { WalletIcon, KeyIcon, AlertCircleIcon } from "lucide-react"
import { useSmartAccount } from "@/hooks/useSmartAccount"
import { Spinner } from "@/components/ui/spinner"

export default function SignInPage() {
  const router = useRouter()
  const { loading, config, loginSmartAccount } = useSmartAccount()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    if (!loading && config) {
      router.push("/dashboard")
    }
  }, [loading, config, router])

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    setIsLoading(true)

    try {
      // Simulate passkey authentication
      await loginSmartAccount()

      router.push("/dashboard")
    } catch (err) {
      if (typeof err === "string") {
        setError(err)
      } else {
        setError("Failed to sign in. Please try again.")
      }
      setIsLoading(false)
    }
  }

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">
      <Spinner className="size-8 text-primary" />
    </div>
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-background via-background to-muted/20">
      <div className="w-full max-w-md space-y-6">
        {/* Logo */}
        <div className="flex flex-col items-center gap-2">
          <div className="flex items-center justify-center size-16 rounded-xl bg-primary text-primary-foreground">
            <WalletIcon className="size-8" />
          </div>
          <h1 className="text-2xl font-bold">Abstraction Wallet</h1>
        </div>

        {/* Sign In Card */}
        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl">Welcome Back</CardTitle>
            <CardDescription>Sign in to your wallet with passkey authentication</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSignIn} className="space-y-4">
              <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <div className="size-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
                    Authenticating...
                  </>
                ) : (
                  <>
                    <KeyIcon className="mr-2" />
                    Sign In with Passkey
                  </>
                )}
              </Button>
              {error && (
                <Alert variant="destructive">
                  <AlertCircleIcon className="size-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              <div className="space-y-4 pt-4">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-card px-2 text-muted-foreground">Secure Authentication</span>
                  </div>
                </div>

                <div className="text-sm text-muted-foreground space-y-2 bg-muted/50 p-4 rounded-lg">
                  <p className="font-medium text-foreground">Quick & Safe</p>
                  <p>
                    Use your device's biometric authentication to securely access your wallet. Your credentials never
                    leave your device.
                  </p>
                </div>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Sign Up Link */}
        <div className="text-center text-sm">
          <span className="text-muted-foreground">Don't have a wallet? </span>
          <Link href="/signup" className="text-primary hover:underline font-medium">
            Create one now
          </Link>
        </div>

        {/* Back to Home */}
        <div className="text-center">
          <Link href="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            ← Back to home
          </Link>
        </div>
      </div>
    </div>
  )
}

