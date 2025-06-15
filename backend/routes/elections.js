const express = require("express")
const Election = require("../models/election")
const auth = require("../middleware/auth")

const router = express.Router()

// Get all elections
router.get("/", auth, async (req, res) => {
  try {
    const elections = await Election.find().populate("createdBy", "firstName lastName").sort({ createdAt: -1 })

    // Update election statuses
    for (const election of elections) {
      election.updateStatus()
      await election.save()
    }

    res.json(elections)
  } catch (error) {
    console.error("Get elections error:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// Get single election
router.get("/:id", auth, async (req, res) => {
  try {
    const election = await Election.findById(req.params.id)
      .populate("createdBy", "firstName lastName")
      .populate("voters.user", "firstName lastName email")

    if (!election) {
      return res.status(404).json({ message: "Election not found" })
    }

    election.updateStatus()
    await election.save()

    res.json(election)
  } catch (error) {
    console.error("Get election error:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// Create election (admin only)
router.post("/", auth, async (req, res) => {
  try {
    const { title, description, startDate, endDate, candidates } = req.body

    const election = new Election({
      title,
      description,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      candidates: candidates.map((candidate) => ({
        name: candidate.name,
        position: candidate.position,
        manifesto: candidate.manifesto || "",
      })),
      createdBy: req.userId,
    })

    election.updateStatus()
    await election.save()

    res.status(201).json(election)
  } catch (error) {
    console.error("Create election error:", error)
    res.status(500).json({ message: "Server error" })
  }
})

module.exports = router
