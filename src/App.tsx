"use client"
import { Navigate, Route, BrowserRouter as Router, Routes } from "react-router-dom"
import { useEffect } from "react"
import { ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

// Pages
import HomePage from "./pages/home-page"
import LoginPage from "./pages/login-page"
import RegisterPage from "./pages/register-page"
import ForgotPasswordPage from "./pages/forgot-password-page"
import NotFoundPage from "./pages/not-found-page"

// Services Pages
import AboutPage from "./pages/ServicesPage/About"
import ContactPage from "./pages/ServicesPage/Contact"
import ServicesPage from "./pages/ServicesPage/Services"

// User Pages
import Dashboard from "./pages/User/dashboard"
import Accounts from "./pages/User/accounts"
import Transactions from "./pages/User/transactions"
import Loans from "./pages/User/loans"
import Support from "./pages/User/support"
import Notifications from "./pages/User/notifications"
import NewAccount from "./pages/User/newAcc"
import Transfers from "./pages/User/transfere"
import Settings from "./pages/User/settings"

// Admin Pages
import AdminLayout from "./components/admin compoents/layout"
import AdminDashboard from "./pages/admin/dashboard"
import UserManagement from "./pages/admin/userManagement"
import Permissions from "./pages/admin/permission"
import AccountRequests from "./pages/admin/accountReq"
import LoanRequests from "./pages/admin/loanReq"
import GeneralRequests from "./pages/admin/generalReq"
import Monitoring from "./pages/admin/monitoring"

// Store
import { useAuthStore } from  "../src/store/auth-store"
import { GlobalChatbot } from "./components/global-chatbot"

function App() {
  const { currentUser, checkAuth, isLoading } = useAuthStore()
  
  useEffect(() => {
    checkAuth()
  }, [checkAuth])

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center">
          <div className="relative">
            <div className="h-24 w-24 rounded-full border-t-4 border-b-4 border-blue-600 animate-spin"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <div className="h-16 w-16 rounded-full border-t-4 border-b-4 border-blue-300 animate-spin animate-reverse"></div>
            </div>
          </div>
          <div className="mt-4 text-lg font-medium text-blue-600">
            Loading...
          </div>
          <div className="mt-2 text-sm text-gray-500">
            Please wait while we set things up
          </div>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <ToastContainer />
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/services" element={<ServicesPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route 
          path="/login" 
          element={
            currentUser && currentUser.role === "admin" 
              ? <Navigate to="/admin" /> 
              : currentUser && currentUser.role === "user" 
                ? <Navigate to="/dashboard" /> 
                : <LoginPage />
          } 
        />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />

        {/* Protected User routes - Only accessible to users with role "user" */}
        <Route 
          path="/dashboard" 
          element={
            currentUser ? 
              currentUser.role === "user" ? 
                <Dashboard /> : 
                <Navigate to="/admin" /> 
              : <Navigate to="/login" />
          } 
        />
        <Route 
          path="/accounts" 
          element={
            currentUser ? 
              currentUser.role === "user" ? 
                <Accounts /> : 
                <Navigate to="/admin" /> 
              : <Navigate to="/login" />
          } 
        />
        <Route 
          path="/transactions" 
          element={
            currentUser ? 
              currentUser.role === "user" ? 
                <Transactions /> : 
                <Navigate to="/admin" /> 
              : <Navigate to="/login" />
          } 
        />
        <Route 
          path="/transfers" 
          element={
            currentUser ? 
              currentUser.role === "user" ? 
                <Transfers /> : 
                <Navigate to="/admin" /> 
              : <Navigate to="/login" />
          } 
        />
        <Route 
          path="/loans" 
          element={
            currentUser ? 
              currentUser.role === "user" ? 
                <Loans /> : 
                <Navigate to="/admin" /> 
              : <Navigate to="/login" />
          } 
        />
        <Route 
          path="/support" 
          element={
            currentUser ? 
              currentUser.role === "user" ? 
                <Support /> : 
                <Navigate to="/admin" /> 
              : <Navigate to="/login" />
          } 
        />
        <Route 
          path="/notifications" 
          element={
            currentUser ? 
              currentUser.role === "user" ? 
                <Notifications /> : 
                <Navigate to="/admin" /> 
              : <Navigate to="/login" />
          } 
        />
        <Route 
          path="/new-account" 
          element={
            currentUser ? 
              currentUser.role === "user" ? 
                <NewAccount /> : 
                <Navigate to="/admin" /> 
              : <Navigate to="/login" />
          } 
        />
        <Route 
          path="/settings" 
          element={
            currentUser ? 
              currentUser.role === "user" ? 
                <Settings /> : 
                <Navigate to="/admin" /> 
              : <Navigate to="/login" />
          } 
        />

        {/* Admin routes - Only accessible to users with role "admin" */}
        <Route 
          path="/admin" 
          element={
            currentUser ? 
              currentUser.role === "admin" ? 
                <AdminLayout /> : 
                <Navigate to="/dashboard" /> 
              : <Navigate to="/login" />
          }
        >
          <Route index element={<AdminDashboard />} />
          <Route path="users" element={<UserManagement />} />
          <Route path="permissions" element={<Permissions />} />
          <Route path="monitoring" element={<Monitoring />} />
          <Route path="requests/accounts" element={<AccountRequests />} />
          <Route path="requests/loans" element={<LoanRequests />} />
          <Route path="requests/general" element={<GeneralRequests />} />
        </Route>

        {/* 404 page */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
      <GlobalChatbot />
    </Router>
  )
}

export default App

