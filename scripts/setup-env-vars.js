const setupEnvironmentVariables = () => {
  console.log("🔧 Environment Variables Setup Guide")
  console.log("=====================================")

  const requiredVars = [
    {
      name: "MONGO_URI",
      description: "MongoDB Atlas connection string",
      example: "mongodb+srv://username:password@cluster.mongodb.net/database",
      required: true,
    },
    {
      name: "JWT_SECRET",
      description: "Secret key for JWT tokens (use a strong random string)",
      example: "your-super-secret-jwt-key-min-32-characters",
      required: true,
    },
    {
      name: "EMAIL",
      description: "Gmail address for sending verification emails",
      example: "your-email@gmail.com",
      required: true,
    },
    {
      name: "EMAIL_PASSWORD",
      description: "Gmail app password (not your regular password)",
      example: "your-gmail-app-password",
      required: true,
    },
    {
      name: "FRONTEND_URL",
      description: "URL of your frontend application",
      example: "https://your-app.vercel.app",
      required: true,
    },
    {
      name: "PORT",
      description: "Port for the server (usually set by hosting provider)",
      example: "5000",
      required: false,
    },
  ]

  console.log("\n📋 Required Environment Variables:")
  console.log("==================================")

  requiredVars.forEach((variable, index) => {
    console.log(`\n${index + 1}. ${variable.name} ${variable.required ? "(Required)" : "(Optional)"}`)
    console.log(`   Description: ${variable.description}`)
    console.log(`   Example: ${variable.example}`)
  })

  console.log("\n🔐 Security Notes:")
  console.log("==================")
  console.log("• Never commit .env files to version control")
  console.log("• Use strong, unique passwords and secrets")
  console.log("• Enable 2FA on your Gmail account")
  console.log("• Use Gmail App Passwords, not your regular password")
  console.log("• Regularly rotate your JWT secret in production")

  console.log("\n📧 Gmail App Password Setup:")
  console.log("============================")
  console.log("1. Go to Google Account settings")
  console.log("2. Enable 2-Factor Authentication")
  console.log("3. Go to Security > App passwords")
  console.log("4. Generate an app password for 'Mail'")
  console.log("5. Use this app password in EMAIL_PASSWORD")
}

setupEnvironmentVariables()
