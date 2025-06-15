const mongoose = require("mongoose")
const dotenv = require("dotenv")
const Election = require("../backend/models/election")
const User = require("../backend/models/user")

dotenv.config()

const seedElections = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI)
    console.log("Connected to MongoDB")

    // Create admin user if doesn't exist
    let admin = await User.findOne({ email: "admin@students.unilorin.edu.ng" })
    if (!admin) {
      admin = new User({
        firstName: "Admin",
        lastName: "User",
        email: "admin@students.unilorin.edu.ng",
        matricNumber: "ADMIN001",
        password: "admin123",
        isVerified: true,
        role: "admin",
      })
      await admin.save()
      console.log("Admin user created")
    }

    // Clear existing elections
    await Election.deleteMany({})
    console.log("Cleared existing elections")

    // Sample elections data
    const elections = [
      {
        title: "Student Union President Election 2024",
        description: "Election for the position of Student Union President for the 2024/2025 academic session",
        startDate: new Date("2024-03-01"),
        endDate: new Date("2024-03-15"),
        status: "active",
        candidates: [
          {
            name: "Adebayo Johnson",
            position: "President",
            manifesto:
              "I promise to improve student welfare, enhance academic facilities, and strengthen the relationship between students and management.",
          },
          {
            name: "Fatima Abdullahi",
            position: "President",
            manifesto:
              "My focus will be on digital transformation of student services, improved hostel conditions, and better representation in university decisions.",
          },
          {
            name: "Chinedu Okafor",
            position: "President",
            manifesto:
              "I will work towards reducing academic stress, improving campus security, and creating more opportunities for student entrepreneurship.",
          },
        ],
        createdBy: admin._id,
      },
      {
        title: "Vice President Election 2024",
        description: "Election for the position of Vice President of the Student Union",
        startDate: new Date("2024-03-01"),
        endDate: new Date("2024-03-15"),
        status: "active",
        candidates: [
          {
            name: "Aisha Mohammed",
            position: "Vice President",
            manifesto:
              "I will support the president in implementing policies that benefit all students and ensure transparency in student government.",
          },
          {
            name: "Olumide Adeyemi",
            position: "Vice President",
            manifesto:
              "My goal is to bridge the gap between different faculties and ensure equal representation for all students.",
          },
        ],
        createdBy: admin._id,
      },
      {
        title: "Secretary General Election 2024",
        description: "Election for the position of Secretary General of the Student Union",
        startDate: new Date("2024-03-16"),
        endDate: new Date("2024-03-30"),
        status: "pending",
        candidates: [
          {
            name: "Grace Okonkwo",
            position: "Secretary General",
            manifesto:
              "I will ensure proper documentation of all student union activities and improve communication channels.",
          },
          {
            name: "Ibrahim Yusuf",
            position: "Secretary General",
            manifesto:
              "My focus will be on digitizing student union records and creating efficient administrative processes.",
          },
        ],
        createdBy: admin._id,
      },
    ]

    // Insert elections
    const createdElections = await Election.insertMany(elections)
    console.log(`Created ${createdElections.length} elections`)

    console.log("Database seeded successfully!")
    process.exit(0)
  } catch (error) {
    console.error("Seeding error:", error)
    process.exit(1)
  }
}

seedElections()
