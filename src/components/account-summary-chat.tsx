"use client"

import { useEffect, useRef, useState } from "react"
import Chart from "chart.js/auto"
import { Download } from "lucide-react"
import axios from "axios"

interface Account {
  name: string
  balance: number
  color: string
  type: string
  currency: string
}

export function AccountSummaryChart() {
  const chartRef = useRef<HTMLCanvasElement>(null)
  const chartInstance = useRef<Chart | null>(null)
  const [loading, setLoading] = useState(true)
  const [accounts, setAccounts] = useState<Account[]>([])
  const [error, setError] = useState<string | null>(null)
  
  const totalBalance = accounts.reduce((sum, account) => sum + account.balance, 0)
  
  // Fetch accounts data from API
  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5001/api/users/accounts",
          { withCredentials: true }
        )
        
        if (response.data.success) {
          // Map API accounts to the format needed for the chart
          const accountsData = response.data.accounts.map((account: any) => {
            // Determine color based on account type
            let color = "#1e40af" // Default blue
            if (account.accountType === "savings") {
              color = "#3b82f6" // Lighter blue for savings
            } else if (account.currency === "USD") {
              color = "#93c5fd" // Even lighter blue for USD
            }
            
            return {
              name: `${account.accountType.charAt(0).toUpperCase() + account.accountType.slice(1)} Account`,
              balance: account.balance,
              color: color,
              type: account.accountType,
              currency: account.currency
            }
          })
          
          setAccounts(accountsData)
          setError(null)
        } else {
          setError(response.data.message || "Failed to load accounts")
        }
      } catch (err: any) {
        console.error("Failed to fetch accounts:", err)
        setError(err.response?.data?.message || "Failed to load accounts")
      } finally {
        setLoading(false)
      }
    }
    
    fetchAccounts()
  }, [])
  
  // Add export functionality
  const handleExportSummary = () => {
    setLoading(true)
    
    setTimeout(() => {
      const fileName = `account_summary_${new Date().toISOString().split('T')[0]}.csv`
      
      // Create CSV content
      let csvContent = "Account Name,Balance,Percentage\n"
      accounts.forEach(account => {
        const percentage = ((account.balance / totalBalance) * 100).toFixed(1)
        csvContent += `${account.name},${account.balance.toFixed(2)},${percentage}%\n`
      })
      
      // Create download link
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', fileName)
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      
      setLoading(false)
    }, 1000)
  }
  
  // Initialize chart when accounts data changes
  useEffect(() => {
    if (accounts.length === 0 || !chartRef.current) return;
    
    // Destroy existing chart if it exists
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }
    
    const ctx = chartRef.current.getContext("2d");
    if (ctx) {
      chartInstance.current = new Chart(ctx, {
        type: "doughnut",
        data: {
          labels: accounts.map((account) => account.name),
          datasets: [
            {
              data: accounts.map((account) => account.balance),
              backgroundColor: accounts.map((account) => account.color),
              borderColor: "#ffffff",
              borderWidth: 3,
              hoverOffset: 15,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: false,
            },
            tooltip: {
              callbacks: {
                label: function(context) {
                  const label = context.label || '';
                  const value = context.raw || 0;
                  const percentage = ((value as number) / totalBalance * 100).toFixed(1);
                  const currency = accounts[context.dataIndex]?.currency || 'TND';
                  return `${label}: ${(value as number).toLocaleString()} ${currency} (${percentage}%)`;
                }
              }
            }
          },
        },
      });
    }
  }, [accounts, totalBalance]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium text-blue-900">Account Distribution</h3>
        <button 
          className="btn btn-outline btn-sm"
          onClick={handleExportSummary}
          disabled={loading || accounts.length === 0}
        >
          <Download className="mr-1 h-4 w-4" /> 
          {loading ? "Exporting..." : "Export"}
        </button>
      </div>
      
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      ) : error ? (
        <div className="p-4 text-center text-red-500">
          {error}
        </div>
      ) : accounts.length === 0 ? (
        <div className="p-4 text-center text-gray-500">
          No accounts found. Create a new account to see your summary.
        </div>
      ) : (
        <div className="flex flex-col items-center justify-between md:flex-row">
          <div className="w-full md:w-1/2 h-64 p-2">
            <canvas ref={chartRef}></canvas>
          </div>
          <div className="w-full md:w-1/2 space-y-4 mt-6 md:mt-0 p-2">
            {accounts.map((account, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 rounded-lg hover:bg-blue-50 transition-all duration-200 border border-transparent hover:border-blue-100"
              >
                <div className="flex items-center">
                  <div className="w-4 h-4 rounded-full mr-3" style={{ backgroundColor: account.color }}></div>
                  <span className="text-blue-900 font-medium">{account.name}</span>
                </div>
                <div className="text-right">
                  <span className="font-semibold text-blue-900">{account.balance.toLocaleString()} {account.currency}</span>
                  <div className="text-xs text-blue-600 mt-1">{((account.balance / totalBalance) * 100).toFixed(1)}%</div>
                </div>
              </div>
            ))}
            <div className="pt-4 border-t border-blue-100 mt-4">
              <div className="flex items-center justify-between p-3 bg-gradient-to-r from-blue-50 to-white rounded-lg">
                <span className="font-medium text-blue-900">Total Balance</span>
                <span className="font-bold text-lg text-blue-900">{totalBalance.toLocaleString()} TND</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
