"use client"

import { useState, useEffect } from "react"
import { Search, Eye, Download, Loader2, FileText, Clock } from "lucide-react"
import axios from "axios"

type LoanApplication = {
  id: string;
  loanType: string;
  amount: number;
  term: number;
  interestRate: number;
  status: string;
  createdAt: string;
  documents?: string[];
  notes?: Array<{ date: string; text: string; }>;
}

type LoanDetails = {
  id: string;
  loanType: string;
  amount: number;
  term: number;
  interestRate: number;
  status: string;
  applicationDetails?: any;
  documents: string[];
  notes: Array<{ date: string; text: string; }>;
  createdAt: string;
  updatedAt: string;
}

type LoanStatusProps = {
  showDetails?: boolean;
  selectedApplication?: LoanDetails | null;
  isLoading?: boolean;
  setShowDetails?: (show: boolean) => void;
  getStatusColor?: (status: string) => string;
  formatDate?: (dateString: string) => string;
}

export function LoanStatus({ 
  showDetails: propShowDetails, 
  selectedApplication: propSelectedApplication,
  isLoading: propIsLoading,
  setShowDetails: propSetShowDetails,
  getStatusColor: propGetStatusColor,
  formatDate: propFormatDate
}: LoanStatusProps = {}) {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedApplication, setSelectedApplication] = useState<LoanDetails | null>(propSelectedApplication || null)
  const [showDetails, setShowDetails] = useState(propShowDetails || false)
  const [activeTab, setActiveTab] = useState("details")
  const [isLoading, setIsLoading] = useState(propIsLoading || false)
  const [loanApplications, setLoanApplications] = useState<LoanApplication[]>([])
  const [error, setError] = useState("")

  // Use the provided functions if available, otherwise use the component's own implementations
  const formatDateFn = propFormatDate || ((dateString: string) => {
    return new Date(dateString).toLocaleDateString()
  })

  const getStatusColorFn = propGetStatusColor || ((status: string) => {
    switch (status.toLowerCase()) {
      case "approved":
        return "badge-success"
      case "in review":
      case "pending":
        return "badge badge-outline bg-blue-100 text-blue-800 border-blue-200"
      case "rejected":
        return "badge badge-danger"
      default:
        return "badge badge-outline"
    }
  })

  // Update local state when props change
  useEffect(() => {
    if (propSelectedApplication) {
      setSelectedApplication(propSelectedApplication)
    }
    if (propShowDetails !== undefined) {
      setShowDetails(propShowDetails)
    }
    if (propIsLoading !== undefined) {
      setIsLoading(propIsLoading)
    }
  }, [propSelectedApplication, propShowDetails, propIsLoading])

  // Use the provided setShowDetails function if available
  const handleCloseDetails = () => {
    if (propSetShowDetails) {
      propSetShowDetails(false)
    } else {
      setShowDetails(false)
    }
  }

  useEffect(() => {
    fetchLoanApplications()
  }, [])

  const fetchLoanApplications = async () => {
    setIsLoading(true)
    try {
      const response = await axios.get("http://localhost:5001/api/users/loans", {
        withCredentials: true
      })
      
      if (response.data.success) {
        setLoanApplications(response.data.loans || [])
      } else {
        setError(response.data.message || "Failed to fetch loan applications")
      }
    } catch (error) {
      console.error("Error fetching loan applications:", error)
      setError("An error occurred while fetching your loan applications")
    } finally {
      setIsLoading(false)
    }
  }

  const fetchLoanDetails = async (loanId: string) => {
    setIsLoading(true)
    try {
      const response = await axios.get(`http://localhost:5001/api/users/loans/${loanId}`, {
        withCredentials: true
      })
      
      if (response.data.success) {
        // Transform backend data to match the expected format for display
        const loanDetails = response.data.loan
        
        // Create notes array from the notes string
        const notesArray = loanDetails.notes ? [
          { date: loanDetails.createdAt, text: loanDetails.notes }
        ] : []
        
        setSelectedApplication({
          ...loanDetails,
          documents: loanDetails.documents || [],
          notes: notesArray
        })
        setShowDetails(true)
      } else {
        console.error("Failed to fetch loan details:", response.data.message)
      }
    } catch (error) {
      console.error("Error fetching loan details:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const viewApplication = (application: LoanApplication) => {
    fetchLoanDetails(application.id)
  }

  const filteredApplications = loanApplications.filter(
    (app) =>
      app.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.loanType.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.status.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "approved":
        return "badge-success"
      case "in review":
      case "pending":
        return "badge badge-outline bg-blue-100 text-blue-800 border-blue-200"
      case "rejected":
        return "badge badge-danger"
      default:
        return "badge badge-outline"
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString()
  }

  return (
    <div className="card bg-white shadow-lg rounded-xl border border-gray-100">
      <div className="card-content p-6">
        <div className="mb-6 flex items-center justify-between">
          <h3 className="text-xl font-semibold text-gray-800">Loan Applications</h3>
          <div className="relative w-64">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <input
              placeholder="Search applications..."
              className="w-full p-2 pl-10 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {isLoading && !showDetails ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-[var(--primary)]" />
          </div>
        ) : error ? (
          <div className="rounded-md bg-red-50 p-4 text-red-800">
            {error}
          </div>
        ) : (
          <div className="rounded-md border overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="px-4 py-3 text-left text-sm font-medium">Application ID</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">Loan Type</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">Amount</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">Term (Years)</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">Application Date</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">Status</th>
                  <th className="px-4 py-3 text-right text-sm font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredApplications.length > 0 ? (
                  filteredApplications.map((application) => (
                    <tr key={application.id} className="border-b hover:bg-[var(--muted-background)]">
                      <td className="px-4 py-3 text-sm">{application.id}</td>
                      <td className="px-4 py-3 text-sm">{application.loanType}</td>
                      <td className="px-4 py-3 text-sm">{application.amount.toLocaleString()} TND</td>
                      <td className="px-4 py-3 text-sm">{application.term}</td>
                      <td className="px-4 py-3 text-sm">{formatDate(application.createdAt)}</td>
                      <td className="px-4 py-3 text-sm">
                        <span className={`badge ${getStatusColor(application.status)}`}>{application.status}</span>
                      </td>
                      <td className="px-4 py-3 text-sm text-right">
                        <button className="btn btn-outline btn-sm btn-icon" onClick={() => viewApplication(application)}>
                          <Eye className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="text-center py-4 text-[var(--muted)]">
                      No applications found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {showDetails && selectedApplication && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fadeIn">
            <div className="card w-full max-w-3xl bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden animate-scaleIn">
              {isLoading ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
                </div>
              ) : (
                <>
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 border-b border-gray-200">
                    <div className="flex justify-between items-center">
                      <div>
                        <h2 className="text-2xl font-bold text-gray-800">Loan Application Details</h2>
                        <p className="text-sm text-gray-600 mt-1">Complete information about this loan application</p>
                      </div>
                      <span className={`badge ${getStatusColor(selectedApplication.status)} px-4 py-2 rounded-full text-sm font-medium`}>
                        {selectedApplication.status}
                      </span>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="tabs">
                      <div className="tabs-list flex space-x-2 border-b border-gray-200 mb-6">
                        <button
                          className={`px-4 py-2 font-medium text-sm rounded-t-lg transition-all duration-200 ${
                            activeTab === "details" 
                              ? "text-blue-600 border-b-2 border-blue-500" 
                              : "text-gray-600 hover:text-gray-800 hover:bg-gray-50"
                          }`}
                          onClick={() => setActiveTab("details")}
                        >
                          Application Details
                        </button>
                        <button
                          className={`px-4 py-2 font-medium text-sm rounded-t-lg transition-all duration-200 ${
                            activeTab === "documents" 
                              ? "text-blue-600 border-b-2 border-blue-500" 
                              : "text-gray-600 hover:text-gray-800 hover:bg-gray-50"
                          }`}
                          onClick={() => setActiveTab("documents")}
                        >
                          Documents
                        </button>
                        <button
                          className={`px-4 py-2 font-medium text-sm rounded-t-lg transition-all duration-200 ${
                            activeTab === "timeline" 
                              ? "text-blue-600 border-b-2 border-blue-500" 
                              : "text-gray-600 hover:text-gray-800 hover:bg-gray-50"
                          }`}
                          onClick={() => setActiveTab("timeline")}
                        >
                          Timeline
                        </button>
                      </div>
                      <div className="tabs-content py-2">
                        {activeTab === "details" && (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="bg-gray-50 p-4 rounded-lg">
                              <h3 className="text-sm font-medium text-gray-500 mb-3">Loan Information</h3>
                              <div className="space-y-3">
                                <div className="flex justify-between">
                                  <span className="text-gray-600">Application ID:</span>
                                  <span className="font-medium text-gray-900">{selectedApplication.id}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-600">Loan Type:</span>
                                  <span className="font-medium text-gray-900">{selectedApplication.loanType}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-600">Amount:</span>
                                  <span className="font-medium text-gray-900">{selectedApplication.amount.toLocaleString()} TND</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-600">Term:</span>
                                  <span className="font-medium text-gray-900">{selectedApplication.term} years</span>
                                </div>
                              </div>
                            </div>
                            <div className="bg-gray-50 p-4 rounded-lg">
                              <h3 className="text-sm font-medium text-gray-500 mb-3">Financial Details</h3>
                              <div className="space-y-3">
                                <div className="flex justify-between">
                                  <span className="text-gray-600">Interest Rate:</span>
                                  <span className="font-medium text-gray-900">{selectedApplication.interestRate}%</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-600">Monthly Payment:</span>
                                  <span className="font-medium text-gray-900">
                                    {((selectedApplication.amount * (selectedApplication.interestRate/100/12) * 
                                    Math.pow(1 + (selectedApplication.interestRate/100/12), selectedApplication.term*12)) / 
                                    (Math.pow(1 + (selectedApplication.interestRate/100/12), selectedApplication.term*12) - 1)).toFixed(2)} TND
                                  </span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-600">Application Date:</span>
                                  <span className="font-medium text-gray-900">{formatDate(selectedApplication.createdAt)}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                        {activeTab === "documents" && (
                          <div className="space-y-4">
                            {selectedApplication.documents && selectedApplication.documents.length > 0 ? (
                              selectedApplication.documents.map((doc, index) => (
                                <div key={index} className="flex items-center justify-between rounded-md border p-4 hover:bg-gray-50 transition-colors">
                                  <div className="flex items-center">
                                    <div className="bg-blue-100 p-2 rounded-md mr-3">
                                      <FileText className="h-5 w-5 text-blue-600" />
                                    </div>
                                    <span className="font-medium text-gray-700">{doc}</span>
                                  </div>
                                  <button className="btn btn-outline btn-sm flex items-center text-blue-600 hover:bg-blue-50 px-3 py-1 rounded-md border border-blue-200">
                                    <Download className="mr-2 h-4 w-4" />
                                    Download
                                  </button>
                                </div>
                              ))
                            ) : (
                              <div className="text-center py-8 bg-gray-50 rounded-lg">
                                <div className="mx-auto w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center mb-3">
                                  <FileText className="h-6 w-6 text-gray-400" />
                                </div>
                                <p className="text-gray-500 font-medium">No documents available</p>
                                <p className="text-gray-400 text-sm mt-1">Documents related to your application will appear here</p>
                              </div>
                            )}
                          </div>
                        )}
                        {activeTab === "timeline" && (
                          <div className="space-y-4 relative">
                            {selectedApplication.notes && selectedApplication.notes.length > 0 ? (
                              <>
                                <div className="absolute left-3 top-0 bottom-0 w-0.5 bg-gray-200"></div>
                                {selectedApplication.notes.map((note: { date: string; text: string }, index: number) => (
                                  <div
                                    key={index}
                                    className="relative pl-8 pb-5"
                                  >
                                    <div className="absolute left-0 top-1.5 h-4 w-4 rounded-full bg-blue-500 border-2 border-white shadow-sm z-10"></div>
                                    <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                                      <div className="text-sm font-medium text-blue-600 mb-1">{formatDate(note.date)}</div>
                                      <div className="text-gray-700">{note.text}</div>
                                    </div>
                                  </div>
                                ))}
                              </>
                            ) : (
                              <div className="text-center py-8 bg-gray-50 rounded-lg">
                                <div className="mx-auto w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center mb-3">
                                  <Clock className="h-6 w-6 text-gray-400" />
                                </div>
                                <p className="text-gray-500 font-medium">No timeline events available</p>
                                <p className="text-gray-400 text-sm mt-1">Updates about your application will appear here</p>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                      <div className="flex justify-end mt-6 pt-4 border-t border-gray-200">
                        <button 
                          className="btn btn-primary bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors"
                          onClick={handleCloseDetails}
                        >
                          Close
                        </button>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
