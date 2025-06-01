"use client"

import { useState, useRef, useEffect, type FormEvent } from "react"
import { Link, useNavigate } from "react-router-dom"
import {
  Mail,
  Lock,
  Loader2,
  Eye,
  EyeOff,
  KeyRound,
  RefreshCw,
  CheckCircle,
  AlertCircle,
  X,
  Shield,
  Clock,
  AlertTriangle,
} from "lucide-react"
import { useAuthStore } from "../store/auth-store"
import axios from 'axios'

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [step, setStep] = useState<"login" | "verify" | "pending" | "success">("login")
  const [verificationCode, setVerificationCode] = useState("")
  const [resendDisabled, setResendDisabled] = useState(false)
  const [countdown, setCountdown] = useState(0)
  const formRef = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()

  // Add these state variables to the top of the component with the other state declarations
  const [showErrorToast, setShowErrorToast] = useState(false)
  const [errorToastMessage, setErrorToastMessage] = useState("")
  const [showSuccessToast, setShowSuccessToast] = useState(false)
  const [successToastMessage, setSuccessToastMessage] = useState("")
  const [rememberMe, setRememberMe] = useState(false)
  const [isResending, setIsResending] = useState(false)

  // Get login function from auth store
  const { login } = useAuthStore()

  // Handle login form submission
  const handleLogin = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)

    try {
      // Validate inputs
      if (!email || !password) {
        throw new Error("Please fill in all fields")
      }

      // Use the login function from auth store
      const result = await login(email, password)
      
      if (result.success) {
        if (result.requiresVerification) {
          // If login is successful, move to verification step
          setStep("verify")
          setShowSuccessToast(true)
          setSuccessToastMessage("Credentials verified! Please enter the verification code sent to your email.")

          // Auto hide the success toast after 5 seconds
          setTimeout(() => {
            setShowSuccessToast(false)
          }, 5000)
        } else {
          // Direct navigation to dashboard without verification step
          setShowSuccessToast(true)
          setSuccessToastMessage("Login successful! Redirecting to dashboard...")
          
          // Auto hide the success toast after 3 seconds
          setTimeout(() => {
            setShowSuccessToast(false)
          }, 3000)
          
          // Redirect to dashboard
          setTimeout(() => {
            navigate("/dashboard")
          }, 1500)
        }
      } else {
        throw new Error("Login failed. Please check your credentials.")
      }
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message)
        setShowErrorToast(true)
        setErrorToastMessage(err.message)

        // Auto hide the error toast after 5 seconds
        setTimeout(() => {
          setShowErrorToast(false)
        }, 5000)
      } else {
        setError("An unexpected error occurred")
        setShowErrorToast(true)
        setErrorToastMessage("An unexpected error occurred")

        // Auto hide the error toast after 5 seconds
        setTimeout(() => {
          setShowErrorToast(false)
        }, 5000)
      }
    } finally {
      setIsLoading(false)
    }
  }

  // Handle verification code submission
  const handleVerify = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)

    try {
      // Validate verification code
      if (!verificationCode) {
        throw new Error("Please enter the verification code")
      }

      // Get the email from localStorage that was saved during login
      const storedEmail = localStorage.getItem('pendingVerificationEmail')
      if (!storedEmail) {
        throw new Error("Email information missing. Please try logging in again.")
      }
      
      console.log("Submitting verification code:", verificationCode, "for email:", storedEmail)
      
      // Use the verifyCode function from auth store
      const { verifyCode } = useAuthStore.getState()
      const success = await verifyCode(verificationCode, storedEmail)
      
      if (success) {
        // If verification is successful, show success and redirect
        setStep("success")
        setShowSuccessToast(true)
        setSuccessToastMessage("Verification successful! Redirecting to dashboard...")

        // Clear the stored email as it's no longer needed
        localStorage.removeItem('pendingVerificationEmail')

        // Auto hide the success toast after 5 seconds
        setTimeout(() => {
          setShowSuccessToast(false)
        }, 5000)

        // Redirect to dashboard after a short delay
        setTimeout(() => {
          navigate("/dashboard")
        }, 2000)
      } else {
        throw new Error("Invalid verification code")
      }
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message)
        setShowErrorToast(true)
        setErrorToastMessage(err.message)
        
        // Auto hide the error toast after 5 seconds
        setTimeout(() => {
          setShowErrorToast(false)
        }, 5000)
      }
    } finally {
      setIsLoading(false)
    }
  }

  // Handle resend verification code
  const handleResendCode = async () => {
    if (resendDisabled || isResending) return;
    
    setIsResending(true);
    setError(null);
    
    try {
      // Get the email from localStorage
      const storedEmail = localStorage.getItem('pendingVerificationEmail');
      if (!storedEmail) {
        throw new Error("Email information missing. Please try logging in again.");
      }
      
      // Use the resendVerificationCode function from auth store
      const { resendVerificationCode } = useAuthStore.getState();
      const success = await resendVerificationCode(storedEmail);
      
      if (success) {
        setShowSuccessToast(true);
        setSuccessToastMessage("Verification code resent to your email");
        
        // Disable resend button for 60 seconds
        setResendDisabled(true);
        setCountdown(60);
        
        // Start countdown timer
        const timer = setInterval(() => {
          setCountdown((prev) => {
            if (prev <= 1) {
              clearInterval(timer);
              setResendDisabled(false);
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
        
        // Auto hide the success toast after 5 seconds
        setTimeout(() => {
          setShowSuccessToast(false);
        }, 5000);
      } else {
        throw new Error("Failed to resend verification code");
      }
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
        setShowErrorToast(true);
        setErrorToastMessage(err.message);
        
        // Auto hide the error toast after 5 seconds
        setTimeout(() => {
          setShowErrorToast(false);
        }, 5000);
      }
    } finally {
      setIsResending(false);
    }
  };

  // Countdown timer for resend button
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000)
      return () => clearTimeout(timer)
    } else if (countdown === 0 && resendDisabled) {
      setResendDisabled(false)
    }
  }, [countdown, resendDisabled])

  // Scroll to top when changing steps
  useEffect(() => {
    if (formRef.current) {
      formRef.current.scrollIntoView({ behavior: "smooth", block: "start" })
    }
  }, [step])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 flex flex-col">
      {/* Animated background shapes */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-100 rounded-full opacity-50 animate-float-slow"></div>
        <div className="absolute top-1/4 -left-20 w-60 h-60 bg-blue-200 rounded-full opacity-40 animate-float-medium"></div>
        <div className="absolute bottom-1/3 right-1/4 w-40 h-40 bg-blue-300 rounded-full opacity-30 animate-float-fast"></div>
      </div>

      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm py-4 shadow-sm border-b border-gray-200 relative z-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            
            <Link
              to="/register"
              className="text-sm font-medium text-blue-600 hover:text-blue-500 transition-colors relative group"
            >
              Don't have an account? Sign up
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-500 transition-all duration-300 group-hover:w-full"></span>
            </Link>
          </div>
        </div>
      </header>

      {/* Main content */}
      <div className="flex-grow flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8" ref={formRef}>
          {/* Login Step */}
          {step === "login" && (
            <div className="bg-white/90 backdrop-blur-sm shadow-xl rounded-lg overflow-hidden transform transition-all duration-500 hover:shadow-2xl animate-fade-in-up">
              <div className="px-6 py-8 bg-gradient-to-br from-blue-50 to-white">
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-extrabold text-gray-900 animate-fade-in">Sign in</h2>
                  <p className="mt-2 text-sm text-gray-600 animate-fade-in-delay">Please enter your details.</p>
                </div>

                {error && (
                  <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-md animate-shake">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <AlertCircle className="h-5 w-5 text-red-500" />
                      </div>
                      <div className="ml-3">
                        <p className="text-sm text-red-700">{error}</p>
                      </div>
                    </div>
                  </div>
                )}

                <form onSubmit={handleLogin} className="space-y-6">
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
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-all duration-300 focus:shadow-md"
                        placeholder="you@example.com"
                        required
                      />
                    </div>
                  </div>

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
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-all duration-300 focus:shadow-md"
                        placeholder="••••••••"
                        required
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
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <input
                        id="remember-me"
                        name="remember-me"
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded transition-colors duration-200"
                      />
                      <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                        Remember me
                      </label>
                    </div>

                    <div className="text-sm">
                      <Link
                        to="/forgot-password"
                        className="font-medium text-blue-600 hover:text-blue-500 transition-colors duration-200 relative group"
                      >
                        Forgot your password?
                        <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-500 transition-all duration-300 group-hover:w-full"></span>
                      </Link>
                    </div>
                  </div>

                  <div>
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300 ease-in-out disabled:opacity-70 disabled:cursor-not-allowed transform hover:translate-y-[-2px] active:translate-y-[1px]"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4" />
                          Signing in...
                        </>
                      ) : (
                        "Sign in"
                      )}
                    </button>
                  </div>
                </form>
              </div>
              <div className="px-6 py-4 bg-gradient-to-r from-blue-50 to-blue-100 border-t border-gray-200 flex items-center justify-center">
                <Shield className="h-4 w-4 text-blue-500 mr-2" />
                <span className="text-xs text-gray-600">Secure login with 256-bit encryption</span>
              </div>
            </div>
          )}

          {/* Pending Approval Step */}
          {step === "pending" && (
            <div className="bg-white/90 backdrop-blur-sm shadow-xl rounded-lg overflow-hidden transform transition-all duration-500 hover:shadow-2xl animate-fade-in-up">
              <div className="px-6 py-8 bg-gradient-to-br from-yellow-50 to-white">
                <div className="text-center mb-8">
                  <div className="mx-auto h-16 w-16 bg-yellow-100 rounded-full flex items-center justify-center animate-pulse-slow">
                    <Clock className="h-8 w-8 text-yellow-600" />
                  </div>
                  <h2 className="mt-4 text-3xl font-extrabold text-gray-900 animate-fade-in">Account Pending</h2>
                  <p className="mt-2 text-sm text-gray-600 animate-fade-in-delay">
                    Your account is still pending approval
                  </p>
                </div>

                <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded-md mb-6 animate-fade-in-delay">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <AlertTriangle className="h-5 w-5 text-yellow-500" />
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-yellow-800">Account Not Approved</h3>
                      <div className="mt-2 text-sm text-yellow-700">
                        <p>
                          Your account is currently under review by our team. This process typically takes 1-2 business
                          days. You'll receive an email notification once your account has been approved.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <p className="text-sm text-gray-600 text-center">
                    If you have any questions, please contact our support team.
                  </p>
                  <div className="flex justify-center space-x-4">
                    <Link
                      to="/contact"
                      className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300"
                    >
                      Contact Support
                    </Link>
                    <button
                      type="button"
                      onClick={() => setStep("login")}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300"
                    >
                      Back to Login
                    </button>
                  </div>
                </div>
              </div>
              <div className="px-6 py-4 bg-gradient-to-r from-yellow-50 to-yellow-100 border-t border-gray-200 flex items-center justify-center">
                <Shield className="h-4 w-4 text-yellow-500 mr-2" />
                <span className="text-xs text-gray-600">
                  For security reasons, all accounts require approval before access is granted
                </span>
              </div>
            </div>
          )}

          {/* Verification Step */}
          {step === "verify" && (
            <div className="bg-white/90 backdrop-blur-sm shadow-xl rounded-lg overflow-hidden transform transition-all duration-500 hover:shadow-2xl animate-fade-in-up">
              <div className="px-6 py-8 bg-gradient-to-br from-blue-50 to-white">
                <div className="text-center mb-8">
                  <div className="mx-auto h-16 w-16 bg-blue-100 rounded-full flex items-center justify-center animate-pulse-slow">
                    <KeyRound className="h-8 w-8 text-blue-600" />
                  </div>
                  <h2 className="mt-4 text-3xl font-extrabold text-gray-900 animate-fade-in">Verification</h2>
                  <p className="mt-2 text-sm text-gray-600 animate-fade-in-delay">
                    We've sent a verification code to {email}
                  </p>
                </div>

                {error && (
                  <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-md animate-shake">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <AlertCircle className="h-5 w-5 text-red-500" />
                      </div>
                      <div className="ml-3">
                        <p className="text-sm text-red-700">{error}</p>
                      </div>
                    </div>
                  </div>
                )}

                <form onSubmit={handleVerify} className="space-y-6">
                  <div className="transform transition-all duration-300 hover:translate-y-[-2px]">
                    <label htmlFor="verificationCode" className="block text-sm font-medium text-gray-700">
                      Verification Code
                    </label>
                    <div className="mt-1">
                      <input
                        type="text"
                        id="verificationCode"
                        name="verificationCode"
                        value={verificationCode}
                        onChange={(e) => setVerificationCode(e.target.value.replace(/[^0-9]/g, "").slice(0, 6))}
                        className="block w-full py-3 px-4 border border-gray-300 rounded-md shadow-sm text-center text-lg tracking-widest placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 focus:shadow-md"
                        placeholder="000000"
                        maxLength={6}
                        required
                      />
                    </div>
                  </div>

                  <div className="text-center">
                    <button
                      type="button"
                      onClick={handleResendCode}
                      disabled={resendDisabled}
                      className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-500 disabled:text-gray-400 transition-colors duration-300 relative group"
                    >
                      <RefreshCw className={`mr-1 h-4 w-4 ${resendDisabled ? "animate-spin-slow" : ""}`} />
                      {resendDisabled ? `Resend code in ${countdown}s` : "Resend code"}
                      <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-500 transition-all duration-300 group-hover:w-full"></span>
                    </button>
                  </div>

                  <div>
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300 ease-in-out disabled:opacity-70 disabled:cursor-not-allowed transform hover:translate-y-[-2px] active:translate-y-[1px]"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4" />
                          Verifying...
                        </>
                      ) : (
                        "Verify and Sign in"
                      )}
                    </button>
                  </div>

                  <div className="text-center">
                    <button
                      type="button"
                      onClick={() => setStep("login")}
                      className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors duration-300 relative group"
                    >
                      Back to login
                      <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gray-500 transition-all duration-300 group-hover:w-full"></span>
                    </button>
                  </div>
                </form>
              </div>
              <div className="px-6 py-4 bg-gradient-to-r from-blue-50 to-blue-100 border-t border-gray-200 flex items-center justify-center">
                <Shield className="h-4 w-4 text-blue-500 mr-2" />
                <span className="text-xs text-gray-600">Secure verification with 256-bit encryption</span>
              </div>
            </div>
          )}

          {/* Success Step */}
          {step === "success" && (
            <div className="bg-white/90 backdrop-blur-sm shadow-xl rounded-lg overflow-hidden transform transition-all duration-500 hover:shadow-2xl animate-fade-in-up">
              <div className="px-6 py-8 bg-gradient-to-br from-green-50 to-white">
                <div className="text-center mb-8">
                  <div className="mx-auto h-16 w-16 bg-green-100 rounded-full flex items-center justify-center animate-bounce-slow">
                    <CheckCircle className="h-8 w-8 text-green-600" />
                  </div>
                  <h2 className="mt-4 text-3xl font-extrabold text-gray-900 animate-fade-in">Success!</h2>
                  <p className="mt-2 text-sm text-gray-600 animate-fade-in-delay">
                    You have been successfully authenticated.
                  </p>
                </div>

                <div className="flex flex-col items-center justify-center">
                  <p className="text-sm text-gray-600 mb-4">Redirecting to your dashboard...</p>
                  <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                </div>
              </div>
            </div>
          )}
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
