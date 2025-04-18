import { useState } from "react"
import { NavLink } from "react-router-dom"
import { LayoutDashboard, Users, User, History, CreditCard, Calculator, Menu, X, LogOut } from "lucide-react"

const AdminSidebar = () => {
  const [expanded, setExpanded] = useState(true)

  const menuItems = [
    {
      title: "Dashboard",
      icon: LayoutDashboard,
      path: "/admin",
    },
    {
      title: "User Management",
      icon: Users,
      path: "/admin/users",
    },
    {
      title: "Admin Profile",
      icon: User,
      path: "/admin/profile",
    },
    {
      title: "Transaction History",
      icon: History,
      path: "/admin/permissions",
    },
    {
      title: "Account Requests",
      icon: CreditCard,
      path: "/admin/requests/accounts",
    },
    {
      title: "Loan Requests",
      icon: Calculator,
      path: "/admin/requests/loans",
    },
  ]

  const toggleSidebar = () => setExpanded(!expanded)

  const sidebarClass = expanded
    ? "w-[var(--sidebar-width)] transition-all duration-300"
    : "w-[60px] transition-all duration-300"

  return (
    <div className={`bg-blue-800 text-white flex flex-col h-full ${sidebarClass}`}>
      <div className="flex items-center justify-between p-4 border-b border-blue-700">
        <h1 className={`text-xl font-bold ${expanded ? "block" : "hidden"}`}>ADMIN PANEL</h1>
        <button onClick={toggleSidebar} className="text-white p-1 rounded-md hover:bg-blue-700 transition-colors">
          {expanded ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      <div className="flex-1 overflow-y-auto py-4">
        <ul className="space-y-2 px-2">
          {menuItems.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center p-2 rounded-md transition-colors ${
                    isActive ? "bg-blue-900 text-white" : "text-blue-100 hover:bg-blue-700"
                  }`
                }
              >
                <item.icon size={20} />
                {expanded && <span className="ml-3">{item.title}</span>}
              </NavLink>
            </li>
          ))}
        </ul>
      </div>

      <div className="p-4 border-t border-blue-700">
        <NavLink
          to="/login"
          className="flex items-center p-2 rounded-md text-blue-100 hover:bg-blue-700 transition-colors"
        >
          <LogOut size={20} />
          {expanded && <span className="ml-3">Logout</span>}
        </NavLink>
      </div>
    </div>
  )
}

export default AdminSidebar
