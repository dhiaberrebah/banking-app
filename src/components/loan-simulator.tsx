"use client"

import { useState, useEffect } from "react"
import { Download, LineChart, FileText, Info } from "lucide-react"
import { Link } from "react-router-dom"

export function LoanSimulator({ onApplyClick }: { onApplyClick?: () => void }) {
  const [loanAmount, setLoanAmount] = useState(50000)
  const [loanTerm, setLoanTerm] = useState(5)
  const [interestRate, setInterestRate] = useState(7.5)
  const [loanType, setLoanType] = useState("personal")
  const [monthlyPayment, setMonthlyPayment] = useState(0)
  const [totalInterest, setTotalInterest] = useState(0)
  const [totalPayment, setTotalPayment] = useState(0)
  const [amortizationSchedule, setAmortizationSchedule] = useState<any[]>([])
  const [showFullSchedule, setShowFullSchedule] = useState(false)

  useEffect(() => {
    calculateLoan()
  }, [loanAmount, loanTerm, interestRate])

  const calculateLoan = () => {
    // Convert annual interest rate to monthly
    const monthlyRate = interestRate / 100 / 12
    const numberOfPayments = loanTerm * 12

    // Calculate monthly payment
    const x = Math.pow(1 + monthlyRate, numberOfPayments)
    const monthly = (loanAmount * x * monthlyRate) / (x - 1)

    setMonthlyPayment(monthly)
    setTotalPayment(monthly * numberOfPayments)
    setTotalInterest(monthly * numberOfPayments - loanAmount)

    // Generate amortization schedule
    let balance = loanAmount
    const schedule: {
      month: number;
      payment: number;
      principal: number;
      interest: number;
      totalInterest: number;
      balance: number;
    }[] = []
    
    for (let i = 1; i <= numberOfPayments; i++) {
      const interest = balance * monthlyRate
      const principal = monthly - interest
      balance -= principal
      
      schedule.push({
        month: i,
        payment: monthly,
        principal: principal,
        interest: interest,
        totalInterest: i === 1 ? interest : schedule[i-2].totalInterest + interest,
        balance: balance > 0 ? balance : 0
      })
    }
    
    setAmortizationSchedule(schedule)
  }

  const formatCurrency = (value: number) => {
    return value.toLocaleString("fr-TN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }) + " TND"
  }

  const downloadSchedule = () => {
    // Create CSV content
    let csvContent = "Month,Payment,Principal,Interest,Total Interest,Remaining Balance\n"
    
    amortizationSchedule.forEach(row => {
      csvContent += `${row.month},${row.payment.toFixed(2)},${row.principal.toFixed(2)},${row.interest.toFixed(2)},${row.totalInterest.toFixed(2)},${row.balance.toFixed(2)}\n`
    })
    
    // Create download link
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.setAttribute('href', url)
    link.setAttribute('download', `loan_schedule_${loanType}_${loanAmount}_${new Date().toISOString().split('T')[0]}.csv`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handleApplyClick = () => {
    // Store loan details in localStorage to pass to application form
    localStorage.setItem('loanApplication', JSON.stringify({
      loanType,
      amount: loanAmount,
      term: loanTerm,
      interestRate
    }))
    
    // Navigate to application tab
    if (onApplyClick) {
      onApplyClick()
    }
  }

  return (
    <div className="card">
      <div className="card-content pt-6">
        <h2 className="text-2xl font-bold mb-6">Loan Simulator</h2>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="loanType" className="block text-sm font-medium">
                Loan Type
              </label>
              <select 
                id="loanType" 
                className="input w-full p-2 border border-gray-300 rounded-md" 
                value={loanType} 
                onChange={(e) => setLoanType(e.target.value)}
              >
                <option value="personal">Personal Loan</option>
                <option value="mortgage">Mortgage Loan</option>
                <option value="auto">Auto Loan</option>
                <option value="business">Business Loan</option>
              </select>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label htmlFor="loanAmount" className="block text-sm font-medium">
                  Loan Amount
                </label>
                <span className="text-sm font-medium">{formatCurrency(loanAmount)}</span>
              </div>
              <input
                id="loanAmount"
                type="range"
                min="5000"
                max="500000"
                step="5000"
                value={loanAmount}
                onChange={(e) => setLoanAmount(Number(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
              <div className="flex justify-between text-xs text-gray-500">
                <span>5,000 TND</span>
                <span>500,000 TND</span>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label htmlFor="loanTerm" className="block text-sm font-medium">
                  Loan Term (Years)
                </label>
                <span className="text-sm font-medium">{loanTerm} years</span>
              </div>
              <input
                id="loanTerm"
                type="range"
                min="1"
                max="30"
                step="1"
                value={loanTerm}
                onChange={(e) => setLoanTerm(Number(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
              <div className="flex justify-between text-xs text-gray-500">
                <span>1 year</span>
                <span>30 years</span>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label htmlFor="interestRate" className="block text-sm font-medium">
                  Interest Rate (%)
                </label>
                <span className="text-sm font-medium">{interestRate}%</span>
              </div>
              <input
                id="interestRate"
                type="range"
                min="1"
                max="20"
                step="0.1"
                value={interestRate}
                onChange={(e) => setInterestRate(Number(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
              <div className="flex justify-between text-xs text-gray-500">
                <span>1%</span>
                <span>20%</span>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-blue-50 rounded-lg p-6 border border-blue-100">
              <h3 className="text-lg font-medium mb-4">Loan Summary</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Monthly Payment:</span>
                  <span className="font-bold text-blue-700">{formatCurrency(monthlyPayment)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Principal:</span>
                  <span className="font-medium">{formatCurrency(loanAmount)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Interest:</span>
                  <span className="font-medium text-amber-600">{formatCurrency(totalInterest)}</span>
                </div>
                <div className="border-t border-blue-200 my-2 pt-2"></div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Payment:</span>
                  <span className="font-bold">{formatCurrency(totalPayment)}</span>
                </div>
              </div>
            </div>

            {amortizationSchedule.length > 0 && (
              <div className="border rounded-lg overflow-hidden">
                <div className="bg-gray-50 px-4 py-3 border-b">
                  <h3 className="font-medium">Amortization Schedule</h3>
                </div>
                <div className="overflow-x-auto" style={{ maxHeight: "300px" }}>
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50 sticky top-0">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Month</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Principal</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Interest</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Balance</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {(showFullSchedule ? amortizationSchedule : amortizationSchedule.slice(0, 12)).map((row) => (
                        <tr key={row.month} className="hover:bg-gray-50">
                          <td className="px-4 py-2 whitespace-nowrap text-sm">{row.month}</td>
                          <td className="px-4 py-2 whitespace-nowrap text-sm">{formatCurrency(row.payment)}</td>
                          <td className="px-4 py-2 whitespace-nowrap text-sm">{formatCurrency(row.principal)}</td>
                          <td className="px-4 py-2 whitespace-nowrap text-sm">{formatCurrency(row.interest)}</td>
                          <td className="px-4 py-2 whitespace-nowrap text-sm">{formatCurrency(row.balance)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3 justify-between">
              <button 
                className="btn btn-outline flex items-center justify-center"
                onClick={() => setShowFullSchedule(!showFullSchedule)}
              >
                <LineChart className="mr-2 h-4 w-4" />
                {showFullSchedule ? "Show Less" : "Show Full Schedule"}
              </button>
              <button 
                className="btn btn-outline flex items-center justify-center" 
                onClick={downloadSchedule}
              >
                <Download className="mr-2 h-4 w-4" />
                Download Schedule
              </button>
            </div>
            
            <div className="mt-6">
              <button 
                className="btn btn-primary px-6 py-3"
                onClick={handleApplyClick}
              >
                Apply for This Loan
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
