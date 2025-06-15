const express = require("express")
const supabase = require("../config/supabase")
const { sendVerificationEmail } = require("../utils/email")

const router = express.Router()

// Register
router.post("/register", async (req, res) => {
  try {
    const { firstName, lastName, email, matricNumber, password } = req.body

    // Validate email domain
    if (!email.endsWith("@students.unilorin.edu.ng")) {
      return res.status(400).json({
        message: "Please use your official university email address",
      })
    }

    // Check if user already exists
    const { data: existingUser } = await supabase
      .from("users")
      .select("*")
      .or(`email.eq.${email},matric_number.eq.${matricNumber}`)
      .single()

    if (existingUser) {
      return res.status(400).json({
        message: "User with this email or matric number already exists",
      })
    }

    // Create user with Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          first_name: firstName,
          last_name: lastName,
          matric_number: matricNumber,
        },
      },
    })

    if (authError) {
      return res.status(400).json({ message: authError.message })
    }

    // Insert additional user data
    const { error: insertError } = await supabase.from("users").insert({
      id: authData.user.id,
      first_name: firstName,
      last_name: lastName,
      email,
      matric_number: matricNumber,
      is_verified: false,
    })

    if (insertError) {
      return res.status(500).json({ message: "Failed to create user profile" })
    }

    res.status(201).json({
      message: "Registration successful. Please check your email for verification.",
    })
  } catch (error) {
    console.error("Registration error:", error)
    res.status(500).json({ message: "Server error during registration" })
  }
})

module.exports = router
