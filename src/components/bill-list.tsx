"use client"

import { useState } from "react"
import { Calendar, CreditCard, FileText, MoreHorizontal } from "lucide-react"

// Sample bills data
const bills = [
  {
    id: "BILL-001",
    name: "Electricity Bill",
    provider: "STEG",
    amount: 85.5,
    dueDate: "2023-04-15",
    status: "Unpaid",
    category: "Utilities",
    reference: "STEG-APR2023",
  },
  {
    id: "BILL-002",
    name: "Water Bill",
    provider: "SONEDE",
    amount: 45.75,
    dueDate: "2023-04-20",
    status: "Unpaid",
    category: "Utilities",
    reference: "SONEDE-APR2023",
  },
  {
    id: "BILL-003",
    name: "Internet Bill",
    provider: "Ooredoo",
    amount: 65.0,
    dueDate: "2023-04-25",
    status: "Unpaid",
    category: "Telecommunications",
    reference: "OOREDOO-APR2023",
  },
  {
    id: "BILL-004",
    name: "Mobile Phone Bill",
    provider: "Tunisie Telecom",
    amount: 35.25,
    dueDate: "2023-04-10",
    status: "Paid",
    category: "Telecommunications",
    reference: "TT-APR2023",
    paymentDate: "2023-04-08",
  },
  {
    id: "BILL-005",
    name: "Gas Bill",
    provider: "STEG",
    amount: 55.0,
    dueDate: "2023-04-05",
    status: "Paid",
    category: "Utilities",
    reference: "STEG-GAS-APR2023",
    paymentDate: "2023-04-03",
  },
]

export function BillsList() {
  const [selectedBill, setSelectedBill] = useState<(typeof bills)[0] | null>(null)
  const [showPaymentDialog, setShowPaymentDialog] = useState(false)
  const [localBills, setLocalBills] = useState(bills)
  const [dropdownOpen, setDropdownOpen] = useState<string | null>(null)

  const handlePayBill = (bill: (typeof bills)[0]) => {
    setSelectedBill(bill)
    setShowPaymentDialog(true)
  }

  const confirmPayment = () => {
    if (selectedBill) {
      // Update the bill status
      const updatedBills = localBills.map((bill) =>
        bill.id === selectedBill.id
          ? {
              ...bill,
              status: "Paid",
              paymentDate: new Date().toISOString().split("T")[0],
            }
          : bill,
      )

      setLocalBills(updatedBills)
      setShowPaymentDialog(false)
    }
  }

  const unpaidBills = localBills.filter((bill) => bill.status === "Unpaid")
  const paidBills = localBills.filter((bill) => bill.status === "Paid")

  return (
    <div className="card mt-6">
      <div className="card-header">
        <h2 className="card-title">Your Bills</h2>
      </div>
      <div className="card-content">
        <div className="space-y-6">
          <div>
            <h3 className="mb-4 text-lg font-medium">Unpaid Bills</h3>
            {unpaidBills.length > 0 ? (
              <div className="rounded-md border overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b">
                      <th className="px-4 py-3 text-left text-sm font-medium">Bill Name</th>
                      <th className="px-4 py-3 text-left text-sm font-medium">Provider</th>
                      <th className="px-4 py-3 text-left text-sm font-medium">Amount</th>
                      <th className="px-4 py-3 text-left text-sm font-medium">Due Date</th>
                      <th className="px-4 py-3 text-left text-sm font-medium">Status</th>
                      <th className="px-4 py-3 text-right text-sm font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {unpaidBills.map((bill) => (
                      <tr key={bill.id} className="border-b hover:bg-[var(--muted-background)]">
                        <td className="px-4 py-3 text-sm">{bill.name}</td>
                        <td className="px-4 py-3 text-sm">{bill.provider}</td>
                        <td className="px-4 py-3 text-sm">{bill.amount.toLocaleString()} TND</td>
                        <td className="px-4 py-3 text-sm">
                          <div className="flex items-center">
                            <Calendar className="mr-2 h-4 w-4 text-[var(--muted)]" />
                            {new Date(bill.dueDate).toLocaleDateString()}
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm">
                          <span className="badge badge-warning">{bill.status}</span>
                        </td>
                        <td className="px-4 py-3 text-sm text-right">
                          <div className="dropdown-menu relative">
                            <button
                              className="btn btn-outline btn-sm btn-icon"
                              onClick={() => setDropdownOpen(dropdownOpen === bill.id ? null : bill.id)}
                            >
                              <MoreHorizontal className="h-4 w-4" />
                            </button>
                            {dropdownOpen === bill.id && (
                              <div className="dropdown-menu-content absolute right-0 mt-2 z-10">
                                <button
                                  className="dropdown-menu-item"
                                  onClick={() => {
                                    handlePayBill(bill)
                                    setDropdownOpen(null)
                                  }}
                                >
                                  <CreditCard className="mr-2 h-4 w-4" />
                                  Pay Bill
                                </button>
                                <button className="dropdown-menu-item">
                                  <FileText className="mr-2 h-4 w-4" />
                                  View Details
                                </button>
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="rounded-md border p-4 text-center text-[var(--muted)]">
                No unpaid bills at the moment.
              </div>
            )}
          </div>

          <div>
            <h3 className="mb-4 text-lg font-medium">Recent Payments</h3>
            {paidBills.length > 0 ? (
              <div className="rounded-md border overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b">
                      <th className="px-4 py-3 text-left text-sm font-medium">Bill Name</th>
                      <th className="px-4 py-3 text-left text-sm font-medium">Provider</th>
                      <th className="px-4 py-3 text-left text-sm font-medium">Amount</th>
                      <th className="px-4 py-3 text-left text-sm font-medium">Payment Date</th>
                      <th className="px-4 py-3 text-left text-sm font-medium">Status</th>
                      <th className="px-4 py-3 text-right text-sm font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paidBills.map((bill) => (
                      <tr key={bill.id} className="border-b hover:bg-[var(--muted-background)]">
                        <td className="px-4 py-3 text-sm">{bill.name}</td>
                        <td className="px-4 py-3 text-sm">{bill.provider}</td>
                        <td className="px-4 py-3 text-sm">{bill.amount.toLocaleString()} TND</td>
                        <td className="px-4 py-3 text-sm">
                          <div className="flex items-center">
                            <Calendar className="mr-2 h-4 w-4 text-[var(--muted)]" />
                            {new Date(bill.paymentDate!).toLocaleDateString()}
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm">
                          <span className="badge badge-success">{bill.status}</span>
                        </td>
                        <td className="px-4 py-3 text-sm text-right">
                          <button className="btn btn-outline btn-sm btn-icon">
                            <FileText className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="rounded-md border p-4 text-center text-[var(--muted)]">No recent payments.</div>
            )}
          </div>
        </div>

        {showPaymentDialog && selectedBill && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="card w-full max-w-md">
              <div className="card-header">
                <h2 className="card-title">Confirm Payment</h2>
                <p className="text-sm text-[var(--muted)]">Please review the payment details before proceeding</p>
              </div>
              <div className="card-content">
                <div className="space-y-4 py-4">
                  <div className="flex justify-between">
                    <span className="text-[var(--muted)]">Bill Name:</span>
                    <span className="font-medium">{selectedBill.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[var(--muted)]">Provider:</span>
                    <span className="font-medium">{selectedBill.provider}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[var(--muted)]">Amount:</span>
                    <span className="font-medium">{selectedBill.amount.toLocaleString()} TND</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[var(--muted)]">Reference:</span>
                    <span className="font-medium">{selectedBill.reference}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[var(--muted)]">Due Date:</span>
                    <span className="font-medium">{new Date(selectedBill.dueDate).toLocaleDateString()}</span>
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <button className="btn btn-outline" onClick={() => setShowPaymentDialog(false)}>
                    Cancel
                  </button>
                  <button className="btn btn-primary" onClick={confirmPayment}>
                    Confirm Payment
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
