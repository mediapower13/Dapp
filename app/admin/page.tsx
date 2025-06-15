"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import {
  Users,
  Vote,
  TrendingUp,
  Clock,
  Shield,
  Settings,
  UserCheck,
  Play,
  Square,
  Plus,
  AlertCircle,
} from "lucide-react"
import { useAuth } from "@/components/auth/wallet-auth"
import { adminAuth } from "@/lib/auth/admin"
import type { VotingAnalytics } from "@/lib/analytics/vote-analytics"

export default function AdminDashboard() {
  const { walletAddress, isAuthenticated } = useAuth()
  const [isAdmin, setIsAdmin] = useState(false)
  const [analytics, setAnalytics] = useState<VotingAnalytics | null>(null)
  const [realtimeStats, setRealtimeStats] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    if (walletAddress) {
      setIsAdmin(adminAuth.isAdmin(walletAddress))
      if (adminAuth.isAdmin(walletAddress)) {
        loadAnalytics()
        loadRealtimeStats()

        // Set up real-time updates
        const interval = setInterval(loadRealtimeStats, 30000) // Update every 30 seconds
        return () => clearInterval(interval)
      }
    }
  }, [walletAddress])

  const loadAnalytics = async () => {
    try {
      const response = await fetch(`/api/admin/analytics?admin=${walletAddress}`)
      const data = await response.json()

      if (data.success) {
        setAnalytics(data.analytics)
      } else {
        setError(data.error)
      }
    } catch (error) {
      setError("Failed to load analytics")
    }
  }

  const loadRealtimeStats = async () => {
    try {
      const response = await fetch(`/api/admin/realtime-stats?admin=${walletAddress}`)
      const data = await response.json()

      if (data.success) {
        setRealtimeStats(data.stats)
      }
    } catch (error) {
      console.error("Failed to load realtime stats:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleElectionAction = async (action: string, data?: any) => {
    try {
      const response = await fetch("/api/admin/manage-election", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action,
          walletAddress,
          ...data,
        }),
      })

      const result = await response.json()

      if (result.success) {
        // Refresh data
        await loadAnalytics()
        await loadRealtimeStats()
      } else {
        setError(result.error)
      }
    } catch (error) {
      setError("Action failed")
    }
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <Shield className="h-12 w-12 text-red-600 mx-auto mb-4" />
            <CardTitle>Authentication Required</CardTitle>
            <CardDescription>Please connect your wallet to access the admin dashboard</CardDescription>
          </CardHeader>
        </Card>
      </div>
    )
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <Shield className="h-12 w-12 text-red-600 mx-auto mb-4" />
            <CardTitle>Access Denied</CardTitle>
            <CardDescription>You don't have admin privileges to access this dashboard</CardDescription>
          </CardHeader>
        </Card>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading admin dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Shield className="h-8 w-8 text-blue-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
                <p className="text-sm text-gray-600">UNILORIN Voting System Administration</p>
              </div>
            </div>
            <Badge className="bg-green-100 text-green-800">
              Admin: {walletAddress?.slice(0, 6)}...{walletAddress?.slice(-4)}
            </Badge>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {error && (
          <Alert className="mb-6 bg-red-50 border-red-200">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-700">{error}</AlertDescription>
          </Alert>
        )}

        {/* Real-time Stats */}
        {realtimeStats && (
          <div className="grid md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Votes</CardTitle>
                <Vote className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{realtimeStats.totalVotes}</div>
                <p className="text-xs text-muted-foreground">Votes cast</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Unique Voters</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{realtimeStats.uniqueVoters}</div>
                <p className="text-xs text-muted-foreground">Students voted</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Top Candidate</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-lg font-bold">{realtimeStats.topCandidates[0]?.name || "N/A"}</div>
                <p className="text-xs text-muted-foreground">{realtimeStats.topCandidates[0]?.votes || 0} votes</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">System Status</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-lg font-bold text-green-600">Active</div>
                <p className="text-xs text-muted-foreground">All systems operational</p>
              </CardContent>
            </Card>
          </div>
        )}

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="manage">Manage</TabsTrigger>
            <TabsTrigger value="students">Students</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {analytics && (
              <>
                {/* Turnout Overview */}
                <Card>
                  <CardHeader>
                    <CardTitle>Election Overview</CardTitle>
                    <CardDescription>Current election statistics and turnout</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Voter Turnout</span>
                        <span className="text-sm text-gray-600">{analytics.turnoutRate.toFixed(1)}%</span>
                      </div>
                      <Progress value={analytics.turnoutRate} className="h-2" />

                      <div className="grid grid-cols-2 gap-4 mt-4">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-blue-600">{analytics.uniqueVoters}</div>
                          <div className="text-sm text-gray-600">Voters</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-green-600">{analytics.totalVotes}</div>
                          <div className="text-sm text-gray-600">Total Votes</div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Position Results */}
                <Card>
                  <CardHeader>
                    <CardTitle>Position Results</CardTitle>
                    <CardDescription>Current standings for each position</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {analytics.votesByPosition.map((position) => (
                        <div key={position.positionId} className="border-b pb-4 last:border-b-0">
                          <h4 className="font-semibold text-lg mb-2">{position.positionTitle}</h4>
                          <div className="space-y-2">
                            {position.candidates.slice(0, 3).map((candidate, index) => (
                              <div key={candidate.id} className="flex items-center justify-between">
                                <div className="flex items-center space-x-2">
                                  {index === 0 && <Badge className="bg-yellow-100 text-yellow-800">Leading</Badge>}
                                  <span className="font-medium">{candidate.name}</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <span className="text-sm text-gray-600">{candidate.votes} votes</span>
                                  <span className="text-sm font-medium">{candidate.percentage.toFixed(1)}%</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </>
            )}
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            {analytics && (
              <>
                {/* Faculty Breakdown */}
                <Card>
                  <CardHeader>
                    <CardTitle>Faculty Participation</CardTitle>
                    <CardDescription>Voting turnout by faculty</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {analytics.votesByFaculty.map((faculty) => (
                        <div key={faculty.faculty} className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="font-medium">{faculty.faculty}</span>
                            <span className="text-sm text-gray-600">
                              {faculty.votedCount}/{faculty.totalVoters} ({faculty.turnoutRate.toFixed(1)}%)
                            </span>
                          </div>
                          <Progress value={faculty.turnoutRate} className="h-2" />
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Candidate Performance */}
                <Card>
                  <CardHeader>
                    <CardTitle>Candidate Performance</CardTitle>
                    <CardDescription>Detailed performance metrics for all candidates</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {analytics.candidatePerformance.map((candidate) => (
                        <div key={candidate.candidateId} className="border rounded-lg p-4">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <h4 className="font-semibold">{candidate.candidateName}</h4>
                              <p className="text-sm text-gray-600">{candidate.positionTitle}</p>
                            </div>
                            <div className="text-right">
                              <div className="text-lg font-bold">{candidate.totalVotes}</div>
                              <div className="text-sm text-gray-600">{candidate.percentage.toFixed(1)}%</div>
                            </div>
                          </div>

                          {candidate.facultyBreakdown.length > 0 && (
                            <div className="mt-3">
                              <p className="text-sm font-medium mb-2">Faculty Breakdown:</p>
                              <div className="grid grid-cols-2 gap-2 text-sm">
                                {candidate.facultyBreakdown.slice(0, 4).map((faculty) => (
                                  <div key={faculty.faculty} className="flex justify-between">
                                    <span>{faculty.faculty}:</span>
                                    <span>{faculty.votes} votes</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </>
            )}
          </TabsContent>

          <TabsContent value="manage" className="space-y-6">
            {/* Election Controls */}
            <Card>
              <CardHeader>
                <CardTitle>Election Controls</CardTitle>
                <CardDescription>Start, stop, and manage the election process</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex space-x-4">
                  <Button
                    onClick={() => handleElectionAction("start_voting", { duration: 72 })}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <Play className="h-4 w-4 mr-2" />
                    Start Voting (72h)
                  </Button>

                  <Button onClick={() => handleElectionAction("end_voting")} variant="destructive">
                    <Square className="h-4 w-4 mr-2" />
                    End Voting
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Add Candidate */}
            <Card>
              <CardHeader>
                <CardTitle>Add New Candidate</CardTitle>
                <CardDescription>Add candidates to existing positions</CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Candidate
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="students" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Student Management</CardTitle>
                <CardDescription>Verify and manage student registrations</CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="bg-purple-600 hover:bg-purple-700">
                  <UserCheck className="h-4 w-4 mr-2" />
                  Verify Students
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>System Settings</CardTitle>
                <CardDescription>Configure election parameters and system settings</CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline">
                  <Settings className="h-4 w-4 mr-2" />
                  Configure Settings
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
