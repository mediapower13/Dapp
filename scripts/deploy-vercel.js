const { execSync } = require("child_process")

const deployToVercel = () => {
  console.log("🚀 Deploying to Vercel...")

  try {
    // Install Vercel CLI if not installed
    try {
      execSync("vercel --version", { stdio: "ignore" })
    } catch {
      console.log("Installing Vercel CLI...")
      execSync("npm install -g vercel", { stdio: "inherit" })
    }

    // Build the application
    console.log("Building application...")
    execSync("npm run build", { stdio: "inherit" })

    // Deploy to Vercel
    console.log("Deploying to Vercel...")
    execSync("vercel --prod", { stdio: "inherit" })

    console.log("✅ Deployment successful!")
    console.log("🌐 Your app is now live on Vercel!")
  } catch (error) {
    console.error("❌ Deployment failed:", error.message)
    console.log("\n💡 Manual deployment steps:")
    console.log("1. Run 'npm install -g vercel'")
    console.log("2. Run 'vercel login'")
    console.log("3. Run 'vercel --prod'")
  }
}

deployToVercel()
