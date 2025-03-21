import type React from "react"
import { Link } from "react-router-dom"
import { Users, CreditCard, FileText, Activity, TrendingUp, TrendingDown } from "lucide-react"
import { mockSystemUsers, mockAccounts, mockLoanApplications, mockActivityLogs } from "../../data/mock-data"

const AdminOverviewPage: React.FC = () => {
  // Count active users
  const activeUsers = mockSystemUsers.filter((user) => user.role === "user" && user.status !== "inactive").length

  // Count active accounts
  const activeAccounts = mockAccounts.filter((account) => account.status === "active").length

  // Count pending loan applications
  const pendingLoans = mockLoanApplications.filter((loan) => loan.status === "pending").length

  // Get recent activity logs
  const recentLogs = [...mockActivityLogs]
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, 5)

  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900">Admin Dashboard</h1>

      <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {/* Card 1 */}
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-blue-100 rounded-md p-3">
                <Users className="h-6 w-6 text-blue-900" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Active Users</dt>
                  <dd>
                    <div className="text-lg font-medium text-gray-900">{activeUsers}</div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-5 py-3">
            <div className="text-sm">
              <Link to="/admin/users" className="font-medium text-blue-900 hover:text-blue-800">
                View all
              </Link>
            </div>
          </div>
        </div>

        {/* Card 2 */}
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-blue-100 rounded-md p-3">
                <CreditCard className="h-6 w-6 text-blue-900" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Active Accounts</dt>
                  <dd>
                    <div className="text-lg font-medium text-gray-900">{activeAccounts}</div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-5 py-3">
            <div className="text-sm">
              <Link to="/admin/accounts" className="font-medium text-blue-900 hover:text-blue-800">
                View all
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
                  <dt className="text-sm font-medium text-gray-500 truncate">Pending Loans</dt>
                  <dd>
                    <div className="text-lg font-medium text-gray-900">{pendingLoans}</div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-5 py-3">
            <div className="text-sm">
              <Link to="/admin/loans" className="font-medium text-blue-900 hover:text-blue-800">
                View all
              </Link>
            </div>
          </div>
        </div>

        {/* Card 4 */}
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-blue-100 rounded-md p-3">
                <Activity className="h-6 w-6 text-blue-900" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Activity Logs</dt>
                  <dd>
                    <div className="text-lg font-medium text-gray-900">{mockActivityLogs.length}</div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-5 py-3">
            <div className="text-sm">
              <Link to="/admin/activity" className="font-medium text-blue-900 hover:text-blue-800">
                View all
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="mt-8">
        <h2 className="text-lg font-medium text-gray-900">Recent Activity</h2>
        <div className="mt-4 bg-white shadow overflow-hidden sm:rounded-md">
          <ul className="divide-y divide-gray-200">
            {recentLogs.map((log) => (
              <li key={log.id}>
                <div className="px-4 py-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-blue-900 truncate">{log.action}</p>
                    <div className="ml-2 flex-shrink-0 flex">
                      <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        {new Date(log.timestamp).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <div className="mt-2 sm:flex sm:justify-between">
                    <div className="sm:flex">
                      <p className="flex items-center text-sm text-gray-500">
                        <Users className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
                        User ID: {log.userId}
                      </p>
                    </div>
                    <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                      <p>{log.details}</p>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Charts Section */}
      <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <h3 className="text-lg font-medium text-gray-900">User Growth</h3>
            <div className="mt-4 flex items-center">
              <div className="flex-1">
                <div className="h-16 bg-gray-200 rounded-md overflow-hidden">
                  <div className="h-full bg-blue-900 w-3/4"></div>
                </div>
                <div className="mt-2 flex justify-between text-sm text-gray-500">
                  <div>Jan</div>
                  <div>Feb</div>
                  <div>Mar</div>
                  <div>Apr</div>
                  <div>May</div>
                  <div>Jun</div>
                </div>
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <TrendingUp className="h-4 w-4 text-green-500 mr-1.5" />
              <span className="text-green-500 font-medium">12% increase</span>
              <span className="text-gray-500 ml-1.5">from last month</span>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <h3 className="text-lg font-medium text-gray-900">Transaction Volume</h3>
            <div className="mt-4 flex items-center">
              <div className="flex-1">
                <div className="h-16 bg-gray-200 rounded-md overflow-hidden">
                  <div className="h-full bg-blue-900 w-2/3"></div>
                </div>
                <div className="mt-2 flex justify-between text-sm text-gray-500">
                  <div>Jan</div>
                  <div>Feb</div>
                  <div>Mar</div>
                  <div>Apr</div>
                  <div>May</div>
                  <div>Jun</div>
                </div>
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <TrendingDown className="h-4 w-4 text-red-500 mr-1.5" />
              <span className="text-red-500 font-medium">3% decrease</span>
              <span className="text-gray-500 ml-1.5">from last month</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminOverviewPage

