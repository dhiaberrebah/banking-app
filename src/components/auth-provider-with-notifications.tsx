"use client"

import type React from "react"
import { AuthProvider } from "../contexts/auth-context"
import { useNotifications } from "../contexts/notification-context"
import type { User } from "../types"

interface AuthProviderWithNotificationsProps {
  children: React.ReactNode
}

const AuthProviderWithNotifications: React.FC<AuthProviderWithNotificationsProps> = ({ children }) => {
  const { addNotification } = useNotifications()

  const handleAuthEvent = (event: string, user: User | null) => {
    if (!user) return

    switch (event) {
      case "login":
        addNotification({
          userId: user.id,
          title: "Login Successful",
          message: `Welcome back, ${user.name}! You've successfully logged in.`,
          type: "info",
        })
        break
      case "register":
        addNotification({
          userId: user.id,
          title: "Account Created",
          message: "Your account has been successfully created. Welcome to AMEN Bank!",
          type: "success",
        })
        break
      default:
        break
    }
  }

  return <AuthProvider onAuthStateChanged={handleAuthEvent}>{children}</AuthProvider>
}

export default AuthProviderWithNotifications

