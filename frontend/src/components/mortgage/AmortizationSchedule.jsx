import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

const AmortizationSchedule = () => {
  // State for calculator inputs
  const [loanAmount, setLoanAmount] = useState(300000);
  const [interestRate, setInterestRate] = useState(4.5);
  const [loanTerm, setLoanTerm] = useState(30);
  const [monthlyPayment, setMonthlyPayment] = useState(0);
  const [totalInterest, setTotalInterest] = useState(0);
  const [amortizationData, setAmortizationData] = useState([]);
  const [displayYears, setDisplayYears] = useState(5);
  const [yearlyData, setYearlyData] = useState([]);
  const [viewMode, setViewMode] = useState("yearly"); // yearly or monthly

  // Calculate amortization schedule
  useEffect(() => {
    // Convert annual interest rate to monthly rate
    const monthlyInterestRate = interestRate / 100 / 12;

    // Calculate number of payments
    const numberOfPayments = loanTerm * 12;

    // Calculate monthly payment
    let calculatedMonthlyPayment = 0;
    if (monthlyInterestRate === 0) {
      calculatedMonthlyPayment = loanAmount / numberOfPayments;
    } else {
      calculatedMonthlyPayment =
        (loanAmount *
          (monthlyInterestRate *
            Math.pow(1 + monthlyInterestRate, numberOfPayments))) /
        (Math.pow(1 + monthlyInterestRate, numberOfPayments) - 1);
    }

    setMonthlyPayment(calculatedMonthlyPayment);

    // Generate amortization schedule
    let balance = loanAmount;
    let totalInterestPaid = 0;
    const schedule = [];

    for (let month = 1; month <= numberOfPayments; month++) {
      // Calculate interest for this month
      const interestPayment = balance * monthlyInterestRate;

      // Calculate principal for this month
      const principalPayment = calculatedMonthlyPayment - interestPayment;

      // Update balance
      balance -= principalPayment;

      // Update total interest
      totalInterestPaid += interestPayment;

      // Add to schedule
      schedule.push({
        month,
        payment: calculatedMonthlyPayment,
        principal: principalPayment,
        interest: interestPayment,
        totalInterest: totalInterestPaid,
        balance: Math.max(0, balance),
      });
    }

    setAmortizationData(schedule);
    setTotalInterest(totalInterestPaid);

    // Generate yearly summary
    const years = [];
    for (let year = 1; year <= loanTerm; year++) {
      const yearStart = (year - 1) * 12;
      const yearEnd = year * 12 - 1;

      if (yearStart < schedule.length) {
        const yearlyPrincipal = schedule
          .slice(yearStart, yearEnd + 1)
          .reduce((sum, month) => sum + month.principal, 0);

        const yearlyInterest = schedule
          .slice(yearStart, yearEnd + 1)
          .reduce((sum, month) => sum + month.interest, 0);

        const startBalance =
          yearStart === 0 ? loanAmount : schedule[yearStart - 1].balance;
        const endBalance =
          schedule[Math.min(yearEnd, schedule.length - 1)].balance;

        years.push({
          year,
          principal: yearlyPrincipal,
          interest: yearlyInterest,
          totalPayment: yearlyPrincipal + yearlyInterest,
          startBalance,
          endBalance,
        });
      }
    }

    setYearlyData(years);
  }, [loanAmount, interestRate, loanTerm]);

  // Format currency
  const formatCurrency = (value) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  // Format percentage
  const formatPercent = (value) => {
    return new Intl.NumberFormat("en-US", {
      style: "percent",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value / 100);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        {/* Input Section */}
        <div className="lg:col-span-1 bg-gray-50 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-6">Loan Details</h2>

          {/* Loan Amount Slider */}
          <div className="mb-6">
            <div className="flex justify-between mb-2">
              <label className="text-gray-700">Loan Amount</label>
              <span className="font-medium">{formatCurrency(loanAmount)}</span>
            </div>
            <input
              type="range"
              min="50000"
              max="1000000"
              step="10000"
              value={loanAmount}
              onChange={(e) => setLoanAmount(Number(e.target.value))}
              className="w-full h-2 bg-blue-100 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>₹50,000</span>
              <span>₹1,000,000</span>
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

          {/* Loan Term Selector */}
          <div className="mb-6">
            <label className="block text-gray-700 mb-2">
              Loan Term (years)
            </label>
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

          {/* Display Years Selector (for yearly view) */}
          {viewMode === "yearly" && (
            <div className="mb-6">
              <label className="block text-gray-700 mb-2">Display Years</label>
              <select
                value={displayYears}
                onChange={(e) => setDisplayYears(Number(e.target.value))}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value={5}>First 5 years</option>
                <option value={10}>First 10 years</option>
                <option value={loanTerm}>All {loanTerm} years</option>
              </select>
            </div>
          )}

          {/* View Mode Selector */}
          <div className="mb-6">
            <label className="block text-gray-700 mb-2">View Mode</label>
            <div className="flex gap-2">
              <button
                onClick={() => setViewMode("yearly")}
                className={`flex-1 py-2 rounded-md transition-colors ${
                  viewMode === "yearly"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                Yearly
              </button>
              <button
                onClick={() => setViewMode("monthly")}
                className={`flex-1 py-2 rounded-md transition-colors ${
                  viewMode === "monthly"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                Monthly
              </button>
            </div>
          </div>
        </div>

        {/* Summary Section */}
        <div className="lg:col-span-2">
          <h2 className="text-xl font-semibold mb-6">Loan Summary</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {/* Monthly Payment */}
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="text-gray-600 mb-1">Monthly Payment</h3>
              <div className="text-2xl font-bold text-blue-700">
                {formatCurrency(monthlyPayment)}
              </div>
            </div>

            {/* Total Interest */}
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="text-gray-600 mb-1">Total Interest</h3>
              <div className="text-2xl font-bold text-blue-700">
                {formatCurrency(totalInterest)}
              </div>
            </div>

            {/* Total Payment */}
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="text-gray-600 mb-1">Total Payment</h3>
              <div className="text-2xl font-bold text-blue-700">
                {formatCurrency(loanAmount + totalInterest)}
              </div>
            </div>

            {/* Interest to Principal Ratio */}
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="text-gray-600 mb-1">
                Interest to Principal Ratio
              </h3>
              <div className="text-2xl font-bold text-blue-700">
                {(totalInterest / loanAmount).toFixed(2)}
              </div>
            </div>
          </div>

          {/* Payment Breakdown Visualization */}
          <div className="bg-gray-50 p-4 rounded-lg mb-6">
            <h3 className="text-gray-700 mb-3">Payment Breakdown</h3>
            <div className="h-8 rounded-lg overflow-hidden flex">
              <div
                className="bg-blue-600"
                style={{
                  width: `${
                    (loanAmount / (loanAmount + totalInterest)) * 100
                  }%`,
                }}
                title="Principal"
              ></div>
              <div
                className="bg-blue-400"
                style={{
                  width: `${
                    (totalInterest / (loanAmount + totalInterest)) * 100
                  }%`,
                }}
                title="Interest"
              ></div>
            </div>
            <div className="flex justify-between text-sm mt-2">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-blue-600 mr-1"></div>
                <span>
                  Principal: {formatCurrency(loanAmount)} (
                  {Math.round(
                    (loanAmount / (loanAmount + totalInterest)) * 100
                  )}
                  %)
                </span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-blue-400 mr-1"></div>
                <span>
                  Interest: {formatCurrency(totalInterest)} (
                  {Math.round(
                    (totalInterest / (loanAmount + totalInterest)) * 100
                  )}
                  %)
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Amortization Schedule */}
      <div>
        <h2 className="text-xl font-semibold mb-4">
          {viewMode === "yearly"
            ? "Yearly Amortization Schedule"
            : "Monthly Amortization Schedule"}
        </h2>

        <div className="overflow-x-auto">
          {viewMode === "yearly" ? (
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  <th className="p-3 text-left border-b border-gray-200">
                    Year
                  </th>
                  <th className="p-3 text-right border-b border-gray-200">
                    Principal
                  </th>
                  <th className="p-3 text-right border-b border-gray-200">
                    Interest
                  </th>
                  <th className="p-3 text-right border-b border-gray-200">
                    Total Payment
                  </th>
                  <th className="p-3 text-right border-b border-gray-200">
                    Remaining Balance
                  </th>
                </tr>
              </thead>
              <tbody>
                {yearlyData.slice(0, displayYears).map((yearData) => (
                  <tr key={yearData.year} className="hover:bg-gray-50">
                    <td className="p-3 border-b border-gray-200">
                      {yearData.year}
                    </td>
                    <td className="p-3 text-right border-b border-gray-200">
                      {formatCurrency(yearData.principal)}
                    </td>
                    <td className="p-3 text-right border-b border-gray-200">
                      {formatCurrency(yearData.interest)}
                    </td>
                    <td className="p-3 text-right border-b border-gray-200">
                      {formatCurrency(yearData.totalPayment)}
                    </td>
                    <td className="p-3 text-right border-b border-gray-200">
                      {formatCurrency(yearData.endBalance)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  <th className="p-3 text-left border-b border-gray-200">
                    Month
                  </th>
                  <th className="p-3 text-right border-b border-gray-200">
                    Payment
                  </th>
                  <th className="p-3 text-right border-b border-gray-200">
                    Principal
                  </th>
                  <th className="p-3 text-right border-b border-gray-200">
                    Interest
                  </th>
                  <th className="p-3 text-right border-b border-gray-200">
                    Total Interest
                  </th>
                  <th className="p-3 text-right border-b border-gray-200">
                    Remaining Balance
                  </th>
                </tr>
              </thead>
              <tbody>
                {amortizationData.slice(0, 24).map((monthData) => (
                  <tr key={monthData.month} className="hover:bg-gray-50">
                    <td className="p-3 border-b border-gray-200">
                      {monthData.month}
                    </td>
                    <td className="p-3 text-right border-b border-gray-200">
                      {formatCurrency(monthData.payment)}
                    </td>
                    <td className="p-3 text-right border-b border-gray-200">
                      {formatCurrency(monthData.principal)}
                    </td>
                    <td className="p-3 text-right border-b border-gray-200">
                      {formatCurrency(monthData.interest)}
                    </td>
                    <td className="p-3 text-right border-b border-gray-200">
                      {formatCurrency(monthData.totalInterest)}
                    </td>
                    <td className="p-3 text-right border-b border-gray-200">
                      {formatCurrency(monthData.balance)}
                    </td>
                  </tr>
                ))}
                {amortizationData.length > 24 && (
                  <tr>
                    <td
                      colSpan="6"
                      className="p-3 text-center border-b border-gray-200 text-gray-500"
                    >
                      Showing first 24 months. Adjust view mode to see yearly
                      summary.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default AmortizationSchedule;
