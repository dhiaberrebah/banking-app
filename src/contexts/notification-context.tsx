"use client"

import type React from "react"
import { createContext, useState, useContext, useEffect, type ReactNode } from "react"
import { mockNotifications } from "../data/mock-data"
import type { Notification, NotificationContextType } from "../types"

// Create the notification context
const NotificationContext = createContext<NotificationContextType | null>(null)

interface NotificationProviderProps {
  children: ReactNode
  currentUserId?: number | null
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({ children, currentUserId }) => {
  const [notifications, setNotifications] = useState<Notification[]>([])

  // Update notifications when currentUserId changes
  useEffect(() => {
    if (currentUserId) {
      // In a real app, this would fetch from an API
      const userNotifications = mockNotifications.filter((notification) => notification.userId === currentUserId)

      // Sort by timestamp (newest first)
      const sortedNotifications = [...userNotifications].sort(
        (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
      )

      // Only update state if the notifications have actually changed
      // This helps prevent unnecessary re-renders
      const notificationsChanged =
        notifications.length !== sortedNotifications.length ||
        JSON.stringify(notifications) !== JSON.stringify(sortedNotifications)

      if (notificationsChanged) {
        setNotifications(sortedNotifications)
      }
    } else if (notifications.length > 0) {
      // Only clear if there are notifications to clear
      setNotifications([])
    }
  }, [currentUserId, notifications])

  // Calculate unread count
  const unreadCount = notifications.filter((notification) => !notification.isRead).length

  // Add a new notification
  const addNotification = (notification: Omit<Notification, "id" | "timestamp" | "isRead">) => {
    if (!currentUserId) return

    const newNotification: Notification = {
      ...notification,
      id: Date.now(), // Generate a unique ID
      timestamp: new Date().toISOString(),
      isRead: false,
    }

    setNotifications((prev) => [newNotification, ...prev])

    // Show browser notification if supported
    if ("Notification" in window && Notification.permission === "granted") {
      new Notification(notification.title, {
        body: notification.message,
      })
    }
  }

  // Mark a notification as read
  const markAsRead = (id: number) => {
    setNotifications((prev) =>
      prev.map((notification) => (notification.id === id ? { ...notification, isRead: true } : notification)),
    )
  }

  // Mark all notifications as read
  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((notification) => ({ ...notification, isRead: true })))
  }

  // Clear all notifications
  const clearNotifications = () => {
    setNotifications([])
  }

  // Request notification permission on mount
  useEffect(() => {
    if ("Notification" in window && Notification.permission !== "denied") {
      Notification.requestPermission()
    }
  }, [])

  const value: NotificationContextType = {
    notifications,
    unreadCount,
    addNotification,
    markAsRead,
    markAllAsRead,
    clearNotifications,
  }

  return <NotificationContext.Provider value={value}>{children}</NotificationContext.Provider>
}

// Custom hook to use the notification context
export const useNotifications = (): NotificationContextType => {
  const context = useContext(NotificationContext)
  if (!context) {
    throw new Error("useNotifications must be used within a NotificationProvider")
  }
  return context
}

