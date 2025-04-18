import { useState } from "react"
import { Bell, Search, User } from 'lucide-react'
import Dropdown from "../ui/Dropdown"

const AdminHeader = () => {
  const [showNotifications, setShowNotifications] = useState(false)
  const [showProfile, setShowProfile] = useState(false)

  const notifications = [
    {
      id: 1,
      title: "New account request",
      message: "Ahmed Ben Ali has requested a new account",
      time: "5 minutes ago",
      read: false,
    },
    {
      id: 2,
      title: "Suspicious login attempt",
      message: "Multiple failed login attempts detected for user ID #4587",
      time: "20 minutes ago",
      read: false,
    },
    {
      id: 3,
      title: "System update",
      message: "System maintenance scheduled for tonight at 2:00 AM",
      time: "1 hour ago",
      read: true,
    },
  ]

  return (
    <header className="bg-white border-b border-gray-200 py-3 px-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <h2 className="text-xl font-semibold text-gray-800">Administration</h2>
        </div>

        <div className="flex items-center space-x-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search..."
              className="py-2 pl-10 pr-4 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div className="relative">
            <button
              className="relative p-2 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              onClick={() => setShowNotifications(!showNotifications)}
            >
              <Bell className="h-5 w-5 text-gray-600" />
              <span className="absolute top-0 right-0 h-4 w-4 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">
                2
              </span>
            </button>

            {showNotifications && (
              <Dropdown className="right-0 mt-2 w-80" onClose={() => setShowNotifications(false)}>
                <Dropdown.Header className="text-gray-700">Notifications</Dropdown.Header>
                <Dropdown.Divider />
                {notifications.map((notification) => (
                  <div key={notification.id} className="p-3 hover:bg-gray-50">
                    <div className="flex items-start">
                      <div className={`w-2 h-2 mt-1 rounded-full ${notification.read ? "bg-gray-300" : "bg-blue-500"}`} />
                      <div className="ml-2">
                        <p className="text-sm font-medium text-gray-900">{notification.title}</p>
                        <p className="text-sm text-gray-500">{notification.message}</p>
                        <p className="text-xs text-gray-400 mt-1">{notification.time}</p>
                      </div>
                    </div>
                  </div>
                ))}
                <Dropdown.Divider />
                <div className="p-2 text-center">
                  <button className="text-sm text-blue-600 hover:text-blue-800">View all notifications</button>
                </div>
              </Dropdown>
            )}
          </div>

          <div className="relative">
            <button
              className="flex items-center space-x-2 focus:outline-none"
              onClick={() => setShowProfile(!showProfile)}
            >
              <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center text-white">
                <User className="h-5 w-5" />
              </div>
              <span className="text-sm font-medium text-gray-700">Admin User</span>
            </button>

            {showProfile && (
              <Dropdown className="right-0 mt-2 w-48" onClose={() => setShowProfile(false)}>
                <Dropdown.Item>Profile</Dropdown.Item>
                <Dropdown.Item>Settings</Dropdown.Item>
                <Dropdown.Divider />
                <Dropdown.Item>Logout</Dropdown.Item>
              </Dropdown>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}

export default AdminHeader
