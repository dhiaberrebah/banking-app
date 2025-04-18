import { useState, useEffect } from 'react'
import { Activity, Users, AlertTriangle, CheckCircle, Clock, CreditCard, BriefcaseBusiness, PiggyBank, TrendingUp, TrendingDown, DollarSign, BarChart4, ArrowUpRight, Wallet, FileText, User } from 'lucide-react'
import axios from 'axios'
import { toast } from 'react-hot-toast'
import { Card } from "../../components/ui/card"
import { Skeleton } from "../../components/ui/skeleton"
import { formatCurrency } from "../../utils/formatters"
import { Link } from "react-router-dom"

interface DashboardStats {
  users: {
    total: number
  },
  accounts: {
    total: number,
    pending: number,
    active: number,
    byType: {
      savings: number,
      checking: number,
      business: number
    }
  },
  transactions: {
    total: number,
    today: number
  },
  loans: {
    total: number,
    pending: number,
    approved: number,
    rejected?: number
  }
}

interface ActivityItem {
  id: string;
  type: string;
  description: string;
  timestamp: string;
  icon?: React.ReactNode;
  iconBg?: string;
}

const AdminDashboard = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [timeframe, setTimeframe] = useState('today')
  const [recentActivity, setRecentActivity] = useState<ActivityItem[]>([])
  const [securityAlerts, setSecurityAlerts] = useState<ActivityItem[]>([])
  const [activityLoading, setActivityLoading] = useState(true)

  useEffect(() => {
    fetchDashboardStats()
    fetchRecentActivity()
  }, [timeframe])

  const fetchDashboardStats = async () => {
    setLoading(true)
    try {
      const response = await axios.get('http://localhost:5001/api/admin/dashboard-stats', {
        withCredentials: true,
        params: { timeframe }
      })

      if (response.data.success) {
        console.log('Dashboard stats received:', response.data.stats)
        setStats(response.data.stats)
      } else {
        toast.error('Failed to fetch dashboard statistics')
      }
    } catch (error) {
      console.error('Error fetching dashboard stats:', error)
      toast.error('Error loading dashboard data')
    } finally {
      setLoading(false)
    }
  }

  const fetchRecentActivity = async () => {
    setActivityLoading(true)
    try {
      const transfersResponse = await axios.get('http://localhost:5001/api/admin/transfers', {
        withCredentials: true,
        params: { limit: 5 }
      })

      if (transfersResponse.data.success) {
        const activities = transfersResponse.data.transfers.map((transfer: any) => ({
          id: transfer._id,
          type: 'transfer',
          description: `${transfer.sender?.name || 'User'} transferred ${formatCurrency(transfer.amount)} to ${transfer.destinationAccount?.accountHolder || 'recipient'}`,
          timestamp: transfer.createdAt,
          icon: <Activity />,
          iconBg: 'bg-blue-100 text-blue-600'
        }));
        setRecentActivity(activities);
      }
      
      // Fetch security alerts from a real endpoint if available
      try {
        const alertsResponse = await axios.get('http://localhost:5001/api/admin/security-alerts', {
          withCredentials: true,
          params: { limit: 3 }
        })
        
        if (alertsResponse.data.success) {
          setSecurityAlerts(alertsResponse.data.alerts);
        }
      } catch (alertError) {
        console.log('Security alerts endpoint not available, using demo data');
        // Fallback to demo data if endpoint doesn't exist
        const alerts = [
          {
            id: '1',
            type: 'security',
            description: 'Multiple failed login attempts detected for user ID #4587',
            timestamp: new Date().toISOString(),
            icon: <AlertTriangle />,
            iconBg: 'bg-red-100 text-red-600'
          },
          {
            id: '2',
            type: 'security',
            description: 'Unusual transaction pattern detected for account #AC-78954',
            timestamp: new Date(Date.now() - 35 * 60000).toISOString(),
            icon: <AlertTriangle />,
            iconBg: 'bg-red-100 text-red-600'
          }
        ];
        setSecurityAlerts(alerts);
      }
    } catch (error) {
      console.error('Error fetching activity data:', error)
      toast.error('Error loading activity data')
    } finally {
      setActivityLoading(false)
    }
  }

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  // Calculate time ago for activity items
  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.round(diffMs / 60000);
    
    if (diffMins < 1) return 'just now';
    if (diffMins < 60) return `${diffMins} minutes ago`;
    
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours} hours ago`;
    
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays} days ago`;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
        <div className="flex space-x-2">
          <select 
            className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={timeframe}
            onChange={(e) => setTimeframe(e.target.value)}
          >
            <option value="today">Today</option>
            <option value="yesterday">Yesterday</option>
            <option value="week">Last 7 days</option>
            <option value="month">Last 30 days</option>
          </select>
          <button 
            onClick={fetchDashboardStats}
            className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-700 transition-colors flex items-center"
          >
            <ArrowUpRight className="h-4 w-4 mr-1" />
            Refresh Data
          </button>
        </div>
      </div>

      {/* Main Stats Cards */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="bg-white rounded-lg shadow-sm p-6 border border-gray-100 animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
              <div className="h-8 bg-gray-200 rounded w-1/3 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-1/4"></div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Users Card */}
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Active Users</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stats?.users.total || 0}</p>
              </div>
              <div className="bg-blue-50 p-3 rounded-lg">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center">
              <span className="text-green-500 text-sm font-medium flex items-center">
                <TrendingUp className="h-3 w-3 mr-1" />
                Active now
              </span>
            </div>
          </div>

          {/* Active Accounts Card */}
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Active Accounts</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stats?.accounts.active || 0}</p>
              </div>
              <div className="bg-green-50 p-3 rounded-lg">
                <CreditCard className="h-6 w-6 text-green-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center">
              <span className="text-green-500 text-sm font-medium">
                {Math.round((stats?.accounts.active || 0) / (stats?.accounts.total || 1) * 100)}%
              </span>
              <span className="text-gray-500 text-sm ml-2">of total accounts</span>
            </div>
          </div>

          {/* Pending Accounts Card */}
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Pending Accounts</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stats?.accounts.pending || 0}</p>
              </div>
              <div className="bg-yellow-50 p-3 rounded-lg">
                <Clock className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center">
              <span className="text-yellow-600 text-sm font-medium">
                Require review
              </span>
            </div>
          </div>

          {/* Transactions Card */}
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Today's Transactions</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stats?.transactions?.today || 0}</p>
              </div>
              <div className="bg-purple-50 p-3 rounded-lg">
                <Activity className="h-6 w-6 text-purple-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center">
              <span className="text-purple-600 text-sm font-medium">
                {stats?.transactions?.total || 0} total
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Secondary Stats */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => (
            <div key={i} className="bg-white rounded-lg shadow-sm p-6 border border-gray-100 animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
              <div className="h-8 bg-gray-200 rounded w-1/3 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-1/4"></div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Account Types Card */}
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">Account Types</h3>
              <div className="flex space-x-1">
                <div className="bg-blue-50 p-2 rounded-lg">
                  <PiggyBank className="h-4 w-4 text-blue-600" />
                </div>
                <div className="bg-green-50 p-2 rounded-lg">
                  <CreditCard className="h-4 w-4 text-green-600" />
                </div>
                <div className="bg-purple-50 p-2 rounded-lg">
                  <BriefcaseBusiness className="h-4 w-4 text-purple-600" />
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-gray-500">Savings</span>
                  <span className="text-sm font-medium text-blue-600">{stats?.accounts.byType.savings || 0}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-500 h-2 rounded-full" 
                    style={{ 
                      width: `${Math.round((stats?.accounts.byType.savings || 0) / (stats?.accounts.total || 1) * 100)}%` 
                    }}
                  ></div>
                </div>
              </div>
              
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-gray-500">Checking</span>
                  <span className="text-sm font-medium text-green-600">{stats?.accounts.byType.checking || 0}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-green-500 h-2 rounded-full" 
                    style={{ 
                      width: `${Math.round((stats?.accounts.byType.checking || 0) / (stats?.accounts.total || 1) * 100)}%` 
                    }}
                  ></div>
                </div>
              </div>
              
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-gray-500">Business</span>
                  <span className="text-sm font-medium text-purple-600">{stats?.accounts.byType.business || 0}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-purple-500 h-2 rounded-full" 
                    style={{ 
                      width: `${Math.round((stats?.accounts.byType.business || 0) / (stats?.accounts.total || 1) * 100)}%` 
                    }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          {/* Loan Status Card */}
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">Loan Status</h3>
              <div className="bg-green-50 p-2 rounded-lg">
                <DollarSign className="h-4 w-4 text-green-600" />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-blue-50 rounded-lg p-4 text-center">
                <p className="text-sm text-gray-500">Total</p>
                <p className="text-xl font-bold text-blue-600">{stats?.loans?.total || 0}</p>
              </div>
              
              <div className="bg-green-50 rounded-lg p-4 text-center">
                <p className="text-sm text-gray-500">Approved</p>
                <p className="text-xl font-bold text-green-600">{stats?.loans?.approved || 0}</p>
              </div>
              
              <div className="bg-yellow-50 rounded-lg p-4 text-center">
                <p className="text-sm text-gray-500">Pending</p>
                <p className="text-xl font-bold text-yellow-600">{stats?.loans?.pending || 0}</p>
              </div>
              
              <div className="bg-red-50 rounded-lg p-4 text-center">
                <p className="text-sm text-gray-500">Rejected</p>
                <p className="text-xl font-bold text-red-600">{stats?.loans?.rejected || 0}</p>
              </div>
            </div>
          </div>

          {/* Transaction Metrics Card */}
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">Transaction Metrics</h3>
              <div className="bg-purple-50 p-2 rounded-lg">
                <BarChart4 className="h-4 w-4 text-purple-600" />
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Today</p>
                  <p className="text-xl font-bold text-gray-900">{stats?.transactions?.today || 0}</p>
                </div>
                <div className="text-green-500 flex items-center">
                  <TrendingUp className="h-4 w-4 mr-1" />
                  <span className="text-sm">Active</span>
                </div>
              </div>
              
              <div className="h-px bg-gray-200 my-2"></div>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Total</p>
                  <p className="text-xl font-bold text-gray-900">{stats?.transactions?.total || 0}</p>
                </div>
                <div className="text-gray-500 flex items-center">
                  <TrendingDown className="h-4 w-4 mr-1" />
                  <span className="text-sm">Last 30 days</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Summary Statistics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
          <h2 className="text-lg font-medium text-gray-900 mb-4">System Overview</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-blue-50 rounded-lg p-4 text-center">
              <p className="text-sm text-gray-500">Total Users</p>
              <p className="text-xl font-bold text-blue-600">{stats?.users.total || 0}</p>
            </div>
            <div className="bg-green-50 rounded-lg p-4 text-center">
              <p className="text-sm text-gray-500">Active Accounts</p>
              <p className="text-xl font-bold text-green-600">{stats?.accounts.active || 0}</p>
            </div>
            <div className="bg-purple-50 rounded-lg p-4 text-center">
              <p className="text-sm text-gray-500">Today's Transactions</p>
              <p className="text-xl font-bold text-purple-600">{stats?.transactions?.today || 0}</p>
            </div>
            <div className="bg-yellow-50 rounded-lg p-4 text-center">
              <p className="text-sm text-gray-500">Pending Accounts</p>
              <p className="text-xl font-bold text-yellow-600">{stats?.accounts.pending || 0}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-4">
            <Link 
              to="/admin/users" 
              className="flex flex-col items-center justify-center bg-blue-50 rounded-lg p-4 hover:bg-blue-100 transition-colors"
            >
              <Users className="h-6 w-6 text-blue-600 mb-2" />
              <span className="text-sm font-medium">Manage Users</span>
            </Link>
            <Link 
              to="/admin/requests/accounts" 
              className="flex flex-col items-center justify-center bg-green-50 rounded-lg p-4 hover:bg-green-100 transition-colors"
            >
              <CreditCard className="h-6 w-6 text-green-600 mb-2" />
              <span className="text-sm font-medium">Review Accounts</span>
            </Link>
            <Link 
              to="/admin/requests/loans" 
              className="flex flex-col items-center justify-center bg-yellow-50 rounded-lg p-4 hover:bg-yellow-100 transition-colors"
            >
              <DollarSign className="h-6 w-6 text-yellow-600 mb-2" />
              <span className="text-sm font-medium">Loan Requests</span>
            </Link>
            <Link 
              to="/admin/profile" // Changed from "/admin/monitoring"
              className="flex flex-col items-center justify-center bg-purple-50 rounded-lg p-4 hover:bg-purple-100 transition-colors"
            >
              <User className="h-6 w-6 text-purple-600 mb-2" /> {/* Changed from Activity to User icon */}
              <span className="text-sm font-medium">Admin Profile</span> {/* Changed text */}
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard
