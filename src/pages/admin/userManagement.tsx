"use client"

import { useState, useEffect } from "react"
import { Plus, Search, Edit, Trash, Key, Eye, Filter, CreditCard } from "lucide-react"
import Modal from "../../components/ui/Modal"
import UserForm from "../../components/admin compoents/form"
import axios from "axios"
import { toast } from "react-hot-toast"

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  address: string;
  city: string;
  postalCode: string;
  age: number;
  gender: string;
  idCardNumber: string;
  idCardFrontPhoto: string;
  idCardBackPhoto: string;
  role: string;
  accountStatus: string;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

interface Account {
  id: string;
  accountNumber: string;
  accountType: string;
  currency: string;
  balance: number;
  status: string;
  createdAt: string;
}

const UserManagement = () => {
  const [showAddUserModal, setShowAddUserModal] = useState(false)
  const [showEditUserModal, setShowEditUserModal] = useState(false)
  const [showDeleteUserModal, setShowDeleteUserModal] = useState(false)
  const [showResetPasswordModal, setShowResetPasswordModal] = useState(false)
  const [showAccountsModal, setShowAccountsModal] = useState(false)
  const [showUserDetailsModal, setShowUserDetailsModal] = useState(false)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterRole, setFilterRole] = useState("all")
  const [users, setUsers] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [userAccounts, setUserAccounts] = useState<Account[]>([])
  const [isLoadingAccounts, setIsLoadingAccounts] = useState(false)

  // Fetch all users with complete information from API
  const fetchUsers = async () => {
    setIsLoading(true)
    try {
      const response = await axios.get("http://localhost:5001/api/admin/users/complete", { withCredentials: true })

      if (response.data.success) {
        setUsers(response.data.users)
      } else {
        toast.error("Failed to fetch users")
      }
    } catch (error) {
      console.error("Error fetching users:", error)
      toast.error("Failed to fetch users")
    } finally {
      setIsLoading(false)
    }
  }

  // Fetch user accounts
  const fetchUserAccounts = async (userId: string) => {
    setIsLoadingAccounts(true)
    try {
      const response = await axios.get(`http://localhost:5001/api/admin/users/${userId}/accounts`, {
        withCredentials: true,
      })

      if (response.data.success) {
        setUserAccounts(response.data.accounts || [])
      } else {
        setUserAccounts([])
      }
    } catch (error) {
      console.error("Error fetching user accounts:", error)
      setUserAccounts([])
    } finally {
      setIsLoadingAccounts(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  // Handle edit user
  const handleEditUser = (user: User) => {
    setSelectedUser(user)
    setShowEditUserModal(true)
  }

  // Handle view user details
  const handleViewUserDetails = (user: User) => {
    setSelectedUser(user)
    fetchUserAccounts(user.id)
    setShowUserDetailsModal(true)
  }

  // Handle delete user
  const handleDeleteUser = (user: User) => {
    setSelectedUser(user)
    setShowDeleteUserModal(true)
  }

  // Handle reset password
  const handleResetPassword = (user: User) => {
    setSelectedUser(user)
    setShowResetPasswordModal(true)
  }

  // Add this function to handle the actual deletion
  const confirmDeleteUser = async () => {
    if (!selectedUser) return;
    
    try {
      const response = await axios.delete(
        `http://localhost:5001/api/admin/users/${selectedUser.id}`,
        { withCredentials: true }
      );

      if (response.data.success) {
        toast.success("User deleted successfully");
        setShowDeleteUserModal(false);
        // Refresh the user list
        fetchUsers();
      } else {
        toast.error(response.data.message || "Failed to delete user");
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      toast.error("Failed to delete user");
    }
  };

  // Add this function to handle account status updates
  const updateUserStatus = async (userId: string, status: string) => {
    try {
      const response = await axios.patch(
        `http://localhost:5001/api/admin/users/${userId}/status`,
        { status },
        { withCredentials: true }
      );

      if (response.data.success) {
        toast.success(`User status updated to ${status}`);
        // Refresh the user list
        fetchUsers();
      } else {
        toast.error(response.data.message || "Failed to update user status");
      }
    } catch (error) {
      console.error("Error updating user status:", error);
      toast.error("Failed to update user status");
    }
  };

  // Filter users based on search term and role filter
  const filteredUsers = users.filter(
    (user) =>
      ((user.firstName + ' ' + user.lastName).toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (filterRole === "all" || user.role.toLowerCase() === filterRole.toLowerCase()),
  )

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">User Management</h1>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex flex-col md:flex-row justify-between mb-4 gap-4">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search users..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex items-center">
            <Filter className="h-5 w-5 text-gray-400 mr-2" />
            <select
              className="border border-gray-300 rounded-md px-3 py-2"
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
            >
              <option value="all">All Roles</option>
              <option value="admin">Admin</option>
              <option value="user">User</option>
              <option value="employee">Employee</option>
            </select>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Phone
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{user.firstName} {user.lastName}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{user.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{user.phoneNumber}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          user.role === "admin"
                            ? "bg-purple-100 text-purple-800"
                            : user.role === "employee"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-green-100 text-green-800"
                        }`}
                      >
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          user.accountStatus === "active"
                            ? "bg-green-100 text-green-800"
                            : user.accountStatus === "pending"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-red-100 text-red-800"
                        }`}
                      >
                        {user.accountStatus}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center space-x-2 justify-end">
                        <button
                          onClick={() => handleViewUserDetails(user)}
                          className="text-blue-600 hover:text-blue-900"
                          title="View Details"
                        >
                          <Eye className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => handleDeleteUser(user)}
                          className="text-red-600 hover:text-red-900"
                          title="Delete User"
                        >
                          <Trash className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => updateUserStatus(user.id, 'approved')}
                          className="text-green-600 hover:text-green-900 ml-2"
                          title="Approve User"
                        >
                          Approve
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* User Details Modal */}
      {selectedUser && (
        <Modal
          isOpen={showUserDetailsModal}
          onClose={() => setShowUserDetailsModal(false)}
          title="User Details"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="font-semibold mb-2">Personal Information</h3>
              <p><span className="font-medium">Name:</span> {selectedUser.firstName} {selectedUser.lastName}</p>
              <p><span className="font-medium">Email:</span> {selectedUser.email}</p>
              <p><span className="font-medium">Phone:</span> {selectedUser.phoneNumber}</p>
              <p><span className="font-medium">Address:</span> {selectedUser.address}</p>
              <p><span className="font-medium">City:</span> {selectedUser.city || 'N/A'}</p>
              <p><span className="font-medium">Postal Code:</span> {selectedUser.postalCode || 'N/A'}</p>
              <p><span className="font-medium">Age:</span> {selectedUser.age}</p>
              <p><span className="font-medium">Gender:</span> {selectedUser.gender}</p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Account Information</h3>
              <p><span className="font-medium">ID Card Number:</span> {selectedUser.idCardNumber}</p>
              <p><span className="font-medium">Role:</span> {selectedUser.role}</p>
              <p><span className="font-medium">Status:</span> {selectedUser.accountStatus}</p>
              <p><span className="font-medium">Verified:</span> {selectedUser.isVerified ? 'Yes' : 'No'}</p>
              <p><span className="font-medium">Created:</span> {new Date(selectedUser.createdAt).toLocaleDateString()}</p>
              
              <div className="mt-4">
                <h3 className="font-semibold mb-2">ID Card Images</h3>
                {selectedUser.idCardFrontPhoto && (
                  <div className="mb-2">
                    <p className="font-medium">Front:</p>
                    <img 
                      src={selectedUser.idCardFrontPhoto} 
                      alt="ID Card Front" 
                      className="w-full max-w-xs rounded border border-gray-300"
                    />
                  </div>
                )}
                {selectedUser.idCardBackPhoto && (
                  <div>
                    <p className="font-medium">Back:</p>
                    <img 
                      src={selectedUser.idCardBackPhoto} 
                      alt="ID Card Back" 
                      className="w-full max-w-xs rounded border border-gray-300"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
          
          <div className="mt-6">
            <h3 className="font-semibold mb-2">User Accounts</h3>
            {isLoadingAccounts ? (
              <div className="flex justify-center py-4">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : userAccounts.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Account Number</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Currency</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Balance</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {userAccounts.map((account) => (
                      <tr key={account.id}>
                        <td className="px-4 py-2 whitespace-nowrap text-sm">{account.accountNumber}</td>
                        <td className="px-4 py-2 whitespace-nowrap text-sm">{account.accountType}</td>
                        <td className="px-4 py-2 whitespace-nowrap text-sm">{account.currency}</td>
                        <td className="px-4 py-2 whitespace-nowrap text-sm">{account.balance}</td>
                        <td className="px-4 py-2 whitespace-nowrap text-sm">
                          <span
                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              account.status === "approved"
                                ? "bg-green-100 text-green-800"
                                : account.status === "pending"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : "bg-red-100 text-red-800"
                            }`}
                          >
                            {account.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center text-gray-500">No accounts found for this user.</div>
            )}
          </div>
        </Modal>
      )}

      {/* Add User Modal */}
      <Modal
        isOpen={showAddUserModal}
        onClose={() => setShowAddUserModal(false)}
        title="Add New User"
        description="Create a new user account with specific access rights."
      >
        <UserForm onClose={() => setShowAddUserModal(false)} />
      </Modal>

      {/* Edit User Modal */}
      <Modal
        isOpen={showEditUserModal}
        onClose={() => setShowEditUserModal(false)}
        title="Edit User"
        description="Update user information and access rights."
      >
        <UserForm user={selectedUser} onClose={() => setShowEditUserModal(false)} />
      </Modal>

      {/* Delete User Modal */}
      <Modal
        isOpen={showDeleteUserModal}
        onClose={() => setShowDeleteUserModal(false)}
        title="Delete User"
        description="Are you sure you want to delete this user? This action cannot be undone."
      >
        <div className="space-y-4">
          <p className="text-sm text-gray-500">
            All data associated with <span className="font-medium">{selectedUser?.firstName} {selectedUser?.lastName}</span> will be permanently
            removed. This action is irreversible.
          </p>
          <div className="flex justify-end space-x-3">
            <button
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
              onClick={() => setShowDeleteUserModal(false)}
            >
              Cancel
            </button>
            <button
              className="px-4 py-2 bg-red-600 text-white rounded-md text-sm font-medium hover:bg-red-700"
              onClick={confirmDeleteUser}
            >
              Delete User
            </button>
          </div>
        </div>
      </Modal>

      {/* Reset Password Modal */}
      <Modal
        isOpen={showResetPasswordModal}
        onClose={() => setShowResetPasswordModal(false)}
        title="Reset Password"
        description="Reset the user's password and send a notification."
      >
        <div className="space-y-4">
          <p className="text-sm text-gray-500">
            This will reset the password for <span className="font-medium"></span> and send them a
            secure notification with instructions to set a new password.
          </p>
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Notification Method</label>
              <div className="flex items-center space-x-4">
                <label className="inline-flex items-center">
                  <input type="radio" name="notification" value="email" className="form-radio" defaultChecked />
                  <span className="ml-2">Email</span>
                </label>
                <label className="inline-flex items-center">
                  <input type="radio" name="notification" value="sms" className="form-radio" />
                  <span className="ml-2">SMS</span>
                </label>
              </div>
            </div>
          </div>
          <div className="flex justify-end space-x-3">
            <button
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
              onClick={() => setShowResetPasswordModal(false)}
            >
              Cancel
            </button>
            <button
              className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700"
              onClick={() => {
                // Reset password logic would go here
                setShowResetPasswordModal(false)
              }}
            >
              Reset Password
            </button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

export default UserManagement
