import { type NextRequest, NextResponse } from "next/server"
import { adminAuth } from "@/lib/auth/admin"
import { db } from "@/lib/database/db"
import { notificationService } from "@/lib/utils/notifications"

export async function POST(request: NextRequest) {
  try {
    const { action, walletAddress, ...data } = await request.json()

    if (!walletAddress || !adminAuth.isAdmin(walletAddress)) {
      return NextResponse.json({ error: "Unauthorized - Admin access required" }, { status: 403 })
    }

    switch (action) {
      case "start_voting": {
        const { duration } = data
        const startTime = new Date()
        const endTime = new Date(startTime.getTime() + duration * 60 * 60 * 1000) // duration in hours

        await db.updateElectionSettings({
          votingStartTime: startTime,
          votingEndTime: endTime,
          registrationOpen: false,
          votingOpen: true,
          title: "UNILORIN Student Union Elections 2024",
          createdAt: new Date(),
          updatedAt: new Date(),
        })

        // Create notification
        notificationService.electionStartNotification()

        return NextResponse.json({
          success: true,
          message: "Voting started successfully",
          startTime,
          endTime,
        })
      }

      case "end_voting": {
        const settings = await db.getElectionSettings()
        if (settings) {
          await db.updateElectionSettings({
            ...settings,
            votingOpen: false,
            votingEndTime: new Date(),
            updatedAt: new Date(),
          })
        }

        // Create notification
        notificationService.electionEndNotification()

        return NextResponse.json({
          success: true,
          message: "Voting ended successfully",
        })
      }

      case "add_candidate": {
        const { name, matricNumber, faculty, department, level, manifesto, experience, positionId } = data

        const candidate = await db.createCandidate({
          name,
          matricNumber,
          faculty,
          department,
          level,
          manifesto,
          experience,
          positionId,
          voteCount: 0,
          isActive: true,
          createdAt: new Date(),
        })

        return NextResponse.json({
          success: true,
          message: "Candidate added successfully",
          candidate,
        })
      }

      case "verify_student": {
        const { studentAddress } = data

        const student = await db.updateStudent(studentAddress, {
          isVerified: true,
        })

        if (!student) {
          return NextResponse.json({ error: "Student not found" }, { status: 404 })
        }

        return NextResponse.json({
          success: true,
          message: "Student verified successfully",
          student,
        })
      }

      default:
        return NextResponse.json({ error: "Invalid action" }, { status: 400 })
    }
  } catch (error) {
    console.error("Admin manage election error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
