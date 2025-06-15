"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Vote, ArrowLeft, Wallet, AlertCircle } from "lucide-react"
import WalletConnect from "@/components/wallet/wallet-connect"
import { web3Utils } from "@/lib/blockchain/web3-utils"

export default function RegisterWalletPage() {
  const router = useRouter()
  const [walletAddress, setWalletAddress] = useState<string>("")
  const [isRegistering, setIsRegistering] = useState(false)
  const [error, setError] = useState<string>("")
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    matricNumber: "",
    email: "",
    faculty: "",
    department: "",
  })

  const handleWalletConnect = (address: string) => {
    setWalletAddress(address)
    setError("")
  }

  const handleWalletDisconnect = () => {
    setWalletAddress("")
    setError("")
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (error) setError("")
  }

  const validateForm = () => {
    const errors: string[] = []

    if (!formData.firstName.trim()) errors.push("First name is required")
    if (!formData.lastName.trim()) errors.push("Last name is required")
    if (!formData.matricNumber.trim()) errors.push("Matric number is required")
    if (!formData.email.trim()) {
      errors.push("Email is required")
    } else if (!/^[0-9]{2}-[0-9]{2}[a-zA-Z]{2}[0-9]{3}@students\.unilorin\.edu\.ng$/.test(formData.email)) {
      errors.push("Please use your UNILORIN student email (format: 20-52hl077@students.unilorin.edu.ng)")
    }
    if (!formData.faculty.trim()) errors.push("Faculty is required")
    if (!formData.department.trim()) errors.push("Department is required")

    return errors
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!walletAddress) {
      setError("Please connect your wallet first")
      return
    }

    const validationErrors = validateForm()
    if (validationErrors.length > 0) {
      setError(validationErrors[0])
      return
    }

    setIsRegistering(true)
    setError("")

    try {
      // Register on blockchain
      const tx = await web3Utils.registerStudent({
        email: formData.email,
        matricNumber: formData.matricNumber,
        firstName: formData.firstName,
        lastName: formData.lastName,
        faculty: formData.faculty,
        department: formData.department,
      })

      // Wait for transaction confirmation
      await tx.wait()

      // Register in backend database
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          walletAddress,
          ...formData,
        }),
      })

      const data = await response.json()

      if (data.success) {
        // Redirect to email verification
        router.push(`/verify-email?email=${encodeURIComponent(formData.email)}`)
      } else {
        setError(data.error || "Registration failed")
      }
    } catch (error: any) {
      console.error("Registration error:", error)
      setError(error.message || "Registration failed. Please try again.")
    } finally {
      setIsRegistering(false)
    }
  }

  if (!walletAddress) {
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

          <WalletConnect onConnect={handleWalletConnect} onDisconnect={handleWalletDisconnect} />
        </div>
      </div>
    )
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
            <CardTitle className="text-2xl text-gray-900">Complete Registration</CardTitle>
            <CardDescription>
              Your wallet is connected. Please provide your student information to complete registration.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Wallet Info */}
            <div className="bg-green-50 p-3 rounded-lg mb-4 flex items-center">
              <Wallet className="h-4 w-4 text-green-600 mr-2" />
              <span className="text-sm text-green-700">
                Connected: {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
              </span>
            </div>

            {error && (
              <Alert className="mb-4 bg-red-50 border-red-200">
                <AlertCircle className="h-4 w-4 text-red-600" />
                <AlertDescription className="text-red-700">{error}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    type="text"
                    placeholder="John"
                    value={formData.firstName}
                    onChange={(e) => handleInputChange("firstName", e.target.value)}
                  />
                </div>

                <div>
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    type="text"
                    placeholder="Doe"
                    value={formData.lastName}
                    onChange={(e) => handleInputChange("lastName", e.target.value)}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="matricNumber">Matric Number</Label>
                <Input
                  id="matricNumber"
                  type="text"
                  placeholder="20/52HL077"
                  value={formData.matricNumber}
                  onChange={(e) => handleInputChange("matricNumber", e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="email">Student Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="20-52hl077@students.unilorin.edu.ng"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="faculty">Faculty</Label>
                  <Input
                    id="faculty"
                    type="text"
                    placeholder="Engineering"
                    value={formData.faculty}
                    onChange={(e) => handleInputChange("faculty", e.target.value)}
                  />
                </div>

                <div>
                  <Label htmlFor="department">Department</Label>
                  <Input
                    id="department"
                    type="text"
                    placeholder="Computer Science"
                    value={formData.department}
                    onChange={(e) => handleInputChange("department", e.target.value)}
                  />
                </div>
              </div>

              <Button type="submit" className="w-full bg-green-600 hover:bg-green-700" disabled={isRegistering}>
                {isRegistering ? "Registering..." : "Complete Registration"}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Already registered?{" "}
                <Link href="/login-wallet" className="text-green-600 hover:text-green-700 font-medium">
                  Sign in with wallet
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
