const fs = require("fs")
const path = require("path")

const setupDevelopment = () => {
  console.log("🚀 Setting up development environment...")

  // Create .env file if it doesn't exist
  const envPath = path.join(process.cwd(), ".env")
  if (!fs.existsSync(envPath)) {
    const envTemplate = `# Database
MONGO_URI=mongodb+srv://UnilorinDapp:bolarinwa13@dapp.tpxuh7h.mongodb.net/UnilorinDapp?retryWrites=true&w=majority

# Server
PORT=5000
NODE_ENV=development

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Email Configuration
EMAIL=nurudeenbolaman@gmail.com
EMAIL_PASSWORD=bolarinwa13

# Frontend
FRONTEND_URL=http://localhost:3000
NEXT_PUBLIC_API_URL=http://localhost:5000

# Optional: For production deployment
VERCEL_URL=
RAILWAY_URL=
`

    fs.writeFileSync(envPath, envTemplate)
    console.log("✅ Created .env file")
  }

  // Create necessary directories
  const dirs = [
    "backend/models",
    "backend/routes",
    "backend/middleware",
    "backend/utils",
    "scripts",
    "frontend/components",
  ]

  dirs.forEach((dir) => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true })
      console.log(`✅ Created directory: ${dir}`)
    }
  })

  console.log("🎉 Development environment setup complete!")
  console.log("\nNext steps:")
  console.log("1. Update your .env file with correct values")
  console.log("2. Run 'npm run test-connection' to verify database connection")
  console.log("3. Run 'npm run seed' to populate sample data")
  console.log("4. Run 'npm run dev' to start development server")
}

setupDevelopment()
