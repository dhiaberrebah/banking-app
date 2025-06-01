"use client"
import { ChevronRight, Wallet, PiggyBank, DollarSign } from "lucide-react"

// Define the account interface
interface Account {
  id: string
  name: string
  number: string
  balance: number
  currency: string
  type: string
  status: string
  icon: string
}

interface AccountsListProps {
  accounts: Account[]
  onSelectAccount: (id: string) => void
  selectedAccount: string | null
}

export function AccountsList({ accounts, onSelectAccount, selectedAccount }: AccountsListProps) {
  // Map icon strings to actual components
  const getIcon = (iconName: string) => {
    switch(iconName) {
      case "PiggyBank": return PiggyBank
      case "DollarSign": return DollarSign
      default: return Wallet
    }
  }

  return (
    <div className="divide-y divide-blue-100">
      {accounts.map((account) => {
        const Icon = getIcon(account.icon)
        return (
          <button
            key={account.id}
            className={`w-full flex items-center justify-between p-4 hover:bg-blue-50 transition-colors ${
              selectedAccount === account.id ? "bg-blue-50" : ""
            }`}
            onClick={() => onSelectAccount(account.id)}
          >
            <div className="flex items-center">
              <div className="mr-3 p-2 bg-blue-100 rounded-full text-blue-700">
                <Icon className="h-5 w-5" />
              </div>
              <div className="text-left">
                <div className="font-medium text-blue-900">{account.name}</div>
                <div className="text-sm text-blue-600">{account.number}</div>
              </div>
            </div>
            <div className="flex items-center">
              <div className="text-right mr-2">
                <div className="font-medium text-blue-900">
                  {account.balance.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                  <span className="ml-1 text-sm">{account.currency}</span>
                </div>
                <div className="text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-800 inline-block">
                  {account.status}
                </div>
              </div>
              <ChevronRight className="h-5 w-5 text-blue-400" />
            </div>
          </button>
        )
      })}
    </div>
  )
}
