import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Calendar, Filter, Search, X, RefreshCw, Eye } from 'lucide-react';
import { toast } from 'react-toastify';
import Modal from '../../components/ui/Modal';

// Define transaction interface
interface Transaction {
  id: string;
  type: string;
  amount: number;
  currency: string;
  status: string;
  description: string;
  reference: string;
  createdAt: string;
  completedAt: string;
  sender: {
    id: string;
    name: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    postalCode: string;
    idCardNumber: string;
  };
  sourceAccount: {
    id: string;
    accountNumber: string;
    accountType: string;
    currency: string;
    balance: number;
  };
  destinationAccount: {
    accountNumber: string;
    accountHolder: string;
    email: string;
    phone: string;
  };
}

// Define user interface
interface User {
  id: string;
  name: string;
  email: string;
}

// Define filter interface
interface Filters {
  type: string;
  status: string;
  startDate: string;
  endDate: string;
  minAmount: string;
  maxAmount: string;
  userId: string;
}

export default function TransactionHistory() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingUsers, setIsLoadingUsers] = useState(true);
  const [error, setError] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<Filters>({
    type: '',
    status: '',
    startDate: '',
    endDate: '',
    minAmount: '',
    maxAmount: '',
    userId: ''
  });

  // Add this state for the selected transaction and modal visibility
  const [selectedTransaction, setSelectedTransaction] = useState<any>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setIsLoadingUsers(true);
    try {
      const response = await axios.get('http://localhost:5001/api/admin/users', {
        withCredentials: true
      });

      if (response.data.success) {
        setUsers(response.data.users.map((user: any) => ({
          id: user._id,
          name: user.name,
          email: user.email
        })));
      }
    } catch (err: any) {
      console.error('Error fetching users:', err);
    } finally {
      setIsLoadingUsers(false);
    }
  };

  // Add useEffect to trigger fetchTransactions when component mounts or filters change
  useEffect(() => {
    fetchTransactions();
  }, [filters]); // Add dependency on filters
  
  const fetchTransactions = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get('http://localhost:5001/api/admin/getAllTransfers', {
        withCredentials: true,
        params: {
          type: filters.type || undefined,
          status: filters.status || undefined,
          startDate: filters.startDate || undefined,
          endDate: filters.endDate || undefined,
          minAmount: filters.minAmount || undefined,
          maxAmount: filters.maxAmount || undefined,
          userId: filters.userId || undefined
        }
      });

      if (response.data.success) {
        setTransactions(response.data.transfers.map((transfer: any) => ({
          id: transfer._id || transfer.id,
          type: transfer.type,
          amount: transfer.amount,
          currency: transfer.currency || 'TND',
          status: transfer.status,
          description: transfer.description || '',
          reference: transfer.reference || '',
          createdAt: transfer.createdAt,
          completedAt: transfer.completedAt,
          
          // Sender information
          sender: {
            id: transfer.sender?.id || transfer.userId?._id || 'Unknown',
            name: transfer.sender?.name || 
              (transfer.userId ? `${transfer.userId.firstName} ${transfer.userId.lastName}` : 'Unknown User'),
            email: transfer.sender?.email || transfer.userId?.email || 'N/A',
            phone: transfer.sender?.phone || transfer.userId?.phoneNumber || 'N/A',
            address: transfer.sender?.address || transfer.userId?.address || 'N/A',
            city: transfer.sender?.city || transfer.userId?.city || 'N/A',
            postalCode: transfer.sender?.postalCode || transfer.userId?.postalCode || 'N/A',
            idCardNumber: transfer.sender?.idCardNumber || transfer.userId?.idCardNumber || 'N/A'
          },
          
          // Source account
          sourceAccount: {
            id: transfer.sourceAccount?.id || transfer.fromAccount?._id || 'Unknown',
            accountNumber: transfer.sourceAccount?.accountNumber || 
              transfer.fromAccount?.accountNumber || transfer.fromAccount || 'N/A',
            accountType: transfer.sourceAccount?.accountType || transfer.fromAccount?.accountType || 'N/A',
            currency: transfer.sourceAccount?.currency || transfer.fromAccount?.currency || 'TND',
            balance: transfer.sourceAccount?.balance || transfer.fromAccount?.balance || 0
          },
          
          // Destination account/receiver
          destinationAccount: {
            accountNumber: transfer.destinationAccount?.accountNumber || transfer.toAccount || 'N/A',
            accountHolder: transfer.destinationAccount?.accountHolder || 'N/A',
            email: transfer.destinationAccount?.email || 'N/A',
            phone: transfer.destinationAccount?.phone || 'N/A'
          }
        })));
        setError('');
      } else {
        setError(response.data.message || 'Failed to fetch transactions');
      }
    } catch (err: any) {
      console.error('Error fetching transactions:', err);
      setError(err.response?.data?.message || 'An error occurred while fetching transactions');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleApplyFilters = () => {
    fetchTransactions();
  };

  const handleResetFilters = () => {
    setFilters({
      type: '',
      status: '',
      startDate: '',
      endDate: '',
      minAmount: '',
      maxAmount: '',
      userId: ''
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'TND',
      minimumFractionDigits: 2
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      case 'active':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Add this function to handle viewing a transaction
  const handleViewTransaction = (transaction: any) => {
    setSelectedTransaction(transaction);
    setIsViewModalOpen(true);
  };

  // Add this function to handle updating transaction status
  const handleUpdateStatus = async (id: string, status: string) => {
    try {
      const response = await axios.put(
        `http://localhost:5001/api/admin/transfers/${id}/status`,
        { status },
        { withCredentials: true }
      );
      
      if (response.data.success) {
        toast.success(`Transaction ${status === 'completed' ? 'approved' : 'rejected'} successfully`);
        setIsViewModalOpen(false);
        fetchTransactions(); // Refresh the list
      } else {
        toast.error(response.data.message || 'Failed to update transaction status');
      }
    } catch (err: any) {
      console.error('Error updating transaction status:', err);
      toast.error(err.response?.data?.message || 'An error occurred while updating transaction status');
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Transaction History</h1>
        <div className="flex space-x-2">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <Filter className="h-4 w-4 mr-2 inline" />
            {showFilters ? 'Hide Filters' : 'Show Filters'}
          </button>
          <button
            onClick={handleApplyFilters}
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Apply Filters
          </button>
        </div>
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 mb-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Filter Transactions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">User</label>
              <select
                className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                name="userId"
                value={filters.userId}
                onChange={handleFilterChange}
                disabled={isLoadingUsers}
              >
                <option value="">All Users</option>
                {users.map(user => (
                  <option key={user.id} value={user.id}>
                    {user.name} ({user.email})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Transaction Type</label>
              <select
                className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                name="type"
                value={filters.type}
                onChange={handleFilterChange}
              >
                <option value="">All Types</option>
                <option value="simple">Simple Transfer</option>
                <option value="bulk">Bulk Transfer</option>
                <option value="recurring">Recurring Transfer</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                name="status"
                value={filters.status}
                onChange={handleFilterChange}
              >
                <option value="">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="completed">Completed</option>
                <option value="failed">Failed</option>
                <option value="active">Active</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
              <div className="flex items-center">
                <Calendar className="h-5 w-5 text-gray-400 mr-2" />
                <input
                  type="date"
                  name="startDate"
                  value={filters.startDate}
                  onChange={handleFilterChange}
                  className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
              <div className="flex items-center">
                <Calendar className="h-5 w-5 text-gray-400 mr-2" />
                <input
                  type="date"
                  name="endDate"
                  value={filters.endDate}
                  onChange={handleFilterChange}
                  className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Min Amount</label>
              <input
                type="number"
                name="minAmount"
                value={filters.minAmount}
                onChange={handleFilterChange}
                placeholder="0"
                className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Max Amount</label>
              <input
                type="number"
                name="maxAmount"
                value={filters.maxAmount}
                onChange={handleFilterChange}
                placeholder="No limit"
                className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
              />
            </div>
          </div>
          <div className="mt-4 flex justify-end">
            <button
              onClick={handleResetFilters}
              className="mr-2 px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Reset Filters
            </button>
          </div>
        </div>
      )}

      {/* Transactions Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-lg font-medium text-gray-900">All Transactions</h2>
          <p className="text-sm text-gray-500 mt-1">View and manage all transactions across the system.</p>
        </div>

        {isLoading ? (
          <div className="p-6 flex justify-center">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
          </div>
        ) : error ? (
          <div className="p-6 text-center text-red-500">{error}</div>
        ) : transactions.length === 0 ? (
          <div className="p-6 text-center text-gray-500">No transactions found matching your criteria.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ID
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Sender
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Receiver
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Accounts
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {transactions.map((transaction) => (
                  <tr key={transaction.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {transaction.id.substring(0, 8)}...
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex flex-col">
                        <span className="font-medium text-gray-900">{transaction.sender.name}</span>
                        <span className="text-xs">{transaction.sender.email}</span>
                        <span className="text-xs">{transaction.sender.phone}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex flex-col">
                        <span className="font-medium text-gray-900">{transaction.destinationAccount.accountHolder}</span>
                        <span className="text-xs">{transaction.destinationAccount.email}</span>
                        <span className="text-xs">{transaction.destinationAccount.phone}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">
                      {transaction.type}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      {formatCurrency(transaction.amount)} {transaction.currency}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex flex-col">
                        <span>From: {transaction.sourceAccount.accountNumber}</span>
                        <span className="text-xs">{transaction.sourceAccount.accountType}</span>
                        <span>To: {transaction.destinationAccount.accountNumber}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(transaction.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        transaction.status === 'completed' ? 'bg-green-100 text-green-800' :
                        transaction.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        transaction.status === 'failed' ? 'bg-red-100 text-red-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {transaction.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <button
                        onClick={() => handleViewTransaction(transaction)}
                        className="text-indigo-600 hover:text-indigo-900 mr-3"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Transaction Details Modal */}
      {isViewModalOpen && selectedTransaction && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl overflow-hidden">
            <div className="px-6 py-4 border-b flex justify-between items-center">
              <div>
                <h3 className="text-lg font-medium text-gray-900">Transaction Details</h3>
              </div>
              <button
                onClick={() => setIsViewModalOpen(false)}
                className="text-gray-400 hover:text-gray-500 focus:outline-none bg-white rounded-full p-1"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-medium mb-3">Transaction Information</h3>
                  <div className="bg-gray-50 p-3 rounded-md">
                    <p><span className="font-medium">ID:</span> {selectedTransaction.id}</p>
                    <p><span className="font-medium">Type:</span> {selectedTransaction.type}</p>
                    <p><span className="font-medium">Amount:</span> {formatCurrency(selectedTransaction.amount)} {selectedTransaction.currency}</p>
                    <p><span className="font-medium">Status:</span> {selectedTransaction.status}</p>
                    <p><span className="font-medium">Date:</span> {new Date(selectedTransaction.createdAt).toLocaleString()}</p>
                    {selectedTransaction.completedAt && (
                      <p><span className="font-medium">Completed:</span> {new Date(selectedTransaction.completedAt).toLocaleString()}</p>
                    )}
                    <p><span className="font-medium">Description:</span> {selectedTransaction.description || 'N/A'}</p>
                    <p><span className="font-medium">Reference:</span> {selectedTransaction.reference || 'N/A'}</p>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-3">Sender Information</h3>
                  <div className="bg-gray-50 p-3 rounded-md">
                    <p><span className="font-medium">Name:</span> {selectedTransaction.sender.name}</p>
                    <p><span className="font-medium">Email:</span> {selectedTransaction.sender.email}</p>
                    <p><span className="font-medium">Phone:</span> {selectedTransaction.sender.phone}</p>
                    <p><span className="font-medium">Address:</span> {selectedTransaction.sender.address}</p>
                    <p><span className="font-medium">City:</span> {selectedTransaction.sender.city}</p>
                    <p><span className="font-medium">Postal Code:</span> {selectedTransaction.sender.postalCode}</p>
                    <p><span className="font-medium">ID Card Number:</span> {selectedTransaction.sender.idCardNumber}</p>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-3">Source Account</h3>
                  <div className="bg-gray-50 p-3 rounded-md">
                    <p><span className="font-medium">Account Number:</span> {selectedTransaction.sourceAccount.accountNumber}</p>
                    <p><span className="font-medium">Account Type:</span> {selectedTransaction.sourceAccount.accountType}</p>
                    <p><span className="font-medium">Currency:</span> {selectedTransaction.sourceAccount.currency}</p>
                    <p><span className="font-medium">Balance:</span> {formatCurrency(selectedTransaction.sourceAccount.balance)} {selectedTransaction.sourceAccount.currency}</p>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-3">Destination Account</h3>
                  <div className="bg-gray-50 p-3 rounded-md">
                    <p><span className="font-medium">Account Number:</span> {selectedTransaction.destinationAccount.accountNumber}</p>
                    <p><span className="font-medium">Account Holder:</span> {selectedTransaction.destinationAccount.accountHolder}</p>
                    <p><span className="font-medium">Email:</span> {selectedTransaction.destinationAccount.email}</p>
                    <p><span className="font-medium">Phone:</span> {selectedTransaction.destinationAccount.phone}</p>
                  </div>
                </div>
              </div>
              
              {selectedTransaction.status === 'pending' && (
                <div className="mt-6 flex justify-end space-x-3">
                  <button
                    onClick={() => handleUpdateStatus(selectedTransaction.id, 'completed')}
                    className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => handleUpdateStatus(selectedTransaction.id, 'failed')}
                    className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                  >
                    Reject
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
