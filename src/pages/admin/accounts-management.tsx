// src/pages/admin/accounts-management.tsx
import React, { useState } from "react";
import { Search, Eye, Lock, Unlock } from 'lucide-react';
import { mockAccounts, mockUsers } from "../../data/mock-data";

const AccountsManagementPage: React.FC = () => {
  const [accounts, setAccounts] = useState(mockAccounts);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedAccount, setSelectedAccount] = useState<any>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  // Get user name by userId
  const getUserName = (userId: number) => {
    const user = mockUsers.find((user) => user.id === userId);
    return user ? user.name : "Unknown User";
  };

  // Filter accounts based on search term
  const filteredAccounts = accounts.filter(
    (account) =>
      account.accountNumber.includes(searchTerm) ||
      account.accountType.toLowerCase().includes(searchTerm.toLowerCase()) ||
      getUserName(account.userId).toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleViewDetails = (account: any) => {
    setSelectedAccount(account);
    setShowDetailsModal(true);
  };

  const toggleAccountStatus = (accountId: number) => {
    setAccounts(
      accounts.map((account) => {
        if (account.id === accountId) {
          return {
            ...account,
            status: account.status === "active" ? "inactive" : "active",
          };
        }
        return account;
      }),
    );
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Accounts Management</h1>
      </div>

      <div className="mb-6">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search accounts..."
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-blue-900 focus:border-blue-900 sm:text-sm"
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Account Number
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Owner
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Type
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Balance
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Status
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredAccounts.map((account) => (
              <tr key={account.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{account.accountNumber}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">{getUserName(account.userId)}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{account.accountType}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {account.balance.toLocaleString()} {account.currency}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      account.status === "active" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                    }`}
                  >
                    {account.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button onClick={() => handleViewDetails(account)} className="text-blue-900 hover:text-blue-800 mr-3">
                    <Eye className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => toggleAccountStatus(account.id)}
                    className={`${
                      account.status === "active"
                        ? "text-red-600 hover:text-red-900"
                        : "text-green-600 hover:text-green-900"
                    }`}
                  >
                    {account.status === "active" ? <Lock className="h-5 w-5" /> : <Unlock className="h-5 w-5" />}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Account Details Modal */}
      {showDetailsModal && selectedAccount && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full">
            <h2 className="text-xl font-semibold mb-4">Account Details</h2>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">Account Number</p>
                  <p className="text-sm font-medium text-gray-900">{selectedAccount.accountNumber}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Account Type</p>
                  <p className="text-sm font-medium text-gray-900">{selectedAccount.accountType}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Owner</p>
                  <p className="text-sm font-medium text-gray-900">{getUserName(selectedAccount.userId)}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Balance</p>
                  <p className="text-sm font-medium text-gray-900">
                    {selectedAccount.balance.toLocaleString()} {selectedAccount.currency}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Status</p>
                  <p
                    className={`text-sm font-medium ${
                      selectedAccount.status === "active" ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {selectedAccount.status}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Currency</p>
                  <p className="text-sm font-medium text-gray-900">{selectedAccount.currency}</p>
                </div>
              </div>
            </div>
            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setShowDetailsModal(false)}
                className="px-4 py-2 bg-blue-900 text-white rounded-md text-sm font-medium hover:bg-blue-800"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AccountsManagementPage;