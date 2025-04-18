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
  X,
  Download,
} from "lucide-react"
import axios from "axios"
import { toast } from "react-hot-toast"

// Simple Custom Modal Component
interface CustomModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  children: React.ReactNode
  className?: string
}

const CustomModal: React.FC<CustomModalProps> = ({ isOpen, onClose, title, children, className = "" }) => {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div className="absolute inset-0 bg-gray-500 opacity-75" onClick={onClose}></div>
        </div>
        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
          &#8203;
        </span>
        <div
          className={`inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg w-full ${className}`}
        >
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="sm:flex sm:items-start">
              <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">{title}</h3>
                  <button
                    onClick={onClose}
                    className="text-gray-400 hover:text-gray-500 focus:outline-none"
                    aria-label="Close"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
                {children}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

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
  purpose?: string
  currency?: string
  interestRate?: number
  monthlyPayment?: number
  documents?: string[] | {
    idDocument?: string
    proofOfIncome?: string
    bankStatements?: string
  }
  rejectionReason?: string
  approvalDate?: string
  notes?: string
  applicationDetails?: {
    personal?: {
      firstName?: string
      lastName?: string
      email?: string
      phone?: string
      address?: string
      city?: string
      postalCode?: string
    }
    employment?: {
      status?: string
      employerName?: string
      monthlyIncome?: number
      otherLoans?: boolean
      otherLoansAmount?: number
    }
    purpose?: string
    additionalInfo?: string
  }
  createdAt?: string
  updatedAt?: string
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

  // Add these state variables at the top of your component
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
        // Update the loan in the list
        setLoanRequests((prevLoans) =>
          prevLoans.map((loan) => (loan.id === selectedLoan?.id ? { ...loan, status: "rejected" } : loan)),
        )
        setShowRejectionModal(false)
        setRejectionReason("")
      } else {
        toast.error(response.data.message || "Failed to reject loan")
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
        const response = await axios.get("http://localhost:5001/api/admin/loans", {
          withCredentials: true,
        })

        if (response.data.success) {
          // Map the backend data to match our frontend interface
          const formattedLoans = response.data.loans.map((loan: any) => ({
            id: loan._id || loan.id,
            loanType: loan.loanType,
            amount: loan.amount,
            term: loan.term,
            status: loan.status,
            submittedDate: loan.createdAt,
            interestRate: loan.interestRate,
            currency: loan.currency || "TND",
            monthlyPayment: loan.monthlyPayment,
            purpose: loan.applicationDetails?.purpose || loan.purpose,
            documents: loan.documents,
            rejectionReason: loan.rejectionReason,
            approvalDate: loan.approvalDate,
            notes: loan.notes,
            applicationDetails: loan.applicationDetails,
            createdAt: loan.createdAt,
            updatedAt: loan.updatedAt,
            applicant: {
              id: loan.userId?._id || loan.userId,
              name: loan.userId ? 
                `${loan.userId.firstName || ''} ${loan.userId.lastName || ''}` : 
                (loan.applicationDetails?.personal ? 
                  `${loan.applicationDetails.personal.firstName || ''} ${loan.applicationDetails.personal.lastName || ''}` : 
                  'Unknown'),
              email: loan.userId?.email || loan.applicationDetails?.personal?.email || '',
              phone: loan.userId?.phoneNumber || loan.applicationDetails?.personal?.phone || '',
            }
          }))
          
          setLoanRequests(formattedLoans)
          setFilteredRequests(formattedLoans)
        } else {
          setError("Failed to fetch loan requests")
        }
      } catch (error) {
        console.error("Error fetching loan requests:", error)
        setError("An error occurred while fetching loan requests")
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
              postalCode: ""
            },
            employment: {
              status: "",
              employerName: "",
              monthlyIncome: 0,
              otherLoans: false,
              otherLoansAmount: 0
            },
            purpose: "",
            additionalInfo: ""
          },
          createdAt: loanData.createdAt || new Date().toISOString(),
          updatedAt: loanData.updatedAt || new Date().toISOString(),
          applicant: {
            id: loanData.applicant?.id || loanData.userId?._id || loanData.userId || "",
            name: loanData.applicant?.name || 
              (loanData.userId ? 
                `${loanData.userId.firstName || ''} ${loanData.userId.lastName || ''}`.trim() || 'Unknown' : 
                (loanData.applicationDetails?.personal ? 
                  `${loanData.applicationDetails.personal.firstName || ''} ${loanData.applicationDetails.personal.lastName || ''}`.trim() || 'Unknown' : 
                  'Unknown')),
            email: loanData.applicant?.email || loanData.userId?.email || loanData.applicationDetails?.personal?.email || "",
            phone: loanData.applicant?.phone || loanData.userId?.phoneNumber || loanData.applicationDetails?.personal?.phone || "",
          }
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
    if (!loanId) {
      toast.error("No loan ID provided for update")
      return
    }

    // For rejection, we need to prompt for a reason
    if (status === "rejected") {
      setSelectedRequest((prevRequest) => (prevRequest ? { ...prevRequest, id: loanId } : null))
      setShowRejectionReasonInput(true)
      return
    }

    setIsUpdatingStatus(true)
    try {
      const payload = {
        status,
        rejectionReason: "",
      }

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

      if (axios.isAxiosError(error)) {
        toast.error(`Error: ${error.response?.data?.message || "Failed to update loan status"}`)
      } else {
        toast.error("An unexpected error occurred")
      }
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

  // Format currency
  const formatCurrency = (amount: number, currency = "TND") => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
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
                          <span className="text-sm text-gray-500">{request.term} months</span>
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
        >
          <textarea
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 mt-2"
            rows={4}
            value={statusUpdateData.rejectionReason}
            onChange={(e) => setStatusUpdateData({ ...statusUpdateData, rejectionReason: e.target.value })}
            placeholder="Please provide a reason for rejecting this loan application"
          />
          <div className="mt-4 flex justify-end space-x-3">
            <button
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
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
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              onClick={submitRejection}
              disabled={isUpdatingStatus}
            >
              {isUpdatingStatus ? (
                <span className="flex items-center">
                  <Loader2 className="animate-spin h-4 w-4 mr-2" />
                  Rejecting...
                </span>
              ) : (
                "Reject Loan"
              )}
            </button>
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
        >
          <p className="mb-4 text-sm text-gray-600">Please provide a reason for rejecting this loan application.</p>
          <textarea
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 mt-2"
            rows={4}
            value={rejectionReason}
            onChange={(e) => setRejectionReason(e.target.value)}
            placeholder="Enter rejection reason..."
          />
          <div className="mt-4 flex justify-end space-x-3">
            <button
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
              onClick={() => {
                setShowRejectionModal(false)
                setRejectionReason("")
              }}
            >
              Cancel
            </button>
            <button
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 flex items-center"
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
        </CustomModal>
      )}

      {/* Loan Details Modal */}
      {showDetailsModal && selectedRequest && (
        <CustomModal
          isOpen={showDetailsModal}
          onClose={() => setShowDetailsModal(false)}
          title="Loan Application Details"
          className="sm:max-w-4xl"
        >
          <div className="space-y-6 max-h-[80vh] overflow-y-auto">
            {/* Loan Summary */}
            <div className="bg-green-600 text-white p-4 rounded-lg">
              <div className="flex flex-col md:flex-row justify-between">
                <div>
                  <h3 className="text-xl font-bold">{selectedRequest.loanType} Loan</h3>
                  <p className="text-2xl font-bold mt-2">
                    {formatCurrency(selectedRequest.amount, selectedRequest.currency)}
                  </p>
                </div>
                <div className="mt-4 md:mt-0">
                  <StatusBadge status={selectedRequest.status} />
                </div>
              </div>
            </div>

            {/* Applicant Information */}
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <h3 className="text-lg font-medium mb-3">Applicant Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Name</p>
                  <p className="font-medium">
                    {selectedRequest.applicant?.name && selectedRequest.applicant.name !== 'Unknown' 
                      ? selectedRequest.applicant.name 
                      : (selectedRequest.applicationDetails?.personal?.firstName && selectedRequest.applicationDetails?.personal?.lastName
                          ? `${selectedRequest.applicationDetails.personal.firstName} ${selectedRequest.applicationDetails.personal.lastName}`
                          : 'N/A')}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-medium">
                    {selectedRequest.applicationDetails?.personal?.email || selectedRequest.applicant?.email || 'N/A'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Phone</p>
                  <p className="font-medium">
                    {selectedRequest.applicationDetails?.personal?.phone || selectedRequest.applicant?.phone || 'N/A'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Address</p>
                  <p className="font-medium">{selectedRequest.applicationDetails?.personal?.address || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">City</p>
                  <p className="font-medium">{selectedRequest.applicationDetails?.personal?.city || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Postal Code</p>
                  <p className="font-medium">{selectedRequest.applicationDetails?.personal?.postalCode || 'N/A'}</p>
                </div>
              </div>
            </div>

            {/* Employment Information */}
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <h3 className="text-lg font-medium mb-3">Employment Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Employment Status</p>
                  <p className="font-medium">{selectedRequest.applicationDetails?.employment?.status || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Employer Name</p>
                  <p className="font-medium">{selectedRequest.applicationDetails?.employment?.employerName || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Monthly Income</p>
                  <p className="font-medium">
                    {selectedRequest.applicationDetails?.employment?.monthlyIncome 
                      ? formatCurrency(selectedRequest.applicationDetails.employment.monthlyIncome, selectedRequest.currency) 
                      : 'N/A'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Other Loans</p>
                  <p className="font-medium">
                    {selectedRequest.applicationDetails?.employment?.otherLoans === true ? 'Yes' : 
                     selectedRequest.applicationDetails?.employment?.otherLoans === false ? 'No' : 'N/A'}
                  </p>
                </div>
                {selectedRequest.applicationDetails?.employment?.otherLoans && (
                  <div>
                    <p className="text-sm text-gray-500">Other Loans Amount</p>
                    <p className="font-medium">
                      {selectedRequest.applicationDetails?.employment?.otherLoansAmount 
                        ? formatCurrency(selectedRequest.applicationDetails.employment.otherLoansAmount, selectedRequest.currency)
                        : 'N/A'}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Loan Details */}
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <h3 className="text-lg font-medium mb-3">Loan Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Loan Type</p>
                  <p className="font-medium">{selectedRequest.loanType}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Amount</p>
                  <p className="font-medium">{formatCurrency(selectedRequest.amount, selectedRequest.currency)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Term</p>
                  <p className="font-medium">{selectedRequest.term} months</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Interest Rate</p>
                  <p className="font-medium">{selectedRequest.interestRate}%</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Status</p>
                  <StatusBadge status={selectedRequest.status} />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Submitted Date</p>
                  <p className="font-medium">{formatDate(selectedRequest.submittedDate)}</p>
                </div>
                {selectedRequest.approvalDate && (
                  <div>
                    <p className="text-sm text-gray-500">Approval Date</p>
                    <p className="font-medium">{formatDate(selectedRequest.approvalDate)}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Loan Purpose */}
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <h3 className="text-lg font-medium mb-3">Loan Purpose</h3>
              <p>{selectedRequest.applicationDetails?.purpose || selectedRequest.purpose || 'Not specified'}</p>
            </div>

            {/* Additional Information */}
            {selectedRequest.applicationDetails?.additionalInfo && (
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <h3 className="text-lg font-medium mb-3">Additional Information</h3>
                <p>{selectedRequest.applicationDetails.additionalInfo}</p>
              </div>
            )}

            {/* Documents */}
            {selectedRequest.documents && Array.isArray(selectedRequest.documents) && selectedRequest.documents.length > 0 && (
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <h3 className="text-lg font-medium mb-3">Submitted Documents</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Array.isArray(selectedRequest.documents) ? selectedRequest.documents.map((doc: string, index: number) => (
                    <div key={index} className="border border-gray-200 rounded p-3">
                      <p className="font-medium">Document {index + 1}</p>
                      <button 
                        className="mt-2 text-blue-600 flex items-center text-sm hover:text-blue-800"
                        onClick={() => handleViewDocument(doc)}
                      >
                        <Eye className="h-4 w-4 mr-1" /> View Document
                      </button>
                    </div>
                  )) : null}
                </div>
              </div>
            )}

            {/* Notes */}
            {selectedRequest.notes && (
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <h3 className="text-lg font-medium mb-3">Notes</h3>
                <p>{selectedRequest.notes}</p>
              </div>
            )}

            {/* Rejection Reason */}
            {selectedRequest.status === "rejected" && selectedRequest.rejectionReason && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <h3 className="text-lg font-medium mb-3 text-red-700">Rejection Reason</h3>
                <p className="text-red-700">{selectedRequest.rejectionReason}</p>
              </div>
            )}
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
          className="sm:max-w-4xl"
        >
          <div className="flex flex-col items-center">
            {viewingDocument.match(/\.(jpeg|jpg|gif|png)$/i) ? (
              <img 
                src={viewingDocument} 
                alt="Document" 
                className="max-w-full max-h-[70vh] object-contain"
              />
            ) : viewingDocument.match(/\.(pdf)$/i) ? (
              <iframe 
                src={viewingDocument} 
                title="PDF Document" 
                className="w-full h-[70vh]"
              />
            ) : (
              <div className="p-4 text-center">
                <FileText className="h-16 w-16 mx-auto text-blue-500 mb-4" />
                <p>This document type cannot be previewed.</p>
                <a 
                  href={viewingDocument} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="mt-4 inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Download Document
                </a>
              </div>
            )}
            <div className="mt-4">
              <a 
                href={viewingDocument} 
                download 
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center"
              >
                <Download className="h-4 w-4 mr-2" /> Download Document
              </a>
            </div>
          </div>
        </CustomModal>
      )}
    </div>
  )
}

export default LoanRequests
