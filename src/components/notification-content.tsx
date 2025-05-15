"use client"

import { useEffect, useState } from "react"
import { Bell, Check, Clock, CreditCard, Info, X, Loader2, Shield, FileText } from "lucide-react"
import axios from "axios"

type Notification = {
  _id: string
  title: string
  message: string
  createdAt: string
  type: "transaction" | "security" | "account" | "promotion" | "loan" | "transfer"
  read: boolean
  relatedItemId?: string
  relatedItemType?: string
}

export function NotificationsContent() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [unreadCount, setUnreadCount] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [activeTab, setActiveTab] = useState("all")
  const [filterType, setFilterType] = useState<string | null>(null)
  
  // New state for modal
  const [showModal, setShowModal] = useState(false)
  const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null)
  const [relatedItemDetails, setRelatedItemDetails] = useState<any>(null)
  const [loadingDetails, setLoadingDetails] = useState(false)

  const [preferences, setPreferences] = useState({
    transactions: true,
    security: true,
    account: true,
    promotions: false,
    loan: true,
    transfer: true,
    email: true,
    sms: true,
    push: true,
  })

  useEffect(() => {
    fetchNotifications()
  }, [currentPage, filterType])

  // Add a polling mechanism to refresh notifications periodically
  useEffect(() => {
    // Initial fetch is already handled in the existing useEffect

    // Set up polling every 30 seconds
    const pollingInterval = setInterval(() => {
      fetchNotifications();
    }, 30000);

    // Clean up interval on component unmount
    return () => clearInterval(pollingInterval);
  }, []);

  const fetchNotifications = async () => {
    setLoading(true)
    try {
      let url = `http://localhost:5001/api/users/notifications?page=${currentPage}&limit=10`
      
      if (activeTab === "unread") {
        url += "&read=false"
      }
      
      if (filterType && filterType !== "all") {
        url += `&type=${filterType}`
      }
      
      const response = await axios.get(url, {
        withCredentials: true
      })
      
      if (response.data.success) {
        setNotifications(response.data.notifications)
        setUnreadCount(response.data.unreadCount)
        setTotalPages(response.data.totalPages)
      } else {
        setError("Failed to fetch notifications")
      }
    } catch (error) {
      console.error("Error fetching notifications:", error)
      setError("An error occurred while fetching notifications")
    } finally {
      setLoading(false)
    }
  }

  const handleToggleRead = async (id: string) => {
    try {
      const notification = notifications.find(n => n._id === id)
      const newReadStatus = !notification?.read
      
      const response = await axios.patch(
        `http://localhost:5001/api/users/notifications/${id}/read`, 
        {}, 
        { withCredentials: true }
      )
      
      if (response.data.success) {
        setNotifications(
          notifications.map((notification) =>
            notification._id === id ? { ...notification, read: true } : notification,
          )
        )
        
        if (newReadStatus) {
          setUnreadCount(prev => Math.max(0, prev - 1))
        }
      }
    } catch (error) {
      console.error("Error updating notification:", error)
    }
  }

  const handleMarkAllRead = async () => {
    try {
      const response = await axios.patch(
        `http://localhost:5001/api/users/notifications/read-all`, 
        {}, 
        { withCredentials: true }
      )
      
      if (response.data.success) {
        setNotifications(notifications.map((notification) => ({ ...notification, read: true })))
        setUnreadCount(0)
      }
    } catch (error) {
      console.error("Error marking all as read:", error)
    }
  }

  const handleClearAll = async () => {
    // This would require a bulk delete endpoint, which we haven't implemented
    // For now, just show a message
    alert("This feature is not yet implemented")
  }

  const handlePreferenceChange = (key: keyof typeof preferences) => {
    setPreferences((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  const handleTabChange = (tab: string) => {
    setActiveTab(tab)
    setCurrentPage(1)
    
    if (tab === "all") {
      setFilterType(null)
    } else if (tab === "unread") {
      setFilterType(null)
    } else {
      setFilterType(tab)
    }
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "transaction":
        return <CreditCard className="h-5 w-5 text-white" />
      case "security":
        return <Shield className="h-5 w-5 text-white" />
      case "account":
        return <Bell className="h-5 w-5 text-white" />
      case "promotion":
        return <Clock className="h-5 w-5 text-white" />
      case "loan":
        return <FileText className="h-5 w-5 text-white" />
      case "transfer":
        return <CreditCard className="h-5 w-5 text-white" />
      default:
        return <Bell className="h-5 w-5 text-white" />
    }
  }

  const getNotificationColor = (type: string) => {
    switch (type) {
      case "transaction":
        return "bg-blue-500 text-white"
      case "security":
        return "bg-red-500 text-white"
      case "account":
        return "bg-green-500 text-white"
      case "promotion":
        return "bg-purple-500 text-white"
      case "loan":
        return "bg-amber-500 text-white"
      case "transfer":
        return "bg-indigo-500 text-white"
      default:
        return "bg-gray-500 text-white"
    }
  }

  // Add a function to handle notification click and show modal
  const handleNotificationClick = async (notification: Notification) => {
    try {
      // Mark as read
      await handleToggleRead(notification._id);
      
      // Set the selected notification for the modal
      setSelectedNotification(notification);
      setShowModal(true);
      
      // Fetch related item details if available
      if (notification.relatedItemId && notification.relatedItemType) {
        setLoadingDetails(true);
        try {
          let url = '';
          
          switch (notification.relatedItemType) {
            case 'account':
              url = `http://localhost:5001/api/users/accounts/${notification.relatedItemId}`;
              break;
            case 'transfer':
              url = `http://localhost:5001/api/users/transfers/${notification.relatedItemId}`;
              break;
            case 'loan':
              url = `http://localhost:5001/api/users/loans/${notification.relatedItemId}`;
              break;
            case 'transaction':
              url = `http://localhost:5001/api/users/transactions/${notification.relatedItemId}`;
              break;
            default:
              break;
          }
          
          if (url) {
            const response = await axios.get(url, { withCredentials: true });
            if (response.data.success) {
              setRelatedItemDetails(response.data);
            }
          }
        } catch (error) {
          console.error("Error fetching related item details:", error);
        } finally {
          setLoadingDetails(false);
        }
      }
    } catch (error) {
      console.error("Error handling notification click:", error);
    }
  };

  // Function to close the modal
  const closeModal = () => {
    setShowModal(false);
    setSelectedNotification(null);
    setRelatedItemDetails(null);
  };

  return (
    <div className="tabs">
      <div className="flex items-center justify-between mb-6">
        <div className="tabs-list bg-gray-100 p-1.5 rounded-lg shadow-sm">
          <button
            className={`tabs-trigger px-4 py-2 rounded-md transition-all ${activeTab === "all" ? "bg-white shadow-sm font-medium" : "hover:bg-gray-200"}`}
            onClick={() => handleTabChange("all")}
          >
            All
            {unreadCount > 0 && (
              <span className="ml-2 rounded-full bg-blue-600 px-2 py-0.5 text-xs text-white">
                {unreadCount}
              </span>
            )}
          </button>
          <button
            className={`tabs-trigger px-4 py-2 rounded-md transition-all ${activeTab === "unread" ? "bg-white shadow-sm font-medium" : "hover:bg-gray-200"}`}
            onClick={() => handleTabChange("unread")}
          >
            Unread
          </button>
          <button
            className={`tabs-trigger px-4 py-2 rounded-md transition-all ${activeTab === "settings" ? "bg-white shadow-sm font-medium" : "hover:bg-gray-200"}`}
            onClick={() => setActiveTab("settings")}
          >
            Settings
          </button>
        </div>

        <div className="flex gap-2">
          <button className="btn btn-outline btn-sm flex items-center gap-1 hover:bg-gray-50" onClick={handleMarkAllRead}>
            <Check className="h-4 w-4" />
            Mark all read
          </button>
          <button className="btn btn-outline btn-sm flex items-center gap-1 hover:bg-gray-50" onClick={handleClearAll}>
            <X className="h-4 w-4" />
            Clear all
          </button>
        </div>
      </div>

      <div className="tabs-content">
        {activeTab === "all" && (
          <div className="card border border-gray-200 rounded-lg shadow-sm overflow-hidden">
            <div className="card-content p-0">
              {notifications.length > 0 ? (
                <div className="divide-y">
                  {notifications.map((notification) => (
                    <div
                      key={notification._id}
                      className={`flex items-start p-4 cursor-pointer hover:bg-gray-50 transition-colors ${!notification.read ? "bg-blue-50" : ""}`}
                      onClick={() => handleNotificationClick(notification)}
                    >
                      <div
                        className={`mr-4 flex h-10 w-10 items-center justify-center rounded-full shadow-sm ${getNotificationColor(
                          notification.type,
                        )}`}
                      >
                        {getNotificationIcon(notification.type)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h3 className={`font-medium ${!notification.read ? "text-blue-800" : ""}`}>{notification.title}</h3>
                          <span className="text-sm text-[var(--muted)]">
                            {new Date(notification.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-sm text-[var(--muted)] mt-1">{notification.message}</p>
                        <div className="mt-2">
                          <span className="inline-block text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-600">
                            {notification.type.charAt(0).toUpperCase() + notification.type.slice(1)}
                          </span>
                        </div>
                      </div>
                      <button 
                        className="btn btn-outline btn-sm ml-2" 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleToggleRead(notification._id);
                        }}
                      >
                        {notification.read ? "Mark as unread" : "Mark as read"}
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 bg-gray-50">
                  <Bell className="mb-4 h-12 w-12 text-gray-300" />
                  <h3 className="text-lg font-medium">No notifications</h3>
                  <p className="text-sm text-[var(--muted)]">You don't have any notifications at the moment</p>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === "unread" && (
          <div className="card border border-gray-200 rounded-lg shadow-sm overflow-hidden">
            <div className="card-content p-0">
              {notifications.filter((n) => !n.read).length > 0 ? (
                <div className="divide-y">
                  {notifications
                    .filter((n) => !n.read)
                    .map((notification) => (
                      <div 
                        key={notification._id} 
                        className="flex items-start p-4 bg-blue-50 hover:bg-blue-100 transition-colors cursor-pointer"
                        onClick={() => handleNotificationClick(notification)}
                      >
                        <div
                          className={`mr-4 flex h-10 w-10 items-center justify-center rounded-full shadow-sm ${getNotificationColor(
                            notification.type,
                          )}`}
                        >
                          {getNotificationIcon(notification.type)}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <h3 className="font-medium text-blue-800">{notification.title}</h3>
                            <span className="text-sm text-[var(--muted)]">
                              {new Date(notification.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                          <p className="text-sm text-[var(--muted)] mt-1">{notification.message}</p>
                          <div className="mt-2">
                            <span className="inline-block text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-700">
                              {notification.type.charAt(0).toUpperCase() + notification.type.slice(1)}
                            </span>
                          </div>
                        </div>
                        <button 
                          className="btn btn-outline btn-sm ml-2" 
                          onClick={(e) => {
                            e.stopPropagation();
                            handleToggleRead(notification._id);
                          }}
                        >
                          Mark as read
                        </button>
                      </div>
                    ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 bg-gray-50">
                  <Check className="mb-4 h-12 w-12 text-green-300" />
                  <h3 className="text-lg font-medium">All caught up!</h3>
                  <p className="text-sm text-[var(--muted)]">You have no unread notifications</p>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === "settings" && (
          <div className="card border border-gray-200 rounded-lg shadow-sm overflow-hidden">
            <div className="card-header bg-gray-50 px-6 py-4 border-b border-gray-200">
              <h2 className="card-title text-lg font-medium">Notification Preferences</h2>
            </div>
            <div className="card-content p-6 space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-4 pb-2 border-b border-gray-100">Notification Types</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50">
                    <div>
                      <label htmlFor="transactions" className="font-medium">
                        Transactions
                      </label>
                      <p className="text-sm text-[var(--muted)]">
                        Receive notifications about deposits, withdrawals, and transfers
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        id="transactions"
                        checked={preferences.transactions}
                        onChange={() => handlePreferenceChange("transactions")}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50">
                    <div>
                      <label htmlFor="security" className="font-medium">
                        Security Alerts
                      </label>
                      <p className="text-sm text-[var(--muted)]">
                        Receive notifications about login attempts and security updates
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        id="security"
                        checked={preferences.security}
                        onChange={() => handlePreferenceChange("security")}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50">
                    <div>
                      <label htmlFor="account" className="font-medium">
                        Account Updates
                      </label>
                      <p className="text-sm text-[var(--muted)]">
                        Receive notifications about account changes and bill reminders
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        id="account"
                        checked={preferences.account}
                        onChange={() => handlePreferenceChange("account")}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50">
                    <div>
                      <label htmlFor="promotions" className="font-medium">
                        Promotions & Offers
                      </label>
                      <p className="text-sm text-[var(--muted)]">
                        Receive notifications about new products and special offers
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        id="promotions"
                        checked={preferences.promotions}
                        onChange={() => handlePreferenceChange("promotions")}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-4 pb-2 border-b border-gray-100">Delivery Methods</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50">
                    <div>
                      <label htmlFor="email" className="font-medium">
                        Email Notifications
                      </label>
                      <p className="text-sm text-[var(--muted)]">Receive notifications via email</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        id="email"
                        checked={preferences.email}
                        onChange={() => handlePreferenceChange("email")}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50">
                    <div>
                      <label htmlFor="sms" className="font-medium">
                        SMS Notifications
                      </label>
                      <p className="text-sm text-[var(--muted)]">Receive notifications via SMS</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        id="sms"
                        checked={preferences.sms}
                        onChange={() => handlePreferenceChange("sms")}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50">
                    <div>
                      <label htmlFor="push" className="font-medium">
                        Push Notifications
                      </label>
                      <p className="text-sm text-[var(--muted)]">Receive notifications on your mobile device</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        id="push"
                        checked={preferences.push}
                        onChange={() => handlePreferenceChange("push")}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                </div>
              </div>

              <button className="btn btn-primary w-full">Save Preferences</button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
