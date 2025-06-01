import { useState } from "react"
import { Search, User } from 'lucide-react'
import Dropdown from "../ui/Dropdown"
import { useAuthStore } from "../../store/auth-store"
import { Link, useNavigate } from "react-router-dom"

const AdminHeader = () => {
  const [showProfile, setShowProfile] = useState(false)
  const { currentUser, logout } = useAuthStore()
  const navigate = useNavigate()

  // Format user name
  const userName = currentUser 
    ? `${currentUser.firstName} ${currentUser.lastName}`
    : "Admin User"

  const handleLogout = async () => {
    try {
      await logout()
      setShowProfile(false)
      navigate("/login")
    } catch (error) {
      console.error("Logout failed:", error)
    }
  }

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
              className="flex items-center space-x-2 focus:outline-none"
              onClick={() => setShowProfile(!showProfile)}
            >
              <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center text-white">
                <User className="h-5 w-5" />
              </div>
              <span className="text-sm font-medium text-gray-700">{userName}</span>
            </button>

            {showProfile && (
              <Dropdown className="right-0 mt-2 w-48" onClose={() => setShowProfile(false)}>
                <Dropdown.Item>
                  <Link to="/admin/profile" className="w-full block">Profile</Link>
                </Dropdown.Item>
                <Dropdown.Divider />
                <Dropdown.Item>
                  <button onClick={handleLogout} className="w-full text-left">Logout</button>
                </Dropdown.Item>
              </Dropdown>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}

export default AdminHeader
