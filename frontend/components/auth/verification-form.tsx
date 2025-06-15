"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Mail, Loader2, CheckCircle } from "lucide-react"

interface VerificationFormProps {
  email: string
  onVerify: (code: string) => Promise<void>
  onResendCode: () => Promise<void>
  loading: boolean
  error: string
}

export default function VerificationForm({ email, onVerify, onResendCode, loading, error }: VerificationFormProps) {
  const [code, setCode] = useState("")
  const [resending, setResending] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await onVerify(code)
  }

  const handleResend = async () => {
    setResending(true)
    await onResendCode()
    setResending(false)
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
          <Mail className="h-6 w-6 text-green-600" />
        </div>
        <CardTitle className="text-2xl font-bold text-gray-900">Verify Your Email</CardTitle>
        <CardDescription>
          We've sent a verification code to
          <br />
          <span className="font-medium text-gray-900">{email}</span>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <label htmlFor="code" className="text-sm font-medium text-gray-700">
              Verification Code
            </label>
            <Input
              id="code"
              type="text"
              placeholder="Enter 6-digit code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="text-center text-lg tracking-widest"
              maxLength={6}
              required
            />
          </div>

          <Button type="submit" className="w-full bg-green-600 hover:bg-green-700" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Verifying...
              </>
            ) : (
              <>
                <CheckCircle className="mr-2 h-4 w-4" />
                Verify Email
              </>
            )}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600 mb-2">Didn't receive the code?</p>
          <Button onClick={handleResend} variant="ghost" size="sm" disabled={resending}>
            {resending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Resending...
              </>
            ) : (
              "Resend Code"
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
