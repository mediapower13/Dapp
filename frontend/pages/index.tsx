"use client"

import { useState, useEffect } from "react"
import Header from "../components/layout/header"
import LoginForm from "../components/auth/login-form"
import RegisterForm from "../components/auth/register-form"
import VerificationForm from "../components/auth/verification-form"
import Dashboard from "../components/voting/dashboard"

declare global {
  interface Window {
    ethereum?: any
  }
}

export default function Home() {
  const [currentView, setCurrentView] = useState<"login" | "register" | "verify" | "dashboard">("login")
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [walletAddress, setWalletAddress] = useState("")
  const [elections, setElections] = useState([])
  const [pendingEmail, setPendingEmail] = useState("")

  useEffect(() => {
    checkAuthStatus()
    checkWalletConnection()
  }, [])

  const checkAuthStatus = async () => {
    try {
      const token = localStorage.getItem("token")
      if (token) {
        const response = await fetch("/api/auth/me", {
          headers: { Authorization: `Bearer ${token}` },
        })
        if (response.ok) {
          const userData = await response.json()
          setUser(userData)
          setCurrentView("dashboard")
          fetchElections()
        }
      }
    } catch (error) {
      console.error("Auth check failed:", error)
    }
  }

  const checkWalletConnection = async () => {
    if (typeof window !== "undefined" && window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: "eth_accounts" })
        if (accounts.length > 0) {
          setWalletAddress(accounts[0])
        }
      } catch (error) {
        console.error("Wallet check failed:", error)
      }
    }
  }

  const connectWallet = async () => {
    if (typeof window !== "undefined" && window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: "eth_requestAccounts" })
        setWalletAddress(accounts[0])
      } catch (error) {
        console.error("Wallet connection failed:", error)
        setError("Failed to connect wallet")
      }
    } else {
      setError("MetaMask is not installed")
    }
  }

  const handleLogin = async (email: string, password: string) => {
    setLoading(true)
    setError("")

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (response.ok) {
        localStorage.setItem("token", data.token)
        setUser(data.user)
        setCurrentView("dashboard")
        fetchElections()
      } else {
        setError(data.message || "Login failed")
      }
    } catch (error) {
      setError("Network error occurred")
    } finally {
      setLoading(false)
    }
  }

  const handleRegister = async (formData: any) => {
    setLoading(true)
    setError("")

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (response.ok) {
        setPendingEmail(formData.email)
        setCurrentView("verify")
      } else {
        setError(data.message || "Registration failed")
      }
    } catch (error) {
      setError("Network error occurred")
    } finally {
      setLoading(false)
    }
  }

  const handleVerification = async (code: string) => {
    setLoading(true)
    setError("")

    try {
      const response = await fetch("/api/auth/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: pendingEmail, code }),
      })

      const data = await response.json()

      if (response.ok) {
        localStorage.setItem("token", data.token)
        setUser(data.user)
        setCurrentView("dashboard")
        fetchElections()
      } else {
        setError(data.message || "Verification failed")
      }
    } catch (error) {
      setError("Network error occurred")
    } finally {
      setLoading(false)
    }
  }

  const handleResendCode = async () => {
    try {
      await fetch("/api/auth/resend-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: pendingEmail }),
      })
    } catch (error) {
      console.error("Resend failed:", error)
    }
  }

  const fetchElections = async () => {
    try {
      const token = localStorage.getItem("token")
      const response = await fetch("/api/elections", {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (response.ok) {
        const data = await response.json()
        setElections(data)
      }
    } catch (error) {
      console.error("Failed to fetch elections:", error)
    }
  }

  const handleVote = async (electionId: string, candidateId: string) => {
    try {
      const token = localStorage.getItem("token")
      const response = await fetch("/api/voting/vote", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ electionId, candidateId, walletAddress }),
      })

      if (response.ok) {
        fetchElections()
        // Update user voting status
        setUser((prev) => ({
          ...prev,
          hasVoted: [...(prev.hasVoted || []), electionId],
        }))
      } else {
        const data = await response.json()
        setError(data.message || "Voting failed")
      }
    } catch (error) {
      setError("Voting failed")
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("token")
    setUser(null)
    setCurrentView("login")
    setWalletAddress("")
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header user={user} onLogout={handleLogout} onConnectWallet={connectWallet} walletAddress={walletAddress} />

      <main className="py-8">
        {currentView === "login" && (
          <LoginForm
            onLogin={handleLogin}
            onSwitchToRegister={() => setCurrentView("register")}
            loading={loading}
            error={error}
          />
        )}

        {currentView === "register" && (
          <RegisterForm
            onRegister={handleRegister}
            onSwitchToLogin={() => setCurrentView("login")}
            loading={loading}
            error={error}
          />
        )}

        {currentView === "verify" && (
          <VerificationForm
            email={pendingEmail}
            onVerify={handleVerification}
            onResendCode={handleResendCode}
            loading={loading}
            error={error}
          />
        )}

        {currentView === "dashboard" && user && (
          <Dashboard user={user} elections={elections} onVote={handleVote} walletConnected={!!walletAddress} />
        )}
      </main>
    </div>
  )
}
