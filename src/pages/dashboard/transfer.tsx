// src/pages/dashboard/transfer.tsx
import React, { useState } from "react";
import { Send, CreditCard, ArrowRight } from 'lucide-react';
import { useAuth } from "../../contexts/auth-context";
import { mockAccounts } from "../../data/mock-data";

const TransferPage: React.FC = () => {
  const { currentUser } = useAuth();
  const [formData, setFormData] = useState({
    fromAccount: "",
    toAccount: "",
    amount: "",
    description: ""
  });
  const [step, setStep] = useState(1);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  // Get user accounts
  const userAccounts = mockAccounts.filter(account => account.userId === currentUser?.id);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleNextStep = () => {
    setError("");
    
    // Validate step 1
    if (step === 1) {
      if (!formData.fromAccount) {
        setError("Please select a source account");
        return;
      }
      if (!formData.toAccount) {
        setError("Please enter a destination account");
        return;
      }
      if (formData.fromAccount === formData.toAccount) {
        setError("Source and destination accounts cannot be the same");
        return;
      }
    }
    
    // Validate step 2
    if (step === 2) {
      if (!formData.amount || parseFloat(formData.amount) <= 0) {
        setError("Please enter a valid amount");
        return;
      }
      
      const sourceAccount = userAccounts.find(account => account.id.toString() === formData.fromAccount);
      if (sourceAccount && parseFloat(formData.amount) > sourceAccount.balance) {
        setError("Insufficient funds");
        return;
      }
    }
    
    setStep(step + 1);
  };

  const handlePrevStep = () => {
    setStep(step - 1);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    // In a real app, this would make an API call to process the transfer
    // For now, we'll just simulate a successful transfer
    setTimeout(() => {
      setSuccess(true);
    }, 1000);
  };

  const resetForm = () => {
    setFormData({
      fromAccount: "",
      toAccount: "",
      amount: "",
      description: ""
    });
    setStep(1);
    setSuccess(false);
  };

  const getSelectedAccount = () => {
    return userAccounts.find(account => account.id.toString() === formData.fromAccount);
  };

  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900">Transfer Money</h1>
      
      {!success ? (
        <div className="mt-6 bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="mb-8">
              <div className="flex items-center">
                <div className={`flex items-center justify-center h-12 w-12 rounded-full ${step >= 1 ? 'bg-blue-900' : 'bg-gray-200'}`}>
                  <span className={`text-lg font-medium ${step >= 1 ? 'text-white' : 'text-gray-500'}`}>1</span>
                </div>
                <div className={`flex-1 h-1 mx-2 ${step >= 2 ? 'bg-blue-900' : 'bg-gray-200'}`}></div>
                <div className={`flex items-center justify-center h-12 w-12 rounded-full ${step >= 2 ? 'bg-blue-900' : 'bg-gray-200'}`}>
                  <span className={`text-lg font-medium ${step >= 2 ? 'text-white' : 'text-gray-500'}`}>2</span>
                </div>
                <div className={`flex-1 h-1 mx-2 ${step >= 3 ? 'bg-blue-900' : 'bg-gray-200'}`}></div>
                <div className={`flex items-center justify-center h-12 w-12 rounded-full ${step >= 3 ? 'bg-blue-900' : 'bg-gray-200'}`}>
                  <span className={`text-lg font-medium ${step >= 3 ? 'text-white' : 'text-gray-500'}`}>3</span>
                </div>
              </div>
              <div className="flex justify-between mt-2">
                <div className="text-center w-1/3">
                  <p className="text-sm font-medium text-gray-900">Select Accounts</p>
                </div>
                <div className="text-center w-1/3">
                  <p className="text-sm font-medium text-gray-900">Enter Amount</p>
                </div>
                <div className="text-center w-1/3">
                  <p className="text-sm font-medium text-gray-900">Confirm Transfer</p>
                </div>
              </div>
            </div>
            
            {error && (
              <div className="mb-4 bg-red-50 border-l-4 border-red-500 p-4">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}
            
            <form onSubmit={handleSubmit}>
              {/* Step 1: Select Accounts */}
              {step === 1 && (
                <div className="space-y-6">
                  <div>
                    <label htmlFor="fromAccount" className="block text-sm font-medium text-gray-700">
                      From Account
                    </label>
                    <select
                      id="fromAccount"
                      name="fromAccount"
                      value={formData.fromAccount}
                      onChange={handleChange}
                      className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-900 focus:border-blue-900 sm:text-sm rounded-md"
                    >
                      <option value="">Select an account</option>
                      {userAccounts.map(account => (
                        <option key={account.id} value={account.id}>
                          {account.accountType} - {account.accountNumber} ({account.balance.toLocaleString()} {account.currency})
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label htmlFor="toAccount" className="block text-sm font-medium text-gray-700">
                      To Account (Account Number)
                    </label>
                    <input
                      type="text"
                      name="toAccount"
                      id="toAccount"
                      value={formData.toAccount}
                      onChange={handleChange}
                      placeholder="Enter account number"
                      className="mt-1 focus:ring-blue-900 focus:border-blue-900 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                    />
                  </div>
                </div>
              )}
              
              {/* Step 2: Enter Amount */}
              {step === 2 && (
                <div className="space-y-6">
                  <div>
                    <label htmlFor="amount" className="block text-sm font-medium text-gray-700">
                      Amount
                    </label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <span className="text-gray-500 sm:text-sm">TND</span>
                      </div>
                      <input
                        type="number"
                        name="amount"
                        id="amount"
                        value={formData.amount}
                        onChange={handleChange}
                        className="focus:ring-blue-900 focus:border-blue-900 block w-full pl-12 pr-12 sm:text-sm border-gray-300 rounded-md"
                        placeholder="0.00"
                        min="0"
                        step="0.01"
                      />
                    </div>
                    {getSelectedAccount() && (
                      <p className="mt-2 text-sm text-gray-500">
                        Available balance: {getSelectedAccount()?.balance.toLocaleString()} {getSelectedAccount()?.currency}
                      </p>
                    )}
                  </div>
                  
                  <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                      Description (Optional)
                    </label>
                    <textarea
                      id="description"
                      name="description"
                      rows={3}
                      value={formData.description}
                      onChange={handleChange}
                      className="shadow-sm focus:ring-blue-900 focus:border-blue-900 mt-1 block w-full sm:text-sm border border-gray-300 rounded-md"
                      placeholder="Add a note about this transfer"
                    />
                  </div>
                </div>
              )}
              
              {/* Step 3: Confirm Transfer */}
              {step === 3 && (
                <div className="space-y-6">
                  <div className="bg-gray-50 p-4 rounded-md">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Transfer Summary</h3>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium text-gray-500">From Account</p>
                        <p className="mt-1 text-sm text-gray-900">
                          {getSelectedAccount()?.accountType} - {getSelectedAccount()?.accountNumber}
                        </p>
                      </div>
                      
                      <div>
                        <p className="text-sm font-medium text-gray-500">To Account</p>
                        <p className="mt-1 text-sm text-gray-900">{formData.toAccount}</p>
                      </div>
                      
                      <div>
                        <p className="text-sm font-medium text-gray-500">Amount</p>
                        <p className="mt-1 text-sm text-gray-900">{parseFloat(formData.amount).toLocaleString()} TND</p>
                      </div>
                      
                      <div>
                        <p className="text-sm font-medium text-gray-500">Description</p>
                        <p className="mt-1 text-sm text-gray-900">{formData.description || "N/A"}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                          <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <p className="text-sm text-yellow-700">
                          Please verify all details before confirming the transfer. This action cannot be undone.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              <div className="mt-8 flex justify-between">
                {step > 1 && (
                  <button
                    type="button"
                    onClick={handlePrevStep}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-900"
                  >
                    Back
                  </button>
                )}
                
                {step < 3 ? (
                  <button
                    type="button"
                    onClick={handleNextStep}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-900 hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-900"
                  >
                    Continue
                  </button>
                ) : (
                  <button
                    type="submit"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-900 hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-900"
                  >
                    Confirm Transfer
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      ) : (
        <div className="mt-6 bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6 text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
              <Send className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="mt-2 text-lg font-medium text-gray-900">Transfer Successful!</h3>
            <p className="mt-1 text-sm text-gray-500">
              Your transfer of {parseFloat(formData.amount).toLocaleString()} TND has been processed successfully.
            </p>
            <div className="mt-6">
              <button
                type="button"
                onClick={resetForm}
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-900 hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-900"
              >
                Make Another Transfer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TransferPage;