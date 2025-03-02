import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

const AffordabilityCalculator = () => {
  // State for calculator inputs
  const [annualIncome, setAnnualIncome] = useState(100000);
  const [monthlyDebts, setMonthlyDebts] = useState(500);
  const [downPayment, setDownPayment] = useState(50000);
  const [interestRate, setInterestRate] = useState(4.5);
  const [loanTerm, setLoanTerm] = useState(30);
  const [propertyTaxRate, setPropertyTaxRate] = useState(1.2);
  const [homeInsurance, setHomeInsurance] = useState(1200);

  // State for calculator outputs
  const [maxHomePrice, setMaxHomePrice] = useState(0);
  const [monthlyPayment, setMonthlyPayment] = useState(0);
  const [breakdownData, setBreakdownData] = useState({
    principal: 0,
    interest: 0,
    taxes: 0,
    insurance: 0,
    total: 0,
  });

  // Calculate affordability
  useEffect(() => {
    // Calculate monthly income
    const monthlyIncome = annualIncome / 12;

    // Calculate maximum monthly payment (using 28% front-end ratio)
    const maxMonthlyPayment = monthlyIncome * 0.28;

    // Calculate maximum debt payment (using 36% back-end ratio)
    const maxDebtPayment = monthlyIncome * 0.36 - monthlyDebts;

    // Use the lower of the two values
    const maxAllowablePayment = Math.min(maxMonthlyPayment, maxDebtPayment);

    // Monthly insurance
    const monthlyInsurance = homeInsurance / 12;

    // Calculate maximum loan amount
    const monthlyInterestRate = interestRate / 100 / 12;
    const numberOfPayments = loanTerm * 12;

    let maxLoanAmount = 0;

    if (monthlyInterestRate === 0) {
      maxLoanAmount = maxAllowablePayment * numberOfPayments;
    } else {
      // Subtract taxes and insurance from max payment to get P&I payment
      const maxPIPayment = maxAllowablePayment - monthlyInsurance;

      // Calculate max loan amount using the mortgage formula
      maxLoanAmount =
        (maxPIPayment *
          (1 - Math.pow(1 + monthlyInterestRate, -numberOfPayments))) /
        monthlyInterestRate;
    }

    // Calculate max home price (loan amount + down payment)
    const calculatedMaxHomePrice = maxLoanAmount + downPayment;

    // Monthly property tax
    const monthlyPropertyTax =
      (calculatedMaxHomePrice * propertyTaxRate) / 100 / 12;

    // Recalculate with property tax included
    const maxPITIPayment =
      maxAllowablePayment - monthlyPropertyTax - monthlyInsurance;

    let adjustedMaxLoanAmount = 0;

    if (monthlyInterestRate === 0) {
      adjustedMaxLoanAmount = maxPITIPayment * numberOfPayments;
    } else {
      adjustedMaxLoanAmount =
        (maxPITIPayment *
          (1 - Math.pow(1 + monthlyInterestRate, -numberOfPayments))) /
        monthlyInterestRate;
    }

    // Final max home price
    const finalMaxHomePrice = adjustedMaxLoanAmount + downPayment;

    // Calculate monthly payment components
    const loanAmount = finalMaxHomePrice - downPayment;

    let principalAndInterest = 0;
    if (monthlyInterestRate === 0) {
      principalAndInterest = loanAmount / numberOfPayments;
    } else {
      principalAndInterest =
        (loanAmount *
          (monthlyInterestRate *
            Math.pow(1 + monthlyInterestRate, numberOfPayments))) /
        (Math.pow(1 + monthlyInterestRate, numberOfPayments) - 1);
    }

    const finalMonthlyPropertyTax =
      (finalMaxHomePrice * propertyTaxRate) / 100 / 12;

    // Set state values
    setMaxHomePrice(finalMaxHomePrice);
    setMonthlyPayment(
      principalAndInterest + finalMonthlyPropertyTax + monthlyInsurance
    );

    // Set breakdown data
    setBreakdownData({
      principal:
        principalAndInterest *
        (loanAmount / (principalAndInterest * numberOfPayments)),
      interest:
        principalAndInterest *
        (1 - loanAmount / (principalAndInterest * numberOfPayments)),
      taxes: finalMonthlyPropertyTax,
      insurance: monthlyInsurance,
      total: principalAndInterest + finalMonthlyPropertyTax + monthlyInsurance,
    });
  }, [
    annualIncome,
    monthlyDebts,
    downPayment,
    interestRate,
    loanTerm,
    propertyTaxRate,
    homeInsurance,
  ]);

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
        <h2 className="text-xl font-semibold mb-6">Financial Information</h2>

        {/* Annual Income Slider */}
        <div className="mb-6">
          <div className="flex justify-between mb-2">
            <label className="text-gray-700">Annual Household Income</label>
            <span className="font-medium">{formatCurrency(annualIncome)}</span>
          </div>
          <input
            type="range"
            min="30000"
            max="500000"
            step="5000"
            value={annualIncome}
            onChange={(e) => setAnnualIncome(Number(e.target.value))}
            className="w-full h-2 bg-blue-100 rounded-lg appearance-none cursor-pointer"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>₹30,000</span>
            <span>₹500,000</span>
          </div>
        </div>

        {/* Monthly Debts Slider */}
        <div className="mb-6">
          <div className="flex justify-between mb-2">
            <label className="text-gray-700">Monthly Debt Payments</label>
            <span className="font-medium">{formatCurrency(monthlyDebts)}</span>
          </div>
          <input
            type="range"
            min="0"
            max="5000"
            step="100"
            value={monthlyDebts}
            onChange={(e) => setMonthlyDebts(Number(e.target.value))}
            className="w-full h-2 bg-blue-100 rounded-lg appearance-none cursor-pointer"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>₹0</span>
            <span>₹5,000</span>
          </div>
        </div>

        {/* Down Payment Slider */}
        <div className="mb-6">
          <div className="flex justify-between mb-2">
            <label className="text-gray-700">Available Down Payment</label>
            <span className="font-medium">{formatCurrency(downPayment)}</span>
          </div>
          <input
            type="range"
            min="0"
            max="200000"
            step="5000"
            value={downPayment}
            onChange={(e) => setDownPayment(Number(e.target.value))}
            className="w-full h-2 bg-blue-100 rounded-lg appearance-none cursor-pointer"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>₹0</span>
            <span>₹200,000</span>
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

        {/* Property Tax Rate Slider */}
        <div className="mb-6">
          <div className="flex justify-between mb-2">
            <label className="text-gray-700">Property Tax Rate</label>
            <span className="font-medium">{propertyTaxRate}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="5"
            step="0.1"
            value={propertyTaxRate}
            onChange={(e) => setPropertyTaxRate(Number(e.target.value))}
            className="w-full h-2 bg-blue-100 rounded-lg appearance-none cursor-pointer"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>0%</span>
            <span>5%</span>
          </div>
        </div>

        {/* Home Insurance Slider */}
        <div className="mb-6">
          <div className="flex justify-between mb-2">
            <label className="text-gray-700">Annual Home Insurance</label>
            <span className="font-medium">{formatCurrency(homeInsurance)}</span>
          </div>
          <input
            type="range"
            min="0"
            max="5000"
            step="100"
            value={homeInsurance}
            onChange={(e) => setHomeInsurance(Number(e.target.value))}
            className="w-full h-2 bg-blue-100 rounded-lg appearance-none cursor-pointer"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>₹0</span>
            <span>₹5,000</span>
          </div>
        </div>
      </div>

      {/* Results Section */}
      <div>
        <h2 className="text-xl font-semibold mb-6">Affordability Results</h2>

        {/* Max Home Price */}
        <div className="bg-blue-50 p-6 rounded-lg mb-6">
          <h3 className="text-gray-600 mb-2">Maximum Home Price</h3>
          <div className="text-4xl font-bold text-blue-700">
            {formatCurrency(maxHomePrice)}
          </div>
          <p className="text-gray-500 mt-2">
            Based on your income, debts, and other financial factors
          </p>
        </div>

        {/* Monthly Payment */}
        <div className="bg-gray-50 p-6 rounded-lg mb-6">
          <h3 className="text-gray-600 mb-2">Estimated Monthly Payment</h3>
          <div className="text-2xl font-semibold">
            {formatCurrency(monthlyPayment)}
          </div>

          {/* Payment Breakdown */}
          <div className="mt-4">
            <h4 className="text-gray-600 mb-2">Payment Breakdown</h4>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Principal & Interest</span>
                <span>
                  {formatCurrency(
                    breakdownData.principal + breakdownData.interest
                  )}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Property Taxes</span>
                <span>{formatCurrency(breakdownData.taxes)}</span>
              </div>
              <div className="flex justify-between">
                <span>Home Insurance</span>
                <span>{formatCurrency(breakdownData.insurance)}</span>
              </div>
              <div className="flex justify-between font-semibold pt-2 border-t">
                <span>Total Monthly Payment</span>
                <span>{formatCurrency(breakdownData.total)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Payment Breakdown Visualization */}
        <div className="mt-6">
          <h3 className="text-gray-700 mb-3">Payment Breakdown</h3>
          <div className="h-8 rounded-lg overflow-hidden flex">
            <div
              className="bg-blue-600"
              style={{
                width: `${
                  (breakdownData.principal / breakdownData.total) * 100
                }%`,
              }}
              title="Principal"
            ></div>
            <div
              className="bg-blue-400"
              style={{
                width: `${
                  (breakdownData.interest / breakdownData.total) * 100
                }%`,
              }}
              title="Interest"
            ></div>
            <div
              className="bg-blue-300"
              style={{
                width: `${(breakdownData.taxes / breakdownData.total) * 100}%`,
              }}
              title="Taxes"
            ></div>
            <div
              className="bg-blue-200"
              style={{
                width: `${
                  (breakdownData.insurance / breakdownData.total) * 100
                }%`,
              }}
              title="Insurance"
            ></div>
          </div>
          <div className="flex flex-wrap mt-2 text-sm">
            <div className="flex items-center mr-4 mb-1">
              <div className="w-3 h-3 bg-blue-600 mr-1"></div>
              <span>Principal</span>
            </div>
            <div className="flex items-center mr-4 mb-1">
              <div className="w-3 h-3 bg-blue-400 mr-1"></div>
              <span>Interest</span>
            </div>
            <div className="flex items-center mr-4 mb-1">
              <div className="w-3 h-3 bg-blue-300 mr-1"></div>
              <span>Taxes</span>
            </div>
            <div className="flex items-center mb-1">
              <div className="w-3 h-3 bg-blue-200 mr-1"></div>
              <span>Insurance</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default AffordabilityCalculator;
