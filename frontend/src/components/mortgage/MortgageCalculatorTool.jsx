import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

const MortgageCalculatorTool = ({ initialPropertyPrice = null }) => {
  // State for calculator inputs
  const [homePrice, setHomePrice] = useState(initialPropertyPrice || 300000);
  const [downPayment, setDownPayment] = useState(
    initialPropertyPrice ? initialPropertyPrice * 0.2 : 60000
  );
  const [downPaymentPercent, setDownPaymentPercent] = useState(20);
  const [loanTerm, setLoanTerm] = useState(30);
  const [interestRate, setInterestRate] = useState(4.5);
  const [monthlyPayment, setMonthlyPayment] = useState(0);
  const [totalPayment, setTotalPayment] = useState(0);
  const [totalInterest, setTotalInterest] = useState(0);

  // Update homePrice and downPayment when initialPropertyPrice changes
  useEffect(() => {
    if (initialPropertyPrice) {
      setHomePrice(initialPropertyPrice);
      setDownPayment(initialPropertyPrice * (downPaymentPercent / 100));
    }
  }, [initialPropertyPrice, downPaymentPercent]);

  // Calculate mortgage details
  useEffect(() => {
    // Calculate loan amount
    const loanAmount = homePrice - downPayment;

    // Convert annual interest rate to monthly rate
    const monthlyInterestRate = interestRate / 100 / 12;

    // Calculate number of payments
    const numberOfPayments = loanTerm * 12;

    // Calculate monthly payment using the mortgage formula
    if (monthlyInterestRate === 0) {
      // If interest rate is 0, simple division
      const calculatedMonthlyPayment = loanAmount / numberOfPayments;
      setMonthlyPayment(calculatedMonthlyPayment);
      setTotalPayment(calculatedMonthlyPayment * numberOfPayments);
      setTotalInterest(0);
    } else {
      // Standard mortgage formula
      const calculatedMonthlyPayment =
        (loanAmount *
          (monthlyInterestRate *
            Math.pow(1 + monthlyInterestRate, numberOfPayments))) /
        (Math.pow(1 + monthlyInterestRate, numberOfPayments) - 1);

      setMonthlyPayment(calculatedMonthlyPayment);
      setTotalPayment(calculatedMonthlyPayment * numberOfPayments);
      setTotalInterest(
        calculatedMonthlyPayment * numberOfPayments - loanAmount
      );
    }
  }, [homePrice, downPayment, loanTerm, interestRate]);

  // Handle down payment changes and keep percentage in sync
  const handleDownPaymentChange = (value) => {
    setDownPayment(value);
    setDownPaymentPercent(((value / homePrice) * 100).toFixed(1));
  };

  // Handle down payment percentage changes and keep amount in sync
  const handleDownPaymentPercentChange = (value) => {
    setDownPaymentPercent(value);
    setDownPayment((homePrice * value) / 100);
  };

  // Handle home price changes and keep down payment percentage consistent
  const handleHomePriceChange = (value) => {
    setHomePrice(value);
    setDownPayment((value * downPaymentPercent) / 100);
  };

  // Format currency
  const formatCurrency = (value) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="grid grid-cols-1 lg:grid-cols-2 gap-8"
    >
      {/* Input Section */}
      <div className="bg-gray-50 p-6 rounded-lg">
        <h2 className="text-xl font-semibold mb-6">Mortgage Details</h2>

        {/* Home Price Slider */}
        <div className="mb-6">
          <div className="flex justify-between mb-2">
            <label className="text-gray-700">Home Price</label>
            <span className="font-medium">{formatCurrency(homePrice)}</span>
          </div>
          <input
            type="range"
            min="50000"
            max="2000000"
            step="10000"
            value={homePrice}
            onChange={(e) => handleHomePriceChange(Number(e.target.value))}
            className="w-full h-2 bg-blue-100 rounded-lg appearance-none cursor-pointer"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>₹50,000</span>
            <span>₹2,000,000</span>
          </div>
        </div>

        {/* Down Payment Slider */}
        <div className="mb-6">
          <div className="flex justify-between mb-2">
            <label className="text-gray-700">Down Payment</label>
            <span className="font-medium">
              {formatCurrency(downPayment)} ({downPaymentPercent}%)
            </span>
          </div>
          <input
            type="range"
            min="0"
            max={homePrice * 0.8}
            step="5000"
            value={downPayment}
            onChange={(e) => handleDownPaymentChange(Number(e.target.value))}
            className="w-full h-2 bg-blue-100 rounded-lg appearance-none cursor-pointer"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>₹0</span>
            <span>{formatCurrency(homePrice * 0.8)}</span>
          </div>
        </div>

        {/* Down Payment Percentage Slider */}
        <div className="mb-6">
          <div className="flex justify-between mb-2">
            <label className="text-gray-700">Down Payment %</label>
            <span className="font-medium">{downPaymentPercent}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="80"
            step="1"
            value={downPaymentPercent}
            onChange={(e) =>
              handleDownPaymentPercentChange(Number(e.target.value))
            }
            className="w-full h-2 bg-blue-100 rounded-lg appearance-none cursor-pointer"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>0%</span>
            <span>80%</span>
          </div>
        </div>

        {/* Loan Term Selector */}
        <div className="mb-6">
          <label className="block text-gray-700 mb-2">Loan Term (years)</label>
          <div className="flex gap-2">
            {[15, 20, 30].map((term) => (
              <button
                key={term}
                onClick={() => setLoanTerm(term)}
                className={`flex-1 py-2 rounded-md transition-colors ${
                  loanTerm === term
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                {term}
              </button>
            ))}
          </div>
        </div>

        {/* Interest Rate Slider */}
        <div className="mb-6">
          <div className="flex justify-between mb-2">
            <label className="text-gray-700">Interest Rate</label>
            <span className="font-medium">{interestRate}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="10"
            step="0.1"
            value={interestRate}
            onChange={(e) => setInterestRate(Number(e.target.value))}
            className="w-full h-2 bg-blue-100 rounded-lg appearance-none cursor-pointer"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>0%</span>
            <span>10%</span>
          </div>
        </div>
      </div>

      {/* Results Section */}
      <div>
        <h2 className="text-xl font-semibold mb-6">Payment Summary</h2>

        {/* Monthly Payment */}
        <div className="bg-blue-50 p-6 rounded-lg mb-6">
          <h3 className="text-gray-600 mb-2">Monthly Payment</h3>
          <div className="text-4xl font-bold text-blue-700">
            {formatCurrency(monthlyPayment)}
          </div>
        </div>

        {/* Loan Details */}
        <div className="bg-gray-50 p-6 rounded-lg">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="text-gray-600 mb-1">Loan Amount</h3>
              <div className="text-xl font-semibold">
                {formatCurrency(homePrice - downPayment)}
              </div>
            </div>
            <div>
              <h3 className="text-gray-600 mb-1">Down Payment</h3>
              <div className="text-xl font-semibold">
                {formatCurrency(downPayment)}
              </div>
            </div>
            <div>
              <h3 className="text-gray-600 mb-1">Total Interest</h3>
              <div className="text-xl font-semibold">
                {formatCurrency(totalInterest)}
              </div>
            </div>
            <div>
              <h3 className="text-gray-600 mb-1">Total Payment</h3>
              <div className="text-xl font-semibold">
                {formatCurrency(totalPayment)}
              </div>
            </div>
          </div>
        </div>

        {/* Loan Breakdown Visualization */}
        <div className="mt-6">
          <h3 className="text-gray-700 mb-3">Payment Breakdown</h3>
          <div className="h-8 rounded-lg overflow-hidden flex">
            <div
              className="bg-blue-600"
              style={{
                width: `${((homePrice - downPayment) / totalPayment) * 100}%`,
              }}
              title="Principal"
            ></div>
            <div
              className="bg-blue-400"
              style={{ width: `${(totalInterest / totalPayment) * 100}%` }}
              title="Interest"
            ></div>
          </div>
          <div className="flex mt-2 text-sm">
            <div className="flex items-center mr-4">
              <div className="w-3 h-3 bg-blue-600 mr-1"></div>
              <span>
                Principal (
                {Math.round(((homePrice - downPayment) / totalPayment) * 100)}%)
              </span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-blue-400 mr-1"></div>
              <span>
                Interest ({Math.round((totalInterest / totalPayment) * 100)}%)
              </span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default MortgageCalculatorTool;
