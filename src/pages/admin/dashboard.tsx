import { Activity, Users, AlertTriangle, CheckCircle, Clock } from 'lucide-react'

const AdminDashboard = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
        <div className="flex space-x-2">
          <select className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option>Today</option>
            <option>Yesterday</option>
            <option>Last 7 days</option>
            <option>Last 30 days</option>
            <option>This month</option>
            <option>Last month</option>
          </select>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-700 transition-colors">
            Export Report
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Active Users</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">1,247</p>
            </div>
            <div className="bg-blue-50 p-3 rounded-lg">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center">
            <span className="text-green-500 text-sm font-medium">+5.2%</span>
            <span className="text-gray-500 text-sm ml-2">from last month</span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Today's Transactions</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">842</p>
            </div>
            <div className="bg-green-50 p-3 rounded-lg">
              <Activity className="h-6 w-6 text-green-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center">
            <span className="text-green-500 text-sm font-medium">+12.3%</span>
            <span className="text-gray-500 text-sm ml-2">from yesterday</span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Security Alerts</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">7</p>
            </div>
            <div className="bg-red-50 p-3 rounded-lg">
              <AlertTriangle className="h-6 w-6 text-red-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center">
            <span className="text-red-500 text-sm font-medium">+3</span>
            <span className="text-gray-500 text-sm ml-2">from yesterday</span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Pending Requests</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">24</p>
            </div>
            <div className="bg-yellow-50 p-3 rounded-lg">
              <Clock className="h-6 w-6 text-yellow-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center">
            <span className="text-red-500 text-sm font-medium">+8</span>
            <span className="text-gray-500 text-sm ml-2">from yesterday</span>
          </div>
        </div>
      </div>

      {/* Activity and Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-100">
          <div className="flex items-center justify-between p-6 border-b border-gray-100">
            <h2 className="text-lg font-medium text-gray-900">Recent Activity</h2>
            <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">View all</button>
          </div>
          <div className="divide-y divide-gray-100">
            <div className="p-4 hover:bg-gray-50">
              <div className="flex items-center">
                <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mr-3">
                  <Users className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">New user account created</p>
                  <p className="text-xs text-gray-500">Admin user created a new client account for Mariem Trabelsi</p>
                  <p className="text-xs text-gray-400 mt-1">10 minutes ago</p>
                </div>
              </div>
            </div>
            <div className="p-4 hover:bg-gray-50">
              <div className="flex items-center">
                <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center text-green-600 mr-3">
                  <CheckCircle className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Loan request approved</p>
                  <p className="text-xs text-gray-500">Admin approved loan request #LN-2023-089 for 50,000 TND</p>
                  <p className="text-xs text-gray-400 mt-1">25 minutes ago</p>
                </div>
              </div>
            </div>
            <div className="p-4 hover:bg-gray-50">
              <div className="flex items-center">
                <div className="h-8 w-8 rounded-full bg-red-100 flex items-center justify-center text-red-600 mr-3">
                  <AlertTriangle className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Failed login attempt</p>
                  <p className="text-xs text-gray-500">Multiple failed login attempts for user ID #4587</p>
                  <p className="text-xs text-gray-400 mt-1">45 minutes ago</p>
                </div>
              </div>
            </div>
            <div className="p-4 hover:bg-gray-50">
              <div className="flex items-center">
                <div className="h-8 w-8 rounded-full bg-yellow-100 flex items-center justify-center text-yellow-600 mr-3">
                  <Clock className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Password reset</p>
                  <p className="text-xs text-gray-500">Admin reset password for user Mohamed Ben Salah</p>
                  <p className="text-xs text-gray-400 mt-1">1 hour ago</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Security Alerts */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-100">
          <div className="flex items-center justify-between p-6 border-b border-gray-100">
            <h2 className="text-lg font-medium text-gray-900">Security Alerts</h2>
            <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">View all</button>
          </div>
          <div className="divide-y divide-gray-100">
            <div className="p-4 hover:bg-gray-50">
              <div className="flex items-start">
                <div className="h-8 w-8 rounded-full bg-red-100 flex items-center justify-center text-red-600 mr-3 mt-1">
                  <AlertTriangle className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Multiple failed login attempts</p>
                  <p className="text-xs text-gray-500">
                    5 failed login attempts detected for user ID #4587 from IP 197.162.xx.xx
                  </p>
                  <div className="mt-2 flex space-x-2">
                    <button className="px-3 py-1 bg-red-100 text-red-700 rounded-md text-xs font-medium hover:bg-red-200">
                      Block IP
                    </button>
                    <button className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-md text-xs font-medium hover:bg-yellow-200">
                      Lock Account
                    </button>
                    <button className="px-3 py-1 bg-gray-100 text-gray-700 rounded-md text-xs font-medium hover:bg-gray-200">
                      Ignore
                    </button>
                  </div>
                  <p className="text-xs text-gray-400 mt-2">20 minutes ago</p>
                </div>
              </div>
            </div>
            <div className="p-4 hover:bg-gray-50">
              <div className="flex items-start">
                <div className="h-8 w-8 rounded-full bg-red-100 flex items-center justify-center text-red-600 mr-3 mt-1">
                  <AlertTriangle className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Unusual transaction pattern</p>
                  <p className="text-xs text-gray-500">
                    Multiple high-value transactions detected for account #AC-78954 in short time period
                  </p>
                  <div className="mt-2 flex space-x-2">
                    <button className="px-3 py-1 bg-red-100 text-red-700 rounded-md text-xs font-medium hover:bg-red-200">
                      Freeze Account
                    </button>
                    <button className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-md text-xs font-medium hover:bg-yellow-200">
                      Contact User
                    </button>
                    <button className="px-3 py-1 bg-gray-100 text-gray-700 rounded-md text-xs font-medium hover:bg-gray-200">
                      Ignore
                    </button>
                  </div>
                  <p className="text-xs text-gray-400 mt-2">35 minutes ago</p>
                </div>
              </div>
            </div>
            <div className="p-4 hover:bg-gray-50">
              <div className="flex items-start">
                <div className="h-8 w-8 rounded-full bg-yellow-100 flex items-center justify-center text-yellow-600 mr-3 mt-1">
                  <AlertTriangle className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">New device login</p>
                  <p className="text-xs text-gray-500">
                    User ID #3421 logged in from a new device (iPhone) in Tunis
                  </p>
                  <div className="mt-2 flex space-x-2">
                    <button className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-md text-xs font-medium hover:bg-yellow-200">
                      Verify
                    </button>
                    <button className="px-3 py-1 bg-gray-100 text-gray-700 rounded-md text-xs font-medium hover:bg-gray-200">
                      Ignore
                    </button>
                  </div>
                  <p className="text-xs text-gray-400 mt-2">1 hour ago</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard
