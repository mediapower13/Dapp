const { execSync } = require("child_process")

const deployToRailway = () => {
  console.log("🚂 Deploying to Railway...")

  try {
    // Install Railway CLI if not installed
    try {
      execSync("railway --version", { stdio: "ignore" })
    } catch {
      console.log("Installing Railway CLI...")
      execSync("npm install -g @railway/cli", { stdio: "inherit" })
    }

    // Login to Railway
    console.log("Please login to Railway...")
    execSync("railway login", { stdio: "inherit" })

    // Initialize Railway project
    execSync("railway init", { stdio: "inherit" })

    // Set environment variables
    console.log("Setting environment variables...")
    const envVars = ["MONGO_URI", "JWT_SECRET", "EMAIL", "EMAIL_PASSWORD", "FRONTEND_URL"]

    envVars.forEach((varName) => {
      const value = process.env[varName]
      if (value) {
        execSync(`railway variables set ${varName}="${value}"`, { stdio: "inherit" })
      }
    })

    // Deploy
    console.log("Deploying to Railway...")
    execSync("railway up", { stdio: "inherit" })

    console.log("✅ Deployment successful!")
    console.log("🚂 Your app is now live on Railway!")
  } catch (error) {
    console.error("❌ Deployment failed:", error.message)
  }
}

deployToRailway()
