"use client"

import { useEffect, useState } from "react"
import { Bell, Search } from "lucide-react"
import axios from "axios"
import { useAuthStore } from "../store/auth-store"
import { Link } from "react-router-dom"

type Notification = {
  _id: string
  title: string
  message: string
  createdAt: string
  type: string
  read: boolean
}

export function Header() {
  const { currentUser, logout } = useAuthStore()
  const [notificationDropdown, setNotificationDropdown] = useState(false)
  const [profileDropdown, setProfileDropdown] = useState(false)
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [notificationCount, setNotificationCount] = useState(0)
  
  // Format user name
  const userName = currentUser 
    ? `${currentUser.firstName} ${currentUser.lastName}`
    : "User"

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await axios.get(
          'http://localhost:5001/api/users/notifications?limit=5&read=false',
          { withCredentials: true }
        )
        
        if (response.data.success) {
          setNotifications(response.data.notifications)
          setNotificationCount(response.data.unreadCount)
        }
      } catch (error) {
        console.error("Error fetching notifications:", error)
      }
    }
    
    fetchNotifications()
    
    // Refresh notifications every 30 seconds
    const interval = setInterval(fetchNotifications, 30000)
    return () => clearInterval(interval)
  }, [])

  const handleLogout = async () => {
    try {
      await logout()
      setProfileDropdown(false)
      window.location.href = "/login"
    } catch (error) {
      console.error("Logout failed:", error)
    }
  }

  return (
    <header className="sticky top-0 z-10 bg-white border-b border-gray-200 px-6 py-3">
      <div className="flex items-center justify-between">
        <div className="relative w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            placeholder="Search..."
            className="w-full h-10 pl-10 pr-4 rounded-md border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div className="flex items-center gap-4">
          <div className="relative">
            <button
              className="relative p-2 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              onClick={() => setNotificationDropdown(!notificationDropdown)}
            >
              <Bell className="h-5 w-5 text-gray-600" />
              {notificationCount > 0 && (
                <span className="absolute top-0 right-0 h-4 w-4 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">
                  {notificationCount > 9 ? '9+' : notificationCount}
                </span>
              )}
            </button>
            {notificationDropdown && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg border border-gray-200 z-20">
                <div className="px-4 py-3 border-b border-gray-200 flex justify-between items-center">
                  <p className="font-medium text-gray-900">Notifications</p>
                  <Link to="/notifications" className="text-sm text-blue-600 hover:text-blue-800">View all</Link>
                </div>
                <div className="max-h-96 overflow-y-auto">
                  {notifications.length > 0 ? (
                    notifications.map(notification => (
                      <div key={notification._id} className="p-4 hover:bg-gray-50 border-b border-gray-100">
                        <p className="font-medium text-gray-900">{notification.title}</p>
                        <p className="text-sm text-gray-500 mt-1">{notification.message}</p>
                        <p className="text-xs text-gray-400 mt-1">
                          {new Date(notification.createdAt).toLocaleString()}
                        </p>
                      </div>
                    ))
                  ) : (
                    <div className="p-4 text-center text-gray-500">
                      No new notifications
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="relative">
            <button
              className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              onClick={() => setProfileDropdown(!profileDropdown)}
            >
              <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                <img
                  src="/placeholder.svg?height=32&width=32"
                  alt="User"
                  className="h-full w-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement
                    target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(userName)}&background=random`
                  }}
                />
              </div>
              <span className="font-medium text-gray-700">{userName}</span>
            </button>
            {profileDropdown && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 z-20">
                <div className="py-1">
                  <Link to="/settings" className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 block">
                    Profile
                  </Link>
                  <Link to="/settings" className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 block">
                    Settings
                  </Link>
                  <div className="border-t border-gray-100 my-1"></div>
                  <button 
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
