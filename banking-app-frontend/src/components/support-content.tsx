"use client"

import axios from "axios"
import { useState, useRef, useEffect } from "react"
import { Phone, Mail, MessageSquare, ChevronDown, Send, User, Bot } from "lucide-react"
import { toast } from "react-hot-toast"

// Define the chat message interface
interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

// Predefined responses for common questions
const botResponses: Record<string, string> = {
  "hello": "Hello! How can I help you today?",
  "hi": "Hi there! How can I assist you?",
  "account": "For account-related questions, you can check your account details in the dashboard or contact our customer service at +216 71 123 456.",
  "password": "To reset your password, click on the 'Forgot Password' link on the login page. You will receive a verification code to your registered email.",
  "loan": "We offer various types of loans including personal loans, home loans, and business loans. You can apply through your dashboard or visit any branch.",
  "transfer": "You can make transfers through your dashboard. The daily limit is 10,000 TND for individual accounts.",
  "contact": "You can reach us at +216 71 123 456 or email us at support@amenbank.com.",
  "hours": "Our customer service is available 24/7 for online support. Branch hours are typically 8:00 AM to 4:00 PM Monday through Friday.",
  "help": "I'm here to help! You can ask me about account issues, transfers, loans, or any other banking services.",
  "thanks": "You're welcome! Is there anything else I can help you with?",
  "thank you": "You're welcome! Is there anything else I can help you with?",
}

export function SupportContent() {
  const [activeAccordion, setActiveAccordion] = useState<string | null>(null)
  const [chatOpen, setChatOpen] = useState(false)
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      text: 'Hello! How can I help you today?',
      sender: 'bot',
      timestamp: new Date()
    }
  ])
  const [inputMessage, setInputMessage] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    subject: "",
    message: ""
  })
  const [formErrors, setFormErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  
  const toggleAccordion = (id: string) => {
    setActiveAccordion(activeAccordion === id ? null : id)
  }
  
  // Auto-scroll to bottom of chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])
  
  // Handle sending a message
  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return
    
    // Add user message
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      text: inputMessage,
      sender: 'user',
      timestamp: new Date()
    }
    
    setMessages(prev => [...prev, userMessage])
    setInputMessage('')
    
    // Show typing indicator
    setIsLoading(true)
    
    try {
      // Call backend API instead of using local responses
      const response = await axios.post("http://localhost:5001/api/support/chatbot", {
        message: inputMessage
      }, {
        withCredentials: true
      })
      
      if (response.data.success) {
        const botMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          text: response.data.response,
          sender: 'bot',
          timestamp: new Date()
        }
        setMessages(prev => [...prev, botMessage])
      } else {
        // Handle error response
        const errorMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          text: "Sorry, I'm having trouble processing your request. Please try again later.",
          sender: 'bot',
          timestamp: new Date()
        }
        setMessages(prev => [...prev, errorMessage])
      }
    } catch (error) {
      console.error("Error getting chatbot response:", error)
      // Add error message
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        text: "Sorry, I'm having trouble connecting to our servers. Please try again later.",
        sender: 'bot',
        timestamp: new Date()
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }
  
  // Generate bot response based on user input
  const generateBotResponse = (input: string): string => {
    const lowercaseInput = input.toLowerCase()
    
    // Check for keyword matches
    for (const [keyword, response] of Object.entries(botResponses)) {
      if (lowercaseInput.includes(keyword)) {
        return response
      }
    }
    
    // Handle specific questions with more complex logic
    if (lowercaseInput.includes('open') && lowercaseInput.includes('account')) {
      return "To open a new account, you can start the process online through our website or visit any branch with your ID and proof of address."
    }
    
    if (lowercaseInput.includes('mobile') && (lowercaseInput.includes('app') || lowercaseInput.includes('banking'))) {
      return "Our mobile app is available on iOS and Android. You can download it from the App Store or Google Play Store by searching for 'AMEN Bank'."
    }
    
    // Default response if no matches
    return "I'm not sure I understand. Could you rephrase your question? You can ask about accounts, transfers, loans, or contact information."
  }
  
  // Handle pressing Enter to send message
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSendMessage()
    }
  }

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    
    // Clear error when field is edited
    if (formErrors[name]) {
      setFormErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }

  // Validate form
  const validateForm = () => {
    const errors: Record<string, string> = {}
    let isValid = true

    if (!formData.firstName.trim()) {
      errors.firstName = "First name is required"
      isValid = false
    }

    if (!formData.email.trim()) {
      errors.email = "Email is required"
      isValid = false
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "Please enter a valid email address"
      isValid = false
    }

    if (!formData.subject) {
      errors.subject = "Please select a subject"
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

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }
    
    setIsSubmitting(true)
    
    try {
      // Send data to backend
      const response = await axios.post("http://localhost:5001/api/support/contact", {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        subject: formData.subject,
        message: formData.message
      }, {
        withCredentials: true
      })
      
      // Reset form on success
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        subject: "",
        message: ""
      })
      
      // Display success message from the server or a default one
      toast.success(response.data.message || "Your message has been sent successfully. We'll get back to you soon.")
    } catch (error) {
      console.error("Error submitting form:", error)
      
      // Improved error handling
      if (axios.isAxiosError(error)) {
        if (error.response) {
          // Server responded with an error status code
          if (error.response.status === 404) {
            toast.error("The requested endpoint was not found. Please try again later.")
          } else if (error.response.status === 400 && error.response.data.errors) {
            // Validation errors
            const validationErrors = error.response.data.errors.map((err: any) => err.msg).join(', ');
            toast.error(`Please correct the following: ${validationErrors}`);
          } else {
            toast.error(error.response.data.message || "Failed to send message. Please try again later.")
          }
        } else if (error.request) {
          // Request was made but no response received
          toast.error("No response received from server. Please check your connection.")
        } else {
          // Error setting up the request
          toast.error("Error setting up request. Please try again later.")
        }
      } else {
        toast.error("Failed to send message. Please try again later.")
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-8">
      {/* Hero Section with Gradient Background */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-8 rounded-xl text-white mb-10 shadow-lg">
        <h2 className="text-3xl font-bold mb-3">How Can We Help You?</h2>
        <p className="text-blue-100 text-lg max-w-2xl">
          Our dedicated support team is here to assist you with any questions or issues you may have.
          We're committed to providing exceptional service to all our customers.
        </p>
      </div>
      
      {/* Enhanced support cards with better hover effects */}
      <div className="grid grid-cols-1 gap-8 md:grid-cols-3 mb-10">
        <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 border-t-4 border-blue-600 transform hover:-translate-y-2">
          <div className="p-6 flex flex-col items-center text-center">
            <div className="bg-blue-100 p-4 rounded-full mb-5">
              <Phone className="h-8 w-8 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Call Us</h3>
            <p className="text-gray-600 mb-4">Our customer service is available 24/7 to assist you with any urgent matters</p>
            <p className="font-medium text-lg text-blue-800 mb-4">+216 71 123 456</p>
            <a href="tel:+21671123456" className="btn bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-full transition-colors">
              Call now
            </a>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 border-t-4 border-blue-600 transform hover:-translate-y-2">
          <div className="p-6 flex flex-col items-center text-center">
            <div className="bg-blue-100 p-4 rounded-full mb-5">
              <Mail className="h-8 w-8 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Email Us</h3>
            <p className="text-gray-600 mb-4">We'll respond to your inquiry within 24 hours during business days</p>
            <p className="font-medium text-lg text-blue-800 mb-4">support@amenbank.com</p>
            <a href="mailto:support@amenbank.com" className="btn bg-white border border-blue-600 text-blue-600 hover:bg-blue-50 px-6 py-2 rounded-full transition-colors">
              Send email
            </a>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 border-t-4 border-blue-600 transform hover:-translate-y-2">
          <div className="p-6 flex flex-col items-center text-center">
            <div className="bg-blue-100 p-4 rounded-full mb-5">
              <MessageSquare className="h-8 w-8 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Live Chat</h3>
            <p className="text-gray-600 mb-4">Get immediate assistance from our virtual assistant or support team</p>
            <button 
              onClick={() => setChatOpen(true)} 
              className="btn bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-full transition-colors"
            >
              Start Chat
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* Contact Form Card */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-4">
            <h2 className="text-xl font-bold text-white">Contact Us</h2>
          </div>
          <div className="p-6">
            <form className="space-y-5" onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div className="space-y-2">
                  <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                    First Name <span className="text-red-500">*</span>
                  </label>
                  <input 
                    id="firstName" 
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    placeholder="Enter your first name" 
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${formErrors.firstName ? 'border-red-300 bg-red-50' : 'border-gray-300'}`} 
                  />
                  {formErrors.firstName && <p className="text-sm text-red-600">{formErrors.firstName}</p>}
                </div>
                <div className="space-y-2">
                  <label htmlFor="lastName" className="block text-sm font-medium">
                    Last Name
                  </label>
                  <input 
                    id="lastName" 
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    placeholder="Enter your last name" 
                    className="input" 
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="email" className="block text-sm font-medium">
                  Email <span className="text-red-500">*</span>
                </label>
                <input 
                  id="email" 
                  name="email"
                  type="email" 
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Enter your email" 
                  className={`input ${formErrors.email ? 'border-red-300' : ''}`} 
                />
                {formErrors.email && <p className="text-sm text-red-600">{formErrors.email}</p>}
              </div>

              <div className="space-y-2">
                <label htmlFor="subject" className="block text-sm font-medium">
                  Subject <span className="text-red-500">*</span>
                </label>
                <select 
                  id="subject" 
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  className={`input ${formErrors.subject ? 'border-red-300' : ''}`}
                >
                  <option value="" disabled>
                    Select subject
                  </option>
                  <option value="account">Account Issues</option>
                  <option value="transfer">Transfer Problems</option>
                  <option value="loan">Loan Inquiry</option>
                  <option value="card">Card Services</option>
                  <option value="other">Other</option>
                </select>
                {formErrors.subject && <p className="text-sm text-red-600">{formErrors.subject}</p>}
              </div>

              <div className="space-y-2">
                <label htmlFor="message" className="block text-sm font-medium">
                  Message <span className="text-red-500">*</span>
                </label>
                <textarea 
                  id="message" 
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  placeholder="Enter your message" 
                  rows={5} 
                  className={`input min-h-[120px] ${formErrors.message ? 'border-red-300' : ''}`} 
                />
                {formErrors.message && <p className="text-sm text-red-600">{formErrors.message}</p>}
              </div>

              <button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center justify-center"
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
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
            </form>
          </div>
        </div>

        {/* FAQ Card */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-4">
            <h2 className="text-xl font-bold text-white">Frequently Asked Questions</h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {/* FAQ Item */}
              <div className="border border-gray-200 rounded-lg overflow-hidden hover:border-blue-300 transition-colors duration-300">
                <button
                  className="flex w-full items-center justify-between p-4 text-left font-medium"
                  onClick={() => toggleAccordion("item-1")}
                >
                  <span className="text-gray-800">How do I reset my online banking password?</span>
                  <ChevronDown
                    className={`h-5 w-5 text-blue-600 transition-transform duration-300 ${activeAccordion === "item-1" ? "rotate-180" : ""}`}
                  />
                </button>
                {activeAccordion === "item-1" && (
                  <div className="p-4 pt-0 text-gray-600 bg-blue-50 border-t">
                    <p>
                      To reset your password, click on the "Forgot Password" link on the login page. You will receive a
                      verification code to your registered email or phone number. Use this code to create a new password.
                      For security reasons, choose a strong password that you haven't used before.
                    </p>
                  </div>
                )}
              </div>

              <div className="border rounded-md overflow-hidden hover:border-[var(--primary)]/30 transition-colors duration-300">
                <button
                  className="flex w-full items-center justify-between p-4 text-left font-medium"
                  onClick={() => toggleAccordion("item-2")}
                >
                  How can I apply for a loan online?
                  <ChevronDown
                    className={`h-5 w-5 text-[var(--primary)] transition-transform duration-300 ${activeAccordion === "item-2" ? "rotate-180" : ""}`}
                  />
                </button>
                {activeAccordion === "item-2" && (
                  <div className="p-4 pt-0 text-[var(--muted)] bg-gray-50">
                    You can apply for a loan by navigating to the "Loan Management" section in your dashboard. Select
                    "Apply for Loan", fill out the application form, and submit the required documents. You can track
                    your application status in the same section.
                  </div>
                )}
              </div>

              <div className="border rounded-md overflow-hidden hover:border-[var(--primary)]/30 transition-colors duration-300">
                <button
                  className="flex w-full items-center justify-between p-4 text-left font-medium"
                  onClick={() => toggleAccordion("item-3")}
                >
                  What are the transfer limits for online transactions?
                  <ChevronDown
                    className={`h-5 w-5 text-[var(--primary)] transition-transform duration-300 ${activeAccordion === "item-3" ? "rotate-180" : ""}`}
                  />
                </button>
                {activeAccordion === "item-3" && (
                  <div className="p-4 pt-0 text-[var(--muted)] bg-gray-50">
                    The default daily transfer limit is 10,000 TND for individual accounts. For business accounts, the
                    limit is 50,000 TND. You can request a temporary or permanent increase by contacting our customer
                    service.
                  </div>
                )}
              </div>

              <div className="border rounded-md overflow-hidden hover:border-[var(--primary)]/30 transition-colors duration-300">
                <button
                  className="flex w-full items-center justify-between p-4 text-left font-medium"
                  onClick={() => toggleAccordion("item-4")}
                >
                  How do I report a suspicious transaction?
                  <ChevronDown
                    className={`h-5 w-5 text-[var(--primary)] transition-transform duration-300 ${activeAccordion === "item-4" ? "rotate-180" : ""}`}
                  />
                </button>
                {activeAccordion === "item-4" && (
                  <div className="p-4 pt-0 text-[var(--muted)] bg-gray-50">
                    If you notice any suspicious activity on your account, please contact our 24/7 hotline immediately
                    at +216 71 123 456. You can also temporarily freeze your account through the "Security" section in
                    your dashboard.
                  </div>
                )}
              </div>

              <div className="border rounded-md overflow-hidden hover:border-[var(--primary)]/30 transition-colors duration-300">
                <button
                  className="flex w-full items-center justify-between p-4 text-left font-medium"
                  onClick={() => toggleAccordion("item-5")}
                >
                  How can I update my personal information?
                  <ChevronDown
                    className={`h-5 w-5 text-[var(--primary)] transition-transform duration-300 ${activeAccordion === "item-5" ? "rotate-180" : ""}`}
                  />
                </button>
                {activeAccordion === "item-5" && (
                  <div className="p-4 pt-0 text-[var(--muted)] bg-gray-50">
                    You can update your contact information (email, phone number) in the "Settings" section of your
                    dashboard. For changes to your name, address, or ID documents, please visit your nearest branch with
                    the relevant documentation.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Chat Modal */}
      {chatOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md flex flex-col h-[600px] max-h-[90vh]">
            {/* Chat Header */}
            <div className="p-4 border-b flex items-center justify-between bg-[var(--primary)] text-white rounded-t-lg">
              <div className="flex items-center">
                <Bot className="h-6 w-6 mr-2" />
                <h3 className="font-medium">AMEN Bank Support</h3>
              </div>
              <button 
                onClick={() => setChatOpen(false)}
                className="text-white hover:text-gray-200 focus:outline-none"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            {/* Chat Messages */}
            <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
              {messages.map((message) => (
                <div 
                  key={message.id} 
                  className={`mb-4 flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`
                    max-w-[80%] p-3 rounded-lg 
                    ${message.sender === 'user' 
                      ? 'bg-[var(--primary)] text-white rounded-tr-none' 
                      : 'bg-gray-200 text-gray-800 rounded-tl-none'}
                  `}>
                    <div className="flex items-center mb-1">
                      {message.sender === 'bot' && <Bot className="h-4 w-4 mr-1" />}
                      {message.sender === 'user' && <User className="h-4 w-4 mr-1" />}
                      <span className="text-xs opacity-75">
                        {message.sender === 'user' ? 'You' : 'Support Bot'} • {message.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                      </span>
                    </div>
                    <p>{message.text}</p>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
            
            {/* Chat Input */}
            <div className="p-4 border-t">
              {isLoading && (
                <div className="flex justify-start mb-4">
                  <div className="bg-gray-200 text-gray-800 p-3 rounded-lg rounded-tl-none max-w-[80%]">
                    <div className="flex items-center">
                      <Bot className="h-4 w-4 mr-1" />
                      <span className="text-xs opacity-75">
                        Support Bot • {new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                      </span>
                    </div>
                    <p className="flex items-center">
                      <span className="mr-2">Typing</span>
                      <span className="typing-animation">
                        <span className="dot"></span>
                        <span className="dot"></span>
                        <span className="dot"></span>
                      </span>
                    </p>
                  </div>
                </div>
              )}
              <div className="flex items-center">
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type your message..."
                  className="input flex-1 mr-2"
                />
                <button 
                  onClick={handleSendMessage}
                  disabled={!inputMessage.trim()}
                  className="btn btn-primary p-2 rounded-full h-10 w-10 flex items-center justify-center"
                >
                  <Send className="h-5 w-5" />
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-2 text-center">
                This is an AI assistant. For complex issues, please call +216 71 123 456.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
