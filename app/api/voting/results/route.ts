import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/database/db"

export async function GET(request: NextRequest) {
  try {
    // Get all positions
    const positions = await db.getAllPositions()
    const activePositions = positions.filter((p) => p.isActive)

    // Get results for each position
    const results = await Promise.all(
      activePositions.map(async (position) => {
        const candidates = await db.getCandidatesByPosition(position.id!)
        const votes = await db.getVotesByPosition(position.id!)

        const totalVotes = votes.length

        const candidateResults = candidates.map((candidate) => ({
          id: candidate.id,
          name: candidate.name,
          matricNumber: candidate.matricNumber,
          faculty: candidate.faculty,
          department: candidate.department,
          voteCount: candidate.voteCount,
          percentage: totalVotes > 0 ? ((candidate.voteCount / totalVotes) * 100).toFixed(1) : "0.0",
        }))

        // Sort by vote count (descending)
        candidateResults.sort((a, b) => b.voteCount - a.voteCount)

        return {
          position: {
            id: position.id,
            title: position.title,
            description: position.description,
          },
          totalVotes,
          candidates: candidateResults,
        }
      }),
    )

    // Get overall statistics
    const allVotes = await db.getAllVotes()
    const allStudents = await db.getAllStudents()
    const verifiedStudents = allStudents.filter((s) => s.isVerified)

    const stats = {
      totalRegisteredVoters: verifiedStudents.length,
      totalVotesCast: allVotes.length,
      uniqueVoters: new Set(allVotes.map((v) => v.voterAddress)).size,
      turnoutPercentage:
        verifiedStudents.length > 0
          ? ((new Set(allVotes.map((v) => v.voterAddress)).size / verifiedStudents.length) * 100).toFixed(1)
          : "0.0",
    }

    // Get election settings
    const electionSettings = await db.getElectionSettings()

    return NextResponse.json({
      success: true,
      results,
      stats,
      electionSettings,
    })
  } catch (error) {
    console.error("Get results error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
