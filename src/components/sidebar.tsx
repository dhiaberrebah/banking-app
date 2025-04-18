"use client"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { Home, CreditCard, History, Send, Calculator, Bell, HelpCircle, Settings, LogOut } from "lucide-react"
import { useAuthStore } from "../store/auth-store"

export function Sidebar() {
  const location = useLocation()
  const navigate = useNavigate()
  const { logout } = useAuthStore()

  const menuItems = [
    {
      title: "Dashboard",
      icon: Home,
      href: "/dashboard",
    },
    {
      title: "My Accounts",
      icon: CreditCard,
      href: "/accounts",
    },
    {
      title: "New Account",
      icon: CreditCard,
      href: "/new-account",
    },
    {
      title: "Transaction History",
      icon: History,
      href: "/transactions",
    },
    {
      title: "Transfer Money",
      icon: Send,
      href: "/transfers",
    },
    {
      title: "Loan Simulator",
      icon: Calculator,
      href: "/loans",
    },
    {
      title: "Notifications",
      icon: Bell,
      href: "/notifications",
    },
    {
      title: "Support",
      icon: HelpCircle,
      href: "/support",
    },
    {
      title: "Settings",
      icon: Settings,
      href: "/settings",
    },
  ]

  const handleLogout = async () => {
    try {
      await logout()
      navigate("/login")
    } catch (error) {
      console.error("Logout failed:", error)
    }
  }

  return (
    <div className="h-full w-64 bg-[#1e3a8a] text-white">
      <div className="flex items-center justify-between p-4 border-b border-blue-800">
        <h1 className="text-xl font-bold">AMEN BANK</h1>
      </div>

      <div className="py-4">
        <nav className="space-y-1 px-2">
          {menuItems.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              className={`flex items-center px-4 py-3 text-sm rounded-md transition-colors ${
                location.pathname === item.href
                  ? "bg-blue-800 text-white"
                  : "text-blue-100 hover:bg-blue-800 hover:text-white"
              }`}
            >
              <item.icon className="h-5 w-5 mr-3" />
              <span>{item.title}</span>
            </Link>
          ))}
        </nav>
      </div>

      <div className="absolute bottom-0 w-64 p-4 border-t border-blue-800">
        <button
          onClick={handleLogout}
          className="flex items-center px-4 py-3 text-sm rounded-md text-blue-100 hover:bg-blue-800 hover:text-white transition-colors w-full"
        >
          <LogOut className="h-5 w-5 mr-3" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  )
}
