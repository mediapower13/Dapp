const express = require("express")
const Election = require("../models/election")
const User = require("../models/user")
const auth = require("../middleware/auth")

const router = express.Router()

// Cast vote
router.post("/vote", auth, async (req, res) => {
  try {
    const { electionId, candidateId, walletAddress } = req.body

    // Find election
    const election = await Election.findById(electionId)
    if (!election) {
      return res.status(404).json({ message: "Election not found" })
    }

    // Check if election is active
    election.updateStatus()
    if (election.status !== "active") {
      return res.status(400).json({ message: "Election is not currently active" })
    }

    // Check if user has already voted
    const user = await User.findById(req.userId)
    if (user.hasVoted.includes(electionId)) {
      return res.status(400).json({ message: "You have already voted in this election" })
    }

    // Find candidate
    const candidate = election.candidates.id(candidateId)
    if (!candidate) {
      return res.status(404).json({ message: "Candidate not found" })
    }

    // Record vote
    candidate.votes += 1
    candidate.voters.push(req.userId)

    election.totalVotes += 1
    election.voters.push({
      user: req.userId,
      candidate: candidateId,
      walletAddress: walletAddress,
      transactionHash: `mock_tx_${Date.now()}`, // In real implementation, this would be the actual blockchain transaction hash
    })

    await election.save()

    // Update user's voting record
    user.hasVoted.push(electionId)
    if (walletAddress) {
      user.walletAddress = walletAddress
    }
    await user.save()

    res.json({
      message: "Vote cast successfully",
      election: election,
    })
  } catch (error) {
    console.error("Voting error:", error)
    res.status(500).json({ message: "Server error during voting" })
  }
})

// Get voting results
router.get("/results/:electionId", auth, async (req, res) => {
  try {
    const election = await Election.findById(req.params.electionId).populate("voters.user", "firstName lastName email")

    if (!election) {
      return res.status(404).json({ message: "Election not found" })
    }

    const results = {
      election: {
        title: election.title,
        description: election.description,
        status: election.status,
        totalVotes: election.totalVotes,
        startDate: election.startDate,
        endDate: election.endDate,
      },
      candidates: election.candidates.map((candidate) => ({
        id: candidate._id,
        name: candidate.name,
        position: candidate.position,
        votes: candidate.votes,
        percentage: election.totalVotes > 0 ? ((candidate.votes / election.totalVotes) * 100).toFixed(2) : 0,
      })),
      voters: election.voters.map((vote) => ({
        user: vote.user,
        votedAt: vote.votedAt,
        walletAddress: vote.walletAddress,
      })),
    }

    res.json(results)
  } catch (error) {
    console.error("Get results error:", error)
    res.status(500).json({ message: "Server error" })
  }
})

module.exports = router
