const express = require("express")
const router = express.Router()
const Transaction = require("../models/Transaction")
const Account = require("../models/Account")
const { protect } = require("../middleware/auth")
const mongoose = require("mongoose")
const Notification = require("../models/Notification")

// Get all transactions for a user
router.get("/", protect, async (req, res) => {
  try {
    const { startDate, endDate, type, account, minAmount, maxAmount, sort } = req.query

    // Build query
    const query = { userId: req.user.id }

    // Add filters if provided
    if (startDate && endDate) {
      query.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      }
    } else if (startDate) {
      query.createdAt = { $gte: new Date(startDate) }
    } else if (endDate) {
      query.createdAt = { $lte: new Date(endDate) }
    }

    if (type) {
      query.transactionType = type
    }

    if (account) {
      query.$or = [{ fromAccount: account }, { toAccount: account }]
    }

    if (minAmount && maxAmount) {
      query.amount = { $gte: minAmount, $lte: maxAmount }
    } else if (minAmount) {
      query.amount = { $gte: minAmount }
    } else if (maxAmount) {
      query.amount = { $lte: maxAmount }
    }

    // Build sort object
    let sortObj = { createdAt: -1 } // Default sort by date desc
    if (sort) {
      const [field, order] = sort.split(":")
      sortObj = { [field]: order === "asc" ? 1 : -1 }
    }

    // Execute query with pagination
    const page = Number.parseInt(req.query.page, 10) || 1
    const limit = Number.parseInt(req.query.limit, 10) || 10
    const startIndex = (page - 1) * limit

    const total = await Transaction.countDocuments(query)
    const transactions = await Transaction.find(query)
      .sort(sortObj)
      .skip(startIndex)
      .limit(limit)
      .populate("fromAccount", "accountNumber accountType nickname")
      .populate("toAccount", "accountNumber accountType nickname")

    res.status(200).json({
      success: true,
      count: transactions.length,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit),
      },
      data: transactions,
    })
  } catch (error) {
    console.error("Get transactions error:", error)
    res.status(500).json({
      success: false,
      message: "Error retrieving transactions",
      error: error.message,
    })
  }
})

// Get transaction by ID
router.get("/:id", protect, async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id)
      .populate("fromAccount", "accountNumber accountType nickname")
      .populate("toAccount", "accountNumber accountType nickname")

    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: "Transaction not found",
      })
    }

    // Check if transaction belongs to user
    if (transaction.userId.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Not authorized to access this transaction",
      })
    }

    res.status(200).json({
      success: true,
      data: transaction,
    })
  } catch (error) {
    console.error("Get transaction error:", error)
    res.status(500).json({
      success: false,
      message: "Error retrieving transaction",
      error: error.message,
    })
  }
})

// Create a transfer transaction
router.post("/transfer", protect, async (req, res) => {
  // Start a session for transaction
  const session = await mongoose.startSession()
  session.startTransaction()

  try {
    const { fromAccountId, toAccountId, amount, description } = req.body

    // Validate input
    if (!fromAccountId || !toAccountId || !amount) {
      return res.status(400).json({
        success: false,
        message: "Please provide fromAccountId, toAccountId, and amount",
      })
    }

    if (amount <= 0) {
      return res.status(400).json({
        success: false,
        message: "Amount must be greater than 0",
      })
    }

    // Check if accounts exist and belong to user
    const fromAccount = await Account.findOne({
      _id: fromAccountId,
      userId: req.user.id,
      isActive: true,
    }).session(session)

    if (!fromAccount) {
      await session.abortTransaction()
      session.endSession()
      return res.status(404).json({
        success: false,
        message: "Source account not found or inactive",
      })
    }

    // For toAccount, we allow transfers to other users' accounts
    const toAccount = await Account.findOne({
      _id: toAccountId,
      isActive: true,
    }).session(session)

    if (!toAccount) {
      await session.abortTransaction()
      session.endSession()
      return res.status(404).json({
        success: false,
        message: "Destination account not found or inactive",
      })
    }

    // Check if source account has sufficient funds
    if (fromAccount.balance < amount) {
      await session.abortTransaction()
      session.endSession()
      return res.status(400).json({
        success: false,
        message: "Insufficient funds",
      })
    }

    // Update account balances
    fromAccount.balance -= amount
    toAccount.balance += amount

    await fromAccount.save({ session })
    await toAccount.save({ session })

    // Create transaction record
    const transaction = await Transaction.create(
      [
        {
          userId: req.user.id,
          fromAccount: fromAccountId,
          toAccount: toAccountId,
          transactionType: "transfer",
          amount,
          description: description || "Transfer",
          status: "completed",
        },
      ],
      { session },
    )

    // Create notification for sender
    await Notification.create(
      [
        {
          userId: req.user.id,
          title: "Transfer Completed",
          message: `You have successfully transferred $${amount} to account ending in ${toAccount.accountNumber.slice(-4)}.`,
          type: "transaction",
        },
      ],
      { session },
    )

    // Create notification for receiver if it's a different user
    if (toAccount.userId.toString() !== req.user.id) {
      await Notification.create(
        [
          {
            userId: toAccount.userId,
            title: "Funds Received",
            message: `You have received $${amount} in your account ending in ${toAccount.accountNumber.slice(-4)}.`,
            type: "transaction",
          },
        ],
        { session },
      )
    }

    // Commit the transaction
    await session.commitTransaction()
    session.endSession()

    res.status(201).json({
      success: true,
      message: "Transfer completed successfully",
      data: transaction[0],
    })
  } catch (error) {
    // Abort transaction on error
    await session.abortTransaction()
    session.endSession()

    console.error("Transfer error:", error)
    res.status(500).json({
      success: false,
      message: "Error processing transfer",
      error: error.message,
    })
  }
})

// Create a deposit transaction
router.post("/deposit", protect, async (req, res) => {
  const session = await mongoose.startSession()
  session.startTransaction()

  try {
    const { accountId, amount, description } = req.body

    // Validate input
    if (!accountId || !amount) {
      return res.status(400).json({
        success: false,
        message: "Please provide accountId and amount",
      })
    }

    if (amount <= 0) {
      return res.status(400).json({
        success: false,
        message: "Amount must be greater than 0",
      })
    }

    // Check if account exists and belongs to user
    const account = await Account.findOne({
      _id: accountId,
      userId: req.user.id,
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

    // Update account balance
    account.balance += amount
    await account.save({ session })

    // Create transaction record
    const transaction = await Transaction.create(
      [
        {
          userId: req.user.id,
          toAccount: accountId,
          transactionType: "deposit",
          amount,
          description: description || "Deposit",
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
          title: "Deposit Completed",
          message: `You have successfully deposited $${amount} to your account ending in ${account.accountNumber.slice(-4)}.`,
          type: "transaction",
        },
      ],
      { session },
    )

    // Commit the transaction
    await session.commitTransaction()
    session.endSession()

    res.status(201).json({
      success: true,
      message: "Deposit completed successfully",
      data: transaction[0],
    })
  } catch (error) {
    // Abort transaction on error
    await session.abortTransaction()
    session.endSession()

    console.error("Deposit error:", error)
    res.status(500).json({
      success: false,
      message: "Error processing deposit",
      error: error.message,
    })
  }
})

// Create a withdrawal transaction
router.post("/withdrawal", protect, async (req, res) => {
  const session = await mongoose.startSession()
  session.startTransaction()

  try {
    const { accountId, amount, description } = req.body

    // Validate input
    if (!accountId || !amount) {
      return res.status(400).json({
        success: false,
        message: "Please provide accountId and amount",
      })
    }

    if (amount <= 0) {
      return res.status(400).json({
        success: false,
        message: "Amount must be greater than 0",
      })
    }

    // Check if account exists and belongs to user
    const account = await Account.findOne({
      _id: accountId,
      userId: req.user.id,
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
    if (account.balance < amount) {
      await session.abortTransaction()
      session.endSession()
      return res.status(400).json({
        success: false,
        message: "Insufficient funds",
      })
    }

    // Update account balance
    account.balance -= amount
    await account.save({ session })

    // Create transaction record
    const transaction = await Transaction.create(
      [
        {
          userId: req.user.id,
          fromAccount: accountId,
          transactionType: "withdrawal",
          amount,
          description: description || "Withdrawal",
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
          title: "Withdrawal Completed",
          message: `You have successfully withdrawn $${amount} from your account ending in ${account.accountNumber.slice(-4)}.`,
          type: "transaction",
        },
      ],
      { session },
    )

    // Commit the transaction
    await session.commitTransaction()
    session.endSession()

    res.status(201).json({
      success: true,
      message: "Withdrawal completed successfully",
      data: transaction[0],
    })
  } catch (error) {
    // Abort transaction on error
    await session.abortTransaction()
    session.endSession()

    console.error("Withdrawal error:", error)
    res.status(500).json({
      success: false,
      message: "Error processing withdrawal",
      error: error.message,
    })
  }
})

module.exports = router

