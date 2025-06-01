import { Link } from "react-router-dom"
import { ArrowDownRight, ArrowUpRight, ExternalLink } from "lucide-react"

const transactions = [
  {
    id: 1,
    description: "Salary Deposit",
    date: "4/10/2023",
    amount: 2500,
    type: "deposit",
    category: "Income",
  },
  {
    id: 2,
    description: "Grocery Store",
    date: "4/8/2023",
    amount: -150.25,
    type: "withdrawal",
    category: "Shopping",
  },
  {
    id: 3,
    description: "Electric Bill",
    date: "4/5/2023",
    amount: -85.5,
    type: "withdrawal",
    category: "Utilities",
  },
  {
    id: 4,
    description: "Transfer from Checking",
    date: "4/3/2023",
    amount: 500,
    type: "deposit",
    category: "Transfer",
  },
]

export function RecentTransactions() {
  return (
    <div className="card">
      <div className="card-header flex flex-row items-center justify-between pb-2">
        <h2 className="card-title">Recent Transactions</h2>
        <Link to="/transactions" className="btn btn-outline btn-sm flex items-center">
          View all
          <ExternalLink className="ml-2 h-3 w-3" />
        </Link>
      </div>
      <div className="card-content">
        <div className="space-y-4">
          {transactions.map((transaction) => (
            <div
              key={transaction.id}
              className="flex items-center justify-between rounded-lg border p-4 transition-colors hover:bg-[var(--muted-background)]"
            >
              <div className="flex items-center gap-4">
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-full ${
                    transaction.type === "deposit" ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"
                  }`}
                >
                  {transaction.type === "deposit" ? (
                    <ArrowDownRight className="h-5 w-5" />
                  ) : (
                    <ArrowUpRight className="h-5 w-5" />
                  )}
                </div>
                <div>
                  <p className="font-medium">{transaction.description}</p>
                  <div className="flex items-center gap-2">
                    <p className="text-sm text-[var(--muted)]">{transaction.date}</p>
                    <span className="badge badge-outline text-xs">{transaction.category}</span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p className={`font-medium ${transaction.type === "deposit" ? "text-green-600" : "text-red-600"}`}>
                  {transaction.type === "deposit" ? "+" : ""} {transaction.amount.toLocaleString()} TND
                </p>
                <p className="text-sm text-[var(--muted)]">
                  {transaction.type === "deposit" ? "Deposit" : "Withdrawal"}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
