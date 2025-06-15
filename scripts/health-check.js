const mongoose = require("mongoose")
const nodemailer = require("nodemailer")
const dotenv = require("dotenv")

dotenv.config()

const healthCheck = async () => {
  console.log("🏥 Running health check...")
  const results = {
    database: false,
    email: false,
    environment: false,
    timestamp: new Date().toISOString(),
  }

  // Check database connection
  try {
    await mongoose.connect(process.env.MONGO_URI)
    await mongoose.connection.db.admin().ping()
    results.database = true
    console.log("✅ Database: Connected")
    await mongoose.disconnect()
  } catch (error) {
    console.log("❌ Database: Failed -", error.message)
  }

  // Check email service
  try {
    const transporter = nodemailer.createTransporter({
      service: "gmail",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD,
      },
    })
    await transporter.verify()
    results.email = true
    console.log("✅ Email: Connected")
  } catch (error) {
    console.log("❌ Email: Failed -", error.message)
  }

  // Check environment variables
  const requiredVars = ["MONGO_URI", "JWT_SECRET", "EMAIL", "EMAIL_PASSWORD"]
  const hasAllVars = requiredVars.every((varName) => process.env[varName])
  results.environment = hasAllVars
  console.log(hasAllVars ? "✅ Environment: All variables set" : "❌ Environment: Missing variables")

  // Overall health
  const isHealthy = results.database && results.email && results.environment
  console.log(`\n🏥 Overall Health: ${isHealthy ? "✅ HEALTHY" : "❌ UNHEALTHY"}`)

  return results
}

// Run health check if called directly
if (require.main === module) {
  healthCheck()
    .then(() => process.exit(0))
    .catch(() => process.exit(1))
}

module.exports = healthCheck
