"use client"

// src/pages/dashboard/overview.tsx
import type React from "react"
import { Link } from "react-router-dom"
import { CreditCard, Send, ArrowRight, TrendingUp, TrendingDown, FileText } from "lucide-react"
import { useAuth } from "../../contexts/auth-context"
import { mockAccounts, mockTransactions } from "../../data/mock-data"

const DashboardOverview: React.FC = () => {
  const { currentUser } = useAuth()

  // Get user accounts
  const userAccounts = mockAccounts.filter((account) => account.userId === currentUser?.id)

  // Get total balance
  const totalBalance = userAccounts.reduce((sum, account) => sum + account.balance, 0)

  // Get recent transactions
  const recentTransactions = mockTransactions
    .filter((transaction) => userAccounts.some((account) => account.id === transaction.accountId))
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5)

  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900">Welcome, {currentUser?.name}</h1>

      <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {/* Card 1 */}
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-blue-100 rounded-md p-3">
                <CreditCard className="h-6 w-6 text-blue-900" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Total Balance</dt>
                  <dd>
                    <div className="text-lg font-medium text-gray-900">{totalBalance.toLocaleString()} TND</div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-5 py-3">
            <div className="text-sm">
              <Link
                to="/dashboard/accounts"
                className="font-medium text-blue-900 hover:text-blue-800 flex items-center"
              >
                View all accounts
                <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>

        {/* Card 2 */}
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-blue-100 rounded-md p-3">
                <Send className="h-6 w-6 text-blue-900" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Quick Transfer</dt>
                  <dd>
                    <div className="text-lg font-medium text-gray-900">Send Money</div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-5 py-3">
            <div className="text-sm">
              <Link
                to="/dashboard/transfer"
                className="font-medium text-blue-900 hover:text-blue-800 flex items-center"
              >
                Make a transfer
                <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>

        {/* Card 3 */}
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-blue-100 rounded-md p-3">
                <FileText className="h-6 w-6 text-blue-900" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Transaction History</dt>
                  <dd>
                    <div className="text-lg font-medium text-gray-900">View & Export</div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-5 py-3">
            <div className="text-sm">
              <Link
                to="/dashboard/transactions"
                className="font-medium text-blue-900 hover:text-blue-800 flex items-center"
              >
                View transactions
                <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="mt-8">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-medium text-gray-900">Recent Transactions</h2>
          <Link to="/dashboard/transactions" className="text-sm font-medium text-blue-900 hover:text-blue-800">
            View all
          </Link>
        </div>
        <div className="mt-4 bg-white shadow overflow-hidden sm:rounded-md">
          <ul className="divide-y divide-gray-200">
            {recentTransactions.map((transaction) => (
              <li key={transaction.id}>
                <div className="px-4 py-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-blue-900 truncate">{transaction.description}</p>
                    <div className="ml-2 flex-shrink-0 flex">
                      <p
                        className={`text-sm font-medium ${
                          transaction.type === "deposit" ? "text-green-600" : "text-red-600"
                        }`}
                      >
                        {transaction.type === "deposit" ? "+" : "-"} {transaction.amount.toLocaleString()} TND
                      </p>
                    </div>
                  </div>
                  <div className="mt-2 sm:flex sm:justify-between">
                    <div className="sm:flex">
                      <p className="flex items-center text-sm text-gray-500">
                        {new Date(transaction.date).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                      <p>{transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1)}</p>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Account Summary */}
      <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <h3 className="text-lg font-medium text-gray-900">Income vs Expenses</h3>
            <div className="mt-4 flex items-center">
              <div className="flex-1">
                <div className="h-16 bg-gray-200 rounded-md overflow-hidden">
                  <div className="h-full bg-blue-900 w-2/3"></div>
                </div>
                <div className="mt-2 flex justify-between text-sm text-gray-500">
                  <div>Income</div>
                  <div>Expenses</div>
                </div>
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <TrendingUp className="h-4 w-4 text-green-500 mr-1.5" />
              <span className="text-green-500 font-medium">12% more income</span>
              <span className="text-gray-500 ml-1.5">than last month</span>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <h3 className="text-lg font-medium text-gray-900">Spending Categories</h3>
            <div className="mt-4 flex items-center">
              <div className="flex-1">
                <div className="grid grid-cols-4 gap-2 h-16">
                  <div className="bg-blue-900 rounded-md"></div>
                  <div className="bg-blue-700 rounded-md"></div>
                  <div className="bg-blue-500 rounded-md"></div>
                  <div className="bg-blue-300 rounded-md"></div>
                </div>
                <div className="mt-2 grid grid-cols-4 text-xs text-gray-500">
                  <div>Bills</div>
                  <div>Food</div>
                  <div>Transport</div>
                  <div>Other</div>
                </div>
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <TrendingDown className="h-4 w-4 text-red-500 mr-1.5" />
              <span className="text-red-500 font-medium">5% more spending</span>
              <span className="text-gray-500 ml-1.5">on bills</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DashboardOverview

