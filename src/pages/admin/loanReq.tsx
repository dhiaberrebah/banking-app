"use client"

import type React from "react"

import { useState, useEffect } from "react"
import {
  Search,
  Filter,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  FileText,
  DollarSign,
  Calendar,
  Loader2,
  Download,
  User,
  FileCheck,
  AlertCircle,
  Printer,
  BarChart4,
} from "lucide-react"
import axios from "axios"
import { toast } from "react-hot-toast"
import CustomModal from "../../components/ui/customModal"

interface LoanApplicant {
  id: string
  name: string
  email: string
  phone: string
}

interface LoanRequest {
  id: string
  loanType: string
  amount: number
  term: number
  status: string
  submittedDate: string
  applicant: LoanApplicant
  interestRate?: number
  currency?: string
  monthlyPayment?: number
  purpose?: string
  documents?: string[]
  rejectionReason?: string
  approvalDate?: string
  notes?: string
  applicationDetails?: any
  createdAt?: string // Added this property to fix the error
}

const LoanRequests = (): React.ReactElement => {
  const [loanRequests, setLoanRequests] = useState<LoanRequest[]>([])
  const [filteredRequests, setFilteredRequests] = useState<LoanRequest[]>([])
  const [selectedRequest, setSelectedRequest] = useState<LoanRequest | null>(null)
  const [showDetailsModal, setShowDetailsModal] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [statusUpdateData, setStatusUpdateData] = useState({
    status: "",
    rejectionReason: "",
  })
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false)
  const [showRejectionReasonInput, setShowRejectionReasonInput] = useState(false)

  // State for rejection modal
  const [showRejectionModal, setShowRejectionModal] = useState(false)
  const [rejectionReason, setRejectionReason] = useState("")
  const [selectedLoan, setSelectedLoan] = useState<LoanRequest | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)

  // Add these state variables for document viewing
  const [viewingDocument, setViewingDocument] = useState<string | null>(null)
  const [documentModalOpen, setDocumentModalOpen] = useState(false)

  // Function to handle loan rejection
  const handleRejectLoan = (loan: LoanRequest) => {
    setSelectedLoan(loan)
    setShowRejectionModal(true)
  }

  // Function to submit loan rejection
  const submitLoanRejection = async () => {
    if (!rejectionReason.trim()) {
      toast.error("Please provide a rejection reason")
      return
    }

    setIsProcessing(true)
    try {
      // Update this URL to match your actual backend API endpoint
      const response = await axios.patch(
        `http://localhost:5001/api/admin/loans/${selectedLoan?.id}/status`,
        {
          status: "rejected",
          rejectionReason: rejectionReason,
        },
        { withCredentials: true },
      )

      if (response.data.success) {
        toast.success("Loan application rejected successfully")

        // Update the loan list with new status
        setLoanRequests((prevRequests) =>
          prevRequests.map((req) => (req.id === selectedLoan?.id ? { ...req, status: "rejected" } : req)),
        )

        // Update filtered requests as well
        setFilteredRequests((prevRequests) =>
          prevRequests.map((req) => (req.id === selectedLoan?.id ? { ...req, status: "rejected" } : req)),
        )

        // Close modal and reset form
        setShowRejectionModal(false)
        setRejectionReason("")
        setSelectedLoan(null)
      }
    } catch (error) {
      console.error("Error rejecting loan:", error)
      toast.error("Failed to reject loan application")
    } finally {
      setIsProcessing(false)
    }
  }

  // Fetch loan requests from API
  useEffect(() => {
    const fetchLoanRequests = async () => {
      setIsLoading(true)
      setError(null)

      try {
        // Use the new admin endpoint
        const response = await axios.get("http://localhost:5001/api/admin/loans", {
          withCredentials: true,
        })

        if (response.data.success) {
          console.log("Loan data received:", response.data)

          // Map the backend data to match our frontend interface
          const formattedLoans = response.data.loans.map((loan: any) => ({
            id: loan.id || loan._id,
            loanType: loan.loanType,
            amount: loan.amount,
            term: loan.term,
            status: loan.status,
            submittedDate: loan.submittedDate || loan.createdAt,
            applicant: {
              id: loan.applicant?.id || "",
              name: loan.applicant?.name || "Unknown",
              email: loan.applicant?.email || "",
              phone: loan.applicant?.phone || "",
            },
          }))

          setLoanRequests(formattedLoans)
          setFilteredRequests(formattedLoans)
        } else {
          setError("Failed to fetch loan requests")
        }
      } catch (error) {
        console.error("Error fetching loan requests:", error)
        setError("Failed to fetch loan requests. Please check the server connection.")
      } finally {
        setIsLoading(false)
      }
    }

    fetchLoanRequests()
  }, [])

  // Filter loan requests based on search term and status filter
  useEffect(() => {
    let filtered = loanRequests

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (request) =>
          request.applicant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          request.applicant.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          request.id.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    // Apply status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((request) => request.status === statusFilter)
    }

    setFilteredRequests(filtered)
  }, [searchTerm, statusFilter, loanRequests])

  // View loan details
  const viewLoanDetails = async (loanId: string) => {
    setIsLoading(true)
    try {
      const response = await axios.get(`http://localhost:5001/api/admin/loans/${loanId}`, {
        withCredentials: true,
      })

      if (response.data.success) {
        const loanData = response.data.loan
        console.log("Received loan data:", loanData) // Add this for debugging

        // Create a properly formatted loan request object with safe defaults
        const formattedLoan: LoanRequest = {
          id: loanData._id || loanData.id,
          loanType: loanData.loanType || "Unknown",
          amount: loanData.amount || 0,
          term: loanData.term || 0,
          status: loanData.status || "pending",
          submittedDate: loanData.createdAt || new Date().toISOString(),
          interestRate: loanData.interestRate || 0,
          currency: loanData.currency || "TND",
          monthlyPayment: loanData.monthlyPayment || 0,
          purpose: loanData.applicationDetails?.purpose || loanData.purpose || "",
          documents: loanData.documents || [],
          rejectionReason: loanData.rejectionReason || "",
          approvalDate: loanData.approvalDate || "",
          notes: loanData.notes || "",
          applicationDetails: loanData.applicationDetails || {
            personal: {
              firstName: "",
              lastName: "",
              email: "",
              phone: "",
              address: "",
              city: "",
              postalCode: "",
            },
            employment: {
              status: "",
              employerName: "",
              monthlyIncome: 0,
              otherLoans: false,
              otherLoansAmount: 0,
            },
            purpose: "",
            additionalInfo: "",
          },
          applicant: {
            id: loanData.applicant?.id || loanData.userId?._id || loanData.userId || "",
            name:
              loanData.applicant?.name ||
              (loanData.userId
                ? `${loanData.userId.firstName || ""} ${loanData.userId.lastName || ""}`.trim() || "Unknown"
                : loanData.applicationDetails?.personal
                  ? `${loanData.applicationDetails.personal.firstName || ""} ${loanData.applicationDetails.personal.lastName || ""}`.trim() ||
                    "Unknown"
                  : "Unknown"),
            email:
              loanData.applicant?.email || loanData.userId?.email || loanData.applicationDetails?.personal?.email || "",
            phone:
              loanData.applicant?.phone ||
              loanData.userId?.phoneNumber ||
              loanData.applicationDetails?.personal?.phone ||
              "",
          },
        }

        setSelectedRequest(formattedLoan)
        setShowDetailsModal(true)
      } else {
        toast.error(response.data.message || "Failed to fetch loan details")
      }
    } catch (error) {
      console.error("Error fetching loan details:", error)
      toast.error("Failed to fetch loan details")
    } finally {
      setIsLoading(false)
    }
  }

  // Update loan status
  const updateLoanStatus = async (loanId: string, status: "approved" | "rejected") => {
    setIsUpdatingStatus(true)
    try {
      const payload = {
        status,
        rejectionReason: "",
      }

      // Update this URL to match your actual backend API endpoint
      const response = await axios.patch(`http://localhost:5001/api/admin/loans/${loanId}/status`, payload, {
        withCredentials: true,
      })

      if (response.data.success) {
        toast.success(`Loan ${status} successfully`)

        // Update the loan list with new status
        setLoanRequests((prevRequests) => prevRequests.map((req) => (req.id === loanId ? { ...req, status } : req)))

        // Update filtered requests as well
        setFilteredRequests((prevRequests) => prevRequests.map((req) => (req.id === loanId ? { ...req, status } : req)))

        // Reset the form
        setStatusUpdateData({
          status: "",
          rejectionReason: "",
        })
      }
    } catch (error) {
      console.error("Error updating loan status:", error)
      toast.error("Failed to update loan status")
    } finally {
      setIsUpdatingStatus(false)
    }
  }

  // Add this function to handle rejection with reason
  const submitRejection = async () => {
    if (!selectedRequest?.id) {
      toast.error("No loan selected for rejection")
      return
    }

    if (!statusUpdateData.rejectionReason) {
      toast.error("Please provide a reason for rejection")
      return
    }

    setIsUpdatingStatus(true)
    try {
      const payload = {
        status: "rejected",
        rejectionReason: statusUpdateData.rejectionReason,
      }

      const response = await axios.patch(
        `http://localhost:5001/api/admin/loans/${selectedRequest.id}/status`,
        payload,
        { withCredentials: true },
      )

      if (response.data.success) {
        toast.success("Loan rejected successfully")

        // Update the loan list with new status
        setLoanRequests((prevRequests) =>
          prevRequests.map((req) =>
            req.id === selectedRequest.id
              ? { ...req, status: "rejected", rejectionReason: statusUpdateData.rejectionReason }
              : req,
          ),
        )

        // Update filtered requests as well
        setFilteredRequests((prevRequests) =>
          prevRequests.map((req) =>
            req.id === selectedRequest.id
              ? { ...req, status: "rejected", rejectionReason: statusUpdateData.rejectionReason }
              : req,
          ),
        )

        // Reset and close
        setStatusUpdateData({
          status: "",
          rejectionReason: "",
        })
        setShowRejectionReasonInput(false)
      } else {
        toast.error(response.data.message || "Failed to reject loan")
      }
    } catch (error) {
      console.error("Error rejecting loan:", error)
      if (axios.isAxiosError(error)) {
        toast.error(`Error: ${error.response?.data?.message || "Failed to reject loan"}`)
      } else {
        toast.error("An unexpected error occurred")
      }
    } finally {
      setIsUpdatingStatus(false)
    }
  }

  // Helper function to format currency
  const formatCurrency = (amount: number, currency = "TND") => {
    return new Intl.NumberFormat("fr-TN", {
      style: "currency",
      currency: currency,
      minimumFractionDigits: 2,
    }).format(amount)
  }

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  // Status badge component
  const StatusBadge = ({ status }: { status: string }) => {
    let bgColor = "bg-gray-100"
    let textColor = "text-gray-800"
    let icon = <Clock className="h-4 w-4 mr-1" />

    if (status === "approved") {
      bgColor = "bg-green-100"
      textColor = "text-green-800"
      icon = <CheckCircle className="h-4 w-4 mr-1" />
    } else if (status === "rejected") {
      bgColor = "bg-red-100"
      textColor = "text-red-800"
      icon = <XCircle className="h-4 w-4 mr-1" />
    }

    return (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${bgColor} ${textColor}`}
      >
        {icon}
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    )
  }

  // Add this function to handle document viewing
  const handleViewDocument = (documentUrl: string) => {
    setViewingDocument(documentUrl)
    setDocumentModalOpen(true)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Loan Applications</h1>

      {/* Search and filter */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            placeholder="Search by name, email, or ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex items-center">
          <Filter className="h-5 w-5 text-gray-400 mr-2" />
          <select
            className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      {/* Error message */}
      {error && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <XCircle className="h-5 w-5 text-red-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Loading state */}
      {isLoading ? (
        <div className="text-center py-10">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-gray-300 border-t-blue-600"></div>
          <p className="mt-2 text-gray-500">Loading loan applications...</p>
        </div>
      ) : (
        <>
          {/* Loan requests table */}
          {filteredRequests.length > 0 ? (
            <div className="overflow-x-auto bg-white shadow rounded-lg">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Applicant
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Loan Details
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Status
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Submitted
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredRequests.map((request) => (
                    <tr key={request.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div>
                            <div className="text-sm font-medium text-gray-900">{request.applicant.name}</div>
                            <div className="text-sm text-gray-500">{request.applicant.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <DollarSign className="h-4 w-4 text-gray-400 mr-1" />
                          <span className="text-sm text-gray-900">
                            {formatCurrency(request.amount, request.currency)}
                          </span>
                        </div>
                        <div className="flex items-center mt-1">
                          <FileText className="h-4 w-4 text-gray-400 mr-1" />
                          <span className="text-sm text-gray-500">{request.loanType}</span>
                        </div>
                        <div className="flex items-center mt-1">
                          <Calendar className="h-4 w-4 text-gray-400 mr-1" />
                          <span className="text-sm text-gray-500">{request.term} </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <StatusBadge status={request.status} />
                      </td>
                      <td
                        className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"
                        title={formatDate(request.submittedDate)}
                      >
                        {formatDate(request.submittedDate)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center space-x-3">
                          <button
                            className="text-blue-600 hover:text-blue-900"
                            onClick={(e) => {
                              e.preventDefault()
                              e.stopPropagation()
                              viewLoanDetails(request.id)
                            }}
                            title="View Details"
                            type="button"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          {request.status === "pending" && (
                            <>
                              <button
                                className="text-green-600 hover:text-green-900"
                                onClick={() => updateLoanStatus(request.id, "approved")}
                                title="Approve Request"
                              >
                                <CheckCircle className="h-4 w-4" />
                              </button>
                              <button
                                className="text-red-600 hover:text-red-900"
                                onClick={() => handleRejectLoan(request)}
                                title="Reject Loan"
                              >
                                <XCircle className="h-4 w-4" />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="bg-white shadow rounded-lg p-6">
              <p className="text-gray-500">No loan applications found.</p>
            </div>
          )}
        </>
      )}

      {/* Rejection Reason Modal */}
      {showRejectionReasonInput && (
        <CustomModal
          isOpen={showRejectionReasonInput}
          onClose={() => {
            setShowRejectionReasonInput(false)
            setStatusUpdateData({
              status: "",
              rejectionReason: "",
            })
          }}
          title="Provide Rejection Reason"
          size="md"
        >
          <div className="p-6 space-y-4">
            <div className="bg-red-50 p-4 rounded-md border-l-4 border-red-500">
              <div className="flex">
                <AlertCircle className="h-5 w-5 text-red-500 mr-2 flex-shrink-0" />
                <p className="text-sm text-red-700">
                  You are about to reject this loan application. This action cannot be undone.
                </p>
              </div>
            </div>

            <p className="text-gray-600">Please provide a detailed reason for rejecting this loan application:</p>

            <textarea
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500"
              rows={4}
              value={statusUpdateData.rejectionReason}
              onChange={(e) => setStatusUpdateData({ ...statusUpdateData, rejectionReason: e.target.value })}
              placeholder="Enter rejection reason..."
            />

            <div className="flex justify-end space-x-3 pt-4">
              <button
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
                onClick={() => {
                  setShowRejectionReasonInput(false)
                  setStatusUpdateData({
                    status: "",
                    rejectionReason: "",
                  })
                }}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors flex items-center"
                onClick={submitRejection}
                disabled={isUpdatingStatus}
              >
                {isUpdatingStatus ? (
                  <>
                    <Loader2 className="animate-spin h-4 w-4 mr-2" />
                    Processing...
                  </>
                ) : (
                  "Reject Loan"
                )}
              </button>
            </div>
          </div>
        </CustomModal>
      )}

      {/* Rejection Modal */}
      {showRejectionModal && (
        <CustomModal
          isOpen={showRejectionModal}
          onClose={() => {
            setShowRejectionModal(false)
            setRejectionReason("")
          }}
          title="Reject Loan Application"
          size="md"
        >
          <div className="p-6 space-y-4">
            <div className="bg-red-50 p-4 rounded-md border-l-4 border-red-500">
              <div className="flex">
                <AlertCircle className="h-5 w-5 text-red-500 mr-2 flex-shrink-0" />
                <p className="text-sm text-red-700">
                  You are about to reject this loan application. This action cannot be undone.
                </p>
              </div>
            </div>

            <p className="text-gray-600">Please provide a detailed reason for rejecting this loan application:</p>

            <textarea
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500"
              rows={4}
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="Enter rejection reason..."
            />

            <div className="flex justify-end space-x-3 pt-4">
              <button
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
                onClick={() => {
                  setShowRejectionModal(false)
                  setRejectionReason("")
                }}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors flex items-center"
                onClick={submitLoanRejection}
                disabled={isProcessing}
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="animate-spin h-4 w-4 mr-2" />
                    Processing...
                  </>
                ) : (
                  "Reject Loan"
                )}
              </button>
            </div>
          </div>
        </CustomModal>
      )}

      {/* Enhanced Loan Details Modal */}
      {showDetailsModal && selectedRequest && (
        <CustomModal
          isOpen={showDetailsModal}
          onClose={() => setShowDetailsModal(false)}
          title="Loan Application Details"
          size="xl"
        >
          <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
            {/* Quick Actions */}
            <div className="flex flex-wrap gap-2 mb-6 justify-end">
              <button className="flex items-center px-3 py-1.5 bg-white text-gray-700 rounded-md border border-gray-200 text-sm hover:bg-gray-50 transition-colors">
                <Printer className="h-4 w-4 mr-2" />
                Print
              </button>
              <button className="flex items-center px-3 py-1.5 bg-white text-gray-700 rounded-md border border-gray-200 text-sm hover:bg-gray-50 transition-colors">
                <Download className="h-4 w-4 mr-2" />
                Export
              </button>
            </div>

            {/* Loan Summary Card */}
            <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                <div>
                  <div className="flex items-center">
                    <div className="bg-green-100 p-2 rounded-full mr-3">
                      <DollarSign className="h-5 w-5 text-green-600" />
                    </div>
                    <h2 className="text-xl font-bold">{selectedRequest.loanType} Loan</h2>
                    <div className="ml-3">
                      <StatusBadge status={selectedRequest.status} />
                    </div>
                  </div>
                  <div className="mt-3 text-3xl font-bold text-green-600">
                    {formatCurrency(selectedRequest.amount, selectedRequest.currency)}
                  </div>
                  <div className="mt-2 text-sm text-gray-500">
                    <span className="font-medium">Term:</span> {selectedRequest.term} months |
                    <span className="font-medium ml-2">Interest Rate:</span> {selectedRequest.interestRate || 5.5}% |
                    <span className="font-medium ml-2">Monthly Payment:</span>{" "}
                    {formatCurrency(selectedRequest.monthlyPayment || 0, selectedRequest.currency)}
                  </div>
                </div>
                <div className="mt-4 md:mt-0 flex flex-col items-end">
                  <div className="text-sm text-gray-500">Application ID</div>
                  <div className="font-mono text-gray-700">{selectedRequest.id}</div>
                  <div className="text-sm text-gray-500 mt-2">Submitted on</div>
                  <div className="font-medium">{formatDate(selectedRequest.submittedDate)}</div>
                </div>
              </div>
            </div>

            {/* Main Content - Two Column Layout */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left Column */}
              <div className="space-y-6">
                {/* Applicant Information */}
                <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                  <div className="flex items-center mb-4">
                    <div className="bg-green-100 p-2 rounded-full mr-3">
                      <User className="h-5 w-5 text-green-600" />
                    </div>
                    <h3 className="text-lg font-medium">Applicant Information</h3>
                  </div>
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-gray-500 uppercase">Name</p>
                        <p className="font-medium">{selectedRequest.applicant.name}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 uppercase">Email</p>
                        <p className="font-medium">{selectedRequest.applicant.email}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 uppercase">Phone</p>
                        <p className="font-medium">{selectedRequest.applicant.phone}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Loan Timeline */}
                <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                  <div className="flex items-center mb-4">
                    <div className="bg-green-100 p-2 rounded-full mr-3">
                      <BarChart4 className="h-5 w-5 text-green-600" />
                    </div>
                    <h3 className="text-lg font-medium">Loan Timeline</h3>
                  </div>
                  <div className="relative pl-8 space-y-6">
                    {/* Timeline line */}
                    <div className="absolute h-full w-0.5 bg-green-100 left-2 top-0"></div>

                    {/* Submitted step */}
                    <div className="relative">
                      <div className="absolute -left-6 mt-1">
                        <div className="bg-green-500 rounded-full h-4 w-4 border-4 border-green-50"></div>
                      </div>
                      <div className="flex items-center mb-1">
                        <Calendar className="h-4 w-4 text-green-600 mr-2" />
                        <div className="font-medium">Application Submitted</div>
                      </div>
                      <div className="text-sm text-gray-600">{formatDate(selectedRequest.submittedDate)}</div>
                    </div>

                    {/* Status step */}
                    <div className="relative">
                      <div className="absolute -left-6 mt-1">
                        <div
                          className={`rounded-full h-4 w-4 border-4 border-green-50 ${
                            selectedRequest.status === "approved"
                              ? "bg-green-500"
                              : selectedRequest.status === "rejected"
                                ? "bg-red-500"
                                : "bg-yellow-500"
                          }`}
                        ></div>
                      </div>
                      <div className="flex items-center mb-1">
                        {selectedRequest.status === "approved" ? (
                          <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                        ) : selectedRequest.status === "rejected" ? (
                          <XCircle className="h-4 w-4 text-red-600 mr-2" />
                        ) : (
                          <Clock className="h-4 w-4 text-yellow-600 mr-2" />
                        )}
                        <div className="font-medium">
                          {selectedRequest.status === "approved"
                            ? "Loan Approved"
                            : selectedRequest.status === "rejected"
                              ? "Loan Rejected"
                              : "Pending Review"}
                        </div>
                      </div>
                      <div className="text-sm text-gray-600">
                        {selectedRequest.status === "approved" && selectedRequest.approvalDate
                          ? formatDate(selectedRequest.approvalDate)
                          : selectedRequest.status === "rejected"
                            ? "See rejection reason below"
                            : "Awaiting decision"}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-6">
                {/* Purpose */}
                {selectedRequest.purpose && (
                  <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                    <div className="flex items-center mb-4">
                      <div className="bg-green-100 p-2 rounded-full mr-3">
                        <FileText className="h-5 w-5 text-green-600" />
                      </div>
                      <h3 className="text-lg font-medium">Loan Purpose</h3>
                    </div>
                    <p className="text-gray-700">{selectedRequest.purpose}</p>
                  </div>
                )}

                {/* Documents */}
                <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                  <div className="flex items-center mb-4">
                    <div className="bg-green-100 p-2 rounded-full mr-3">
                      <FileCheck className="h-5 w-5 text-green-600" />
                    </div>
                    <h3 className="text-lg font-medium">Documents</h3>
                  </div>
                  {selectedRequest.documents &&
                    (Array.isArray(selectedRequest.documents) && selectedRequest.documents.length > 0 ? (
                      <ul className="divide-y divide-gray-200">
                        {selectedRequest.documents.map((doc: string, index: number) => (
                          <li key={index} className="py-3 flex justify-between items-center">
                            <div className="flex items-center">
                              <FileText className="h-4 w-4 text-green-500 mr-2" />
                              <span className="text-gray-700">
                                {typeof doc === "object" && doc !== null && "name" in doc
                                  ? (doc as { name: string }).name
                                  : `Document ${index + 1}`}
                              </span>
                            </div>
                            <button
                              className="text-green-600 hover:text-green-800 flex items-center text-sm bg-green-50 px-3 py-1 rounded-md"
                              onClick={() => handleViewDocument(doc)}
                            >
                              <Eye className="h-4 w-4 mr-1" />
                              View
                            </button>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-gray-500 italic">No documents attached</p>
                    ))}
                </div>

                {/* Status Information */}
                <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                  <div className="flex items-center mb-4">
                    <div className="bg-green-100 p-2 rounded-full mr-3">
                      <Clock className="h-5 w-5 text-green-600" />
                    </div>
                    <h3 className="text-lg font-medium">Status Information</h3>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <p className="text-xs text-gray-500 uppercase">Current Status</p>
                      <div className="flex items-center mt-1">
                        {selectedRequest.status === "pending" && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                            <Clock className="h-3 w-3 mr-1" /> Pending
                          </span>
                        )}
                        {selectedRequest.status === "approved" && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            <CheckCircle className="h-3 w-3 mr-1" /> Approved
                          </span>
                        )}
                        {selectedRequest.status === "rejected" && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                            <XCircle className="h-3 w-3 mr-1" /> Rejected
                          </span>
                        )}
                      </div>
                    </div>
                    
                    {selectedRequest.status === "rejected" && selectedRequest.rejectionReason && (
                      <div>
                        <p className="text-xs text-gray-500 uppercase">Rejection Reason</p>
                        <div className="mt-1 p-3 bg-red-50 border border-red-100 rounded-md">
                          <p className="text-sm text-red-700">{selectedRequest.rejectionReason}</p>
                        </div>
                      </div>
                    )}
                    
                    {selectedRequest.status === "approved" && selectedRequest.approvalDate && (
                      <div>
                        <p className="text-xs text-gray-500 uppercase">Approval Date</p>
                        <p className="font-medium">{formatDate(selectedRequest.approvalDate)}</p>
                      </div>
                    )}
                    
                    <div>
                      <p className="text-xs text-gray-500 uppercase">Submission Date</p>
                      <p className="font-medium">{formatDate(selectedRequest.submittedDate)}</p>
                    </div>
                  </div>
                </div>

                {/* Notes */}
                {selectedRequest.notes && (
                  <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                    <div className="flex items-center mb-4">
                      <div className="bg-green-100 p-2 rounded-full mr-3">
                        <FileText className="h-5 w-5 text-green-600" />
                      </div>
                      <h3 className="text-lg font-medium">Notes</h3>
                    </div>
                    <p className="text-gray-700">{selectedRequest.notes}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
              {selectedRequest.status === "pending" && (
                <>
                  <button
                    onClick={() => updateLoanStatus(selectedRequest.id, "approved")}
                    disabled={isUpdatingStatus}
                    className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 flex items-center"
                  >
                    {isUpdatingStatus ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <CheckCircle className="h-4 w-4 mr-2" />
                    )}
                    Approve
                  </button>
                  <button
                    onClick={() => handleRejectLoan(selectedRequest)}
                    disabled={isUpdatingStatus}
                    className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50 flex items-center"
                  >
                    {isUpdatingStatus ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <XCircle className="h-4 w-4 mr-2" />
                    )}
                    Reject
                  </button>
                </>
              )}
              <button
                onClick={() => setShowDetailsModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Close
              </button>
            </div>
          </div>
        </CustomModal>
      )}

      {/* Document Viewer Modal */}
      {documentModalOpen && viewingDocument && (
        <CustomModal
          isOpen={documentModalOpen}
          onClose={() => {
            setDocumentModalOpen(false)
            setViewingDocument(null)
          }}
          title="Document Viewer"
          size="full"
        >
          <div className="p-6 flex flex-col items-center bg-gray-50 rounded-lg">
            <div className="w-full bg-white rounded-lg shadow-sm overflow-hidden mb-4">
              {viewingDocument.match(/\.(jpeg|jpg|gif|png)$/i) ? (
                <img
                  src={viewingDocument || "/placeholder.svg"}
                  alt="Document"
                  className="max-w-full max-h-[75vh] object-contain mx-auto"
                />
              ) : viewingDocument.match(/\.(pdf)$/i) ? (
                <iframe src={viewingDocument} title="PDF Document" className="w-full h-[75vh]" />
              ) : (
                <div className="p-8 text-center">
                  <FileText className="h-20 w-20 mx-auto text-green-500 mb-4" />
                  <p className="text-lg">This document type cannot be previewed.</p>
                  <a
                    href={viewingDocument}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-6 inline-block px-6 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                  >
                    Open Document
                  </a>
                </div>
              )}
            </div>
            <div className="mt-4 w-full flex justify-end">
              <a
                href={viewingDocument}
                download
                className="px-6 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors flex items-center"
              >
                <Download className="h-5 w-5 mr-2" /> Download Document
              </a>
            </div>
          </div>
        </CustomModal>
      )}
    </div>
  )
}

export default LoanRequests
