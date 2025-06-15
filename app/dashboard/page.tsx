"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Vote, Clock, CheckCircle, BarChart3, Settings, LogOut, Trophy, Users } from "lucide-react"

export default function DashboardPage() {
  const [hasVoted, setHasVoted] = useState(false)

  const positions = [
    {
      id: 1,
      title: "Student Union President",
      candidates: 3,
      voted: false,
      description: "Lead the student body and represent student interests",
    },
    {
      id: 2,
      title: "Vice President",
      candidates: 2,
      voted: false,
      description: "Support the president and oversee student activities",
    },
    {
      id: 3,
      title: "Secretary General",
      candidates: 4,
      voted: false,
      description: "Manage communications and documentation",
    },
    {
      id: 4,
      title: "Financial Secretary",
      candidates: 2,
      voted: false,
      description: "Oversee student union finances and budgets",
    },
  ]

  const stats = {
    totalVoters: 15420,
    votedCount: 8934,
    turnoutPercentage: 58,
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Vote className="h-8 w-8 text-green-600" />
              <div>
                <h1 className="text-xl font-bold text-gray-900">UNILORIN Vote</h1>
                <p className="text-sm text-gray-600">Student Union Elections 2024</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                <Clock className="h-3 w-3 mr-1" />2 days left
              </Badge>

              <div className="flex items-center space-x-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/placeholder.svg?height=32&width=32" />
                  <AvatarFallback>JD</AvatarFallback>
                </Avatar>
                <div className="hidden md:block">
                  <p className="text-sm font-medium text-gray-900">John Doe</p>
                  <p className="text-xs text-gray-600">20/52HL077</p>
                </div>
              </div>

              <Button variant="ghost" size="sm">
                <Settings className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm">
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome to Your Voting Dashboard</h2>
          <p className="text-gray-600">
            Cast your vote for the 2024 Student Union Elections. Your voice matters in shaping our university's future.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Registered Voters</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalVoters.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">Eligible UNILORIN students</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Votes Cast</CardTitle>
              <Vote className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.votedCount.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">Students have voted</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Voter Turnout</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.turnoutPercentage}%</div>
              <Progress value={stats.turnoutPercentage} className="mt-2" />
            </CardContent>
          </Card>
        </div>

        {/* Voting Status */}
        {!hasVoted && (
          <Card className="mb-8 border-orange-200 bg-orange-50">
            <CardContent className="pt-6">
              <div className="flex items-center space-x-3">
                <Clock className="h-6 w-6 text-orange-600" />
                <div>
                  <h3 className="font-semibold text-orange-900">Action Required</h3>
                  <p className="text-orange-700">
                    You haven't cast your vote yet. Don't miss your chance to make your voice heard!
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Positions to Vote */}
        <div className="grid gap-6 mb-8">
          <h3 className="text-2xl font-bold text-gray-900">Available Positions</h3>

          {positions.map((position) => (
            <Card key={position.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg">{position.title}</CardTitle>
                    <CardDescription className="mt-1">{position.description}</CardDescription>
                  </div>
                  <div className="text-right">
                    <Badge variant="secondary" className="mb-2">
                      {position.candidates} candidates
                    </Badge>
                    {position.voted ? (
                      <div className="flex items-center text-green-600">
                        <CheckCircle className="h-4 w-4 mr-1" />
                        <span className="text-sm">Voted</span>
                      </div>
                    ) : (
                      <Badge variant="outline" className="text-orange-600 border-orange-600">
                        Pending
                      </Badge>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center">
                  <p className="text-sm text-gray-600">Choose from {position.candidates} qualified candidates</p>
                  <Link href={`/vote/${position.id}`}>
                    <Button className="bg-green-600 hover:bg-green-700" disabled={position.voted}>
                      {position.voted ? "Vote Cast" : "Vote Now"}
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <BarChart3 className="h-5 w-5 mr-2 text-blue-600" />
                View Results
              </CardTitle>
              <CardDescription>Check real-time election results and statistics</CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/results">
                <Button variant="outline" className="w-full">
                  View Live Results
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Trophy className="h-5 w-5 mr-2 text-yellow-600" />
                Candidate Profiles
              </CardTitle>
              <CardDescription>Learn about candidates and their manifestos</CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/candidates">
                <Button variant="outline" className="w-full">
                  View Candidates
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
