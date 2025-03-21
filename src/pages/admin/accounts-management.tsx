"use client"

// src/pages/dashboard/accounts.tsx
import type React from "react"
import { useState } from "react"
import { CreditCard, Search } from "lucide-react"
import { useAuth } from "../../contexts/auth-context"
import { mockAccounts, mockTransactions } from "../../data/mock-data"

const AccountsPage: React.FC = () => {
  const { currentUser } = useAuth()
  const [selectedAccount, setSelectedAccount] = useState<any | null>(null)
  const [transactionFilter, setTransactionFilter] = useState("all")
  const [dateRange, setDateRange] = useState({
    start: "",
    end: "",
  })
  const [searchTerm, setSearchTerm] = useState("")
  const [sortConfig, setSortConfig] = useState({
    key: "date",
    direction: "desc",
  })

  // Get user accounts
  const userAccounts = mockAccounts.filter((account) => account.userId === currentUser?.id)

  // Get transactions for selected account
  const accountTransactions = selectedAccount
    ? mockTransactions.filter((transaction) => transaction.accountId === selectedAccount.id)
    : []

  // Filter transactions
  const filteredTransactions = accountTransactions.filter((transaction) => {
    const matchesType = transactionFilter === "all" || transaction.type === transactionFilter

    const matchesSearch = transaction.description.toLowerCase().includes(searchTerm.toLowerCase())

    const transactionDate = new Date(transaction.date)
    const matchesDateStart = !dateRange.start || transactionDate >= new Date(dateRange.start)
    const matchesDateEnd = !dateRange.end || transactionDate <= new Date(dateRange.end)

    return matchesType && matchesSearch && matchesDateStart && matchesDateEnd
  })

  // Sort transactions
  const sortedTransactions = [...filteredTransactions].sort((a, b) => {
    if (sortConfig.key === "date") {
      return sortConfig.direction === "asc"
        ? new Date(a.date).getTime() - new Date(b.date).getTime()
        : new Date(b.date).getTime() - new Date(a.date).getTime()
    } else if (sortConfig.key === "amount") {
      return sortConfig.direction === "asc" ? a.amount - b.amount : b.amount - a.amount
    }
    return 0
  })

  const handleAccountSelect = (account: any) => {
    setSelectedAccount(account)
    setTransactionFilter("all")
    setDateRange({ start: "", end: "" })
    setSearchTerm("")
  }

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setTransactionFilter(e.target.value)
  }

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setDateRange((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
  }

  const handleSort = (key: string) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "desc" ? "asc" : "desc",
    }))
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900">My Accounts</h1>

      <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {userAccounts.map((account) => (
          <div
            key={account.id}
            className={`bg-white overflow-hidden shadow rounded-lg cursor-pointer transition-all ${
              selectedAccount?.id === account.id ? "ring-2 ring-blue-900" : "hover:shadow-md"
            }`}
            onClick={() => handleAccountSelect(account)}
          >
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-blue-100 rounded-md p-3">
                  <CreditCard className="h-6 w-6 text-blue-900" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">{account.accountType}</dt>
                    <dd>
                      <div className="text-lg font-medium text-gray-900">
                        {account.balance.toLocaleString()} {account.currency}
                      </div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 px-5 py-3">
              <div className="text-sm text-gray-500">Account: {account.accountNumber}</div>
            </div>
          </div>
        ))}
      </div>

      {selectedAccount && (
        <div className="mt-8">
          <h2 className="text-lg font-medium text-gray-900">Transaction History</h2>

          <div className="mt-4 grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-2 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search transactions..."
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-blue-900 focus:border-blue-900 sm:text-sm"
                value={searchTerm}
                onChange={handleSearchChange}
              />
            </div>

            <div>
              <select
                className="block w-full px-3 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-blue-900 focus:border-blue-900 sm:text-sm"
                value={transactionFilter}
                onChange={handleFilterChange}
              >
                <option value="all">All Transactions</option>
                <option value="deposit">Deposits</option>
                <option value="withdrawal">Withdrawals</option>
              </select>
            </div>

            <div className="flex space-x-2">
              <input
                type="date"
                name="start"
                value={dateRange.start}
                onChange={handleDateChange}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-blue-900 focus:border-blue-900 sm:text-sm"
              />
              <input
                type="date"
                name="end"
                value={dateRange.end}
                onChange={handleDateChange}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-blue-900 focus:border-blue-900 sm:text-sm"
              />
            </div>
          </div>

          <div className="mt-4 bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      onClick={() => handleSort("date")}
                    >
                      Date {sortConfig.key === "date" && (sortConfig.direction === "asc" ? "↑" : "↓")}
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Description
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
                      Amount {sortConfig.key === "amount" && (sortConfig.direction === "asc" ? "↑" : "↓")}
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {sortedTransactions.length > 0 ? (
                    sortedTransactions.map((transaction) => (
                      <tr key={transaction.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(transaction.date).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {transaction.description}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <span
                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
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
                      <td colSpan={4} className="px-6 py-4 text-center text-sm text-gray-500">
                        No transactions found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AccountsPage

