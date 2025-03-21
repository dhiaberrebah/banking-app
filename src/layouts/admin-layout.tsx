"use client"

import type React from "react"
import { useState } from "react"
import { Outlet, Link, useNavigate, useLocation } from "react-router-dom"
import { Users, Activity, CreditCard, FileText, Settings, Menu, X, LogOut, Home, Bell, Search } from "lucide-react"
import { useAuth } from "../contexts/auth-context"

const AdminLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { currentUser, logout } = useAuth()
  const navigate = useNavigate()
  // Removed unused location variable

  const handleLogout = () => {
    logout()
    navigate("/login")
  }

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen)
  }

  return (
    <div className="h-screen flex overflow-hidden bg-gray-100">
      {/* Mobile sidebar */}
      <div className={`md:hidden fixed inset-0 flex z-40 ${sidebarOpen ? "block" : "hidden"}`}>
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={toggleSidebar}></div>
        <div className="relative flex-1 flex flex-col max-w-xs w-full bg-blue-900">
          <div className="absolute top-0 right-0 -mr-12 pt-2">
            <button
              className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
              onClick={toggleSidebar}
            >
              <span className="sr-only">Close sidebar</span>
              <X className="h-6 w-6 text-white" />
            </button>
          </div>
          <div className="flex-1 h-0 pt-5 pb-4 overflow-y-auto">
            <div className="flex-shrink-0 flex items-center px-4">
              <h1 className="text-white font-bold text-xl">AMEN BANK ADMIN</h1>
            </div>
            <nav className="mt-5 px-2 space-y-1">
              <SidebarLinks />
            </nav>
          </div>
          <div className="flex-shrink-0 flex border-t border-blue-800 p-4">
            <button
              onClick={handleLogout}
              className="flex items-center w-full text-white hover:bg-blue-800 rounded-md px-3 py-2"
            >
              <LogOut className="mr-3 h-5 w-5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden md:flex md:flex-shrink-0">
        <div className="flex flex-col w-64">
          <div className="flex flex-col h-0 flex-1 bg-blue-900">
            <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
              <div className="flex items-center flex-shrink-0 px-4">
                <h1 className="text-white font-bold text-xl">AMEN BANK ADMIN</h1>
              </div>
              <nav className="mt-5 flex-1 px-2 space-y-1">
                <SidebarLinks />
              </nav>
            </div>
            <div className="flex-shrink-0 flex border-t border-blue-800 p-4">
              <button
                onClick={handleLogout}
                className="flex items-center w-full text-white hover:bg-blue-800 rounded-md px-3 py-2"
              >
                <LogOut className="mr-3 h-5 w-5" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col w-0 flex-1 overflow-hidden">
        <div className="relative z-10 flex-shrink-0 flex h-16 bg-white shadow">
          <button
            className="px-4 border-r border-gray-200 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-900 md:hidden"
            onClick={toggleSidebar}
          >
            <span className="sr-only">Open sidebar</span>
            <Menu className="h-6 w-6" />
          </button>
          <div className="flex-1 px-4 flex justify-between">
            <div className="flex-1 flex">
              <div className="w-full flex md:ml-0">
                <label htmlFor="search-field" className="sr-only">
                  Search
                </label>
                <div className="relative w-full text-gray-400 focus-within:text-gray-600">
                  <div className="absolute inset-y-0 left-0 flex items-center pointer-events-none pl-3">
                    <Search className="h-5 w-5" />
                  </div>
                  <input
                    id="search-field"
                    className="block w-full h-full pl-10 pr-3 py-2 border-transparent text-gray-900 placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-0 focus:border-transparent sm:text-sm"
                    placeholder="Search"
                    type="search"
                  />
                </div>
              </div>
            </div>
            <div className="ml-4 flex items-center md:ml-6">
              <button className="p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-900">
                <span className="sr-only">View notifications</span>
                <Bell className="h-6 w-6" />
              </button>

              <div className="ml-3 relative">
                <div className="flex items-center">
                  <span className="hidden md:block ml-3 text-sm font-medium text-gray-700">{currentUser?.name}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <main className="flex-1 relative overflow-y-auto focus:outline-none">
          <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
              <Outlet />
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

const SidebarLinks: React.FC = () => {
  const location = useLocation()

  // Check if the current path matches the given path
  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(`${path}/`)
  }

  return (
    <>
      <Link
        to="/admin"
        className={`text-white group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
          isActive("/admin") && location.pathname === "/admin" ? "bg-blue-800" : "hover:bg-blue-800"
        }`}
      >
        <Home className="mr-3 h-5 w-5" />
        Dashboard
      </Link>
      <Link
        to="/admin/users"
        className={`text-white group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
          isActive("/admin/users") ? "bg-blue-800" : "hover:bg-blue-800"
        }`}
      >
        <Users className="mr-3 h-5 w-5" />
        Users Management
      </Link>
      <Link
        to="/admin/activity"
        className={`text-white group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
          isActive("/admin/activity") ? "bg-blue-800" : "hover:bg-blue-800"
        }`}
      >
        <Activity className="mr-3 h-5 w-5" />
        Activity Logs
      </Link>
      <Link
        to="/admin/accounts"
        className={`text-white group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
          isActive("/admin/accounts") ? "bg-blue-800" : "hover:bg-blue-800"
        }`}
      >
        <CreditCard className="mr-3 h-5 w-5" />
        Accounts Management
      </Link>
      <Link
        to="/admin/loans"
        className={`text-white group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
          isActive("/admin/loans") ? "bg-blue-800" : "hover:bg-blue-800"
        }`}
      >
        <FileText className="mr-3 h-5 w-5" />
        Loan Applications
      </Link>
      <Link
        to="/admin/settings"
        className={`text-white group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
          isActive("/admin/settings") ? "bg-blue-800" : "hover:bg-blue-800"
        }`}
      >
        <Settings className="mr-3 h-5 w-5" />
        Settings
      </Link>
    </>
  )
}

export default AdminLayout

