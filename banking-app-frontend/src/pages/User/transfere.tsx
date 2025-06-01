"use client"

import { useState } from "react"
import { Layout } from "../../components/layout"
import { SimpleTransfer } from "../../components/simple-transfere"
import { BulkTransfer } from "../../components/bulk-transfere"
import { RecurringTransfer } from "../../components/recurring-transfere"

export default function Transfers() {
  const [activeTab, setActiveTab] = useState("simple")

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Transfer Money</h1>
          <div className="bg-blue-50 text-blue-700 px-4 py-2 rounded-full text-sm font-medium">
            Secure & Instant Transfers
          </div>
        </div>

        <div className="tabs">
          <div className="tabs-list grid w-full max-w-md grid-cols-3 rounded-lg overflow-hidden border border-gray-200">
            <button
              className={`tabs-trigger py-3 font-medium transition-all duration-200 hover:bg-blue-50 ${
                activeTab === "simple" 
                  ? "bg-primary text-white shadow-md" 
                  : "hover:text-blue-600 hover:scale-105"
              }`}
              onClick={() => setActiveTab("simple")}
            >
              Simple Transfer
            </button>
            <button
              className={`tabs-trigger py-3 font-medium transition-all duration-200 hover:bg-blue-50 ${
                activeTab === "bulk" 
                  ? "bg-primary text-white shadow-md" 
                  : "hover:text-blue-600 hover:scale-105"
              }`}
              onClick={() => setActiveTab("bulk")}
            >
              Bulk Transfers
            </button>
            <button
              className={`tabs-trigger py-3 font-medium transition-all duration-200 hover:bg-blue-50 ${
                activeTab === "recurring" 
                  ? "bg-primary text-white shadow-md" 
                  : "hover:text-blue-600 hover:scale-105"
              }`}
              onClick={() => setActiveTab("recurring")}
            >
              Recurring Transfers
            </button>
          </div>
          <div className="tabs-content animate-fade-in mt-6">
            {activeTab === "simple" && <SimpleTransfer />}
            {activeTab === "bulk" && <BulkTransfer />}
            {activeTab === "recurring" && <RecurringTransfer />}
          </div>
        </div>
      </div>
    </Layout>
  )
}
