"use client"

import { useState } from "react"
import { Calendar, Filter, Download, RefreshCw } from "lucide-react"

const Monitoring = () => {
  const [dateRange, setDateRange] = useState("today")
  const [refreshInterval, setRefreshInterval] = useState("30")

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">System Monitoring</h1>
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            <Calendar className="h-4 w-4 text-gray-500" />
            <select
              className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
            >
              <option value="today">Today</option>
              <option value="yesterday">Yesterday</option>
              <option value="last7days">Last 7 Days</option>
              <option value="last30days">Last 30 Days</option>
              <option value="thisMonth">This Month</option>
              <option value="custom">Custom Range</option>
            </select>
          </div>
          <div className="flex items-center space-x-2">
            <RefreshCw className="h-4 w-4 text-gray-500" />
            <select
              className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={refreshInterval}
              onChange={(e) => setRefreshInterval(e.target.value)}
            >
              <option value="0">Manual Refresh</option>
              <option value="30">Every 30 seconds</option>
              <option value="60">Every minute</option>
              <option value="300">Every 5 minutes</option>
            </select>
          </div>
          <button className="flex items-center space-x-1 px-3 py-2 border border-gray-300 rounded-md text-sm hover:bg-gray-50">
            <Download className="h-4 w-4" />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* System Status Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
          <h3 className="text-lg font-medium text-gray-900 mb-4">System Status</h3>
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium text-gray-500">Server Load</span>
                <span className="text-sm font-medium text-green-600">Normal</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-green-500 h-2 rounded-full" style={{ width: "35%" }}></div>
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium text-gray-500">Memory Usage</span>
                <span className="text-sm font-medium text-yellow-600">Moderate</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-yellow-500 h-2 rounded-full" style={{ width: "65%" }}></div>
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium text-gray-500">Database Connections</span>
                <span className="text-sm font-medium text-green-600">Normal</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-green-500 h-2 rounded-full" style={{ width: "42%" }}></div>
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium text-gray-500">API Response Time</span>
                <span className="text-sm font-medium text-green-600">Good</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-green-500 h-2 rounded-full" style={{ width: "28%" }}></div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Active Users</h3>
          <div className="text-3xl font-bold text-blue-600 mb-2">247</div>
          <div className="text-sm text-gray-500 mb-4">users currently online</div>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Web Application</span>
              <span className="text-sm font-medium">183</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Mobile App</span>
              <span className="text-sm font-medium">64</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Admin Panel</span>
              <span className="text-sm font-medium">12</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Transaction Volume</h3>
          <div className="text-3xl font-bold text-blue-600 mb-2">1,842</div>
          <div className="text-sm text-gray-500 mb-4">transactions today</div>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Transfers</span>
              <span className="text-sm font-medium">742</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Bill Payments</span>
              <span className="text-sm font-medium">531</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Deposits/Withdrawals</span>
              <span className="text-sm font-medium">569</span>
            </div>
          </div>
        </div>
      </div>

      {/* Activity Monitoring */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100">
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 className="text-lg font-medium text-gray-900">User Activity Log</h2>
          <div className="flex items-center space-x-2">
            <Filter className="h-4 w-4 text-gray-500" />
            <select className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="all">All Activities</option>
              <option value="login">Login/Logout</option>
              <option value="transaction">Transactions</option>
              <option value="account">Account Changes</option>
              <option value="admin">Admin Actions</option>
            </select>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Timestamp
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Activity
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">IP</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Location
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              <tr className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">2023-04-15 16:42:30</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">Ahmed Ben Ali</div>
                  <div className="text-sm text-gray-500">ID: #1234</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Logged in</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">197.162.xx.xx</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Tunis, Tunisia</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                    Success
                  </span>
                </td>
              </tr>
              <tr className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">2023-04-15 16:38:15</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">Mariem Trabelsi</div>
                  <div className="text-sm text-gray-500">ID: #2345</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Transferred 500 TND</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">41.224.xx.xx</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Sousse, Tunisia</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                    Success
                  </span>
                </td>
              </tr>
              <tr className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">2023-04-15 16:35:22</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">Unknown</div>
                  <div className="text-sm text-gray-500">ID: N/A</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  Failed login attempt (User: #4587)
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">82.145.xx.xx</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Unknown</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                    Failed
                  </span>
                </td>
              </tr>
              <tr className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">2023-04-15 16:30:45</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">Sarra Mejri</div>
                  <div className="text-sm text-gray-500">ID: #4321 (Admin)</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Reset password for user #3456</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">197.162.xx.xx</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Tunis, Tunisia</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                    Success
                  </span>
                </td>
              </tr>
              <tr className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">2023-04-15 16:28:10</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">Mohamed Ben Salah</div>
                  <div className="text-sm text-gray-500">ID: #3456</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Updated contact information</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">197.162.xx.xx</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Tunis, Tunisia</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                    Success
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="px-6 py-4 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-500">
              Showing <span className="font-medium">5</span> of <span className="font-medium">243</span> activities
            </div>
            <div className="flex items-center space-x-2">
              <button className="px-3 py-1 border border-gray-300 rounded-md text-sm hover:bg-gray-50">Previous</button>
              <button className="px-3 py-1 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700">Next</button>
            </div>
          </div>
        </div>
      </div>

      {/* Real-time Alerts */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100">
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 className="text-lg font-medium text-gray-900">Real-time Security Alerts</h2>
          <div className="flex items-center space-x-2">
            <button className="flex items-center space-x-1 px-3 py-2 border border-gray-300 rounded-md text-sm hover:bg-gray-50">
              <RefreshCw className="h-4 w-4" />
              <span>Refresh</span>
            </button>
          </div>
        </div>
        <div className="p-6 space-y-4">
          <div className="bg-red-50 border-l-4 border-red-500 p-4">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-red-400"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Multiple Failed Login Attempts</h3>
                <div className="mt-2 text-sm text-red-700">
                  <p>5 failed login attempts detected for user ID #4587 from IP 82.145.xx.xx</p>
                </div>
                <div className="mt-3">
                  <div className="flex space-x-2">
                    <button className="px-2 py-1 bg-red-100 text-red-800 rounded text-xs font-medium hover:bg-red-200">
                      Block IP
                    </button>
                    <button className="px-2 py-1 bg-red-100 text-red-800 rounded text-xs font-medium hover:bg-red-200">
                      Lock Account
                    </button>
                    <button className="px-2 py-1 bg-gray-100 text-gray-800 rounded text-xs font-medium hover:bg-gray-200">
                      Dismiss
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-yellow-400"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-yellow-800">Unusual Transaction Pattern</h3>
                <div className="mt-2 text-sm text-yellow-700">
                  <p>Multiple high-value transactions detected for account #AC-78954 in short time period</p>
                </div>
                <div className="mt-3">
                  <div className="flex space-x-2">
                    <button className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded text-xs font-medium hover:bg-yellow-200">
                      Investigate
                    </button>
                    <button className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded text-xs font-medium hover:bg-yellow-200">
                      Contact User
                    </button>
                    <button className="px-2 py-1 bg-gray-100 text-gray-800 rounded text-xs font-medium hover:bg-gray-200">
                      Dismiss
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Monitoring
