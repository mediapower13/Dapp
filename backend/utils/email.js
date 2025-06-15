const nodemailer = require("nodemailer")

// Create transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASSWORD,
  },
})

// Send verification email
const sendVerificationEmail = async (email, code, firstName) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL,
      to: email,
      subject: "UniVote - Email Verification",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #16a34a; margin: 0;">UniVote</h1>
            <p style="color: #6b7280; margin: 5px 0;">University of Ilorin Student Union Elections</p>
          </div>
          
          <div style="background: #f9fafb; padding: 30px; border-radius: 8px; margin-bottom: 20px;">
            <h2 style="color: #111827; margin-top: 0;">Hello ${firstName}!</h2>
            <p style="color: #374151; line-height: 1.6;">
              Thank you for registering for the University of Ilorin Student Union Elections. 
              To complete your registration, please verify your email address using the code below:
            </p>
            
            <div style="text-align: center; margin: 30px 0;">
              <div style="background: #16a34a; color: white; font-size: 32px; font-weight: bold; 
                          padding: 20px; border-radius: 8px; letter-spacing: 8px; display: inline-block;">
                ${code}
              </div>
            </div>
            
            <p style="color: #6b7280; font-size: 14px; text-align: center;">
              This code will expire in 10 minutes.
            </p>
          </div>
          
          <div style="text-align: center; color: #6b7280; font-size: 12px;">
            <p>If you didn't request this verification, please ignore this email.</p>
            <p>© 2024 UniVote - University of Ilorin</p>
          </div>
        </div>
      `,
    }

    await transporter.sendMail(mailOptions)
    console.log("Verification email sent successfully")
  } catch (error) {
    console.error("Email sending error:", error)
    throw new Error("Failed to send verification email")
  }
}

module.exports = {
  sendVerificationEmail,
}
