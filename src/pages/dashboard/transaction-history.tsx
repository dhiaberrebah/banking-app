"use client"

import type React from "react"
import { useState, useMemo } from "react"
import { Search, Filter, Download, Calendar, DollarSign, X, ChevronDown, ChevronUp } from "lucide-react"
import { useAuth } from "../../contexts/auth-context"
import { mockTransactions, mockAccounts } from "../../data/mock-data"

const TransactionHistoryPage: React.FC = () => {
  const { currentUser } = useAuth()

  // Filter states
  const [searchTerm, setSearchTerm] = useState("")
  const [dateRange, setDateRange] = useState({ start: "", end: "" })
  const [transactionType, setTransactionType] = useState("all")
  const [selectedAccount, setSelectedAccount] = useState<number | "all">("all")
  const [amountRange, setAmountRange] = useState({ min: "", max: "" })
  const [sortConfig, setSortConfig] = useState({ key: "date", direction: "desc" as "asc" | "desc" })
  const [showFilters, setShowFilters] = useState(false)

  // Get user accounts
  const userAccounts = useMemo(() => {
    if (!currentUser) return []
    return mockAccounts.filter((account) => account.userId === currentUser.id)
  }, [currentUser])

  // Get all transactions for user accounts
  const userTransactions = useMemo(() => {
    const accountIds = userAccounts.map((account) => account.id)
    return mockTransactions.filter((transaction) => accountIds.includes(transaction.accountId))
  }, [userAccounts])

  // Apply filters and sorting
  const filteredTransactions = useMemo(() => {
    return userTransactions
      .filter((transaction) => {
        // Search term filter
        const matchesSearch = transaction.description.toLowerCase().includes(searchTerm.toLowerCase())

        // Date range filter
        const transactionDate = new Date(transaction.date)
        const matchesStartDate = !dateRange.start || transactionDate >= new Date(dateRange.start)
        const matchesEndDate = !dateRange.end || transactionDate <= new Date(dateRange.end + "T23:59:59")

        // Transaction type filter
        const matchesType = transactionType === "all" || transaction.type === transactionType

        // Account filter
        const matchesAccount = selectedAccount === "all" || transaction.accountId === selectedAccount

        // Amount range filter
        const matchesMinAmount = !amountRange.min || transaction.amount >= Number.parseFloat(amountRange.min)
        const matchesMaxAmount = !amountRange.max || transaction.amount <= Number.parseFloat(amountRange.max)

        return (
          matchesSearch &&
          matchesStartDate &&
          matchesEndDate &&
          matchesType &&
          matchesAccount &&
          matchesMinAmount &&
          matchesMaxAmount
        )
      })
      .sort((a, b) => {
        // Apply sorting
        if (sortConfig.key === "date") {
          return sortConfig.direction === "asc"
            ? new Date(a.date).getTime() - new Date(b.date).getTime()
            : new Date(b.date).getTime() - new Date(a.date).getTime()
        } else if (sortConfig.key === "amount") {
          return sortConfig.direction === "asc" ? a.amount - b.amount : b.amount - a.amount
        } else if (sortConfig.key === "description") {
          return sortConfig.direction === "asc"
            ? a.description.localeCompare(b.description)
            : b.description.localeCompare(a.description)
        }
        return 0
      })
  }, [userTransactions, searchTerm, dateRange, transactionType, selectedAccount, amountRange, sortConfig])

  // Get account name by ID
  const getAccountName = (accountId: number) => {
    const account = userAccounts.find((acc) => acc.id === accountId)
    return account ? `${account.accountType} (${account.accountNumber.substring(0, 8)}...)` : "Unknown Account"
  }

  // Handle sort
  const handleSort = (key: string) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "desc" ? "asc" : "desc",
    }))
  }

  // Reset filters
  const resetFilters = () => {
    setSearchTerm("")
    setDateRange({ start: "", end: "" })
    setTransactionType("all")
    setSelectedAccount("all")
    setAmountRange({ min: "", max: "" })
  }

  // Export transactions to CSV
  const exportToCSV = () => {
    if (filteredTransactions.length === 0) return

    // Create CSV content
    const headers = ["Date", "Account", "Description", "Type", "Amount"]
    const csvContent = [
      headers.join(","),
      ...filteredTransactions.map((transaction) =>
        [
          new Date(transaction.date).toLocaleDateString(),
          getAccountName(transaction.accountId),
          `"${transaction.description.replace(/"/g, '""')}"`, // Escape quotes
          transaction.type,
          transaction.amount.toFixed(2),
        ].join(","),
      ),
    ].join("\n")

    // Create and download the file
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.setAttribute("href", url)
    link.setAttribute("download", `transactions_${new Date().toISOString().split("T")[0]}.csv`)
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  // Export transactions to PDF
  const exportToPDF = () => {
    alert("PDF export functionality would be implemented here with a library like jsPDF")
    // In a real implementation, we would use a library like jsPDF to generate the PDF
  }

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <h1 className="text-2xl font-semibold text-gray-900 mb-4 md:mb-0">Transaction History</h1>

        <div className="flex flex-col sm:flex-row gap-2">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            <Filter className="mr-2 h-4 w-4" />
            {showFilters ? "Hide Filters" : "Show Filters"}
          </button>

          <div className="relative inline-block text-left">
            <div>
              <button
                type="button"
                className="inline-flex justify-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none"
                id="export-menu"
                aria-expanded="true"
                aria-haspopup="true"
                onClick={() => document.getElementById("export-dropdown")?.classList.toggle("hidden")}
              >
                <Download className="mr-2 h-4 w-4" />
                Export
                <ChevronDown className="ml-2 h-4 w-4" />
              </button>
            </div>

            <div
              id="export-dropdown"
              className="hidden origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10"
              role="menu"
              aria-orientation="vertical"
              aria-labelledby="export-menu"
            >
              <div className="py-1" role="none">
                <button
                  onClick={exportToCSV}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  role="menuitem"
                >
                  Export as CSV
                </button>
                <button
                  onClick={exportToPDF}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  role="menuitem"
                >
                  Export as PDF
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Search bar - always visible */}
      <div className="mb-4 relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          placeholder="Search transactions..."
          className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-blue-900 focus:border-blue-900 sm:text-sm"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Advanced filters - toggleable */}
      {showFilters && (
        <div className="bg-gray-50 p-4 rounded-md mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Date range filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date Range</label>
              <div className="flex space-x-2">
                <div className="relative flex-1">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Calendar className="h-4 w-4 text-gray-400" />
                  </div>
                  <input
                    type="date"
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-blue-900 focus:border-blue-900 sm:text-sm"
                    value={dateRange.start}
                    onChange={(e) => setDateRange((prev) => ({ ...prev, start: e.target.value }))}
                  />
                </div>
                <div className="relative flex-1">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Calendar className="h-4 w-4 text-gray-400" />
                  </div>
                  <input
                    type="date"
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-blue-900 focus:border-blue-900 sm:text-sm"
                    value={dateRange.end}
                    onChange={(e) => setDateRange((prev) => ({ ...prev, end: e.target.value }))}
                  />
                </div>
              </div>
            </div>

            {/* Transaction type filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Transaction Type</label>
              <div className="relative">
                <select
                  className="block w-full pl-3 pr-10 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-blue-900 focus:border-blue-900 sm:text-sm"
                  value={transactionType}
                  onChange={(e) => setTransactionType(e.target.value)}
                >
                  <option value="all">All Types</option>
                  <option value="deposit">Deposits</option>
                  <option value="withdrawal">Withdrawals</option>
                </select>
              </div>
            </div>

            {/* Account filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Account</label>
              <div className="relative">
                <select
                  className="block w-full pl-3 pr-10 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-blue-900 focus:border-blue-900 sm:text-sm"
                  value={selectedAccount}
                  onChange={(e) =>
                    setSelectedAccount(e.target.value === "all" ? "all" : Number.parseInt(e.target.value))
                  }
                >
                  <option value="all">All Accounts</option>
                  {userAccounts.map((account) => (
                    <option key={account.id} value={account.id}>
                      {account.accountType} ({account.accountNumber.substring(0, 8)}...)
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Amount range filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Amount Range</label>
              <div className="flex space-x-2">
                <div className="relative flex-1">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <DollarSign className="h-4 w-4 text-gray-400" />
                  </div>
                  <input
                    type="number"
                    placeholder="Min"
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-blue-900 focus:border-blue-900 sm:text-sm"
                    value={amountRange.min}
                    onChange={(e) => setAmountRange((prev) => ({ ...prev, min: e.target.value }))}
                  />
                </div>
                <div className="relative flex-1">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <DollarSign className="h-4 w-4 text-gray-400" />
                  </div>
                  <input
                    type="number"
                    placeholder="Max"
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-blue-900 focus:border-blue-900 sm:text-sm"
                    value={amountRange.max}
                    onChange={(e) => setAmountRange((prev) => ({ ...prev, max: e.target.value }))}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 flex justify-end">
            <button
              onClick={resetFilters}
              className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              <X className="mr-2 h-4 w-4" />
              Reset Filters
            </button>
          </div>
        </div>
      )}

      {/* Results count */}
      <div className="mb-4 text-sm text-gray-500">
        Showing {filteredTransactions.length} of {userTransactions.length} transactions
      </div>

      {/* Transactions table */}
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort("date")}
                >
                  <div className="flex items-center">
                    Date
                    {sortConfig.key === "date" &&
                      (sortConfig.direction === "asc" ? (
                        <ChevronUp className="ml-1 h-4 w-4" />
                      ) : (
                        <ChevronDown className="ml-1 h-4 w-4" />
                      ))}
                  </div>
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Account
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort("description")}
                >
                  <div className="flex items-center">
                    Description
                    {sortConfig.key === "description" &&
                      (sortConfig.direction === "asc" ? (
                        <ChevronUp className="ml-1 h-4 w-4" />
                      ) : (
                        <ChevronDown className="ml-1 h-4 w-4" />
                      ))}
                  </div>
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Type
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort("amount")}
                >
                  <div className="flex items-center">
                    Amount
                    {sortConfig.key === "amount" &&
                      (sortConfig.direction === "asc" ? (
                        <ChevronUp className="ml-1 h-4 w-4" />
                      ) : (
                        <ChevronDown className="ml-1 h-4 w-4" />
                      ))}
                  </div>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredTransactions.length > 0 ? (
                filteredTransactions.map((transaction) => (
                  <tr key={transaction.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(transaction.date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {getAccountName(transaction.accountId)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {transaction.description}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          transaction.type === "deposit" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                        }`}
                      >
                        {transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1)}
                      </span>
                    </td>
                    <td
                      className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${
                        transaction.type === "deposit" ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {transaction.type === "deposit" ? "+" : "-"} {transaction.amount.toLocaleString()} TND
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-4 text-center text-sm text-gray-500">
                    No transactions found matching your filters
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default TransactionHistoryPage

