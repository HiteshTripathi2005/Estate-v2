import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Navbar from "../components/common/Navbar";
import MortgageCalculatorTool from "../components/mortgage/MortgageCalculatorTool";
import AffordabilityCalculator from "../components/mortgage/AffordabilityCalculator";
import LoanComparison from "../components/mortgage/LoanComparison";
import AmortizationSchedule from "../components/mortgage/AmortizationSchedule";
import AuthNavbar from "../components/common/AuthNavbar";
import { useLocation } from "react-router-dom";

const MortgageCalculator = () => {
  const [activeTab, setActiveTab] = useState("calculator");
  const location = useLocation();
  const [propertyPrice, setPropertyPrice] = useState(null);

  useEffect(() => {
    // Extract property price from URL search params if available
    const searchParams = new URLSearchParams(location.search);
    const price = searchParams.get("price");
    if (price) {
      setPropertyPrice(Number(price));
    }
  }, [location]);

  const tabs = [
    { id: "calculator", label: "Mortgage Calculator" },
    { id: "affordability", label: "Affordability Calculator" },
    { id: "comparison", label: "Loan Comparison" },
    { id: "amortization", label: "Amortization Schedule" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mb-20">
        <AuthNavbar />
      </div>
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-lg shadow-lg p-6"
        >
          <h1 className="text-3xl font-bold text-gray-800 mb-6">
            Mortgage & Financing Tools
          </h1>
          <p className="text-gray-600 mb-8">
            Plan your property purchase with our comprehensive mortgage and
            financing tools. Calculate monthly payments, determine what you can
            afford, compare loan options, and view detailed amortization
            schedules.
          </p>

          {/* Tabs */}
          <div className="flex flex-wrap gap-2 mb-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-md transition-all duration-200 ${
                  activeTab === tab.id
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Content based on active tab */}
          <div className="mt-6">
            {activeTab === "calculator" && (
              <MortgageCalculatorTool initialPropertyPrice={propertyPrice} />
            )}
            {activeTab === "affordability" && <AffordabilityCalculator />}
            {activeTab === "comparison" && <LoanComparison />}
            {activeTab === "amortization" && <AmortizationSchedule />}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default MortgageCalculator;
