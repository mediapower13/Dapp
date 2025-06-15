"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Vote, Users, Clock, CheckCircle, AlertCircle } from "lucide-react"

interface DashboardProps {
  user: any
  elections: any[]
  onVote: (electionId: string, candidateId: string) => Promise<void>
  walletConnected: boolean
}

export default function Dashboard({ user, elections, onVote, walletConnected }: DashboardProps) {
  const [voting, setVoting] = useState<string | null>(null)

  const handleVote = async (electionId: string, candidateId: string) => {
    if (!walletConnected) {
      alert("Please connect your wallet first")
      return
    }

    setVoting(candidateId)
    try {
      await onVote(electionId, candidateId)
    } finally {
      setVoting(null)
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Welcome, {user?.firstName} {user?.lastName}
        </h1>
        <p className="text-gray-600">University of Ilorin Student Union Elections 2024</p>
      </div>

      {!walletConnected && (
        <div className="mb-6">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-center">
              <AlertCircle className="h-5 w-5 text-yellow-600 mr-2" />
              <p className="text-yellow-800">Please connect your MetaMask wallet to participate in voting</p>
            </div>
          </div>
        </div>
      )}

      <div className="grid gap-6">
        {elections.map((election) => (
          <Card key={election._id} className="overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-green-50 to-blue-50">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-xl text-gray-900">{election.title}</CardTitle>
                  <CardDescription className="mt-1">{election.description}</CardDescription>
                </div>
                <Badge variant={election.status === "active" ? "default" : "secondary"}>{election.status}</Badge>
              </div>

              <div className="flex items-center space-x-4 mt-4 text-sm text-gray-600">
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-1" />
                  Ends: {new Date(election.endDate).toLocaleDateString()}
                </div>
                <div className="flex items-center">
                  <Users className="h-4 w-4 mr-1" />
                  {election.totalVotes || 0} votes cast
                </div>
              </div>
            </CardHeader>

            <CardContent className="p-6">
              <div className="grid gap-4">
                {election.candidates?.map((candidate: any) => (
                  <div key={candidate._id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                          {candidate.name.charAt(0)}
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">{candidate.name}</h3>
                          <p className="text-sm text-gray-600">{candidate.position}</p>
                        </div>
                      </div>

                      {election.status === "active" && walletConnected && (
                        <Button
                          onClick={() => handleVote(election._id, candidate._id)}
                          disabled={voting === candidate._id || user.hasVoted?.includes(election._id)}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          {voting === candidate._id ? (
                            "Voting..."
                          ) : user.hasVoted?.includes(election._id) ? (
                            <>
                              <CheckCircle className="h-4 w-4 mr-2" />
                              Voted
                            </>
                          ) : (
                            <>
                              <Vote className="h-4 w-4 mr-2" />
                              Vote
                            </>
                          )}
                        </Button>
                      )}
                    </div>

                    {candidate.manifesto && <p className="text-sm text-gray-700 mb-3">{candidate.manifesto}</p>}

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Votes</span>
                        <span className="font-medium">{candidate.votes || 0}</span>
                      </div>
                      <Progress
                        value={election.totalVotes ? ((candidate.votes || 0) / election.totalVotes) * 100 : 0}
                        className="h-2"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {elections.length === 0 && (
        <div className="text-center py-12">
          <Vote className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Active Elections</h3>
          <p className="text-gray-600">There are currently no elections available for voting.</p>
        </div>
      )}
    </div>
  )
}
