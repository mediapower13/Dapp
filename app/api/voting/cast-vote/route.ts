import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/database/db"
import { emailService } from "@/lib/utils/email"
import { CastVoteRequest } from "@/lib/database/schema"
import { ethers } from "ethers"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate request data
    const validationResult = CastVoteRequest.safeParse(body)
    if (!validationResult.success) {
      return NextResponse.json(
        { error: "Invalid request data", details: validationResult.error.errors },
        { status: 400 },
      )
    }

    const { positionId, candidateId, walletAddress } = validationResult.data

    // Verify student exists and is verified
    const student = await db.getStudentByAddress(walletAddress)
    if (!student) {
      return NextResponse.json({ error: "Student not found" }, { status: 404 })
    }

    if (!student.isVerified) {
      return NextResponse.json({ error: "Student not verified" }, { status: 403 })
    }

    // Check if student has already voted for this position
    const hasVoted = await db.hasVoted(walletAddress, positionId)
    if (hasVoted) {
      return NextResponse.json({ error: "Student has already voted for this position" }, { status: 409 })
    }

    // Verify position exists
    const position = await db.getPosition(positionId)
    if (!position || !position.isActive) {
      return NextResponse.json({ error: "Position not found or inactive" }, { status: 404 })
    }

    // Verify candidate exists and belongs to the position
    const candidate = await db.getCandidate(candidateId)
    if (!candidate || !candidate.isActive || candidate.positionId !== positionId) {
      return NextResponse.json({ error: "Candidate not found or invalid for this position" }, { status: 404 })
    }

    // Check election settings
    const electionSettings = await db.getElectionSettings()
    if (!electionSettings || !electionSettings.votingOpen) {
      return NextResponse.json({ error: "Voting is not currently open" }, { status: 403 })
    }

    const now = new Date()
    if (now < electionSettings.votingStartTime || now > electionSettings.votingEndTime) {
      return NextResponse.json({ error: "Voting is not within the allowed time period" }, { status: 403 })
    }

    // Generate mock transaction hash (in real implementation, this comes from blockchain)
    const transactionHash = ethers.utils.keccak256(
      ethers.utils.toUtf8Bytes(`${walletAddress}-${positionId}-${candidateId}-${Date.now()}`),
    )

    // Create vote record
    const vote = await db.createVote({
      voterAddress: walletAddress,
      positionId,
      candidateId,
      transactionHash,
      blockNumber: Math.floor(Math.random() * 1000000) + 2000000, // Mock block number
      timestamp: new Date(),
      voteHash: ethers.utils.keccak256(ethers.utils.toUtf8Bytes(`${walletAddress}-${positionId}-${candidateId}`)),
    })

    // Send confirmation email
    try {
      await emailService.sendVoteConfirmationEmail(
        student.email,
        `${student.firstName} ${student.lastName}`,
        transactionHash,
      )
    } catch (emailError) {
      console.error("Failed to send vote confirmation email:", emailError)
    }

    return NextResponse.json({
      success: true,
      message: "Vote cast successfully",
      vote: {
        id: vote.id,
        transactionHash: vote.transactionHash,
        blockNumber: vote.blockNumber,
        timestamp: vote.timestamp,
      },
    })
  } catch (error) {
    console.error("Cast vote error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
