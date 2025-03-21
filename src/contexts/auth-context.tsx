"use client"

import type React from "react"
import { createContext, useState, useContext, useEffect, type ReactNode } from "react"
import { mockUsers } from "../data/mock-data"
import type { User, AuthContextType, RegisterData } from "../types"

// Create the auth context
const AuthContext = createContext<AuthContextType | null>(null)

interface AuthProviderProps {
  children: ReactNode
  onAuthStateChanged?: (event: string, user: User | null) => void
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children, onAuthStateChanged }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null)

  useEffect(() => {
    // Check if user is stored in localStorage (simulating persistence)
    const storedUser = localStorage.getItem("currentUser")
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser)
        setCurrentUser(user)
        // Only call onAuthStateChanged if it's the initial load
        // This prevents infinite loops
        if (onAuthStateChanged && !currentUser) {
          onAuthStateChanged("init", user)
        }
      } catch (error) {
        console.error("Failed to parse stored user:", error)
        localStorage.removeItem("currentUser")
      }
    }
  }, []) // Empty dependency array - only run on mount

  // Login function
  const login = (email: string, password: string): boolean => {
    // Find user in mock data
    const user = mockUsers.find((user) => user.email === email && user.password === password)

    if (user) {
      // Remove password from stored user object
      const { password, ...userWithoutPassword } = user
      setCurrentUser(userWithoutPassword)
      localStorage.setItem("currentUser", JSON.stringify(userWithoutPassword))

      // Notify about auth state change
      if (onAuthStateChanged) {
        onAuthStateChanged("login", userWithoutPassword)
      }

      return true
    }
    return false
  }

  // Logout function
  const logout = (): void => {
    if (onAuthStateChanged && currentUser) {
      onAuthStateChanged("logout", null)
    }
    setCurrentUser(null)
    localStorage.removeItem("currentUser")
  }

  // Register function
  const register = (userData: RegisterData): boolean => {
    // In a real app, this would make an API call
    const newUser = {
      id: mockUsers.length + 1,
      ...userData,
      role: "user" as const,
    }

    // Log in the user after registration
    const { password, ...userWithoutPassword } = newUser
    setCurrentUser(userWithoutPassword)
    localStorage.setItem("currentUser", JSON.stringify(userWithoutPassword))

    // Notify about auth state change
    if (onAuthStateChanged) {
      onAuthStateChanged("register", userWithoutPassword)
    }

    return true
  }

  const value: AuthContextType = {
    currentUser,
    login,
    logout,
    register,
    isAuthenticated: !!currentUser,
    isAdmin: currentUser?.role === "admin",
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

// Custom hook to use the auth context
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

