"use client"

import { useState, useEffect } from "react"
import { Layout } from "../../components/layout"
import { NewAccountForm } from "../../components/new-acc-form"
import { ApplicationStatus } from "../../components/new-acc-status"
import { FileCheck, FileWarning, FileClock, Plus } from 'lucide-react'
import axios from "axios"

type ApplicationState = "not_started" | "in_progress" | "submitted" | "pending" | "approved" | "rejected"

type AccountRequest = {
  id: string
  accountNumber: string
  accountType: string
  currency: string
  status: string
  createdAt: string
}

type AccountDetails = {
  id: string
  accountNumber: string
  accountType: string
  currency: string
  balance: number
  status: string
  createdAt: string
  iban?: string
  bic?: string
}

export default function NewAccount() {
  const [applicationState, setApplicationState] = useState<ApplicationState>("not_started")
  const [applicationId, setApplicationId] = useState<string | null>(null)
  const [applicationData, setApplicationData] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)
  const [accountRequests, setAccountRequests] = useState<AccountRequest[]>([])
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [selectedAccount, setSelectedAccount] = useState<AccountDetails | null>(null)

  // Add this useEffect to check authentication status
  useEffect(() => {
    const checkAuthentication = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5001/api/users/check-auth",
          { withCredentials: true }
        )
        setIsAuthenticated(true)
      } catch (err) {
        setIsAuthenticated(false)
        setError("You must be logged in to create an account. Please log in and try again.")
      }
    }
    
    checkAuthentication()
  }, [])

  // Fetch existing account requests on component mount
  useEffect(() => {
    fetchAccountRequests()
  }, [])

  const fetchAccountRequests = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5001/api/users/accounts",
        { withCredentials: true }
      )
      setAccountRequests(response.data.accounts || [])
    } catch (err) {
      console.error("Failed to fetch account requests:", err)
    }
  }

  const handleStartApplication = () => {
    if (!isAuthenticated) {
      setError("You must be logged in to create an account. Please log in and try again.")
      return
    }
    
    setApplicationState("in_progress")
    setError(null)
  }

  const handleSubmitApplication = async (formData: Record<string, any>) => {
    try {
      setApplicationState("submitted")
      
      // Create FormData object for multipart/form-data submission
      const formDataObj = new FormData()
      
      // Personal Information
      formDataObj.append("firstName", formData.firstName)
      formDataObj.append("lastName", formData.lastName)
      formDataObj.append("dateOfBirth", formData.dateOfBirth)
      formDataObj.append("nationality", formData.nationality)
      formDataObj.append("idType", formData.idType)
      formDataObj.append("idNumber", formData.idNumber)
      
      // Contact Information
      formDataObj.append("email", formData.email)
      formDataObj.append("phone", formData.phone)
      formDataObj.append("address", formData.address)
      formDataObj.append("city", formData.city)
      formDataObj.append("postalCode", formData.postalCode)
      
      // Employment Information
      formDataObj.append("employmentStatus", formData.employmentStatus)
      if (formData.employmentStatus === "employed" || formData.employmentStatus === "self_employed") {
        formDataObj.append("employerName", formData.employerName)
        formDataObj.append("jobTitle", formData.jobTitle)
        formDataObj.append("monthlyIncome", formData.monthlyIncome)
      }
      
      // Account Information
      formDataObj.append("accountType", formData.accountType)
      formDataObj.append("currency", formData.currency)
      formDataObj.append("initialDeposit", formData.initialDeposit || "0")
      
      // Terms
      formDataObj.append("termsAccepted", formData.termsAccepted)
      
      // Add file uploads if they exist
      if (formData.idDocument instanceof File) {
        formDataObj.append("idDocument", formData.idDocument)
      }
      
      if (formData.proofOfAddress instanceof File) {
        formDataObj.append("proofOfAddress", formData.proofOfAddress)
      }
      
      if (formData.proofOfIncome instanceof File) {
        formDataObj.append("proofOfIncome", formData.proofOfIncome)
      }
      
      console.log("Submitting form data:", Object.fromEntries(formDataObj.entries()))
      
      // Make API call to backend
      const response = await axios.post(
        "http://localhost:5001/api/users/accounts",
        formDataObj,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true
        }
      )
      
      // Store application data and ID
      setApplicationData(response.data.account)
      setApplicationId(response.data.applicationId)
      
      // Store the account details
      setSelectedAccount(response.data.account)
      
      // Update application state based on response
      // Map backend status to frontend application state
      const accountStatus = response.data.account.status
      if (accountStatus === "pending") {
        setApplicationState("pending")
      } else if (accountStatus === "active") {
        setApplicationState("approved")
      } else if (accountStatus === "frozen" || accountStatus === "closed") {
        setApplicationState("rejected")
      }
      
      // Refresh the account requests list
      fetchAccountRequests()
      
    } catch (err: any) {
      console.error("Application submission error:", err)
      setApplicationState("not_started")
      
      // Improved error handling for authentication issues
      if (err.response?.status === 401) {
        setError("Authentication error: Please log in again before submitting your application.")
      } else {
        setError(err.response?.data?.message || "Failed to submit application. Please try again.")
      }
    }
  }

  const handleNewApplication = () => {
    setApplicationState("not_started")
    setApplicationId(null)
    setApplicationData(null)
    setSelectedAccount(null)
    setError(null)
  }

  // Helper function to format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  // Helper function to get status badge color
  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'frozen':
      case 'closed':
        return 'bg-red-100 text-red-800 border-red-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const handleViewAccountDetails = async (accountId: string) => {
    try {
      const response = await axios.get(
        `http://localhost:5001/api/users/accounts/${accountId}`,
        { withCredentials: true }
      )
      
      setSelectedAccount(response.data.account)
      
      // If the account is active, set application state to approved
      if (response.data.account.status === "active") {
        setApplicationState("approved")
        setApplicationId(accountId)
      }
    } catch (err) {
      console.error("Failed to fetch account details:", err)
      setError("Failed to load account details. Please try again.")
    }
  }

  // Add a function to render account status with appropriate styling
  const renderAccountStatus = (status: 'active' | 'pending' | 'rejected' | 'frozen' | 'closed' | string): React.ReactNode => {
    switch (status) {
      case 'active':
        return (
          <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
            Active
          </span>
        );
      case 'pending':
        return (
          <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium">
            Pending Approval
          </span>
        );
      case 'rejected':
        return (
          <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium">
            Rejected
          </span>
        );
      default:
        return (
          <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs font-medium">
            {status}
          </span>
        );
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h1 className="text-3xl font-bold tracking-tight text-blue-900">New Account Application</h1>
          {applicationId && (
            <div className="px-4 py-2 bg-blue-50 rounded-lg border border-blue-100 text-blue-800 font-medium">
              Application ID: {applicationId}
            </div>
          )}
        </div>

        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <div className="card bg-white shadow-md rounded-xl border border-blue-100 overflow-hidden transition-all duration-200">
              <div className="card-header border-b border-blue-100 bg-gradient-to-r from-blue-50 to-white p-4">
                <h2 className="card-title text-blue-900 font-bold">
                  {applicationState === "not_started" && "Start Your Application"}
                  {applicationState === "in_progress" && "Complete Your Application"}
                  {applicationState === "submitted" && "Application Submitted"}
                  {applicationState === "pending" && "Application Under Review"}
                  {applicationState === "approved" && "Application Approved"}
                  {applicationState === "rejected" && "Application Declined"}
                </h2>
              </div>
              <div className="card-content p-5">
                {(applicationState === "not_started") && (
                  <div className="text-center py-8">
                    <div className="mb-6 mx-auto w-24 h-24 rounded-full bg-blue-50 flex items-center justify-center">
                      <FileCheck className="h-12 w-12 text-blue-500" />
                    </div>
                    <h3 className="text-xl font-semibold text-blue-900 mb-3">Apply for a New Bank Account</h3>
                    <p className="text-gray-600 mb-6 max-w-md mx-auto">
                      Complete our secure application process to open a new bank account. The process takes approximately 10-15 minutes.
                    </p>
                    <button 
                      className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium shadow-md hover:bg-blue-700 transition-colors"
                      onClick={handleStartApplication}
                    >
                      Start Application
                    </button>
                  </div>
                )}

                {applicationState === "in_progress" && (
                  <NewAccountForm onSubmit={handleSubmitApplication} />
                )}

                {applicationState === "submitted" && (
                  <div className="text-center py-8">
                    <div className="mb-6 mx-auto w-24 h-24 rounded-full bg-blue-50 flex items-center justify-center">
                      <FileClock className="h-12 w-12 text-blue-500" />
                    </div>
                    <h3 className="text-xl font-semibold text-blue-900 mb-3">Application Submitted</h3>
                    <p className="text-gray-600 mb-6 max-w-md mx-auto">
                      Thank you for your application. We are processing your information and will update you shortly.
                    </p>
                    <button 
                      className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium shadow-md hover:bg-blue-700 transition-colors"
                      onClick={handleNewApplication}
                    >
                      Start New Application
                    </button>
                  </div>
                )}

                {applicationState === "pending" && (
                  <div className="text-center py-8">
                    <div className="mb-6 mx-auto w-24 h-24 rounded-full bg-blue-50 flex items-center justify-center">
                      <FileClock className="h-12 w-12 text-blue-500 animate-pulse" />
                    </div>
                    <h3 className="text-xl font-semibold text-blue-900 mb-3">Under Review</h3>
                    <p className="text-gray-600 mb-6 max-w-md mx-auto">
                      Our team is reviewing your application. This process typically takes 1-2 business days.
                    </p>
                    <button 
                      className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium shadow-md hover:bg-blue-700 transition-colors"
                      onClick={handleNewApplication}
                    >
                      Start New Application
                    </button>
                  </div>
                )}

                {applicationState === "approved" && selectedAccount && (
                  <div className="text-center py-8">
                    <div className="mb-6 mx-auto w-24 h-24 rounded-full bg-green-50 flex items-center justify-center">
                      <FileCheck className="h-12 w-12 text-green-500" />
                    </div>
                    <h3 className="text-xl font-semibold text-green-700 mb-3">Account Approved!</h3>
                    
                    <div className="bg-white border border-green-100 rounded-lg p-6 mb-6 max-w-md mx-auto text-left">
                      <h4 className="font-medium text-lg text-green-800 mb-4">Account Details</h4>
                      
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Account Number:</span>
                          <span className="font-medium">{selectedAccount.accountNumber}</span>
                        </div>
                        
                        <div className="flex justify-between">
                          <span className="text-gray-600">Account Type:</span>
                          <span className="font-medium">{selectedAccount.accountType.charAt(0).toUpperCase() + selectedAccount.accountType.slice(1)}</span>
                        </div>
                        
                        <div className="flex justify-between">
                          <span className="text-gray-600">Currency:</span>
                          <span className="font-medium">{selectedAccount.currency}</span>
                        </div>
                        
                        <div className="flex justify-between">
                          <span className="text-gray-600">Balance:</span>
                          <span className="font-medium">{selectedAccount.balance.toFixed(2)} {selectedAccount.currency}</span>
                        </div>
                        
                        <div className="flex justify-between">
                          <span className="text-gray-600">Status:</span>
                          <span className={`font-medium ${selectedAccount.status === 'active' ? 'text-green-600' : 'text-gray-600'}`}>
                            {selectedAccount.status.charAt(0).toUpperCase() + selectedAccount.status.slice(1)}
                          </span>
                        </div>
                        
                        <div className="flex justify-between">
                          <span className="text-gray-600">Created On:</span>
                          <span className="font-medium">{formatDate(selectedAccount.createdAt)}</span>
                        </div>
                        
                        {selectedAccount.iban && (
                          <div className="flex justify-between">
                            <span className="text-gray-600">IBAN:</span>
                            <span className="font-medium">{selectedAccount.iban}</span>
                          </div>
                        )}
                        
                        {selectedAccount.bic && (
                          <div className="flex justify-between">
                            <span className="text-gray-600">BIC/SWIFT:</span>
                            <span className="font-medium">{selectedAccount.bic}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <button 
                      className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium shadow-md hover:bg-blue-700 transition-colors"
                      onClick={handleNewApplication}
                    >
                      Apply for Another Account
                    </button>
                  </div>
                )}

                {applicationState === "rejected" && (
                  <div className="text-center py-8">
                    <div className="mb-6 mx-auto w-24 h-24 rounded-full bg-red-50 flex items-center justify-center">
                      <FileWarning className="h-12 w-12 text-red-500" />
                    </div>
                    <h3 className="text-xl font-semibold text-red-700 mb-3">Application Declined</h3>
                    <p className="text-gray-600 mb-6 max-w-md mx-auto">
                      We're sorry, but we couldn't approve your application at this time. Please contact customer support for more information.
                    </p>
                    <button 
                      className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium shadow-md hover:bg-blue-700 transition-colors"
                      onClick={handleNewApplication}
                    >
                      Start New Application
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="card bg-white shadow-md rounded-xl border border-blue-100 overflow-hidden">
              <div className="card-header border-b border-blue-100 bg-gradient-to-r from-blue-50 to-white p-4">
                <h2 className="card-title text-blue-900 font-bold">Application Status</h2>
              </div>
              <div className="card-content p-5">
                <ApplicationStatus currentState={applicationState} />
              </div>
            </div>
            
            {/* Account Requests List */}
            <div className="card bg-white shadow-md rounded-xl border border-blue-100 overflow-hidden mt-6">
              <div className="card-header border-b border-blue-100 bg-gradient-to-r from-blue-50 to-white p-4">
                <h2 className="card-title text-blue-900 font-bold">Your Account Requests</h2>
              </div>
              <div className="card-content p-5">
                {accountRequests.length > 0 ? (
                  <ul className="divide-y divide-gray-200">
                    {accountRequests.map((request) => (
                      <li key={request.id} className="py-3">
                        <div className="flex flex-col sm:flex-row sm:justify-between">
                          <div>
                            <p className="font-medium text-blue-900">
                              {request.accountType.charAt(0).toUpperCase() + request.accountType.slice(1)} Account
                            </p>
                            <p className="text-sm text-gray-500">
                              {formatDate(request.createdAt)}
                            </p>
                          </div>
                          <div className="mt-2 sm:mt-0 flex items-center space-x-2">
                            <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusBadgeClass(request.status)}`}>
                              {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                            </span>
                            {request.status === "active" && (
                              <button 
                                onClick={() => handleViewAccountDetails(request.id)}
                                className="text-xs text-blue-600 hover:text-blue-800 underline"
                              >
                                View Details
                              </button>
                            )}
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="text-center py-4">
                    <p className="text-gray-500">No account requests yet</p>
                  </div>
                )}
                
                <div className="mt-4 text-center">
                  <button 
                    className="inline-flex items-center px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-800"
                    onClick={handleNewApplication}
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    New Account Request
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}
