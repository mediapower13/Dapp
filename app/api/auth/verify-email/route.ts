import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/database/db"
import { emailService } from "@/lib/utils/email"
import { VerifyEmailRequest } from "@/lib/database/schema"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate request data
    const validationResult = VerifyEmailRequest.safeParse(body)
    if (!validationResult.success) {
      return NextResponse.json(
        { error: "Invalid request data", details: validationResult.error.errors },
        { status: 400 },
      )
    }

    const { email, code } = validationResult.data

    // Find student by email
    const student = await db.getStudentByEmail(email)
    if (!student) {
      return NextResponse.json({ error: "Student not found" }, { status: 404 })
    }

    if (student.isVerified) {
      return NextResponse.json({ error: "Student already verified" }, { status: 400 })
    }

    // Check verification code
    if (!student.verificationCode || student.verificationCode !== code) {
      return NextResponse.json({ error: "Invalid verification code" }, { status: 400 })
    }

    // Check if code has expired
    if (!student.verificationCodeExpiry || new Date() > student.verificationCodeExpiry) {
      return NextResponse.json({ error: "Verification code has expired" }, { status: 400 })
    }

    // Update student as verified
    const updatedStudent = await db.updateStudent(student.walletAddress, {
      isVerified: true,
      verificationCode: undefined,
      verificationCodeExpiry: undefined,
    })

    if (!updatedStudent) {
      return NextResponse.json({ error: "Failed to update student" }, { status: 500 })
    }

    // Send welcome email
    try {
      await emailService.sendWelcomeEmail(student.email, `${student.firstName} ${student.lastName}`)
    } catch (emailError) {
      console.error("Failed to send welcome email:", emailError)
    }

    return NextResponse.json({
      success: true,
      message: "Email verified successfully",
      student: {
        walletAddress: updatedStudent.walletAddress,
        email: updatedStudent.email,
        firstName: updatedStudent.firstName,
        lastName: updatedStudent.lastName,
        matricNumber: updatedStudent.matricNumber,
        isVerified: updatedStudent.isVerified,
      },
    })
  } catch (error) {
    console.error("Email verification error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
