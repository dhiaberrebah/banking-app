"use client"

import { useState, useEffect } from "react"
import { Loader2, CheckCircle, AlertCircle, Clock, Upload } from "lucide-react"
import axios from "axios"
// import { useAuthStore } from "../store/authStore"

type LoanApplication = {
  _id: string;
  userId: string;
  loanType: string;
  amount: number;
  term: number;
  interestRate: number;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  documents: string[];
  notes: string;
}

export function LoanApplication() {
  // const { currentUser } = useAuthStore()
  const [isLoading, setIsLoading] = useState(false)
  const [step, setStep] = useState(1)
  const [successMessage, setSuccessMessage] = useState("")
  const [errorMessage, setErrorMessage] = useState("")
  const [applications, setApplications] = useState<LoanApplication[]>([])
  const [formData, setFormData] = useState({
    loanType: "personal",
    amount: 50000,
    term: 5,
    interestRate: 7.5,
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    postalCode: "",
    employmentStatus: "",
    monthlyIncome: "",
    otherLoans: "no",
    otherLoansAmount: "",
    purpose: "",
    additionalInfo: "",
  })

  // Add state for document files
  const [documents, setDocuments] = useState({
    idDocument: null,
    proofOfIncome: null,
    bankStatements: null
  });

  // Add a function to handle file changes
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, files } = e.target;
    if (files && files.length > 0) {
      setDocuments(prev => ({
        ...prev,
        [name]: files[0]
      }));
    }
  }

  useEffect(() => {
    // Fetch existing loan applications
    fetchApplications()
    
    // Load saved loan details if available
    const savedLoan = localStorage.getItem('loanApplication')
    if (savedLoan) {
      try {
        const loanData = JSON.parse(savedLoan)
        setFormData(prev => ({
          ...prev,
          loanType: loanData.loanType || prev.loanType,
          amount: loanData.amount || prev.amount,
          term: loanData.term || prev.term,
          interestRate: loanData.interestRate || prev.interestRate
        }))
        
        // Clear the saved data
        localStorage.removeItem('loanApplication')
      } catch (error) {
        console.error("Error parsing saved loan data:", error)
      }
    }

    // Instead of using authStore, let's fetch user data from the backend
    fetchUserData()
  }, [])

  const fetchUserData = async () => {
    try {
      // Looking at your other API calls, let's try a different endpoint structure
      const response = await axios.get("http://localhost:5001/api/auth/profile", {
        withCredentials: true
      })
      
      if (response.data.success) {
        const userData = response.data.user
        setFormData(prev => ({
          ...prev,
          firstName: userData.firstName || "",
          lastName: userData.lastName || "",
          email: userData.email || "",
          phone: userData.phoneNumber || "",
          address: userData.address || "",
          city: userData.city || "",
          postalCode: userData.postalCode || ""
        }))
      }
    } catch (error) {
      console.error("Error fetching user data:", error)
      // Add more detailed error logging
      if (axios.isAxiosError(error)) {
        console.error("Status:", error.response?.status)
        console.error("Response data:", error.response?.data)
      }
    }
  }

  const fetchApplications = async () => {
    try {
      const response = await axios.get("http://localhost:5001/api/users/loans", {
        withCredentials: true
      })
      
      if (response.data.success) {
        setApplications(response.data.loans || [])
      } else {
        console.error("Failed to fetch applications:", response.data.message)
      }
    } catch (error) {
      console.error("Error fetching applications:", error)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setErrorMessage("")
    
    try {
      if (step < 3) {
        setStep(step + 1)
        window.scrollTo(0, 0)
      } else {
        // Create FormData object for file uploads
        const formDataObj = new FormData();
        
        // Add all form fields
        Object.entries(formData).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            formDataObj.append(key, String(value));
          }
        });
        
        // Add files if they exist
        if (documents.idDocument) {
          formDataObj.append('idDocument', documents.idDocument);
        }
        
        if (documents.proofOfIncome) {
          formDataObj.append('proofOfIncome', documents.proofOfIncome);
        }
        
        if (documents.bankStatements) {
          formDataObj.append('bankStatements', documents.bankStatements);
        }
        
        // Log what we're sending
        console.log("Submitting loan application with documents:", documents);
        
        const response = await axios.post(
          "http://localhost:5001/api/users/loans", 
          formDataObj, 
          {
            withCredentials: true,
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          }
        );
        
        if (response.data.success) {
          setSuccessMessage(
            "Your loan application has been successfully submitted. You can track its status in the 'Application Status' tab."
          )
          
          // Refresh applications list
          fetchApplications()
          
          // Reset form after 3 seconds
          setTimeout(() => {
            setSuccessMessage("")
            setStep(1)
            setFormData({
              ...formData,
              firstName: "",
              lastName: "",
              email: "",
              phone: "",
              address: "",
              city: "",
              postalCode: "",
              employmentStatus: "",
              monthlyIncome: "",
              otherLoans: "no",
              otherLoansAmount: "",
              purpose: "",
              additionalInfo: "",
            })
          }, 3000)
        } else {
          setErrorMessage(response.data.message || "Failed to submit application")
        }
      }
    } catch (error: any) {
      console.error("Error submitting application:", error)
      setErrorMessage(error.response?.data?.message || "An error occurred while submitting your application. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const prevStep = () => {
    setStep(step - 1)
    window.scrollTo(0, 0)
  }

  const formatCurrency = (value: number) => {
    return value.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }) + " TND"
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString()
  }

  const getLoanTypeLabel = (type: string) => {
    switch(type) {
      case "personal": return "Personal Loan"
      case "mortgage": return "Mortgage Loan"
      case "auto": return "Auto Loan"
      case "business": return "Business Loan"
      default: return type
    }
  }

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'approved':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
          <CheckCircle className="mr-1 h-3 w-3" /> Approved
        </span>
      case 'rejected':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
          <AlertCircle className="mr-1 h-3 w-3" /> Rejected
        </span>
      case 'pending':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
          <Clock className="mr-1 h-3 w-3" /> Pending
        </span>
      default:
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
          Unknown Status
        </span>
    }
  }

  return (
    <div className="card bg-white shadow-lg rounded-xl border border-gray-100">
      <div className="card-content p-6">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold text-gray-800">Loan Application</h3>
            <div className="text-sm font-medium text-blue-600">Step {step} of 3</div>
          </div>
          <div className="mt-3 h-2 w-full rounded-full bg-gray-100">
            <div
              className="h-2 rounded-full bg-blue-500 transition-all duration-300 ease-in-out"
              style={{ width: `${(step / 3) * 100}%` }}
            ></div>
          </div>
        </div>

        {successMessage && (
          <div className="bg-green-50 text-green-700 p-4 rounded-lg mb-6 flex items-center border border-green-200">
            <CheckCircle className="h-5 w-5 mr-2 flex-shrink-0" />
            <p>{successMessage}</p>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {step === 1 && (
            <div className="space-y-6">
              <h4 className="font-medium">Personal Information</h4>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <label htmlFor="firstName" className="block text-sm font-medium">
                    First Name
                  </label>
                  <input 
                    id="firstName" 
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    placeholder="Enter your first name" 
                    required 
                    className="input" 
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="lastName" className="block text-sm font-medium">
                    Last Name
                  </label>
                  <input 
                    id="lastName" 
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    placeholder="Enter your last name" 
                    required 
                    className="input" 
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <label htmlFor="email" className="block text-sm font-medium">
                    Email Address
                  </label>
                  <input 
                    id="email" 
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter your email" 
                    required 
                    className="input" 
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="phone" className="block text-sm font-medium">
                    Phone Number
                  </label>
                  <input 
                    id="phone" 
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Enter your phone number" 
                    required 
                    className="input" 
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="address" className="block text-sm font-medium">
                  Address
                </label>
                <input 
                  id="address" 
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Enter your address" 
                  required 
                  className="input" 
                />
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <label htmlFor="city" className="block text-sm font-medium">
                    City
                  </label>
                  <input 
                    id="city" 
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="Enter your city" 
                    required 
                    className="input" 
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="postalCode" className="block text-sm font-medium">
                    Postal Code
                  </label>
                  <input 
                    id="postalCode" 
                    name="postalCode"
                    value={formData.postalCode}
                    onChange={handleChange}
                    placeholder="Enter your postal code" 
                    required 
                    className="input" 
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <label htmlFor="employmentStatus" className="block text-sm font-medium">
                    Employment Status
                  </label>
                  <select id="employmentStatus" required className="input">
                    <option value="" disabled selected>
                      Select status
                    </option>
                    <option value="employed">Employed</option>
                    <option value="self-employed">Self-Employed</option>
                    <option value="business-owner">Business Owner</option>
                    <option value="retired">Retired</option>
                    <option value="student">Student</option>
                    <option value="unemployed">Unemployed</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="monthlyIncome" className="block text-sm font-medium">
                  Monthly Income (TND)
                </label>
                <input
                  id="monthlyIncome"
                  type="number"
                  placeholder="Enter monthly income"
                  required
                  className="input"
                />
              </div>

              <div className="flex justify-end">
                <button type="submit" className="btn btn-primary">
                  Next Step
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <h4 className="font-medium">Loan Details</h4>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <label htmlFor="loanType" className="block text-sm font-medium">
                    Loan Type
                  </label>
                  <select 
                    id="loanType" 
                    name="loanType"
                    value={formData.loanType}
                    onChange={handleChange}
                    required 
                    className="input"
                  >
                    <option value="personal">Personal Loan</option>
                    <option value="mortgage">Mortgage Loan</option>
                    <option value="auto">Auto Loan</option>
                    <option value="business">Business Loan</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label htmlFor="amount" className="block text-sm font-medium">
                    Loan Amount (TND)
                  </label>
                  <input 
                    id="amount" 
                    name="amount"
                    type="number" 
                    value={formData.amount}
                    onChange={handleChange}
                    placeholder="Enter loan amount" 
                    required 
                    className="input" 
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <label htmlFor="term" className="block text-sm font-medium">
                    Loan Term (Years)
                  </label>
                  <input 
                    id="term" 
                    name="term"
                    type="number" 
                    value={formData.term}
                    onChange={handleChange}
                    placeholder="Enter loan term" 
                    required 
                    className="input" 
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="interestRate" className="block text-sm font-medium">
                    Interest Rate (%)
                  </label>
                  <input 
                    id="interestRate" 
                    name="interestRate"
                    type="number" 
                    step="0.1"
                    value={formData.interestRate}
                    onChange={handleChange}
                    placeholder="Enter interest rate" 
                    required 
                    className="input" 
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="purpose" className="block text-sm font-medium">
                  Loan Purpose
                </label>
                <input 
                  id="purpose" 
                  name="purpose"
                  value={formData.purpose}
                  onChange={handleChange}
                  placeholder="Enter loan purpose" 
                  required 
                  className="input" 
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="additionalInfo" className="block text-sm font-medium">
                  Additional Information
                </label>
                <textarea
                  id="additionalInfo"
                  name="additionalInfo"
                  value={formData.additionalInfo}
                  onChange={handleChange}
                  placeholder="Provide any additional information about your loan request"
                  rows={4}
                  className="input min-h-[80px]"
                />
              </div>

              <div className="flex justify-between">
                <button type="button" className="btn btn-outline" onClick={prevStep}>
                  Previous Step
                </button>
                <button type="submit" className="btn btn-primary">
                  Next Step
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <h4 className="font-medium">Financial Information & Documents</h4>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <label htmlFor="employmentStatus" className="block text-sm font-medium">
                    Employment Status
                  </label>
                  <select 
                    id="employmentStatus" 
                    name="employmentStatus"
                    value={formData.employmentStatus}
                    onChange={handleChange}
                    required 
                    className="input"
                  >
                    <option value="" disabled>Select status</option>
                    <option value="employed">Employed</option>
                    <option value="self-employed">Self-Employed</option>
                    <option value="business-owner">Business Owner</option>
                    <option value="retired">Retired</option>
                    <option value="student">Student</option>
                    <option value="unemployed">Unemployed</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label htmlFor="monthlyIncome" className="block text-sm font-medium">
                    Monthly Income (TND)
                  </label>
                  <input
                    id="monthlyIncome"
                    name="monthlyIncome"
                    type="number"
                    value={formData.monthlyIncome}
                    onChange={handleChange}
                    placeholder="Enter monthly income"
                    required
                    className="input"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium">Do you have other loans?</label>
                <div className="flex items-center space-x-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="otherLoans"
                      value="yes"
                      checked={formData.otherLoans === "yes"}
                      onChange={handleChange}
                      className="mr-2"
                    />
                    Yes
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="otherLoans"
                      value="no"
                      checked={formData.otherLoans === "no"}
                      onChange={handleChange}
                      className="mr-2"
                    />
                    No
                  </label>
                </div>
              </div>

              {formData.otherLoans === "yes" && (
                <div className="space-y-2">
                  <label htmlFor="otherLoansAmount" className="block text-sm font-medium">
                    Total Amount of Other Loans (TND)
                  </label>
                  <input
                    id="otherLoansAmount"
                    name="otherLoansAmount"
                    type="number"
                    value={formData.otherLoansAmount}
                    onChange={handleChange}
                    placeholder="Enter total amount of other loans"
                    required
                    className="input"
                  />
                </div>
              )}

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <label htmlFor="employer" className="block text-sm font-medium">
                    Employer Name
                  </label>
                  <input id="employer" placeholder="Enter employer name" className="input" />
                </div>
                <div className="space-y-2">
                  <label htmlFor="jobTitle" className="block text-sm font-medium">
                    Job Title
                  </label>
                  <input id="jobTitle" placeholder="Enter job title" className="input" />
                </div>
              </div>

              <div className="space-y-4 border rounded-md p-4">
                <h5 className="font-medium">Required Documents</h5>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium">ID Document</label>
                    <div className="flex items-center gap-2">
                      <input 
                        type="file" 
                        className="input flex-1" 
                        name="idDocument"
                        onChange={handleFileChange}
                      />
                      <button className="btn btn-outline btn-icon">
                        <Upload className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium">Proof of Income</label>
                    <div className="flex items-center gap-2">
                      <input 
                        type="file" 
                        className="input flex-1" 
                        name="proofOfIncome"
                        onChange={handleFileChange}
                      />
                      <button className="btn btn-outline btn-icon">
                        <Upload className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium">Bank Statements (Last 3 months)</label>
                    <div className="flex items-center gap-2">
                      <input 
                        type="file" 
                        className="input flex-1" 
                        name="bankStatements"
                        onChange={handleFileChange}
                      />
                      <button className="btn btn-outline btn-icon">
                        <Upload className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-md border p-4">
                <div className="flex items-start space-x-2">
                  <input type="checkbox" id="terms" className="mt-1" required />
                  <label htmlFor="terms" className="text-sm">
                    I confirm that all information provided is accurate and complete. I authorize Amen Bank to verify
                    the information provided and to obtain credit reports as necessary. I understand that providing
                    false information may result in the rejection of my application.
                  </label>
                </div>
              </div>

              <div className="flex justify-between">
                <button type="button" className="btn btn-outline" onClick={prevStep}>
                  Previous Step
                </button>
                <button type="submit" className="btn btn-primary" disabled={isLoading}>
                  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Submit Application
                </button>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  )
}
