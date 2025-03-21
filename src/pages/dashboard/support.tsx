"use client"

// src/pages/dashboard/support.tsx
import type React from "react"
import { useState, useRef, useEffect } from "react"
import { Send, Bot, User, RefreshCw } from "lucide-react"
import { useAuth } from "../../contexts/auth-context"

interface Message {
  id: number
  text: string
  sender: "user" | "bot"
  timestamp: Date
}

const SupportChatbotPage: React.FC = () => {
  const { currentUser } = useAuth()
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: `Hello ${currentUser?.name}, how can I help you today?`,
      sender: "bot",
      timestamp: new Date(),
    },
  ])
  const [inputMessage, setInputMessage] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()

    if (!inputMessage.trim()) return

    // Add user message
    const userMessage: Message = {
      id: messages.length + 1,
      text: inputMessage,
      sender: "user",
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputMessage("")
    setIsTyping(true)

    // Simulate bot response after a delay
    setTimeout(() => {
      const botResponse = getBotResponse(inputMessage)
      const botMessage: Message = {
        id: messages.length + 2,
        text: botResponse,
        sender: "bot",
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, botMessage])
      setIsTyping(false)
    }, 1000)
  }

  // Simple bot response logic
  const getBotResponse = (message: string): string => {
    const lowerMessage = message.toLowerCase()

    if (lowerMessage.includes("hello") || lowerMessage.includes("hi") || lowerMessage.includes("hey")) {
      return `Hello ${currentUser?.name}, how can I assist you today?`
    }

    if (lowerMessage.includes("account")) {
      return 'For account-related questions, you can check your account details in the "My Accounts" section. If you need more help, please call our customer service at +216 71 123 456.'
    }

    if (lowerMessage.includes("transfer") || lowerMessage.includes("send money")) {
      return 'You can make transfers by going to the "Transfer Money" section in your dashboard. We support both internal and external transfers.'
    }

    if (lowerMessage.includes("loan") || lowerMessage.includes("credit")) {
      return 'For loan information, please check our "Loan Simulator" section where you can calculate potential loan payments. For specific loan applications, please visit one of our branches.'
    }

    if (lowerMessage.includes("password") || lowerMessage.includes("forgot")) {
      return 'If you need to reset your password, please go to the "Settings" section and select the "Security" tab. If you\'re locked out of your account, please contact our support team.'
    }

    if (lowerMessage.includes("contact") || lowerMessage.includes("human") || lowerMessage.includes("agent")) {
      return "If you'd like to speak with a human agent, please call our customer service at +216 71 123 456 or email us at support@amenbank.com."
    }

    if (lowerMessage.includes("thank")) {
      return "You're welcome! Is there anything else I can help you with?"
    }

    return "I'm not sure I understand your question. Could you please rephrase or select from common topics: account information, transfers, loans, password reset, or contacting customer service?"
  }

  const formatTime = (date: Date): string => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900">Customer Support</h1>

      <div className="mt-6 bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <div className="flex flex-col h-[500px]">
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <div key={message.id} className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-xs md:max-w-md rounded-lg px-4 py-2 ${
                      message.sender === "user"
                        ? "bg-blue-900 text-white rounded-br-none"
                        : "bg-gray-100 text-gray-800 rounded-bl-none"
                    }`}
                  >
                    <div className="flex items-center mb-1">
                      {message.sender === "bot" ? <Bot className="h-4 w-4 mr-1" /> : <User className="h-4 w-4 mr-1" />}
                      <span className="text-xs font-medium">{message.sender === "user" ? "You" : "AMEN Support"}</span>
                      <span className="text-xs ml-2 opacity-75">{formatTime(message.timestamp)}</span>
                    </div>
                    <p className="text-sm whitespace-pre-wrap">{message.text}</p>
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 text-gray-800 rounded-lg rounded-bl-none px-4 py-2">
                    <div className="flex items-center">
                      <Bot className="h-4 w-4 mr-1" />
                      <span className="text-xs font-medium">AMEN Support</span>
                    </div>
                    <div className="flex items-center mt-1">
                      <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce mr-1"></div>
                      <div
                        className="w-2 h-2 bg-gray-500 rounded-full animate-bounce mr-1"
                        style={{ animationDelay: "0.2s" }}
                      ></div>
                      <div
                        className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"
                        style={{ animationDelay: "0.4s" }}
                      ></div>
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            <div className="border-t p-4">
              <form onSubmit={handleSendMessage} className="flex items-center">
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder="Type your message here..."
                  className="flex-1 focus:ring-blue-900 focus:border-blue-900 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                />
                <button
                  type="submit"
                  disabled={!inputMessage.trim() || isTyping}
                  className="ml-3 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-900 hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-900 disabled:opacity-50"
                >
                  {isTyping ? <RefreshCw className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
                </button>
              </form>

              <div className="mt-4">
                <p className="text-xs text-gray-500">
                  Common questions: account information, making transfers, loan information, password reset, contact
                  human agent
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SupportChatbotPage

