import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/auth-context";
import Navbar from "./components/navbar";
import Footer from "./components/footer";
import HomePage from "./pages/home-page";
import LoginPage from "./pages/login-page";
import RegisterPage from "./pages/register-page";
import DashboardLayout from "./layouts/dashboard-layout";
import DashboardOverview from "./pages/dashboard/overview";
import AccountsPage from "./pages/dashboard/accounts";
import TransferPage from "./pages/dashboard/transfer";
import LoanSimulatorPage from "./pages/dashboard/loan-simulator";
import UserSettingsPage from "./pages/dashboard/settings";
import SupportChatbotPage from "./pages/dashboard/support";
import ProtectedRoute from "./components/protected-route";
import AdminLayout from "./layouts/admin-layout";
import AdminOverviewPage from "./pages/admin/overview";
import UsersManagementPage from "./pages/admin/users-management";
import AccountsManagementPage from "./pages/admin/accounts-management";
import NotFoundPage from "./pages/not-found-page";
import AdminSettingsPage from "./pages/admin/admin-settings"
import ActivityLogsPage from "./pages/admin/activity-logs";
import LoanApplicationsPage from "./pages/admin/loan-applications";
function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public routes with navbar and footer */}
          <Route
            path="/"
            element={
              <div className="flex flex-col min-h-screen">
                <Navbar />
                <main className="flex-grow">
                  <HomePage />
                </main>
                <Footer />
              </div>
            }
          />
          <Route
            path="/login"
            element={
              <div className="flex flex-col min-h-screen">
                <Navbar />
                <main className="flex-grow">
                  <LoginPage />
                </main>
                <Footer />
              </div>
            }
          />
          <Route
            path="/register"
            element={
              <div className="flex flex-col min-h-screen">
                <Navbar />
                <main className="flex-grow">
                  <RegisterPage />
                </main>
                <Footer />
              </div>
            }
          />

          {/* Dashboard routes with dashboard layout */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute requiredRole="user">
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<DashboardOverview />} />
            <Route path="accounts" element={<AccountsPage />} />
            <Route path="transfer" element={<TransferPage />} />
            <Route path="loans" element={<LoanSimulatorPage />} />
            <Route path="support" element={<SupportChatbotPage />} />
            <Route path="settings" element={<UserSettingsPage />} />
          </Route>

          {/* Admin routes with admin layout */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute requiredRole="admin">
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<AdminOverviewPage />} />
            <Route path="users" element={<UsersManagementPage />} />
            <Route path="accounts" element={<AccountsManagementPage />} />
            {/* Add more admin routes as needed */}
            <Route path="activity" element={<ActivityLogsPage />} />
            <Route path="loans" element={<LoanApplicationsPage />} />
            <Route path="settings" element={<AdminSettingsPage />} />
          </Route>

          {/* 404 page */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;