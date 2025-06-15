const { PrismaClient } = require("@prisma/client")

const prisma = new PrismaClient({
  log: ["query", "info", "warn", "error"],
})

const connectDB = async () => {
  try {
    await prisma.$connect()
    console.log("Database connected with Prisma")
  } catch (error) {
    console.error("Database connection error:", error)
    process.exit(1)
  }
}

const disconnectDB = async () => {
  await prisma.$disconnect()
}

module.exports = { prisma, connectDB, disconnectDB }
