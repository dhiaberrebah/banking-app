"use client"

import { useState } from "react"
import { Search, Filter, Eye, CheckCircle, XCircle, Clock, MessageSquare } from "lucide-react"
import Modal from "../../components/ui/Modal"

// Define TypeScript interfaces for our data structures
interface PersonalInfo {
  fullName: string
  email: string
  phone: string
  idNumber: string
  accountNumber?: string
}

interface RequestDetails {
  type: string
  description: string
  submittedDate: string
  priority: "Low" | "Medium" | "High"
  attachments?: string[]
  additionalInfo?: string
}

interface GeneralRequest {
  id: string
  customer: string
  email: string
  phone: string
  type: string
  subject: string
  status: "pending" | "in-progress" | "resolved" | "rejected"
  submittedDate: string
  resolvedDate?: string
  rejectedDate?: string
  rejectionReason?: string
  priority: "Low" | "Medium" | "High"
  assignedTo?: string
  details: {
    personalInfo: PersonalInfo
    requestDetails: RequestDetails
  }
}

const GeneralRequests = (): React.ReactElement => {
  const [searchTerm, setSearchTerm] = useState<string>("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [typeFilter, setTypeFilter] = useState<string>("all")
  const [priorityFilter, setPriorityFilter] = useState<string>("all")
  const [showDetailsModal, setShowDetailsModal] = useState<boolean>(false)
  const [selectedRequest, setSelectedRequest] = useState<GeneralRequest | null>(null)

  // Mock general request data
  const generalRequests: GeneralRequest[] = [
    {
      id: "REQ-2023-001",
      customer: "Ahmed Ben Ali",
      email: "ahmed.benali@example.com",
      phone: "+216 98 765 432",
      type: "Account Issue",
      subject: "Unable to access online banking",
      status: "pending",
      submittedDate: "2023-04-15",
      priority: "High",
      details: {
        personalInfo: {
          fullName: "Ahmed Ben Ali",
          email: "ahmed.benali@example.com",
          phone: "+216 98 765 432",
          idNumber: "09876543",
          accountNumber: "TN59 0001 0001 1234 5678 9012",
        },
        requestDetails: {
          type: "Account Issue",
          description:
            "I've been trying to log in to my online banking account for the past 2 days but keep getting an error message saying 'Invalid credentials'. I've reset my password twice but still can't access my account.",
          submittedDate: "2023-04-15",
          priority: "High",
          attachments: ["Screenshot of error message"],
        },
      },
    },
    {
      id: "REQ-2023-002",
      customer: "Mariem Trabelsi",
      email: "mariem.trabelsi@example.com",
      phone: "+216 94 321 876",
      type: "Card Services",
      subject: "Request for new debit card",
      status: "in-progress",
      submittedDate: "2023-04-14",
      priority: "Medium",
      assignedTo: "Sami Khelifi",
      details: {
        personalInfo: {
          fullName: "Mariem Trabelsi",
          email: "mariem.trabelsi@example.com",
          phone: "+216 94 321 876",
          idNumber: "12345678",
          accountNumber: "TN59 0001 0001 5678 9012 3456",
        },
        requestDetails: {
          type: "Card Services",
          description:
            "I would like to request a new debit card as my current one is damaged and doesn't work properly at ATMs. Please send it to my registered address.",
          submittedDate: "2023-04-14",
          priority: "Medium",
          additionalInfo: "Preferred card type: Visa Platinum",
        },
      },
    },
    {
      id: "REQ-2023-003",
      customer: "Karim Gharbi",
      email: "karim.gharbi@example.com",
      phone: "+216 92 456 789",
      type: "Complaint",
      subject: "Incorrect fee charged",
      status: "resolved",
      submittedDate: "2023-04-13",
      resolvedDate: "2023-04-14",
      priority: "High",
      assignedTo: "Leila Mansouri",
      details: {
        personalInfo: {
          fullName: "Karim Gharbi",
          email: "karim.gharbi@example.com",
          phone: "+216 92 456 789",
          idNumber: "87654321",
          accountNumber: "TN59 0001 0001 9012 3456 7890",
        },
        requestDetails: {
          type: "Complaint",
          description:
            "I was charged a 25 TND maintenance fee on my business account which should be free according to my account agreement. Please review and refund the incorrect charge.",
          submittedDate: "2023-04-13",
          priority: "High",
          attachments: ["Account statement", "Account agreement"],
        },
      },
    },
    {
      id: "REQ-2023-004",
      customer: "Sarra Mejri",
      email: "sarra.mejri@example.com",
      phone: "+216 96 543 210",
      type: "Information Request",
      subject: "International transfer fees",
      status: "resolved",
      submittedDate: "2023-04-12",
      resolvedDate: "2023-04-13",
      priority: "Low",
      assignedTo: "Mohamed Ayari",
      details: {
        personalInfo: {
          fullName: "Sarra Mejri",
          email: "sarra.mejri@example.com",
          phone: "+216 96 543 210",
          idNumber: "65432109",
          accountNumber: "TN59 0001 0001 3456 7890 1234",
        },
        requestDetails: {
          type: "Information Request",
          description:
            "I need information about the fees for international transfers to France. What are the current rates and processing times for such transfers?",
          submittedDate: "2023-04-12",
          priority: "Low",
        },
      },
    },
    {
      id: "REQ-2023-005",
      customer: "Mohamed Ben Salah",
      email: "mohamed.bensalah@example.com",
      phone: "+216 97 654 321",
      type: "Feature Request",
      subject: "Mobile app fingerprint login",
      status: "rejected",
      submittedDate: "2023-04-10",
      rejectedDate: "2023-04-11",
      rejectionReason: "Feature already in development and scheduled for next release",
      priority: "Medium",
      assignedTo: "Nadia Belhadj",
      details: {
        personalInfo: {
          fullName: "Mohamed Ben Salah",
          email: "mohamed.bensalah@example.com",
          phone: "+216 97 654 321",
          idNumber: "54321098",
          accountNumber: "TN59 0001 0001 7890 1234 5678",
        },
        requestDetails: {
          type: "Feature Request",
          description:
            "I would like to suggest adding fingerprint authentication to the mobile banking app for faster and more secure login. Many other banks already offer this feature.",
          submittedDate: "2023-04-10",
          priority: "Medium",
        },
      },
    },
  ]

  // Filter general requests based on search term and filters
  const filteredRequests = generalRequests.filter(
    (request) =>
      (request.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.subject.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (statusFilter === "all" || request.status === statusFilter) &&
      (typeFilter === "all" || request.type === typeFilter) &&
      (priorityFilter === "all" || request.priority === priorityFilter),
  )

  const handleViewDetails = (request: GeneralRequest): void => {
    setSelectedRequest(request)
    setShowDetailsModal(true)
  }

  const getStatusBadge = (status: string): React.ReactElement | null => {
    switch (status) {
      case "pending":
        return (
          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
            <Clock className="h-3 w-3 mr-1" /> Pending
          </span>
        )
      case "in-progress":
        return (
          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
            <MessageSquare className="h-3 w-3 mr-1" /> In Progress
          </span>
        )
      case "resolved":
        return (
          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
            <CheckCircle className="h-3 w-3 mr-1" /> Resolved
          </span>
        )
      case "rejected":
        return (
          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
            <XCircle className="h-3 w-3 mr-1" /> Rejected
          </span>
        )
      default:
        return null
    }
  }

  const getPriorityBadge = (priority: string): React.ReactElement | null => {
    switch (priority) {
      case "Low":
        return (
          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
            Low
          </span>
        )
      case "Medium":
        return (
          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
            Medium
          </span>
        )
      case "High":
        return (
          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
            High
          </span>
        )
      default:
        return null
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">General Requests</h1>
        <div className="flex items-center space-x-2">
          <button className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-700 transition-colors">
            Export List
          </button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-100">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <div className="relative w-full md:w-64">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search requests..."
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-gray-500" />
              <select
                className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="in-progress">In Progress</option>
                <option value="resolved">Resolved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>

            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-gray-500" />
              <select
                className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
              >
                <option value="all">All Types</option>
                <option value="Account Issue">Account Issue</option>
                <option value="Card Services">Card Services</option>
                <option value="Complaint">Complaint</option>
                <option value="Information Request">Information Request</option>
                <option value="Feature Request">Feature Request</option>
              </select>
            </div>

            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-gray-500" />
              <select
                className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
              >
                <option value="all">All Priorities</option>
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* General Requests Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Request ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Subject
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Priority
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Submitted
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredRequests.map((request) => (
                <tr key={request.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{request.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{request.customer}</div>
                    <div className="text-sm text-gray-500">{request.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{request.type}</td>
                  <td className="px-6 py-4 text-sm text-gray-900 max-w-xs truncate">{request.subject}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{getPriorityBadge(request.priority)}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{getStatusBadge(request.status)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{request.submittedDate}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center space-x-3">
                      <button
                        className="text-blue-600 hover:text-blue-900"
                        onClick={() => handleViewDetails(request)}
                        title="View Details"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      {request.status === "pending" && (
                        <>
                          <button className="text-green-600 hover:text-green-900" title="Process Request">
                            <CheckCircle className="h-4 w-4" />
                          </button>
                          <button className="text-red-600 hover:text-red-900" title="Reject Request">
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
      </div>

      {/* Request Details Modal */}
      <Modal
        isOpen={showDetailsModal}
        onClose={() => setShowDetailsModal(false)}
        title="Request Details"
        className="max-w-4xl"
      >
        {selectedRequest && (
          <div className="space-y-6">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-medium text-gray-900">{selectedRequest.id}</h3>
                <p className="text-sm text-gray-500">Submitted on {selectedRequest.submittedDate}</p>
              </div>
              <div className="flex space-x-2">
                {getStatusBadge(selectedRequest.status)}
                {getPriorityBadge(selectedRequest.priority)}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Customer Information</h4>
                  <div className="mt-2 bg-gray-50 p-3 rounded-md">
                    <dl className="space-y-2">
                      <div className="flex justify-between">
                        <dt className="text-sm font-medium text-gray-500">Full Name:</dt>
                        <dd className="text-sm text-gray-900">{selectedRequest.details.personalInfo.fullName}</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-sm font-medium text-gray-500">Email:</dt>
                        <dd className="text-sm text-gray-900">{selectedRequest.details.personalInfo.email}</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-sm font-medium text-gray-500">Phone:</dt>
                        <dd className="text-sm text-gray-900">{selectedRequest.details.personalInfo.phone}</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-sm font-medium text-gray-500">ID Number:</dt>
                        <dd className="text-sm text-gray-900">{selectedRequest.details.personalInfo.idNumber}</dd>
                      </div>
                      {selectedRequest.details.personalInfo.accountNumber && (
                        <div className="flex justify-between">
                          <dt className="text-sm font-medium text-gray-500">Account Number:</dt>
                          <dd className="text-sm text-gray-900">
                            {selectedRequest.details.personalInfo.accountNumber}
                          </dd>
                        </div>
                      )}
                    </dl>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-500">Request Information</h4>
                  <div className="mt-2 bg-gray-50 p-3 rounded-md">
                    <dl className="space-y-2">
                      <div className="flex justify-between">
                        <dt className="text-sm font-medium text-gray-500">Type:</dt>
                        <dd className="text-sm text-gray-900">{selectedRequest.details.requestDetails.type}</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-sm font-medium text-gray-500">Subject:</dt>
                        <dd className="text-sm text-gray-900">{selectedRequest.subject}</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-sm font-medium text-gray-500">Priority:</dt>
                        <dd className="text-sm text-gray-900">{selectedRequest.details.requestDetails.priority}</dd>
                      </div>
                      {selectedRequest.assignedTo && (
                        <div className="flex justify-between">
                          <dt className="text-sm font-medium text-gray-500">Assigned To:</dt>
                          <dd className="text-sm text-gray-900">{selectedRequest.assignedTo}</dd>
                        </div>
                      )}
                    </dl>
                  </div>
                </div>

                {selectedRequest.details.requestDetails.attachments && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Attachments</h4>
                    <div className="mt-2 bg-gray-50 p-3 rounded-md">
                      <ul className="space-y-2">
                        {selectedRequest.details.requestDetails.attachments.map((attachment, index) => (
                          <li key={index} className="flex items-center justify-between">
                            <span className="text-sm text-gray-900">{attachment}</span>
                            <button className="text-blue-600 hover:text-blue-800 text-sm">View</button>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Description</h4>
                  <div className="mt-2 bg-gray-50 p-3 rounded-md">
                    <p className="text-sm text-gray-900 whitespace-pre-line">
                      {selectedRequest.details.requestDetails.description}
                    </p>
                  </div>
                </div>

                {selectedRequest.details.requestDetails.additionalInfo && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Additional Information</h4>
                    <div className="mt-2 bg-gray-50 p-3 rounded-md">
                      <p className="text-sm text-gray-900">{selectedRequest.details.requestDetails.additionalInfo}</p>
                    </div>
                  </div>
                )}

                {selectedRequest.status === "rejected" && selectedRequest.rejectionReason && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Rejection Reason</h4>
                    <div className="mt-2 bg-red-50 p-3 rounded-md border border-red-100">
                      <p className="text-sm text-red-800">{selectedRequest.rejectionReason}</p>
                    </div>
                  </div>
                )}

                {selectedRequest.status === "pending" && (
                  <div className="mt-6">
                    <h4 className="text-sm font-medium text-gray-500">Action</h4>
                    <div className="mt-2 space-y-3">
                      <button className="w-full bg-blue-600 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-700 transition-colors flex items-center justify-center">
                        <MessageSquare className="h-4 w-4 mr-2" />
                        Process Request
                      </button>
                      <button className="w-full bg-green-600 text-white px-4 py-2 rounded-md text-sm hover:bg-green-700 transition-colors flex items-center justify-center">
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Resolve Request
                      </button>
                      <button className="w-full bg-red-600 text-white px-4 py-2 rounded-md text-sm hover:bg-red-700 transition-colors flex items-center justify-center">
                        <XCircle className="h-4 w-4 mr-2" />
                        Reject Request
                      </button>
                    </div>
                  </div>
                )}

                {selectedRequest.status === "in-progress" && (
                  <div className="mt-6">
                    <h4 className="text-sm font-medium text-gray-500">Action</h4>
                    <div className="mt-2 space-y-3">
                      <button className="w-full bg-green-600 text-white px-4 py-2 rounded-md text-sm hover:bg-green-700 transition-colors flex items-center justify-center">
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Mark as Resolved
                      </button>
                      <button className="w-full bg-red-600 text-white px-4 py-2 rounded-md text-sm hover:bg-red-700 transition-colors flex items-center justify-center">
                        <XCircle className="h-4 w-4 mr-2" />
                        Reject Request
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}

export default GeneralRequests
