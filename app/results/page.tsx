"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Vote, ArrowLeft, Trophy, Users, BarChart3, TrendingUp, Clock } from "lucide-react"

export default function ResultsPage() {
  const [selectedPosition, setSelectedPosition] = useState("president")

  const electionStats = {
    totalVoters: 15420,
    votedCount: 12847,
    turnoutPercentage: 83.3,
    timeRemaining: "1 day, 14 hours",
  }

  const positions = {
    president: {
      title: "Student Union President",
      totalVotes: 12847,
      candidates: [
        {
          id: "1",
          name: "Adebayo Johnson",
          votes: 5234,
          percentage: 40.7,
          image: "/placeholder.svg?height=60&width=60",
        },
        {
          id: "2",
          name: "Fatima Abdullahi",
          votes: 4892,
          percentage: 38.1,
          image: "/placeholder.svg?height=60&width=60",
        },
        {
          id: "3",
          name: "Chukwuma Okafor",
          votes: 2721,
          percentage: 21.2,
          image: "/placeholder.svg?height=60&width=60",
        },
      ],
    },
    vicePresident: {
      title: "Vice President",
      totalVotes: 12847,
      candidates: [
        {
          id: "1",
          name: "Aisha Mohammed",
          votes: 7234,
          percentage: 56.3,
          image: "/placeholder.svg?height=60&width=60",
        },
        {
          id: "2",
          name: "Emmanuel Okafor",
          votes: 5613,
          percentage: 43.7,
          image: "/placeholder.svg?height=60&width=60",
        },
      ],
    },
    secretary: {
      title: "Secretary General",
      totalVotes: 12847,
      candidates: [
        {
          id: "1",
          name: "Grace Adebayo",
          votes: 4234,
          percentage: 33.0,
          image: "/placeholder.svg?height=60&width=60",
        },
        {
          id: "2",
          name: "Ibrahim Yusuf",
          votes: 3892,
          percentage: 30.3,
          image: "/placeholder.svg?height=60&width=60",
        },
        {
          id: "3",
          name: "Blessing Okoro",
          votes: 2934,
          percentage: 22.8,
          image: "/placeholder.svg?height=60&width=60",
        },
        {
          id: "4",
          name: "David Adamu",
          votes: 1787,
          percentage: 13.9,
          image: "/placeholder.svg?height=60&width=60",
        },
      ],
    },
    financial: {
      title: "Financial Secretary",
      totalVotes: 12847,
      candidates: [
        {
          id: "1",
          name: "Kemi Oladele",
          votes: 7123,
          percentage: 55.4,
          image: "/placeholder.svg?height=60&width=60",
        },
        {
          id: "2",
          name: "Ahmed Bello",
          votes: 5724,
          percentage: 44.6,
          image: "/placeholder.svg?height=60&width=60",
        },
      ],
    },
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/dashboard" className="flex items-center text-green-600 hover:text-green-700">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Link>
            <div className="flex items-center space-x-2">
              <Vote className="h-6 w-6 text-green-600" />
              <span className="font-semibold text-gray-900">UNILORIN Vote - Results</span>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Live Election Results</h1>
          <p className="text-lg text-gray-600 mb-6">Real-time results from the UNILORIN Student Union Elections 2024</p>
          <Badge className="bg-green-100 text-green-800 text-sm px-3 py-1">
            <Clock className="h-4 w-4 mr-1" />
            {electionStats.timeRemaining} remaining
          </Badge>
        </div>

        {/* Stats Overview */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Voters</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{electionStats.totalVoters.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">Registered students</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Votes Cast</CardTitle>
              <Vote className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{electionStats.votedCount.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">Students voted</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Turnout</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{electionStats.turnoutPercentage}%</div>
              <Progress value={electionStats.turnoutPercentage} className="mt-2" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Status</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">Live</div>
              <p className="text-xs text-muted-foreground">Updating in real-time</p>
            </CardContent>
          </Card>
        </div>

        {/* Results by Position */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl">Results by Position</CardTitle>
            <CardDescription>Click on different positions to view detailed results</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={selectedPosition} onValueChange={setSelectedPosition}>
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="president">President</TabsTrigger>
                <TabsTrigger value="vicePresident">Vice President</TabsTrigger>
                <TabsTrigger value="secretary">Secretary</TabsTrigger>
                <TabsTrigger value="financial">Financial Sec.</TabsTrigger>
              </TabsList>

              {Object.entries(positions).map(([key, position]) => (
                <TabsContent key={key} value={key} className="mt-6">
                  <div className="mb-4">
                    <h3 className="text-xl font-semibold text-gray-900">{position.title}</h3>
                    <p className="text-gray-600">Total votes: {position.totalVotes.toLocaleString()}</p>
                  </div>

                  <div className="space-y-4">
                    {position.candidates
                      .sort((a, b) => b.votes - a.votes)
                      .map((candidate, index) => (
                        <Card key={candidate.id} className={`${index === 0 ? "border-yellow-300 bg-yellow-50" : ""}`}>
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-4">
                                {index === 0 && <Trophy className="h-6 w-6 text-yellow-600" />}
                                <Avatar className="h-12 w-12">
                                  <AvatarImage src={candidate.image || "/placeholder.svg"} />
                                  <AvatarFallback>
                                    {candidate.name
                                      .split(" ")
                                      .map((n) => n[0])
                                      .join("")}
                                  </AvatarFallback>
                                </Avatar>
                                <div>
                                  <h4 className="font-semibold text-gray-900">
                                    {candidate.name}
                                    {index === 0 && (
                                      <Badge className="ml-2 bg-yellow-100 text-yellow-800">Leading</Badge>
                                    )}
                                  </h4>
                                  <p className="text-sm text-gray-600">
                                    {candidate.votes.toLocaleString()} votes ({candidate.percentage}%)
                                  </p>
                                </div>
                              </div>
                              <div className="text-right min-w-0 flex-1 ml-4">
                                <div className="text-lg font-bold text-gray-900">{candidate.percentage}%</div>
                                <Progress value={candidate.percentage} className="mt-2 w-32" />
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          </CardContent>
        </Card>

        {/* Additional Info */}
        <div className="mt-8 grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Blockchain Verification</CardTitle>
              <CardDescription>All votes are recorded on the blockchain for transparency</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <p>
                  <strong>Latest Block:</strong> #2,847,456
                </p>
                <p>
                  <strong>Total Transactions:</strong> 12,847
                </p>
                <p>
                  <strong>Network Status:</strong> <span className="text-green-600">Active</span>
                </p>
                <Button variant="outline" className="mt-4">
                  View on Blockchain Explorer
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Election Timeline</CardTitle>
              <CardDescription>Key dates and milestones</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span>Registration Opens</span>
                  <span className="text-gray-600">March 1, 2024</span>
                </div>
                <div className="flex justify-between">
                  <span>Voting Begins</span>
                  <span className="text-gray-600">March 15, 2024</span>
                </div>
                <div className="flex justify-between">
                  <span>Voting Ends</span>
                  <span className="text-gray-600">March 17, 2024</span>
                </div>
                <div className="flex justify-between">
                  <span>Results Announcement</span>
                  <span className="text-green-600">March 18, 2024</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
