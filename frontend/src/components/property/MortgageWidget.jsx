import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaCalculator } from "react-icons/fa";

const MortgageWidget = ({ propertyPrice }) => {
  const [downPaymentPercent, setDownPaymentPercent] = useState(20);
  const [interestRate, setInterestRate] = useState(4.5);
  const [loanTerm, setLoanTerm] = useState(30);
  const [monthlyPayment, setMonthlyPayment] = useState(0);

  useEffect(() => {
    // Calculate loan amount
    const downPayment = (propertyPrice * downPaymentPercent) / 100;
    const loanAmount = propertyPrice - downPayment;

    // Convert annual interest rate to monthly rate
    const monthlyInterestRate = interestRate / 100 / 12;

    // Calculate number of payments
    const numberOfPayments = loanTerm * 12;

    // Calculate monthly payment using the mortgage formula
    if (monthlyInterestRate === 0) {
      // If interest rate is 0, simple division
      const calculatedMonthlyPayment = loanAmount / numberOfPayments;
      setMonthlyPayment(calculatedMonthlyPayment);
    } else {
      // Standard mortgage formula
      const calculatedMonthlyPayment =
        (loanAmount *
          (monthlyInterestRate *
            Math.pow(1 + monthlyInterestRate, numberOfPayments))) /
        (Math.pow(1 + monthlyInterestRate, numberOfPayments) - 1);

      setMonthlyPayment(calculatedMonthlyPayment);
    }
  }, [propertyPrice, downPaymentPercent, interestRate, loanTerm]);

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
    <div className="bg-white rounded-lg shadow-md p-4 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800">
          Mortgage Estimate
        </h3>
        <Link
          to={`/mortgage-calculator?price=${propertyPrice}`}
          className="text-blue-600 hover:text-blue-800 flex items-center text-sm"
        >
          <FaCalculator className="mr-1" />
          Full Calculator
        </Link>
      </div>

      <div className="mb-4">
        <div className="flex justify-between mb-1">
          <span className="text-gray-600">Property Price</span>
          <span className="font-medium">{formatCurrency(propertyPrice)}</span>
        </div>

        <div className="flex justify-between mb-1">
          <span className="text-gray-600">Down Payment</span>
          <span className="font-medium">
            {formatCurrency((propertyPrice * downPaymentPercent) / 100)} (
            {downPaymentPercent}%)
          </span>
        </div>

        <div className="flex justify-between mb-1">
          <span className="text-gray-600">Loan Amount</span>
          <span className="font-medium">
            {formatCurrency(
              propertyPrice - (propertyPrice * downPaymentPercent) / 100
            )}
          </span>
        </div>
      </div>

      <div className="mb-4">
        <label className="block text-gray-600 mb-1 text-sm">
          Down Payment %
        </label>
        <input
          type="range"
          min="5"
          max="50"
          step="5"
          value={downPaymentPercent}
          onChange={(e) => setDownPaymentPercent(Number(e.target.value))}
          className="w-full h-2 bg-blue-100 rounded-lg appearance-none cursor-pointer"
        />
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>5%</span>
          <span>50%</span>
        </div>
      </div>

      <div className="mb-4">
        <label className="block text-gray-600 mb-1 text-sm">
          Interest Rate
        </label>
        <select
          value={interestRate}
          onChange={(e) => setInterestRate(Number(e.target.value))}
          className="w-full p-2 border border-gray-300 rounded-md text-sm"
        >
          <option value={3.5}>3.5%</option>
          <option value={4.0}>4.0%</option>
          <option value={4.5}>4.5%</option>
          <option value={5.0}>5.0%</option>
          <option value={5.5}>5.5%</option>
          <option value={6.0}>6.0%</option>
        </select>
      </div>

      <div className="mb-4">
        <label className="block text-gray-600 mb-1 text-sm">Loan Term</label>
        <div className="flex gap-2">
          {[15, 20, 30].map((term) => (
            <button
              key={term}
              onClick={() => setLoanTerm(term)}
              className={`flex-1 py-1 text-sm rounded-md transition-colors ${
                loanTerm === term
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              {term} years
            </button>
          ))}
        </div>
      </div>

      <div className="bg-blue-50 p-4 rounded-lg">
        <div className="text-gray-600 mb-1">Estimated Monthly Payment</div>
        <div className="text-2xl font-bold text-blue-700">
          {formatCurrency(monthlyPayment)}
        </div>
        <div className="text-xs text-gray-500 mt-1">
          Principal & Interest only. Taxes and insurance not included.
        </div>
      </div>
    </div>
  );
};

export default MortgageWidget;
