// Core types for the application
export interface User {
  id: number
  name: string
  email: string
  role: "user" | "admin"
}

export interface AuthContextType {
  currentUser: User | null
  login: (email: string, password: string) => boolean
  register: (userData: RegisterData) => boolean
  logout: () => void
  isAuthenticated: boolean
  isAdmin: boolean
}

export interface RegisterData {
  name: string
  email: string
  password: string
}

export interface MockUser {
  id: number
  name: string
  email: string
  password: string
  role: "user" | "admin"
}

// Account and transaction interfaces
export interface Account {
  id: number
  userId: number
  accountNumber: string
  accountType: string
  balance: number
  currency: string
  status: string
}

export interface Transaction {
  id: number
  accountId: number
  date: string
  description: string
  amount: number
  type: "deposit" | "withdrawal"
}

// Notification types
export interface Notification {
  id: number
  userId: number
  title: string
  message: string
  type: "info" | "success" | "warning" | "error"
  isRead: boolean
  timestamp: string
  link?: string
}

export interface NotificationContextType {
  notifications: Notification[]
  unreadCount: number
  addNotification: (notification: Omit<Notification, "id" | "timestamp" | "isRead">) => void
  markAsRead: (id: number) => void
  markAllAsRead: () => void
  clearNotifications: () => void
}

// Bill payment types
export interface Payee {
  id: number
  userId: number
  name: string
  accountNumber: string
  category: "utility" | "telecom" | "insurance" | "credit" | "other"
  isActive: boolean
}

export interface BillPayment {
  id: number
  userId: number
  accountId: number
  payeeId: number
  amount: number
  reference: string
  description: string
  scheduledDate: string
  status: "pending" | "completed" | "failed"
  createdAt: string
}

