import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/database/db"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const walletAddress = searchParams.get("address")

    if (!walletAddress) {
      return NextResponse.json({ error: "Wallet address is required" }, { status: 400 })
    }

    // Get student profile
    const student = await db.getStudentByAddress(walletAddress)
    if (!student) {
      return NextResponse.json({ error: "Student not found" }, { status: 404 })
    }

    // Get student's votes
    const votes = await db.getVotesByVoter(walletAddress)

    // Get voted positions with details
    const votedPositions = await Promise.all(
      votes.map(async (vote) => {
        const position = await db.getPosition(vote.positionId)
        const candidate = await db.getCandidate(vote.candidateId)

        return {
          positionId: vote.positionId,
          positionTitle: position?.title || "Unknown Position",
          candidateId: vote.candidateId,
          candidateName: candidate?.name || "Unknown Candidate",
          timestamp: vote.timestamp,
          transactionHash: vote.transactionHash,
        }
      }),
    )

    return NextResponse.json({
      success: true,
      student: {
        walletAddress: student.walletAddress,
        email: student.email,
        firstName: student.firstName,
        lastName: student.lastName,
        matricNumber: student.matricNumber,
        faculty: student.faculty,
        department: student.department,
        isVerified: student.isVerified,
        registrationTime: student.registrationTime,
        lastLogin: student.lastLogin,
      },
      votingHistory: votedPositions,
    })
  } catch (error) {
    console.error("Get profile error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
