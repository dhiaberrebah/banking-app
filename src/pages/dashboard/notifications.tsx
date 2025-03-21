"use client"

import type React from "react"
import { useState } from "react"
import { useNotifications } from "../../contexts/notification-context"
import { Search, Filter, Trash2, CheckCircle, AlertCircle, Info, X } from "lucide-react"
import { Link } from "react-router-dom"

const NotificationsPage: React.FC = () => {
  const { notifications, markAsRead, markAllAsRead, clearNotifications } = useNotifications()
  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState("all")
  const [filterRead, setFilterRead] = useState("all")

  // Filter notifications based on search term and filters
  const filteredNotifications = notifications.filter((notification) => {
    const matchesSearch =
      notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      notification.message.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesType = filterType === "all" || notification.type === filterType

    const matchesRead =
      filterRead === "all" ||
      (filterRead === "read" && notification.isRead) ||
      (filterRead === "unread" && !notification.isRead)

    return matchesSearch && matchesType && matchesRead
  })

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
    <div>
      <h1 className="text-2xl font-semibold text-gray-900">Notifications</h1>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="md:col-span-2 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search notifications..."
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-blue-900 focus:border-blue-900 sm:text-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Filter className="h-5 w-5 text-gray-400" />
          </div>
          <select
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-blue-900 focus:border-blue-900 sm:text-sm"
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
          >
            <option value="all">All Types</option>
            <option value="info">Information</option>
            <option value="success">Success</option>
            <option value="warning">Warning</option>
            <option value="error">Error</option>
          </select>
        </div>

        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Filter className="h-5 w-5 text-gray-400" />
          </div>
          <select
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-blue-900 focus:border-blue-900 sm:text-sm"
            value={filterRead}
            onChange={(e) => setFilterRead(e.target.value)}
          >
            <option value="all">All Status</option>
            <option value="read">Read</option>
            <option value="unread">Unread</option>
          </select>
        </div>
      </div>

      <div className="mt-4 flex justify-end space-x-3">
        <button
          onClick={markAllAsRead}
          className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-900"
        >
          <CheckCircle className="mr-2 h-4 w-4" />
          Mark all as read
        </button>
        <button
          onClick={clearNotifications}
          className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-900"
        >
          <Trash2 className="mr-2 h-4 w-4" />
          Clear all
        </button>
      </div>

      <div className="mt-6 bg-white shadow overflow-hidden sm:rounded-lg">
        {filteredNotifications.length > 0 ? (
          <ul className="divide-y divide-gray-200">
            {filteredNotifications.map((notification) => (
              <li key={notification.id} className={`p-4 hover:bg-gray-50 ${!notification.isRead ? "bg-blue-50" : ""}`}>
                <div className="flex items-start">
                  <div className="flex-shrink-0 mt-0.5">{getNotificationIcon(notification.type)}</div>
                  <div className="ml-3 flex-1">
                    <div className="flex items-center justify-between">
                      <div>
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
                      </div>
                      <p className="text-xs text-gray-400">{new Date(notification.timestamp).toLocaleString()}</p>
                    </div>
                    {!notification.isRead && (
                      <button
                        onClick={() => markAsRead(notification.id)}
                        className="mt-2 inline-flex items-center px-2.5 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-900"
                      >
                        <CheckCircle className="mr-1 h-3 w-3" />
                        Mark as read
                      </button>
                    )}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="py-12 text-center">
            <Info className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No notifications</h3>
            <p className="mt-1 text-sm text-gray-500">You don't have any notifications at the moment.</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default NotificationsPage

