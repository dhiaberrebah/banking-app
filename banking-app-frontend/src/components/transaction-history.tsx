"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import {
  Search,
  Filter,
  Download,
  ArrowDownRight,
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
  Calendar,
  Tag,
  CreditCard,
  Info,
  Eye,
} from "lucide-react"

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

interface TransactionHistoryProps {
  accountId: string
}

export function TransactionHistory({ accountId }: TransactionHistoryProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  
  // Fetch transactions for the specific account
  useEffect(() => {
    const fetchTransactions = async () => {
      if (!accountId) return;
      
      setIsLoading(true);
      try {
        const response = await axios.get(
          `http://localhost:5001/api/users/accounts/${accountId}/transactions`,
          { 
            withCredentials: true,
            params: { page: currentPage, limit: 10 }
          }
        );
        
        if (response.data.success) {
          setTransactions(response.data.transactions || []);
          setTotalPages(response.data.totalPages || 1);
          setError(null);
        } else {
          setError(response.data.message || "Failed to load transactions");
        }
      } catch (err: any) {
        console.error("Failed to fetch transactions:", err);
        setError(err.response?.data?.message || "Failed to load transactions. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };
    
    if (accountId) {
      fetchTransactions();
    }
  }, [accountId, currentPage]);

  // Update the export function to use the actual transactions
  const handleExportTransactions = () => {
    if (transactions.length === 0) return;
    
    const fileName = `transactions_${accountId}_${new Date().toISOString().split('T')[0]}.csv`;
    
    // Create CSV content from actual transactions
    let csvContent = "Date,Description,Category,Reference,Amount,Type\n";
    transactions.forEach(tx => {
      csvContent += `${tx.date},${tx.description},${tx.category},${tx.reference},${tx.amount.toFixed(2)},${tx.type}\n`;
    });
    
    // Create download link
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', fileName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };
  
  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Recent Transactions</h3>
        <div className="flex gap-2">
          <button 
            onClick={handleExportTransactions}
            disabled={isLoading || transactions.length === 0}
            className="px-3 py-1.5 text-sm bg-white border border-gray-200 rounded-md flex items-center hover:bg-gray-50"
          >
            <Download className="h-4 w-4 mr-1.5" />
            Export
          </button>
        </div>
      </div>
      
      <div className="p-4 bg-blue-50 border border-blue-100 rounded-lg mb-4">
        <div className="flex items-start">
          <Info className="h-5 w-5 text-blue-500 mr-2 mt-0.5" />
          <div>
            <p className="text-blue-700 text-sm">
              For cash deposits and withdrawals, please visit any AMEN Bank branch with your ID and account details.
              Online banking allows you to view transactions, make transfers, and manage your accounts remotely.
            </p>
            <a href="/branches" className="text-blue-600 hover:underline text-sm mt-1 inline-block">
              Find your nearest branch
            </a>
          </div>
        </div>
      </div>
      
      {isLoading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-2 text-gray-500">Loading transactions...</p>
        </div>
      ) : error ? (
        <div className="text-center py-8 text-red-500">{error}</div>
      ) : transactions.length === 0 ? (
        <div className="text-center py-8 text-gray-500">No transactions found for this account.</div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="px-4 py-3 text-left text-sm font-medium">Date</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">Description</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">Category</th>
                  <th className="px-4 py-3 text-right text-sm font-medium">Amount</th>
                  <th className="px-4 py-3 text-right text-sm font-medium"></th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((transaction) => (
                  <tr key={transaction.id} className="border-b hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm">
                      {new Date(transaction.date).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 text-sm">{transaction.description}</td>
                    <td className="px-4 py-3 text-sm">{transaction.category}</td>
                    <td className="px-4 py-3 text-sm text-right">
                      <div className="flex items-center justify-end">
                        <div className={`mr-2 p-1 rounded-full ${
                          transaction.type === "deposit" ? "bg-green-100" : "bg-red-100"
                        }`}>
                          {transaction.type === "deposit" ? (
                            <ArrowDownRight className="h-3 w-3 text-green-600" />
                          ) : (
                            <ArrowUpRight className="h-3 w-3 text-red-600" />
                          )}
                        </div>
                        <span className={transaction.type === "deposit" ? "text-green-600" : "text-red-600"}>
                          {transaction.type === "deposit" ? "+" : "-"} {Math.abs(transaction.amount).toLocaleString()} TND
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-right">
                      <button className="text-blue-600 hover:text-blue-800">
                        <Eye className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-between items-center pt-4">
              <div className="text-sm text-gray-500">
                Page {currentPage} of {totalPages}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handlePrevPage}
                  disabled={currentPage === 1}
                  className={`p-2 rounded-md ${
                    currentPage === 1 
                      ? "text-gray-400 cursor-not-allowed" 
                      : "text-blue-600 hover:bg-blue-50"
                  }`}
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button
                  onClick={handleNextPage}
                  disabled={currentPage === totalPages}
                  className={`p-2 rounded-md ${
                    currentPage === totalPages 
                      ? "text-gray-400 cursor-not-allowed" 
                      : "text-blue-600 hover:bg-blue-50"
                  }`}
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
