"use client"

import type React from "react"
import { useState, useEffect, useMemo } from "react"
import { useAuth } from "../../contexts/auth-context"
import { useNotifications } from "../../contexts/notification-context"
import { mockAccounts, mockPayees, mockBillPayments } from "../../data/mock-data"
import { Building, Calendar, FileText, Plus, Check, AlertCircle, Trash2, Edit, RefreshCw } from "lucide-react"
import type { Payee } from "../../types"

const BillPaymentPage: React.FC = () => {
  const { currentUser } = useAuth()
  const { addNotification } = useNotifications()
  const [activeTab, setActiveTab] = useState<"pay" | "history" | "manage">("pay")

  // Payment form state
  const [paymentForm, setPaymentForm] = useState({
    accountId: "",
    payeeId: "",
    amount: "",
    reference: "",
    description: "",
    scheduledDate: new Date().toISOString().split("T")[0],
  })

  // New payee form state
  const [newPayeeForm, setNewPayeeForm] = useState({
    name: "",
    accountNumber: "",
    category: "utility" as "utility" | "telecom" | "insurance" | "credit" | "other",
  })

  // UI states
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [paymentSuccess, setPaymentSuccess] = useState(false)
  const [showAddPayeeForm, setShowAddPayeeForm] = useState(false)
  const [payeeAddSuccess, setPayeeAddSuccess] = useState(false)
  const [editingPayeeId, setEditingPayeeId] = useState<number | null>(null)
  const [errors, setErrors] = useState<Record<string, string>>({})

  // Get user accounts
  const userAccounts = useMemo(() => {
    if (!currentUser) return []
    return mockAccounts.filter((account) => account.userId === currentUser.id && account.status === "active")
  }, [currentUser])

  // Get user payees
  const userPayees = useMemo(() => {
    if (!currentUser) return []
    return mockPayees.filter((payee) => payee.userId === currentUser.id && payee.isActive)
  }, [currentUser])

  // Get user bill payments
  const userBillPayments = useMemo(() => {
    if (!currentUser) return []
    return mockBillPayments
      .filter((payment) => payment.userId === currentUser.id)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  }, [currentUser])

  // Set default account if available
  useEffect(() => {
    if (userAccounts.length > 0 && !paymentForm.accountId) {
      setPaymentForm((prev) => ({
        ...prev,
        accountId: userAccounts[0].id.toString(),
      }))
    }
  }, [userAccounts])

  // Handle payment form change
  const handlePaymentFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target
    setPaymentForm((prev) => ({
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

  // Handle new payee form change
  const handleNewPayeeFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setNewPayeeForm((prev) => ({
      ...prev,
      [name]: value,
    }))

    // Clear error when field is edited
    if (errors[`payee_${name}`]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[`payee_${name}`]
        return newErrors
      })
    }
  }

  // Validate payment form
  const validatePaymentForm = () => {
    const newErrors: Record<string, string> = {}

    if (!paymentForm.accountId) {
      newErrors.accountId = "Please select an account"
    }

    if (!paymentForm.payeeId) {
      newErrors.payeeId = "Please select a payee"
    }

    if (!paymentForm.amount) {
      newErrors.amount = "Please enter an amount"
    } else if (isNaN(Number(paymentForm.amount)) || Number(paymentForm.amount) <= 0) {
      newErrors.amount = "Please enter a valid amount"
    } else {
      // Check if source account has sufficient funds
      const sourceAccount = userAccounts.find((account) => account.id.toString() === paymentForm.accountId)
      if (sourceAccount && sourceAccount.balance < Number(paymentForm.amount)) {
        newErrors.amount = "Insufficient funds in the selected account"
      }
    }

    if (!paymentForm.reference) {
      newErrors.reference = "Please enter a reference number"
    }

    if (!paymentForm.scheduledDate) {
      newErrors.scheduledDate = "Please select a date"
    } else {
      const selectedDate = new Date(paymentForm.scheduledDate)
      const today = new Date()
      today.setHours(0, 0, 0, 0)

      if (selectedDate < today) {
        newErrors.scheduledDate = "Date cannot be in the past"
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Validate new payee form
  const validateNewPayeeForm = () => {
    const newErrors: Record<string, string> = {}

    if (!newPayeeForm.name) {
      newErrors.payee_name = "Please enter a payee name"
    }

    if (!newPayeeForm.accountNumber) {
      newErrors.payee_accountNumber = "Please enter an account number"
    } else if (
      !/^[A-Z]{2}\d{2}[\s-]?\d{4}[\s-]?\d{4}[\s-]?\d{4}[\s-]?\d{4}[\s-]?\d{4}$/.test(
        newPayeeForm.accountNumber.replace(/\s/g, ""),
      )
    ) {
      newErrors.payee_accountNumber = "Please enter a valid IBAN account number"
    }

    if (!newPayeeForm.category) {
      newErrors.payee_category = "Please select a category"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Handle payment submission
  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (validatePaymentForm()) {
      setIsSubmitting(true)

      // Simulate API call
      setTimeout(() => {
        setIsSubmitting(false)
        setPaymentSuccess(true)

        // Add notification
        if (currentUser) {
          const payee = userPayees.find((p) => p.id.toString() === paymentForm.payeeId)

          addNotification({
            userId: currentUser.id,
            title: "Bill Payment Scheduled",
            message: `Your payment of ${Number(paymentForm.amount).toLocaleString()} TND to ${payee?.name || "payee"} has been scheduled.`,
            type: "success",
            link: "/dashboard/bill-payment",
          })
        }

        // Reset form after 3 seconds
        setTimeout(() => {
          setPaymentSuccess(false)
          setPaymentForm({
            accountId: userAccounts.length > 0 ? userAccounts[0].id.toString() : "",
            payeeId: "",
            amount: "",
            reference: "",
            description: "",
            scheduledDate: new Date().toISOString().split("T")[0],
          })
        }, 3000)
      }, 1500)
    }
  }

  // Handle add payee submission
  const handleAddPayeeSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (validateNewPayeeForm()) {
      setIsSubmitting(true)

      // Simulate API call
      setTimeout(() => {
        setIsSubmitting(false)
        setPayeeAddSuccess(true)

        // Reset form after 2 seconds
        setTimeout(() => {
          setPayeeAddSuccess(false)
          setShowAddPayeeForm(false)
          setNewPayeeForm({
            name: "",
            accountNumber: "",
            category: "utility",
          })
        }, 2000)
      }, 1000)
    }
  }

  // Handle edit payee
  const handleEditPayee = (payee: Payee) => {
    setEditingPayeeId(payee.id)
    setNewPayeeForm({
      name: payee.name,
      accountNumber: payee.accountNumber,
      category: payee.category,
    })
    setShowAddPayeeForm(true)
  }

  // Handle delete payee
  const handleDeletePayee = (payeeId: number) => {
    if (window.confirm("Are you sure you want to delete this payee?")) {
      // In a real app, this would make an API call
      alert("Payee deleted successfully")
    }
  }

  // Get account details by ID
  const getAccountDetails = (accountId: string) => {
    return userAccounts.find((account) => account.id.toString() === accountId)
  }

  // Get payee details by ID
  const getPayeeDetails = (payeeId: number) => {
    return userPayees.find((payee) => payee.id === payeeId)
  }

  // Format category name
  const formatCategory = (category: string) => {
    return category.charAt(0).toUpperCase() + category.slice(1)
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900">Bill Payments</h1>

      {/* Tabs */}
      <div className="mt-6 border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab("pay")}
            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === "pay"
                ? "border-blue-900 text-blue-900"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            Pay Bills
          </button>
          <button
            onClick={() => setActiveTab("history")}
            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === "history"
                ? "border-blue-900 text-blue-900"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            Payment History
          </button>
          <button
            onClick={() => setActiveTab("manage")}
            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === "manage"
                ? "border-blue-900 text-blue-900"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            Manage Payees
          </button>
        </nav>
      </div>

      {/* Pay Bills Tab */}
      {activeTab === "pay" && (
        <div className="mt-6">
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Make a Payment</h2>

              {paymentSuccess ? (
                <div className="bg-green-50 border-l-4 border-green-500 p-4">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <Check className="h-5 w-5 text-green-400" />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-green-700">
                        Payment scheduled successfully! Your bill payment has been scheduled.
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <form onSubmit={handlePaymentSubmit}>
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <div>
                      <label htmlFor="accountId" className="block text-sm font-medium text-gray-700">
                        From Account
                      </label>
                      <select
                        id="accountId"
                        name="accountId"
                        value={paymentForm.accountId}
                        onChange={handlePaymentFormChange}
                        className={`mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-900 focus:border-blue-900 sm:text-sm rounded-md ${
                          errors.accountId ? "border-red-300 ring-red-500" : ""
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
                      {errors.accountId && <p className="mt-1 text-sm text-red-600">{errors.accountId}</p>}
                    </div>

                    <div>
                      <label htmlFor="payeeId" className="block text-sm font-medium text-gray-700">
                        Payee
                      </label>
                      <select
                        id="payeeId"
                        name="payeeId"
                        value={paymentForm.payeeId}
                        onChange={handlePaymentFormChange}
                        className={`mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-900 focus:border-blue-900 sm:text-sm rounded-md ${
                          errors.payeeId ? "border-red-300 ring-red-500" : ""
                        }`}
                      >
                        <option value="">Select a payee</option>
                        {userPayees.map((payee) => (
                          <option key={payee.id} value={payee.id}>
                            {payee.name} ({formatCategory(payee.category)})
                          </option>
                        ))}
                      </select>
                      {errors.payeeId && <p className="mt-1 text-sm text-red-600">{errors.payeeId}</p>}
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
                          value={paymentForm.amount}
                          onChange={handlePaymentFormChange}
                          placeholder="0.00"
                          className={`focus:ring-blue-900 focus:border-blue-900 block w-full pl-12 pr-12 sm:text-sm border-gray-300 rounded-md ${
                            errors.amount ? "border-red-300 ring-red-500" : ""
                          }`}
                        />
                      </div>
                      {errors.amount && <p className="mt-1 text-sm text-red-600">{errors.amount}</p>}

                      {paymentForm.accountId && (
                        <p className="mt-1 text-sm text-gray-500">
                          Available balance: {getAccountDetails(paymentForm.accountId)?.balance.toLocaleString()} TND
                        </p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="scheduledDate" className="block text-sm font-medium text-gray-700">
                        Payment Date
                      </label>
                      <div className="mt-1 relative rounded-md shadow-sm">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Calendar className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          type="date"
                          id="scheduledDate"
                          name="scheduledDate"
                          value={paymentForm.scheduledDate}
                          onChange={handlePaymentFormChange}
                          className={`focus:ring-blue-900 focus:border-blue-900 block w-full pl-10 pr-10 sm:text-sm border-gray-300 rounded-md ${
                            errors.scheduledDate ? "border-red-300 ring-red-500" : ""
                          }`}
                        />
                      </div>
                      {errors.scheduledDate && <p className="mt-1 text-sm text-red-600">{errors.scheduledDate}</p>}
                    </div>

                    <div>
                      <label htmlFor="reference" className="block text-sm font-medium text-gray-700">
                        Reference Number
                      </label>
                      <input
                        type="text"
                        id="reference"
                        name="reference"
                        value={paymentForm.reference}
                        onChange={handlePaymentFormChange}
                        placeholder="e.g., Invoice number, Customer ID"
                        className={`mt-1 focus:ring-blue-900 focus:border-blue-900 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md ${
                          errors.reference ? "border-red-300 ring-red-500" : ""
                        }`}
                      />
                      {errors.reference && <p className="mt-1 text-sm text-red-600">{errors.reference}</p>}
                    </div>

                    <div className="sm:col-span-2">
                      <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                        Description (Optional)
                      </label>
                      <textarea
                        id="description"
                        name="description"
                        rows={3}
                        value={paymentForm.description}
                        onChange={handlePaymentFormChange}
                        placeholder="Add a note about this payment"
                        className="mt-1 focus:ring-blue-900 focus:border-blue-900 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                      />
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
                            <li>Payments scheduled before 2:00 PM will be processed on the same day.</li>
                            <li>Payments scheduled after 2:00 PM will be processed on the next business day.</li>
                            <li>You can cancel a scheduled payment up to 24 hours before the payment date.</li>
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
                          <RefreshCw className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" />
                          Processing...
                        </>
                      ) : (
                        <>
                          <Check className="mr-2 h-4 w-4" />
                          Schedule Payment
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Payment History Tab */}
      {activeTab === "history" && (
        <div className="mt-6">
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Payment History</h2>

              {userBillPayments.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Date
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Payee
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Reference
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Amount
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {userBillPayments.map((payment) => {
                        const payee = getPayeeDetails(payment.payeeId)
                        return (
                          <tr key={payment.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {new Date(payment.scheduledDate).toLocaleDateString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-900">{payee?.name || "Unknown Payee"}</div>
                              <div className="text-sm text-gray-500">{formatCategory(payee?.category || "other")}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{payment.reference}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              {payment.amount.toLocaleString()} TND
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span
                                className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                  payment.status === "completed"
                                    ? "bg-green-100 text-green-800"
                                    : payment.status === "pending"
                                      ? "bg-yellow-100 text-yellow-800"
                                      : "bg-red-100 text-red-800"
                                }`}
                              >
                                {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                              </span>
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-8">
                  <FileText className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No payment history</h3>
                  <p className="mt-1 text-sm text-gray-500">You haven't made any bill payments yet.</p>
                  <div className="mt-6">
                    <button
                      type="button"
                      onClick={() => setActiveTab("pay")}
                      className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-900 hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-900"
                    >
                      <Plus className="-ml-1 mr-2 h-5 w-5" />
                      Make a Payment
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Manage Payees Tab */}
      {activeTab === "manage" && (
        <div className="mt-6">
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-medium text-gray-900">Manage Payees</h2>
                <button
                  type="button"
                  onClick={() => {
                    setShowAddPayeeForm(!showAddPayeeForm)
                    setEditingPayeeId(null)
                    setNewPayeeForm({
                      name: "",
                      accountNumber: "",
                      category: "utility",
                    })
                  }}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-900 hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-900"
                >
                  <Plus className="-ml-1 mr-2 h-5 w-5" />
                  Add New Payee
                </button>
              </div>

              {/* Add/Edit Payee Form */}
              {showAddPayeeForm && (
                <div className="mb-6 bg-gray-50 p-4 rounded-md">
                  <h3 className="text-md font-medium text-gray-900 mb-4">
                    {editingPayeeId ? "Edit Payee" : "Add New Payee"}
                  </h3>

                  {payeeAddSuccess ? (
                    <div className="bg-green-50 border-l-4 border-green-500 p-4">
                      <div className="flex">
                        <div className="flex-shrink-0">
                          <Check className="h-5 w-5 text-green-400" />
                        </div>
                        <div className="ml-3">
                          <p className="text-sm text-green-700">
                            {editingPayeeId ? "Payee updated successfully!" : "Payee added successfully!"}
                          </p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <form onSubmit={handleAddPayeeSubmit}>
                      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                        <div>
                          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                            Payee Name
                          </label>
                          <input
                            type="text"
                            id="name"
                            name="name"
                            value={newPayeeForm.name}
                            onChange={handleNewPayeeFormChange}
                            className={`mt-1 focus:ring-blue-900 focus:border-blue-900 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md ${
                              errors.payee_name ? "border-red-300 ring-red-500" : ""
                            }`}
                          />
                          {errors.payee_name && <p className="mt-1 text-sm text-red-600">{errors.payee_name}</p>}
                        </div>

                        <div>
                          <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                            Category
                          </label>
                          <select
                            id="category"
                            name="category"
                            value={newPayeeForm.category}
                            onChange={handleNewPayeeFormChange}
                            className={`mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-900 focus:border-blue-900 sm:text-sm rounded-md ${
                              errors.payee_category ? "border-red-300 ring-red-500" : ""
                            }`}
                          >
                            <option value="utility">Utility</option>
                            <option value="telecom">Telecom</option>
                            <option value="insurance">Insurance</option>
                            <option value="credit">Credit Card/Loan</option>
                            <option value="other">Other</option>
                          </select>
                          {errors.payee_category && (
                            <p className="mt-1 text-sm text-red-600">{errors.payee_category}</p>
                          )}
                        </div>

                        <div className="sm:col-span-2">
                          <label htmlFor="accountNumber" className="block text-sm font-medium text-gray-700">
                            Account Number (IBAN)
                          </label>
                          <input
                            type="text"
                            id="accountNumber"
                            name="accountNumber"
                            value={newPayeeForm.accountNumber}
                            onChange={handleNewPayeeFormChange}
                            placeholder="e.g., TN59 0001 0001 1234 5678 9012"
                            className={`mt-1 focus:ring-blue-900 focus:border-blue-900 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md ${
                              errors.payee_accountNumber ? "border-red-300 ring-red-500" : ""
                            }`}
                          />
                          {errors.payee_accountNumber && (
                            <p className="mt-1 text-sm text-red-600">{errors.payee_accountNumber}</p>
                          )}
                        </div>
                      </div>

                      <div className="mt-4 flex justify-end space-x-3">
                        <button
                          type="button"
                          onClick={() => setShowAddPayeeForm(false)}
                          className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-900"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          disabled={isSubmitting}
                          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-900 hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-900 disabled:opacity-50"
                        >
                          {isSubmitting ? (
                            <>
                              <RefreshCw className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" />
                              Processing...
                            </>
                          ) : (
                            <>
                              <Check className="mr-2 h-4 w-4" />
                              {editingPayeeId ? "Update Payee" : "Add Payee"}
                            </>
                          )}
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              )}

              {/* Payees List */}
              {userPayees.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Payee Name
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Category
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Account Number
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {userPayees.map((payee) => (
                        <tr key={payee.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {payee.name}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {formatCategory(payee.category)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{payee.accountNumber}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <button
                              onClick={() => handleEditPayee(payee)}
                              className="text-blue-900 hover:text-blue-800 mr-4"
                            >
                              <Edit className="h-5 w-5" />
                            </button>
                            <button
                              onClick={() => handleDeletePayee(payee.id)}
                              className="text-red-600 hover:text-red-900"
                            >
                              <Trash2 className="h-5 w-5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-8">
                  <Building className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No payees</h3>
                  <p className="mt-1 text-sm text-gray-500">Get started by adding a new payee.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default BillPaymentPage

