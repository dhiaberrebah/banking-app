const mongoose = require("mongoose")

const BillPaymentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    accountId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Account",
      required: true,
    },
    payee: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    dueDate: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ["scheduled", "processing", "completed", "failed", "cancelled"],
      default: "scheduled",
    },
    frequency: {
      type: String,
      enum: ["one-time", "weekly", "bi-weekly", "monthly", "quarterly", "annually"],
      default: "one-time",
    },
    description: {
      type: String,
    },
    category: {
      type: String,
    },
    paymentMethod: {
      type: String,
      enum: ["account", "card"],
      default: "account",
    },
    paymentDate: {
      type: Date,
    },
    reminderEnabled: {
      type: Boolean,
      default: false,
    },
    reminderDays: {
      type: Number,
      default: 3,
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

module.exports = mongoose.model("BillPayment", BillPaymentSchema)

