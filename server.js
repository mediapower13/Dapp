const express = require("express")
const cors = require("cors")
const dotenv = require("dotenv")
const connectDB = require("./backend/config/database")

// Load environment variables
dotenv.config()

// Connect to database
connectDB()

const app = express()

// Middleware
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
  }),
)
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Routes
app.use("/api/auth", require("./backend/routes/auth"))
app.use("/api/elections", require("./backend/routes/elections"))
app.use("/api/voting", require("./backend/routes/voting"))

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({
    message: "UniVote API is running",
    timestamp: new Date().toISOString(),
  })
})

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({ message: "Something went wrong!" })
})

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({ message: "Route not found" })
})

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
  console.log(`Environment: ${process.env.NODE_ENV || "development"}`)
})

module.exports = app
