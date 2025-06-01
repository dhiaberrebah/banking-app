import { useState, useEffect } from "react"
import axios from "axios"
import {
  CreditCard,
  Calendar,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  Download,
  Wallet,
  PiggyBank,
  DollarSign,
  Building,
  Percent,
  AlertCircle,
  LockIcon,
  XCircle,
  ArrowRight,
  Info,
  MapPin
} from "lucide-react"
import { useNavigate } from "react-router-dom"

interface AccountDetailsProps {
  accountId: string
  onViewTransactions?: () => void
}

interface AccountData {
  id: string
  accountNumber: string
  accountType: string
  currency: string
  balance: number
  availableBalance?: number
  status: string
  createdAt: string
  lastActivity?: string
  branch?: string
  interestRate?: number
  iban?: string
  bic?: string
  transactionCount?: number
  rejectionReason?: string
  recentTransactions?: {
    id: string
    date: string
    description: string
    amount: number
    type: string
  }[]
}

export function AccountDetails({ accountId, onViewTransactions }: AccountDetailsProps) {
  const navigate = useNavigate()
  const [account, setAccount] = useState<AccountData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const handleDownloadStatement = () => {
    if (!account) return
    
    console.log("Downloading statement for account:", accountId)
    
    // Create a mock PDF-like content (in a real app, this would be fetched from an API)
    // For demo purposes, we'll create a text file with some mock statement data
    const statementContent = `
BANK STATEMENT
--------------
Account: ${account.accountNumber}
Account Type: ${account.accountType}
Date: ${new Date().toLocaleDateString()}
Currency: ${account.currency}

TRANSACTIONS
-----------
2023-10-15 | Salary Deposit       | +2,500.00
2023-10-10 | Grocery Store        | -120.50
2023-10-05 | Utility Bill Payment | -85.30
2023-10-01 | ATM Withdrawal       | -200.00

SUMMARY
------
Opening Balance: ${(account.balance - 2094.20).toFixed(2)}
Total Credits: +2,500.00
Total Debits: -405.80
Closing Balance: ${account.balance.toFixed(2)}
  `
    
    // Create a Blob with the content
    const blob = new Blob([statementContent], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    
    // Create a download link
    const fileName = `statement_${account.accountNumber}_${new Date().toISOString().split('T')[0]}.txt`
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', fileName)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }
  
  const handleViewTransactions = () => {
    // Instead of navigating away, we'll set the parent component's activeTab to "transactions"
    // We need to pass this function as a prop from the parent
    if (onViewTransactions) {
      onViewTransactions()
    }
  }

  useEffect(() => {
    const fetchAccountDetails = async () => {
      setLoading(true)
      try {
        const response = await axios.get(
          `http://localhost:5001/api/users/accounts/${accountId}`,
          { withCredentials: true }
        )
        
        if (response.data.success) {
          setAccount(response.data.account)
          setError(null)
        } else {
          setError(response.data.message || "Failed to load account details")
        }
      } catch (err: any) {
        console.error("Failed to fetch account details:", err)
        setError(err.response?.data?.message || "Failed to load account details. Please try again.")
      } finally {
        setLoading(false)
      }
    }

    if (accountId) {
      fetchAccountDetails()
    }
  }, [accountId])

  if (loading) {
    return <div className="p-4 text-center">Loading account details...</div>
  }

  if (error) {
    return <div className="p-4 text-center text-red-500">{error}</div>
  }

  if (!account) {
    return <div className="p-4 text-center text-gray-500">Account not found</div>
  }

  // Render different content based on account status
  if (account.status === "pending") {
    return (
      <div className="space-y-6">
        <div className="flex flex-col items-center justify-center p-8 text-center">
          <div className="mb-4 w-16 h-16 rounded-full bg-yellow-50 flex items-center justify-center">
            <AlertCircle className="h-8 w-8 text-yellow-500" />
          </div>
          <h3 className="text-xl font-semibold text-yellow-700 mb-2">Account Pending Approval</h3>
          <p className="text-gray-600 max-w-md">
            Your account application is currently under review. This process typically takes 1-2 business days.
            You'll receive a notification once your account is activated.
          </p>
          <div className="mt-6 p-4 bg-yellow-50 rounded-lg border border-yellow-100 w-full max-w-md">
            <h4 className="font-medium text-yellow-800 mb-2">Account Information</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-500">Account Type</p>
                <p className="font-medium text-gray-800 capitalize">{account.accountType}</p>
              </div>
              <div>
                <p className="text-gray-500">Currency</p>
                <p className="font-medium text-gray-800">{account.currency}</p>
              </div>
              <div>
                <p className="text-gray-500">Application Date</p>
                <p className="font-medium text-gray-800">{new Date(account.createdAt).toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-gray-500">Status</p>
                <p className="font-medium text-yellow-600">Pending</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (account.status === "closed") {
    return (
      <div className="space-y-6">
        <div className="flex flex-col items-center justify-center p-8 text-center">
          <div className="mb-4 w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center">
            <XCircle className="h-8 w-8 text-gray-500" />
          </div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">Account Closed</h3>
          <p className="text-gray-600 max-w-md">
            This account has been closed. If you need to access historical data or have questions about this account,
            please contact customer support.
          </p>
          
          {/* Display rejection reason if available */}
          {account.rejectionReason && (
            <div className="mt-6 p-4 bg-red-50 rounded-lg border border-red-200 w-full max-w-md">
              <h4 className="font-medium text-red-800 mb-2">Reason for Closure</h4>
              <p className="text-red-700">{account.rejectionReason}</p>
            </div>
          )}
          
          <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200 w-full max-w-md">
            <h4 className="font-medium text-gray-800 mb-2">Account Information</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-500">Account Number</p>
                <p className="font-medium">{account.accountNumber}</p>
              </div>
              <div>
                <p className="text-gray-500">Account Type</p>
                <p className="font-medium">{account.accountType}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (account.status === "frozen") {
    return (
      <div className="space-y-6">
        <div className="flex flex-col items-center justify-center p-8 text-center">
          <div className="mb-4 w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center">
            <LockIcon className="h-8 w-8 text-blue-500" />
          </div>
          <h3 className="text-xl font-semibold text-blue-700 mb-2">Account Temporarily Frozen</h3>
          <p className="text-gray-600 max-w-md">
            This account is currently frozen. This may be due to security concerns or at your request.
            Please contact customer support for more information and to resolve this issue.
          </p>
          <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-100 w-full max-w-md">
            <h4 className="font-medium text-blue-800 mb-2">Account Information</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-500">Account Number</p>
                <p className="font-medium text-gray-800">{account.accountNumber}</p>
              </div>
              <div>
                <p className="text-gray-500">Account Type</p>
                <p className="font-medium text-gray-800 capitalize">{account.accountType}</p>
              </div>
              <div>
                <p className="text-gray-500">Balance</p>
                <p className="font-medium text-gray-800">
                  {account.balance.toLocaleString()} <span className="text-sm">{account.currency}</span>
                </p>
              </div>
              <div>
                <p className="text-gray-500">Status</p>
                <p className="font-medium text-blue-600">Frozen</p>
              </div>
            </div>
          </div>
          <button className="mt-6 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
            Contact Support
          </button>
        </div>
      </div>
    )
  }

  // For active accounts
  const getIconComponent = () => {
    if (account.accountType === "savings") return PiggyBank
    if (account.currency === "USD") return DollarSign
    return Wallet
  }

  const AccountIcon = getIconComponent()

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-6 md:flex-row">
        <div className="flex-1 rounded-xl border border-blue-100 bg-white p-5 shadow-sm transition-all duration-200 hover:shadow-md">
          <div className="mb-4 flex items-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-sm">
              <AccountIcon className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <h3 className="font-medium text-blue-900 text-lg">
                {account.accountType.charAt(0).toUpperCase() + account.accountType.slice(1)} Account
              </h3>
              <p className="text-sm text-gray-500">{account.accountNumber}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6 mt-6">
            <div className="rounded-lg bg-gradient-to-br from-blue-50 to-white p-4 border border-blue-100">
              <p className="text-sm text-blue-600 mb-1">Current Balance</p>
              <p className="text-2xl font-bold text-blue-900">
                {account.balance.toLocaleString()} <span className="text-sm">{account.currency}</span>
              </p>
            </div>
            <div className="rounded-lg bg-gradient-to-br from-blue-50 to-white p-4 border border-blue-100">
              <p className="text-sm text-blue-600 mb-1">Available Balance</p>
              <p className="text-2xl font-bold text-blue-900">
                {(account.availableBalance || account.balance).toLocaleString()} <span className="text-sm">{account.currency}</span>
              </p>
            </div>
          </div>
        </div>

        <div className="flex-1 rounded-xl border border-blue-100 bg-white p-5 shadow-sm transition-all duration-200 hover:shadow-md">
          <h3 className="mb-4 font-medium text-blue-900 text-lg">Account Information</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 text-sm">
            <div className="flex items-center">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-blue-600 mr-3">
                <Calendar className="h-4 w-4" />
              </div>
              <div>
                <p className="text-gray-500 text-xs">Open Date</p>
                <p className="font-medium text-blue-900">{new Date(account.createdAt).toLocaleDateString()}</p>
              </div>
            </div>

            <div className="flex items-center">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-blue-600 mr-3">
                <Clock className="h-4 w-4" />
              </div>
              <div>
                <p className="text-gray-500 text-xs">Last Activity</p>
                <p className="font-medium text-blue-900">
                  {account.lastActivity ? new Date(account.lastActivity).toLocaleDateString() : "N/A"}
                </p>
              </div>
            </div>

            <div className="flex items-center">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-blue-600 mr-3">
                <CreditCard className="h-4 w-4" />
              </div>
              <div>
                <p className="text-gray-500 text-xs">Account Type</p>
                <p className="font-medium text-blue-900 capitalize">{account.accountType}</p>
              </div>
            </div>

            <div className="flex items-center">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-blue-600 mr-3">
                <Percent className="h-4 w-4" />
              </div>
              <div>
                <p className="text-gray-500 text-xs">Interest Rate</p>
                <p className="font-medium text-blue-900">{account.interestRate || 0}%</p>
              </div>
            </div>

            <div className="flex items-center">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-blue-600 mr-3">
                <Building className="h-4 w-4" />
              </div>
              <div>
                <p className="text-gray-500 text-xs">Branch</p>
                <p className="font-medium text-blue-900">{account.branch || "Main Branch"}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {account.iban && (
        <div className="rounded-xl border border-blue-100 bg-white p-5 shadow-sm">
          <h3 className="mb-4 font-medium text-blue-900 text-lg">International Banking Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-3 bg-blue-50 rounded-lg">
              <p className="text-xs text-blue-600 mb-1">IBAN</p>
              <p className="font-mono text-blue-900">{account.iban}</p>
            </div>
            {account.bic && (
              <div className="p-3 bg-blue-50 rounded-lg">
                <p className="text-xs text-blue-600 mb-1">BIC/SWIFT</p>
                <p className="font-mono text-blue-900">{account.bic}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {account.status === "active" && (
        <div className="rounded-xl border border-amber-100 bg-amber-50 p-5 mb-6">
          <h3 className="mb-3 font-medium text-amber-800 text-lg flex items-center">
            <Info className="h-5 w-5 mr-2" /> Important Information
          </h3>
          <p className="text-amber-700">
            Please note that cash deposits and withdrawals must be made in person at any AMEN Bank branch. 
            Visit your nearest branch with your ID and account details during business hours.
          </p>
          <div className="mt-3 flex items-center">
            <MapPin className="h-4 w-4 text-amber-600 mr-2" />
            <a href="/branches" className="text-blue-600 hover:underline text-sm">
              Find your nearest AMEN Bank branch
            </a>
          </div>
        </div>
      )}

      <div className="flex justify-end gap-3">
        <button 
          className="px-4 py-2 rounded-md text-sm font-medium bg-white text-blue-600 border border-blue-200 hover:bg-blue-50 transition-all flex items-center"
          onClick={handleDownloadStatement}
        >
          <Download className="mr-2 h-4 w-4" /> Download Statement
        </button>
        <button 
          className="px-4 py-2 rounded-md text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 transition-all shadow-md flex items-center"
          onClick={handleViewTransactions}
        >
          View All Transactions <ArrowRight className="ml-2 h-4 w-4" />
        </button>
      </div>

      {account && (
        <div className="mt-6">
          <h3 className="text-lg font-medium mb-3">Transaction Summary</h3>
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
            <div className="flex justify-between items-center mb-3">
              <span className="text-gray-600">Total Transactions</span>
              <span className="font-medium">{account.transactionCount || 0}</span>
            </div>
            
            {account.recentTransactions && account.recentTransactions.length > 0 ? (
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">Recent Activity</h4>
                <div className="space-y-2">
                  {account.recentTransactions.map(tx => (
                    <div key={tx.id} className="flex justify-between items-center text-sm p-2 hover:bg-gray-100 rounded">
                      <div>
                        <div className="font-medium">{tx.description}</div>
                        <div className="text-gray-500 text-xs">
                          {new Date(tx.date).toLocaleDateString()}
                        </div>
                      </div>
                      <div className={tx.type === "deposit" ? "text-green-600" : "text-red-600"}>
                        {tx.type === "deposit" ? "+" : "-"} {Math.abs(tx.amount).toLocaleString()} {account.currency}
                      </div>
                    </div>
                  ))}
                </div>
                <button 
                  onClick={handleViewTransactions}
                  className="w-full mt-3 text-center text-blue-600 text-sm hover:underline flex items-center justify-center"
                >
                  View all transactions <ArrowRight className="ml-1 h-3 w-3" />
                </button>
              </div>
            ) : (
              <div className="text-center text-gray-500 text-sm py-2">
                No recent transactions
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
