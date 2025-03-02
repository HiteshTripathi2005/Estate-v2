import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaBalanceScale } from "react-icons/fa";
import useComparisonStore from "../../store/comparison.store";
import { motion, AnimatePresence } from "framer-motion";

const ComparisonIndicator = () => {
  const { comparisonList } = useComparisonStore();
  const [count, setCount] = useState(comparisonList.length);

  useEffect(() => {
    setCount(comparisonList.length);

    // Listen for storage events to update count if localStorage changes in another tab
    const handleStorageChange = () => {
      try {
        const storedData = localStorage.getItem("property-comparison");
        if (storedData) {
          const parsedData = JSON.parse(storedData);
          if (parsedData.state && parsedData.state.comparisonList) {
            setCount(parsedData.state.comparisonList.length);
          }
        }
      } catch (error) {
        console.error("Error reading from localStorage:", error);
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [comparisonList]);

  return (
    <AnimatePresence>
      {count > 0 && (
        <motion.div
          className="fixed bottom-4 right-4 z-50"
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
          <Link
            to="/comparison"
            className="flex items-center gap-2 bg-indigo-600 text-white px-5 py-3 rounded-full shadow-lg hover:bg-indigo-700 transition-all hover:shadow-xl"
          >
            <div className="relative">
              <FaBalanceScale className="text-lg" />
              <motion.span
                key={count}
                initial={{ scale: 1.5 }}
                animate={{ scale: 1 }}
                className="absolute -top-2 -right-2 bg-white text-indigo-600 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold"
              >
                {count}
              </motion.span>
            </div>
            <span className="font-medium">Compare Properties</span>
          </Link>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ComparisonIndicator;
