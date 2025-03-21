"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { Bell, X, Check, Info, AlertCircle, CheckCircle } from "lucide-react"
import { useNotifications } from "../contexts/notification-context"
import { Link } from "react-router-dom"

const NotificationBell: React.FC = () => {
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications()
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  const toggleDropdown = () => {
    setIsOpen(!isOpen)
  }

  const handleMarkAsRead = (id: number, event: React.MouseEvent) => {
    event.stopPropagation()
    markAsRead(id)
  }

  const handleMarkAllAsRead = (event: React.MouseEvent) => {
    event.stopPropagation()
    markAllAsRead()
  }

  // Get icon based on notification type
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "success":
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case "warning":
        return <AlertCircle className="h-5 w-5 text-yellow-500" />
      case "error":
        return <X className="h-5 w-5 text-red-500" />
      case "info":
      default:
        return <Info className="h-5 w-5 text-blue-500" />
    }
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={toggleDropdown}
        className="p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-900 relative"
        aria-label="Notifications"
      >
        <Bell className="h-6 w-6" />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="origin-top-right absolute right-0 mt-2 w-80 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50">
          <div className="py-2">
            <div className="px-4 py-2 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-sm font-medium text-gray-900">Notifications</h3>
              {unreadCount > 0 && (
                <button
                  onClick={handleMarkAllAsRead}
                  className="text-xs text-blue-900 hover:text-blue-800 flex items-center"
                >
                  <Check className="h-3 w-3 mr-1" />
                  Mark all as read
                </button>
              )}
            </div>

            <div className="max-h-80 overflow-y-auto">
              {notifications.length > 0 ? (
                notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`px-4 py-3 hover:bg-gray-50 ${!notification.isRead ? "bg-blue-50" : ""}`}
                  >
                    <div className="flex items-start">
                      <div className="flex-shrink-0 mt-0.5">{getNotificationIcon(notification.type)}</div>
                      <div className="ml-3 w-0 flex-1">
                        {notification.link ? (
                          <Link
                            to={notification.link}
                            className="text-sm font-medium text-gray-900 hover:text-blue-900"
                            onClick={() => markAsRead(notification.id)}
                          >
                            {notification.title}
                          </Link>
                        ) : (
                          <p className="text-sm font-medium text-gray-900">{notification.title}</p>
                        )}
                        <p className="text-sm text-gray-500">{notification.message}</p>
                        <p className="mt-1 text-xs text-gray-400">
                          {new Date(notification.timestamp).toLocaleString()}
                        </p>
                      </div>
                      {!notification.isRead && (
                        <div className="ml-3 flex-shrink-0">
                          <button
                            onClick={(e) => handleMarkAsRead(notification.id, e)}
                            className="bg-white rounded-md inline-flex text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-900"
                          >
                            <span className="sr-only">Mark as read</span>
                            <Check className="h-4 w-4" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="px-4 py-6 text-center text-sm text-gray-500">No notifications to display</div>
              )}
            </div>

            <div className="px-4 py-2 border-t border-gray-200">
              <Link
                to="/dashboard/notifications"
                className="text-xs text-blue-900 hover:text-blue-800 flex justify-center"
                onClick={() => setIsOpen(false)}
              >
                View all notifications
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default NotificationBell

