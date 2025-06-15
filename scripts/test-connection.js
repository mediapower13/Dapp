const mongoose = require("mongoose")
const dotenv = require("dotenv")

dotenv.config()

const testConnection = async () => {
  try {
    console.log("Testing database connection...")
    console.log("MongoDB URI:", process.env.MONGO_URI ? "✓ Set" : "✗ Missing")

    await mongoose.connect(process.env.MONGO_URI)
    console.log("✅ Database connected successfully!")

    // Test basic operations
    const testCollection = mongoose.connection.db.collection("test")
    await testCollection.insertOne({ test: "connection", timestamp: new Date() })
    console.log("✅ Database write test successful!")

    const result = await testCollection.findOne({ test: "connection" })
    console.log("✅ Database read test successful!")

    await testCollection.deleteOne({ test: "connection" })
    console.log("✅ Database delete test successful!")

    console.log("🎉 All database tests passed!")
  } catch (error) {
    console.error("❌ Database connection failed:", error.message)

    if (error.message.includes("authentication failed")) {
      console.log("💡 Check your MongoDB username and password")
    }
    if (error.message.includes("network")) {
      console.log("💡 Check your internet connection and MongoDB Atlas network access")
    }
  } finally {
    await mongoose.disconnect()
    process.exit()
  }
}

testConnection()
