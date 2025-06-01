import { useState } from "react"
import { Layout } from "../../components/layout"
import { LoanSimulator } from "../../components/loan-simulator"
import { LoanApplication } from "../../components/loan-application"
import { LoanStatus } from "../../components/loan-status"
import { Calculator, FileText, ClipboardCheck } from "lucide-react"

export default function Loans() {
  const [activeTab, setActiveTab] = useState("simulator")

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8 text-gray-800">Loan Services</h1>
        
        <div className="tabs">
          <div className="tabs-list grid grid-cols-3 gap-4 mb-8">
            <button
              className={`tabs-trigger flex flex-col items-center justify-center p-6 rounded-xl transition-all duration-200 ${
                activeTab === "simulator" 
                  ? "bg-blue-50 text-blue-700 shadow-md border border-blue-200" 
                  : "bg-white hover:bg-gray-50 border border-gray-200 hover:border-gray-300"
              }`}
              onClick={() => setActiveTab("simulator")}
            >
              <Calculator className="h-7 w-7 mb-3" />
              <span className="font-medium text-lg">Loan Simulator</span>
            </button>
            <button
              className={`tabs-trigger flex flex-col items-center justify-center p-6 rounded-xl transition-all duration-200 ${
                activeTab === "application" 
                  ? "bg-blue-50 text-blue-700 shadow-md border border-blue-200" 
                  : "bg-white hover:bg-gray-50 border border-gray-200 hover:border-gray-300"
              }`}
              onClick={() => setActiveTab("application")}
            >
              <FileText className="h-7 w-7 mb-3" />
              <span className="font-medium text-lg">Apply for Loan</span>
            </button>
            <button
              className={`tabs-trigger flex flex-col items-center justify-center p-6 rounded-xl transition-all duration-200 ${
                activeTab === "status" 
                  ? "bg-blue-50 text-blue-700 shadow-md border border-blue-200" 
                  : "bg-white hover:bg-gray-50 border border-gray-200 hover:border-gray-300"
              }`}
              onClick={() => setActiveTab("status")}
            >
              <ClipboardCheck className="h-7 w-7 mb-3" />
              <span className="font-medium text-lg">Application Status</span>
            </button>
          </div>
          <div className="tabs-content animate-slide-in">
            {activeTab === "simulator" && <LoanSimulator onApplyClick={() => setActiveTab("application")} />}
            {activeTab === "application" && <LoanApplication />}
            {activeTab === "status" && <LoanStatus />}
          </div>
        </div>
      </div>
    </Layout>
  )
}
