"use client"

import { useState, useEffect } from "react"
import { Download, Search, X, Calendar, Filter as FilterIcon } from "lucide-react"
import axios from "axios"

interface FilterProps {
  onFilterChange: (filters: FilterState) => void
}

interface FilterState {
  account: string
  type: string
  startDate: string
  endDate: string
  searchTerm: string
}

export function TransactionFilters({ onFilterChange }: FilterProps) {
  const [accounts, setAccounts] = useState<{id: string, accountNumber: string, accountType: string}[]>([])
  const [filters, setFilters] = useState<FilterState>({
    account: "all",
    type: "all",
    startDate: "",
    endDate: "",
    searchTerm: ""
  })
  
  // Fetch user accounts
  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const response = await axios.get("http://localhost:5001/api/users/accounts", {
          withCredentials: true
        })
        
        if (response.data.success) {
          setAccounts(response.data.accounts || [])
        }
      } catch (err) {
        console.error("Failed to fetch accounts:", err)
      }
    }
    
    fetchAccounts()
  }, [])

  const handleFilterChange = (field: keyof FilterState, value: string) => {
    const newFilters = { ...filters, [field]: value }
    setFilters(newFilters)
  }

  const handleApplyFilters = () => {
    onFilterChange(filters)
  }

  const handleResetFilters = () => {
    const resetFilters = {
      account: "all",
      type: "all",
      startDate: "",
      endDate: "",
      searchTerm: ""
    }
    setFilters(resetFilters)
    onFilterChange(resetFilters)
  }

  return (
    <div className="bg-white rounded-lg border shadow-sm mb-6 overflow-hidden">
      <div className="p-4 border-b bg-gray-50 flex justify-between items-center">
        <div className="flex items-center">
          <FilterIcon className="h-4 w-4 text-blue-600 mr-2" />
          <h3 className="font-medium text-gray-800">Filter Transactions</h3>
        </div>
        <button 
          onClick={handleResetFilters}
          className="text-sm text-gray-500 hover:text-gray-700 flex items-center"
        >
          <X className="h-3 w-3 mr-1" />
          Reset
        </button>
      </div>
      
      <div className="p-5">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
          <div className="space-y-2">
            <label htmlFor="account" className="block text-sm font-medium text-gray-700">
              Account
            </label>
            <select 
              id="account" 
              className="w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              value={filters.account}
              onChange={(e) => handleFilterChange("account", e.target.value)}
            >
              <option value="all">All Accounts</option>
              {accounts.map(account => (
                <option key={account.id} value={account.id}>
                  {account.accountType} ({account.accountNumber})
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label htmlFor="type" className="block text-sm font-medium text-gray-700">
              Transaction Type
            </label>
            <select 
              id="type" 
              className="w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              value={filters.type}
              onChange={(e) => handleFilterChange("type", e.target.value)}
            >
              <option value="all">All Types</option>
              <option value="deposit">Deposits</option>
              <option value="withdrawal">Withdrawals</option>
              <option value="transfer">Transfers</option>
              <option value="payment">Payments</option>
            </select>
          </div>

          <div className="space-y-2">
            <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">
              Start Date
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
              <input
                id="startDate"
                type="date"
                className="w-full rounded-md border border-gray-300 py-2 pl-10 pr-3 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                value={filters.startDate}
                onChange={(e) => handleFilterChange("startDate", e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">
              End Date
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
              <input
                id="endDate"
                type="date"
                className="w-full rounded-md border border-gray-300 py-2 pl-10 pr-3 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                value={filters.endDate}
                onChange={(e) => handleFilterChange("endDate", e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="mt-5 flex items-end justify-between">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            <input 
              placeholder="Search transactions..." 
              className="w-full rounded-md border border-gray-300 py-2 pl-10 pr-3 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              value={filters.searchTerm}
              onChange={(e) => handleFilterChange("searchTerm", e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <button 
              onClick={handleApplyFilters}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Apply Filters
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
