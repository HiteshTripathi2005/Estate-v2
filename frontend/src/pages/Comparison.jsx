import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaArrowLeft,
  FaTrash,
  FaBed,
  FaBath,
  FaRulerCombined,
  FaParking,
  FaCouch,
  FaChevronDown,
  FaChevronUp,
  FaExternalLinkAlt,
  FaPrint,
  FaBalanceScale,
} from "react-icons/fa";
import { MdLocationOn } from "react-icons/md";
import useComparisonStore from "../store/comparison.store";
import Navbar from "../components/common/Navbar";
import usePropertyStore from "../store/property.store";
import { motion } from "framer-motion";
import AuthNavbar from "../components/common/AuthNavbar";

const Comparison = () => {
  const { comparisonList, removeFromComparison, clearComparison } =
    useComparisonStore();
  const { getAllProperties } = usePropertyStore();
  const navigate = useNavigate();
  const [expandedCategories, setExpandedCategories] = useState({});

  // Ensure we have the latest property data
  useEffect(() => {
    getAllProperties();

    // Initialize all categories as expanded
    const initialExpandedState = {};
    comparisonCategories.forEach((category, index) => {
      initialExpandedState[index] = true;
    });
    setExpandedCategories(initialExpandedState);
  }, [getAllProperties]);

  // Format price with commas
  const formatPrice = (price) => {
    return price?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") || "N/A";
  };

  const toggleCategory = (categoryIndex) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [categoryIndex]: !prev[categoryIndex],
    }));
  };

  const handlePrint = () => {
    window.print();
  };

  // Add print styles
  useEffect(() => {
    // Create style element
    const style = document.createElement("style");
    style.innerHTML = `
      @media print {
        .print\\:hidden {
          display: none !important;
        }
        body {
          font-size: 12pt;
        }
        .comparison-table th {
          background-color: #f3f4f6 !important;
          -webkit-print-color-adjust: exact;
          print-color-adjust: exact;
        }
        .comparison-table tr:nth-child(even) td {
          background-color: #f9fafb !important;
          -webkit-print-color-adjust: exact;
          print-color-adjust: exact;
        }
        .min-value {
          color: #1e40af !important;
          -webkit-print-color-adjust: exact;
          print-color-adjust: exact;
        }
        .max-value {
          color: #b91c1c !important;
          -webkit-print-color-adjust: exact;
          print-color-adjust: exact;
        }
      }
    `;

    // Append to head
    document.head.appendChild(style);

    // Cleanup on unmount
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  if (comparisonList.length === 0) {
    return (
      <>
        <div className="print:hidden">
          <AuthNavbar />
        </div>
        <div className="container mx-auto px-4 py-8 min-h-screen bg-gray-50">
          <div className="flex items-center mb-6">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
            >
              <FaArrowLeft className="mr-2" />
              <span>Back</span>
            </button>
          </div>

          <div className="text-center py-16 bg-white rounded-xl shadow-sm p-8 max-w-2xl mx-auto">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <FaBalanceScale className="text-3xl text-gray-400" />
            </div>
            <h1 className="text-2xl font-semibold mb-4">
              No Properties to Compare
            </h1>
            <p className="text-gray-600 mb-6">
              Add properties to comparison to see them side by side.
            </p>
            <Link
              to="/properties"
              className="inline-block bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition-colors"
            >
              Browse Properties
            </Link>
          </div>
        </div>
      </>
    );
  }

  // Define comparison categories and their properties
  const comparisonCategories = [
    {
      title: "Basic Information",
      icon: <FaBalanceScale className="mr-2" />,
      items: [
        { label: "Property Type", key: "propertyType" },
        {
          label: "Status",
          key: "status",
          format: (value) => (value === "for-sale" ? "For Sale" : "For Rent"),
          highlight: true,
        },
        {
          label: "Price",
          key: "price",
          format: (value, property) => (
            <span className="font-bold text-blue-600">
              ₹{formatPrice(value)}
              {property.status === "for-rent" && "/month"}
            </span>
          ),
          highlight: true,
        },
      ],
    },
    {
      title: "Features",
      icon: <FaRulerCombined className="mr-2" />,
      items: [
        {
          label: "Bedrooms",
          key: "features.bedrooms",
          icon: <FaBed className="mr-2 text-blue-500" />,
          getValue: (property) => property.features?.bedrooms,
          highlight: true,
        },
        {
          label: "Bathrooms",
          key: "features.bathrooms",
          icon: <FaBath className="mr-2 text-blue-500" />,
          getValue: (property) => property.features?.bathrooms,
          highlight: true,
        },
        {
          label: "Area",
          key: "features.squareFeet",
          icon: <FaRulerCombined className="mr-2 text-blue-500" />,
          getValue: (property) => property.features?.squareFeet,
          format: (value) => (value ? `${value} sq ft` : "N/A"),
          highlight: true,
        },
        {
          label: "Parking",
          key: "features.parking",
          icon: <FaParking className="mr-2 text-blue-500" />,
          getValue: (property) => property.features?.parking,
          format: (value) => (value ? "Available" : "Not Available"),
        },
        {
          label: "Furnished",
          key: "features.furnished",
          icon: <FaCouch className="mr-2 text-blue-500" />,
          getValue: (property) => property.features?.furnished,
          format: (value) => (value ? "Yes" : "No"),
        },
      ],
    },
    {
      title: "Location",
      icon: <MdLocationOn className="mr-2" />,
      items: [
        {
          label: "Address",
          key: "location.address",
          icon: <MdLocationOn className="mr-2 text-blue-500" />,
          getValue: (property) => property.location?.address,
        },
        {
          label: "City",
          key: "location.city",
          getValue: (property) => property.location?.city,
          highlight: true,
        },
        {
          label: "State",
          key: "location.state",
          getValue: (property) => property.location?.state,
        },
        {
          label: "Zip Code",
          key: "location.zipCode",
          getValue: (property) => property.location?.zipCode,
        },
      ],
    },
  ];

  const getNestedValue = (obj, path) => {
    if (!obj) return null;
    const keys = path.split(".");
    return keys.reduce(
      (o, key) => (o && o[key] !== undefined ? o[key] : null),
      obj
    );
  };

  // Helper function to find min and max values for a specific property
  const findMinMaxValues = (properties, item) => {
    const values = properties
      .map((property) => {
        const value = item.getValue
          ? item.getValue(property)
          : getNestedValue(property, item.key);
        return typeof value === "number" ? value : null;
      })
      .filter((val) => val !== null);

    if (values.length === 0) return { min: null, max: null };

    return {
      min: Math.min(...values),
      max: Math.max(...values),
    };
  };

  return (
    <>
      <div className="print:hidden mb-24">
        <AuthNavbar />
      </div>
      <div className="container mx-auto px-4 py-8 bg-gray-50 min-h-screen print:bg-white print:py-2 print:px-0">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4 print:mb-2">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
          >
            <FaArrowLeft className="mr-2" />
            <span>Back</span>
          </button>

          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <h1 className="text-2xl font-semibold">Property Comparison</h1>
            {comparisonList.length > 0 && (
              <div className="flex items-center gap-2 print:hidden">
                <motion.button
                  onClick={handlePrint}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-2 bg-blue-100 text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-200 transition-colors"
                >
                  <FaPrint />
                  <span>Print</span>
                </motion.button>
                <motion.button
                  onClick={clearComparison}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-2 bg-red-100 text-red-600 px-4 py-2 rounded-lg hover:bg-red-200 transition-colors"
                >
                  <FaTrash />
                  <span>Clear All</span>
                </motion.button>
              </div>
            )}
          </div>
        </div>

        {/* Property Cards */}
        <div className="mb-8 bg-white rounded-xl shadow-sm p-6">
          <div className="overflow-x-auto pb-2">
            <div
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
              style={{
                minWidth:
                  comparisonList.length > 1
                    ? `${Math.min(comparisonList.length * 280, 1120)}px`
                    : "100%",
                display: "grid",
                gridTemplateColumns: `repeat(${comparisonList.length}, minmax(250px, 1fr))`,
              }}
            >
              {comparisonList.map((property) => (
                <div
                  key={property._id}
                  className="relative bg-white rounded-lg border border-gray-200 overflow-hidden transition-all hover:shadow-md"
                >
                  <div className="relative">
                    {property.images && property.images.length > 0 ? (
                      <img
                        src={property.images[0]}
                        alt={property.title}
                        className="w-full h-48 object-cover"
                      />
                    ) : (
                      <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                        <span className="text-gray-500">No Image</span>
                      </div>
                    )}

                    <button
                      onClick={() => removeFromComparison(property._id)}
                      className="absolute top-2 right-2 bg-white p-2 rounded-full shadow-md hover:bg-gray-100 transition-colors"
                      title="Remove from comparison"
                    >
                      <FaTrash className="text-red-600" />
                    </button>
                  </div>

                  <div className="p-4">
                    <Link to={`/properties/${property._id}`} className="block">
                      <h2 className="text-lg font-semibold hover:text-blue-600 transition-colors line-clamp-2 h-14">
                        {property.title}
                      </h2>
                    </Link>

                    <div className="flex items-center text-gray-600 mt-2">
                      <MdLocationOn className="mr-1 flex-shrink-0" />
                      <span className="text-sm truncate">
                        {property.location?.city}, {property.location?.state}
                      </span>
                    </div>

                    <div className="mt-3 pt-3 border-t border-gray-100">
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-blue-600">
                          ₹{formatPrice(property.price)}
                          {property.status === "for-rent" && "/month"}
                        </span>
                        <span className="text-xs px-2 py-1 bg-gray-100 rounded-full">
                          {property.status === "for-sale"
                            ? "For Sale"
                            : "For Rent"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Comparison Tables */}
        <div className="space-y-6">
          {comparisonCategories.map((category, categoryIndex) => (
            <div key={categoryIndex} className="mb-6">
              <div
                className="flex items-center justify-between bg-white p-4 rounded-lg shadow-sm cursor-pointer"
                onClick={() => toggleCategory(categoryIndex)}
              >
                <div className="flex items-center gap-2 text-lg font-medium text-gray-800">
                  {category.icon}
                  <span>{category.title}</span>
                </div>
                <div>
                  {expandedCategories[categoryIndex] ? (
                    <FaChevronUp className="text-gray-500" />
                  ) : (
                    <FaChevronDown className="text-gray-500" />
                  )}
                </div>
              </div>

              {expandedCategories[categoryIndex] && (
                <div className="overflow-x-auto mt-6 bg-white rounded-lg shadow-sm">
                  <div className="min-w-max">
                    <table className="w-full border-collapse comparison-table">
                      <tbody>
                        <tr>
                          <th
                            className="bg-indigo-100 text-indigo-800 font-semibold p-3 text-left border border-gray-200 sticky left-0 z-10"
                            style={{ minWidth: "180px" }}
                          >
                            <div className="flex items-center gap-2">
                              {category.icon}
                              {category.title}
                            </div>
                          </th>
                          {comparisonList.map((property) => (
                            <th
                              key={property._id}
                              className="bg-indigo-100 text-indigo-800 font-semibold p-3 text-center border border-gray-200"
                              style={{ minWidth: "180px" }}
                            >
                              <div className="truncate max-w-[180px]">
                                {property.title}
                              </div>
                            </th>
                          ))}
                        </tr>
                        {category.items.map((item, itemIndex) => {
                          const minMax = item.highlight
                            ? findMinMaxValues(comparisonList, item)
                            : { min: null, max: null };

                          return (
                            <tr
                              key={itemIndex}
                              className={
                                itemIndex % 2 === 0 ? "bg-gray-50" : "bg-white"
                              }
                            >
                              <td
                                className="px-6 py-4 border-r border-gray-100 flex items-center font-medium text-gray-700 sticky left-0 z-10 bg-inherit"
                                style={{ minWidth: "180px" }}
                              >
                                {item.icon && item.icon}
                                {item.label}
                              </td>

                              {comparisonList.map((property) => {
                                const value = item.getValue
                                  ? item.getValue(property)
                                  : getNestedValue(property, item.key);

                                const displayValue = item.format
                                  ? item.format(value, property)
                                  : value || "N/A";

                                // Determine if this is a min or max value for highlighting
                                let highlightClass = "";
                                if (
                                  item.highlight &&
                                  typeof value === "number"
                                ) {
                                  if (
                                    value === minMax.min &&
                                    value !== minMax.max
                                  ) {
                                    highlightClass =
                                      "bg-green-50 text-green-700 font-medium";
                                  } else if (
                                    value === minMax.max &&
                                    value !== minMax.min
                                  ) {
                                    highlightClass =
                                      "bg-blue-50 text-blue-700 font-medium";
                                  }
                                }

                                return (
                                  <td
                                    key={property._id}
                                    className={`px-6 py-4 text-center ${highlightClass}`}
                                    style={{ minWidth: "180px" }}
                                  >
                                    {displayValue}
                                  </td>
                                );
                              })}
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="mt-8 overflow-x-auto pb-2">
          <div
            className="grid gap-6"
            style={{
              minWidth:
                comparisonList.length > 1
                  ? `${Math.min(comparisonList.length * 280, 1120)}px`
                  : "100%",
              display: "grid",
              gridTemplateColumns: `repeat(${comparisonList.length}, minmax(250px, 1fr))`,
            }}
          >
            {comparisonList.map((property) => (
              <div key={property._id} className="flex justify-center">
                <Link
                  to={`/properties/${property._id}`}
                  className="flex items-center gap-2 bg-blue-600 text-white py-3 px-6 rounded-md hover:bg-blue-700 transition-colors text-center w-full justify-center"
                >
                  <span>View Details</span>
                  <FaExternalLinkAlt className="text-sm" />
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* Legend */}
        <div className="mt-8 bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold mb-4">Comparison Legend</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center">
              <div className="w-6 h-6 bg-green-50 border border-green-100 rounded mr-3"></div>
              <span className="text-gray-700">
                Lowest value (better for price, may be better for other metrics)
              </span>
            </div>
            <div className="flex items-center">
              <div className="w-6 h-6 bg-blue-50 border border-blue-100 rounded mr-3"></div>
              <span className="text-gray-700">
                Highest value (better for bedrooms, bathrooms, area)
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Comparison;
