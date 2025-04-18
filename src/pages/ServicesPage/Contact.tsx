"use client"

import React, { useState } from "react"
import { Link } from "react-router-dom"
import { Phone, Mail, MapPin, Clock, Menu, X, Send, Building, Globe, ChevronDown } from "lucide-react"
import { useAuthStore } from "../../store/auth-store"

const ContactPage: React.FC = () => {
  const { currentUser } = useAuthStore()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  })
  const [formErrors, setFormErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const [activeAccordion, setActiveAccordion] = useState<string | null>(null)

  // Handle scroll effect for navbar
  React.useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true)
      } else {
        setScrolled(false)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))

    // Clear error when field is edited
    if (formErrors[name]) {
      setFormErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }

  const validateForm = () => {
    const errors: Record<string, string> = {}
    let isValid = true

    if (!formData.name.trim()) {
      errors.name = "Name is required"
      isValid = false
    }

    if (!formData.email.trim()) {
      errors.email = "Email is required"
      isValid = false
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "Please enter a valid email address"
      isValid = false
    }

    if (!formData.subject.trim()) {
      errors.subject = "Subject is required"
      isValid = false
    }

    if (!formData.message.trim()) {
      errors.message = "Message is required"
      isValid = false
    } else if (formData.message.trim().length < 10) {
      errors.message = "Message must be at least 10 characters"
      isValid = false
    }

    setFormErrors(errors)
    return isValid
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Reset form on success
      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
      })
      setSubmitSuccess(true)

      // Hide success message after 5 seconds
      setTimeout(() => {
        setSubmitSuccess(false)
      }, 5000)
    } catch (error) {
      console.error("Error submitting form:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const toggleAccordion = (id: string) => {
    setActiveAccordion(activeAccordion === id ? null : id)
  }

  // Branch locations data
  const branches = [
    {
      id: 1,
      name: "Headquarters",
      address: "Avenue Mohamed V, Tunis 1002",
      phone: "+216 71 123 456",
      email: "hq@amenbank.com",
      hours: "Monday - Friday: 8:00 AM - 4:00 PM",
    },
    {
      id: 2,
      name: "Sousse Branch",
      address: "Rue de la Plage, Sousse 4000",
      phone: "+216 73 456 789",
      email: "sousse@amenbank.com",
      hours: "Monday - Friday: 8:30 AM - 3:30 PM",
    },
    {
      id: 3,
      name: "Sfax Branch",
      address: "Avenue Habib Bourguiba, Sfax 3000",
      phone: "+216 74 789 123",
      email: "sfax@amenbank.com",
      hours: "Monday - Friday: 8:00 AM - 4:00 PM",
    },
  ]

  // FAQ data
  const faqs = [
    {
      id: "faq1",
      question: "How do I open an account with AMEN Bank?",
      answer:
        "You can open an account by visiting any of our branches with your identification documents, or by starting the process online through our website and completing it at a branch.",
    },
    {
      id: "faq2",
      question: "What documents do I need to open an account?",
      answer:
        "Typically, you'll need a valid ID (passport or national ID card), proof of address (utility bill or bank statement), and in some cases, proof of income or employment.",
    },
    {
      id: "faq3",
      question: "How can I access my accounts online?",
      answer:
        "You can access your accounts through our online banking portal or mobile app. If you haven't registered yet, you can sign up on our website or contact customer service for assistance.",
    },
    {
      id: "faq4",
      question: "What should I do if I lose my debit/credit card?",
      answer:
        "If you lose your card, you should immediately report it by calling our 24/7 customer service line at +216 71 123 456 to block the card and request a replacement.",
    },
    {
      id: "faq5",
      question: "How can I apply for a loan?",
      answer:
        "You can apply for a loan by visiting a branch, through our online banking platform, or by contacting our loan department directly. We offer various types of loans with competitive rates.",
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav
        className={`fixed w-full z-50 transition-all duration-300 ${
          scrolled ? "bg-white shadow-md py-2" : "bg-transparent py-4"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Link to="/">
                  <div className="h-10 w-10 bg-gradient-to-br from-blue-600 to-blue-800 rounded-lg flex items-center justify-center shadow-md">
                    <span className="text-white font-bold text-xl">A</span>
                  </div>
                </Link>
              </div>
              <div className="ml-3">
                <Link to="/">
                  <h1 className={`text-xl font-bold ${scrolled ? "text-blue-900" : "text-blue-900"}`}>AMEN BANK</h1>
                </Link>
              </div>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <Link
                to="/"
                className={`font-medium ${
                  scrolled ? "text-gray-700 hover:text-blue-700" : "text-gray-700 hover:text-blue-700"
                } transition-colors`}
              >
                Home
              </Link>
              <Link
                to="/about"
                className={`font-medium ${
                  scrolled ? "text-gray-700 hover:text-blue-700" : "text-gray-700 hover:text-blue-700"
                } transition-colors`}
              >
                About
              </Link>
              <Link
                to="/services"
                className={`font-medium ${
                  scrolled ? "text-gray-700 hover:text-blue-700" : "text-gray-700 hover:text-blue-700"
                } transition-colors`}
              >
                Services
              </Link>
              <Link
                to="/contact"
                className={`font-medium ${
                  scrolled ? "text-blue-700 hover:text-blue-900" : "text-blue-700 hover:text-blue-900"
                } transition-colors`}
              >
                Contact
              </Link>

              {!currentUser ? (
                <div className="flex items-center space-x-4">
                  <Link
                    to="/login"
                    className={`font-medium ${
                      scrolled ? "text-blue-700 hover:text-blue-800" : "text-blue-700 hover:text-blue-800"
                    } transition-colors`}
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="px-4 py-2 rounded-md bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors shadow-sm"
                  >
                    Register
                  </Link>
                </div>
              ) : (
                <Link
                  to={currentUser?.role === "admin" ? "/admin" : "/dashboard"}
                  className="px-4 py-2 rounded-md bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors shadow-sm"
                >
                  Dashboard
                </Link>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className={`p-2 rounded-md ${
                  scrolled ? "text-gray-700 hover:bg-gray-100" : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden bg-white shadow-lg">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              <Link
                to="/"
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-700 hover:bg-gray-50"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                to="/about"
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-700 hover:bg-gray-50"
                onClick={() => setIsMenuOpen(false)}
              >
                About
              </Link>
              <Link
                to="/services"
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-700 hover:bg-gray-50"
                onClick={() => setIsMenuOpen(false)}
              >
                Services
              </Link>
              <Link
                to="/contact"
                className="block px-3 py-2 rounded-md text-base font-medium text-blue-700 hover:text-blue-900 hover:bg-blue-50"
                onClick={() => setIsMenuOpen(false)}
              >
                Contact
              </Link>

              {!currentUser ? (
                <div className="space-y-2 pt-2 border-t border-gray-200">
                  <Link
                    to="/login"
                    className="block px-3 py-2 rounded-md text-base font-medium text-blue-700 hover:text-blue-800 hover:bg-blue-50"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="block px-3 py-2 rounded-md text-base font-medium text-white bg-blue-600 hover:bg-blue-700"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Register
                  </Link>
                </div>
              ) : (
                <div className="pt-2 border-t border-gray-200">
                  <Link
                    to={currentUser?.role === "admin" ? "/admin" : "/dashboard"}
                    className="block px-3 py-2 rounded-md text-base font-medium text-white bg-blue-600 hover:bg-blue-700"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <div className="relative pt-16 pb-32 flex content-center items-center justify-center">
        <div
          className="absolute top-0 w-full h-full bg-center bg-cover"
          style={{
            backgroundImage: "url('/placeholder.svg?height=600&width=1200')",
          }}
        >
          <span className="w-full h-full absolute opacity-75 bg-gradient-to-r from-blue-900 to-blue-700"></span>
        </div>
        <div className="container relative mx-auto">
          <div className="items-center flex flex-wrap">
            <div className="w-full lg:w-6/12 px-4 ml-auto mr-auto text-center">
              <div className="pr-12">
                <h1 className="text-white font-semibold text-5xl">Contact Us</h1>
                <p className="mt-4 text-lg text-white">
                  We're here to help. Reach out to us with any questions, feedback, or inquiries.
                </p>
              </div>
            </div>
          </div>
        </div>
        <div
          className="top-auto bottom-0 left-0 right-0 w-full absolute pointer-events-none overflow-hidden"
          style={{ height: "70px" }}
        >
          <svg
            className="absolute bottom-0 overflow-hidden"
            xmlns="http://www.w3.org/2000/svg"
            preserveAspectRatio="none"
            version="1.1"
            viewBox="0 0 2560 100"
            x="0"
            y="0"
          >
            <polygon className="text-gray-50 fill-current" points="2560 0 2560 100 0 100"></polygon>
          </svg>
        </div>
      </div>

      {/* Contact Information Section */}
      <section className="relative block py-24 lg:pt-0">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center lg:-mt-64 -mt-48">
            <div className="w-full lg:w-10/12">
              <div className="bg-white rounded-lg shadow-lg p-8">
                <div className="flex flex-wrap">
                  <div className="w-full lg:w-4/12 px-4 lg:order-1">
                    <div className="flex flex-col min-w-0 break-words bg-white mb-6">
                      <div className="flex-auto p-5">
                        <h3 className="text-2xl font-semibold mb-6">Get in Touch</h3>
                        <div className="space-y-6">
                          <div className="flex items-start">
                            <div className="flex-shrink-0">
                              <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-100 text-blue-700">
                                <Phone className="h-6 w-6" />
                              </div>
                            </div>
                            <div className="ml-4">
                              <h4 className="text-lg font-medium text-gray-900">Phone</h4>
                              <p className="mt-1 text-gray-600">+216 71 123 456</p>
                              <p className="text-gray-600">+216 71 789 012</p>
                            </div>
                          </div>
                          <div className="flex items-start">
                            <div className="flex-shrink-0">
                              <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-100 text-blue-700">
                                <Mail className="h-6 w-6" />
                              </div>
                            </div>
                            <div className="ml-4">
                              <h4 className="text-lg font-medium text-gray-900">Email</h4>
                              <p className="mt-1 text-gray-600">contact@amenbank.com</p>
                              <p className="text-gray-600">support@amenbank.com</p>
                            </div>
                          </div>
                          <div className="flex items-start">
                            <div className="flex-shrink-0">
                              <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-100 text-blue-700">
                                <MapPin className="h-6 w-6" />
                              </div>
                            </div>
                            <div className="ml-4">
                              <h4 className="text-lg font-medium text-gray-900">Headquarters</h4>
                              <p className="mt-1 text-gray-600">Avenue Mohamed V, Tunis 1002</p>
                              <p className="text-gray-600">Tunisia</p>
                            </div>
                          </div>
                          <div className="flex items-start">
                            <div className="flex-shrink-0">
                              <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-100 text-blue-700">
                                <Clock className="h-6 w-6" />
                              </div>
                            </div>
                            <div className="ml-4">
                              <h4 className="text-lg font-medium text-gray-900">Business Hours</h4>
                              <p className="mt-1 text-gray-600">Monday - Friday: 8:00 AM - 4:00 PM</p>
                              <p className="text-gray-600">Saturday: 9:00 AM - 1:00 PM</p>
                              <p className="text-gray-600">Sunday: Closed</p>
                            </div>
                          </div>
                        </div>
                        <div className="mt-8">
                          <h4 className="text-lg font-medium text-gray-900 mb-4">Follow Us</h4>
                          <div className="flex space-x-4">
                            <a href="#" className="text-gray-400 hover:text-blue-700 transition-colors duration-300">
                              <span className="sr-only">Facebook</span>
                              <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                <path
                                  fillRule="evenodd"
                                  d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            </a>
                            <a href="#" className="text-gray-400 hover:text-blue-700 transition-colors duration-300">
                              <span className="sr-only">Instagram</span>
                              <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                <path
                                  fillRule="evenodd"
                                  d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            </a>
                            <a href="#" className="text-gray-400 hover:text-blue-700 transition-colors duration-300">
                              <span className="sr-only">Twitter</span>
                              <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                              </svg>
                            </a>
                            <a href="#" className="text-gray-400 hover:text-blue-700 transition-colors duration-300">
                              <span className="sr-only">LinkedIn</span>
                              <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                              </svg>
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="w-full lg:w-8/12 px-4 lg:order-2">
                    <div className="flex flex-col min-w-0 break-words bg-white mb-6">
                      <div className="flex-auto p-5">
                        <h3 className="text-2xl font-semibold mb-6">Send Us a Message</h3>
                        {submitSuccess ? (
                          <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-6">
                            <div className="flex">
                              <div className="flex-shrink-0">
                                <svg
                                  className="h-5 w-5 text-green-500"
                                  xmlns="http://www.w3.org/2000/svg"
                                  viewBox="0 0 20 20"
                                  fill="currentColor"
                                  aria-hidden="true"
                                >
                                  <path
                                    fillRule="evenodd"
                                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                              </div>
                              <div className="ml-3">
                                <p className="text-sm text-green-700">
                                  Thank you! Your message has been sent successfully. We'll get back to you as soon as
                                  possible.
                                </p>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                              <div>
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                                  Full Name
                                </label>
                                <div className="mt-1">
                                  <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    className={`block w-full rounded-md border ${
                                      formErrors.name ? "border-red-300" : "border-gray-300"
                                    } py-3 px-4 shadow-sm focus:border-blue-500 focus:ring-blue-500`}
                                    placeholder="John Doe"
                                  />
                                  {formErrors.name && <p className="mt-2 text-sm text-red-600">{formErrors.name}</p>}
                                </div>
                              </div>
                              <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                  Email
                                </label>
                                <div className="mt-1">
                                  <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    className={`block w-full rounded-md border ${
                                      formErrors.email ? "border-red-300" : "border-gray-300"
                                    } py-3 px-4 shadow-sm focus:border-blue-500 focus:ring-blue-500`}
                                    placeholder="you@example.com"
                                  />
                                  {formErrors.email && <p className="mt-2 text-sm text-red-600">{formErrors.email}</p>}
                                </div>
                              </div>
                            </div>
                            <div>
                              <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                                Phone Number (Optional)
                              </label>
                              <div className="mt-1">
                                <input
                                  type="tel"
                                  id="phone"
                                  name="phone"
                                  value={formData.phone}
                                  onChange={handleInputChange}
                                  className="block w-full rounded-md border border-gray-300 py-3 px-4 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                  placeholder="+216 71 123 456"
                                />
                              </div>
                            </div>
                            <div>
                              <label htmlFor="subject" className="block text-sm font-medium text-gray-700">
                                Subject
                              </label>
                              <div className="mt-1">
                                <select
                                  id="subject"
                                  name="subject"
                                  value={formData.subject}
                                  onChange={handleInputChange}
                                  className={`block w-full rounded-md border ${
                                    formErrors.subject ? "border-red-300" : "border-gray-300"
                                  } py-3 px-4 shadow-sm focus:border-blue-500 focus:ring-blue-500`}
                                >
                                  <option value="">Select a subject</option>
                                  <option value="General Inquiry">General Inquiry</option>
                                  <option value="Account Support">Account Support</option>
                                  <option value="Loan Information">Loan Information</option>
                                  <option value="Technical Support">Technical Support</option>
                                  <option value="Feedback">Feedback</option>
                                  <option value="Other">Other</option>
                                </select>
                                {formErrors.subject && (
                                  <p className="mt-2 text-sm text-red-600">{formErrors.subject}</p>
                                )}
                              </div>
                            </div>
                            <div>
                              <label htmlFor="message" className="block text-sm font-medium text-gray-700">
                                Message
                              </label>
                              <div className="mt-1">
                                <textarea
                                  id="message"
                                  name="message"
                                  rows={4}
                                  value={formData.message}
                                  onChange={handleInputChange}
                                  className={`block w-full rounded-md border ${
                                    formErrors.message ? "border-red-300" : "border-gray-300"
                                  } py-3 px-4 shadow-sm focus:border-blue-500 focus:ring-blue-500`}
                                  placeholder="How can we help you?"
                                />
                                {formErrors.message && (
                                  <p className="mt-2 text-sm text-red-600">{formErrors.message}</p>
                                )}
                              </div>
                            </div>
                            <div>
                              <button
                                type="submit"
                                disabled={isSubmitting}
                                className="inline-flex justify-center items-center py-3 px-6 border border-transparent shadow-sm text-base font-medium rounded-md text-white bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 w-full transition-colors duration-300"
                              >
                                {isSubmitting ? (
                                  <>
                                    <svg
                                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                                      xmlns="http://www.w3.org/2000/svg"
                                      fill="none"
                                      viewBox="0 0 24 24"
                                    >
                                      <circle
                                        className="opacity-25"
                                        cx="12"
                                        cy="12"
                                        r="10"
                                        stroke="currentColor"
                                        strokeWidth="4"
                                      ></circle>
                                      <path
                                        className="opacity-75"
                                        fill="currentColor"
                                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                      ></path>
                                    </svg>
                                    Sending...
                                  </>
                                ) : (
                                  <>
                                    <Send className="mr-2 h-5 w-5" />
                                    Send Message
                                  </>
                                )}
                              </button>
                            </div>
                          </form>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Branch Locations Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center text-center mb-16">
            <div className="w-full lg:w-6/12 px-4">
              <h2 className="text-4xl font-semibold">Our Branch Locations</h2>
              <p className="text-lg leading-relaxed m-4 text-gray-600">
                Visit one of our branches for personalized service and assistance.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap">
            {branches.map((branch) => (
              <div key={branch.id} className="w-full md:w-4/12 px-4 mb-8">
                <div className="bg-white rounded-lg shadow-md p-6 h-full transform transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                  <div className="flex items-center mb-4">
                    <div className="flex-shrink-0">
                      <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-100 text-blue-700">
                        <Building className="h-6 w-6" />
                      </div>
                    </div>
                    <div className="ml-4">
                      <h3 className="text-xl font-medium text-gray-900">{branch.name}</h3>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-start">
                      <MapPin className="h-5 w-5 text-gray-400 mr-2 mt-0.5" />
                      <p className="text-gray-600">{branch.address}</p>
                    </div>
                    <div className="flex items-start">
                      <Phone className="h-5 w-5 text-gray-400 mr-2 mt-0.5" />
                      <p className="text-gray-600">{branch.phone}</p>
                    </div>
                    <div className="flex items-start">
                      <Mail className="h-5 w-5 text-gray-400 mr-2 mt-0.5" />
                      <p className="text-gray-600">{branch.email}</p>
                    </div>
                    <div className="flex items-start">
                      <Clock className="h-5 w-5 text-gray-400 mr-2 mt-0.5" />
                      <p className="text-gray-600">{branch.hours}</p>
                    </div>
                  </div>
                  <div className="mt-6">
                    <a
                      href={`https://maps.google.com/?q=${encodeURIComponent(branch.address)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-blue-700 hover:text-blue-800"
                    >
                      View on Map
                      <svg
                        className="ml-2 h-5 w-5"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
                        <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" />
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center text-center mb-16">
            <div className="w-full lg:w-6/12 px-4">
              <h2 className="text-4xl font-semibold">Find Us</h2>
              <p className="text-lg leading-relaxed m-4 text-gray-600">
                Our headquarters is conveniently located in the heart of Tunis.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap">
            <div className="w-full px-4">
              <div className="relative h-96 rounded-lg overflow-hidden shadow-lg">
                {/* This would be replaced with an actual map component in a real implementation */}
                <img
                  src="/placeholder.svg?height=600&width=1200"
                  alt="Map location"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="bg-white bg-opacity-75 p-4 rounded-lg">
                    <p className="font-medium text-gray-900">AMEN Bank Headquarters</p>
                    <p className="text-gray-700">Avenue Mohamed V, Tunis 1002</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center text-center mb-16">
            <div className="w-full lg:w-6/12 px-4">
              <h2 className="text-4xl font-semibold">Frequently Asked Questions</h2>
              <p className="text-lg leading-relaxed m-4 text-gray-600">
                Find answers to common questions about our services and banking with us.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap justify-center">
            <div className="w-full lg:w-8/12 px-4">
              <div className="space-y-4">
                {faqs.map((faq) => (
                  <div
                    key={faq.id}
                    className="bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300"
                  >
                    <button
                      className="w-full px-6 py-4 text-left focus:outline-none"
                      onClick={() => toggleAccordion(faq.id)}
                    >
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-medium text-gray-900">{faq.question}</h3>
                        <ChevronDown
                          className={`h-5 w-5 text-gray-500 transition-transform duration-300 ${
                            activeAccordion === faq.id ? "transform rotate-180" : ""
                          }`}
                        />
                      </div>
                    </button>
                    <div
                      className={`px-6 pb-4 transition-all duration-300 ${
                        activeAccordion === faq.id ? "block" : "hidden"
                      }`}
                    >
                      <p className="text-gray-600">{faq.answer}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-10 text-center">
                <p className="text-gray-600">Can't find what you're looking for? Contact our customer support team.</p>
                <div className="mt-6">
                  <a
                    href="tel:+21671123456"
                    className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-300"
                  >
                    <Phone className="mr-2 h-5 w-5" />
                    Call Customer Support
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Remove the Live Chat CTA section */}

      {/* Footer */}
      <footer className="bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="md:col-span-1">
              <div className="flex items-center">
                <div className="h-10 w-10 bg-gradient-to-br from-blue-500 to-blue-700 rounded-lg flex items-center justify-center shadow-md">
                  <span className="text-white font-bold text-xl">A</span>
                </div>
                <h2 className="ml-3 text-xl font-bold">AMEN BANK</h2>
              </div>
              <p className="mt-4 text-sm text-gray-400">
                Your trusted banking partner for over 30 years, providing innovative financial solutions for individuals
                and businesses.
              </p>
              <div className="mt-6 flex space-x-6">
                <a href="#" className="text-gray-400 hover:text-white">
                  <span className="sr-only">Facebook</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path
                      fillRule="evenodd"
                      d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                      clipRule="evenodd"
                    />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white">
                  <span className="sr-only">Instagram</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path
                      fillRule="evenodd"
                      d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
                      clipRule="evenodd"
                    />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white">
                  <span className="sr-only">Twitter</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
              </div>
            </div>
            <div className="md:col-span-3 grid grid-cols-1 sm:grid-cols-3 gap-8">
              <div>
                <h3 className="text-sm font-semibold text-gray-300 tracking-wider uppercase">Products</h3>
                <ul className="mt-4 space-y-4">
                  <li>
                    <Link to="/accounts" className="text-base text-gray-400 hover:text-white">
                      Accounts
                    </Link>
                  </li>
                  <li>
                    <Link to="/cards" className="text-base text-gray-400 hover:text-white">
                      Cards
                    </Link>
                  </li>
                  <li>
                    <Link to="/loans" className="text-base text-gray-400 hover:text-white">
                      Loans
                    </Link>
                  </li>
                  <li>
                    <Link to="/investments" className="text-base text-gray-400 hover:text-white">
                      Investments
                    </Link>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-300 tracking-wider uppercase">Support</h3>
                <ul className="mt-4 space-y-4">
                  <li>
                    <Link to="/help" className="text-base text-gray-400 hover:text-white">
                      Help Center
                    </Link>
                  </li>
                  <li>
                    <Link to="/contact" className="text-base text-gray-400 hover:text-white">
                      Contact Us
                    </Link>
                  </li>
                  <li>
                    <Link to="/faq" className="text-base text-gray-400 hover:text-white">
                      FAQs
                    </Link>
                  </li>
                  <li>
                    <Link to="/security" className="text-base text-gray-400 hover:text-white">
                      Security
                    </Link>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-300 tracking-wider uppercase">Contact</h3>
                <ul className="mt-4 space-y-4">
                  <li className="flex items-center">
                    <Phone className="h-5 w-5 text-gray-400 mr-2" />
                    <span className="text-gray-400">+216 71 123 456</span>
                  </li>
                  <li className="flex items-center">
                    <Mail className="h-5 w-5 text-gray-400 mr-2" />
                    <span className="text-gray-400">contact@amenbank.com</span>
                  </li>
                  <li className="flex items-center">
                    <Globe className="h-5 w-5 text-gray-400 mr-2" />
                    <span className="text-gray-400">www.amenbank.com</span>
                  </li>
                  <li className="flex items-center">
                    <MapPin className="h-5 w-5 text-gray-400 mr-2" />
                    <span className="text-gray-400">Avenue Mohamed V, Tunis</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div className="mt-12 border-t border-gray-800 pt-8">
            <p className="text-base text-gray-400 text-center">
              &copy; {new Date().getFullYear()} AMEN Bank. All rights reserved.
            </p>
            <div className="mt-4 flex justify-center space-x-6">
              <Link to="/terms" className="text-sm text-gray-400 hover:text-white">
                Terms of Service
              </Link>
              <Link to="/privacy" className="text-sm text-gray-400 hover:text-white">
                Privacy Policy
              </Link>
              <Link to="/cookies" className="text-sm text-gray-400 hover:text-white">
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default ContactPage
