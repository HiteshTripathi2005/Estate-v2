import React, { useEffect, useState } from "react";
import { FaBalanceScale, FaCheck } from "react-icons/fa";
import useComparisonStore from "../../store/comparison.store";
import usePropertyStore from "../../store/property.store";
import { motion } from "framer-motion";

const CompareButton = ({ property }) => {
  const { addToComparison, removeFromComparison, comparisonList } =
    useComparisonStore();
  const { getPropertyInfo, info } = usePropertyStore();
  const [isInComparisonList, setIsInComparisonList] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Check if property is in comparison list
  useEffect(() => {
    const checkIfInComparison = () => {
      setIsInComparisonList(
        comparisonList.some((item) => item._id === property._id)
      );
    };

    checkIfInComparison();
  }, [comparisonList, property._id]);

  const handleComparisonToggle = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 500);

    if (isInComparisonList) {
      removeFromComparison(property._id);
    } else {
      try {
        setIsLoading(true);
        // Fetch complete property data before adding to comparison
        await getPropertyInfo(property._id);
      } catch (error) {
        console.error("Error fetching complete property data:", error);
        // Fallback to adding the incomplete property if fetch fails
        addToComparison(property);
      } finally {
        setIsLoading(false);
      }
    }
  };

  // Add property to comparison when info is updated
  useEffect(() => {
    if (isLoading && info && info._id === property._id) {
      addToComparison(info);
      setIsLoading(false);
    }
  }, [info, isLoading, property._id, addToComparison]);

  return (
    <motion.button
      onClick={handleComparisonToggle}
      whileTap={{ scale: 0.95 }}
      disabled={isLoading}
      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-300 shadow-sm ${
        isInComparisonList
          ? "bg-indigo-600 text-white hover:bg-indigo-700"
          : "bg-white text-indigo-600 border border-indigo-200 hover:border-indigo-300 hover:bg-indigo-50"
      } ${isLoading ? "opacity-70 cursor-wait" : ""}`}
      title={
        isInComparisonList ? "Remove from comparison" : "Add to comparison"
      }
    >
      <motion.span
        animate={isAnimating ? { rotate: [0, 15, -15, 0] } : {}}
        transition={{ duration: 0.5 }}
        className="flex items-center justify-center"
      >
        {isLoading ? (
          <span className="animate-spin h-3 w-3 border-2 border-indigo-500 border-t-transparent rounded-full"></span>
        ) : isInComparisonList ? (
          <FaCheck className="text-xs" />
        ) : (
          <FaBalanceScale className="text-xs" />
        )}
      </motion.span>
      <span>
        {isLoading ? "Loading..." : isInComparisonList ? "Added" : "Compare"}
      </span>
    </motion.button>
  );
};

export default CompareButton;
