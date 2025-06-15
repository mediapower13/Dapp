"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Vote, ArrowLeft, Mail, CheckCircle, RefreshCw } from "lucide-react"

export default function VerifyEmailPage() {
  const [verificationCode, setVerificationCode] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isResending, setIsResending] = useState(false)
  const [timeLeft, setTimeLeft] = useState(300) // 5 minutes
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [timeLeft])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    if (!verificationCode.trim()) {
      setError("Please enter the verification code")
      setIsLoading(false)
      return
    }

    if (verificationCode.length !== 6) {
      setError("Verification code must be 6 digits")
      setIsLoading(false)
      return
    }

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
      if (verificationCode === "123456") {
        setSuccess(true)
        setTimeout(() => {
          window.location.href = "/dashboard"
        }, 2000)
      } else {
        setError("Invalid verification code. Please try again.")
      }
    }, 2000)
  }

  const handleResendCode = async () => {
    setIsResending(true)
    setError("")

    // Simulate API call
    setTimeout(() => {
      setIsResending(false)
      setTimeLeft(300) // Reset timer
    }, 2000)
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 py-8 px-4">
        <div className="container mx-auto max-w-md">
          <Card className="shadow-xl border-0 text-center">
            <CardContent className="pt-8">
              <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Email Verified!</h2>
              <p className="text-gray-600 mb-4">
                Your account has been successfully verified. Redirecting to dashboard...
              </p>
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-600 mx-auto"></div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 py-8 px-4">
      <div className="container mx-auto max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/register" className="inline-flex items-center text-green-600 hover:text-green-700 mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Registration
          </Link>
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Vote className="h-8 w-8 text-green-600" />
            <h1 className="text-2xl font-bold text-gray-900">UNILORIN Vote</h1>
          </div>
        </div>

        <Card className="shadow-xl border-0">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 p-3 bg-green-100 rounded-full w-fit">
              <Mail className="h-8 w-8 text-green-600" />
            </div>
            <CardTitle className="text-2xl text-gray-900">Verify Your Email</CardTitle>
            <CardDescription>We've sent a 6-digit verification code to your student email address</CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <Alert className="mb-4 bg-red-50 border-red-200">
                <AlertDescription className="text-red-700">{error}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="code">Verification Code</Label>
                <Input
                  id="code"
                  type="text"
                  placeholder="Enter 6-digit code"
                  className="text-center text-2xl font-mono tracking-widest"
                  maxLength={6}
                  value={verificationCode}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, "")
                    setVerificationCode(value)
                    if (error) setError("")
                  }}
                />
              </div>

              <div className="text-center text-sm text-gray-600">
                {timeLeft > 0 ? (
                  <p>
                    Code expires in: <span className="font-mono font-bold text-red-600">{formatTime(timeLeft)}</span>
                  </p>
                ) : (
                  <p className="text-red-600">Verification code has expired</p>
                )}
              </div>

              <Button
                type="submit"
                className="w-full bg-green-600 hover:bg-green-700"
                disabled={isLoading || timeLeft === 0}
              >
                {isLoading ? "Verifying..." : "Verify Email"}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600 mb-2">Didn't receive the code?</p>
              <Button
                variant="outline"
                onClick={handleResendCode}
                disabled={isResending || timeLeft > 240} // Can resend after 1 minute
                className="text-green-600 border-green-600 hover:bg-green-50"
              >
                {isResending ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Resending...
                  </>
                ) : (
                  "Resend Code"
                )}
              </Button>
              {timeLeft > 240 && (
                <p className="text-xs text-gray-500 mt-1">You can resend in {formatTime(timeLeft - 240)}</p>
              )}
            </div>

            <Alert className="mt-4 bg-blue-50 border-blue-200">
              <Mail className="h-4 w-4" />
              <AlertDescription className="text-sm">
                <strong>Demo:</strong> Use code <code className="bg-blue-100 px-1 rounded">123456</code> to verify
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
