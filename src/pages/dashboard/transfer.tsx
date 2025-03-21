"use client"

// src/pages/dashboard/transfer.tsx
import React, { useState, type FormEvent } from "react"
import { Send, AlertCircle } from "lucide-react"
import { useAuth } from "../../contexts/auth-context"
import { useNotifications } from "../../contexts/notification-context"
import { mockAccounts } from "../../data/mock-data"

const TransferPage: React.FC = () => {
  const { currentUser } = useAuth()
  const { addNotification } = useNotifications()
  const [formData, setFormData] = useState({
    fromAccount: "",
    toAccount: "",
    amount: "",
    description: "",
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [transferSuccess, setTransferSuccess] = useState(false)

  // Get user accounts
  const userAccounts = mockAccounts.filter(
    (account) => account.userId === currentUser?.id && account.status === "active",
  )

  // Set default from account if available
  React.useEffect(() => {
    if (userAccounts.length > 0 && !formData.fromAccount) {
      setFormData((prev) => ({
        ...prev,
        fromAccount: userAccounts[0].id.toString(),
      }))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userAccounts]) // We intentionally omit formData.fromAccount to prevent potential infinite loops

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))

    // Clear error when field is edited
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.fromAccount) {
      newErrors.fromAccount = "Please select a source account"
    }

    if (!formData.toAccount) {
      newErrors.toAccount = "Please enter a destination account"
    }

    if (!formData.amount) {
      newErrors.amount = "Please enter an amount"
    } else if (isNaN(Number(formData.amount)) || Number(formData.amount) <= 0) {
      newErrors.amount = "Please enter a valid amount"
    } else {
      // Check if source account has sufficient funds
      const sourceAccount = userAccounts.find((account) => account.id.toString() === formData.fromAccount)
      if (sourceAccount && sourceAccount.balance < Number(formData.amount)) {
        newErrors.amount = "Insufficient funds in the selected account"
      }
    }

    if (!formData.description) {
      newErrors.description = "Please enter a description"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()

    if (validateForm()) {
      setIsSubmitting(true)

      // Simulate API call
      setTimeout(() => {
        setIsSubmitting(false)
        setTransferSuccess(true)

        // Add notification for successful transfer
        if (currentUser) {
          const amount = Number(formData.amount).toLocaleString()
          // Removed unused sourceAccount variable

          addNotification({
            userId: currentUser.id,
            title: "Transfer Successful",
            message: `Your transfer of ${amount} TND to account ${formData.toAccount} was successful.`,
            type: "success",
            link: "/dashboard/accounts",
          })
        }

        // Reset form after 3 seconds
        setTimeout(() => {
          setTransferSuccess(false)
          setFormData({
            fromAccount: userAccounts.length > 0 ? userAccounts[0].id.toString() : "",
            toAccount: "",
            amount: "",
            description: "",
          })
        }, 3000)
      }, 1500)
    }
  }

  // Get account details by ID
  const getAccountDetails = (accountId: string) => {
    return userAccounts.find((account) => account.id.toString() === accountId)
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900">Transfer Money</h1>

      <div className="mt-6 bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Make a Transfer</h2>

          {transferSuccess ? (
            <div className="bg-green-50 border-l-4 border-green-500 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <Send className="h-5 w-5 text-green-400" />
                </div>
                <div className="ml-3">
                  <p className="text-sm text-green-700">Transfer completed successfully! The funds have been sent.</p>
                </div>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label htmlFor="fromAccount" className="block text-sm font-medium text-gray-700">
                    From Account
                  </label>
                  <select
                    id="fromAccount"
                    name="fromAccount"
                    value={formData.fromAccount}
                    onChange={handleChange}
                    className={`mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-900 focus:border-blue-900 sm:text-sm rounded-md ${
                      errors.fromAccount ? "border-red-300 ring-red-500" : ""
                    }`}
                  >
                    <option value="">Select an account</option>
                    {userAccounts.map((account) => (
                      <option key={account.id} value={account.id}>
                        {account.accountType} - {account.accountNumber.substring(0, 8)}... (
                        {account.balance.toLocaleString()} {account.currency})
                      </option>
                    ))}
                  </select>
                  {errors.fromAccount && <p className="mt-1 text-sm text-red-600">{errors.fromAccount}</p>}
                </div>

                <div>
                  <label htmlFor="toAccount" className="block text-sm font-medium text-gray-700">
                    To Account (Account Number)
                  </label>
                  <input
                    type="text"
                    id="toAccount"
                    name="toAccount"
                    value={formData.toAccount}
                    onChange={handleChange}
                    placeholder="Enter account number"
                    className={`mt-1 focus:ring-blue-900 focus:border-blue-900 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md ${
                      errors.toAccount ? "border-red-300 ring-red-500" : ""
                    }`}
                  />
                  {errors.toAccount && <p className="mt-1 text-sm text-red-600">{errors.toAccount}</p>}
                </div>

                <div>
                  <label htmlFor="amount" className="block text-sm font-medium text-gray-700">
                    Amount
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-gray-500 sm:text-sm">TND</span>
                    </div>
                    <input
                      type="text"
                      id="amount"
                      name="amount"
                      value={formData.amount}
                      onChange={handleChange}
                      placeholder="0.00"
                      className={`focus:ring-blue-900 focus:border-blue-900 block w-full pl-12 pr-12 sm:text-sm border-gray-300 rounded-md ${
                        errors.amount ? "border-red-300 ring-red-500" : ""
                      }`}
                    />
                  </div>
                  {errors.amount && <p className="mt-1 text-sm text-red-600">{errors.amount}</p>}

                  {formData.fromAccount && (
                    <p className="mt-1 text-sm text-gray-500">
                      Available balance: {getAccountDetails(formData.fromAccount)?.balance.toLocaleString()} TND
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                    Description
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    rows={3}
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Enter transfer description"
                    className={`mt-1 focus:ring-blue-900 focus:border-blue-900 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md ${
                      errors.description ? "border-red-300 ring-red-500" : ""
                    }`}
                  />
                  {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
                </div>
              </div>

              <div className="mt-6 bg-gray-50 p-4 rounded-md">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <AlertCircle className="h-5 w-5 text-blue-900" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-gray-900">Important Information</h3>
                    <div className="mt-2 text-sm text-gray-500">
                      <ul className="list-disc pl-5 space-y-1">
                        <li>Transfers between accounts are processed immediately.</li>
                        <li>Transfers to other banks may take 1-2 business days.</li>
                        <li>Daily transfer limit is 10,000 TND.</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-900 hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-900 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Processing...
                    </>
                  ) : (
                    <>
                      <Send className="mr-2 h-4 w-4" />
                      Send Money
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}

export default TransferPage

