import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/database/db"
import { emailService } from "@/lib/utils/email"
import { RegisterStudentRequest } from "@/lib/database/schema"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate request data
    const validationResult = RegisterStudentRequest.safeParse(body)
    if (!validationResult.success) {
      return NextResponse.json(
        { error: "Invalid request data", details: validationResult.error.errors },
        { status: 400 },
      )
    }

    const studentData = validationResult.data

    // Check if student already exists
    const existingStudent = await db.getStudentByAddress(studentData.walletAddress)
    if (existingStudent) {
      return NextResponse.json({ error: "Student already registered with this wallet address" }, { status: 409 })
    }

    // Check if email is already used
    const existingEmail = await db.getStudentByEmail(studentData.email)
    if (existingEmail) {
      return NextResponse.json({ error: "Email already registered" }, { status: 409 })
    }

    // Validate UNILORIN email format
    if (!emailService.validateUnilorinEmail(studentData.email)) {
      return NextResponse.json({ error: "Invalid UNILORIN student email format" }, { status: 400 })
    }

    // Generate verification code
    const verificationCode = emailService.generateVerificationCode()
    const verificationCodeExpiry = new Date(Date.now() + 15 * 60 * 1000) // 15 minutes

    // Create student record
    const student = await db.createStudent({
      ...studentData,
      isVerified: false,
      isRegistered: true,
      verificationCode,
      verificationCodeExpiry,
      registrationTime: new Date(),
    })

    // Send verification email
    try {
      await emailService.sendVerificationEmail(studentData.email, verificationCode)
    } catch (emailError) {
      console.error("Failed to send verification email:", emailError)
      // Continue with registration even if email fails
    }

    return NextResponse.json({
      success: true,
      message: "Registration successful. Please check your email for verification code.",
      student: {
        walletAddress: student.walletAddress,
        email: student.email,
        firstName: student.firstName,
        lastName: student.lastName,
        matricNumber: student.matricNumber,
      },
    })
  } catch (error) {
    console.error("Registration error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
