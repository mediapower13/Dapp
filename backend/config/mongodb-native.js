const { MongoClient } = require("mongodb")

let db

const connectDB = async () => {
  try {
    const client = new MongoClient(process.env.MONGO_URI)
    await client.connect()
    db = client.db("UnilorinDapp")
    console.log("MongoDB Connected with Native Driver")
    return db
  } catch (error) {
    console.error("Database connection error:", error)
    process.exit(1)
  }
}

const getDB = () => {
  if (!db) {
    throw new Error("Database not initialized")
  }
  return db
}

module.exports = { connectDB, getDB }
