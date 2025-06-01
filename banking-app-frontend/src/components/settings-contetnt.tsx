"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Loader2, CheckCircle, AlertCircle, User, Lock } from "lucide-react"
import axios from "axios"

export function SettingsContent() {
  const [activeTab, setActiveTab] = useState("profile")
  const [isLoading, setIsLoading] = useState(false)
  const [successMessage, setSuccessMessage] = useState("")
  const [errorMessage, setErrorMessage] = useState("")
  const [profileData, setProfileData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    address: "",
  })
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })
  const [verificationStep, setVerificationStep] = useState("initial"); // initial, verification, success
  const [verificationCode, setVerificationCode] = useState("");
  const [passwordChangeToken, setPasswordChangeToken] = useState("");

  useEffect(() => {
    fetchUserProfile()
  }, [])

  const fetchUserProfile = async () => {
    setIsLoading(true)
    try {
      // Change from /api/auth/profile to /api/auth/checkAuth which exists in your API
      const response = await axios.get("http://localhost:5001/api/auth/checkAuth", {
        withCredentials: true
      })
      
      if (response.data.user) {
        const userData = response.data.user
        setProfileData({
          firstName: userData.firstName || "",
          lastName: userData.lastName || "",
          email: userData.email || "",
          phoneNumber: userData.phoneNumber || "",
          address: userData.address || "",
        })
      } else {
        setErrorMessage("Failed to load profile data")
      }
    } catch (error) {
      // Improved error handling
      if (axios.isAxiosError(error)) {
        console.error("Error details:", error.response?.data)
        setErrorMessage(`Error: ${error.response?.status} - ${error.message}`)
      } else {
        setErrorMessage("Error loading profile data. Please try again.")
        console.error(error)
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setProfileData(prev => ({ ...prev, [name]: value }))
  }

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setPasswordData(prev => ({ ...prev, [name]: value }))
  }

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setErrorMessage("")
    setSuccessMessage("")

    try {
      // Update to use a valid endpoint
      const response = await axios.put(
        "http://localhost:5001/api/users/update-profile",
        {
          firstName: profileData.firstName,
          lastName: profileData.lastName,
          phoneNumber: profileData.phoneNumber,
          address: profileData.address,
        },
        { withCredentials: true }
      )

      if (response.data.success) {
        setSuccessMessage("Your profile has been updated successfully.")
      } else {
        setErrorMessage(response.data.message || "Failed to update profile")
      }
    } catch (error: any) {
      setErrorMessage(error.response?.data?.message || "Failed to update profile. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setErrorMessage("")
    setSuccessMessage("")

    try {
      // Validate passwords
      if (passwordData.newPassword !== passwordData.confirmPassword) {
        throw new Error("New passwords don't match")
      }

      if (verificationStep === "initial") {
        // Step 1: Request verification code
        const response = await axios.post(
          "http://localhost:5001/api/users/request-password-change",
          { currentPassword: passwordData.currentPassword },
          { withCredentials: true }
        )

        if (response.data.success) {
          setVerificationStep("verification")
          setPasswordChangeToken(response.data.token || "")
          setSuccessMessage("Verification code sent to your email. Please check your inbox.")
        } else {
          setErrorMessage(response.data.message || "Failed to initiate password change")
        }
      } else if (verificationStep === "verification") {
        // Step 2: Verify code and change password
        const response = await axios.post(
          "http://localhost:5001/api/users/verify-password-change",
          {
            token: passwordChangeToken,
            code: verificationCode,
            newPassword: passwordData.newPassword
          },
          { withCredentials: true }
        )

        if (response.data.success) {
          setVerificationStep("success")
          setSuccessMessage("Your password has been updated successfully.")
          setPasswordData({
            currentPassword: "",
            newPassword: "",
            confirmPassword: "",
          })
          // Reset after success
          setTimeout(() => {
            setVerificationStep("initial")
          }, 3000)
        } else {
          setErrorMessage(response.data.message || "Failed to verify code")
        }
      }
    } catch (error: any) {
      setErrorMessage(error.response?.data?.message || error.message || "Failed to update password")
    } finally {
      setIsLoading(false)
    }
  }

  const handleVerificationCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVerificationCode(e.target.value)
  }

  const resetPasswordChange = () => {
    setVerificationStep("initial")
    setVerificationCode("")
    setPasswordChangeToken("")
    setErrorMessage("")
    setSuccessMessage("")
  }

  return (
    <div className="space-y-6">
      {/* Hero Section with Gradient Background */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-8 rounded-xl text-white mb-10 shadow-lg">
        <h2 className="text-3xl font-bold mb-3">Account Settings</h2>
        <p className="text-blue-100 text-lg max-w-2xl">
          Manage your personal information and security settings.
        </p>
      </div>

      {successMessage && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative" role="alert">
          <span className="block sm:inline">{successMessage}</span>
        </div>
      )}

      {errorMessage && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <span className="block sm:inline">{errorMessage}</span>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="tabs">
          <div className="tabs-list grid w-full grid-cols-2 bg-gray-50 p-1 rounded-t-xl border-b">
            <button
              className={`tabs-trigger py-3 font-medium transition-colors flex justify-center items-center gap-2 ${activeTab === "profile" ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-600 hover:text-blue-600"}`}
              onClick={() => setActiveTab("profile")}
            >
              <User className="h-4 w-4" />
              Profile
            </button>
            <button
              className={`tabs-trigger py-3 font-medium transition-colors flex justify-center items-center gap-2 ${activeTab === "password" ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-600 hover:text-blue-600"}`}
              onClick={() => setActiveTab("password")}
            >
              <Lock className="h-4 w-4" />
              Password
            </button>
          </div>

          <div className="p-6">
            {activeTab === "profile" && (
              <div className="card">
                <div className="card-header mb-6">
                  <h2 className="card-title text-xl font-semibold text-gray-800">Profile Information</h2>
                  <p className="text-sm text-gray-500">Update your personal information</p>
                </div>
                <div className="card-content">
                  <form onSubmit={handleProfileSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                      <div className="space-y-2">
                        <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                          First Name
                        </label>
                        <input 
                          id="firstName" 
                          name="firstName"
                          value={profileData.firstName}
                          onChange={handleProfileChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                        />
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                          Last Name
                        </label>
                        <input 
                          id="lastName" 
                          name="lastName"
                          value={profileData.lastName}
                          onChange={handleProfileChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                        Email Address
                      </label>
                      <input 
                        id="email" 
                        name="email"
                        value={profileData.email}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-50 cursor-not-allowed" 
                        disabled
                      />
                      <p className="text-xs text-gray-500">Email cannot be changed for security reasons</p>
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700">
                        Phone Number
                      </label>
                      <input 
                        id="phoneNumber" 
                        name="phoneNumber"
                        value={profileData.phoneNumber}
                        onChange={handleProfileChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                        Address
                      </label>
                      <input 
                        id="address" 
                        name="address"
                        value={profileData.address}
                        onChange={handleProfileChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                      />
                    </div>
                    <div className="flex justify-end">
                      <button
                        type="submit"
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin inline" />
                            Saving...
                          </>
                        ) : (
                          "Save Changes"
                        )}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {activeTab === "password" && (
              <div className="card">
                <div className="card-header mb-6">
                  <h2 className="card-title text-xl font-semibold text-gray-800">Change Password</h2>
                  <p className="text-sm text-gray-500">Update your account password</p>
                </div>
                <div className="card-content">
                  {successMessage && (
                    <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-md">
                      {successMessage}
                    </div>
                  )}
                  {errorMessage && (
                    <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
                      {errorMessage}
                    </div>
                  )}
                  
                  <form onSubmit={handlePasswordSubmit} className="space-y-6">
                    {verificationStep === "initial" && (
                      <div className="space-y-4 bg-gray-50 p-4 rounded-lg">
                        <div className="space-y-2">
                          <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700">
                            Current Password
                          </label>
                          <input 
                            id="currentPassword" 
                            name="currentPassword"
                            type="password" 
                            value={passwordData.currentPassword}
                            onChange={handlePasswordChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">
                            New Password
                          </label>
                          <input 
                            id="newPassword" 
                            name="newPassword"
                            type="password" 
                            value={passwordData.newPassword}
                            onChange={handlePasswordChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                            Confirm New Password
                          </label>
                          <input 
                            id="confirmPassword" 
                            name="confirmPassword"
                            type="password" 
                            value={passwordData.confirmPassword}
                            onChange={handlePasswordChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                            required
                          />
                        </div>
                      </div>
                    )}

                    {verificationStep === "verification" && (
                      <div className="space-y-4 bg-gray-50 p-4 rounded-lg">
                        <p className="text-sm text-gray-700 mb-4">
                          A verification code has been sent to your email. Please enter it below to complete the password change.
                        </p>
                        <div className="space-y-2">
                          <label htmlFor="verificationCode" className="block text-sm font-medium text-gray-700">
                            Verification Code
                          </label>
                          <input 
                            id="verificationCode" 
                            name="verificationCode"
                            type="text" 
                            value={verificationCode}
                            onChange={handleVerificationCodeChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                            required
                          />
                        </div>
                      </div>
                    )}

                    {verificationStep === "success" && (
                      <div className="bg-green-50 p-4 rounded-lg text-center">
                        <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                        <p className="text-green-700 font-medium">Password updated successfully!</p>
                      </div>
                    )}

                    <div className="mt-4 flex justify-end space-x-3">
                      {verificationStep === "verification" && (
                        <button
                          type="button"
                          onClick={resetPasswordChange}
                          className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
                        >
                          Back
                        </button>
                      )}
                      
                      {verificationStep !== "success" && (
                        <button
                          type="submit"
                          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                          disabled={isLoading}
                        >
                          {isLoading ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin inline" />
                              {verificationStep === "initial" ? "Sending Code..." : "Verifying..."}
                            </>
                          ) : (
                            verificationStep === "initial" ? "Send Verification Code" : "Verify & Change Password"
                          )}
                        </button>
                      )}
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
