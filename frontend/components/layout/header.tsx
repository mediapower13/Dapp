"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Wallet, LogOut, User, Vote } from "lucide-react"

interface HeaderProps {
  user?: any
  onLogout: () => void
  onConnectWallet: () => void
  walletAddress?: string
}

export default function Header({ user, onLogout, onConnectWallet, walletAddress }: HeaderProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Vote className="h-8 w-8 text-green-600" />
              <div>
                <h1 className="text-xl font-bold text-gray-900">UniVote</h1>
                <p className="text-xs text-gray-500">University of Ilorin</p>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {user && (
              <div className="flex items-center space-x-2 text-sm text-gray-700">
                <User className="h-4 w-4" />
                <span>{user.email}</span>
              </div>
            )}

            {walletAddress ? (
              <div className="flex items-center space-x-2 bg-green-50 px-3 py-1 rounded-full">
                <Wallet className="h-4 w-4 text-green-600" />
                <span className="text-sm text-green-700">
                  {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
                </span>
              </div>
            ) : (
              <Button onClick={onConnectWallet} variant="outline" size="sm">
                <Wallet className="h-4 w-4 mr-2" />
                Connect Wallet
              </Button>
            )}

            {user && (
              <Button onClick={onLogout} variant="ghost" size="sm">
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
