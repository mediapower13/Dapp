"use client"

import { useState } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Vote, ArrowLeft, User, GraduationCap, MapPin, AlertTriangle } from "lucide-react"

export default function VotePage() {
  const params = useParams()
  const positionId = params.id

  const [selectedCandidate, setSelectedCandidate] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showConfirmation, setShowConfirmation] = useState(false)

  // Mock data - in real app, this would come from API
  const position = {
    id: positionId,
    title: "Student Union President",
    description: "Lead the student body and represent student interests",
  }

  const candidates = [
    {
      id: "1",
      name: "Adebayo Johnson",
      matricNumber: "20/52HL089",
      faculty: "Engineering",
      department: "Computer Science",
      level: "400 Level",
      manifesto:
        "Committed to improving student welfare, enhancing campus facilities, and bridging the gap between students and administration.",
      experience: "Former Class Representative, Debate Club President",
      image: "/placeholder.svg?height=100&width=100",
    },
    {
      id: "2",
      name: "Fatima Abdullahi",
      matricNumber: "20/52HL045",
      faculty: "Social Sciences",
      department: "Political Science",
      level: "400 Level",
      manifesto:
        "Focused on academic excellence, student rights advocacy, and creating more opportunities for student engagement.",
      experience: "Student Representative Council Member, Volunteer Coordinator",
      image: "/placeholder.svg?height=100&width=100",
    },
    {
      id: "3",
      name: "Chukwuma Okafor",
      matricNumber: "20/52HL123",
      faculty: "Management Sciences",
      department: "Business Administration",
      level: "400 Level",
      manifesto:
        "Dedicated to financial transparency, infrastructure development, and fostering innovation in student activities.",
      experience: "Finance Committee Member, Entrepreneurship Club Leader",
      image: "/placeholder.svg?height=100&width=100",
    },
  ]

  const handleSubmit = () => {
    if (!selectedCandidate) return
    setShowConfirmation(true)
  }

  const confirmVote = async () => {
    setIsSubmitting(true)

    // Simulate blockchain transaction
    setTimeout(() => {
      setIsSubmitting(false)
      // Redirect to success page
      window.location.href = "/vote-success"
    }, 3000)
  }

  if (showConfirmation) {
    const candidate = candidates.find((c) => c.id === selectedCandidate)

    return (
      <div className="min-h-screen bg-gray-50 py-8 px-4">
        <div className="container mx-auto max-w-2xl">
          <Card className="shadow-xl border-0">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 p-3 bg-orange-100 rounded-full w-fit">
                <AlertTriangle className="h-8 w-8 text-orange-600" />
              </div>
              <CardTitle className="text-2xl text-gray-900">Confirm Your Vote</CardTitle>
              <CardDescription>
                Please review your selection before submitting. This action cannot be undone.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-2">Position</h3>
                <p className="text-gray-700">{position.title}</p>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-2">Your Selected Candidate</h3>
                <div className="flex items-center space-x-3">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={candidate?.image || "/placeholder.svg"} />
                    <AvatarFallback>
                      {candidate?.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium text-gray-900">{candidate?.name}</p>
                    <p className="text-sm text-gray-600">{candidate?.matricNumber}</p>
                  </div>
                </div>
              </div>

              <Alert className="bg-red-50 border-red-200">
                <AlertTriangle className="h-4 w-4 text-red-600" />
                <AlertDescription className="text-red-700">
                  <strong>Important:</strong> Once you submit your vote, it will be recorded on the blockchain and
                  cannot be changed or reversed.
                </AlertDescription>
              </Alert>

              <div className="flex space-x-4">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setShowConfirmation(false)}
                  disabled={isSubmitting}
                >
                  Go Back
                </Button>
                <Button
                  className="flex-1 bg-green-600 hover:bg-green-700"
                  onClick={confirmVote}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Recording Vote..." : "Confirm Vote"}
                </Button>
              </div>

              {isSubmitting && (
                <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto mb-2"></div>
                  <p className="text-sm text-gray-600">Recording your vote on the blockchain...</p>
                </div>
              )}
            </CardContent>
          </Card>
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
            <Link href="/dashboard" className="flex items-center text-green-600 hover:text-green-700">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Link>
            <div className="flex items-center space-x-2">
              <Vote className="h-6 w-6 text-green-600" />
              <span className="font-semibold text-gray-900">UNILORIN Vote</span>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Position Info */}
        <div className="mb-8">
          <Badge className="mb-2 bg-green-100 text-green-800">Voting in Progress</Badge>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{position.title}</h1>
          <p className="text-gray-600">{position.description}</p>
        </div>

        {/* Candidates */}
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Select Your Candidate</h2>

          <RadioGroup value={selectedCandidate} onValueChange={setSelectedCandidate}>
            <div className="space-y-6">
              {candidates.map((candidate) => (
                <Card
                  key={candidate.id}
                  className={`cursor-pointer transition-all hover:shadow-md ${
                    selectedCandidate === candidate.id ? "ring-2 ring-green-500 bg-green-50" : ""
                  }`}
                >
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-4">
                      <RadioGroupItem value={candidate.id} id={candidate.id} className="mt-1" />
                      <Label htmlFor={candidate.id} className="flex-1 cursor-pointer">
                        <div className="flex items-start space-x-4">
                          <Avatar className="h-16 w-16">
                            <AvatarImage src={candidate.image || "/placeholder.svg"} />
                            <AvatarFallback className="text-lg">
                              {candidate.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>

                          <div className="flex-1">
                            <h3 className="text-xl font-semibold text-gray-900 mb-1">{candidate.name}</h3>

                            <div className="flex flex-wrap gap-4 mb-3 text-sm text-gray-600">
                              <div className="flex items-center">
                                <User className="h-4 w-4 mr-1" />
                                {candidate.matricNumber}
                              </div>
                              <div className="flex items-center">
                                <GraduationCap className="h-4 w-4 mr-1" />
                                {candidate.level}
                              </div>
                              <div className="flex items-center">
                                <MapPin className="h-4 w-4 mr-1" />
                                {candidate.faculty}
                              </div>
                            </div>

                            <p className="text-gray-700 mb-2">
                              <strong>Department:</strong> {candidate.department}
                            </p>

                            <p className="text-gray-700 mb-2">
                              <strong>Experience:</strong> {candidate.experience}
                            </p>

                            <p className="text-gray-700">
                              <strong>Manifesto:</strong> {candidate.manifesto}
                            </p>
                          </div>
                        </div>
                      </Label>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </RadioGroup>

          {/* Submit Button */}
          <div className="mt-8 text-center">
            <Button
              onClick={handleSubmit}
              disabled={!selectedCandidate}
              className="bg-green-600 hover:bg-green-700 px-8 py-3 text-lg"
            >
              Cast Your Vote
            </Button>

            {!selectedCandidate && <p className="text-sm text-gray-500 mt-2">Please select a candidate to continue</p>}
          </div>
        </div>
      </div>
    </div>
  )
}
