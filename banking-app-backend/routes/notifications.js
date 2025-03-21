const express = require("express")
const router = express.Router()
const Notification = require("../models/Notification")
const { protect } = require("../middleware/auth")

// Get all notifications for a user
router.get("/", protect, async (req, res) => {
  try {
    const { read, type, limit } = req.query

    // Build query
    const query = { userId: req.user.id }

    // Add filters if provided
    if (read !== undefined) {
      query.isRead = read === "true"
    }

    if (type) {
      query.type = type
    }

    // Execute query with optional limit
    const limitValue = Number.parseInt(limit) || 50

    const notifications = await Notification.find(query).sort({ createdAt: -1 }).limit(limitValue)

    res.status(200).json({
      success: true,
      count: notifications.length,
      data: notifications,
    })
  } catch (error) {
    console.error("Get notifications error:", error)
    res.status(500).json({
      success: false,
      message: "Error retrieving notifications",
      error: error.message,
    })
  }
})

// Get unread notification count
router.get("/unread-count", protect, async (req, res) => {
  try {
    const count = await Notification.countDocuments({
      userId: req.user.id,
      isRead: false,
    })

    res.status(200).json({
      success: true,
      count,
    })
  } catch (error) {
    console.error("Get unread count error:", error)
    res.status(500).json({
      success: false,
      message: "Error retrieving unread notification count",
      error: error.message,
    })
  }
})

// Mark notification as read
router.put("/:id/read", protect, async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id)

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: "Notification not found",
      })
    }

    // Check if notification belongs to user
    if (notification.userId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to update this notification",
      })
    }

    // Update notification
    notification.isRead = true
    await notification.save()

    res.status(200).json({
      success: true,
      message: "Notification marked as read",
      data: notification,
    })
  } catch (error) {
    console.error("Mark notification as read error:", error)
    res.status(500).json({
      success: false,
      message: "Error updating notification",
      error: error.message,
    })
  }
})

// Mark all notifications as read
router.put("/mark-all-read", protect, async (req, res) => {
  try {
    await Notification.updateMany({ userId: req.user.id, isRead: false }, { isRead: true })

    res.status(200).json({
      success: true,
      message: "All notifications marked as read",
    })
  } catch (error) {
    console.error("Mark all notifications as read error:", error)
    res.status(500).json({
      success: false,
      message: "Error updating notifications",
      error: error.message,
    })
  }
})

// Delete notification
router.delete("/:id", protect, async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id)

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: "Notification not found",
      })
    }

    // Check if notification belongs to user
    if (notification.userId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to delete this notification",
      })
    }

    await notification.remove()

    res.status(200).json({
      success: true,
      message: "Notification deleted successfully",
    })
  } catch (error) {
    console.error("Delete notification error:", error)
    res.status(500).json({
      success: false,
      message: "Error deleting notification",
      error: error.message,
    })
  }
})

module.exports = router

