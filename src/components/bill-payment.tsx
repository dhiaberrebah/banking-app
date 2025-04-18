"use client"

import type React from "react"

import { useState } from "react"
import { Loader2 } from "lucide-react"

export function BillPayment() {
  const [isLoading, setIsLoading] = useState(false)
  const [successMessage, setSuccessMessage] = useState("")
  const [formData, setFormData] = useState({
    billType: "",
    provider: "",
    reference: "",
    amount: "",
    fromAccount: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
      setSuccessMessage(`Your payment of ${formData.amount} TND has been processed successfully.`)

      // Reset form after 3 seconds
      setTimeout(() => {
        setSuccessMessage("")
        setFormData({
          billType: "",
          provider: "",
          reference: "",
          amount: "",
          fromAccount: "",
        })
      }, 3000)
    }, 2000)
  }

  return (
    <div className="card">
      <div className="card-content pt-6">
        {successMessage && <div className="bg-green-100 text-green-800 p-3 rounded-md mb-4">{successMessage}</div>}
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <label htmlFor="billType" className="block text-sm font-medium">
                Bill Type
              </label>
              <select
                id="billType"
                name="billType"
                className="input"
                value={formData.billType}
                onChange={handleChange}
                required
              >
                <option value="" disabled>
                  Select bill type
                </option>
                <option value="utilities">Utilities</option>
                <option value="telecom">Telecommunications</option>
                <option value="insurance">Insurance</option>
                <option value="tax">Tax</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div className="space-y-2">
              <label htmlFor="provider" className="block text-sm font-medium">
                Service Provider
              </label>
              <select
                id="provider"
                name="provider"
                className="input"
                value={formData.provider}
                onChange={handleChange}
                required
              >
                <option value="" disabled>
                  Select provider
                </option>
                <option value="steg">STEG (Electricity & Gas)</option>
                <option value="sonede">SONEDE (Water)</option>
                <option value="ooredoo">Ooredoo</option>
                <option value="tunisie-telecom">Tunisie Telecom</option>
                <option value="orange">Orange Tunisia</option>
                <option value="topnet">Topnet</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div className="space-y-2">
              <label htmlFor="reference" className="block text-sm font-medium">
                Bill Reference
              </label>
              <input
                id="reference"
                name="reference"
                placeholder="Enter bill reference number"
                value={formData.reference}
                onChange={handleChange}
                required
                className="input"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="amount" className="block text-sm font-medium">
                Amount
              </label>
              <div className="relative">
                <input
                  id="amount"
                  name="amount"
                  type="number"
                  placeholder="Enter amount"
                  value={formData.amount}
                  onChange={handleChange}
                  required
                  className="input pr-12"
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <span className="text-[var(--muted)]">TND</span>
                </div>
              </div>
            </div>

            <div className="space-y-2 md:col-span-2">
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
              >
                <option value="" disabled>
                  Select source account
                </option>
                <option value="current">Current Account - 12,500.75 TND</option>
                <option value="savings">Savings Account - 5,250.50 TND</option>
              </select>
            </div>
          </div>

          <div className="mt-6 flex justify-end">
            <button type="submit" className="btn btn-primary" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Pay Bill
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
