"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Loader2, Check, ArrowRight, DollarSign, CreditCard, FileText, AlertCircle } from "lucide-react"
import axios from "axios"

interface Account {
  id: string
  accountNumber: string
  accountType: string
  currency: string
  balance: number
}

export function SimpleTransfer() {
  const [isLoading, setIsLoading] = useState(false)
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [error, setError] = useState("")
  const [userAccounts, setUserAccounts] = useState<Account[]>([])
  const [formData, setFormData] = useState({
    fromAccountId: "",
    toAccountNumber: "",
    amount: "",
    description: "",
  })
  const [fetchingAccounts, setFetchingAccounts] = useState(true)
  const [transferId, setTransferId] = useState("")
  const [showVerification, setShowVerification] = useState(false)
  const [verificationCode, setVerificationCode] = useState("")

  // Fetch user accounts from API
  useEffect(() => {
    const fetchAccounts = async () => {
      setFetchingAccounts(true)
      try {
        const response = await axios.get(
          "http://localhost:5001/api/users/accounts",
          { withCredentials: true }
        )
        
        if (response.data.success) {
          setUserAccounts(response.data.accounts || [])
          setError("")
        } else {
          setError("Failed to load your accounts")
        }
      } catch (err: any) {
        console.error("Failed to fetch accounts:", err)
        setError(err.response?.data?.message || "Failed to load your accounts. Please try again.")
      } finally {
        setFetchingAccounts(false)
      }
    }

    fetchAccounts()
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setShowConfirmation(true)
  }

  const handleConfirm = async () => {
    setIsLoading(true)
    setError("")
    
    try {
      const payload = {
        fromAccountId: formData.fromAccountId,
        toAccountNumber: formData.toAccountNumber,
        amount: parseFloat(formData.amount),
        description: formData.description
      }
      
      const response = await axios.post("http://localhost:5001/api/users/transfers/simple", payload, {
        withCredentials: true
      })
      
      setShowConfirmation(false)
      
      if (response.data.success) {
        // Store the transfer ID for verification
        setTransferId(response.data.transferId)
        setShowVerification(true)
      } else {
        setError(response.data.message || "Failed to initiate transfer")
      }
    } catch (err) {
      const error = err as any;
      setError(error.response?.data?.message || "An error occurred during the transfer")
      setShowConfirmation(false)
    } finally {
      setIsLoading(false)
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
          setFormData({
            fromAccountId: "",
            toAccountNumber: "",
            amount: "",
            description: "",
          })
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

  const handleCancel = () => {
    setShowConfirmation(false)
  }

  // Find the selected account details
  const selectedAccount = userAccounts.find(acc => acc.id === formData.fromAccountId)

  return (
    <div className="card shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 rounded-xl overflow-hidden">
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4 border-b border-gray-100">
        <h2 className="text-xl font-semibold text-gray-800">Simple Money Transfer</h2>
        <p className="text-sm text-gray-500">Transfer funds to another account by account number</p>
      </div>
      <div className="card-content p-6">
        {fetchingAccounts ? (
          <div className="flex justify-center items-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
            <span className="ml-2">Loading your accounts...</span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <label htmlFor="fromAccountId" className="block text-sm font-medium flex items-center gap-2">
                  <CreditCard className="h-4 w-4 text-blue-500" />
                  From Account
                </label>
                <select
                  id="fromAccountId"
                  name="fromAccountId"
                  className="input w-full rounded-lg border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                  value={formData.fromAccountId}
                  onChange={handleChange}
                  required
                >
                  <option value="" disabled>
                    Select source account
                  </option>
                  {userAccounts.map(account => (
                    <option key={account.id} value={account.id}>
                      {account.accountType} - {account.accountNumber} - {account.balance.toFixed(2)} {account.currency}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label htmlFor="toAccountNumber" className="block text-sm font-medium flex items-center gap-2">
                  <CreditCard className="h-4 w-4 text-blue-500" />
                  To Account Number
                </label>
                <input
                  id="toAccountNumber"
                  name="toAccountNumber"
                  type="text"
                  placeholder="Enter recipient's account number"
                  value={formData.toAccountNumber}
                  onChange={handleChange}
                  required
                  className="input w-full rounded-lg border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="amount" className="block text-sm font-medium flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-blue-500" />
                  Amount
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <span className="text-gray-500">{selectedAccount?.currency || "TND"}</span>
                  </div>
                  <input
                    id="amount"
                    name="amount"
                    type="number"
                    placeholder="Enter amount"
                    value={formData.amount}
                    onChange={handleChange}
                    required
                    className="input pl-14 pr-4 w-full rounded-lg border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="description" className="block text-sm font-medium flex items-center gap-2">
                  <FileText className="h-4 w-4 text-blue-500" />
                  Description (Optional)
                </label>
                <textarea
                  id="description"
                  name="description"
                  placeholder="Enter transfer description"
                  value={formData.description}
                  onChange={handleChange}
                  className="input min-h-[80px] w-full rounded-lg border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                />
              </div>
            </div>

            {error && (
              <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
                <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
                <p>{error}</p>
              </div>
            )}

            <div className="mt-6 flex justify-end">
              <button 
                type="submit" 
                className="btn bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg flex items-center gap-2 hover:translate-x-1 transition-all duration-300 shadow-md hover:shadow-lg" 
                disabled={isLoading || !formData.fromAccountId || !formData.toAccountNumber || !formData.amount}
              >
                {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
                Continue to Verification
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </form>
        )}

        {/* Confirmation Dialog */}
        {showConfirmation && selectedAccount && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="card w-full max-w-md bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden animate-fade-in-up">
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4 border-b border-gray-100">
                <h2 className="text-xl font-semibold text-gray-800">Confirm Transfer</h2>
                <p className="text-sm text-gray-500">Please review the transfer details before proceeding</p>
              </div>
              <div className="card-content p-6">
                <div className="space-y-4 py-4">
                  <div className="flex justify-between">
                    <span className="text-[var(--muted)]">From Account:</span>
                    <span className="font-medium">
                      {selectedAccount.accountType} - {selectedAccount.accountNumber}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[var(--muted)]">To Account:</span>
                    <span className="font-medium">{formData.toAccountNumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[var(--muted)]">Amount:</span>
                    <span className="font-medium">{formData.amount} {selectedAccount.currency}</span>
                  </div>
                  {formData.description && (
                    <div className="flex justify-between">
                      <span className="text-[var(--muted)]">Description:</span>
                      <span className="font-medium">{formData.description}</span>
                    </div>
                  )}
                </div>

                {error && (
                  <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg mb-4">
                    <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
                    <p>{error}</p>
                  </div>
                )}

                <div className="flex justify-end gap-3 mt-6">
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="btn bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg"
                    disabled={isLoading}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleConfirm}
                    className="btn bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg flex items-center gap-2"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        Confirm Transfer
                        <Check className="h-4 w-4" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Verification Dialog */}
        {showVerification && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="card w-full max-w-md bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden animate-fade-in-up">
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4 border-b border-gray-100">
                <h2 className="text-xl font-semibold text-gray-800">Verify Transfer</h2>
                <p className="text-sm text-gray-500">Enter the verification code sent to your email</p>
              </div>
              <div className="card-content p-6">
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <label htmlFor="verificationCode" className="block text-sm font-medium">
                      Verification Code
                    </label>
                    <input
                      id="verificationCode"
                      type="text"
                      placeholder="Enter 6-digit code"
                      value={verificationCode}
                      onChange={(e) => setVerificationCode(e.target.value)}
                      className="input w-full rounded-lg border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                      maxLength={6}
                    />
                  </div>
                </div>

                {error && (
                  <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg mb-4">
                    <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
                    <p>{error}</p>
                  </div>
                )}

                <div className="flex justify-end gap-3 mt-6">
                  <button
                    type="button"
                    className="btn bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg"
                    onClick={() => {
                      setShowVerification(false)
                      setError("")
                    }}
                    disabled={isLoading}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="btn bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg flex items-center gap-2"
                    onClick={handleVerify}
                    disabled={isLoading || verificationCode.length !== 6}
                  >
                    {isLoading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Check className="h-4 w-4" />
                    )}
                    Verify Transfer
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Success Dialog */}
        {showSuccess && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="card w-full max-w-md bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden animate-fade-in-up">
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 px-6 py-4 border-b border-gray-100">
                <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                  <Check className="h-5 w-5 text-green-500" />
                  Transfer Successful
                </h2>
              </div>
              <div className="card-content p-6 text-center">
                <div className="bg-green-50 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                  <Check className="h-10 w-10 text-green-500" />
                </div>
                <p className="text-lg font-medium text-gray-800 mb-1">Your transfer has been processed</p>
                <p className="text-gray-500 mb-6">The funds will be transferred shortly</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
