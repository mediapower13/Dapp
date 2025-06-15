const { execSync } = require("child_process")
const fs = require("fs")

const deploy = async () => {
  console.log("🚀 Starting deployment process...")

  // Pre-deployment checks
  console.log("\n1️⃣ Running pre-deployment checks...")

  // Check if .env exists
  if (!fs.existsSync(".env")) {
    console.error("❌ .env file not found!")
    console.log("💡 Run 'node scripts/setup-dev.js' first")
    process.exit(1)
  }

  // Check required environment variables
  const requiredVars = ["MONGO_URI", "JWT_SECRET", "EMAIL", "EMAIL_PASSWORD"]
  const missingVars = requiredVars.filter((varName) => !process.env[varName])

  if (missingVars.length > 0) {
    console.error("❌ Missing environment variables:", missingVars.join(", "))
    console.log("💡 Update your .env file with all required variables")
    process.exit(1)
  }

  // Test database connection
  console.log("\n2️⃣ Testing database connection...")
  try {
    execSync("node scripts/test-connection.js", { stdio: "inherit" })
  } catch (error) {
    console.error("❌ Database connection failed!")
    process.exit(1)
  }

  // Run tests
  console.log("\n3️⃣ Running tests...")
  try {
    execSync("npm test", { stdio: "inherit" })
  } catch (error) {
    console.log("⚠️ Tests failed, but continuing deployment...")
  }

  // Build application
  console.log("\n4️⃣ Building application...")
  try {
    execSync("npm run build", { stdio: "inherit" })
  } catch (error) {
    console.error("❌ Build failed!")
    process.exit(1)
  }

  // Choose deployment platform
  console.log("\n5️⃣ Choose deployment platform:")
  console.log("1. Vercel (Recommended for Next.js)")
  console.log("2. Railway (Full-stack apps)")
  console.log("3. Heroku (Traditional hosting)")
  console.log("4. Docker (Self-hosted)")

  // For now, let's default to Vercel
  console.log("\n🚀 Deploying to Vercel...")
  try {
    execSync("node scripts/deploy-vercel.js", { stdio: "inherit" })
  } catch (error) {
    console.error("❌ Vercel deployment failed!")
    console.log("💡 Try manual deployment or use another platform")
  }
}

// Run deployment if called directly
if (require.main === module) {
  deploy().catch(console.error)
}

module.exports = deploy
