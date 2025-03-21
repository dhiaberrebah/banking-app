const express = require("express")
const router = express.Router()
const BillPayment = require("../models/BillPayment")
const Account = require("../models/Account")
const Transaction = require("../models/Transaction")
const Notification = require("../models/Notification")
const { protect } = require("../middleware/auth")
const mongoose = require("mongoose")

// Get all bill payments for a user
router.get("/", protect, async (req, res) => {
  try {
    const { status, startDate, endDate } = req.query

    // Build query
    const query = { userId: req.user.id }

    // Add filters if provided
    if (status) {
      query.status = status
    }

    if (startDate && endDate) {
      query.dueDate = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      }
    } else if (startDate) {
      query.dueDate = { $gte: new Date(startDate) }
    } else if (endDate) {
      query.dueDate = { $lte: new Date(endDate) }
    }

    const billPayments = await BillPayment.find(query)
      .populate("accountId", "accountNumber accountType nickname")
      .sort({ dueDate: 1 })

    res.status(200).json({
      success: true,
      count: billPayments.length,
      data: billPayments,
    })
  } catch (error) {
    console.error("Get bill payments error:", error)
    res.status(500).json({
      success: false,
      message: "Error retrieving bill payments",
      error: error.message,
    })
  }
})

// Get bill payment by ID
router.get("/:id", protect, async (req, res) => {
  try {
    const billPayment = await BillPayment.findById(req.params.id).populate(
      "accountId",
      "accountNumber accountType nickname",
    )

    if (!billPayment) {
      return res.status(404).json({
        success: false,
        message: "Bill payment not found",
      })
    }

    // Check if bill payment belongs to user
    if (billPayment.userId.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Not authorized to access this bill payment",
      })
    }

    res.status(200).json({
      success: true,
      data: billPayment,
    })
  } catch (error) {
    console.error("Get bill payment error:", error)
    res.status(500).json({
      success: false,
      message: "Error retrieving bill payment",
      error: error.message,
    })
  }
})

// Create a new bill payment
router.post("/", protect, async (req, res) => {
  try {
    const { accountId, payee, amount, dueDate, frequency, description, category, reminderEnabled, reminderDays } =
      req.body

    // Validate input
    if (!accountId || !payee || !amount || !dueDate) {
      return res.status(400).json({
        success: false,
        message: "Please provide accountId, payee, amount, and dueDate",
      })
    }

    // Check if account exists and belongs to user
    const account = await Account.findOne({
      _id: accountId,
      userId: req.user.id,
      isActive: true,
    })

    if (!account) {
      return res.status(404).json({
        success: false,
        message: "Account not found or inactive",
      })
    }

    // Create bill payment
    const billPayment = await BillPayment.create({
      userId: req.user.id,
      accountId,
      payee,
      amount,
      dueDate: new Date(dueDate),
      frequency: frequency || "one-time",
      description,
      category,
      reminderEnabled: reminderEnabled || false,
      reminderDays: reminderDays || 3,
    })

    // Create notification for scheduled bill payment
    await Notification.create({
      userId: req.user.id,
      title: "Bill Payment Scheduled",
      message: `Your payment of $${amount} to ${payee} has been scheduled for ${new Date(dueDate).toLocaleDateString()}.`,
      type: "info",
    })

    res.status(201).json({
      success: true,
      message: "Bill payment scheduled successfully",
      data: billPayment,
    })
  } catch (error) {
    console.error("Create bill payment error:", error)
    res.status(500).json({
      success: false,
      message: "Error scheduling bill payment",
      error: error.message,
    })
  }
})

// Update bill payment
router.put("/:id", protect, async (req, res) => {
  try {
    const { accountId, payee, amount, dueDate, frequency, description, category, reminderEnabled, reminderDays } =
      req.body

    // Find bill payment
    const billPayment = await BillPayment.findById(req.params.id)

    if (!billPayment) {
      return res.status(404).json({
        success: false,
        message: "Bill payment not found",
      })
    }

    // Check if bill payment belongs to user
    if (billPayment.userId.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Not authorized to update this bill payment",
      })
    }

    // Check if payment is already processed
    if (billPayment.status !== "scheduled") {
      return res.status(400).json({
        success: false,
        message: `Cannot update bill payment with status: ${billPayment.status}`,
      })
    }

    // If changing account, verify it exists and belongs to user
    if (accountId && accountId !== billPayment.accountId.toString()) {
      const account = await Account.findOne({
        _id: accountId,
        userId: req.user.id,
        isActive: true,
      })

      if (!account) {
        return res.status(404).json({
          success: false,
          message: "Account not found or inactive",
        })
      }
    }

    // Update fields
    if (accountId) billPayment.accountId = accountId
    if (payee) billPayment.payee = payee
    if (amount) billPayment.amount = amount
    if (dueDate) billPayment.dueDate = new Date(dueDate)
    if (frequency) billPayment.frequency = frequency
    if (description) billPayment.description = description
    if (category) billPayment.category = category
    if (reminderEnabled !== undefined) billPayment.reminderEnabled = reminderEnabled
    if (reminderDays) billPayment.reminderDays = reminderDays

    // Save updated bill payment
    await billPayment.save()

    res.status(200).json({
      success: true,
      message: "Bill payment updated successfully",
      data: billPayment,
    })
  } catch (error) {
    console.error("Update bill payment error:", error)
    res.status(500).json({
      success: false,
      message: "Error updating bill payment",
      error: error.message,
    })
  }
})

// Process bill payment (pay now)
router.post("/:id/pay", protect, async (req, res) => {
  const session = await mongoose.startSession()
  session.startTransaction()

  try {
    // Find bill payment
    const billPayment = await BillPayment.findById(req.params.id).session(session)

    if (!billPayment) {
      await session.abortTransaction()
      session.endSession()
      return res.status(404).json({
        success: false,
        message: "Bill payment not found",
      })
    }

    // Check if bill payment belongs to user
    if (billPayment.userId.toString() !== req.user.id && req.user.role !== "admin") {
      await session.abortTransaction()
      session.endSession()
      return res.status(403).json({
        success: false,
        message: "Not authorized to process this bill payment",
      })
    }

    // Check if payment is already processed
    if (billPayment.status !== "scheduled") {
      await session.abortTransaction()
      session.endSession()
      return res.status(400).json({
        success: false,
        message: `Cannot process bill payment with status: ${billPayment.status}`,
      })
    }

    // Find account
    const account = await Account.findOne({
      _id: billPayment.accountId,
      isActive: true,
    }).session(session)

    if (!account) {
      await session.abortTransaction()
      session.endSession()
      return res.status(404).json({
        success: false,
        message: "Account not found or inactive",
      })
    }

    // Check if account has sufficient funds
    if (account.balance < billPayment.amount) {
      await session.abortTransaction()
      session.endSession()
      return res.status(400).json({
        success: false,
        message: "Insufficient funds",
      })
    }

    // Update account balance
    account.balance -= billPayment.amount
    await account.save({ session })

    // Update bill payment status
    billPayment.status = "completed"
    billPayment.paymentDate = new Date()
    await billPayment.save({ session })

    // Create transaction record
    const transaction = await Transaction.create(
      [
        {
          userId: req.user.id,
          fromAccount: billPayment.accountId,
          transactionType: "payment",
          amount: billPayment.amount,
          description: `Bill payment to ${billPayment.payee}`,
          payee: billPayment.payee,
          category: billPayment.category || "Bills",
          status: "completed",
        },
      ],
      { session },
    )

    // Create notification
    await Notification.create(
      [
        {
          userId: req.user.id,
          title: "Bill Payment Completed",
          message: `Your payment of $${billPayment.amount} to ${billPayment.payee} has been processed successfully.`,
          type: "transaction",
        },
      ],
      { session },
    )

    // If recurring, schedule next payment
    if (billPayment.frequency !== "one-time") {
      const nextDueDate = calculateNextDueDate(billPayment.dueDate, billPayment.frequency)

      await BillPayment.create(
        [
          {
            userId: req.user.id,
            accountId: billPayment.accountId,
            payee: billPayment.payee,
            amount: billPayment.amount,
            dueDate: nextDueDate,
            frequency: billPayment.frequency,
            description: billPayment.description,
            category: billPayment.category,
            reminderEnabled: billPayment.reminderEnabled,
            reminderDays: billPayment.reminderDays,
          },
        ],
        { session },
      )
    }

    // Commit the transaction
    await session.commitTransaction()
    session.endSession()

    res.status(200).json({
      success: true,
      message: "Bill payment processed successfully",
      data: {
        billPayment,
        transaction: transaction[0],
      },
    })
  } catch (error) {
    // Abort transaction on error
    await session.abortTransaction()
    session.endSession()

    console.error("Process bill payment error:", error)
    res.status(500).json({
      success: false,
      message: "Error processing bill payment",
      error: error.message,
    })
  }
})

// Cancel bill payment
router.post("/:id/cancel", protect, async (req, res) => {
  try {
    // Find bill payment
    const billPayment = await BillPayment.findById(req.params.id)

    if (!billPayment) {
      return res.status(404).json({
        success: false,
        message: "Bill payment not found",
      })
    }

    // Check if bill payment belongs to user
    if (billPayment.userId.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Not authorized to cancel this bill payment",
      })
    }

    // Check if payment is already processed
    if (billPayment.status !== "scheduled") {
      return res.status(400).json({
        success: false,
        message: `Cannot cancel bill payment with status: ${billPayment.status}`,
      })
    }

    // Update bill payment status
    billPayment.status = "cancelled"
    await billPayment.save()

    // Create notification
    await Notification.create({
      userId: req.user.id,
      title: "Bill Payment Cancelled",
      message: `Your scheduled payment of $${billPayment.amount} to ${billPayment.payee} has been cancelled.`,
      type: "info",
    })

    res.status(200).json({
      success: true,
      message: "Bill payment cancelled successfully",
      data: billPayment,
    })
  } catch (error) {
    console.error("Cancel bill payment error:", error)
    res.status(500).json({
      success: false,
      message: "Error cancelling bill payment",
      error: error.message,
    })
  }
})

// Helper function to calculate next due date based on frequency
function calculateNextDueDate(currentDueDate, frequency) {
  const date = new Date(currentDueDate)

  switch (frequency) {
    case "weekly":
      date.setDate(date.getDate() + 7)
      break
    case "bi-weekly":
      date.setDate(date.getDate() + 14)
      break
    case "monthly":
      date.setMonth(date.getMonth() + 1)
      break
    case "quarterly":
      date.setMonth(date.getMonth() + 3)
      break
    case "annually":
      date.setFullYear(date.getFullYear() + 1)
      break
    default:
      break
  }

  return date
}

module.exports = router

