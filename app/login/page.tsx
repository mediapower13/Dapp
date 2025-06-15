"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Vote, ArrowLeft, Mail, Lock, AlertCircle } from "lucide-react"

export default function LoginPage() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isLoading, setIsLoading] = useState(false)
  const [loginError, setLoginError] = useState("")

  const validateEmail = (email: string) => {
    const emailRegex = /^[0-9]{2}-[0-9]{2}[a-zA-Z]{2}[0-9]{3}@students\.unilorin\.edu\.ng$/
    return emailRegex.test(email)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrors({})
    setLoginError("")
    setIsLoading(true)

    // Validation
    const newErrors: Record<string, string> = {}

    if (!formData.email.trim()) {
      newErrors.email = "Email is required"
    } else if (!validateEmail(formData.email)) {
      newErrors.email = "Please use your UNILORIN student email"
    }
    if (!formData.password) {
      newErrors.password = "Password is required"
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      setIsLoading(false)
      return
    }

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
      // Simulate login success/failure
      if (formData.email === "test@students.unilorin.edu.ng" && formData.password === "password") {
        window.location.href = "/dashboard"
      } else {
        setLoginError("Invalid email or password. Please try again.")
      }
    }, 2000)
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }
    if (loginError) {
      setLoginError("")
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 py-8 px-4">
      <div className="container mx-auto max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center text-green-600 hover:text-green-700 mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Link>
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Vote className="h-8 w-8 text-green-600" />
            <h1 className="text-2xl font-bold text-gray-900">UNILORIN Vote</h1>
          </div>
        </div>

        <Card className="shadow-xl border-0">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl text-gray-900">Welcome Back</CardTitle>
            <CardDescription>Sign in to your account to participate in elections</CardDescription>
          </CardHeader>
          <CardContent>
            {loginError && (
              <Alert className="mb-4 bg-red-50 border-red-200">
                <AlertCircle className="h-4 w-4 text-red-600" />
                <AlertDescription className="text-red-700">{loginError}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="email">Student Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="20-52hl077@students.unilorin.edu.ng"
                    className="pl-10"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                  />
                </div>
                {errors.email && <p className="text-sm text-red-600 mt-1">{errors.email}</p>}
              </div>

              <div>
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    className="pl-10"
                    value={formData.password}
                    onChange={(e) => handleInputChange("password", e.target.value)}
                  />
                </div>
                {errors.password && <p className="text-sm text-red-600 mt-1">{errors.password}</p>}
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <input
                    id="remember"
                    type="checkbox"
                    className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                    aria-label="Remember me"
                  />
                  <Label htmlFor="remember" className="text-sm text-gray-600">
                    Remember me
                  </Label>
                </div>
                <Link href="/forgot-password" className="text-sm text-green-600 hover:text-green-700">
                  Forgot password?
                </Link>
              </div>

              <Button type="submit" className="w-full bg-green-600 hover:bg-green-700" disabled={isLoading}>
                {isLoading ? "Signing In..." : "Sign In"}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Don't have an account?{" "}
                <Link href="/register" className="text-green-600 hover:text-green-700 font-medium">
                  Register here
                </Link>
              </p>
            </div>

            <div className="mt-4">
              <Alert className="bg-gray-50 border-gray-200">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription className="text-sm">
                  <strong>Demo credentials:</strong>
                  <br />
                  Email: test@students.unilorin.edu.ng
                  <br />
                  Password: password
                </AlertDescription>
              </Alert>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
