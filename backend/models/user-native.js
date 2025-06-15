const bcrypt = require("bcryptjs")
const { getDB } = require("../config/mongodb-native")

class User {
  constructor(userData) {
    this.firstName = userData.firstName
    this.lastName = userData.lastName
    this.email = userData.email
    this.matricNumber = userData.matricNumber
    this.password = userData.password
    this.isVerified = userData.isVerified || false
    this.verificationCode = userData.verificationCode
    this.verificationExpires = userData.verificationExpires
    this.walletAddress = userData.walletAddress || null
    this.hasVoted = userData.hasVoted || []
    this.role = userData.role || "student"
    this.createdAt = userData.createdAt || new Date()
    this.updatedAt = new Date()
  }

  async save() {
    const db = getDB()

    // Hash password if modified
    if (this.password && !this.password.startsWith("$2a$")) {
      const salt = await bcrypt.genSalt(10)
      this.password = await bcrypt.hash(this.password, salt)
    }

    if (this._id) {
      // Update existing user
      const result = await db
        .collection("users")
        .updateOne({ _id: this._id }, { $set: { ...this, updatedAt: new Date() } })
      return result
    } else {
      // Create new user
      const result = await db.collection("users").insertOne(this)
      this._id = result.insertedId
      return result
    }
  }

  static async findOne(query) {
    const db = getDB()
    const userData = await db.collection("users").findOne(query)
    return userData ? new User(userData) : null
  }

  static async findById(id) {
    const db = getDB()
    const { ObjectId } = require("mongodb")
    const userData = await db.collection("users").findOne({ _id: new ObjectId(id) })
    return userData ? new User(userData) : null
  }

  static async find(query = {}) {
    const db = getDB()
    const users = await db.collection("users").find(query).toArray()
    return users.map((userData) => new User(userData))
  }

  async comparePassword(candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password)
  }

  generateVerificationCode() {
    const code = Math.floor(100000 + Math.random() * 900000).toString()
    this.verificationCode = code
    this.verificationExpires = new Date(Date.now() + 10 * 60 * 1000) // 10 minutes
    return code
  }

  static async createIndexes() {
    const db = getDB()
    await db.collection("users").createIndex({ email: 1 }, { unique: true })
    await db.collection("users").createIndex({ matricNumber: 1 }, { unique: true })
  }
}

module.exports = User
