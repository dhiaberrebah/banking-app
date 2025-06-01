import { useEffect, useState } from "react"
import { Layout } from "../../components/layout"
import { CreditCard, Send, FileText, TrendingUp, Calculator, AlertCircle, RefreshCw, ArrowUpRight, ArrowDownRight, Clock } from "lucide-react"
import { Link } from "react-router-dom"
import axios from "axios"
import { DashboardCards } from "../../components/dashboard-card"

interface Account {
  _id: string
  accountNumber: string
  accountType: string
  balance: number
  currency: string
  name: string
}

interface Transaction {
  _id: string
  description: string
  amount: number
  type: string
  date: string
  category: string
  status: string
}

interface Notification {
  _id: string
  title: string
  message: string
  type: string
  read: boolean
  createdAt: string
}

export default function Dashboard() {
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [accounts, setAccounts] = useState<Account[]>([])
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [totalBalance, setTotalBalance] = useState(0)
  const [userName, setUserName] = useState("")

  const fetchDashboardData = async () => {
    setIsLoading(true)
    setError(null)
    
    try {
      // Use checkAuth endpoint instead of profile endpoint
      const profileResponse = await axios.get("http://localhost:5001/api/auth/checkAuth", {
        withCredentials: true
      })
      
      if (profileResponse.data.user) {
        setUserName(`${profileResponse.data.user.firstName} ${profileResponse.data.user.lastName}`)
      }

      // Fetch accounts - using the existing endpoint from the backend
      try {
        const accountsResponse = await axios.get("http://localhost:5001/api/users/accounts", {
          withCredentials: true
        })
        
        if (accountsResponse.data.success) {
          setAccounts(accountsResponse.data.accounts || [])
          
          // Calculate total balance
          const total = accountsResponse.data.accounts.reduce(
            (sum: number, account: Account) => sum + account.balance, 
            0
          )
          setTotalBalance(total)
        }
      } catch (accountErr: any) {
        console.warn("Could not fetch accounts:", accountErr)
        setAccounts([])
      }

      // Fetch transactions - using the existing endpoint from the backend
      try {
        const transactionsResponse = await axios.get(
          "http://localhost:5001/api/users/transactions?limit=5", 
          { withCredentials: true }
        )
        
        if (transactionsResponse.data.success) {
          setTransactions(transactionsResponse.data.transactions || [])
        }
      } catch (transErr: any) {
        console.warn("Could not fetch transactions:", transErr)
        setTransactions([])
      }
      
      // Fetch notifications - using the existing endpoint from the backend
      try {
        const notificationsResponse = await axios.get(
          "http://localhost:5001/api/users/notifications?limit=3&read=false", 
          { withCredentials: true }
        )
        
        if (notificationsResponse.data.success) {
          setNotifications(notificationsResponse.data.notifications || [])
        }
      } catch (notifErr: any) {
        console.warn("Could not fetch notifications:", notifErr)
        setNotifications([])
      }
      
    } catch (err: any) {
      console.error("Failed to fetch dashboard data:", err)
      if (err.response?.status === 404) {
        setError("Some API endpoints are not available. The backend may be missing required routes.")
      } else {
        setError("Failed to load dashboard data. Please try again.")
      }
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchDashboardData()
  }, [])

  // Format currency
  const formatCurrency = (amount: number, currency = 'TND') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency
    }).format(amount)
  }

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  // Get time ago
  const getTimeAgo = (dateString: string) => {
    const now = new Date()
    const date = new Date(dateString)
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000)
    
    if (seconds < 60) return `${seconds} seconds ago`
    
    const minutes = Math.floor(seconds / 60)
    if (minutes < 60) return `${minutes} minute${minutes !== 1 ? 's' : ''} ago`
    
    const hours = Math.floor(minutes / 60)
    if (hours < 24) return `${hours} hour${hours !== 1 ? 's' : ''} ago`
    
    const days = Math.floor(hours / 24)
    if (days < 30) return `${days} day${days !== 1 ? 's' : ''} ago`
    
    const months = Math.floor(days / 30)
    return `${months} month${months !== 1 ? 's' : ''} ago`
  }

  // Get transaction icon
  const getTransactionIcon = (type: string) => {
    if (type === 'credit' || type === 'deposit') {
      return <ArrowUpRight className="h-5 w-5 text-green-500" />
    } else if (type === 'debit' || type === 'withdrawal') {
      return <ArrowDownRight className="h-5 w-5 text-red-500" />
    } else {
      return <Clock className="h-5 w-5 text-blue-500" />
    }
  }

  // Get notification color
  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'success':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'warning':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'error':
        return 'bg-red-100 text-red-800 border-red-200'
      case 'info':
      default:
        return 'bg-blue-100 text-blue-800 border-blue-200'
    }
  }

  return (
    <Layout>
      <div className="space-y-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 flex flex-col items-center">
            <AlertCircle className="h-10 w-10 text-red-500 mb-3" />
            <p className="text-red-700 mb-4 text-center font-medium">{error}</p>
            <button 
              onClick={fetchDashboardData}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Retry
            </button>
          </div>
        ) : (
          <>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <h1 className="text-3xl font-bold tracking-tight text-gray-900">Welcome, {userName || "User"}</h1>
              <div className="mt-4 md:mt-0">
                <button 
                  onClick={fetchDashboardData}
                  className="flex items-center px-3 py-1.5 text-sm bg-white border border-gray-200 rounded-md hover:bg-gray-50 transition-colors"
                >
                  <RefreshCw className="h-3.5 w-3.5 mr-1.5" />
                  Refresh
                </button>
              </div>
            </div>

            {/* Dashboard Cards */}
            <DashboardCards totalBalance={totalBalance} currency="TND" />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Account Summary */}
              <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="flex items-center justify-between p-6 border-b border-gray-100">
                  <h2 className="text-lg font-semibold text-gray-900">Account Summary</h2>
                  <Link to="/accounts" className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center">
                    View all
                    <ArrowUpRight className="h-3.5 w-3.5 ml-1" />
                  </Link>
                </div>
                <div className="divide-y divide-gray-100">
                  {accounts.length === 0 ? (
                    <div className="p-8 text-center">
                      <CreditCard className="h-10 w-10 text-gray-400 mx-auto mb-3" />
                      <p className="text-gray-500 mb-4">No accounts found or account data unavailable.</p>
                      <Link 
                        to="/new-account" 
                        className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                      >
                        <CreditCard className="h-4 w-4 mr-2" />
                        Create a new account
                      </Link>
                    </div>
                  ) : (
                    accounts.map((account) => (
                      <div key={account._id} className="p-5 hover:bg-gray-50 transition-colors">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div className={`flex h-10 w-10 items-center justify-center rounded-full ${
                              account.accountType === 'savings' ? 'bg-blue-100' : 
                              account.accountType === 'checking' ? 'bg-green-100' : 'bg-purple-100'
                            }`}>
                              <CreditCard className={`h-5 w-5 ${
                                account.accountType === 'savings' ? 'text-blue-600' : 
                                account.accountType === 'checking' ? 'text-green-600' : 'text-purple-600'
                              }`} />
                            </div>
                            <div className="ml-4">
                              <p className="font-medium text-gray-900">{account.name || account.accountType.charAt(0).toUpperCase() + account.accountType.slice(1)}</p>
                              <p className="text-sm text-gray-500">{account.accountNumber}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-gray-900">{formatCurrency(account.balance, account.currency)}</p>
                            <p className="text-sm text-gray-500 capitalize">{account.accountType}</p>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Quick Stats & Notifications */}
              <div className="space-y-8">
                {/* Financial Overview */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                  <div className="p-6 border-b border-gray-100">
                    <h2 className="text-lg font-semibold text-gray-900">Financial Overview</h2>
                  </div>
                  <div className="p-6 space-y-6">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Total Balance</p>
                      <p className="text-2xl font-bold text-gray-900 mt-1">{formatCurrency(totalBalance)}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Active Accounts</p>
                      <p className="text-2xl font-bold text-gray-900 mt-1">{accounts.length}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Recent Activity</p>
                      <p className="text-2xl font-bold text-gray-900 mt-1">{transactions.length} transactions</p>
                    </div>
                  </div>
                </div>

                {/* Notifications */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                  <div className="flex items-center justify-between p-6 border-b border-gray-100">
                    <h2 className="text-lg font-semibold text-gray-900">Recent Notifications</h2>
                    <Link to="/notifications" className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center">
                      View all
                      <ArrowUpRight className="h-3.5 w-3.5 ml-1" />
                    </Link>
                  </div>
                  <div className="divide-y divide-gray-100">
                    {notifications.length === 0 ? (
                      <div className="p-6 text-center text-gray-500">
                        <p>No new notifications</p>
                      </div>
                    ) : (
                      notifications.map((notification) => (
                        <div key={notification._id} className="p-4 hover:bg-gray-50 transition-colors">
                          <div className={`rounded-md p-3 ${getNotificationColor(notification.type)}`}>
                            <p className="font-medium">{notification.title}</p>
                            <p className="text-sm mt-1">{notification.message}</p>
                            <p className="text-xs mt-2 opacity-75">{getTimeAgo(notification.createdAt)}</p>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Transactions */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="flex items-center justify-between p-6 border-b border-gray-100">
                <h2 className="text-lg font-semibold text-gray-900">Recent Transactions</h2>
                <Link to="/transactions" className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center">
                  View all
                  <ArrowUpRight className="h-3.5 w-3.5 ml-1" />
                </Link>
              </div>
              <div className="divide-y divide-gray-100">
                {transactions.length === 0 ? (
                  <div className="p-8 text-center">
                    <FileText className="h-10 w-10 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-500">No recent transactions found or transaction data unavailable.</p>
                  </div>
                ) : (
                  transactions.map((transaction) => (
                    <div key={transaction._id} className="p-5 hover:bg-gray-50 transition-colors">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className={`flex h-10 w-10 items-center justify-center rounded-full ${
                            transaction.type === 'credit' ? 'bg-green-100' : 
                            transaction.type === 'debit' ? 'bg-red-100' : 'bg-blue-100'
                          }`}>
                            {getTransactionIcon(transaction.type)}
                          </div>
                          <div className="ml-4">
                            <p className="font-medium text-gray-900">{transaction.description}</p>
                            <div className="flex items-center text-sm text-gray-500">
                              <p>{formatDate(transaction.date)}</p>
                              {transaction.status && (
                                <span className={`ml-2 px-2 py-0.5 text-xs rounded-full ${
                                  transaction.status === 'completed' ? 'bg-green-100 text-green-800' :
                                  transaction.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                  'bg-gray-100 text-gray-800'
                                }`}>
                                  {transaction.status}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className={`font-medium ${transaction.type === 'credit' ? 'text-green-600' : 'text-red-600'}`}>
                            {transaction.type === 'credit' ? '+ ' : '- '}
                            {formatCurrency(Math.abs(transaction.amount))}
                          </p>
                          <p className="text-sm text-gray-500 capitalize">{transaction.category}</p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </Layout>
  )
}
