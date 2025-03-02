import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { CiLocationOn } from "react-icons/ci";
import usePropertyStore from "../../store/property.store";
import { useNavigate } from "react-router-dom";
import CompareButton from "../properties/CompareButton";

const Main = () => {
  const { getAllProperties, property } = usePropertyStore();
  const [locationFilter, setLocationFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [filteredProperties, setFilteredProperties] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProperties = async () => {
      setIsLoading(true);
      await getAllProperties();
      setIsLoading(false);
    };
    fetchProperties();
  }, []);

  useEffect(() => {
    let filtered = [...property];
    if (locationFilter) {
      filtered = filtered.filter((item) =>
        item.location.city.toLowerCase().includes(locationFilter.toLowerCase())
      );
    }
    if (statusFilter) {
      filtered = filtered.filter((item) => item.status === statusFilter);
    }
    setFilteredProperties(filtered);
  }, [property, locationFilter, statusFilter]);

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  const LoadingSkeleton = () => (
    <div className="animate-pulse grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16].map((n) => (
        <div key={n} className="bg-white rounded-2xl shadow-lg h-[400px]">
          <div className="h-64 bg-gray-200 rounded-t-2xl" />
          <div className="p-6 space-y-3">
            <div className="h-4 bg-gray-200 rounded w-3/4" />
            <div className="h-4 bg-gray-200 rounded w-1/2" />
          </div>
        </div>
      ))}
    </div>
  );

  const EmptyState = () => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="text-center py-16"
    >
      <h3 className="text-xl font-semibold text-gray-700">
        No properties found
      </h3>
      <p className="text-gray-500">Try adjusting your filters</p>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-12 mt-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12 text-center"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-6">
            Featured Properties
          </h1>
          <div className="max-w-3xl mx-auto">
            <div className="flex gap-4 flex-col sm:flex-row">
              <input
                type="text"
                placeholder="Filter by location..."
                value={locationFilter}
                onChange={(e) => setLocationFilter(e.target.value)}
                className="flex-1 p-4 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-all duration-300 shadow-sm"
              />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="flex-1 p-4 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-all duration-300 shadow-sm"
              >
                <option value="">All Properties</option>
                <option value="for-sale">For Sale</option>
                <option value="for-rent">For Rent</option>
              </select>
            </div>
          </div>
        </motion.div>

        {isLoading ? (
          <LoadingSkeleton />
        ) : filteredProperties.length === 0 ? (
          <EmptyState />
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {filteredProperties.map((item) => (
              <motion.div
                key={item._id}
                variants={itemVariants}
                whileHover={{ y: -8 }}
                className="bg-white rounded-2xl shadow-lg overflow-hidden transform transition-all duration-75 hover:shadow-xl"
                onClick={() => navigate(`/properties/${item._id}`)}
              >
                <div className="relative overflow-hidden group">
                  <motion.img
                    initial={{ scale: 1.2 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.5 }}
                    src={item.images[0]}
                    alt={item.title}
                    className="w-full h-64 object-cover transform transition-transform duration-300 group-hover:scale-110"
                  />
                  <div className="absolute top-4 right-4">
                    <span className="px-4 py-2 bg-black/75 text-white rounded-full text-sm font-semibold">
                      {item.status}
                    </span>
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-bold text-gray-900 hover:text-blue-600 transition-colors duration-300">
                      {item.title}
                    </h3>
                    <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-lg text-sm">
                      {item.propertyType}
                    </span>
                  </div>
                  <div className="flex justify-between items-center mb-4">
                    <p className="text-2xl font-bold text-green-600">
                      ₹{item.price.toLocaleString()}
                    </p>
                    <CompareButton property={item} />
                  </div>
                  <div className="flex items-center text-gray-600 mb-4">
                    <CiLocationOn className="w-5 h-5 mr-2" />
                    <p>{item.location.city}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Main;
