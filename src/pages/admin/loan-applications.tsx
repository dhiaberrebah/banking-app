"use client"

import type React from "react"
import { useState } from "react"
import { Search, Check, X, FileText, Filter } from "lucide-react"
import { mockLoanApplications, mockUsers, mockLoanProducts } from "../../data/mock-data"

const LoanApplicationsPage: React.FC = () => {
  const [applications, setApplications] = useState(mockLoanApplications)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedApplication, setSelectedApplication] = useState<(typeof mockLoanApplications)[0] | null>(null)
  const [showDetailsModal, setShowDetailsModal] = useState(false)

  // Get user name by userId
  const getUserName = (userId: number) => {
    const user = mockUsers.find((user) => user.id === userId)
    return user ? user.name : "Unknown User"
  }

  // Get loan product name by productId
  const getLoanProductName = (productId: number) => {
    const product = mockLoanProducts.find((product) => product.id === productId)
    return product ? product.name : "Unknown Product"
  }

  // Filter applications based on search term and status filter
  const filteredApplications = applications
    .filter((application) => {
      const matchesSearch =
        getUserName(application.userId).toLowerCase().includes(searchTerm.toLowerCase()) ||
        getLoanProductName(application.productId).toLowerCase().includes(searchTerm.toLowerCase()) ||
        application.purpose.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesStatus = statusFilter === "all" || application.status === statusFilter

      return matchesSearch && matchesStatus
    })
    .sort((a, b) => new Date(b.applicationDate).getTime() - new Date(a.applicationDate).getTime())

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
  }

  const handleStatusFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setStatusFilter(e.target.value)
  }

  const handleViewDetails = (application: (typeof mockLoanApplications)[0]) => {
    setSelectedApplication(application)
    setShowDetailsModal(true)
  }

  const handleApprove = (applicationId: number) => {
    if (window.confirm("Are you sure you want to approve this loan application?")) {
      setApplications(
        applications.map((app) => {
          if (app.id === applicationId) {
            return {
              ...app,
              status: "approved",
              approvalDate: new Date().toISOString(),
            }
          }
          return app
        }),
      )
    }
  }

  const handleReject = (applicationId: number) => {
    if (window.confirm("Are you sure you want to reject this loan application?")) {
      setApplications(
        applications.map((app) => {
          if (app.id === applicationId) {
            return {
              ...app,
              status: "rejected",
              approvalDate: new Date().toISOString(),
            }
          }
          return app
        }),
      )
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Loan Applications</h1>
      </div>

      <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search applications..."
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-blue-900 focus:border-blue-900 sm:text-sm"
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>

        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Filter className="h-5 w-5 text-gray-400" />
          </div>
          <select
            className="block w-full pl-10 px-3 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-blue-900 focus:border-blue-900 sm:text-sm"
            value={statusFilter}
            onChange={handleStatusFilterChange}
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-md">
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
                Loan Type
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
                Term
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Application Date
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Status
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
            {filteredApplications.map((application) => (
              <tr key={application.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{getUserName(application.userId)}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{getLoanProductName(application.productId)}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{application.amount.toLocaleString()} TND</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{application.term} months</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">
                    {new Date(application.applicationDate).toLocaleDateString()}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      application.status === "approved"
                        ? "bg-green-100 text-green-800"
                        : application.status === "rejected"
                          ? "bg-red-100 text-red-800"
                          : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {application.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => handleViewDetails(application)}
                    className="text-blue-900 hover:text-blue-800 mr-3"
                  >
                    <FileText className="h-5 w-5" />
                  </button>
                  {application.status === "pending" && (
                    <>
                      <button
                        onClick={() => handleApprove(application.id)}
                        className="text-green-600 hover:text-green-900 mr-3"
                      >
                        <Check className="h-5 w-5" />
                      </button>
                      <button onClick={() => handleReject(application.id)} className="text-red-600 hover:text-red-900">
                        <X className="h-5 w-5" />
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Loan Application Details Modal */}
      {showDetailsModal && selectedApplication && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-lg w-full">
            <h2 className="text-xl font-semibold mb-4">Loan Application Details</h2>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">Applicant</p>
                  <p className="text-sm font-medium text-gray-900">{getUserName(selectedApplication.userId)}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Loan Type</p>
                  <p className="text-sm font-medium text-gray-900">
                    {getLoanProductName(selectedApplication.productId)}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Amount</p>
                  <p className="text-sm font-medium text-gray-900">{selectedApplication.amount.toLocaleString()} TND</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Term</p>
                  <p className="text-sm font-medium text-gray-900">{selectedApplication.term} months</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Application Date</p>
                  <p className="text-sm font-medium text-gray-900">
                    {new Date(selectedApplication.applicationDate).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Status</p>
                  <p
                    className={`text-sm font-medium ${
                      selectedApplication.status === "approved"
                        ? "text-green-600"
                        : selectedApplication.status === "rejected"
                          ? "text-red-600"
                          : "text-yellow-600"
                    }`}
                  >
                    {selectedApplication.status}
                  </p>
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Purpose</p>
                <p className="text-sm text-gray-900">{selectedApplication.purpose}</p>
              </div>
              {selectedApplication.approvalDate && (
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    {selectedApplication.status === "approved" ? "Approval Date" : "Rejection Date"}
                  </p>
                  <p className="text-sm text-gray-900">
                    {new Date(selectedApplication.approvalDate).toLocaleDateString()}
                  </p>
                </div>
              )}
            </div>
            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={() => setShowDetailsModal(false)}
                className="px-4 py-2 bg-blue-900 text-white rounded-md text-sm font-medium hover:bg-blue-800"
              >
                Close
              </button>
              {selectedApplication.status === "pending" && (
                <>
                  <button
                    onClick={() => {
                      handleApprove(selectedApplication.id)
                      setShowDetailsModal(false)
                    }}
                    className="px-4 py-2 bg-green-600 text-white rounded-md text-sm font-medium hover:bg-green-700"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => {
                      handleReject(selectedApplication.id)
                      setShowDetailsModal(false)
                    }}
                    className="px-4 py-2 bg-red-600 text-white rounded-md text-sm font-medium hover:bg-red-700"
                  >
                    Reject
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default LoanApplicationsPage

