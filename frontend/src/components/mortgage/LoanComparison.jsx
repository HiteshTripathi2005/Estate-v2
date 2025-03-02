import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

const LoanComparison = () => {
  // State for loan options
  const [loans, setLoans] = useState([
    {
      id: 1,
      name: "Option 1",
      loanAmount: 300000,
      interestRate: 4.5,
      loanTerm: 30,
      monthlyPayment: 0,
      totalInterest: 0,
      totalPayment: 0,
    },
    {
      id: 2,
      name: "Option 2",
      loanAmount: 300000,
      interestRate: 4.0,
      loanTerm: 15,
      monthlyPayment: 0,
      totalInterest: 0,
      totalPayment: 0,
    },
  ]);

  // Calculate loan details for all loans
  useEffect(() => {
    const updatedLoans = loans.map((loan) => {
      // Convert annual interest rate to monthly rate
      const monthlyInterestRate = loan.interestRate / 100 / 12;

      // Calculate number of payments
      const numberOfPayments = loan.loanTerm * 12;

      // Calculate monthly payment
      let monthlyPayment = 0;
      if (monthlyInterestRate === 0) {
        monthlyPayment = loan.loanAmount / numberOfPayments;
      } else {
        monthlyPayment =
          (loan.loanAmount *
            (monthlyInterestRate *
              Math.pow(1 + monthlyInterestRate, numberOfPayments))) /
          (Math.pow(1 + monthlyInterestRate, numberOfPayments) - 1);
      }

      // Calculate total payment and interest
      const totalPayment = monthlyPayment * numberOfPayments;
      const totalInterest = totalPayment - loan.loanAmount;

      return {
        ...loan,
        monthlyPayment,
        totalInterest,
        totalPayment,
      };
    });

    setLoans(updatedLoans);
  }, []);

  // Handle loan property change
  const handleLoanChange = (id, property, value) => {
    const updatedLoans = loans.map((loan) => {
      if (loan.id === id) {
        const updatedLoan = { ...loan, [property]: value };

        // Recalculate loan details
        const monthlyInterestRate = updatedLoan.interestRate / 100 / 12;
        const numberOfPayments = updatedLoan.loanTerm * 12;

        let monthlyPayment = 0;
        if (monthlyInterestRate === 0) {
          monthlyPayment = updatedLoan.loanAmount / numberOfPayments;
        } else {
          monthlyPayment =
            (updatedLoan.loanAmount *
              (monthlyInterestRate *
                Math.pow(1 + monthlyInterestRate, numberOfPayments))) /
            (Math.pow(1 + monthlyInterestRate, numberOfPayments) - 1);
        }

        const totalPayment = monthlyPayment * numberOfPayments;
        const totalInterest = totalPayment - updatedLoan.loanAmount;

        return {
          ...updatedLoan,
          monthlyPayment,
          totalInterest,
          totalPayment,
        };
      }
      return loan;
    });

    setLoans(updatedLoans);
  };

  // Add a new loan option
  const addLoanOption = () => {
    const newId = Math.max(...loans.map((loan) => loan.id)) + 1;

    const newLoan = {
      id: newId,
      name: `Option ${newId}`,
      loanAmount: 300000,
      interestRate: 4.5,
      loanTerm: 30,
      monthlyPayment: 0,
      totalInterest: 0,
      totalPayment: 0,
    };

    // Calculate loan details for the new loan
    const monthlyInterestRate = newLoan.interestRate / 100 / 12;
    const numberOfPayments = newLoan.loanTerm * 12;

    let monthlyPayment = 0;
    if (monthlyInterestRate === 0) {
      monthlyPayment = newLoan.loanAmount / numberOfPayments;
    } else {
      monthlyPayment =
        (newLoan.loanAmount *
          (monthlyInterestRate *
            Math.pow(1 + monthlyInterestRate, numberOfPayments))) /
        (Math.pow(1 + monthlyInterestRate, numberOfPayments) - 1);
    }

    const totalPayment = monthlyPayment * numberOfPayments;
    const totalInterest = totalPayment - newLoan.loanAmount;

    const calculatedNewLoan = {
      ...newLoan,
      monthlyPayment,
      totalInterest,
      totalPayment,
    };

    setLoans([...loans, calculatedNewLoan]);
  };

  // Remove a loan option
  const removeLoanOption = (id) => {
    if (loans.length <= 1) return; // Keep at least one loan option
    setLoans(loans.filter((loan) => loan.id !== id));
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
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Compare Loan Options</h2>
        <button
          onClick={addLoanOption}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          disabled={loans.length >= 4}
        >
          Add Option
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-3 text-left border-b border-gray-200 w-1/6">
                Loan Details
              </th>
              {loans.map((loan) => (
                <th
                  key={loan.id}
                  className="p-3 text-center border-b border-gray-200"
                >
                  <div className="flex justify-between items-center">
                    <input
                      type="text"
                      value={loan.name}
                      onChange={(e) =>
                        handleLoanChange(loan.id, "name", e.target.value)
                      }
                      className="w-full text-center font-semibold bg-transparent border-b border-gray-300 focus:border-blue-500 focus:outline-none"
                    />
                    {loans.length > 1 && (
                      <button
                        onClick={() => removeLoanOption(loan.id)}
                        className="ml-2 text-gray-500 hover:text-red-500"
                      >
                        ×
                      </button>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {/* Loan Amount */}
            <tr>
              <td className="p-3 border-b border-gray-200 font-medium">
                Loan Amount
              </td>
              {loans.map((loan) => (
                <td
                  key={loan.id}
                  className="p-3 text-center border-b border-gray-200"
                >
                  <input
                    type="number"
                    min="10000"
                    max="2000000"
                    step="10000"
                    value={loan.loanAmount}
                    onChange={(e) =>
                      handleLoanChange(
                        loan.id,
                        "loanAmount",
                        Number(e.target.value)
                      )
                    }
                    className="w-full text-center bg-transparent border-b border-gray-300 focus:border-blue-500 focus:outline-none"
                  />
                </td>
              ))}
            </tr>

            {/* Interest Rate */}
            <tr>
              <td className="p-3 border-b border-gray-200 font-medium">
                Interest Rate (%)
              </td>
              {loans.map((loan) => (
                <td
                  key={loan.id}
                  className="p-3 text-center border-b border-gray-200"
                >
                  <input
                    type="number"
                    min="0"
                    max="20"
                    step="0.125"
                    value={loan.interestRate}
                    onChange={(e) =>
                      handleLoanChange(
                        loan.id,
                        "interestRate",
                        Number(e.target.value)
                      )
                    }
                    className="w-full text-center bg-transparent border-b border-gray-300 focus:border-blue-500 focus:outline-none"
                  />
                </td>
              ))}
            </tr>

            {/* Loan Term */}
            <tr>
              <td className="p-3 border-b border-gray-200 font-medium">
                Loan Term (years)
              </td>
              {loans.map((loan) => (
                <td
                  key={loan.id}
                  className="p-3 text-center border-b border-gray-200"
                >
                  <select
                    value={loan.loanTerm}
                    onChange={(e) =>
                      handleLoanChange(
                        loan.id,
                        "loanTerm",
                        Number(e.target.value)
                      )
                    }
                    className="w-full text-center bg-transparent border-b border-gray-300 focus:border-blue-500 focus:outline-none"
                  >
                    <option value={10}>10</option>
                    <option value={15}>15</option>
                    <option value={20}>20</option>
                    <option value={30}>30</option>
                  </select>
                </td>
              ))}
            </tr>

            {/* Monthly Payment */}
            <tr className="bg-blue-50">
              <td className="p-3 border-b border-gray-200 font-medium">
                Monthly Payment
              </td>
              {loans.map((loan) => (
                <td
                  key={loan.id}
                  className="p-3 text-center border-b border-gray-200 font-semibold"
                >
                  {formatCurrency(loan.monthlyPayment)}
                </td>
              ))}
            </tr>

            {/* Total Interest */}
            <tr>
              <td className="p-3 border-b border-gray-200 font-medium">
                Total Interest
              </td>
              {loans.map((loan) => (
                <td
                  key={loan.id}
                  className="p-3 text-center border-b border-gray-200"
                >
                  {formatCurrency(loan.totalInterest)}
                </td>
              ))}
            </tr>

            {/* Total Payment */}
            <tr>
              <td className="p-3 border-b border-gray-200 font-medium">
                Total Payment
              </td>
              {loans.map((loan) => (
                <td
                  key={loan.id}
                  className="p-3 text-center border-b border-gray-200"
                >
                  {formatCurrency(loan.totalPayment)}
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>

      {/* Comparison Chart */}
      <div className="mt-8">
        <h3 className="text-lg font-semibold mb-4">
          Monthly Payment Comparison
        </h3>
        <div className="h-16 flex items-end">
          {loans.map((loan, index) => {
            // Find the maximum monthly payment for scaling
            const maxPayment = Math.max(...loans.map((l) => l.monthlyPayment));
            const barHeight = (loan.monthlyPayment / maxPayment) * 100;

            return (
              <div key={loan.id} className="flex-1 flex flex-col items-center">
                <div
                  className={`w-3/4 bg-blue-${600 - index * 100} rounded-t-md`}
                  style={{ height: `${barHeight}%` }}
                ></div>
                <div className="mt-2 text-sm text-center">{loan.name}</div>
                <div className="text-xs text-gray-600">
                  {formatCurrency(loan.monthlyPayment)}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Total Cost Comparison */}
      <div className="mt-8">
        <h3 className="text-lg font-semibold mb-4">Total Cost Comparison</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {loans.map((loan, index) => (
            <div key={loan.id} className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-semibold mb-2">{loan.name}</h4>
              <div className="flex justify-between mb-1">
                <span>Loan Amount:</span>
                <span>{formatCurrency(loan.loanAmount)}</span>
              </div>
              <div className="flex justify-between mb-1">
                <span>Interest Rate:</span>
                <span>{loan.interestRate}%</span>
              </div>
              <div className="flex justify-between mb-1">
                <span>Loan Term:</span>
                <span>{loan.loanTerm} years</span>
              </div>
              <div className="flex justify-between mb-1">
                <span>Monthly Payment:</span>
                <span className="font-semibold">
                  {formatCurrency(loan.monthlyPayment)}
                </span>
              </div>
              <div className="flex justify-between mb-1">
                <span>Total Interest:</span>
                <span>{formatCurrency(loan.totalInterest)}</span>
              </div>
              <div className="flex justify-between pt-2 border-t mt-2">
                <span>Total Cost:</span>
                <span className="font-semibold">
                  {formatCurrency(loan.totalPayment)}
                </span>
              </div>

              {/* Visualization of principal vs interest */}
              <div className="mt-4">
                <div className="h-6 rounded-lg overflow-hidden flex">
                  <div
                    className="bg-blue-600"
                    style={{
                      width: `${(loan.loanAmount / loan.totalPayment) * 100}%`,
                    }}
                    title="Principal"
                  ></div>
                  <div
                    className="bg-blue-400"
                    style={{
                      width: `${
                        (loan.totalInterest / loan.totalPayment) * 100
                      }%`,
                    }}
                    title="Interest"
                  ></div>
                </div>
                <div className="flex justify-between text-xs mt-1">
                  <span>
                    Principal:{" "}
                    {Math.round((loan.loanAmount / loan.totalPayment) * 100)}%
                  </span>
                  <span>
                    Interest:{" "}
                    {Math.round((loan.totalInterest / loan.totalPayment) * 100)}
                    %
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default LoanComparison;
