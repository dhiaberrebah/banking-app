"use client"

import { useState, useEffect } from "react"
import { User, Mail, Phone, MapPin, Briefcase, CreditCard, Upload, FileText, ChevronRight, ChevronDown, Check, AlertCircle, CheckCircle } from 'lucide-react'
import axios from 'axios'
import { useAuthStore } from "../store/auth-store" // Import the auth store

interface NewAccountFormProps {
  onSubmit: (data: any) => void
}

export function NewAccountForm({ onSubmit }: NewAccountFormProps) {
  const { currentUser } = useAuthStore() // Get the current user from auth store
  const [currentStep, setCurrentStep] = useState(1)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [filePreviews, setFilePreviews] = useState<Record<string, string>>({})
  const [formData, setFormData] = useState({
    // Personal Information
    firstName: "",
    lastName: "",
    dateOfBirth: "",
    nationality: "Tunisian",
    idType: "national_id",
    idNumber: "",
    
    // Contact Information
    email: "",
    phone: "",
    address: "",
    city: "",
    postalCode: "",
    
    // Employment Information
    employmentStatus: "employed",
    employerName: "",
    jobTitle: "",
    monthlyIncome: "",
    
    // Account Information
    accountType: "current", // Default to current account
    currency: "TND",
    
    // Documents
    idDocument: null,
    proofOfAddress: null,
    proofOfIncome: null,
    
    // Terms - set to true by default
    termsAccepted: true
  })

  // Auto-fill form with user data from auth store
  useEffect(() => {
    if (currentUser) {
      setFormData(prev => ({
        ...prev,
        firstName: currentUser.firstName || "",
        lastName: currentUser.lastName || "",
        email: currentUser.email || "",
        phone: currentUser.phoneNumber || "",
        address: currentUser.address || "",
        idNumber: currentUser.idCardNumber || ""
      }))
    }
  }, [currentUser])

  // Validate a specific field
  const validateField = (name: string, value: any): boolean => {
    let error = ""

    switch (name) {
      case "firstName":
      case "lastName":
        if (!value.trim()) {
          error = `${name === "firstName" ? "First" : "Last"} name is required`
        } else if (!/^[A-Za-z\s]{2,50}$/.test(value)) {
          error = `${name === "firstName" ? "First" : "Last"} name must contain only letters and be 2-50 characters long`
        }
        break
      case "dateOfBirth":
        if (!value) {
          error = "Date of birth is required"
        } else {
          const birthDate = new Date(value)
          const today = new Date()
          const age = today.getFullYear() - birthDate.getFullYear()
          if (age < 18) {
            error = "You must be at least 18 years old"
          } else if (age > 120) {
            error = "Please enter a valid date of birth"
          }
        }
        break
      case "idNumber":
        if (!value.trim()) {
          error = "ID number is required"
        } else if (!/^[A-Za-z0-9]{6,12}$/.test(value)) {
          error = "ID number must be 6-12 alphanumeric characters"
        }
        break
      case "email":
        if (!value.trim()) {
          error = "Email is required"
        } else if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value)) {
          error = "Please enter a valid email address"
        }
        break
      case "phone":
        if (!value.trim()) {
          error = "Phone number is required"
        } else if (!/^\+?[0-9]{10,15}$/.test(value.replace(/\s+/g, ""))) {
          error = "Please enter a valid phone number (10-15 digits)"
        }
        break
      case "address":
        if (!value.trim()) {
          error = "Address is required"
        } else if (value.length < 10) {
          error = "Please enter a complete address (at least 10 characters)"
        }
        break
      case "city":
        if (!value.trim()) {
          error = "City is required"
        }
        break
      case "postalCode":
        if (!value.trim()) {
          error = "Postal code is required"
        } else if (!/^\d{4,5}$/.test(value)) {
          error = "Please enter a valid postal code"
        }
        break
      case "employerName":
        if (formData.employmentStatus === "employed" && !value.trim()) {
          error = "Employer name is required"
        }
        break
      case "jobTitle":
        if (formData.employmentStatus === "employed" && !value.trim()) {
          error = "Job title is required"
        }
        break
      case "monthlyIncome":
        if (!value.trim()) {
          error = "Monthly income is required"
        } else if (isNaN(Number(value)) || Number(value) < 0) {
          error = "Please enter a valid income amount"
        }
        break
      case "idDocument":
      case "proofOfAddress":
        if (!value) {
          error = `${name === "idDocument" ? "ID document" : "Proof of address"} is required`
        }
        break
      case "proofOfIncome":
        if ((formData.employmentStatus === "employed" || formData.employmentStatus === "self_employed") && !value) {
          error = "Proof of income is required"
        }
        break
      case "termsAccepted":
        // Always return true for terms
        return true
    }

    if (error) {
      setErrors(prev => ({ ...prev, [name]: error }))
      return false
    } else {
      setErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
      return true
    }
  }

  // Update handleChange to validate on change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target
    const checked = type === 'checkbox' ? (e.target as HTMLInputElement).checked : undefined
    
    const newValue = type === 'checkbox' ? checked : value
    
    setFormData(prev => ({
      ...prev,
      [name]: newValue
    }))
    
    validateField(name, newValue)
  }

  // Update handleFileChange to properly handle file uploads for all document types
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, files } = e.target
    if (files && files.length > 0) {
      const file = files[0]
      
      // Update form data with the file
      setFormData(prev => ({
        ...prev,
        [name]: file
      }))
      
      // Create a preview URL for the file
      const filePreviewUrl = URL.createObjectURL(file)
      setFilePreviews(prev => ({
        ...prev,
        [name]: filePreviewUrl
      }))
      
      validateField(name, file)
    }
  }

  // Clean up object URLs when component unmounts
  useEffect(() => {
    return () => {
      // Revoke all created object URLs to avoid memory leaks
      Object.values(filePreviews).forEach(url => {
        URL.revokeObjectURL(url)
      })
    }
  }, [filePreviews])

  // Validate current step
  const validateStep = (step: number): boolean => {
    let isValid = true
    
    // Clear previous errors
    setErrors({})
    
    switch (step) {
      case 1: // Personal Information
        isValid = validateField("firstName", formData.firstName) 
          && validateField("lastName", formData.lastName)
          && validateField("dateOfBirth", formData.dateOfBirth)
          && validateField("idNumber", formData.idNumber)
        break
      case 2: // Contact Information
        isValid = validateField("email", formData.email)
          && validateField("phone", formData.phone)
          && validateField("address", formData.address)
          && validateField("city", formData.city)
          && validateField("postalCode", formData.postalCode)
        break
      case 3: // Employment Information
        isValid = validateField("monthlyIncome", formData.monthlyIncome)
        if (formData.employmentStatus === "employed" || formData.employmentStatus === "self_employed") {
          isValid = isValid && validateField("employerName", formData.employerName)
            && validateField("jobTitle", formData.jobTitle)
        }
        break
      case 4: // Account Information
        // No validation needed for account type and currency as they have defaults
        isValid = true
        break
      case 5: // Documents
        isValid = validateField("idDocument", formData.idDocument)
          && validateField("proofOfAddress", formData.proofOfAddress)
        if (formData.employmentStatus === "employed" || formData.employmentStatus === "self_employed") {
          isValid = isValid && validateField("proofOfIncome", formData.proofOfIncome)
        }
        isValid = isValid && validateField("termsAccepted", formData.termsAccepted)
        break
    }
    
    return isValid
  }

  // Update nextStep to validate before proceeding
  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, 5))
    }
  }

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1))
  }

  // Update handleSubmit to validate all steps and properly submit the form with files
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validate all steps
    let isValid = true
    for (let i = 1; i <= 5; i++) {
      if (!validateStep(i)) {
        isValid = false
        setCurrentStep(i)
        break
      }
    }
    
    if (isValid) {
      // Create a complete form data object with all fields including files
      const completeFormData = {
        ...formData,
        // Ensure files are properly included
        idDocument: formData.idDocument,
        proofOfAddress: formData.proofOfAddress,
        proofOfIncome: formData.proofOfIncome
      }
      
      // Submit the form data to the parent component
      onSubmit(completeFormData)
    }
  }

  return (
    <div className="max-w-3xl mx-auto">
      {/* Progress Steps */}
      <div className="flex justify-between mb-8">
        {[1, 2, 3, 4, 5].map((step) => (
          <div key={step} className="flex flex-col items-center">
            <div 
              className={`w-10 h-10 rounded-full flex items-center justify-center font-medium ${
                currentStep === step 
                  ? "bg-blue-600 text-white" 
                  : currentStep > step 
                    ? "bg-green-500 text-white" 
                    : "bg-gray-100 text-gray-500"
              }`}
            >
              {currentStep > step ? <Check className="h-5 w-5" /> : step}
            </div>
            <span className={`text-xs mt-2 ${currentStep >= step ? "text-blue-900" : "text-gray-500"}`}>
              {step === 1 && "Personal"}
              {step === 2 && "Contact"}
              {step === 3 && "Employment"}
              {step === 4 && "Account"}
              {step === 5 && "Documents"}
            </span>
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit}>
        {/* Step 1: Personal Information */}
        {currentStep === 1 && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-blue-900 mb-4">Personal Information</h3>
            
            {/* Display step errors if any */}
            {Object.keys(errors).length > 0 && (
              <div className="p-3 bg-red-50 border-l-4 border-red-500 rounded-md mb-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <AlertCircle className="h-5 w-5 text-red-500" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-red-700">Please correct the errors below</p>
                  </div>
                </div>
              </div>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="form-group">
                <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                  className={`w-full rounded-md border ${errors.firstName ? 'border-red-500' : 'border-gray-300'} py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                  placeholder="Enter your first name"
                />
                {errors.firstName && (
                  <p className="mt-1 text-sm text-red-600">{errors.firstName}</p>
                )}
              </div>
              
              <div className="form-group">
                <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                  className={`w-full rounded-md border ${errors.lastName ? 'border-red-500' : 'border-gray-300'} py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                  placeholder="Enter your last name"
                />
                {errors.lastName && (
                  <p className="mt-1 text-sm text-red-600">{errors.lastName}</p>
                )}
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="form-group">
                <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
                <input
                  type="date"
                  name="dateOfBirth"
                  value={formData.dateOfBirth}
                  onChange={handleChange}
                  required
                  className={`w-full rounded-md border ${errors.dateOfBirth ? 'border-red-500' : 'border-gray-300'} py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                />
                {errors.dateOfBirth && (
                  <p className="mt-1 text-sm text-red-600">{errors.dateOfBirth}</p>
                )}
              </div>
              
              <div className="form-group">
                <label className="block text-sm font-medium text-gray-700 mb-1">Nationality</label>
                <select
                  name="nationality"
                  value={formData.nationality}
                  onChange={handleChange}
                  required
                  className={`w-full rounded-md border ${!errors.nationality ? 'border-gray-300' : 'border-red-500'} py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                >
                  <option value="Tunisian">Tunisian</option>
                  <option value="Other">Other</option>
                </select>
                {errors.nationality && (
                  <p className="mt-1 text-sm text-red-600">{errors.nationality}</p>
                )}
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="form-group">
                <label className="block text-sm font-medium text-gray-700 mb-1">ID Type</label>
                <select
                  name="idType"
                  value={formData.idType}
                  onChange={handleChange}
                  required
                  className={`w-full rounded-md border ${!errors.idType ? 'border-gray-300' : 'border-red-500'} py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                >
                  <option value="national_id">National ID Card</option>
                  <option value="passport">Passport</option>
                  <option value="residence_permit">Residence Permit</option>
                </select>
                {errors.idType && (
                  <p className="mt-1 text-sm text-red-600">{errors.idType}</p>
                )}
              </div>
              
              <div className="form-group">
                <label className="block text-sm font-medium text-gray-700 mb-1">ID Number</label>
                <input
                  type="text"
                  name="idNumber"
                  value={formData.idNumber}
                  onChange={handleChange}
                  required
                  className={`w-full rounded-md border ${!errors.idNumber ? 'border-gray-300' : 'border-red-500'} py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                  placeholder="Enter your ID number"
                />
                {errors.idNumber && (
                  <p className="mt-1 text-sm text-red-600">{errors.idNumber}</p>
                )}
              </div>
            </div>
          </div>
        )}
        
        {/* Step 2: Contact Information */}
        {currentStep === 2 && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-blue-900 mb-4">Contact Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="form-group">
                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="pl-10 w-full rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter your email"
                  />
                </div>
              </div>
              
              <div className="form-group">
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Phone className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    className="pl-10 w-full rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="+216 XX XXX XXX"
                  />
                </div>
              </div>
            </div>
            
            <div className="form-group">
              <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MapPin className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  required
                  className="pl-10 w-full rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter your street address"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="form-group">
                <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  required
                  className="w-full rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter your city"
                />
              </div>
              
              <div className="form-group">
                <label className="block text-sm font-medium text-gray-700 mb-1">Postal Code</label>
                <input
                  type="text"
                  name="postalCode"
                  value={formData.postalCode}
                  onChange={handleChange}
                  required
                  className="w-full rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter postal code"
                />
              </div>
            </div>
          </div>
        )}
        
        {/* Step 3: Employment Information */}
        {currentStep === 3 && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-blue-900 mb-4">Employment Information</h3>
            
            <div className="form-group">
              <label className="block text-sm font-medium text-gray-700 mb-1">Employment Status</label>
              <select
                name="employmentStatus"
                value={formData.employmentStatus}
                onChange={handleChange}
                required
                className="w-full rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="employed">Employed</option>
                <option value="self_employed">Self-Employed</option>
                <option value="unemployed">Unemployed</option>
                <option value="student">Student</option>
                <option value="retired">Retired</option>
              </select>
            </div>
            
            {(formData.employmentStatus === "employed" || formData.employmentStatus === "self_employed") && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="form-group">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Employer Name</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Briefcase className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="text"
                        name="employerName"
                        value={formData.employerName}
                        onChange={handleChange}
                        required
                        className="pl-10 w-full rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Enter employer name"
                      />
                    </div>
                  </div>
                  
                  <div className="form-group">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Job Title</label>
                    <input
                      type="text"
                      name="jobTitle"
                      value={formData.jobTitle}
                      onChange={handleChange}
                      required
                      className="w-full rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter your job title"
                    />
                  </div>
                </div>
                
                <div className="form-group">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Monthly Income (TND)</label>
                  <input
                    type="number"
                    name="monthlyIncome"
                    value={formData.monthlyIncome}
                    onChange={handleChange}
                    required
                    min="0"
                    step="100"
                    className="w-full rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter your monthly income"
                  />
                </div>
              </>
            )}
          </div>
        )}
        
        {/* Step 4: Account Information */}
        {currentStep === 4 && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-blue-900 mb-4">Account Information</h3>
            
            <div className="form-group">
              <label className="block text-sm font-medium text-gray-700 mb-1">Account Type</label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                <div 
                  className={`p-4 border rounded-lg cursor-pointer transition-all ${
                    formData.accountType === "current" 
                      ? "border-blue-500 bg-blue-50" 
                      : "border-gray-200 hover:border-blue-300"
                  }`}
                  onClick={() => setFormData({...formData, accountType: "current"})}
                >
                  <div className="flex items-center mb-2">
                    <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                      formData.accountType === "current" ? "border-blue-500" : "border-gray-300"
                    }`}>
                      {formData.accountType === "current" && (
                        <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                      )}
                    </div>
                    <span className="ml-2 font-medium">Current Account</span>
                  </div>
                  <p className="text-xs text-gray-500">Everyday banking with debit card and checkbook</p>
                </div>
                
                <div 
                  className={`p-4 border rounded-lg cursor-pointer transition-all ${
                    formData.accountType === "savings" 
                      ? "border-blue-500 bg-blue-50" 
                      : "border-gray-200 hover:border-blue-300"
                  }`}
                  onClick={() => setFormData({...formData, accountType: "savings"})}
                >
                  <div className="flex items-center mb-2">
                    <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                      formData.accountType === "savings" ? "border-blue-500" : "border-gray-300"
                    }`}>
                      {formData.accountType === "savings" && (
                        <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                      )}
                    </div>
                    <span className="ml-2 font-medium">Savings Account</span>
                  </div>
                  <p className="text-xs text-gray-500">Earn interest on your deposits</p>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="form-group">
                <label className="block text-sm font-medium text-gray-700 mb-1">Currency</label>
                <select
                  name="currency"
                  value={formData.currency}
                  onChange={handleChange}
                  required
                  className="w-full rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="TND">Tunisian Dinar (TND)</option>
                  <option value="EUR">Euro (EUR)</option>
                  <option value="USD">US Dollar (USD)</option>
                  <option value="GBP">British Pound (GBP)</option>
                </select>
              </div>
              
            
            </div>
          </div>
        )}
        
        {/* Step 5: Documents */}
        {currentStep === 5 && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-blue-900 mb-4">Required Documents</h3>
            <p className="text-sm text-gray-600 mb-4">
              Please upload clear scanned copies or photos of the following documents:
            </p>
            
            <div className="form-group">
              <label className="block text-sm font-medium text-gray-700 mb-1">ID Document (National ID/Passport)</label>
              <div className={`mt-1 flex justify-center px-6 pt-5 pb-6 border-2 ${errors.idDocument ? 'border-red-500' : 'border-gray-300'} border-dashed rounded-md`}>
                {filePreviews.idDocument ? (
                  <div className="text-center">
                    <div className="mb-3">
                      {/* Show image preview if it's an image file */}
                      {formData.idDocument && ['image/jpeg', 'image/png', 'image/jpg'].includes((formData.idDocument as File).type) ? (
                        <img 
                          src={filePreviews.idDocument} 
                          alt="ID Document Preview" 
                          className="mx-auto h-32 object-cover rounded-md"
                        />
                      ) : (
                        <div className="flex items-center justify-center">
                          <FileText className="h-12 w-12 text-blue-500" />
                        </div>
                      )}
                    </div>
                    <p className="text-sm text-gray-700 font-medium">{formData.idDocument ? (formData.idDocument as File).name : ''}</p>
                    <div className="mt-2 flex justify-center">
                      <button
                        type="button"
                        onClick={() => {
                          setFormData(prev => ({ ...prev, idDocument: null }))
                          setFilePreviews(prev => {
                            const newPreviews = { ...prev }
                            delete newPreviews.idDocument
                            return newPreviews
                          })
                        }}
                        className="text-xs text-red-600 hover:text-red-800"
                      >
                        Remove file
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-1 text-center">
                    <Upload className="mx-auto h-12 w-12 text-gray-400" />
                    <div className="flex text-sm text-gray-600">
                      <label htmlFor="idDocument" className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500">
                        <span>Upload a file</span>
                        <input
                          id="idDocument"
                          name="idDocument"
                          type="file"
                          accept="image/jpeg,image/png,image/jpg,application/pdf"
                          className="sr-only"
                          onChange={handleFileChange}
                          required
                        />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs text-gray-500">PNG, JPG, PDF up to 10MB</p>
                  </div>
                )}
              </div>
              {errors.idDocument && (
                <p className="mt-1 text-sm text-red-600">{errors.idDocument}</p>
              )}
            </div>
            
            <div className="form-group">
              <label className="block text-sm font-medium text-gray-700 mb-1">Proof of Address (Utility Bill)</label>
              <div className={`mt-1 flex justify-center px-6 pt-5 pb-6 border-2 ${errors.proofOfAddress ? 'border-red-500' : 'border-gray-300'} border-dashed rounded-md`}>
                {filePreviews.proofOfAddress ? (
                  <div className="text-center">
                    <div className="mb-3">
                      {/* Show image preview if it's an image file */}
                      {formData.proofOfAddress && ['image/jpeg', 'image/png', 'image/jpg'].includes((formData.proofOfAddress as File).type) ? (
                        <img 
                          src={filePreviews.proofOfAddress} 
                          alt="Proof of Address Preview" 
                          className="mx-auto h-32 object-cover rounded-md"
                        />
                      ) : (
                        <div className="flex items-center justify-center">
                          <FileText className="h-12 w-12 text-blue-500" />
                        </div>
                      )}
                    </div>
                    <p className="text-sm text-gray-700 font-medium">{formData.proofOfAddress ? (formData.proofOfAddress as File).name : ''}</p>
                    <div className="mt-2 flex justify-center">
                      <button
                        type="button"
                        onClick={() => {
                          setFormData(prev => ({ ...prev, proofOfAddress: null }))
                          setFilePreviews(prev => {
                            const newPreviews = { ...prev }
                            delete newPreviews.proofOfAddress
                            return newPreviews
                          })
                        }}
                        className="text-xs text-red-600 hover:text-red-800"
                      >
                        Remove file
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-1 text-center">
                    <Upload className="mx-auto h-12 w-12 text-gray-400" />
                    <div className="flex text-sm text-gray-600">
                      <label htmlFor="proofOfAddress" className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500">
                        <span>Upload a file</span>
                        <input
                          id="proofOfAddress"
                          name="proofOfAddress"
                          type="file"
                          accept="image/jpeg,image/png,image/jpg,application/pdf"
                          className="sr-only"
                          onChange={handleFileChange}
                          required
                        />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs text-gray-500">PNG, JPG, PDF up to 10MB</p>
                  </div>
                )}
              </div>
              {errors.proofOfAddress && (
                <p className="mt-1 text-sm text-red-600">{errors.proofOfAddress}</p>
              )}
            </div>
            
            {(formData.employmentStatus === "employed" || formData.employmentStatus === "self_employed") && (
              <div className="form-group">
                <label className="block text-sm font-medium text-gray-700 mb-1">Proof of Income (Pay Slip/Tax Return)</label>
                <div className={`mt-1 flex justify-center px-6 pt-5 pb-6 border-2 ${errors.proofOfIncome ? 'border-red-500' : 'border-gray-300'} border-dashed rounded-md`}>
                  {filePreviews.proofOfIncome ? (
                    <div className="text-center">
                      <div className="mb-3">
                        {/* Show image preview if it's an image file */}
                        {formData.proofOfIncome && ['image/jpeg', 'image/png', 'image/jpg'].includes((formData.proofOfIncome as File).type) ? (
                          <img 
                            src={filePreviews.proofOfIncome} 
                            alt="Proof of Income Preview" 
                            className="mx-auto h-32 object-cover rounded-md"
                          />
                        ) : (
                          <div className="flex items-center justify-center">
                            <FileText className="h-12 w-12 text-blue-500" />
                          </div>
                        )}
                      </div>
                      <p className="text-sm text-gray-700 font-medium">{formData.proofOfIncome ? (formData.proofOfIncome as File).name : ''}</p>
                      <div className="mt-2 flex justify-center">
                        <button
                          type="button"
                          onClick={() => {
                            setFormData(prev => ({ ...prev, proofOfIncome: null }))
                            setFilePreviews(prev => {
                              const newPreviews = { ...prev }
                              delete newPreviews.proofOfIncome
                              return newPreviews
                            })
                          }}
                          className="text-xs text-red-600 hover:text-red-800"
                        >
                          Remove file
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-1 text-center">
                      <Upload className="mx-auto h-12 w-12 text-gray-400" />
                      <div className="flex text-sm text-gray-600">
                        <label htmlFor="proofOfIncome" className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500">
                          <span>Upload a file</span>
                          <input
                            id="proofOfIncome"
                            name="proofOfIncome"
                            type="file"
                            accept="image/jpeg,image/png,image/jpg,application/pdf"
                            className="sr-only"
                            onChange={handleFileChange}
                            required
                          />
                        </label>
                        <p className="pl-1">or drag and drop</p>
                      </div>
                      <p className="text-xs text-gray-500">PNG, JPG, PDF up to 10MB</p>
                    </div>
                  )}
                </div>
                {errors.proofOfIncome && (
                  <p className="mt-1 text-sm text-red-600">{errors.proofOfIncome}</p>
                )}
              </div>
            )}
            
            <div className="form-group mt-6">
              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="termsAccepted"
                    name="termsAccepted"
                    type="checkbox"
                    checked={formData.termsAccepted}
                    onChange={handleChange}
                    required
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                </div>
          
              </div>
            </div>
          </div>
        )}
        
        {/* Navigation Buttons */}
        <div className="flex justify-between mt-8">
          {currentStep > 1 ? (
            <button
              type="button"
              onClick={prevStep}
              className="px-4 py-2 border border-blue-300 text-blue-600 rounded-md hover:bg-blue-50 transition-colors"
            >
              Previous
            </button>
          ) : (
            <div></div>
          )}
          
          {currentStep < 5 ? (
            <button
              type="button"
              onClick={nextStep}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center"
            >
              Next <ChevronRight className="ml-1 h-4 w-4" />
            </button>
          ) : (
            <button
              type="submit"
              onClick={handleSubmit}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center"
            >
              Submit Application <CheckCircle className="ml-1 h-4 w-4" />
            </button>
          )}
        </div>
      </form>
    </div>
  )
}
