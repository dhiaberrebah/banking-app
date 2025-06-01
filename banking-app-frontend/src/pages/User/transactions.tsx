"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import { Layout } from "../../components/layout"
import { TransactionFilters } from "../../components/transction-filter"
import { TransactionTable } from "../../components/transction-table"
import { ArrowDownUp, Calendar, Filter } from "lucide-react"

interface FilterState {
  account: string
  type: string
  startDate: string
  endDate: string
  searchTerm: string
}

export default function Transactions() {
  const [transactions, setTransactions] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [showFilters, setShowFilters] = useState(false)
  const [activeFilters, setActiveFilters] = useState<FilterState>({
    account: "all",
    type: "all",
    startDate: "",
    endDate: "",
    searchTerm: ""
  })

  useEffect(() => {
    fetchTransactions()
  }, [currentPage, activeFilters])

  const fetchTransactions = async () => {
    setIsLoading(true)
    try {
      // Build query parameters based on filters
      const params: any = { 
        page: currentPage, 
        limit: 10 
      }
      
      if (activeFilters.account !== "all") {
        params.accountId = activeFilters.account
      }
      
      if (activeFilters.type !== "all") {
        params.type = activeFilters.type
      }
      
      if (activeFilters.startDate) {
        params.startDate = activeFilters.startDate
      }
      
      if (activeFilters.endDate) {
        params.endDate = activeFilters.endDate
      }
      
      if (activeFilters.searchTerm) {
        params.search = activeFilters.searchTerm
      }
      
      const response = await axios.get(
        "http://localhost:5001/api/users/transactions",
        { 
          withCredentials: true,
          params
        }
      )
      
      if (response.data.success) {
        setTransactions(response.data.transactions || [])
        setTotalPages(response.data.totalPages || 1)
        setError(null)
      } else {
        setError(response.data.message || "Failed to load transactions")
      }
    } catch (err: any) {
      console.error("Failed to fetch transactions:", err)
      setError(err.response?.data?.message || "Failed to load transactions. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage)
  }

  const handleFilterChange = (filters: FilterState) => {
    setActiveFilters(filters)
    setCurrentPage(1) // Reset to first page when filters change
  }

  const handleExportTransactions = async () => {
    try {
      // Build query parameters based on filters
      const params: any = { 
        export: true
      }
      
      if (activeFilters.account !== "all") {
        params.accountId = activeFilters.account
      }
      
      if (activeFilters.type !== "all") {
        params.type = activeFilters.type
      }
      
      if (activeFilters.startDate) {
        params.startDate = activeFilters.startDate
      }
      
      if (activeFilters.endDate) {
        params.endDate = activeFilters.endDate
      }
      
      if (activeFilters.searchTerm) {
        params.search = activeFilters.searchTerm
      }
      
      const response = await axios.get(
        "http://localhost:5001/api/users/transactions/export",
        { 
          withCredentials: true,
          params,
          responseType: 'blob'
        }
      )
      
      // Create a download link
      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a')
      link.href = url
      
      // Generate filename with current date
      const date = new Date().toISOString().split('T')[0]
      link.setAttribute('download', `transactions-${date}.csv`)
      
      document.body.appendChild(link)
      link.click()
      link.remove()
    } catch (err) {
      console.error("Failed to export transactions:", err)
      alert("Failed to export transactions. Please try again.")
    }
  }

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">Transaction History</h1>
            <p className="mt-1 text-sm text-gray-500">View and manage your recent transactions</p>
          </div>
          <div className="flex space-x-3">
            <button 
              onClick={() => setShowFilters(!showFilters)}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <Filter className="h-4 w-4 mr-2" />
              {showFilters ? 'Hide Filters' : 'Show Filters'}
            </button>
          </div>
        </div>
        
        {showFilters && (
          <TransactionFilters 
            onFilterChange={handleFilterChange} 
          />
        )}
        
        <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
          <TransactionTable 
            transactions={transactions} 
            isLoading={isLoading} 
            error={error}
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      </div>
    </Layout>
  )
}
