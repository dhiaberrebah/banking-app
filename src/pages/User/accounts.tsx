"use client"

import { useState, useEffect } from "react"
import { Layout } from "../../components/layout"
import { AccountsList } from "../../components/account-list"
import { AccountSummaryChart } from "../../components/account-summary-chat"
import { TransactionHistory } from "../../components/transaction-history"
import { AccountDetails } from "../../components/account-details"
import { Download, RefreshCw } from 'lucide-react'
import axios from 'axios'
import { useAuthStore } from "../../store/auth-store"

// Define the account type based on your API response
interface Account {
  id: string
  accountNumber: string
  accountType: string
  currency: string
  balance: number
  status: string
  createdAt: string
}

export default function Accounts() {
  const { currentUser } = useAuthStore()
  const [selectedAccount, setSelectedAccount] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<"summary" | "transactions">("summary")
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [accounts, setAccounts] = useState<Account[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchAccounts = async () => {
    setIsRefreshing(true)
    setIsLoading(true)
    try {
      const response = await axios.get(
        "http://localhost:5001/api/users/accounts",
        { withCredentials: true }
      )
      
      if (response.data.success) {
        setAccounts(response.data.accounts || [])
        console.log("Fetched accounts:", response.data.accounts)
        setError(null)
      } else {
        setError(response.data.message || "Failed to load accounts")
      }
    } catch (err: any) {
      console.error("Failed to fetch accounts:", err)
      setError(err.response?.data?.message || "Failed to load accounts. Please try again.")
    } finally {
      setIsRefreshing(false)
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchAccounts()
  }, [])

  const handleRefresh = () => {
    fetchAccounts()
  }

  // Add this function to handle exporting accounts data
  const handleExportAccounts = () => {
    setIsRefreshing(true)
    
    setTimeout(() => {
      // Create CSV content
      let csvContent = "Account Type,Account Number,Balance,Currency,Status\n"
      accounts.forEach(account => {
        csvContent += `${account.accountType},${account.accountNumber},${account.balance.toFixed(2)},${account.currency},${account.status}\n`
      })
      
      // Create download link
      const fileName = `accounts_summary_${new Date().toISOString().split('T')[0]}.csv`
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', fileName)
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      
      setIsRefreshing(false)
    }, 1000)
  }

  // Map API accounts to the format expected by AccountsList
  const formattedAccounts = accounts.map(account => {
    // Determine icon based on account type
    let icon = "Wallet" // Default icon
    if (account.accountType === "savings") {
      icon = "PiggyBank"
    } else if (account.currency === "USD") {
      icon = "DollarSign"
    }
    
    return {
      id: account.id,
      name: `${account.accountType.charAt(0).toUpperCase() + account.accountType.slice(1)} Account`,
      number: account.accountNumber,
      balance: account.balance,
      currency: account.currency,
      type: account.accountType,
      status: account.status,
      icon: icon
    }
  })

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h1 className="text-3xl font-bold tracking-tight text-blue-900">My Accounts</h1>
          <div className="flex items-center gap-3">
            <div className="flex items-center text-sm text-blue-600">
              <span>Last updated: {new Date().toLocaleTimeString()}</span>
              <button 
                className="ml-2 p-1 rounded-full hover:bg-blue-50 transition-colors"
                onClick={handleRefresh}
              >
                <RefreshCw className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
              </button>
            </div>
            <button 
              className="btn btn-outline btn-sm"
              onClick={handleExportAccounts}
              disabled={isRefreshing}
            >
              <Download className="mr-1 h-4 w-4" /> 
              {isRefreshing ? "Exporting..." : "Export"}
            </button>
          </div>
        </div>

        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="lg:col-span-1">
            <div className="card bg-white shadow-md rounded-xl border border-blue-100 overflow-hidden transition-all duration-200 hover:shadow-lg">
              <div className="card-header border-b border-blue-100 bg-gradient-to-r from-blue-50 to-white p-4">
                <h2 className="card-title text-blue-900 font-bold">My Accounts</h2>
              </div>
              <div className="card-content p-0">
                {isLoading ? (
                  <div className="p-4 text-center">Loading accounts...</div>
                ) : accounts.length === 0 ? (
                  <div className="p-4 text-center text-gray-500">
                    No accounts found. Create a new account to get started.
                  </div>
                ) : (
                  <AccountsList 
                    accounts={formattedAccounts}
                    onSelectAccount={setSelectedAccount} 
                    selectedAccount={selectedAccount} 
                  />
                )}
              </div>
            </div>
          </div>

          <div className="lg:col-span-2">
            {selectedAccount ? (
              <div className="card bg-white shadow-md rounded-xl border border-blue-100 overflow-hidden transition-all duration-200 hover:shadow-lg">
                <div className="card-header border-b border-blue-100 bg-gradient-to-r from-blue-50 to-white p-4">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <h2 className="card-title text-blue-900 font-bold">Account Details</h2>
                    <div className="flex gap-2">
                      <button
                        className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                          activeTab === "summary" 
                            ? "bg-blue-600 text-white shadow-md" 
                            : "bg-white text-blue-600 border border-blue-200 hover:bg-blue-50"
                        }`}
                        onClick={() => setActiveTab("summary")}
                      >
                        Summary
                      </button>
                      <button
                        className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                          activeTab === "transactions" 
                            ? "bg-blue-600 text-white shadow-md" 
                            : "bg-white text-blue-600 border border-blue-200 hover:bg-blue-50"
                        }`}
                        onClick={() => setActiveTab("transactions")}
                      >
                        Transactions
                      </button>
                    </div>
                  </div>
                </div>
                <div className="card-content p-5">
                  {activeTab === "summary" ? (
                    <AccountDetails 
                      accountId={selectedAccount} 
                      onViewTransactions={() => setActiveTab("transactions")} 
                    />
                  ) : (
                    <TransactionHistory accountId={selectedAccount} />
                  )}
                </div>
              </div>
            ) : (
              <div className="card bg-white shadow-md rounded-xl border border-blue-100 overflow-hidden transition-all duration-200 hover:shadow-lg">
                <div className="card-header border-b border-blue-100 bg-gradient-to-r from-blue-50 to-white p-4">
                  <h2 className="card-title text-blue-900 font-bold">Account Summary</h2>
                </div>
                <div className="card-content p-5">
                  <AccountSummaryChart />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  )
}
