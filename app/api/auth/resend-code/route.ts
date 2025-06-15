import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/database/db"
import { emailService } from "@/lib/utils/email"

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 })
    }

    // Find student by email
    const student = await db.getStudentByEmail(email)
    if (!student) {
      return NextResponse.json({ error: "Student not found" }, { status: 404 })
    }

    if (student.isVerified) {
      return NextResponse.json({ error: "Student already verified" }, { status: 400 })
    }

    // Generate new verification code
    const verificationCode = emailService.generateVerificationCode()
    const verificationCodeExpiry = new Date(Date.now() + 15 * 60 * 1000) // 15 minutes

    // Update student with new code
    await db.updateStudent(student.walletAddress, {
      verificationCode,
      verificationCodeExpiry,
    })

    // Send verification email
    try {
      await emailService.sendVerificationEmail(email, verificationCode)
    } catch (emailError) {
      console.error("Failed to send verification email:", emailError)
      return NextResponse.json({ error: "Failed to send verification email" }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: "Verification code sent successfully",
    })
  } catch (error) {
    console.error("Resend code error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
