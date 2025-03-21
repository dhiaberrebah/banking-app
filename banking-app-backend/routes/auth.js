const express = require("express")
const router = express.Router()
const User = require("../models/User")
const { protect } = require("../middleware/auth")
const jwt = require("jsonwebtoken")
const ActivityLog = require("../models/ActivityLog")

// Register a new user
router.post("/register", async (req, res) => {
  try {
    const { firstName, lastName, email, password, phoneNumber } = req.body

    // Check if user already exists
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Email already registered",
      })
    }

    // Create new user
    const user = await User.create({
      firstName,
      lastName,
      email,
      password,
      phoneNumber,
    })

    // Create activity log
    await ActivityLog.create({
      userId: user._id,
      action: "User Registration",
      details: "New user account created",
      ipAddress: req.ip,
      userAgent: req.headers["user-agent"],
    })

    // Generate token
    const token = user.generateAuthToken()
    const refreshToken = user.generateRefreshToken()

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      token,
      refreshToken,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
      },
    })
  } catch (error) {
    console.error("Registration error:", error)
    res.status(500).json({
      success: false,
      message: "Error registering user",
      error: error.message,
    })
  }
})

// Login user
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body

    // Check if email and password are provided
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide email and password",
      })
    }

    // Find user by email and include password
    const user = await User.findOne({ email }).select("+password")

    // Check if user exists
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      })
    }

    // Check if password matches
    const isMatch = await user.comparePassword(password)
    if (!isMatch) {
      // Log failed login attempt
      await ActivityLog.create({
        userId: user._id,
        action: "Login Attempt",
        details: "Failed login attempt - incorrect password",
        ipAddress: req.ip,
        userAgent: req.headers["user-agent"],
        status: "failed",
      })

      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      })
    }

    // Update last login
    user.lastLogin = Date.now()
    await user.save()

    // Log successful login
    await ActivityLog.create({
      userId: user._id,
      action: "User Login",
      details: "User logged in successfully",
      ipAddress: req.ip,
      userAgent: req.headers["user-agent"],
    })

    // Generate token
    const token = user.generateAuthToken()
    const refreshToken = user.generateRefreshToken()

    res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      refreshToken,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
      },
    })
  } catch (error) {
    console.error("Login error:", error)
    res.status(500).json({
      success: false,
      message: "Error logging in",
      error: error.message,
    })
  }
})

// Get current user
router.get("/me", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id)

    res.status(200).json({
      success: true,
      data: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phoneNumber: user.phoneNumber,
        role: user.role,
        isVerified: user.isVerified,
        twoFactorEnabled: user.twoFactorEnabled,
        lastLogin: user.lastLogin,
        createdAt: user.createdAt,
      },
    })
  } catch (error) {
    console.error("Get current user error:", error)
    res.status(500).json({
      success: false,
      message: "Error getting user data",
      error: error.message,
    })
  }
})

// Refresh token
router.post("/refresh-token", async (req, res) => {
  try {
    const { refreshToken } = req.body

    if (!refreshToken) {
      return res.status(400).json({
        success: false,
        message: "Refresh token is required",
      })
    }

    // Verify refresh token
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET)

    // Find user
    const user = await User.findById(decoded.id)
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid refresh token",
      })
    }

    // Generate new tokens
    const newToken = user.generateAuthToken()
    const newRefreshToken = user.generateRefreshToken()

    res.status(200).json({
      success: true,
      token: newToken,
      refreshToken: newRefreshToken,
    })
  } catch (error) {
    console.error("Refresh token error:", error)
    res.status(401).json({
      success: false,
      message: "Invalid or expired refresh token",
      error: error.message,
    })
  }
})

// Logout user
router.post("/logout", protect, async (req, res) => {
  try {
    // Log logout activity
    await ActivityLog.create({
      userId: req.user.id,
      action: "User Logout",
      details: "User logged out successfully",
      ipAddress: req.ip,
      userAgent: req.headers["user-agent"],
    })

    res.status(200).json({
      success: true,
      message: "Logged out successfully",
    })
  } catch (error) {
    console.error("Logout error:", error)
    res.status(500).json({
      success: false,
      message: "Error logging out",
      error: error.message,
    })
  }
})

module.exports = router

