import { Link } from "react-router-dom"
import { CreditCard, Send, FileText, TrendingUp, Calculator } from "lucide-react"

export function DashboardCards() {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
      <div className="card overflow-hidden hover-card border-t-4 border-t-blue-500">
        <div className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-[var(--muted)]">Total Balance</p>
              <h3 className="text-2xl font-bold mt-1">17,751.25 TND</h3>
              <p className="text-xs text-green-600 mt-1 flex items-center">
                <TrendingUp className="h-3 w-3 mr-1" />
                +2.5% from last month
              </p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
              <CreditCard className="h-6 w-6 text-blue-600" />
            </div>
          </div>
          <div className="mt-4">
            <Link to="/accounts" className="text-blue-600 hover:underline text-sm font-medium">
              View all accounts →
            </Link>
          </div>
        </div>
      </div>

      <div className="card overflow-hidden hover-card border-t-4 border-t-indigo-500">
        <div className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-[var(--muted)]">Quick Transfer</p>
              <h3 className="text-2xl font-bold mt-1">Send Money</h3>
              <p className="text-xs text-[var(--muted)] mt-1">Fast and secure transfers</p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-indigo-100">
              <Send className="h-6 w-6 text-indigo-600" />
            </div>
          </div>
          <div className="mt-4">
            <Link to="/transfers" className="text-indigo-600 hover:underline text-sm font-medium">
              Make a transfer →
            </Link>
          </div>
        </div>
      </div>

      <div className="card overflow-hidden hover-card border-t-4 border-t-purple-500">
        <div className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-[var(--muted)]">Transaction History</p>
              <h3 className="text-2xl font-bold mt-1">View & Export</h3>
              <p className="text-xs text-[var(--muted)] mt-1">Download statements</p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-purple-100">
              <FileText className="h-6 w-6 text-purple-600" />
            </div>
          </div>
          <div className="mt-4">
            <Link to="/transactions" className="text-purple-600 hover:underline text-sm font-medium">
              View transactions →
            </Link>
          </div>
        </div>
      </div>

      <div className="card overflow-hidden hover-card border-t-4 border-t-emerald-500">
        <div className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-[var(--muted)]">Loan Simulator</p>
              <h3 className="text-2xl font-bold mt-1">Calculate</h3>
              <p className="text-xs text-[var(--muted)] mt-1">Plan your finances</p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100">
              <Calculator className="h-6 w-6 text-emerald-600" />
            </div>
          </div>
          <div className="mt-4">
            <Link to="/loans" className="text-emerald-600 hover:underline text-sm font-medium">
              Try simulator →
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
