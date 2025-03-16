// src/data/mock-data.ts
import type { MockUser } from "../types";

// Mock Users for authentication
export const mockUsers: MockUser[] = [
  {
    id: 1,
    name: "Admin User",
    email: "admin@example.com",
    password: "admin123",
    role: "admin",
  },
  {
    id: 2,
    name: "John Doe",
    email: "john@example.com",
    password: "password123",
    role: "user",
  },
];

// Mock System Users (for admin panel)
export const mockSystemUsers = [
  {
    id: 1,
    name: "Admin User",
    email: "admin@example.com",
    role: "admin",
    status: "active",
    lastLogin: "2023-04-10T08:30:00Z",
  },
  {
    id: 2,
    name: "John Doe",
    email: "john@example.com",
    role: "user",
    status: "active",
    lastLogin: "2023-04-09T14:20:00Z",
  },
  {
    id: 3,
    name: "Jane Smith",
    email: "jane@example.com",
    role: "user",
    status: "active",
    lastLogin: "2023-04-08T11:45:00Z",
  },
  {
    id: 4,
    name: "Robert Johnson",
    email: "robert@example.com",
    role: "user",
    status: "inactive",
    lastLogin: "2023-03-15T09:10:00Z",
  },
];

// Mock Accounts
export const mockAccounts = [
  {
    id: 1,
    userId: 2,
    accountNumber: "TN59 0001 0001 1234 5678 9012",
    accountType: "Checking Account",
    balance: 5250.75,
    currency: "TND",
    status: "active",
  },
  {
    id: 2,
    userId: 2,
    accountNumber: "TN59 0001 0001 8765 4321 0987",
    accountType: "Savings Account",
    balance: 12500.50,
    currency: "TND",
    status: "active",
  },
  {
    id: 3,
    userId: 3,
    accountNumber: "TN59 0001 0002 2468 1357 9012",
    accountType: "Checking Account",
    balance: 3200.25,
    currency: "TND",
    status: "active",
  },
  {
    id: 4,
    userId: 3,
    accountNumber: "TN59 0001 0002 1357 2468 0987",
    accountType: "Savings Account",
    balance: 8750.00,
    currency: "TND",
    status: "active",
  },
  {
    id: 5,
    userId: 4,
    accountNumber: "TN59 0001 0003 9876 5432 1098",
    accountType: "Checking Account",
    balance: 1500.30,
    currency: "TND",
    status: "inactive",
  },
];

// Mock Transactions
export const mockTransactions = [
  {
    id: 1,
    accountId: 1,
    date: "2023-04-10T14:30:00Z",
    description: "Salary Deposit",
    amount: 2500.00,
    type: "deposit",
  },
  {
    id: 2,
    accountId: 1,
    date: "2023-04-08T10:15:00Z",
    description: "Grocery Store",
    amount: 150.25,
    type: "withdrawal",
  },
  {
    id: 3,
    accountId: 1,
    date: "2023-04-05T16:45:00Z",
    description: "Electric Bill",
    amount: 85.50,
    type: "withdrawal",
  },
  {
    id: 4,
    accountId: 1,
    date: "2023-04-03T09:20:00Z",
    description: "Transfer to Savings",
    amount: 500.00,
    type: "withdrawal",
  },
  {
    id: 5,
    accountId: 1,
    date: "2023-04-01T11:30:00Z",
    description: "Restaurant Payment",
    amount: 75.80,
    type: "withdrawal",
  },
  {
    id: 6,
    accountId: 2,
    date: "2023-04-03T09:25:00Z",
    description: "Transfer from Checking",
    amount: 500.00,
    type: "deposit",
  },
  {
    id: 7,
    accountId: 2,
    date: "2023-03-15T13:10:00Z",
    description: "Interest Payment",
    amount: 25.50,
    type: "deposit",
  },
];

// Mock Loan Products
export const mockLoanProducts = [
  {
    id: 1,
    name: "Personal Loan",
    description: "Flexible personal loans for any purpose with competitive rates.",
    interestRate: 8.5,
    minAmount: 1000,
    maxAmount: 50000,
    minTerm: 6,
    maxTerm: 60,
  },
  {
    id: 2,
    name: "Home Loan",
    description: "Finance your dream home with our long-term mortgage options.",
    interestRate: 5.2,
    minAmount: 50000,
    maxAmount: 500000,
    minTerm: 60,
    maxTerm: 360,
  },
  {
    id: 3,
    name: "Auto Loan",
    description: "Get on the road with our competitive auto financing options.",
    interestRate: 6.8,
    minAmount: 5000,
    maxAmount: 100000,
    minTerm: 12,
    maxTerm: 72,
  },
  {
    id: 4,
    name: "Business Loan",
    description: "Grow your business with our flexible financing solutions.",
    interestRate: 7.5,
    minAmount: 10000,
    maxAmount: 200000,
    minTerm: 12,
    maxTerm: 84,
  },
];

// Mock Loan Applications
export const mockLoanApplications = [
  {
    id: 1,
    userId: 2,
    productId: 1,
    amount: 15000,
    term: 24,
    purpose: "Home renovation",
    status: "approved",
    applicationDate: "2023-03-15T10:30:00Z",
    approvalDate: "2023-03-18T14:20:00Z",
  },
  {
    id: 2,
    userId: 3,
    productId: 3,
    amount: 25000,
    term: 48,
    purpose: "New car purchase",
    status: "pending",
    applicationDate: "2023-04-05T09:15:00Z",
    approvalDate: null,
  },
  {
    id: 3,
    userId: 4,
    productId: 2,
    amount: 200000,
    term: 240,
    purpose: "Home purchase",
    status: "rejected",
    applicationDate: "2023-03-20T11:45:00Z",
    approvalDate: "2023-03-25T16:30:00Z",
  },
  {
    id: 4,
    userId: 3,
    productId: 4,
    amount: 50000,
    term: 60,
    purpose: "Business expansion",
    status: "pending",
    applicationDate: "2023-04-08T13:20:00Z",
    approvalDate: null,
  },
];

// Mock Activity Logs
export const mockActivityLogs = [
  {
    id: 1,
    userId: 1,
    action: "login",
    details: "Admin login from web application",
    ipAddress: "192.168.1.1",
    timestamp: "2023-04-10T08:30:00Z",
  },
  {
    id: 2,
    userId: 2,
    action: "login",
    details: "User login from web application",
    ipAddress: "192.168.1.2",
    timestamp: "2023-04-09T14:20:00Z",
  },
  {
    id: 3,
    userId: 2,
    action: "transfer",
    details: "Transfer of 500 TND from checking to savings account",
    ipAddress: "192.168.1.2",
    timestamp: "2023-04-03T09:20:00Z",
  },
  {
    id: 4,
    userId: 3,
    action: "login",
    details: "User login from mobile application",
    ipAddress: "192.168.1.3",
    timestamp: "2023-04-08T11:45:00Z",
  },
  {
    id: 5,
    userId: 3,
    action: "loan_application",
    details: "New loan application submitted for 25000 TND",
    ipAddress: "192.168.1.3",
    timestamp: "2023-04-05T09:15:00Z",
  },
  {
    id: 6,
    userId: 2,
    action: "password_change",
    details: "User changed their password",
    ipAddress: "192.168.1.2",
    timestamp: "2023-04-02T16:30:00Z",
  },
  {
    id: 7,
    userId: 1,
    action: "account_update",
    details: "Admin updated user account settings",
    ipAddress: "192.168.1.1",
    timestamp: "2023-04-01T10:15:00Z",
  },
];