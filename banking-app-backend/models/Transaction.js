const mongoose = require("mongoose")

const TransactionSchema = new mongoose.Schema(
  {
    transactionId: {
      type: String,
      required: true,
      unique: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    fromAccount: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Account",
    },
    toAccount: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Account",
    },
    transactionType: {
      type: String,
      enum: ["deposit", "withdrawal", "transfer", "payment", "fee", "interest", "refund"],
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      default: "USD",
    },
    description: {
      type: String,
    },
    category: {
      type: String,
    },
    status: {
      type: String,
      enum: ["pending", "completed", "failed", "cancelled"],
      default: "pending",
    },
    reference: {
      type: String,
    },
    payee: {
      type: String,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  },
)

// Generate a unique transaction ID before saving
TransactionSchema.pre("save", async function (next) {
  if (this.isNew) {
    // Generate a random transaction ID with prefix TX followed by timestamp and random digits
    const timestamp = new Date().getTime().toString().slice(-6)
    const random = Math.floor(Math.random() * 10000)
      .toString()
      .padStart(4, "0")
    this.transactionId = `TX${timestamp}${random}`
  }
  next()
})

module.exports = mongoose.model("Transaction", TransactionSchema)

