import { create } from "zustand";
import toast from "react-hot-toast";
import { persist } from "zustand/middleware";

// Get initial comparison list from localStorage if available
const getInitialComparisonList = () => {
  try {
    const storedData = localStorage.getItem("property-comparison");
    return storedData ? JSON.parse(storedData).state.comparisonList || [] : [];
  } catch (error) {
    console.error("Error reading from localStorage:", error);
    return [];
  }
};

const useComparisonStore = create(
  persist(
    (set, get) => ({
      comparisonList: getInitialComparisonList(),
      loading: false,

      // Add a property to comparison list
      addToComparison: (property) => {
        const { comparisonList } = get();

        // Check if property is already in comparison list
        if (comparisonList.some((item) => item._id === property._id)) {
          toast.error("Property already in comparison list");
          return;
        }

        // Limit to 4 properties for comparison
        if (comparisonList.length >= 4) {
          toast.error("You can compare up to 4 properties at a time");
          return;
        }

        set({ comparisonList: [...comparisonList, property] });
        toast.success("Added to comparison");
      },

      // Remove a property from comparison list
      removeFromComparison: (propertyId) => {
        const { comparisonList } = get();
        set({
          comparisonList: comparisonList.filter(
            (item) => item._id !== propertyId
          ),
        });
        toast.success("Removed from comparison");
      },

      // Clear all properties from comparison list
      clearComparison: () => {
        set({ comparisonList: [] });
        toast.success("Comparison list cleared");
      },
    }),
    {
      name: "property-comparison", // unique name for localStorage
      partialize: (state) => ({ comparisonList: state.comparisonList }), // only store comparisonList
    }
  )
);

export default useComparisonStore;
