"use client"

import type React from "react"

import { useState, useRef, type FormEvent, useEffect } from "react"
import { Link } from "react-router-dom"
import {
  Mail,
  User,
  CreditCard,
  Lock,
  Upload,
  Loader2,
  CheckCircle,
  AlertCircle,
  X,
  Shield,
  ArrowLeft,
  Info,
} from "lucide-react"
import axios from "axios"

// Define keyframe animations
const keyframes = {
  fadeIn: `
    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
  `,
  slideInRight: `
    @keyframes slideInRight {
      from { transform: translateX(100%); opacity: 0; }
      to { transform: translateX(0); opacity: 1; }
    }
  `,
  fadeInUp: `
    @keyframes fadeInUp {
      from { transform: translateY(20px); opacity: 0; }
      to { transform: translateY(0); opacity: 1; }
    }
  `,
  pulse: `
    @keyframes pulse {
      0% { transform: scale(1); }
      50% { transform: scale(1.05); }
      100% { transform: scale(1); }
    }
  `,
  float: `
    @keyframes float {
      0% { transform: translateY(0px); }
      50% { transform: translateY(-10px); }
      100% { transform: translateY(0px); }
    }
  `,
  bounce: `
    @keyframes bounce {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-10px); }
    }
  `,
  spin: `
    @keyframes spin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }
  `,
  shimmer: `
    @keyframes shimmer {
      0% { background-position: -200% 0; }
      100% { background-position: 200% 0; }
    }
  `,
}

export default function ForgotPasswordPage() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    idCardNumber: "",
    lastPassword: "",
  })
  const [idCardPhoto, setIdCardPhoto] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [showErrorToast, setShowErrorToast] = useState(false)
  const [errorToastMessage, setErrorToastMessage] = useState("")
  const [showSuccessToast, setShowSuccessToast] = useState(false)
  const [showInfoTooltip, setShowInfoTooltip] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [animateBackground, setAnimateBackground] = useState(0)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Background animation effect
  useEffect(() => {
    const interval = setInterval(() => {
      setAnimateBackground((prev) => (prev + 1) % 100)
    }, 100)
    return () => clearInterval(interval)
  }, [])

  // Auto-hide toasts after 5 seconds
  useEffect(() => {
    if (showErrorToast) {
      const timer = setTimeout(() => {
        setShowErrorToast(false)
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [showErrorToast])

  useEffect(() => {
    if (showSuccessToast) {
      const timer = setTimeout(() => {
        setShowSuccessToast(false)
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [showSuccessToast])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader()
      reader.onload = (event) => {
        if (event.target?.result) {
          setIdCardPhoto(event.target.result as string)
        }
      }
      reader.readAsDataURL(e.target.files[0])
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const reader = new FileReader()
      reader.onload = (event) => {
        if (event.target?.result) {
          setIdCardPhoto(event.target.result as string)
        }
      }
      reader.readAsDataURL(e.dataTransfer.files[0])
    }
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)

    try {
      // Validate inputs
      if (!formData.fullName || !formData.email || !formData.idCardNumber || !idCardPhoto) {
        throw new Error("Please fill in all required fields and upload your ID card photo")
      }

      // Convert base64 image to file
      const dataURLtoFile = (dataurl: string, filename: string) => {
        const arr = dataurl.split(",")
        const mime = arr[0].match(/:(.*?);/)![1]
        const bstr = atob(arr[1])
        let n = bstr.length
        const u8arr = new Uint8Array(n)
        while (n--) {
          u8arr[n] = bstr.charCodeAt(n)
        }
        return new File([u8arr], filename, { type: mime })
      }

      // Create FormData object
      const formDataObj = new FormData()
      formDataObj.append("fullName", formData.fullName)
      formDataObj.append("email", formData.email)
      formDataObj.append("idCardNumber", formData.idCardNumber)

      if (formData.lastPassword) {
        formDataObj.append("lastPassword", formData.lastPassword)
      }

      if (idCardPhoto) {
        const photoFile = dataURLtoFile(idCardPhoto, "idCardPhoto.jpg")
        formDataObj.append("idCardPhoto", photoFile)
      }

      // Make API call
      const response = await axios.post("http://localhost:5001/api/auth/forgot-password-request", formDataObj, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })

      if (response.data.success) {
        setSuccess(true)
        setShowSuccessToast(true)
        setFormData({
          fullName: "",
          email: "",
          idCardNumber: "",
          lastPassword: "",
        })
        setIdCardPhoto(null)
      }
    } catch (err: any) {
      const message = err.response?.data?.message || err.message || "Failed to submit request"
      setError(message)
      setShowErrorToast(true)
      setErrorToastMessage(message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: `linear-gradient(135deg, rgba(239, 246, 255, 1) 0%, rgba(255, 255, 255, 0.9) 50%, rgba(224, 242, 254, 0.8) 100%)`,
        display: "flex",
        flexDirection: "column",
      }}
    >
      <style>
        {Object.values(keyframes).join("\n")}
        {`
          .animate-fade-in {
            animation: fadeIn 0.5s ease-out forwards;
          }
          .animate-slide-in-right {
            animation: slideInRight 0.3s ease-out forwards;
          }
          .animate-fade-in-up {
            animation: fadeInUp 0.5s ease-out forwards;
          }
          .animate-pulse-slow {
            animation: pulse 3s infinite ease-in-out;
          }
          .animate-float {
            animation: float 6s infinite ease-in-out;
          }
          .animate-bounce-slow {
            animation: bounce 2s infinite ease-in-out;
          }
          .animate-spin {
            animation: spin 1s linear infinite;
          }
          .animate-shimmer {
            background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.5), transparent);
            background-size: 200% 100%;
            animation: shimmer 2s infinite;
          }
          .staggered-fade-in {
            opacity: 0;
            transform: translateY(10px);
            animation: fadeInUp 0.5s ease-out forwards;
          }
          .hover-scale {
            transition: transform 0.2s ease-out;
          }
          .hover-scale:hover {
            transform: scale(1.02);
          }
          .hover-lift {
            transition: transform 0.2s ease-out, box-shadow 0.2s ease-out;
          }
          .hover-lift:hover {
            transform: translateY(-2px);
            box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
          }
          .focus-ring {
            transition: box-shadow 0.2s ease-out;
          }
          .focus-ring:focus {
            box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.3);
            outline: none;
          }
        `}
      </style>

      {/* Animated background elements */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          zIndex: -10,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: "-10rem",
            right: "-10rem",
            width: "20rem",
            height: "20rem",
            borderRadius: "100%",
            background: "rgba(219, 234, 254, 0.5)",
            opacity: 0.5,
            animation: "float 15s infinite ease-in-out",
            transform: `translateY(${Math.sin(animateBackground / 15) * 20}px) rotate(${Math.sin(animateBackground / 20) * 5}deg)`,
          }}
        ></div>
        <div
          style={{
            position: "absolute",
            top: "25%",
            left: "-5rem",
            width: "15rem",
            height: "15rem",
            borderRadius: "100%",
            background: "rgba(191, 219, 254, 0.4)",
            opacity: 0.4,
            animation: "float 18s infinite ease-in-out",
            transform: `translateY(${Math.sin(animateBackground / 18) * -30}px) translateX(${Math.sin(animateBackground / 20) * 15}px)`,
          }}
        ></div>
        <div
          style={{
            position: "absolute",
            bottom: "33%",
            right: "25%",
            width: "10rem",
            height: "10rem",
            borderRadius: "100%",
            background: "rgba(147, 197, 253, 0.3)",
            opacity: 0.3,
            animation: "float 12s infinite ease-in-out",
            transform: `translateY(${Math.sin(animateBackground / 12) * 25}px) translateX(${Math.sin(animateBackground / 15) * -15}px)`,
          }}
        ></div>
        <div
          style={{
            position: "absolute",
            top: "66%",
            left: "33%",
            width: "6rem",
            height: "6rem",
            borderRadius: "100%",
            background: "rgba(96, 165, 250, 0.2)",
            opacity: 0.2,
            animation: "pulse 10s infinite ease-in-out",
            transform: `scale(${1 + Math.sin(animateBackground / 10) * 0.1}) rotate(${Math.sin(animateBackground / 12) * -5}deg)`,
          }}
        ></div>
      </div>

      {/* Header */}
      <header
        style={{
          background: "rgba(255, 255, 255, 0.9)",
          backdropFilter: "blur(8px)",
          padding: "1rem 0",
          boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
          borderBottom: "1px solid rgba(229, 231, 235, 1)",
          position: "relative",
          zIndex: 10,
        }}
      >
        <div
          style={{
            maxWidth: "80rem",
            margin: "0 auto",
            padding: "0 1rem",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
              }}
            >
              <div
                className="hover-scale"
                style={{
                  flexShrink: 0,
                }}
              >
                <div
                  style={{
                    height: "2.5rem",
                    width: "2.5rem",
                    background: "linear-gradient(135deg, #2563eb 0%, #1e40af 100%)",
                    borderRadius: "0.5rem",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
                    transition: "transform 0.2s ease-out",
                  }}
                >
                  <span
                    style={{
                      color: "white",
                      fontWeight: "bold",
                      fontSize: "1.25rem",
                    }}
                  >
                    A
                  </span>
                </div>
              </div>
              <div
                style={{
                  marginLeft: "0.75rem",
                }}
              >
                <h1
                  style={{
                    fontSize: "1.25rem",
                    fontWeight: "bold",
                    color: "#111827",
                  }}
                >
                  AMEN BANK
                </h1>
              </div>
            </div>
            <div className="hover-scale">
              <Link
                to="/login"
                style={{
                  display: "flex",
                  alignItems: "center",
                  fontSize: "0.875rem",
                  fontWeight: 500,
                  color: "#2563eb",
                  transition: "color 0.2s ease-out",
                }}
                onMouseOver={(e) => (e.currentTarget.style.color = "#1d4ed8")}
                onMouseOut={(e) => (e.currentTarget.style.color = "#2563eb")}
              >
                <ArrowLeft style={{ height: "1rem", width: "1rem", marginRight: "0.25rem" }} />
                Return to login
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <div
        style={{
          flexGrow: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "3rem 1rem",
        }}
      >
        <div
          style={{
            maxWidth: "28rem",
            width: "100%",
          }}
        >
          <div
            className="animate-fade-in"
            style={{
              textAlign: "center",
              marginBottom: "2rem",
            }}
          >
            <h2
              style={{
                fontSize: "1.875rem",
                fontWeight: 800,
                color: "#111827",
              }}
            >
              Forgot Password
            </h2>
            <p
              style={{
                marginTop: "0.5rem",
                fontSize: "0.875rem",
                color: "#4B5563",
              }}
            >
              Submit a request to reset your password
            </p>
          </div>

          {/* Error Toast */}
          {showErrorToast && (
            <div
              className="animate-slide-in-right"
              style={{
                position: "fixed",
                top: "1rem",
                right: "1rem",
                zIndex: 50,
              }}
            >
              <div
                style={{
                  background: "white",
                  borderLeft: "4px solid #ef4444",
                  boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
                  borderRadius: "0.5rem",
                  padding: "1rem",
                  maxWidth: "20rem",
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "0.75rem",
                }}
              >
                <div
                  style={{
                    flexShrink: 0,
                  }}
                >
                  <AlertCircle style={{ height: "1.25rem", width: "1.25rem", color: "#ef4444" }} />
                </div>
                <div
                  style={{
                    flex: 1,
                  }}
                >
                  <h3
                    style={{
                      fontSize: "0.875rem",
                      fontWeight: 500,
                      color: "#111827",
                    }}
                  >
                    Error
                  </h3>
                  <p
                    style={{
                      marginTop: "0.25rem",
                      fontSize: "0.875rem",
                      color: "#4B5563",
                    }}
                  >
                    {errorToastMessage}
                  </p>
                </div>
                <button
                  type="button"
                  style={{
                    flexShrink: 0,
                    color: "#9CA3AF",
                    transition: "color 0.2s ease-out",
                  }}
                  onClick={() => setShowErrorToast(false)}
                  onMouseOver={(e) => (e.currentTarget.style.color = "#6B7280")}
                  onMouseOut={(e) => (e.currentTarget.style.color = "#9CA3AF")}
                >
                  <X style={{ height: "1rem", width: "1rem" }} />
                </button>
              </div>
            </div>
          )}

          {/* Success Toast */}
          {showSuccessToast && (
            <div
              className="animate-slide-in-right"
              style={{
                position: "fixed",
                top: "1rem",
                right: "1rem",
                zIndex: 50,
              }}
            >
              <div
                style={{
                  background: "white",
                  borderLeft: "4px solid #10b981",
                  boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
                  borderRadius: "0.5rem",
                  padding: "1rem",
                  maxWidth: "20rem",
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "0.75rem",
                }}
              >
                <div
                  style={{
                    flexShrink: 0,
                  }}
                >
                  <CheckCircle style={{ height: "1.25rem", width: "1.25rem", color: "#10b981" }} />
                </div>
                <div
                  style={{
                    flex: 1,
                  }}
                >
                  <h3
                    style={{
                      fontSize: "0.875rem",
                      fontWeight: 500,
                      color: "#111827",
                    }}
                  >
                    Success
                  </h3>
                  <p
                    style={{
                      marginTop: "0.25rem",
                      fontSize: "0.875rem",
                      color: "#4B5563",
                    }}
                  >
                    Your password reset request has been submitted successfully. Please wait for admin approval.
                  </p>
                </div>
                <button
                  type="button"
                  style={{
                    flexShrink: 0,
                    color: "#9CA3AF",
                    transition: "color 0.2s ease-out",
                  }}
                  onClick={() => setShowSuccessToast(false)}
                  onMouseOver={(e) => (e.currentTarget.style.color = "#6B7280")}
                  onMouseOut={(e) => (e.currentTarget.style.color = "#9CA3AF")}
                >
                  <X style={{ height: "1rem", width: "1rem" }} />
                </button>
              </div>
            </div>
          )}

          {/* Info Tooltip */}
          {showInfoTooltip && (
            <div
              style={{
                position: "absolute",
                zIndex: 50,
                background: "#1f2937",
                color: "white",
                fontSize: "0.75rem",
                borderRadius: "0.25rem",
                padding: "0.5rem 0.75rem",
                maxWidth: "16rem",
                boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
                animation: "fadeIn 0.2s ease-out forwards",
                top: showInfoTooltip === "idCardPhoto" ? "calc(50% + 10rem)" : "calc(50% - 2rem)",
                left: "calc(50% + 3rem)",
              }}
            >
              {showInfoTooltip === "idCardPhoto" &&
                "Please upload a clear photo of your ID card with your face visible for verification purposes."}
              {showInfoTooltip === "idCardNumber" &&
                "Enter your national ID card number exactly as it appears on your ID."}
              <div
                style={{
                  position: "absolute",
                  bottom: "50%",
                  left: "-0.25rem",
                  transform: "translateY(50%) rotate(45deg)",
                  width: "0.5rem",
                  height: "0.5rem",
                  background: "#1f2937",
                }}
              ></div>
            </div>
          )}

          {success ? (
            <div
              className="animate-fade-in-up hover-lift"
              style={{
                background: "rgba(255, 255, 255, 0.9)",
                backdropFilter: "blur(8px)",
                boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                borderRadius: "0.5rem",
                overflow: "hidden",
                transition: "all 0.5s ease-out",
              }}
            >
              <div
                style={{
                  padding: "2rem 1.5rem",
                  background: "linear-gradient(135deg, rgba(240, 253, 244, 1) 0%, rgba(255, 255, 255, 0.9) 100%)",
                }}
              >
                <div
                  style={{
                    textAlign: "center",
                    marginBottom: "2rem",
                  }}
                >
                  <div
                    className="animate-bounce-slow"
                    style={{
                      margin: "0 auto",
                      height: "5rem",
                      width: "5rem",
                      background: "rgba(209, 250, 229, 1)",
                      borderRadius: "9999px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <CheckCircle style={{ height: "2.5rem", width: "2.5rem", color: "#059669" }} />
                  </div>
                  <h3
                    style={{
                      marginTop: "1.5rem",
                      fontSize: "1.5rem",
                      fontWeight: 500,
                      color: "#111827",
                      marginBottom: "0.5rem",
                    }}
                  >
                    Request Submitted
                  </h3>
                  <p
                    style={{
                      color: "#4B5563",
                      marginBottom: "1.5rem",
                      maxWidth: "24rem",
                      margin: "0 auto 1.5rem auto",
                    }}
                  >
                    Your password reset request has been submitted successfully. Please wait for admin approval. You
                    will receive an email once your request is processed.
                  </p>
                  <Link
                    to="/login"
                    className="hover-scale"
                    style={{
                      display: "inline-flex",
                      justifyContent: "center",
                      alignItems: "center",
                      padding: "0.625rem 1.25rem",
                      border: "1px solid transparent",
                      borderRadius: "0.375rem",
                      boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
                      fontSize: "0.875rem",
                      fontWeight: 500,
                      color: "white",
                      background: "linear-gradient(to right, #2563eb, #3b82f6)",
                      transition: "all 0.3s ease-out",
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.background = "linear-gradient(to right, #1d4ed8, #2563eb)"
                      e.currentTarget.style.boxShadow =
                        "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)"
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.background = "linear-gradient(to right, #2563eb, #3b82f6)"
                      e.currentTarget.style.boxShadow = "0 1px 2px 0 rgba(0, 0, 0, 0.05)"
                    }}
                  >
                    Return to Login
                  </Link>
                </div>
              </div>
              <div
                style={{
                  padding: "1rem 1.5rem",
                  background: "linear-gradient(to right, rgba(240, 253, 244, 1), rgba(220, 252, 231, 1))",
                  borderTop: "1px solid rgba(229, 231, 235, 1)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Shield style={{ height: "1rem", width: "1rem", color: "#10b981", marginRight: "0.5rem" }} />
                <span
                  style={{
                    fontSize: "0.75rem",
                    color: "#4B5563",
                  }}
                >
                  Your request will be processed securely
                </span>
              </div>
            </div>
          ) : (
            <form
              className="animate-fade-in-up hover-lift"
              style={{
                background: "rgba(255, 255, 255, 0.9)",
                backdropFilter: "blur(8px)",
                boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                borderRadius: "0.5rem",
                overflow: "hidden",
                transition: "all 0.5s ease-out",
              }}
              onSubmit={handleSubmit}
            >
              <div
                style={{
                  padding: "2rem 1.5rem",
                  background: "linear-gradient(135deg, rgba(239, 246, 255, 1) 0%, rgba(255, 255, 255, 0.9) 100%)",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "1.25rem",
                  }}
                >
                  <div
                    className="staggered-fade-in hover-lift"
                    style={{
                      animationDelay: "0.1s",
                      transition: "all 0.3s ease-out",
                    }}
                  >
                    <label
                      htmlFor="fullName"
                      style={{
                        display: "block",
                        fontSize: "0.875rem",
                        fontWeight: 500,
                        color: "#374151",
                        marginBottom: "0.25rem",
                        transition: "color 0.2s ease-out",
                      }}
                      onMouseOver={(e) => (e.currentTarget.style.color = "#2563eb")}
                      onMouseOut={(e) => (e.currentTarget.style.color = "#374151")}
                    >
                      Full Name *
                    </label>
                    <div
                      style={{
                        position: "relative",
                        borderRadius: "0.375rem",
                        boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
                      }}
                    >
                      <div
                        style={{
                          position: "absolute",
                          top: 0,
                          bottom: 0,
                          left: 0,
                          paddingLeft: "0.75rem",
                          display: "flex",
                          alignItems: "center",
                          pointerEvents: "none",
                        }}
                      >
                        <User
                          style={{
                            height: "1.25rem",
                            width: "1.25rem",
                            color: "#9CA3AF",
                            transition: "color 0.2s ease-out",
                          }}
                        />
                      </div>
                      <input
                        id="fullName"
                        name="fullName"
                        type="text"
                        required
                        value={formData.fullName}
                        onChange={handleChange}
                        className="focus-ring"
                        style={{
                          paddingLeft: "2.5rem",
                          display: "block",
                          width: "100%",
                          borderRadius: "0.375rem",
                          border: "1px solid #D1D5DB",
                          fontSize: "0.875rem",
                          padding: "0.5rem 0.75rem",
                          transition: "all 0.3s ease-out",
                        }}
                        placeholder="John Doe"
                        onFocus={(e) => {
                          e.currentTarget.parentElement!.querySelector("svg")!.style.color = "#2563eb"
                        }}
                        onBlur={(e) => {
                          e.currentTarget.parentElement!.querySelector("svg")!.style.color = "#9CA3AF"
                        }}
                      />
                    </div>
                  </div>

                  <div
                    className="staggered-fade-in hover-lift"
                    style={{
                      animationDelay: "0.2s",
                      transition: "all 0.3s ease-out",
                    }}
                  >
                    <label
                      htmlFor="email"
                      style={{
                        display: "block",
                        fontSize: "0.875rem",
                        fontWeight: 500,
                        color: "#374151",
                        marginBottom: "0.25rem",
                        transition: "color 0.2s ease-out",
                      }}
                      onMouseOver={(e) => (e.currentTarget.style.color = "#2563eb")}
                      onMouseOut={(e) => (e.currentTarget.style.color = "#374151")}
                    >
                      Email Address *
                    </label>
                    <div
                      style={{
                        position: "relative",
                        borderRadius: "0.375rem",
                        boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
                      }}
                    >
                      <div
                        style={{
                          position: "absolute",
                          top: 0,
                          bottom: 0,
                          left: 0,
                          paddingLeft: "0.75rem",
                          display: "flex",
                          alignItems: "center",
                          pointerEvents: "none",
                        }}
                      >
                        <Mail
                          style={{
                            height: "1.25rem",
                            width: "1.25rem",
                            color: "#9CA3AF",
                            transition: "color 0.2s ease-out",
                          }}
                        />
                      </div>
                      <input
                        id="email"
                        name="email"
                        type="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        className="focus-ring"
                        style={{
                          paddingLeft: "2.5rem",
                          display: "block",
                          width: "100%",
                          borderRadius: "0.375rem",
                          border: "1px solid #D1D5DB",
                          fontSize: "0.875rem",
                          padding: "0.5rem 0.75rem",
                          transition: "all 0.3s ease-out",
                        }}
                        placeholder="you@example.com"
                        onFocus={(e) => {
                          e.currentTarget.parentElement!.querySelector("svg")!.style.color = "#2563eb"
                        }}
                        onBlur={(e) => {
                          e.currentTarget.parentElement!.querySelector("svg")!.style.color = "#9CA3AF"
                        }}
                      />
                    </div>
                  </div>

                  <div
                    className="staggered-fade-in hover-lift"
                    style={{
                      animationDelay: "0.3s",
                      transition: "all 0.3s ease-out",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      <label
                        htmlFor="idCardNumber"
                        style={{
                          display: "block",
                          fontSize: "0.875rem",
                          fontWeight: 500,
                          color: "#374151",
                          marginBottom: "0.25rem",
                          transition: "color 0.2s ease-out",
                        }}
                        onMouseOver={(e) => (e.currentTarget.style.color = "#2563eb")}
                        onMouseOut={(e) => (e.currentTarget.style.color = "#374151")}
                      >
                        ID Card Number *
                      </label>
                      <button
                        type="button"
                        style={{
                          color: "#9CA3AF",
                          transition: "color 0.2s ease-out",
                        }}
                        onMouseEnter={() => setShowInfoTooltip("idCardNumber")}
                        onMouseLeave={() => setShowInfoTooltip(null)}
                        onMouseOver={(e) => (e.currentTarget.style.color = "#2563eb")}
                        onMouseOut={(e) => (e.currentTarget.style.color = "#9CA3AF")}
                      >
                        <Info style={{ height: "1rem", width: "1rem" }} />
                      </button>
                    </div>
                    <div
                      style={{
                        position: "relative",
                        borderRadius: "0.375rem",
                        boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
                      }}
                    >
                      <div
                        style={{
                          position: "absolute",
                          top: 0,
                          bottom: 0,
                          left: 0,
                          paddingLeft: "0.75rem",
                          display: "flex",
                          alignItems: "center",
                          pointerEvents: "none",
                        }}
                      >
                        <CreditCard
                          style={{
                            height: "1.25rem",
                            width: "1.25rem",
                            color: "#9CA3AF",
                            transition: "color 0.2s ease-out",
                          }}
                        />
                      </div>
                      <input
                        id="idCardNumber"
                        name="idCardNumber"
                        type="text"
                        required
                        value={formData.idCardNumber}
                        onChange={handleChange}
                        className="focus-ring"
                        style={{
                          paddingLeft: "2.5rem",
                          display: "block",
                          width: "100%",
                          borderRadius: "0.375rem",
                          border: "1px solid #D1D5DB",
                          fontSize: "0.875rem",
                          padding: "0.5rem 0.75rem",
                          transition: "all 0.3s ease-out",
                        }}
                        placeholder="ID Card Number"
                        onFocus={(e) => {
                          e.currentTarget.parentElement!.querySelector("svg")!.style.color = "#2563eb"
                        }}
                        onBlur={(e) => {
                          e.currentTarget.parentElement!.querySelector("svg")!.style.color = "#9CA3AF"
                        }}
                      />
                    </div>
                  </div>

                  <div
                    className="staggered-fade-in hover-lift"
                    style={{
                      animationDelay: "0.4s",
                      transition: "all 0.3s ease-out",
                    }}
                  >
                    <label
                      htmlFor="lastPassword"
                      style={{
                        display: "block",
                        fontSize: "0.875rem",
                        fontWeight: 500,
                        color: "#374151",
                        marginBottom: "0.25rem",
                        transition: "color 0.2s ease-out",
                      }}
                      onMouseOver={(e) => (e.currentTarget.style.color = "#2563eb")}
                      onMouseOut={(e) => (e.currentTarget.style.color = "#374151")}
                    >
                      Last Password (if you remember)
                    </label>
                    <div
                      style={{
                        position: "relative",
                        borderRadius: "0.375rem",
                        boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
                      }}
                    >
                      <div
                        style={{
                          position: "absolute",
                          top: 0,
                          bottom: 0,
                          left: 0,
                          paddingLeft: "0.75rem",
                          display: "flex",
                          alignItems: "center",
                          pointerEvents: "none",
                        }}
                      >
                        <Lock
                          style={{
                            height: "1.25rem",
                            width: "1.25rem",
                            color: "#9CA3AF",
                            transition: "color 0.2s ease-out",
                          }}
                        />
                      </div>
                      <input
                        id="lastPassword"
                        name="lastPassword"
                        type="password"
                        value={formData.lastPassword}
                        onChange={handleChange}
                        className="focus-ring"
                        style={{
                          paddingLeft: "2.5rem",
                          display: "block",
                          width: "100%",
                          borderRadius: "0.375rem",
                          border: "1px solid #D1D5DB",
                          fontSize: "0.875rem",
                          padding: "0.5rem 0.75rem",
                          transition: "all 0.3s ease-out",
                        }}
                        placeholder="Your previous password"
                        onFocus={(e) => {
                          e.currentTarget.parentElement!.querySelector("svg")!.style.color = "#2563eb"
                        }}
                        onBlur={(e) => {
                          e.currentTarget.parentElement!.querySelector("svg")!.style.color = "#9CA3AF"
                        }}
                      />
                    </div>
                  </div>

                  <div
                    className="staggered-fade-in hover-lift"
                    style={{
                      animationDelay: "0.5s",
                      transition: "all 0.3s ease-out",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      <label
                        style={{
                          display: "block",
                          fontSize: "0.875rem",
                          fontWeight: 500,
                          color: "#374151",
                          marginBottom: "0.25rem",
                          transition: "color 0.2s ease-out",
                        }}
                        onMouseOver={(e) => (e.currentTarget.style.color = "#2563eb")}
                        onMouseOut={(e) => (e.currentTarget.style.color = "#374151")}
                      >
                        ID Card Photo with Your Face *
                      </label>
                      <button
                        type="button"
                        style={{
                          color: "#9CA3AF",
                          transition: "color 0.2s ease-out",
                        }}
                        onMouseEnter={() => setShowInfoTooltip("idCardPhoto")}
                        onMouseLeave={() => setShowInfoTooltip(null)}
                        onMouseOver={(e) => (e.currentTarget.style.color = "#2563eb")}
                        onMouseOut={(e) => (e.currentTarget.style.color = "#9CA3AF")}
                      >
                        <Info style={{ height: "1rem", width: "1rem" }} />
                      </button>
                    </div>
                    <div
                      style={{
                        marginTop: "0.25rem",
                        display: "flex",
                        justifyContent: "center",
                        padding: "1.5rem",
                        border: `2px dashed ${idCardPhoto ? "#93C5FD" : isDragging ? "#60A5FA" : "#D1D5DB"}`,
                        borderRadius: "0.375rem",
                        transition: "border-color 0.3s ease-out",
                      }}
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                      onMouseOver={(e) => {
                        if (!idCardPhoto) e.currentTarget.style.borderColor = "#BFDBFE"
                      }}
                      onMouseOut={(e) => {
                        if (!idCardPhoto) e.currentTarget.style.borderColor = "#D1D5DB"
                      }}
                    >
                      <div
                        style={{
                          textAlign: "center",
                        }}
                      >
                        {idCardPhoto ? (
                          <div className="animate-fade-in">
                            <img
                              src={idCardPhoto || "/placeholder.svg"}
                              alt="ID Card Preview"
                              style={{
                                margin: "0 auto",
                                height: "9rem",
                                objectFit: "cover",
                                borderRadius: "0.375rem",
                                boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
                              }}
                            />
                            <button
                              type="button"
                              onClick={() => setIdCardPhoto(null)}
                              className="hover-scale"
                              style={{
                                marginTop: "0.75rem",
                                display: "inline-flex",
                                alignItems: "center",
                                padding: "0.375rem 0.75rem",
                                border: "1px solid transparent",
                                borderRadius: "9999px",
                                fontSize: "0.75rem",
                                fontWeight: 500,
                                color: "#B91C1C",
                                background: "#FEE2E2",
                                transition: "all 0.3s ease-out",
                              }}
                              onMouseOver={(e) => {
                                e.currentTarget.style.background = "#FECACA"
                              }}
                              onMouseOut={(e) => {
                                e.currentTarget.style.background = "#FEE2E2"
                              }}
                            >
                              <X style={{ height: "0.875rem", width: "0.875rem", marginRight: "0.25rem" }} />
                              Remove
                            </button>
                          </div>
                        ) : (
                          <>
                            <div
                              className="animate-float"
                              style={{
                                animation: "float 3s infinite ease-in-out",
                              }}
                            >
                              <Upload
                                style={{
                                  margin: "0 auto",
                                  height: "3rem",
                                  width: "3rem",
                                  color: "#60A5FA",
                                }}
                              />
                            </div>
                            <div
                              style={{
                                display: "flex",
                                fontSize: "0.875rem",
                                color: "#4B5563",
                                justifyContent: "center",
                                marginTop: "0.5rem",
                              }}
                            >
                              <label
                                htmlFor="file-upload"
                                style={{
                                  position: "relative",
                                  cursor: "pointer",
                                  background: "white",
                                  borderRadius: "0.375rem",
                                  fontWeight: 500,
                                  color: "#2563EB",
                                  transition: "color 0.2s ease-out",
                                }}
                                onMouseOver={(e) => (e.currentTarget.style.color = "#1D4ED8")}
                                onMouseOut={(e) => (e.currentTarget.style.color = "#2563EB")}
                              >
                                <span>Upload a file</span>
                                <input
                                  id="file-upload"
                                  name="file-upload"
                                  type="file"
                                  style={{
                                    position: "absolute",
                                    width: "1px",
                                    height: "1px",
                                    padding: 0,
                                    margin: "-1px",
                                    overflow: "hidden",
                                    clip: "rect(0, 0, 0, 0)",
                                    whiteSpace: "nowrap",
                                    borderWidth: 0,
                                  }}
                                  accept="image/*"
                                  ref={fileInputRef}
                                  onChange={handlePhotoChange}
                                />
                              </label>
                              <p style={{ paddingLeft: "0.25rem" }}>or drag and drop</p>
                            </div>
                            <p
                              style={{
                                fontSize: "0.75rem",
                                color: "#6B7280",
                                marginTop: "0.25rem",
                              }}
                            >
                              PNG, JPG, GIF up to 10MB
                            </p>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div
                  className="staggered-fade-in"
                  style={{
                    marginTop: "2rem",
                    animationDelay: "0.6s",
                  }}
                >
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="hover-scale"
                    style={{
                      position: "relative",
                      width: "100%",
                      display: "flex",
                      justifyContent: "center",
                      padding: "0.625rem 1rem",
                      border: "1px solid transparent",
                      borderRadius: "0.375rem",
                      fontSize: "0.875rem",
                      fontWeight: 500,
                      color: "white",
                      background: "linear-gradient(to right, #2563eb, #3b82f6)",
                      boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
                      transition: "all 0.3s ease-out",
                      cursor: isLoading ? "not-allowed" : "pointer",
                      opacity: isLoading ? 0.7 : 1,
                    }}
                    onMouseOver={(e) => {
                      if (!isLoading) {
                        e.currentTarget.style.background = "linear-gradient(to right, #1D4ED8, #2563EB)"
                        e.currentTarget.style.boxShadow =
                          "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)"
                      }
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.background = "linear-gradient(to right, #2563eb, #3b82f6)"
                      e.currentTarget.style.boxShadow = "0 1px 2px 0 rgba(0, 0, 0, 0.05)"
                    }}
                  >
                    {isLoading ? (
                      <>
                        <Loader2
                          className="animate-spin"
                          style={{ height: "1rem", width: "1rem", marginRight: "0.5rem" }}
                        />
                        Processing...
                      </>
                    ) : (
                      <>
                        <span
                          style={{
                            position: "absolute",
                            inset: "0 auto 0 0",
                            display: "flex",
                            alignItems: "center",
                            paddingLeft: "0.75rem",
                          }}
                        >
                          <Shield style={{ height: "1.25rem", width: "1.25rem", color: "#93C5FD" }} />
                        </span>
                        Submit Request
                      </>
                    )}
                  </button>
                </div>

                <div
                  className="staggered-fade-in"
                  style={{
                    marginTop: "1.5rem",
                    textAlign: "center",
                    animationDelay: "0.7s",
                  }}
                >
                  <Link
                    to="/login"
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      fontSize: "0.875rem",
                      fontWeight: 500,
                      color: "#2563eb",
                      transition: "color 0.2s ease-out",
                    }}
                    onMouseOver={(e) => (e.currentTarget.style.color = "#1d4ed8")}
                    onMouseOut={(e) => (e.currentTarget.style.color = "#2563eb")}
                  >
                    <ArrowLeft style={{ height: "1rem", width: "1rem", marginRight: "0.25rem" }} />
                    Return to login
                  </Link>
                </div>
              </div>
              <div
                style={{
                  padding: "1rem 1.5rem",
                  background: "linear-gradient(to right, rgba(239, 246, 255, 1), rgba(219, 234, 254, 1))",
                  borderTop: "1px solid rgba(229, 231, 235, 1)",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Shield style={{ height: "1rem", width: "1rem", color: "#3B82F6", marginRight: "0.5rem" }} />
                  <span
                    style={{
                      fontSize: "0.75rem",
                      color: "#4B5563",
                    }}
                  >
                    Secure request with 256-bit encryption
                  </span>
                </div>
                <div
                  style={{
                    marginTop: "0.5rem",
                    fontSize: "0.75rem",
                    textAlign: "center",
                    color: "#6B7280",
                  }}
                >
                  Your information is protected and will only be used for password recovery purposes.
                </div>
              </div>
            </form>
          )}
        </div>
      </div>

      {/* Footer */}
      <footer
        style={{
          background: "rgba(255, 255, 255, 0.9)",
          backdropFilter: "blur(8px)",
          padding: "1rem 0",
          borderTop: "1px solid rgba(229, 231, 235, 1)",
          position: "relative",
          zIndex: 10,
          marginTop: "auto",
        }}
      >
        <div
          style={{
            maxWidth: "80rem",
            margin: "0 auto",
            padding: "0 1rem",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                marginBottom: "0.5rem",
              }}
            >
              <p
                style={{
                  fontSize: "0.875rem",
                  color: "#6B7280",
                }}
              >
                &copy; 2025 AMEN BANK. All rights reserved.
              </p>
            </div>
            <div
              style={{
                display: "flex",
                gap: "1.5rem",
              }}
            >
              <Link
                to="/privacy"
                style={{
                  fontSize: "0.875rem",
                  color: "#6B7280",
                  transition: "color 0.2s ease-out",
                }}
                onMouseOver={(e) => (e.currentTarget.style.color = "#2563eb")}
                onMouseOut={(e) => (e.currentTarget.style.color = "#6B7280")}
              >
                Privacy Policy
              </Link>
              <Link
                to="/terms"
                style={{
                  fontSize: "0.875rem",
                  color: "#6B7280",
                  transition: "color 0.2s ease-out",
                }}
                onMouseOver={(e) => (e.currentTarget.style.color = "#2563eb")}
                onMouseOut={(e) => (e.currentTarget.style.color = "#6B7280")}
              >
                Terms of Service
              </Link>
              <Link
                to="/contact"
                style={{
                  fontSize: "0.875rem",
                  color: "#6B7280",
                  transition: "color 0.2s ease-out",
                }}
                onMouseOver={(e) => (e.currentTarget.style.color = "#2563eb")}
                onMouseOut={(e) => (e.currentTarget.style.color = "#6B7280")}
              >
                Contact Support
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
