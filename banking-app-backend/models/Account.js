const mongoose = require("mongoose")

const AccountSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    accountNumber: {
      type: String,
      required: true,
      unique: true,
    },
    accountType: {
      type: String,
      enum: ["checking", "savings", "credit", "investment", "loan"],
      required: true,
    },
    balance: {
      type: Number,
      required: true,
      default: 0,
    },
    currency: {
      type: String,
      required: true,
      default: "USD",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    nickname: {
      type: String,
      default: "",
    },
    interestRate: {
      type: Number,
      default: 0,
    },
    availableCredit: {
      type: Number,
      default: 0,
    },
    creditLimit: {
      type: Number,
      default: 0,
    },
    dueDate: {
      type: Date,
    },
    minimumPayment: {
      type: Number,
      default: 0,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  },
)

// Generate a unique account number before saving
AccountSchema.pre("save", async function (next) {
  if (this.isNew) {
    // Generate a random 10-digit account number
    const randomNum = Math.floor(Math.random() * 9000000000) + 1000000000
    this.accountNumber = randomNum.toString()

    // Check if account number already exists
    const Account = this.constructor
    const existingAccount = await Account.findOne({ accountNumber: this.accountNumber })

    if (existingAccount) {
      // Try again with a different number
      return next(new Error("Account number generation failed. Please try again."))
    }
  }
  next()
})

module.exports = mongoose.model("Account", AccountSchema)

