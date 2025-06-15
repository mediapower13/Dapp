const express = require("express")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcryptjs")
const { prisma } = require("../config/prisma")
const { sendVerificationEmail } = require("../utils/email")
const auth = require("../middleware/auth")

const router = express.Router()

// Register
router.post("/register", async (req, res) => {
  try {
    const { firstName, lastName, email, matricNumber, password } = req.body

    // Check if user already exists
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ email }, { matricNumber }],
      },
    })

    if (existingUser) {
      return res.status(400).json({
        message: "User with this email or matric number already exists",
      })
    }

    // Validate email domain
    if (!email.endsWith("@students.unilorin.edu.ng")) {
      return res.status(400).json({
        message: "Please use your official university email address",
      })
    }

    // Hash password
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    // Generate verification code
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString()
    const verificationExpires = new Date(Date.now() + 10 * 60 * 1000) // 10 minutes

    // Create user
    const user = await prisma.user.create({
      data: {
        firstName,
        lastName,
        email,
        matricNumber,
        password: hashedPassword,
        verificationCode,
        verificationExpires,
      },
    })

    // Send verification email
    await sendVerificationEmail(email, verificationCode, firstName)

    res.status(201).json({
      message: "Registration successful. Please check your email for verification code.",
    })
  } catch (error) {
    console.error("Registration error:", error)
    res.status(500).json({ message: "Server error during registration" })
  }
})

// Login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body

    // Find user
    const user = await prisma.user.findUnique({
      where: { email },
    })

    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" })
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" })
    }

    // Check if verified
    if (!user.isVerified) {
      return res.status(400).json({
        message: "Please verify your email before logging in",
      })
    }

    // Generate JWT token
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: "7d" })

    res.json({
      token,
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        matricNumber: user.matricNumber,
        isVerified: user.isVerified,
        hasVoted: user.hasVoted,
      },
    })
  } catch (error) {
    console.error("Login error:", error)
    res.status(500).json({ message: "Server error during login" })
  }
})

module.exports = router
