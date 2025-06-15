const mongoose = require("mongoose")

const candidateSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  position: {
    type: String,
    required: true,
    trim: true,
  },
  manifesto: {
    type: String,
    trim: true,
  },
  votes: {
    type: Number,
    default: 0,
  },
  voters: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
})

const electionSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "active", "completed"],
      default: "pending",
    },
    candidates: [candidateSchema],
    totalVotes: {
      type: Number,
      default: 0,
    },
    voters: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        candidate: {
          type: mongoose.Schema.Types.ObjectId,
        },
        walletAddress: String,
        transactionHash: String,
        votedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  },
)

// Update election status based on dates
electionSchema.methods.updateStatus = function () {
  const now = new Date()
  if (now < this.startDate) {
    this.status = "pending"
  } else if (now >= this.startDate && now <= this.endDate) {
    this.status = "active"
  } else {
    this.status = "completed"
  }
}

module.exports = mongoose.model("Election", electionSchema)
