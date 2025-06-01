"use client"

import type React from "react"
import { useState, useRef, useEffect, type ChangeEvent, type FormEvent } from "react"
import { Link, useNavigate } from "react-router-dom"
import {
  User,
  Mail,
  Lock,
  Phone,
  MapPin,
  Calendar,
  CreditCard,
  Upload,
  X,
  Check,
  Loader2,
  Eye,
  EyeOff,
  ChevronRight,
  ChevronLeft,
  UserCheck,
  FileText,
  CheckCircle,
  AlertCircle,
} from "lucide-react"

export default function SignUpPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [currentStep, setCurrentStep] = useState(1)
  const [animationDirection, setAnimationDirection] = useState<"next" | "prev">("next")
  const formRef = useRef<HTMLDivElement>(null)
  const [showErrorToast, setShowErrorToast] = useState(false)
  const [errorToastMessage, setErrorToastMessage] = useState("")
  const [showSuccessToast, setShowSuccessToast] = useState(false)
  const [successToastMessage, setSuccessToastMessage] = useState("")

  // Get register function from auth store
  const navigate = useNavigate()

  // Form data state
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    address: "",
    phoneNumber: "",
    age: "",
    gender: "",
    email: "",
    password: "",
    confirmPassword: "",
    idCardNumber: "",
    idCardFrontPhoto: "",
    idCardBackPhoto: "",
  })

  // Handle form input changes
  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))

    // Clear error when field is edited
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }

    // Perform real-time validation for certain fields
    if (["email", "password", "confirmPassword", "phoneNumber", "idCardNumber"].includes(name) && value.trim() !== "") {
      validateField(name, value)
    }
  }

  // Validate a specific field
  const validateField = (name: string, value: string) => {
    let error = ""

    switch (name) {
      case "firstName":
      case "lastName":
        if (value && !/^[A-Za-z\s]{2,50}$/.test(value)) {
          error = `${name === "firstName" ? "First" : "Last"} name must contain only letters and be 2-50 characters long`
        }
        break
      case "email":
        if (value && !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value)) {
          error = "Please enter a valid email address"
        }
        break
      case "phoneNumber":
        if (value && !/^\+?[0-9]{10,15}$/.test(value.replace(/\s+/g, ""))) {
          error = "Please enter a valid phone number (10-15 digits)"
        }
        break
      case "age":
        const ageNum = Number.parseInt(value)
        if (value && (isNaN(ageNum) || ageNum < 18 || ageNum > 120)) {
          error = "Please enter a valid age (18-120)"
        }
        break
      case "password":
        if (value) {
          if (value.length < 8) {
            error = "Password must be at least 8 characters"
          } else if (!/(?=.*[a-z])/.test(value)) {
            error = "Password must include at least one lowercase letter"
          } else if (!/(?=.*[A-Z])/.test(value)) {
            error = "Password must include at least one uppercase letter"
          } else if (!/(?=.*\d)/.test(value)) {
            error = "Password must include at least one number"
          } else if (!/(?=.*[!@#$%^&*])/.test(value)) {
            error = "Password must include at least one special character (!@#$%^&*)"
          }
        }
        break
      case "confirmPassword":
        if (value && value !== formData.password) {
          error = "Passwords don't match"
        }
        break
      case "idCardNumber":
        if (value && !/^[A-Za-z0-9]{6,12}$/.test(value)) {
          error = "ID card number must be 6-12 alphanumeric characters"
        }
        break
    }

    if (error) {
      setErrors((prev) => ({ ...prev, [name]: error }))
      return false
    }
    return true
  }

  // Validate current step
  const validateStep = (step: number) => {
    const newErrors: Record<string, string> = {}
    let isValid = true

    if (step === 1) {
      // First Name validation
      if (!formData.firstName.trim()) {
        newErrors.firstName = "First name is required"
        isValid = false
      } else if (!/^[A-Za-z\s]{2,50}$/.test(formData.firstName)) {
        newErrors.firstName = "First name must contain only letters and be 2-50 characters long"
        isValid = false
      }

      // Last Name validation
      if (!formData.lastName.trim()) {
        newErrors.lastName = "Last name is required"
        isValid = false
      } else if (!/^[A-Za-z\s]{2,50}$/.test(formData.lastName)) {
        newErrors.lastName = "Last name must contain only letters and be 2-50 characters long"
        isValid = false
      }

      // Address validation
      if (!formData.address.trim()) {
        newErrors.address = "Address is required"
        isValid = false
      } else if (formData.address.length < 10) {
        newErrors.address = "Please enter a complete address (at least 10 characters)"
        isValid = false
      }

      // Phone Number validation
      if (!formData.phoneNumber.trim()) {
        newErrors.phoneNumber = "Phone number is required"
        isValid = false
      } else if (!/^\+?[0-9]{10,15}$/.test(formData.phoneNumber.replace(/\s+/g, ""))) {
        newErrors.phoneNumber = "Please enter a valid phone number (10-15 digits)"
        isValid = false
      }

      // Age validation
      if (!formData.age.trim()) {
        newErrors.age = "Age is required"
        isValid = false
      } else {
        const ageNum = Number.parseInt(formData.age)
        if (isNaN(ageNum)) {
          newErrors.age = "Age must be a number"
          isValid = false
        } else if (ageNum < 18) {
          newErrors.age = "You must be at least 18 years old"
          isValid = false
        } else if (ageNum > 120) {
          newErrors.age = "Please enter a valid age"
          isValid = false
        }
      }

      // Gender validation
      if (!formData.gender) {
        newErrors.gender = "Please select your gender"
        isValid = false
      }
    } else if (step === 2) {
      // Email validation
      if (!formData.email.trim()) {
        newErrors.email = "Email is required"
        isValid = false
      } else if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(formData.email)) {
        newErrors.email = "Please enter a valid email address"
        isValid = false
      }

      // Password validation
      if (!formData.password) {
        newErrors.password = "Password is required"
        isValid = false
      } else if (formData.password.length < 8) {
        newErrors.password = "Password must be at least 8 characters"
        isValid = false
      } else if (!/(?=.*[a-z])/.test(formData.password)) {
        newErrors.password = "Password must include at least one lowercase letter"
        isValid = false
      } else if (!/(?=.*[A-Z])/.test(formData.password)) {
        newErrors.password = "Password must include at least one uppercase letter"
        isValid = false
      } else if (!/(?=.*\d)/.test(formData.password)) {
        newErrors.password = "Password must include at least one number"
        isValid = false
      } else if (!/(?=.*[!@#$%^&*])/.test(formData.password)) {
        newErrors.password = "Password must include at least one special character (!@#$%^&*)"
        isValid = false
      }

      // Confirm Password validation
      if (!formData.confirmPassword) {
        newErrors.confirmPassword = "Please confirm your password"
        isValid = false
      } else if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = "Passwords don't match"
        isValid = false
      }
    } else if (step === 3) {
      // ID Card Number validation
      if (!formData.idCardNumber.trim()) {
        newErrors.idCardNumber = "ID card number is required"
        isValid = false
      } else if (!/^[A-Za-z0-9]{6,12}$/.test(formData.idCardNumber)) {
        newErrors.idCardNumber = "ID card number must be 6-12 alphanumeric characters"
        isValid = false
      }

      // ID Card Front Photo validation
      if (!formData.idCardFrontPhoto) {
        newErrors.idCardFrontPhoto = "ID card front photo is required"
        isValid = false
      }

      // ID Card Back Photo validation
      if (!formData.idCardBackPhoto) {
        newErrors.idCardBackPhoto = "ID card back photo is required"
        isValid = false
      }
    }

    setErrors(newErrors)
    return isValid
  }

  // Validate all form data
  const validateForm = () => {
    return validateStep(1) && validateStep(2) && validateStep(3)
  }

  // Handle next step
  const handleNextStep = () => {
    if (validateStep(currentStep)) {
      setAnimationDirection("next")
      setTimeout(() => {
        setCurrentStep((prev) => Math.min(prev + 1, 4))
      }, 50)
    }
  }

  // Handle previous step
  const handlePrevStep = () => {
    setAnimationDirection("prev")
    setTimeout(() => {
      setCurrentStep((prev) => Math.max(prev - 1, 1))
    }, 50)
  }

  // Handle form submission
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      // Find the first step with errors and go to it
      if (
        Object.keys(errors).some((key) =>
          ["firstName", "lastName", "address", "phoneNumber", "age", "gender"].includes(key),
        )
      ) {
        setCurrentStep(1)
      } else if (Object.keys(errors).some((key) => ["email", "password", "confirmPassword"].includes(key))) {
        setCurrentStep(2)
      } else if (
        Object.keys(errors).some((key) => ["idCardNumber", "idCardFrontPhoto", "idCardBackPhoto"].includes(key))
      ) {
        setCurrentStep(3)
      }
      return
    }

    setIsLoading(true)

    try {
      // Create FormData object for API call
      const formDataObj = new FormData()

      // Add all text fields
      formDataObj.append("firstName", formData.firstName)
      formDataObj.append("lastName", formData.lastName)
      formDataObj.append("address", formData.address)
      formDataObj.append("phoneNumber", formData.phoneNumber)
      formDataObj.append("age", formData.age)
      formDataObj.append("gender", formData.gender)
      formDataObj.append("email", formData.email)
      formDataObj.append("password", formData.password)
      formDataObj.append("idCardNumber", formData.idCardNumber)

      // Convert base64 images to files and add them to FormData
      if (formData.idCardFrontPhoto) {
        const frontPhotoFile = await dataURLtoFile(formData.idCardFrontPhoto, "idCardFront.jpg")
        formDataObj.append("idCardFrontPhoto", frontPhotoFile)
      }

      if (formData.idCardBackPhoto) {
        const backPhotoFile = await dataURLtoFile(formData.idCardBackPhoto, "idCardBack.jpg")
        formDataObj.append("idCardBackPhoto", backPhotoFile)
      }

      // Make the actual API call to the backend
      const response = await fetch("http://localhost:5001/api/auth/signup", {
        method: "POST",
        body: formDataObj,
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Failed to create account")
      }

      // Show success message and move to step 4
      setCurrentStep(4)
      setShowSuccessToast(true)
      setSuccessToastMessage(data.message || "Account created successfully!")

      // Auto hide the success toast after 5 seconds
      setTimeout(() => {
        setShowSuccessToast(false)
      }, 5000)

      // Redirect to login page after a delay
      setTimeout(() => {
        navigate("/login")
      }, 5000)
    } catch (error) {
      console.error("Error creating account:", error)
      setShowErrorToast(true)
      setErrorToastMessage(error instanceof Error ? error.message : "Error creating account. Please try again.")

      // Auto hide the error toast after 5 seconds
      setTimeout(() => {
        setShowErrorToast(false)
      }, 5000)
    } finally {
      setIsLoading(false)
    }
  }

  // Helper function to convert base64 to File object
  const dataURLtoFile = async (dataurl: string, filename: string): Promise<File> => {
    const arr = dataurl.split(",")
    const mime = arr[0].match(/:(.*?);/)?.[1] || "image/jpeg"
    const bstr = atob(arr[1])
    let n = bstr.length
    const u8arr = new Uint8Array(n)

    while (n--) {
      u8arr[n] = bstr.charCodeAt(n)
    }

    return new File([u8arr], filename, { type: mime })
  }

  // Scroll to top when changing steps
  useEffect(() => {
    if (formRef.current) {
      formRef.current.scrollIntoView({ behavior: "smooth", block: "start" })
    }
  }, [currentStep])

  // Password strength indicator component
  const PasswordStrengthIndicator = ({ password }: { password: string }) => {
    // Calculate password strength
    const getPasswordStrength = (password: string) => {
      let strength = 0

      if (password.length >= 8) strength += 1
      if (/[A-Z]/.test(password)) strength += 1
      if (/[a-z]/.test(password)) strength += 1
      if (/[0-9]/.test(password)) strength += 1
      if (/[^A-Za-z0-9]/.test(password)) strength += 1

      return strength
    }

    const strength = getPasswordStrength(password)

    // Determine color and label based on strength
    const getStrengthColor = () => {
      if (strength <= 1) return "bg-red-500"
      if (strength <= 3) return "bg-yellow-500"
      return "bg-green-500"
    }

    const getStrengthLabel = () => {
      if (strength <= 1) return "Weak"
      if (strength <= 3) return "Medium"
      return "Strong"
    }

    if (!password) return null

    return (
      <div className="mt-1">
        <div className="flex items-center space-x-2">
          <div className="h-2 flex-1 bg-gray-200 rounded-full overflow-hidden">
            <div
              className={`h-full ${getStrengthColor()} transition-all duration-300`}
              style={{ width: `${(strength / 5) * 100}%` }}
            />
          </div>
          <span className="text-xs font-medium">{getStrengthLabel()}</span>
        </div>
      </div>
    )
  }

  // Password requirements component
  const PasswordRequirements = ({ password }: { password: string }) => {
    if (!password) return null

    const requirements = [
      { met: password.length >= 8, text: "At least 8 characters" },
      { met: /[A-Z]/.test(password), text: "At least one uppercase letter" },
      { met: /[a-z]/.test(password), text: "At least one lowercase letter" },
      { met: /[0-9]/.test(password), text: "At least one number" },
      { met: /[!@#$%^&*]/.test(password), text: "At least one special character (!@#$%^&*)" },
    ]

    return (
      <div className="mt-2">
        <p className="text-xs font-medium text-gray-700 mb-1">Password requirements:</p>
        <ul className="space-y-1">
          {requirements.map((req, index) => (
            <li key={index} className="flex items-center text-xs">
              <span className={`mr-2 ${req.met ? "text-green-500" : "text-gray-400"} transition-colors duration-300`}>
                {req.met ? "✓" : "○"}
              </span>
              <span className={req.met ? "text-green-700" : "text-gray-500"}>{req.text}</span>
            </li>
          ))}
        </ul>
      </div>
    )
  }

  // File upload component
  const FileUpload = ({
    name,
    value,
    onChange,
  }: { name: string; value: string; onChange: (name: string, value: string) => void }) => {
    const [isDragging, setIsDragging] = useState(false)
    const [isUploading, setIsUploading] = useState(false)
    const fileInputRef = useRef<HTMLInputElement>(null)

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault()
      e.stopPropagation()
      setIsDragging(true)
    }

    const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault()
      e.stopPropagation()
      setIsDragging(false)
    }

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault()
      e.stopPropagation()
      setIsDragging(false)

      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        handleFile(e.dataTransfer.files[0])
      }
    }

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files[0]) {
        handleFile(e.target.files[0])
      }
    }

    const handleFile = (file: File) => {
      // Check file type
      if (!file.type.startsWith("image/")) {
        setErrors((prev) => ({ ...prev, [name]: "Please upload an image file" }))
        return
      }

      // Check file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        setErrors((prev) => ({ ...prev, [name]: "File size must be less than 5MB" }))
        return
      }

      // Simulate upload
      setIsUploading(true)

      const reader = new FileReader()
      reader.onload = (e) => {
        // In a real app, you would upload to your server/cloud storage here
        // and get back a URL to store in your form
        setTimeout(() => {
          onChange(name, e.target?.result as string)
          setIsUploading(false)

          // Clear error if exists
          if (errors[name]) {
            setErrors((prev) => {
              const newErrors = { ...prev }
              delete newErrors[name]
              return newErrors
            })
          }
        }, 1000)
      }
      reader.readAsDataURL(file)
    }

    const handleRemove = (e: React.MouseEvent) => {
      e.stopPropagation()
      onChange(name, "")
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    }

    const handleClick = () => {
      fileInputRef.current?.click()
    }

    return (
      <div className="space-y-2">
        <div
          onClick={handleClick}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`relative flex flex-col items-center justify-center rounded-lg border border-dashed p-6 transition-all duration-300 cursor-pointer hover:bg-gray-50 ${
            isDragging ? "border-blue-500 bg-blue-50 scale-102" : "border-gray-300"
          } ${value ? "bg-gray-50" : "bg-white"}`}
        >
          <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} className="sr-only" />

          {isUploading ? (
            <div className="flex flex-col items-center justify-center space-y-2">
              <div className="h-12 w-12 animate-pulse rounded-full bg-gray-200" />
              <p className="text-sm text-gray-500">Uploading...</p>
            </div>
          ) : value ? (
            <div className="relative flex w-full flex-col items-center">
              <div className="relative h-40 w-full overflow-hidden rounded-lg">
                <img src={value || "/placeholder.svg"} alt="Uploaded file" className="h-full w-full object-cover" />
                <button
                  type="button"
                  className="absolute right-2 top-2 rounded-full bg-red-500 p-1 text-white hover:bg-red-600 transition-colors duration-200 transform hover:scale-110"
                  onClick={handleRemove}
                >
                  <X className="h-4 w-4" />
                </button>
                <div className="absolute bottom-2 right-2 rounded-full bg-green-500 p-1 text-white">
                  <Check className="h-4 w-4" />
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center space-y-2">
              <div className="rounded-full bg-blue-100 p-2">
                <Upload className="h-6 w-6 text-blue-500" />
              </div>
              <div className="space-y-1 text-center">
                <p className="text-sm font-medium">Drag & drop or click to upload</p>
                <p className="text-xs text-gray-500">Image files (max 5MB)</p>
              </div>
            </div>
          )}
        </div>

        {errors[name] && <p className="text-xs text-red-500">{errors[name]}</p>}
      </div>
    )
  }

  // Handle file upload changes
  const handleFileChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  // Step indicators
  const steps = [
    { id: 1, name: "Personal", icon: User },
    { id: 2, name: "Account", icon: UserCheck },
    { id: 3, name: "Identification", icon: FileText },
    { id: 4, name: "Complete", icon: CheckCircle },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 flex flex-col">
      {/* Animated background shapes */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-100 rounded-full opacity-50 animate-float-slow"></div>
        <div className="absolute top-1/4 -left-20 w-60 h-60 bg-blue-200 rounded-full opacity-40 animate-float-medium"></div>
        <div className="absolute bottom-1/3 right-1/4 w-40 h-40 bg-blue-300 rounded-full opacity-30 animate-float-fast"></div>
      </div>

      {/* Header */}
      

      {/* Main content */}
      <div className="flex-grow flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl w-full space-y-8" ref={formRef}>
          <div className="text-center animate-fade-in">
            <h2 className="text-3xl font-extrabold text-gray-900">Create your account</h2>
            <p className="mt-2 text-sm text-gray-600">Complete all steps to get started with AMEN BANK</p>
          </div>

          {/* Step indicators */}
          <div className="flex justify-center animate-fade-in-delay">
            <nav className="flex" aria-label="Progress">
              <ol className="flex items-center">
                {steps.map((step, stepIdx) => (
                  <li key={step.id} className={`relative ${stepIdx !== steps.length - 1 ? "pr-8 sm:pr-20" : ""}`}>
                    {step.id < currentStep ? (
                      <div className="group">
                        <span className="flex items-center">
                          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-blue-700 shadow-md transition-all duration-300">
                            <Check className="h-5 w-5 text-white" aria-hidden="true" />
                          </span>
                          <span className="ml-3 text-sm font-medium text-gray-900 hidden sm:block">{step.name}</span>
                        </span>
                        {stepIdx !== steps.length - 1 && (
                          <div className="absolute top-5 left-5 -ml-px mt-0.5 h-0.5 w-full bg-blue-600" />
                        )}
                      </div>
                    ) : step.id === currentStep ? (
                      <div className="flex items-center" aria-current="step">
                        <span className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-blue-600 bg-white transition-all duration-300 animate-pulse-slow">
                          <step.icon className="h-5 w-5 text-blue-600" aria-hidden="true" />
                        </span>
                        <span className="ml-3 text-sm font-medium text-blue-600 hidden sm:block">{step.name}</span>
                        {stepIdx !== steps.length - 1 && (
                          <div className="absolute top-5 left-5 -ml-px mt-0.5 h-0.5 w-full bg-gray-300" />
                        )}
                      </div>
                    ) : (
                      <div className="group">
                        <span className="flex items-center">
                          <span className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-gray-300 bg-white transition-all duration-300">
                            <step.icon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                          </span>
                          <span className="ml-3 text-sm font-medium text-gray-500 hidden sm:block">{step.name}</span>
                        </span>
                        {stepIdx !== steps.length - 1 && (
                          <div className="absolute top-5 left-5 -ml-px mt-0.5 h-0.5 w-full bg-gray-300" />
                        )}
                      </div>
                    )}
                  </li>
                ))}
              </ol>
            </nav>
          </div>

          {/* Form content */}
          <div className="bg-white/90 backdrop-blur-sm shadow-xl rounded-lg overflow-hidden transform transition-all duration-500 hover:shadow-2xl animate-fade-in-up">
            <form onSubmit={handleSubmit}>
              {/* Step content with animations */}
              <div className="relative">
                {/* Step 1: Personal Information */}
                <div
                  className={`transition-all duration-500 ease-in-out ${
                    currentStep === 1
                      ? "opacity-100 translate-x-0"
                      : currentStep < 1
                        ? "opacity-0 -translate-x-full absolute inset-0"
                        : "opacity-0 translate-x-full absolute inset-0"
                  }`}
                >
                  <div className="px-6 py-8 bg-gradient-to-br from-blue-50 to-white">
                    <h3 className="text-lg font-medium text-gray-900 border-b pb-2">Personal Information</h3>

                    {Object.keys(errors).length > 0 &&
                      Object.keys(errors).some((key) =>
                        ["firstName", "lastName", "address", "phoneNumber", "age", "gender"].includes(key),
                      ) && (
                        <div className="mt-4 mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-md animate-shake">
                          <div className="flex">
                            <div className="flex-shrink-0">
                              <AlertCircle className="h-5 w-5 text-red-500" />
                            </div>
                            <div className="ml-3">
                              <h3 className="text-sm font-medium text-red-800">Please correct the following errors:</h3>
                              <div className="mt-2 text-sm text-red-700">
                                <ul className="list-disc space-y-1 pl-5">
                                  {Object.entries(errors)
                                    .filter(([key]) =>
                                      ["firstName", "lastName", "address", "phoneNumber", "age", "gender"].includes(
                                        key,
                                      ),
                                    )
                                    .map(([key, value]) => (
                                      <li key={key}>{value}</li>
                                    ))}
                                </ul>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                    <div className="mt-6 space-y-6">
                      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                        {/* First Name */}
                        <div className="transform transition-all duration-300 hover:translate-y-[-2px]">
                          <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                            First Name
                          </label>
                          <div className="mt-1 relative rounded-md shadow-sm">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <User className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                              type="text"
                              id="firstName"
                              name="firstName"
                              value={formData.firstName}
                              onChange={handleChange}
                              className={`block w-full pl-10 pr-3 py-3 border ${
                                errors.firstName ? "border-red-300" : "border-gray-300"
                              } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-all duration-300 focus:shadow-md`}
                              placeholder="John"
                            />
                          </div>
                          {errors.firstName && <p className="mt-2 text-sm text-red-600">{errors.firstName}</p>}
                        </div>

                        {/* Last Name */}
                        <div className="transform transition-all duration-300 hover:translate-y-[-2px]">
                          <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                            Last Name
                          </label>
                          <div className="mt-1 relative rounded-md shadow-sm">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <User className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                              type="text"
                              id="lastName"
                              name="lastName"
                              value={formData.lastName}
                              onChange={handleChange}
                              className={`block w-full pl-10 pr-3 py-3 border ${
                                errors.lastName ? "border-red-300" : "border-gray-300"
                              } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-all duration-300 focus:shadow-md`}
                              placeholder="Doe"
                            />
                          </div>
                          {errors.lastName && <p className="mt-2 text-sm text-red-600">{errors.lastName}</p>}
                        </div>
                      </div>

                      {/* Address */}
                      <div className="transform transition-all duration-300 hover:translate-y-[-2px]">
                        <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                          Address
                        </label>
                        <div className="mt-1 relative rounded-md shadow-sm">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <MapPin className="h-5 w-5 text-gray-400" />
                          </div>
                          <input
                            type="text"
                            id="address"
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                            className={`block w-full pl-10 pr-3 py-3 border ${
                              errors.address ? "border-red-300" : "border-gray-300"
                            } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-all duration-300 focus:shadow-md`}
                            placeholder="123 Main St, City, Country"
                          />
                        </div>
                        {errors.address && <p className="mt-2 text-sm text-red-600">{errors.address}</p>}
                      </div>

                      <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
                        {/* Phone Number */}
                        <div className="transform transition-all duration-300 hover:translate-y-[-2px]">
                          <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700">
                            Phone Number
                          </label>
                          <div className="mt-1 relative rounded-md shadow-sm">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <Phone className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                              type="tel"
                              id="phoneNumber"
                              name="phoneNumber"
                              value={formData.phoneNumber}
                              onChange={handleChange}
                              className={`block w-full pl-10 pr-3 py-3 border ${
                                errors.phoneNumber ? "border-red-300" : "border-gray-300"
                              } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-all duration-300 focus:shadow-md`}
                              placeholder="+1 234 567 8900"
                            />
                          </div>
                          {errors.phoneNumber && <p className="mt-2 text-sm text-red-600">{errors.phoneNumber}</p>}
                          <p className="mt-1 text-xs text-gray-500">Include country code (e.g., +1 for US)</p>
                        </div>

                        {/* Age */}
                        <div className="transform transition-all duration-300 hover:translate-y-[-2px]">
                          <label htmlFor="age" className="block text-sm font-medium text-gray-700">
                            Age
                          </label>
                          <div className="mt-1 relative rounded-md shadow-sm">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <Calendar className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                              type="number"
                              id="age"
                              name="age"
                              value={formData.age}
                              onChange={handleChange}
                              min="18"
                              className={`block w-full pl-10 pr-3 py-3 border ${
                                errors.age ? "border-red-300" : "border-gray-300"
                              } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-all duration-300 focus:shadow-md`}
                            />
                          </div>
                          {errors.age && <p className="mt-2 text-sm text-red-600">{errors.age}</p>}
                        </div>

                        {/* Gender */}
                        <div className="transform transition-all duration-300 hover:translate-y-[-2px]">
                          <label htmlFor="gender" className="block text-sm font-medium text-gray-700">
                            Gender
                          </label>
                          <div className="mt-1 relative rounded-md shadow-sm">
                            <select
                              id="gender"
                              name="gender"
                              value={formData.gender}
                              onChange={handleChange}
                              className={`block w-full py-3 px-3 border ${
                                errors.gender ? "border-red-300" : "border-gray-300"
                              } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-all duration-300 focus:shadow-md`}
                            >
                              <option value="" disabled>
                                Select gender
                              </option>
                              <option value="male">Male</option>
                              <option value="female">Female</option>
                              <option value="other">Other</option>
                              <option value="prefer-not-to-say">Prefer not to say</option>
                            </select>
                          </div>
                          {errors.gender && <p className="mt-2 text-sm text-red-600">{errors.gender}</p>}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Step 2: Account Information */}
                <div
                  className={`transition-all duration-500 ease-in-out ${
                    currentStep === 2
                      ? "opacity-100 translate-x-0"
                      : currentStep < 2
                        ? "opacity-0 translate-x-full absolute inset-0"
                        : "opacity-0 -translate-x-full absolute inset-0"
                  }`}
                >
                  <div className="px-6 py-8 bg-gradient-to-br from-indigo-50 to-white">
                    <h3 className="text-lg font-medium text-gray-900 border-b pb-2">Account Information</h3>

                    {Object.keys(errors).length > 0 &&
                      Object.keys(errors).some((key) => ["email", "password", "confirmPassword"].includes(key)) && (
                        <div className="mt-4 mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-md animate-shake">
                          <div className="flex">
                            <div className="flex-shrink-0">
                              <AlertCircle className="h-5 w-5 text-red-500" />
                            </div>
                            <div className="ml-3">
                              <h3 className="text-sm font-medium text-red-800">Please correct the following errors:</h3>
                              <div className="mt-2 text-sm text-red-700">
                                <ul className="list-disc space-y-1 pl-5">
                                  {Object.entries(errors)
                                    .filter(([key]) => ["email", "password", "confirmPassword"].includes(key))
                                    .map(([key, value]) => (
                                      <li key={key}>{value}</li>
                                    ))}
                                </ul>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                    <div className="mt-6 space-y-6">
                      {/* Email */}
                      <div className="transform transition-all duration-300 hover:translate-y-[-2px]">
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                          Email
                        </label>
                        <div className="mt-1 relative rounded-md shadow-sm">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Mail className="h-5 w-5 text-gray-400" />
                          </div>
                          <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className={`block w-full pl-10 pr-3 py-3 border ${
                              errors.email ? "border-red-300" : "border-gray-300"
                            } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-all duration-300 focus:shadow-md`}
                            placeholder="you@example.com"
                          />
                        </div>
                        {errors.email && <p className="mt-2 text-sm text-red-600">{errors.email}</p>}
                      </div>

                      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                        {/* Password */}
                        <div className="transform transition-all duration-300 hover:translate-y-[-2px]">
                          <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                            Password
                          </label>
                          <div className="mt-1 relative rounded-md shadow-sm">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <Lock className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                              type={showPassword ? "text" : "password"}
                              id="password"
                              name="password"
                              value={formData.password}
                              onChange={handleChange}
                              className={`block w-full pl-10 pr-10 py-3 border ${
                                errors.password ? "border-red-300" : "border-gray-300"
                              } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-all duration-300 focus:shadow-md`}
                              placeholder="••••••••"
                            />
                            <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                              <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="text-gray-400 hover:text-gray-500 focus:outline-none transition-colors duration-200"
                              >
                                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                              </button>
                            </div>
                          </div>
                          {errors.password && <p className="mt-2 text-sm text-red-600">{errors.password}</p>}
                          <PasswordStrengthIndicator password={formData.password} />
                          <PasswordRequirements password={formData.password} />
                        </div>

                        {/* Confirm Password */}
                        <div className="transform transition-all duration-300 hover:translate-y-[-2px]">
                          <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                            Confirm Password
                          </label>
                          <div className="mt-1 relative rounded-md shadow-sm">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <Lock className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                              type={showConfirmPassword ? "text" : "password"}
                              id="confirmPassword"
                              name="confirmPassword"
                              value={formData.confirmPassword}
                              onChange={handleChange}
                              className={`block w-full pl-10 pr-10 py-3 border ${
                                errors.confirmPassword ? "border-red-300" : "border-gray-300"
                              } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-all duration-300 focus:shadow-md`}
                              placeholder="••••••••"
                            />
                            <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                              <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="text-gray-400 hover:text-gray-500 focus:outline-none transition-colors duration-200"
                              >
                                {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                              </button>
                            </div>
                          </div>
                          {errors.confirmPassword && (
                            <p className="mt-2 text-sm text-red-600">{errors.confirmPassword}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Step 3: Identification */}
                <div
                  className={`transition-all duration-500 ease-in-out ${
                    currentStep === 3
                      ? "opacity-100 translate-x-0"
                      : currentStep < 3
                        ? "opacity-0 translate-x-full absolute inset-0"
                        : "opacity-0 -translate-x-full absolute inset-0"
                  }`}
                >
                  <div className="px-6 py-8 bg-gradient-to-br from-purple-50 to-white">
                    <h3 className="text-lg font-medium text-gray-900 border-b pb-2">Identification</h3>

                    {Object.keys(errors).length > 0 &&
                      Object.keys(errors).some((key) =>
                        ["idCardNumber", "idCardFrontPhoto", "idCardBackPhoto"].includes(key),
                      ) && (
                        <div className="mt-4 mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-md animate-shake">
                          <div className="flex">
                            <div className="flex-shrink-0">
                              <AlertCircle className="h-5 w-5 text-red-500" />
                            </div>
                            <div className="ml-3">
                              <h3 className="text-sm font-medium text-red-800">Please correct the following errors:</h3>
                              <div className="mt-2 text-sm text-red-700">
                                <ul className="list-disc space-y-1 pl-5">
                                  {Object.entries(errors)
                                    .filter(([key]) =>
                                      ["idCardNumber", "idCardFrontPhoto", "idCardBackPhoto"].includes(key),
                                    )
                                    .map(([key, value]) => (
                                      <li key={key}>{value}</li>
                                    ))}
                                </ul>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                    <div className="mt-6 space-y-6">
                      {/* ID Card Number */}
                      <div className="transform transition-all duration-300 hover:translate-y-[-2px]">
                        <label htmlFor="idCardNumber" className="block text-sm font-medium text-gray-700">
                          ID Card Number
                        </label>
                        <div className="mt-1 relative rounded-md shadow-sm">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <CreditCard className="h-5 w-5 text-gray-400" />
                          </div>
                          <input
                            type="text"
                            id="idCardNumber"
                            name="idCardNumber"
                            value={formData.idCardNumber}
                            onChange={handleChange}
                            className={`block w-full pl-10 pr-3 py-3 border ${
                              errors.idCardNumber ? "border-red-300" : "border-gray-300"
                            } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-all duration-300 focus:shadow-md`}
                            placeholder="Enter your ID card number"
                          />
                        </div>
                        {errors.idCardNumber && <p className="mt-2 text-sm text-red-600">{errors.idCardNumber}</p>}
                        <p className="mt-1 text-xs text-gray-500">
                          Enter your government-issued ID number (6-12 characters)
                        </p>
                      </div>

                      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                        {/* ID Card Front Photo */}
                        <div className="transform transition-all duration-300 hover:translate-y-[-2px]">
                          <label htmlFor="idCardFrontPhoto" className="block text-sm font-medium text-gray-700">
                            ID Card Front Photo
                          </label>
                          <div className="mt-1">
                            <FileUpload
                              name="idCardFrontPhoto"
                              value={formData.idCardFrontPhoto}
                              onChange={handleFileChange}
                            />
                          </div>
                        </div>

                        {/* ID Card Back Photo */}
                        <div className="transform transition-all duration-300 hover:translate-y-[-2px]">
                          <label htmlFor="idCardBackPhoto" className="block text-sm font-medium text-gray-700">
                            ID Card Back Photo
                          </label>
                          <div className="mt-1">
                            <FileUpload
                              name="idCardBackPhoto"
                              value={formData.idCardBackPhoto}
                              onChange={handleFileChange}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Step 4: Complete */}
                <div
                  className={`transition-all duration-500 ease-in-out ${
                    currentStep === 4
                      ? "opacity-100 translate-x-0"
                      : currentStep < 4
                        ? "opacity-0 translate-x-full absolute inset-0"
                        : "opacity-0 -translate-x-full absolute inset-0"
                  }`}
                >
                  <div className="px-6 py-8 bg-gradient-to-br from-green-50 to-white">
                    <div className="flex flex-col items-center justify-center py-6">
                      <div className="mx-auto h-20 w-20 bg-green-100 rounded-full flex items-center justify-center animate-bounce-slow">
                        <CheckCircle className="h-10 w-10 text-green-600" />
                      </div>
                      <h3 className="mt-4 text-2xl font-extrabold text-gray-900 animate-fade-in">Account Created!</h3>
                      <p className="mt-2 text-center text-gray-600 max-w-md animate-fade-in-delay">
                        Your account has been successfully created. You will be redirected to the login page in a few
                        seconds.
                      </p>
                      <div className="mt-6">
                        <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Navigation buttons */}
              {currentStep !== 4 && (
                <div className="px-6 py-4 bg-gradient-to-r from-gray-50 to-gray-100 border-t border-gray-200 flex items-center justify-between">
                  {currentStep > 1 ? (
                    <button
                      type="button"
                      onClick={handlePrevStep}
                      className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300 transform hover:translate-x-[-2px] active:translate-x-[1px]"
                    >
                      <ChevronLeft className="mr-2 h-4 w-4" />
                      Previous
                    </button>
                  ) : (
                    <div></div>
                  )}
                  <button
                    type="button"
                    onClick={currentStep === 3 ? handleSubmit : handleNextStep}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300 ease-in-out transform hover:translate-x-[2px] active:translate-x-[-1px]"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Processing...
                      </>
                    ) : currentStep === 3 ? (
                      <>
                        Create Account
                        <CheckCircle className="ml-2 h-4 w-4" />
                      </>
                    ) : (
                      <>
                        Next
                        <ChevronRight className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </button>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white/80 backdrop-blur-sm py-4 border-t border-gray-200 relative z-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-center md:flex-row md:justify-between">
            <div className="flex items-center">
              <p className="text-sm text-gray-500">&copy; 2025 AMEN BANK. All rights reserved.</p>
            </div>
            <div className="mt-4 md:mt-0">
              <div className="flex space-x-6">
                <a
                  href="#"
                  className="text-sm text-gray-500 hover:text-gray-900 transition-colors duration-200 relative group"
                >
                  Privacy Policy
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gray-500 transition-all duration-300 group-hover:w-full"></span>
                </a>
                <a
                  href="#"
                  className="text-sm text-gray-500 hover:text-gray-900 transition-colors duration-200 relative group"
                >
                  Terms of Service
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gray-500 transition-all duration-300 group-hover:w-full"></span>
                </a>
                <a
                  href="#"
                  className="text-sm text-gray-500 hover:text-gray-900 transition-colors duration-200 relative group"
                >
                  Contact Us
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gray-500 transition-all duration-300 group-hover:w-full"></span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* Toast Notifications */}
      {showErrorToast && (
        <div className="fixed top-4 right-4 z-50 animate-slide-in-right">
          <div className="bg-white border-l-4 border-red-500 shadow-lg rounded-lg p-4 max-w-sm flex items-start space-x-3">
            <div className="flex-shrink-0">
              <AlertCircle className="h-5 w-5 text-red-500" />
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-medium text-gray-900">Error</h3>
              <p className="mt-1 text-sm text-gray-600">{errorToastMessage}</p>
            </div>
            <button
              type="button"
              className="flex-shrink-0 text-gray-400 hover:text-gray-500 transition-colors duration-200"
              onClick={() => setShowErrorToast(false)}
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {showSuccessToast && (
        <div className="fixed top-4 right-4 z-50 animate-slide-in-right">
          <div className="bg-white border-l-4 border-green-500 shadow-lg rounded-lg p-4 max-w-sm flex items-start space-x-3">
            <div className="flex-shrink-0">
              <CheckCircle className="h-5 w-5 text-green-500" />
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-medium text-gray-900">Success</h3>
              <p className="mt-1 text-sm text-gray-600">{successToastMessage}</p>
            </div>
            <button
              type="button"
              className="flex-shrink-0 text-gray-400 hover:text-gray-500 transition-colors duration-200"
              onClick={() => setShowSuccessToast(false)}
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* Add CSS for animations */}
      <style >{`
        @keyframes slide-in-right {
          0% {
            transform: translateX(100%);
            opacity: 0;
          }
          100% {
            transform: translateX(0);
            opacity: 1;
          }
        }
        @keyframes slide-out-right {
          0% {
            transform: translateX(0);
            opacity: 1;
          }
          100% {
            transform: translateX(100%);
            opacity: 0;
          }
        }
        .animate-slide-in-right {
          animation: slide-in-right 0.3s ease-out forwards;
        }
        .animate-slide-out-right {
          animation: slide-out-right 0.3s ease-in forwards;
        }
        @keyframes fade-in {
          0% {
            opacity: 0;
          }
          100% {
            opacity: 1;
          }
        }
        .animate-fade-in {
          animation: fade-in 0.5s ease-out forwards;
        }
        .animate-fade-in-delay {
          animation: fade-in 0.5s ease-out 0.2s forwards;
          opacity: 0;
        }
        @keyframes fade-in-up {
          0% {
            opacity: 0;
            transform: translateY(20px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.5s ease-out forwards;
        }
        @keyframes shake {
          0%, 100% {
            transform: translateX(0);
          }
          10%, 30%, 50%, 70%, 90% {
            transform: translateX(-5px);
          }
          20%, 40%, 60%, 80% {
            transform: translateX(5px);
          }
        }
        .animate-shake {
          animation: shake 0.6s ease-in-out;
        }
        @keyframes float-slow {
          0%, 100% {
            transform: translateY(0) translateX(0);
          }
          50% {
            transform: translateY(-20px) translateX(10px);
          }
        }
        .animate-float-slow {
          animation: float-slow 15s ease-in-out infinite;
        }
        @keyframes float-medium {
          0%, 100% {
            transform: translateY(0) translateX(0);
          }
          50% {
            transform: translateY(15px) translateX(-10px);
          }
        }
        .animate-float-medium {
          animation: float-medium 12s ease-in-out infinite;
        }
        @keyframes float-fast {
          0%, 100% {
            transform: translateY(0) translateX(0);
          }
          50% {
            transform: translateY(-10px) translateX(5px);
          }
        }
        .animate-float-fast {
          animation: float-fast 8s ease-in-out infinite;
        }
        @keyframes pulse-slow {
          0%, 100% {
            transform: scale(1);
            opacity: 1;
          }
          50% {
            transform: scale(1.05);
            opacity: 0.8;
          }
        }
        .animate-pulse-slow {
          animation: pulse-slow 3s ease-in-out infinite;
        }
        @keyframes bounce-slow {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }
        .animate-bounce-slow {
          animation: bounce-slow 2s ease-in-out infinite;
        }
        @keyframes spin-slow {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
        .animate-spin-slow {
          animation: spin-slow 3s linear infinite;
        }
      `}</style>
    </div>
  )
}
