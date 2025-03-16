// src/pages/dashboard/loan-simulator.tsx
import React, { useState, useEffect } from "react";
import { PiggyBank, Calculator, Info } from 'lucide-react';
import { mockLoanProducts } from "../../data/mock-data";

const LoanSimulatorPage: React.FC = () => {
  const [loanType, setLoanType] = useState("");
  const [amount, setAmount] = useState<number>(10000);
  const [term, setTerm] = useState<number>(12);
  const [interestRate, setInterestRate] = useState<number>(0);
  const [monthlyPayment, setMonthlyPayment] = useState<number>(0);
  const [totalInterest, setTotalInterest] = useState<number>(0);
  const [totalPayment, setTotalPayment] = useState<number>(0);
  const [showResults, setShowResults] = useState<boolean>(false);
  const [showAmortization, setShowAmortization] = useState<boolean>(false);
  const [amortizationSchedule, setAmortizationSchedule] = useState<any[]>([]);

  // Update interest rate when loan type changes
  useEffect(() => {
    if (loanType) {
      const selectedLoan = mockLoanProducts.find(loan => loan.id.toString() === loanType);
      if (selectedLoan) {
        setInterestRate(selectedLoan.interestRate);
      }
    }
  }, [loanType]);

  // Calculate loan details
  const calculateLoan = () => {
    if (!loanType || amount <= 0 || term <= 0) {
      return;
    }

    // Calculate monthly payment using the formula: P = (r*A) / (1 - (1+r)^-n)
    // Where:
    // P = Monthly payment
    // A = Loan amount
    // r = Monthly interest rate (annual rate / 12 / 100)
    // n = Total number of payments (term in months)
    
    const monthlyRate = interestRate / 12 / 100;
    const monthlyPaymentValue = (monthlyRate * amount) / (1 - Math.pow(1 + monthlyRate, -term));
    
    const totalPaymentValue = monthlyPaymentValue * term;
    const totalInterestValue = totalPaymentValue - amount;
    
    setMonthlyPayment(monthlyPaymentValue);
    setTotalPayment(totalPaymentValue);
    setTotalInterest(totalInterestValue);
    
    // Generate amortization schedule
    const schedule = [];
    let balance = amount;
    let totalPrincipal = 0;
    let totalInterestPaid = 0;
    
    for (let i = 1; i <= term; i++) {
      const interestPayment = balance * monthlyRate;
      const principalPayment = monthlyPaymentValue - interestPayment;
      balance -= principalPayment;
      totalPrincipal += principalPayment;
      totalInterestPaid += interestPayment;
      
      schedule.push({
        month: i,
        payment: monthlyPaymentValue,
        principal: principalPayment,
        interest: interestPayment,
        totalPrincipal,
        totalInterest: totalInterestPaid,
        balance: Math.max(0, balance)
      });
    }
    
    setAmortizationSchedule(schedule);
    setShowResults(true);
  };

  const resetForm = () => {
    setLoanType("");
    setAmount(10000);
    setTerm(12);
    setInterestRate(0);
    setShowResults(false);
    setShowAmortization(false);
  };

  const toggleAmortization = () => {
    setShowAmortization(!showAmortization);
  };

  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900">Loan Simulator</h1>
      
      <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Calculate Your Loan</h2>
              
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label htmlFor="loanType" className="block text-sm font-medium text-gray-700">
                    Loan Type
                  </label>
                  <select
                    id="loanType"
                    value={loanType}
                    onChange={(e) => setLoanType(e.target.value)}
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-900 focus:border-blue-900 sm:text-sm rounded-md"
                  >
                    <option value="">Select a loan type</option>
                    {mockLoanProducts.map(loan => (
                      <option key={loan.id} value={loan.id}>
                        {loan.name} ({loan.interestRate}% APR)
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label htmlFor="amount" className="block text-sm font-medium text-gray-700">
                    Loan Amount (TND)
                  </label>
                  <input
                    type="number"
                    id="amount"
                    value={amount}
                    onChange={(e) => setAmount(Number(e.target.value))}
                    min="1000"
                    max="1000000"
                    step="1000"
                    className="mt-1 focus:ring-blue-900 focus:border-blue-900 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                  />
                </div>
                
                <div>
                  <label htmlFor="term" className="block text-sm font-medium text-gray-700">
                    Loan Term (Months)
                  </label>
                  <input
                    type="number"
                    id="term"
                    value={term}
                    onChange={(e) => setTerm(Number(e.target.value))}
                    min="6"
                    max="360"
                    step="6"
                    className="mt-1 focus:ring-blue-900 focus:border-blue-900 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                  />
                </div>
                
                <div>
                  <label htmlFor="interestRate" className="block text-sm font-medium text-gray-700">
                    Interest Rate (%)
                  </label>
                  <input
                    type="number"
                    id="interestRate"
                    value={interestRate}
                    readOnly
                    className="mt-1 bg-gray-100 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                  />
                </div>
              </div>
              
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={resetForm}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-900"
                >
                  Reset
                </button>
                <button
                  type="button"
                  onClick={calculateLoan}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-900 hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-900"
                >
                  <Calculator className="mr-2 h-4 w-4" />
                  Calculate
                </button>
              </div>
            </div>
          </div>
          
          {showResults && (
            <div className="mt-6 bg-white shadow overflow-hidden sm:rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h2 className="text-lg font-medium text-gray-900 mb-4">Loan Summary</h2>
                
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <p className="text-sm font-medium text-gray-500">Monthly Payment</p>
                    <p className="mt-1 text-2xl font-semibold text-blue-900">{monthlyPayment.toLocaleString(undefined, { maximumFractionDigits: 2 })} TND</p>
                  </div>
                  
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <p className="text-sm font-medium text-gray-500">Total Interest</p>
                    <p className="mt-1 text-2xl font-semibold text-blue-900">{totalInterest.toLocaleString(undefined, { maximumFractionDigits: 2 })} TND</p>
                  </div>
                  
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <p className="text-sm font-medium text-gray-500">Total Payment</p>
                    <p className="mt-1 text-2xl font-semibold text-blue-900">{totalPayment.toLocaleString(undefined, { maximumFractionDigits: 2 })} TND</p>
                  </div>
                </div>
                
                <div className="mt-6">
                  <button
                    type="button"
                    onClick={toggleAmortization}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-900"
                  >
                    {showAmortization ? 'Hide Amortization Schedule' : 'Show Amortization Schedule'}
                  </button>
                </div>
                
                {showAmortization && (
                  <div className="mt-4 overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Month</th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment</th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Principal</th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Interest</th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Balance</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {amortizationSchedule.map((row) => (
                          <tr key={row.month}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{row.month}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{row.payment.toLocaleString(undefined, { maximumFractionDigits: 2 })} TND</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{row.principal.toLocaleString(undefined, { maximumFractionDigits: 2 })} TND</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{row.interest.toLocaleString(undefined, { maximumFractionDigits: 2 })} TND</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{row.balance.toLocaleString(undefined, { maximumFractionDigits: 2 })} TND</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
        
        <div>
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Loan Information</h2>
              
              <div className="space-y-4">
                {mockLoanProducts.map(loan => (
                  <div key={loan.id} className="border rounded-md p-4">
                    <h3 className="text-md font-medium text-gray-900">{loan.name}</h3>
                    <p className="mt-1 text-sm text-gray-500">{loan.description}</p>
                    <div className="mt-2 flex items-center">
                      <span className="text-blue-900 font-medium">{loan.interestRate}% APR</span>
                      <span className="mx-2 text-gray-500">|</span>
                      <span className="text-gray-500">Up to {loan.maxAmount.toLocaleString()} TND</span>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-6 bg-yellow-50 border-l-4 border-yellow-400 p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <Info className="h-5 w-5 text-yellow-400" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-yellow-700">
                      This is a simulation only. Actual loan terms may vary based on your credit score and financial situation. Please contact our loan department for more information.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoanSimulatorPage;