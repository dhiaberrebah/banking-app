"use client"

import type React from "react"
import { useState } from "react"
import { Save, RefreshCw } from "lucide-react"

interface SettingsState {
  general: {
    bankName: string
    supportEmail: string
    supportPhone: string
    maintenanceMode: boolean
  }
  security: {
    sessionTimeout: number
    maxLoginAttempts: number
    passwordExpiry: number
    require2FA: boolean
  }
  notifications: {
    emailNotifications: boolean
    smsNotifications: boolean
    loginAlerts: boolean
    transactionAlerts: boolean
  }
}

const AdminSettingsPage: React.FC = () => {
  const [settings, setSettings] = useState<SettingsState>({
    general: {
      bankName: "AMEN BANK",
      supportEmail: "support@amenbank.com",
      supportPhone: "+216 71 123 456",
      maintenanceMode: false,
    },
    security: {
      sessionTimeout: 30, // minutes
      maxLoginAttempts: 5,
      passwordExpiry: 90, // days
      require2FA: true,
    },
    notifications: {
      emailNotifications: true,
      smsNotifications: true,
      loginAlerts: true,
      transactionAlerts: true,
    },
  })

  const [isSaving, setIsSaving] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)

  const handleChange = (section: keyof SettingsState, field: string, value: string | number | boolean) => {
    setSettings({
      ...settings,
      [section]: {
        ...settings[section],
        [field]: value,
      },
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    setSaveSuccess(false)

    // Simulate API call
    setTimeout(() => {
      setIsSaving(false)
      setSaveSuccess(true)

      // Reset success message after 3 seconds
      setTimeout(() => {
        setSaveSuccess(false)
      }, 3000)
    }, 1000)
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Admin Settings</h1>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="space-y-8">
          {/* General Settings */}
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6">
              <h2 className="text-lg font-medium text-gray-900">General Settings</h2>
              <p className="mt-1 text-sm text-gray-500">Basic configuration for the banking application.</p>
            </div>
            <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
              <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="bankName" className="block text-sm font-medium text-gray-700">
                    Bank Name
                  </label>
                  <input
                    type="text"
                    id="bankName"
                    value={settings.general.bankName}
                    onChange={(e) => handleChange("general", "bankName", e.target.value)}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-900 focus:border-blue-900 sm:text-sm"
                  />
                </div>
                <div>
                  <label htmlFor="supportEmail" className="block text-sm font-medium text-gray-700">
                    Support Email
                  </label>
                  <input
                    type="email"
                    id="supportEmail"
                    value={settings.general.supportEmail}
                    onChange={(e) => handleChange("general", "supportEmail", e.target.value)}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-900 focus:border-blue-900 sm:text-sm"
                  />
                </div>
                <div>
                  <label htmlFor="supportPhone" className="block text-sm font-medium text-gray-700">
                    Support Phone
                  </label>
                  <input
                    type="text"
                    id="supportPhone"
                    value={settings.general.supportPhone}
                    onChange={(e) => handleChange("general", "supportPhone", e.target.value)}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-900 focus:border-blue-900 sm:text-sm"
                  />
                </div>
                <div className="flex items-center">
                  <input
                    id="maintenanceMode"
                    type="checkbox"
                    checked={settings.general.maintenanceMode}
                    onChange={(e) => handleChange("general", "maintenanceMode", e.target.checked)}
                    className="h-4 w-4 text-blue-900 focus:ring-blue-900 border-gray-300 rounded"
                  />
                  <label htmlFor="maintenanceMode" className="ml-2 block text-sm text-gray-700">
                    Maintenance Mode
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Security Settings */}
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6">
              <h2 className="text-lg font-medium text-gray-900">Security Settings</h2>
              <p className="mt-1 text-sm text-gray-500">Configure security parameters for the application.</p>
            </div>
            <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
              <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="sessionTimeout" className="block text-sm font-medium text-gray-700">
                    Session Timeout (minutes)
                  </label>
                  <input
                    type="number"
                    id="sessionTimeout"
                    value={settings.security.sessionTimeout}
                    onChange={(e) => handleChange("security", "sessionTimeout", Number.parseInt(e.target.value))}
                    min="1"
                    max="120"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-900 focus:border-blue-900 sm:text-sm"
                  />
                </div>
                <div>
                  <label htmlFor="maxLoginAttempts" className="block text-sm font-medium text-gray-700">
                    Max Login Attempts
                  </label>
                  <input
                    type="number"
                    id="maxLoginAttempts"
                    value={settings.security.maxLoginAttempts}
                    onChange={(e) => handleChange("security", "maxLoginAttempts", Number.parseInt(e.target.value))}
                    min="1"
                    max="10"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-900 focus:border-blue-900 sm:text-sm"
                  />
                </div>
                <div>
                  <label htmlFor="passwordExpiry" className="block text-sm font-medium text-gray-700">
                    Password Expiry (days)
                  </label>
                  <input
                    type="number"
                    id="passwordExpiry"
                    value={settings.security.passwordExpiry}
                    onChange={(e) => handleChange("security", "passwordExpiry", Number.parseInt(e.target.value))}
                    min="30"
                    max="365"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-900 focus:border-blue-900 sm:text-sm"
                  />
                </div>
                <div className="flex items-center">
                  <input
                    id="require2FA"
                    type="checkbox"
                    checked={settings.security.require2FA}
                    onChange={(e) => handleChange("security", "require2FA", e.target.checked)}
                    className="h-4 w-4 text-blue-900 focus:ring-blue-900 border-gray-300 rounded"
                  />
                  <label htmlFor="require2FA" className="ml-2 block text-sm text-gray-700">
                    Require 2FA for All Users
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Notification Settings */}
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6">
              <h2 className="text-lg font-medium text-gray-900">Notification Settings</h2>
              <p className="mt-1 text-sm text-gray-500">Configure how and when notifications are sent to users.</p>
            </div>
            <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
              <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
                <div className="flex items-center">
                  <input
                    id="emailNotifications"
                    type="checkbox"
                    checked={settings.notifications.emailNotifications}
                    onChange={(e) => handleChange("notifications", "emailNotifications", e.target.checked)}
                    className="h-4 w-4 text-blue-900 focus:ring-blue-900 border-gray-300 rounded"
                  />
                  <label htmlFor="emailNotifications" className="ml-2 block text-sm text-gray-700">
                    Email Notifications
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    id="smsNotifications"
                    type="checkbox"
                    checked={settings.notifications.smsNotifications}
                    onChange={(e) => handleChange("notifications", "smsNotifications", e.target.checked)}
                    className="h-4 w-4 text-blue-900 focus:ring-blue-900 border-gray-300 rounded"
                  />
                  <label htmlFor="smsNotifications" className="ml-2 block text-sm text-gray-700">
                    SMS Notifications
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    id="loginAlerts"
                    type="checkbox"
                    checked={settings.notifications.loginAlerts}
                    onChange={(e) => handleChange("notifications", "loginAlerts", e.target.checked)}
                    className="h-4 w-4 text-blue-900 focus:ring-blue-900 border-gray-300 rounded"
                  />
                  <label htmlFor="loginAlerts" className="ml-2 block text-sm text-gray-700">
                    Login Alerts
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    id="transactionAlerts"
                    type="checkbox"
                    checked={settings.notifications.transactionAlerts}
                    onChange={(e) => handleChange("notifications", "transactionAlerts", e.target.checked)}
                    className="h-4 w-4 text-blue-900 focus:ring-blue-900 border-gray-300 rounded"
                  />
                  <label htmlFor="transactionAlerts" className="ml-2 block text-sm text-gray-700">
                    Transaction Alerts
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          {saveSuccess && (
            <div className="mr-4 px-4 py-2 bg-green-100 text-green-800 rounded-md flex items-center">
              <RefreshCw className="h-5 w-5 mr-2 animate-spin" />
              Settings saved successfully!
            </div>
          )}
          <button
            type="submit"
            disabled={isSaving}
            className="px-4 py-2 bg-blue-900 text-white rounded-md flex items-center disabled:opacity-50"
          >
            {isSaving ? (
              <>
                <RefreshCw className="h-5 w-5 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="h-5 w-5 mr-2" />
                Save Settings
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  )
}

export default AdminSettingsPage

