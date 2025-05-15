"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Loader2, Calendar, CreditCard, DollarSign, FileText, Clock, AlertCircle, Check, ArrowRight } from "lucide-react"
import axios from "axios"

type Account = {
  _id: string
  accountNumber: string
  accountType: string
  balance: number
  currency: string
}

type RecurringTransferType = {
  _id: string
  fromAccount: string
  toAccount: string
  amount: number
  frequency: string
  nextExecution: string
  status: string
  description: string
}

export function RecurringTransfer() {
  const [isLoading, setIsLoading] = useState(false)
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [formData, setFormData] = useState({
    fromAccount: "",
    toAccount: "", // This will now be the account number
    amount: "",
    frequency: "",
    description: "",
  })
  const [successMessage, setSuccessMessage] = useState("")
  const [error, setError] = useState("")
  const [accounts, setAccounts] = useState<Account[]>([])
  const [existingTransfers, setExistingTransfers] = useState<RecurringTransferType[]>([])
  const [isLoadingAccounts, setIsLoadingAccounts] = useState(false)
  const [isLoadingTransfers, setIsLoadingTransfers] = useState(false)
  const [showVerification, setShowVerification] = useState(false)
  const [verificationCode, setVerificationCode] = useState("")
  const [transferId, setTransferId] = useState("")
  const [showForm, setShowForm] = useState(true)

  // Fetch user accounts and existing recurring transfers on component mount
  useEffect(() => {
    fetchUserAccounts()
    fetchRecurringTransfers()
  }, [])

  const fetchUserAccounts = async () => {
    setIsLoadingAccounts(true)
    try {
      const response = await axios.get("http://localhost:5001/api/users/accounts", {
        withCredentials: true
      })
      
      if (response.data.success) {
        setAccounts(response.data.accounts)
        // Set default account if available
        if (response.data.accounts.length > 0) {
          setFormData(prev => ({...prev, fromAccount: response.data.accounts[0]._id}))
        }
      } else {
        setError("Failed to fetch accounts")
      }
    } catch (err) {
      setError("Error fetching accounts. Please try again.")
      console.error(err)
    } finally {
      setIsLoadingAccounts(false)
    }
  }

  const fetchRecurringTransfers = async () => {
    setIsLoadingTransfers(true)
    try {
      const response = await axios.get("http://localhost:5001/api/users/transfers/recurring", {
        withCredentials: true
      })
      
      if (response.data.success) {
        // For each transfer, ensure we have the account details
        const transfers = response.data.transfers
        
        // Create a set of all account IDs that need to be fetched
        const accountIds = new Set()
        transfers.forEach((transfer: RecurringTransferType) => {
          if (transfer.fromAccount && !accounts.some(a => a._id === transfer.fromAccount)) {
            accountIds.add(transfer.fromAccount)
          }
        })
        
        // Fetch any missing account details
        if (accountIds.size > 0) {
          const accountPromises = Array.from(accountIds).map(async (id) => {
            try {
              const accountResponse = await axios.get(`http://localhost:5001/api/users/accounts/${id}`, {
                withCredentials: true
              })
              if (accountResponse.data.success) {
                return accountResponse.data.account
              }
            } catch (error) {
              console.error(`Error fetching account ${id}:`, error)
            }
            return null
          })
          
          const fetchedAccounts = (await Promise.all(accountPromises)).filter(Boolean)
          if (fetchedAccounts.length > 0) {
            setAccounts(prev => [...prev, ...fetchedAccounts])
          }
        }
        
        setExistingTransfers(transfers)
      }
    } catch (error) {
      console.error("Error fetching recurring transfers:", error)
    } finally {
      setIsLoadingTransfers(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      const payload = {
        fromAccountId: formData.fromAccount,
        toAccountNumber: formData.toAccount, // Send the account number directly
        amount: parseFloat(formData.amount),
        description: formData.description,
        frequency: formData.frequency.toLowerCase(),
        startDate,
        endDate: endDate || null
      }

      const response = await axios.post("http://localhost:5001/api/users/transfers/recurring", payload, {
        withCredentials: true
      })
      
      if (response.data.success) {
        setTransferId(response.data.transferId)
        setShowVerification(true)
      } else {
        setError(response.data.message || "Failed to set up recurring transfer")
      }
    } catch (err) {
      const error = err as any;
      setError(error.response?.data?.message || "An error occurred setting up the recurring transfer")
    } finally {
      setIsLoading(false)
    }
  }

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    try {
      const payload = {
        transferId,
        code: verificationCode
      }
      
      const response = await axios.post("http://localhost:5001/api/users/transfers/verify", payload, {
        withCredentials: true
      })
      
      if (response.data.success) {
        setShowVerification(false)
        setSuccessMessage("Your recurring transfer has been set up successfully.")
        setShowForm(false) // Hide the form after successful verification
        
        // Immediately add the new transfer to the existing transfers list
        const newTransfer: RecurringTransferType = {
          _id: transferId,
          fromAccount: formData.fromAccount,
          toAccount: formData.toAccount,
          amount: parseFloat(formData.amount),
          frequency: formData.frequency,
          nextExecution: startDate,
          status: 'active',
          description: formData.description || 'Recurring transfer'
        }
        
        setExistingTransfers(prev => [newTransfer, ...prev])
        
        // Reset form after success
        setTimeout(() => {
          setSuccessMessage("")
          setFormData({
            fromAccount: accounts.length > 0 ? accounts[0]._id : "",
            toAccount: "",
            amount: "",
            frequency: "",
            description: "",
          })
          setStartDate("")
          setEndDate("")
          setVerificationCode("")
          setShowForm(true) // Show the form again after a delay
        }, 3000)
      } else {
        setError(response.data.message || "Verification failed")
      }
    } catch (err) {
      const error = err as any;
      setError(error.response?.data?.message || "Verification failed")
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancelTransfer = async (transferId: string) => {
    try {
      const response = await axios.patch(
        `http://localhost:5001/api/users/transfers/recurring/${transferId}/cancel`,
        {},
        { withCredentials: true }
      )
      
      if (response.data.success) {
        // Refresh the list after cancellation
        fetchRecurringTransfers()
        setSuccessMessage("Recurring transfer cancelled successfully")
        setTimeout(() => setSuccessMessage(""), 3000)
      } else {
        setError(response.data.message || "Failed to cancel transfer")
      }
    } catch (err) {
      const error = err as any
      setError(error.response?.data?.message || "Failed to cancel transfer")
    }
  }

  // Format account for display
  const getAccountDisplay = (accountId: string) => {
    const account = accounts.find(a => a._id === accountId)
    if (account) {
      return `${account.accountType} - ${account.accountNumber} (Balance: ${account.balance.toFixed(2)} ${account.currency})`
    }
    
    // If account not found in the current accounts list, try to fetch it
    const fetchAccountDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:5001/api/users/accounts/${accountId}`, {
          withCredentials: true
        })
        if (response.data.success) {
          // Add this account to the accounts list
          setAccounts(prev => [...prev, response.data.account])
          return `${response.data.account.accountType} - ${response.data.account.accountNumber}`
        }
      } catch (error) {
        console.error("Error fetching account details:", error)
      }
      return "Unknown Account"
    }
    
    // Call the function and return a placeholder while waiting
    fetchAccountDetails()
    return "current user account"
  }

  // Format date for better display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date)
  }

  return (
    <div className="card shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 rounded-xl overflow-hidden">
      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 px-6 py-4 border-b border-gray-100">
        <h2 className="text-xl font-semibold text-gray-800 flex items-center">
          <Clock className="h-5 w-5 mr-2 text-indigo-600" />
          Recurring Transfer
        </h2>
        <p className="text-sm text-gray-500">Set up automatic transfers on a schedule</p>
      </div>

      {successMessage && (
        <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <Check className="h-5 w-5 text-green-500" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-green-700">{successMessage}</p>
            </div>
          </div>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <AlertCircle className="h-5 w-5 text-red-500" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}

      {showVerification ? (
        <div className="card-content p-6">
          <h3 className="text-lg font-medium mb-4 flex items-center">
            <AlertCircle className="h-5 w-5 mr-2 text-amber-500" />
            Verify Transfer
          </h3>
          {error && <div className="bg-red-50 border border-red-200 text-red-800 p-3 rounded-md mb-4 flex items-center"><AlertCircle className="h-4 w-4 mr-2 text-red-600" />{error}</div>}
          <p className="mb-4 text-gray-600">Please enter the verification code sent to your email:</p>
          
          <form onSubmit={handleVerify} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="verificationCode" className="block text-sm font-medium">
                Verification Code
              </label>
              <div className="relative">
                <FileText className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  id="verificationCode"
                  type="text"
                  className="input pl-10"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                  required
                />
              </div>
            </div>
            
            <button type="submit" className="btn bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-lg flex items-center gap-2 hover:translate-x-1 transition-all duration-300 shadow-md hover:shadow-lg w-full" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Verify Transfer
              <Check className="h-4 w-4" />
            </button>
          </form>
        </div>
      ) : (
        <div className="card-content p-6">
          {showForm ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div>
                  <h3 className="mb-4 text-lg font-medium flex items-center">
                    <ArrowRight className="h-5 w-5 mr-2 text-indigo-600" />
                    Set Up New Recurring Transfer
                  </h3>
                  {successMessage && <div className="bg-green-50 border border-green-200 text-green-800 p-3 rounded-md mb-4 flex items-center"><Check className="h-4 w-4 mr-2 text-green-600" />{successMessage}</div>}
                  {error && <div className="bg-red-50 border border-red-200 text-red-800 p-3 rounded-md mb-4 flex items-center"><AlertCircle className="h-4 w-4 mr-2 text-red-600" />{error}</div>}
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label htmlFor="fromAccount" className="block text-sm font-medium">
                        From Account
                      </label>
                      <select
                        id="fromAccount"
                        name="fromAccount"
                        className="input"
                        value={formData.fromAccount}
                        onChange={handleChange}
                        required
                        disabled={isLoadingAccounts}
                      >
                        <option value="" disabled>
                          {isLoadingAccounts ? "Loading accounts..." : "Select source account"}
                        </option>
                        {accounts.map(account => (
                          <option key={account._id} value={account._id}>
                            {account.accountType} - {account.accountNumber} (Balance: {account.balance.toFixed(2)} {account.currency})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="toAccount" className="block text-sm font-medium">
                        To Account Number
                      </label>
                      <div className="relative">
                        <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <input
                          id="toAccount"
                          name="toAccount"
                          type="text"
                          placeholder="Enter recipient account number"
                          className="input pl-10"
                          value={formData.toAccount}
                          onChange={handleChange}
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="amount" className="block text-sm font-medium">
                        Amount
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                          <span className="text-gray-500">TND</span>
                        </div>
                        <input
                          id="amount"
                          name="amount"
                          type="number"
                          placeholder="0.00"
                          className="input pl-14"
                          value={formData.amount}
                          onChange={handleChange}
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="frequency" className="block text-sm font-medium">
                        Frequency
                      </label>
                      <select
                        id="frequency"
                        name="frequency"
                        className="input"
                        value={formData.frequency}
                        onChange={handleChange}
                        required
                      >
                        <option value="" disabled>
                          Select frequency
                        </option>
                        <option value="daily">Daily</option>
                        <option value="weekly">Weekly</option>
                        <option value="monthly">Monthly</option>
                        <option value="quarterly">Quarterly</option>
                        <option value="annually">Annually</option>
                      </select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label htmlFor="startDate" className="block text-sm font-medium">
                          First Transfer Date
                        </label>
                        <div className="relative">
                          <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                          <input
                            id="startDate"
                            type="date"
                            className="input pl-10"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            required
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label htmlFor="endDate" className="block text-sm font-medium">
                          End Date (Optional)
                        </label>
                        <div className="relative">
                          <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                          <input
                            id="endDate"
                            type="date"
                            className="input pl-10"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            min={startDate}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="description" className="block text-sm font-medium">
                        Description (Optional)
                      </label>
                      <textarea
                        id="description"
                        name="description"
                        placeholder="Enter transfer description"
                        value={formData.description}
                        onChange={handleChange}
                        className="input min-h-[80px]"
                      />
                    </div>

                    <button type="submit" className="btn bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg flex items-center gap-2 hover:translate-x-1 transition-all duration-300 shadow-md hover:shadow-lg w-full" disabled={isLoading}>
                      {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      Schedule Recurring Transfer
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <div>
                  <h3 className="mb-4 text-lg font-medium flex items-center">
                    <Clock className="h-5 w-5 mr-2 text-indigo-600" />
                    Existing Recurring Transfers
                  </h3>
                  
                  {isLoadingTransfers ? (
                    <div className="flex justify-center p-6">
                      <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
                    </div>
                  ) : existingTransfers.length === 0 ? (
                    <div className="bg-gray-50 rounded-lg p-6 text-center">
                      <p className="text-gray-500">No recurring transfers set up yet</p>
                    </div>
                  ) : (
                    <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
                      {existingTransfers.map((transfer) => (
                        <div key={transfer._id} className="bg-gray-50 rounded-lg p-4 border border-gray-100">
                          <div className="flex justify-between items-start mb-2">
                            <h4 className="font-medium">{transfer.description || "Recurring Transfer"}</h4>
                            <span className={`text-xs px-2 py-1 rounded-full ${
                              transfer.status === 'active' ? 'bg-green-100 text-green-800' : 
                              transfer.status === 'cancelled' ? 'bg-red-100 text-red-800' : 
                              'bg-yellow-100 text-yellow-800'
                            }`}>
                              {transfer.status.charAt(0).toUpperCase() + transfer.status.slice(1)}
                            </span>
                          </div>
                          <div className="grid grid-cols-2 gap-2 text-sm">
                            <div>
                              <p className="text-gray-500">From:</p>
                              <p>{getAccountDisplay(transfer.fromAccount)}</p>
                            </div>
                            <div>
                              <p className="text-gray-500">To:</p>
                              <p>{transfer.toAccount}</p>
                            </div>
                            <div>
                              <p className="text-gray-500">Amount:</p>
                              <p className="font-medium">{transfer.amount.toFixed(2)} TND</p>
                            </div>
                            <div>
                              <p className="text-gray-500">Frequency:</p>
                              <p>{transfer.frequency.charAt(0).toUpperCase() + transfer.frequency.slice(1)}</p>
                            </div>
                            <div>
                              <p className="text-gray-500">Next execution:</p>
                              <p>{transfer.nextExecution ? formatDate(transfer.nextExecution) : 'Not scheduled'}</p>
                            </div>
                          </div>
                          
                          {transfer.status === 'active' && (
                            <button 
                              onClick={() => handleCancelTransfer(transfer._id)}
                              className="mt-3 text-sm text-red-600 hover:text-red-800 flex items-center"
                            >
                              Cancel this transfer
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </form>
          ) : (
            <div className="flex justify-center p-6">
              <button 
                onClick={() => setShowForm(true)}
                className="btn bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-lg flex items-center gap-2 transition-all duration-300 shadow-md hover:shadow-lg"
              >
                Create New Recurring Transfer
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
