import { useState } from "react"
import { X } from 'lucide-react'

interface UserFormProps {
  user?: any
  onClose: () => void
}

const UserForm: React.FC<UserFormProps> = ({ user, onClose }) => {
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    role: user?.role || "Client",
    status: user?.status || "Active",
    phone: user?.phone || "",
    permissions: {
      viewAccounts: user?.permissions?.viewAccounts || false,
      createAccounts: user?.permissions?.createAccounts || false,
      approveLoans: user?.permissions?.approveLoans || false,
      viewTransactions: user?.permissions?.viewTransactions || false,
      executeTransfers: user?.permissions?.executeTransfers || false,
      manageUsers: user?.permissions?.manageUsers || false,
      viewReports: user?.permissions?.viewReports || false,
      systemSettings: user?.permissions?.systemSettings || false,
    },
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const handlePermissionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target
    setFormData({
      ...formData,
      permissions: {
        ...formData.permissions,
        [name]: checked,
      },
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Submit logic would go here
    console.log("Form submitted:", formData)
    onClose()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            Full Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email Address
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
            Phone Number
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
            Role
          </label>
          <select
            id="role"
            name="role"
            value={formData.role}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="Admin">Admin</option>
            <option value="Employee">Employee</option>
            <option value="Client">Client</option>
          </select>
        </div>
        <div>
          <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
            Status
          </label>
          <select
            id="status"
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
            <option value="Suspended">Suspended</option>
          </select>
        </div>
      </div>

      <div>
        <h3 className="text-sm font-medium text-gray-700 mb-2">Permissions</h3>
        <div className="bg-gray-50 p-3 rounded-md border border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                name="viewAccounts"
                checked={formData.permissions.viewAccounts}
                onChange={handlePermissionChange}
                className="rounded text-blue-600 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700">View Accounts</span>
            </label>
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                name="createAccounts"
                checked={formData.permissions.createAccounts}
                onChange={handlePermissionChange}
                className="rounded text-blue-600 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700">Create Accounts</span>
            </label>
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                name="approveLoans"
                checked={formData.permissions.approveLoans}
                onChange={handlePermissionChange}
                className="rounded text-blue-600 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700">Approve Loans</span>
            </label>
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                name="viewTransactions"
                checked={formData.permissions.viewTransactions}
                onChange={handlePermissionChange}
                className="rounded text-blue-600 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700">View Transactions</span>
            </label>
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                name="executeTransfers"
                checked={formData.permissions.executeTransfers}
                onChange={handlePermissionChange}
                className="rounded text-blue-600 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700">Execute Transfers</span>
            </label>
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                name="manageUsers"
                checked={formData.permissions.manageUsers}
                onChange={handlePermissionChange}
                className="rounded text-blue-600 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700">Manage Users</span>
            </label>
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                name="viewReports"
                checked={formData.permissions.viewReports}
                onChange={handlePermissionChange}
                className="rounded text-blue-600 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700">View Reports</span>
            </label>
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                name="systemSettings"
                checked={formData.permissions.systemSettings}
                onChange={handlePermissionChange}
                className="rounded text-blue-600 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700">System Settings</span>
            </label>
          </div>
        </div>
      </div>

      <div className="flex justify-end space-x-3 pt-4">
        <button
          type="button"
          className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
          onClick={onClose}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700"
        >
          {user ? "Update User" : "Create User"}
        </button>
      </div>
    </form>
  )
}

export default UserForm
