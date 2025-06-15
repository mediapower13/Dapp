const express = require("express")
const jwt = require("jsonwebtoken")
const User = require("../models/user")
const { sendVerificationEmail } = require("../utils/email")
const auth = require("../middleware/auth")

const router = express.Router()

// Register
router.post("/register", async (req, res) => {
  try {
    const { firstName, lastName, email, matricNumber, password } = req.body

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ email }, { matricNumber }],
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

    // Create new user
    const user = new User({
      firstName,
      lastName,
      email,
      matricNumber,
      password,
    })

    // Generate verification code
    const verificationCode = user.generateVerificationCode()
    await user.save()

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

// Verify email
router.post("/verify", async (req, res) => {
  try {
    const { email, code } = req.body

    const user = await User.findOne({
      email,
      verificationCode: code,
      verificationExpires: { $gt: Date.now() },
    })

    if (!user) {
      return res.status(400).json({
        message: "Invalid or expired verification code",
      })
    }

    user.isVerified = true
    user.verificationCode = undefined
    user.verificationExpires = undefined
    await user.save()

    // Generate JWT token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" })

    res.json({
      token,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        matricNumber: user.matricNumber,
        isVerified: user.isVerified,
        hasVoted: user.hasVoted,
      },
    })
  } catch (error) {
    console.error("Verification error:", error)
    res.status(500).json({ message: "Server error during verification" })
  }
})

// Login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body

    // Find user
    const user = await User.findOne({ email })
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" })
    }

    // Check password
    const isMatch = await user.comparePassword(password)
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
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" })

    res.json({
      token,
      user: {
        id: user._id,
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

// Get current user
router.get("/me", auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-password")
    res.json(user)
  } catch (error) {
    console.error("Get user error:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// Resend verification code
router.post("/resend-code", async (req, res) => {
  try {
    const { email } = req.body

    const user = await User.findOne({ email, isVerified: false })
    if (!user) {
      return res.status(400).json({
        message: "User not found or already verified",
      })
    }

    const verificationCode = user.generateVerificationCode()
    await user.save()

    await sendVerificationEmail(email, verificationCode, user.firstName)

    res.json({ message: "Verification code sent successfully" })
  } catch (error) {
    console.error("Resend code error:", error)
    res.status(500).json({ message: "Server error" })
  }
})

module.exports = router
