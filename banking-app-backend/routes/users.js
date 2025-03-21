const express = require("express")
const router = express.Router()
const User = require("../models/User")
const { protect, authorize } = require("../middleware/auth")
const bcrypt = require("bcryptjs")

// Get all users (admin only)
router.get("/", protect, authorize("admin"), async (req, res) => {
  try {
    const users = await User.find().select("-password")

    res.status(200).json({
      success: true,
      count: users.length,
      data: users,
    })
  } catch (error) {
    console.error("Get all users error:", error)
    res.status(500).json({
      success: false,
      message: "Error retrieving users",
      error: error.message,
    })
  }
})

// Get user by ID (admin or own user)
router.get("/:id", protect, async (req, res) => {
  try {
    // Check if user is admin or requesting their own data
    if (req.user.role !== "admin" && req.user.id !== req.params.id) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to access this user data",
      })
    }

    const user = await User.findById(req.params.id).select("-password")

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      })
    }

    res.status(200).json({
      success: true,
      data: user,
    })
  } catch (error) {
    console.error("Get user by ID error:", error)
    res.status(500).json({
      success: false,
      message: "Error retrieving user",
      error: error.message,
    })
  }
})

// Update user (own user)
router.put("/:id", protect, async (req, res) => {
  try {
    // Check if user is updating their own data
    if (req.user.id !== req.params.id) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to update this user",
      })
    }

    const { firstName, lastName, phoneNumber, address } = req.body

    // Find user
    const user = await User.findById(req.params.id)

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      })
    }

    // Update user fields
    if (firstName) user.firstName = firstName
    if (lastName) user.lastName = lastName
    if (phoneNumber) user.phoneNumber = phoneNumber
    if (address) user.address = address

    // Save updated user
    await user.save()

    res.status(200).json({
      success: true,
      message: "User updated successfully",
      data: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phoneNumber: user.phoneNumber,
        address: user.address,
        role: user.role,
      },
    })
  } catch (error) {
    console.error("Update user error:", error)
    res.status(500).json({
      success: false,
      message: "Error updating user",
      error: error.message,
    })
  }
})

// Change password
router.put("/change-password/:id", protect, async (req, res) => {
  try {
    // Check if user is changing their own password
    if (req.user.id !== req.params.id) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to change this user's password",
      })
    }

    const { currentPassword, newPassword } = req.body

    // Validate input
    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Please provide current and new password",
      })
    }

    // Find user with password
    const user = await User.findById(req.params.id).select("+password")

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      })
    }

    // Check if current password matches
    const isMatch = await user.comparePassword(currentPassword)
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Current password is incorrect",
      })
    }

    // Update password
    user.password = newPassword
    await user.save()

    res.status(200).json({
      success: true,
      message: "Password updated successfully",
    })
  } catch (error) {
    console.error("Change password error:", error)
    res.status(500).json({
      success: false,
      message: "Error changing password",
      error: error.message,
    })
  }
})

// Enable/disable two-factor authentication
router.put("/two-factor/:id", protect, async (req, res) => {
  try {
    // Check if user is updating their own 2FA
    if (req.user.id !== req.params.id) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to update this user's 2FA settings",
      })
    }

    const { enable } = req.body

    // Find user
    const user = await User.findById(req.params.id)

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      })
    }

    // Update 2FA status
    user.twoFactorEnabled = enable

    // If enabling 2FA, generate a secret
    if (enable && !user.twoFactorSecret) {
      // In a real app, you would use a library like speakeasy to generate a secret
      // For this example, we'll just use a placeholder
      user.twoFactorSecret = "GENERATED_SECRET_" + Date.now()
    }

    await user.save()

    res.status(200).json({
      success: true,
      message: `Two-factor authentication ${enable ? "enabled" : "disabled"} successfully`,
      data: {
        twoFactorEnabled: user.twoFactorEnabled,
      },
    })
  } catch (error) {
    console.error("Two-factor update error:", error)
    res.status(500).json({
      success: false,
      message: "Error updating two-factor authentication",
      error: error.message,
    })
  }
})

// Delete user (admin only)
router.delete("/:id", protect, authorize("admin"), async (req, res) => {
  try {
    const user = await User.findById(req.params.id)

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      })
    }

    await user.remove()

    res.status(200).json({
      success: true,
      message: "User deleted successfully",
    })
  } catch (error) {
    console.error("Delete user error:", error)
    res.status(500).json({
      success: false,
      message: "Error deleting user",
      error: error.message,
    })
  }
})

module.exports = router

