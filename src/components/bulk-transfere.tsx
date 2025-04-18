"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Loader2, Plus, Trash2, Upload, CreditCard, DollarSign, FileText, AlertCircle, ArrowRight, Check } from "lucide-react"
import axios from "axios"

type Beneficiary = {
  id: string
  name: string
  accountNumber: string
  amount: string
  description: string
}

type Account = {
  _id: string
  accountNumber: string
  accountType: string
  balance: number
}

export function BulkTransfer() {
  const [isLoading, setIsLoading] = useState(false)
  const [fromAccount, setFromAccount] = useState("")
  const [accounts, setAccounts] = useState<Account[]>([])
  const [beneficiaries, setBeneficiaries] = useState<Beneficiary[]>([
    {
      id: "1",
      name: "",
      accountNumber: "",
      amount: "",
      description: "",
    },
  ])
  const [successMessage, setSuccessMessage] = useState("")
  const [error, setError] = useState("")
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [showVerification, setShowVerification] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [transferId, setTransferId] = useState("")
  const [verificationCode, setVerificationCode] = useState("")
  const [isLoadingAccounts, setIsLoadingAccounts] = useState(false)

  // Fetch user accounts on component mount
  useEffect(() => {
    fetchUserAccounts()
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
          // Make sure we're setting just the ID, not a display string
          console.log("Setting default account ID:", response.data.accounts[0]._id);
          setFromAccount(response.data.accounts[0]._id);
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

  const addBeneficiary = () => {
    setBeneficiaries([
      ...beneficiaries,
      {
        id: Date.now().toString(),
        name: "",
        accountNumber: "",
        amount: "",
        description: "",
      },
    ])
  }

  const removeBeneficiary = (id: string) => {
    if (beneficiaries.length > 1) {
      setBeneficiaries(beneficiaries.filter((b) => b.id !== id))
    }
  }

  const updateBeneficiary = (id: string, field: keyof Beneficiary, value: string) => {
    setBeneficiaries(beneficiaries.map((b) => (b.id === id ? { ...b, [field]: value } : b)))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setShowConfirmation(true)
  }

  const confirmTransfer = async () => {
    setIsLoading(true)
    setError("")

    // Check for insufficient funds before sending the request
    if (insufficientFunds) {
      setError("Amount is not enough. The total transfer amount exceeds your account balance.")
      setIsLoading(false)
      return
    }

    try {
      // Ensure fromAccount is a valid MongoDB ObjectId
      if (!fromAccount || typeof fromAccount !== 'string') {
        throw new Error("Please select a valid account");
      }
      
      // Format beneficiaries data properly
      const formattedBeneficiaries = beneficiaries.map(b => ({
        name: b.name,
        accountNumber: b.accountNumber,
        amount: parseFloat(b.amount),
        description: b.description
      }))
      
      const payload = {
        fromAccountId: fromAccount,
        beneficiaries: formattedBeneficiaries
      }

      console.log("Sending payload:", payload); // Debug log
      
      const response = await axios.post("http://localhost:5001/api/users/transfers/bulk", payload, {
        withCredentials: true
      })
      
      setShowConfirmation(false)
      
      if (response.data.success) {
        setTransferId(response.data.transferId)
        setShowVerification(true)
      } else {
        setError(response.data.message || "Failed to initiate bulk transfer")
      }
    } catch (err) {
      console.error("Transfer error:", err);
      
      // Specifically handle the 400 status code for insufficient funds
      if ((err as any)?.response?.status === 400) {
        // Check if the error is related to insufficient funds
        const serverMessage = (err as any)?.response?.data?.message || "";
        
        if (serverMessage.toLowerCase().includes('insufficient funds')) {
          setError("Amount is not enough. The total transfer amount exceeds your account balance.");
        } else {
          // For other 400 errors
          setError(serverMessage || "Invalid request. Please check your transfer details.");
        }
      } else {
        // For other errors
        setError((err as any)?.response?.data?.message || "An error occurred during the bulk transfer");
      }
      
      setShowConfirmation(false);
    } finally {
      setIsLoading(false);
    }
  }

  const handleVerify = async () => {
    setIsLoading(true)
    setError("")
    
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
        setShowSuccess(true)
        
        // Reset form after success
        setTimeout(() => {
          setShowSuccess(false)
          setFromAccount(accounts.length > 0 ? accounts[0]._id : "")
          setBeneficiaries([
            {
              id: "1",
              name: "",
              accountNumber: "",
              amount: "",
              description: "",
            },
          ])
          setVerificationCode("")
          setTransferId("")
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

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setError("")
    const file = e.target.files?.[0]
    if (!file) return
    
    try {
      const reader = new FileReader()
      
      reader.onload = (event) => {
        const csvData = event.target?.result as string
        if (!csvData) {
          setError("Failed to read CSV file")
          return
        }
        
        // Parse CSV data
        const lines = csvData.split('\n')
        const headers = lines[0].split(',').map(header => header.trim())
        
        // Check required headers
        const requiredHeaders = ['name', 'accountNumber', 'amount', 'description']
        const missingHeaders = requiredHeaders.filter(h => 
          !headers.some(header => header.toLowerCase() === h.toLowerCase())
        )
        
        if (missingHeaders.length > 0) {
          setError(`CSV is missing required headers: ${missingHeaders.join(', ')}`)
          return
        }
        
        // Parse beneficiaries
        const parsedBeneficiaries: Beneficiary[] = []
        
        for (let i = 1; i < lines.length; i++) {
          if (!lines[i].trim()) continue
          
          const values = lines[i].split(',').map(val => val.trim())
          if (values.length !== headers.length) continue
          
          const beneficiary: any = { id: `csv${i}` }
          headers.forEach((header, index) => {
            const headerLower = header.toLowerCase()
            if (requiredHeaders.includes(headerLower)) {
              beneficiary[headerLower] = values[index]
            }
          })
          
          parsedBeneficiaries.push(beneficiary as Beneficiary)
        }
        
        if (parsedBeneficiaries.length === 0) {
          setError("No valid beneficiaries found in CSV")
          return
        }
        
        setBeneficiaries(parsedBeneficiaries)
        setSuccessMessage(`${parsedBeneficiaries.length} beneficiaries have been imported successfully.`)
        
        // Clear success message after 3 seconds
        setTimeout(() => {
          setSuccessMessage("")
        }, 3000)
      }
      
      reader.onerror = () => {
        setError("Error reading CSV file")
      }
      
      reader.readAsText(file)
    } catch (err) {
      setError("Failed to process CSV file")
      console.error(err)
    }
  }

  const totalAmount = beneficiaries.reduce((sum, b) => sum + (Number.parseFloat(b.amount) || 0), 0)

  // Find the selected account
  const selectedAccount = accounts.find(acc => acc._id === fromAccount)
  const insufficientFunds = selectedAccount && totalAmount > selectedAccount.balance

  return (
    <div className="card shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 rounded-xl overflow-hidden">
      <div className="bg-gradient-to-r from-purple-50 to-indigo-50 px-6 py-4 border-b border-gray-100">
        <h2 className="text-xl font-semibold text-gray-800">Bulk Money Transfer</h2>
        <p className="text-sm text-gray-500">Send money to multiple beneficiaries at once</p>
      </div>
      <div className="card-content p-6">
        {showSuccess && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6 flex items-center gap-3">
            <div className="bg-green-100 rounded-full p-1">
              <Check className="h-5 w-5 text-green-600" />
            </div>
            <p className="text-green-800">Bulk transfer completed successfully!</p>
          </div>
        )}
        
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 flex items-center gap-3">
            <AlertCircle className="h-5 w-5 text-red-600" />
            <p className="text-red-800">{error}</p>
          </div>
        )}
        
        {successMessage && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6 flex items-center gap-3">
            <div className="bg-green-100 rounded-full p-1">
              <Check className="h-5 w-5 text-green-600" />
            </div>
            <p className="text-green-800">{successMessage}</p>
          </div>
        )}
        
        {showVerification ? (
          <div className="space-y-6">
            <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 mb-6">
              <h3 className="font-medium text-blue-800 mb-2">Verification Required</h3>
              <p className="text-blue-700 text-sm">
                A verification code has been sent to your email. Please enter it below to complete the transfer.
              </p>
            </div>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="verificationCode" className="block text-sm font-medium">
                  Verification Code
                </label>
                <input
                  id="verificationCode"
                  type="text"
                  className="input w-full rounded-lg border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                  placeholder="Enter 6-digit code"
                  required
                />
              </div>
              
              <div className="flex justify-end">
                <button 
                  onClick={handleVerify} 
                  className="btn bg-purple-600 hover:bg-purple-700 text-white px-6 py-2.5 rounded-lg flex items-center gap-2 transition-all shadow-md hover:shadow-lg" 
                  disabled={isLoading || !verificationCode}
                >
                  {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
                  Verify and Complete Transfer
                </button>
              </div>
            </div>
          </div>
        ) : showConfirmation ? (
          <div className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 flex items-center gap-3">
                <AlertCircle className="h-5 w-5 text-red-600" />
                <p className="text-red-800">{error}</p>
              </div>
            )}
            
            <div className="bg-amber-50 border border-amber-100 rounded-lg p-4 mb-6">
              <h3 className="font-medium text-amber-800 mb-2">Confirm Your Transfer</h3>
              <p className="text-amber-700 text-sm">
                Please review the details below before proceeding with the bulk transfer.
                {insufficientFunds && (
                  <span className="block mt-2 text-red-600 font-medium">
                    Warning: Amount is not enough. Your balance is insufficient for this transfer.
                  </span>
                )}
              </p>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-500 mb-1">From Account</p>
                  <p className="font-medium">
                    {selectedAccount ? (
                      <>
                        {selectedAccount.accountType} - {selectedAccount.accountNumber}
                        <span className="block text-sm text-gray-500 mt-1">
                          Available Balance: {selectedAccount.balance.toFixed(2)} TND
                        </span>
                      </>
                    ) : (
                      "No account selected"
                    )}
                  </p>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-500 mb-1">Total Transfer Amount</p>
                  <p className="font-medium text-lg">{totalAmount.toFixed(2)} TND</p>
                  {insufficientFunds && (
                    <p className="text-red-500 text-sm mt-1">Amount is not enough</p>
                  )}
                </div>
              </div>
              
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Beneficiary</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Account Number</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {beneficiaries.map((beneficiary) => (
                      <tr key={beneficiary.id}>
                        <td className="px-4 py-3 text-sm">{beneficiary.name}</td>
                        <td className="px-4 py-3 text-sm">{beneficiary.accountNumber}</td>
                        <td className="px-4 py-3 text-sm">{parseFloat(beneficiary.amount).toFixed(2)} TND</td>
                        <td className="px-4 py-3 text-sm">{beneficiary.description}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              <div className="flex justify-between">
                <button
                  onClick={() => setShowConfirmation(false)}
                  className="btn bg-gray-100 hover:bg-gray-200 text-gray-800 px-6 py-2.5 rounded-lg transition-all"
                >
                  Back
                </button>
                
                <button 
                  onClick={confirmTransfer} 
                  className={`btn ${insufficientFunds ? 'bg-gray-400 cursor-not-allowed' : 'bg-purple-600 hover:bg-purple-700'} text-white px-6 py-2.5 rounded-lg flex items-center gap-2 transition-all shadow-md hover:shadow-lg`} 
                  disabled={isLoading || insufficientFunds}
                >
                  {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
                  Confirm Transfer
                </button>
              </div>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="fromAccount" className="block text-sm font-medium">
                  From Account
                </label>
                {isLoadingAccounts ? (
                  <div className="flex items-center space-x-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span className="text-sm text-gray-500">Loading accounts...</span>
                  </div>
                ) : accounts.length > 0 ? (
                  <select
                    id="fromAccount"
                    className="select w-full rounded-lg border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all"
                    value={fromAccount}
                    onChange={(e) => setFromAccount(e.target.value)}
                    required
                  >
                    <option value="">Select an account</option>
                    {accounts.map((account) => (
                      <option key={account._id} value={account._id}>
                        {account.accountType} - {account.accountNumber} (Balance: {account.balance.toFixed(2)} TND)
                      </option>
                    ))}
                  </select>
                ) : (
                  <div className="text-amber-600 text-sm">
                    No accounts found. Please create an account first.
                  </div>
                )}
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="block text-sm font-medium">Beneficiaries</label>
                  <div className="flex space-x-2">
                    <label className="btn bg-blue-50 hover:bg-blue-100 text-blue-600 px-3 py-1.5 rounded-lg flex items-center gap-1.5 text-sm cursor-pointer">
                      <Upload className="h-4 w-4" />
                      Import CSV
                      <input
                        type="file"
                        accept=".csv"
                        className="hidden"
                        onChange={handleFileUpload}
                      />
                    </label>
                    <button
                      type="button"
                      onClick={addBeneficiary}
                      className="btn bg-purple-50 hover:bg-purple-100 text-purple-600 px-3 py-1.5 rounded-lg flex items-center gap-1.5 text-sm"
                    >
                      <Plus className="h-4 w-4" />
                      Add Beneficiary
                    </button>
                  </div>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Beneficiary</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Account Number</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {beneficiaries.map((beneficiary) => (
                        <tr key={beneficiary.id} className="border-b">
                          <td className="px-4 py-3">
                            <input
                              value={beneficiary.name}
                              onChange={(e) => updateBeneficiary(beneficiary.id, "name", e.target.value)}
                              placeholder="Name"
                              className="input"
                              required
                            />
                          </td>
                          <td className="px-4 py-3">
                            <input
                              value={beneficiary.accountNumber}
                              onChange={(e) => updateBeneficiary(beneficiary.id, "accountNumber", e.target.value)}
                              placeholder="Account Number"
                              className="input"
                              required
                            />
                          </td>
                          <td className="px-4 py-3">
                            <input
                              type="number"
                              value={beneficiary.amount}
                              onChange={(e) => updateBeneficiary(beneficiary.id, "amount", e.target.value)}
                              placeholder="Amount"
                              className="input"
                              required
                            />
                          </td>
                          <td className="px-4 py-3">
                            <input
                              value={beneficiary.description}
                              onChange={(e) => updateBeneficiary(beneficiary.id, "description", e.target.value)}
                              placeholder="Description"
                              className="input"
                            />
                          </td>
                          <td className="px-4 py-3">
                            <button
                              type="button"
                              onClick={() => removeBeneficiary(beneficiary.id)}
                              className="text-red-500 hover:text-red-700 transition-colors"
                              disabled={beneficiaries.length <= 1}
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg flex justify-between items-center">
                <div>
                  <p className="text-sm text-gray-500">Total Amount</p>
                  <p className="font-medium text-lg">{totalAmount.toFixed(2)} TND</p>
                </div>
                
                {selectedAccount && (
                  <div className="text-right">
                    <p className="text-sm text-gray-500">Available Balance</p>
                    <p className={`font-medium ${insufficientFunds ? 'text-red-600' : 'text-green-600'}`}>
                      {selectedAccount.balance.toFixed(2)} TND
                    </p>
                  </div>
                )}
              </div>
              
              <div className="flex justify-end">
                <button 
                  type="submit" 
                  className="btn bg-purple-600 hover:bg-purple-700 text-white px-6 py-2.5 rounded-lg flex items-center gap-2 transition-all shadow-md hover:shadow-lg" 
                  disabled={isLoading || !fromAccount || beneficiaries.some(b => !b.name || !b.accountNumber || !b.amount)}
                >
                  {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
                  Continue to Verification
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
