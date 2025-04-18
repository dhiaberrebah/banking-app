"use client"

import { useState, useRef, useEffect } from "react"
import { Bot, User, Send, X, MessageSquare } from "lucide-react"
import axios from "axios"

// Define the chat message interface
interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

export function GlobalChatbot() {
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
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Scroll to bottom of messages when new message is added
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

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
    setIsLoading(true)

    try {
      // Call backend API
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

  // Handle pressing Enter to send message
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSendMessage()
    }
  }

  return (
    <>
      {/* Chat button */}
      <button 
        onClick={() => setChatOpen(true)}
        className="fixed bottom-6 right-6 bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all z-50 flex items-center group"
        aria-label="Open chat"
      >
        <MessageSquare className="h-6 w-6" />
        <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-500 ease-linear">
          <span className="pl-2">Chat with us</span>
        </span>
      </button>

      {/* Chat Modal */}
      {chatOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md flex flex-col h-[500px] max-h-[90vh] overflow-hidden">
            {/* Chat Header */}
            <div className="p-4 border-b flex items-center justify-between bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-t-xl">
              <div className="flex items-center">
                <Bot className="h-6 w-6 mr-2" />
                <h3 className="font-medium">AMEN Bank Support</h3>
              </div>
              <button 
                onClick={() => setChatOpen(false)}
                className="text-white hover:text-gray-200 focus:outline-none bg-white/20 rounded-full p-1"
              >
                <X className="h-5 w-5" />
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
                      ? 'bg-blue-600 text-white rounded-tr-none' 
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
    </>
  )
}
