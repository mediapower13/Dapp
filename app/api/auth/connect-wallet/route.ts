import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/database/db"
import { ethers } from "ethers"

export async function POST(request: NextRequest) {
  try {
    const { walletAddress, signature, message } = await request.json()

    if (!walletAddress || !signature || !message) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Verify the signature
    try {
      const recoveredAddress = ethers.utils.verifyMessage(message, signature)

      if (recoveredAddress.toLowerCase() !== walletAddress.toLowerCase()) {
        return NextResponse.json({ error: "Invalid signature" }, { status: 401 })
      }
    } catch (error) {
      return NextResponse.json({ error: "Signature verification failed" }, { status: 401 })
    }

    // Check if student exists
    const student = await db.getStudentByAddress(walletAddress)

    if (!student) {
      return NextResponse.json({ error: "Student not registered", requiresRegistration: true }, { status: 404 })
    }

    if (!student.isVerified) {
      return NextResponse.json({ error: "Student not verified", requiresVerification: true }, { status: 403 })
    }

    // Update last login
    await db.updateStudent(walletAddress, {
      lastLogin: new Date(),
    })

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
      },
    })
  } catch (error) {
    console.error("Wallet connection error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
