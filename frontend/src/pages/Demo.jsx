import React, { useEffect, useState } from "react";
import instance from "../utils/axios";
import { motion } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { FaCheck, FaTimes, FaBed, FaBath, FaRuler } from "react-icons/fa";

const Demo = () => {
  const [properties, setProperties] = useState([]);
  const [selectedProperties, setSelectedProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        setLoading(true);
        const res = await instance.get("/property/getall");
        setProperties(res.data.data);
      } catch (error) {
        console.error("Error fetching properties:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, []);

  const togglePropertySelection = (property) => {
    if (selectedProperties.find((p) => p._id === property._id)) {
      setSelectedProperties(
        selectedProperties.filter((p) => p._id !== property._id)
      );
    } else if (selectedProperties.length < 3) {
      setSelectedProperties([...selectedProperties, property]);
    }
  };

  const PropertyCard = ({ property, isSelected }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative bg-white rounded-2xl overflow-hidden border border-gray-100 hover:border-blue-200 transition-all duration-300"
    >
      <div className="absolute top-4 right-4 z-10">
        <button
          onClick={() => togglePropertySelection(property)}
          className={`p-3 rounded-full ${
            isSelected ? "bg-blue-500" : "bg-white"
          } hover:scale-110 transition-all duration-300 shadow-lg`}
        >
          {isSelected ? (
            <FaCheck className="text-white" size={16} />
          ) : (
            <FaTimes className="text-gray-400" size={16} />
          )}
        </button>
      </div>
      <Swiper
        modules={[Navigation, Pagination]}
        navigation
        pagination={{ clickable: true }}
        className="h-64"
      >
        {property.images.map((image, index) => (
          <SwiperSlide key={index}>
            <img
              src={image}
              alt={property.title}
              className="w-full h-64 object-cover"
            />
          </SwiperSlide>
        ))}
      </Swiper>
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-xl font-bold text-gray-800">{property.title}</h3>
          <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-sm font-medium">
            {property.status}
          </span>
        </div>
        <p className="text-gray-600 mb-4">{property.location.city}</p>
        <div className="flex items-center gap-6 mb-4 text-gray-500">
          <div className="flex items-center gap-2">
            <FaBed />
            <span>{property.bedrooms} beds</span>
          </div>
          <div className="flex items-center gap-2">
            <FaBath />
            <span>{property.bathrooms} baths</span>
          </div>
          <div className="flex items-center gap-2">
            <FaRuler />
            <span>{property.area} sqft</span>
          </div>
        </div>
        <p className="text-2xl font-bold text-blue-600">
          ₹{property.price.toLocaleString()}
        </p>
      </div>
    </motion.div>
  );

  const ComparisonTable = () => (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-800">Comparison Details</h2>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">
            {selectedProperties.length}/3 selected
          </span>
          <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-500 transition-all duration-300"
              style={{ width: `${(selectedProperties.length / 3) * 100}%` }}
            />
          </div>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 border-b">
                Features
              </th>
              {selectedProperties.map((property) => (
                <th
                  key={property._id}
                  className="px-6 py-4 text-left text-sm font-semibold text-gray-600 border-b"
                >
                  {property.title}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[
              "Price",
              "Location",
              "Type",
              "Status",
              "Bedrooms",
              "Bathrooms",
              "Area",
            ].map((feature) => (
              <tr key={feature} className="border-b last:border-b-0">
                <td className="px-6 py-4 text-sm font-medium text-gray-700">
                  {feature}
                </td>
                {selectedProperties.map((property) => (
                  <td
                    key={property._id}
                    className="px-6 py-4 text-sm text-gray-600"
                  >
                    {feature === "Price" &&
                      "₹" + property.price.toLocaleString()}
                    {feature === "Location" && property.location.city}
                    {feature === "Type" && property.propertyType}
                    {feature === "Status" && property.status}
                    {feature === "Bedrooms" && property.bedrooms}
                    {feature === "Bathrooms" && property.bathrooms}
                    {feature === "Area" && `${property.area} sqft`}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin h-12 w-12 border-4 border-blue-500 rounded-full border-t-transparent"></div>
          <p className="text-gray-600">Loading properties...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">
          Compare Your Dream Properties
        </h1>

        <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:w-2/3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {properties.map((property) => (
                <PropertyCard
                  key={property._id}
                  property={property}
                  isSelected={selectedProperties.some(
                    (p) => p._id === property._id
                  )}
                />
              ))}
            </div>
          </div>

          <div className="lg:w-1/3 lg:sticky lg:top-8 self-start">
            {selectedProperties.length > 0 ? (
              <ComparisonTable />
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-white rounded-2xl p-8 text-center shadow-lg"
              >
                <img
                  src="/empty-state.svg"
                  alt="Select properties"
                  className="w-48 mx-auto mb-6"
                />
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  Start Comparing
                </h3>
                <p className="text-gray-600">
                  Select up to 3 properties to compare their features side by
                  side
                </p>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Demo;
