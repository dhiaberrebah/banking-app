"use client"

import { useState } from "react"
import { ArrowDownRight, ArrowUpRight, Eye, ChevronLeft, ChevronRight, X } from "lucide-react"

interface Transaction {
  id: string
  date: string
  description: string
  category: string
  amount: number
  type: string
  account: string
  reference: string
}

interface TransactionTableProps {
  transactions: Transaction[]
  isLoading: boolean
  error: string | null
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}

export function TransactionTable({ 
  transactions, 
  isLoading, 
  error, 
  currentPage, 
  totalPages, 
  onPageChange 
}: TransactionTableProps) {
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null)
  const [showDetails, setShowDetails] = useState(false)

  const handleViewDetails = (transaction: Transaction) => {
    setSelectedTransaction(transaction)
    setShowDetails(true)
  }

  const handleCloseDetails = () => {
    setShowDetails(false)
    setSelectedTransaction(null)
  }

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1)
    }
  }

  const handlePrevPage = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1)
    }
  }

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600 font-medium">Loading your transactions...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100">
          <X className="h-8 w-8 text-red-600" />
        </div>
        <h3 className="mt-4 text-lg font-medium text-gray-900">Error Loading Transactions</h3>
        <p className="mt-2 text-sm text-gray-500">{error}</p>
        <button 
          onClick={() => onPageChange(1)}
          className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Try Again
        </button>
      </div>
    )
  }

  if (transactions.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-blue-100">
          <ArrowDownRight className="h-8 w-8 text-blue-600" />
        </div>
        <h3 className="mt-4 text-lg font-medium text-gray-900">No Transactions Found</h3>
        <p className="mt-2 text-sm text-gray-500">We couldn't find any transactions matching your criteria.</p>
      </div>
    )
  }

  return (
    <>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50">
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {transactions.map((transaction) => (
              <tr key={transaction.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{transaction.date}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  <div className="font-medium">{transaction.description}</div>
                  <div className="text-xs text-gray-500">Ref: {transaction.reference}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                    {transaction.category}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <div className="flex items-center">
                    {transaction.type === "deposit" ? (
                      <ArrowDownRight className="mr-1.5 h-4 w-4 text-green-500 flex-shrink-0" />
                    ) : (
                      <ArrowUpRight className="mr-1.5 h-4 w-4 text-red-500 flex-shrink-0" />
                    )}
                    <span
                      className={
                        transaction.type === "deposit" 
                          ? "text-green-600 font-medium" 
                          : "text-red-600 font-medium"
                      }
                    >
                      {transaction.type === "deposit" ? "+" : "-"}
                      {Math.abs(transaction.amount).toFixed(2)} TND
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <button
                    onClick={() => handleViewDetails(transaction)}
                    className="text-blue-600 hover:text-blue-900 transition-colors"
                    title="View details"
                  >
                    <Eye className="h-5 w-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination controls */}
      <div className="bg-white px-6 py-4 border-t border-gray-200 flex items-center justify-between">
        <div className="flex-1 flex justify-between sm:hidden">
          <button
            onClick={handlePrevPage}
            disabled={currentPage <= 1}
            className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${
              currentPage <= 1
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-white text-gray-700 hover:bg-gray-50"
            }`}
          >
            Previous
          </button>
          <button
            onClick={handleNextPage}
            disabled={currentPage >= totalPages}
            className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${
              currentPage >= totalPages
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-white text-gray-700 hover:bg-gray-50"
            }`}
          >
            Next
          </button>
        </div>
        <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-gray-700">
              Showing page <span className="font-medium">{currentPage}</span> of{" "}
              <span className="font-medium">{totalPages}</span>
            </p>
          </div>
          <div>
            <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
              <button
                onClick={handlePrevPage}
                disabled={currentPage <= 1}
                className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 text-sm font-medium ${
                  currentPage <= 1
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-white text-gray-500 hover:bg-gray-50"
                }`}
              >
                <span className="sr-only">Previous</span>
                <ChevronLeft className="h-5 w-5" />
              </button>
              
              {/* Page numbers - simplified for brevity */}
              <span className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">
                {currentPage}
              </span>
              
              <button
                onClick={handleNextPage}
                disabled={currentPage >= totalPages}
                className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 text-sm font-medium ${
                  currentPage >= totalPages
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-white text-gray-500 hover:bg-gray-50"
                }`}
              >
                <span className="sr-only">Next</span>
                <ChevronRight className="h-5 w-5" />
              </button>
            </nav>
          </div>
        </div>
      </div>

      {/* Transaction details modal */}
      {showDetails && selectedTransaction && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full overflow-hidden">
            <div className="px-6 py-4 bg-blue-600 text-white flex justify-between items-center">
              <h3 className="text-lg font-medium">Transaction Details</h3>
              <button 
                onClick={handleCloseDetails}
                className="text-white hover:text-gray-200 focus:outline-none"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="p-6">
              <div className="flex justify-center mb-6">
                <div className={`h-16 w-16 rounded-full flex items-center justify-center ${
                  selectedTransaction.type === "deposit" ? "bg-green-100" : "bg-red-100"
                }`}>
                  {selectedTransaction.type === "deposit" ? (
                    <ArrowDownRight className="h-8 w-8 text-green-600" />
                  ) : (
                    <ArrowUpRight className="h-8 w-8 text-red-600" />
                  )}
                </div>
              </div>
              
              <div className="text-center mb-6">
                <div className={`text-2xl font-bold ${
                  selectedTransaction.type === "deposit" ? "text-green-600" : "text-red-600"
                }`}>
                  {selectedTransaction.type === "deposit" ? "+" : "-"}
                  {Math.abs(selectedTransaction.amount).toFixed(2)} TND
                </div>
                <div className="text-sm text-gray-500 mt-1">{selectedTransaction.date}</div>
              </div>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-2 py-2 border-b border-gray-100">
                  <div className="text-sm font-medium text-gray-500">Description</div>
                  <div className="text-sm text-gray-900">{selectedTransaction.description}</div>
                </div>
                <div className="grid grid-cols-2 gap-2 py-2 border-b border-gray-100">
                  <div className="text-sm font-medium text-gray-500">Category</div>
                  <div className="text-sm text-gray-900">
                    <span className="px-2 py-0.5 text-xs rounded-full bg-blue-100 text-blue-800">
                      {selectedTransaction.category}
                    </span>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2 py-2 border-b border-gray-100">
                  <div className="text-sm font-medium text-gray-500">Account</div>
                  <div className="text-sm text-gray-900">{selectedTransaction.account}</div>
                </div>
                <div className="grid grid-cols-2 gap-2 py-2 border-b border-gray-100">
                  <div className="text-sm font-medium text-gray-500">Reference</div>
                  <div className="text-sm text-gray-900">{selectedTransaction.reference}</div>
                </div>
              </div>
              
              <div className="mt-8">
                <button
                  onClick={handleCloseDetails}
                  className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
