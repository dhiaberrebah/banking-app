const express = require("express")
const router = express.Router()
const Account = require("../models/Account")
const { protect } = require("../middleware/auth")
const mongoose = require("mongoose")

// Get all accounts for a user
router.get("/", protect, async (req, res) => {
  try {
    const accounts = await Account.find({ userId: req.user.id })

    res.status(200).json({
      success: true,
      count: accounts.length,
      data: accounts,
    })
  } catch (error) {
    console.error("Get accounts error:", error)
    res.status(500).json({
      success: false,
      message: "Error retrieving accounts",
      error: error.message,
    })
  }
})

// Get account by ID
router.get("/:id", protect, async (req, res) => {
  try {
    const account = await Account.findById(req.params.id)

    if (!account) {
      return res.status(404).json({
        success: false,
        message: "Account not found",
      })
    }

    // Check if account belongs to user
    if (account.userId.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Not authorized to access this account",
      })
    }

    res.status(200).json({
      success: true,
      data: account,
    })
  } catch (error) {
    console.error("Get account error:", error)
    res.status(500).json({
      success: false,
      message: "Error retrieving account",
      error: error.message,
    })
  }
})

// Create a new account
router.post("/", protect, async (req, res) => {
  try {
    const { accountType, currency, nickname, initialDeposit } = req.body

    // Create account
    const account = await Account.create({
      userId: req.user.id,
      accountType,
      currency: currency || "USD",
      nickname: nickname || `${accountType.charAt(0).toUpperCase() + accountType.slice(1)} Account`,
      balance: initialDeposit || 0,
    })

    res.status(201).json({
      success: true,
      message: "Account created successfully",
      data: account,
    })
  } catch (error) {
    console.error("Create account error:", error)
    res.status(500).json({
      success: false,
      message: "Error creating account",
      error: error.message,
    })
  }
})

// Update account
router.put("/:id", protect, async (req, res) => {
  try {
    const { nickname, isActive } = req.body

    // Find account
    const account = await Account.findById(req.params.id)

    if (!account) {
      return res.status(404).json({
        success: false,
        message: "Account not found",
      })
    }

    // Check if account belongs to user
    if (account.userId.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Not authorized to update this account",
      })
    }

    // Update fields
    if (nickname !== undefined) account.nickname = nickname
    if (isActive !== undefined) account.isActive = isActive

    // Save updated account
    await account.save()

    res.status(200).json({
      success: true,
      message: "Account updated successfully",
      data: account,
    })
  } catch (error) {
    console.error("Update account error:", error)
    res.status(500).json({
      success: false,
      message: "Error updating account",
      error: error.message,
    })
  }
})

// Close account
router.delete("/:id", protect, async (req, res) => {
  try {
    const account = await Account.findById(req.params.id)

    if (!account) {
      return res.status(404).json({
        success: false,
        message: "Account not found",
      })
    }

    // Check if account belongs to user
    if (account.userId.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Not authorized to close this account",
      })
    }

    // Check if account has balance
    if (account.balance > 0) {
      return res.status(400).json({
        success: false,
        message: "Cannot close account with positive balance. Please transfer or withdraw funds first.",
      })
    }

    // Instead of deleting, mark as inactive
    account.isActive = false
    await account.save()

    res.status(200).json({
      success: true,
      message: "Account closed successfully",
    })
  } catch (error) {
    console.error("Close account error:", error)
    res.status(500).json({
      success: false,
      message: "Error closing account",
      error: error.message,
    })
  }
})

module.exports = router

