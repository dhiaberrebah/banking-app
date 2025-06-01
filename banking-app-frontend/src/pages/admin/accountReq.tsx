"use client"

import { useState, useEffect } from "react"
import { Search, Eye, RefreshCw, FileText, Download, CheckCircle, XCircle, X } from "lucide-react"
import axios from "axios"
import { toast } from "react-toastify"

// Define TypeScript interfaces
interface Account {
  id: string
  accountNumber: string
  accountType: string
  currency: string
  balance: number
  status: string
  submittedDate: string
  applicationDetails?: {
    personal?: {
      firstName?: string
      lastName?: string
      dateOfBirth?: string
      nationality?: string
      idType?: string
      idNumber?: string
    }
    contact?: {
      email?: string
      phone?: string
      address?: string
      city?: string
      postalCode?: string
    }
    employment?: {
      status?: string
      employerName?: string
      jobTitle?: string
      monthlyIncome?: number
    }
    documents?: {
      idDocument?: string
      proofOfAddress?: string
      proofOfIncome?: string
    }
  }
}

export default function AccountRequests() {
  const [accounts, setAccounts] = useState<Account[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null)
  const [showDetailsModal, setShowDetailsModal] = useState(false)
  const [statusUpdateData, setStatusUpdateData] = useState({
    status: "",
    rejectionReason: ""
  })
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false)
  const [viewingDocument, setViewingDocument] = useState<string | null>(null)
  const [documentModalOpen, setDocumentModalOpen] = useState(false)
  const [statusFilter, setStatusFilter] = useState("all")
  const [accountTypeFilter, setAccountTypeFilter] = useState("all")
  const [dateFilter, setDateFilter] = useState({ startDate: "", endDate: "" })

  // Add a dedicated function to apply filters
  const applyFilters = () => {
    fetchAllAccounts();
  }

  // Fetch all accounts with filters
  const fetchAllAccounts = async () => {
    setIsLoading(true)
    try {
      console.log('Fetching accounts from backend'); // Debug log
      
      // Build query parameters
      const params = new URLSearchParams();
      if (statusFilter !== "all") params.append("status", statusFilter);
      if (accountTypeFilter !== "all") params.append("accountType", accountTypeFilter);
      if (dateFilter.startDate) params.append("startDate", dateFilter.startDate);
      if (dateFilter.endDate) params.append("endDate", dateFilter.endDate);
      if (searchTerm) params.append("search", searchTerm);
      
      const queryString = params.toString();
      const url = `http://localhost:5001/api/admin/accounts${queryString ? `?${queryString}` : ''}`;
      
      const response = await axios.get(url, { 
        withCredentials: true 
      });
      
      console.log('Response received:', response.data); // Debug log
      
      if (response.data.success) {
        setAccounts(response.data.accounts);
        console.log('Accounts set in state:', response.data.accounts); // Debug log
      } else {
        console.error('API returned success: false', response.data); // Debug log
        toast.error("Failed to fetch accounts: " + (response.data.message || 'Unknown error'));
      }
    } catch (error) {
      console.error("Error fetching accounts:", error)
      toast.error("Failed to fetch accounts")
    } finally {
      setIsLoading(false)
    }
  }

  // Update account status
  const updateAccountStatus = async (accountId: string) => {
    if (!accountId) {
      toast.error("No account ID provided for update");
      return;
    }
    
    if (!statusUpdateData.status) {
      toast.error("Please select a status");
      return;
    }
    
    setIsUpdatingStatus(true)
    try {
      console.log(`Updating account status for account: ${accountId}`);
      console.log("Status update data:", statusUpdateData);
      
      const response = await axios.patch(
        `http://localhost:5001/api/admin/accounts/${accountId}/status`,
        statusUpdateData,
        { withCredentials: true }
      )

      if (response.data.success) {
        toast.success(`Account ${statusUpdateData.status} successfully`)
        
        // Refresh the account data
        fetchAllAccounts();
        
        // Close the modal after successful update
        setShowDetailsModal(false);
        
        // Reset the form
        setStatusUpdateData({
          status: "",
          rejectionReason: ""
        });
      }
    } catch (error) {
      console.error("Error updating account status:", error)
      toast.error("Failed to update account status")
    } finally {
      setIsUpdatingStatus(false)
    }
  }

  // Fetch account details
  const fetchAccountDetails = async (accountId: string) => {
    try {
      const response = await axios.get(`http://localhost:5001/api/admin/accounts/${accountId}`, {
        withCredentials: true,
      })

      if (response.data.success) {
        setSelectedAccount(response.data.account)
        setShowDetailsModal(true)
      }
    } catch (error) {
      console.error("Error fetching account details:", error)
      toast.error("Failed to fetch account details")
    }
  }

  // Fetch data on component mount
  useEffect(() => {
    fetchAllAccounts()
  }, [])

  // Handle view account details
  const handleViewAccountDetails = (account: Account) => {
    setSelectedAccount(account)
    setShowDetailsModal(true)
  }

  // Use accounts directly without additional filtering
  const filteredAccounts = accounts;

  // Add this useEffect to log filtered results for debugging
  useEffect(() => {
    console.log("Search term:", searchTerm);
    console.log("Filtered accounts count:", filteredAccounts.length);
    if (searchTerm && filteredAccounts.length === 0) {
      console.log("No matches found for:", searchTerm);
      console.log("Available accounts:", accounts);
    }
  }, [searchTerm, filteredAccounts.length, accounts]);

  // Add this function to handle document viewing
  const handleViewDocument = (documentUrl: string) => {
    setViewingDocument(documentUrl)
    setDocumentModalOpen(true)
  }

  // Add these functions to handle account approval/rejection
  const handleApproveAccount = async (accountId: string) => {
    try {
      const response = await axios.patch(
        `http://localhost:5001/api/admin/accounts/${accountId}/status`,
        { status: 'active' }, // Changed from 'approved' to 'active'
        { withCredentials: true }
      );

      if (response.data.success) {
        toast.success('Account approved successfully');
        fetchAllAccounts();
        setShowDetailsModal(false);
      }
    } catch (error) {
      console.error('Error approving account:', error);
      toast.error('Failed to approve account');
    }
  };

  const handleRejectAccount = async (accountId: string) => {
    try {
      const rejectionReason = prompt('Please enter a reason for rejection:');
      if (!rejectionReason) return; // Cancel if no reason provided
      
      const response = await axios.patch(
        `http://localhost:5001/api/admin/accounts/${accountId}/status`,
        { 
          status: 'closed', // Changed from 'rejected' to 'closed'
          rejectionReason 
        },
        { withCredentials: true }
      );

      if (response.data.success) {
        toast.success('Account rejected successfully');
        fetchAllAccounts();
        setShowDetailsModal(false);
      }
    } catch (error) {
      console.error('Error rejecting account:', error);
      toast.error('Failed to reject account');
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Account Management</h1>
        <p className="text-gray-600">View and manage all bank accounts in the system</p>
      </div>

      {/* Search and filter */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 mb-6">
        <div className="flex flex-col space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-grow">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Search by account number, owner name, email, or phone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {searchTerm && (
                <button
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setSearchTerm("")}
                >
                  <X className="h-4 w-4 text-gray-400 hover:text-gray-600" />
                </button>
              )}
            </div>
            <button
              onClick={fetchAllAccounts}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </button>
            <button
              onClick={applyFilters}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              Apply Filters
            </button>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="w-full sm:w-1/4">
              <label htmlFor="statusFilter" className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                id="statusFilter"
                className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="active">Active</option>
                <option value="closed">Closed</option>
                <option value="frozen">Frozen</option>
              </select>
            </div>
            
            <div className="w-full sm:w-1/4">
              <label htmlFor="accountTypeFilter" className="block text-sm font-medium text-gray-700 mb-1">
                Account Type
              </label>
              <select
                id="accountTypeFilter"
                className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                value={accountTypeFilter}
                onChange={(e) => setAccountTypeFilter(e.target.value)}
              >
                <option value="all">All Types</option>
                <option value="current">Current</option>
                <option value="savings">Savings</option>
              </select>
            </div>
            
            <div className="w-full sm:w-1/4">
              <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">
                From Date
              </label>
              <input
                type="date"
                id="startDate"
                className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                value={dateFilter.startDate}
                onChange={(e) => setDateFilter(prev => ({ ...prev, startDate: e.target.value }))}
              />
            </div>
            
            <div className="w-full sm:w-1/4">
              <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-1">
                To Date
              </label>
              <input
                type="date"
                id="endDate"
                className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                value={dateFilter.endDate}
                onChange={(e) => setDateFilter(prev => ({ ...prev, endDate: e.target.value }))}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Accounts list */}
      {isLoading ? (
        <div className="text-center py-10">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-800"></div>
          <p className="mt-2 text-gray-600">Loading accounts...</p>
        </div>
      ) : filteredAccounts.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-8 text-center">
          <p className="text-gray-500">No accounts found</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200 rounded-lg overflow-hidden">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Account Number</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Currency</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Balance</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Owner</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {isLoading ? (
                  <tr>
                    <td colSpan={8} className="px-6 py-4 text-center">
                      <div className="flex justify-center">
                        <RefreshCw className="animate-spin h-5 w-5 text-blue-500" />
                      </div>
                    </td>
                  </tr>
                ) : filteredAccounts.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-6 py-4 text-center text-gray-500">
                      No accounts found
                    </td>
                  </tr>
                ) : (
                  filteredAccounts.map((account) => (
                    <tr key={account.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {account.accountNumber || 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {account.accountType || 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {account.currency || 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {account.balance }
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          account.status === 'approved' ? 'bg-green-100 text-green-800' :
                          account.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          account.status === 'rejected' ? 'bg-red-100 text-red-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {account.status || 'N/A'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {account.applicationDetails?.personal?.firstName && account.applicationDetails?.personal?.lastName ? 
                          `${account.applicationDetails.personal.firstName} ${account.applicationDetails.personal.lastName}` : 
                          'Unknown'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {account.submittedDate ? new Date(account.submittedDate).toLocaleDateString() : 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end space-x-2">
                          <button
                            onClick={() => handleViewAccountDetails(account)}
                            className="text-blue-600 hover:text-blue-900"
                            title="View Details"
                          >
                            <Eye size={18} />
                          </button>
                          {account.status === 'pending' && (
                            <>
                              <button
                                onClick={() => handleApproveAccount(account.id)}
                                className="text-green-600 hover:text-green-900"
                                title="Approve Account"
                              >
                                <CheckCircle size={18} />
                              </button>
                              <button
                                onClick={() => handleRejectAccount(account.id)}
                                className="text-red-600 hover:text-red-900"
                                title="Reject Account"
                              >
                                <XCircle size={18} />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Account Details Modal */}
      {showDetailsModal && selectedAccount && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Account Details</h3>
              <button
                onClick={() => setShowDetailsModal(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-500"
              >
                <span className="sr-only">Close</span>
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Account Number</h4>
                  <p className="mt-1 text-sm text-gray-900">{selectedAccount.accountNumber}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Account Type</h4>
                  <p className="mt-1 text-sm text-gray-900 capitalize">{selectedAccount.accountType}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Currency</h4>
                  <p className="mt-1 text-sm text-gray-900">{selectedAccount.currency}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Balance</h4>
                  <p className="mt-1 text-sm text-gray-900">{selectedAccount.balance.toFixed(2)} {selectedAccount.currency}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Status</h4>
                  <p className="mt-1">
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${
                        selectedAccount.status === "active"
                          ? "bg-green-100 text-green-800"
                          : selectedAccount.status === "pending"
                            ? "bg-yellow-100 text-yellow-800"
                            : selectedAccount.status === "frozen"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-red-100 text-red-800"
                      }`}
                    >
                      {selectedAccount.status}
                    </span>
                  </p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Created Date</h4>
                  <p className="mt-1 text-sm text-gray-900">
                    {new Date(selectedAccount.submittedDate).toLocaleDateString()}
                  </p>
                </div>
              </div>

              {/* Owner Information */}
              <div className="mb-6">
                <h4 className="text-sm font-medium text-gray-500 mb-2">Owner Information</h4>
                <div className="bg-gray-50 p-3 rounded-md">
                  <p className="text-sm text-gray-900">
                    {selectedAccount.applicationDetails?.personal ? 
                      `${selectedAccount.applicationDetails.personal.firstName || ''} ${selectedAccount.applicationDetails.personal.lastName || ''}`.trim() || 'Unknown' 
                      : 'Unknown'}
                  </p>
                  <p className="text-sm text-gray-500">{selectedAccount.applicationDetails?.contact?.email || "No email"}</p>
                  <p className="text-sm text-gray-500">{selectedAccount.applicationDetails?.contact?.phone || "No phone"}</p>
                  {selectedAccount.applicationDetails?.contact?.address && (
                    <p className="text-sm text-gray-500">{selectedAccount.applicationDetails.contact.address}</p>
                  )}
                </div>
              </div>

              {/* Additional Details (if available) */}
              {selectedAccount.applicationDetails?.employment && (
                <div className="mb-6">
                  <h4 className="text-sm font-medium text-gray-500 mb-2">Employment Information</h4>
                  <div className="bg-gray-50 p-3 rounded-md">
                    <p className="text-sm text-gray-900">Status: {selectedAccount.applicationDetails.employment.status || 'N/A'}</p>
                    {selectedAccount.applicationDetails.employment.employerName && (
                      <p className="text-sm text-gray-500">Employer: {selectedAccount.applicationDetails.employment.employerName}</p>
                    )}
                    {selectedAccount.applicationDetails.employment.jobTitle && (
                      <p className="text-sm text-gray-500">Job Title: {selectedAccount.applicationDetails.employment.jobTitle}</p>
                    )}
                    {selectedAccount.applicationDetails.employment.monthlyIncome && (
                      <p className="text-sm text-gray-500">Monthly Income: {selectedAccount.applicationDetails.employment.monthlyIncome}</p>
                    )}
                  </div>
                </div>
              )}

              {/* Documents Section */}
              {selectedAccount.applicationDetails?.documents && (
                <div className="mb-6">
                  <h4 className="text-sm font-medium text-gray-500 mb-2">Submitted Documents</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {selectedAccount.applicationDetails.documents.idDocument && (
                      <div className="border border-gray-200 rounded p-3">
                        <p className="font-medium">ID Document</p>
                        <button 
                          className="mt-2 text-blue-600 flex items-center text-sm hover:text-blue-800"
                          onClick={() => selectedAccount.applicationDetails?.documents?.idDocument && handleViewDocument(selectedAccount.applicationDetails.documents.idDocument)}
                        >
                          <Eye className="h-4 w-4 mr-1" /> View Document
                        </button>
                      </div>
                    )}
                    {selectedAccount.applicationDetails.documents.proofOfAddress && (
                      <div className="border border-gray-200 rounded p-3">
                        <p className="font-medium">Proof of Address</p>
                        <button 
                          className="mt-2 text-blue-600 flex items-center text-sm hover:text-blue-800"
                          onClick={() => selectedAccount.applicationDetails?.documents?.proofOfAddress && handleViewDocument(selectedAccount.applicationDetails.documents.proofOfAddress)}
                        >
                          <Eye className="h-4 w-4 mr-1" /> View Document
                        </button>
                      </div>
                    )}
                    {selectedAccount.applicationDetails.documents.proofOfIncome && (
                      <div className="border border-gray-200 rounded p-3">
                        <p className="font-medium">Proof of Income</p>
                        <button 
                          className="mt-2 text-blue-600 flex items-center text-sm hover:text-blue-800"
                          onClick={() => selectedAccount.applicationDetails?.documents?.proofOfIncome && handleViewDocument(selectedAccount.applicationDetails.documents.proofOfIncome)}
                        >
                          <Eye className="h-4 w-4 mr-1" /> View Document
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Status update form */}
              <div className="mb-6">
                <h4 className="text-sm font-medium text-gray-500 mb-2">Update Account Status</h4>
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Status</label>
                    <select
                      className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                      value={statusUpdateData.status}
                      onChange={(e) => setStatusUpdateData({ ...statusUpdateData, status: e.target.value })}
                    >
                      <option value="">Select status</option>
                      <option value="active">Active</option>
                      <option value="pending">Pending</option>
                      <option value="frozen">Frozen</option>
                      <option value="closed">Closed</option>
                    </select>
                  </div>
                  {statusUpdateData.status === "rejected" && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Rejection Reason</label>
                      <textarea
                        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                        value={statusUpdateData.rejectionReason}
                        onChange={(e) =>
                          setStatusUpdateData({ ...statusUpdateData, rejectionReason: e.target.value })
                        }
                        rows={3}
                        placeholder="Enter reason for rejection"
                      />
                    </div>
                  )}
                </div>
                <div className="mt-4 flex justify-end">
                  <button
                    onClick={() => updateAccountStatus(selectedAccount.id)}
                    disabled={isUpdatingStatus || !statusUpdateData.status}
                    className={`px-4 py-2 rounded-md text-white ${
                      isUpdatingStatus || !statusUpdateData.status
                        ? "bg-gray-300 cursor-not-allowed"
                        : "bg-blue-600 hover:bg-blue-700"
                    }`}
                  >
                    {isUpdatingStatus ? "Updating..." : "Update Status"}
                  </button>
                </div>
              </div>

              {/* Close button */}
              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Document Viewer Modal */}
      {documentModalOpen && viewingDocument && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-4 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-900">Document Viewer</h3>
              <button
                onClick={() => {
                  setDocumentModalOpen(false)
                  setViewingDocument(null)
                }}
                className="text-gray-400 hover:text-gray-500"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-6 flex flex-col items-center">
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
          </div>
        </div>
      )}
    </div>
  )
}
