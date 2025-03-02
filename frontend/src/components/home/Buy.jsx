import React, { useEffect, useState } from "react";
import instance from "../../utils/axios";
import { motion } from "framer-motion";
import usePropertyStore from "./../../store/property.store";
import { NavLink } from "react-router-dom";

const Buy = () => {
  const { getAllProperties, loading, property } = usePropertyStore();
  const [displayCount, setDisplayCount] = useState(
    window.innerWidth >= 1024 ? 8 : 4
  );

  useEffect(() => {
    getAllProperties();
  }, []);

  const PropertySkeleton = () => (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="h-48 sm:h-56 bg-gray-200 animate-pulse"></div>
      <div className="p-4">
        <div className="h-8 bg-gray-200 rounded mb-2 animate-pulse"></div>
        <div className="h-6 bg-gray-200 rounded mb-2 w-2/3 animate-pulse"></div>
        <div className="h-6 bg-gray-200 rounded w-1/3 animate-pulse"></div>
      </div>
    </div>
  );

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8" id="property">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="mt-16"
      >
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800">
            Properties for Sale and Rent
          </h1>
        </div>
        <div className="container mx-auto">
          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            {loading
              ? [...Array(displayCount)].map((_, index) => (
                  <PropertySkeleton key={index} />
                ))
              : (property || []).slice(0, displayCount).map((item) => (
                  <motion.div
                    variants={item}
                    className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300"
                    key={item._id}
                  >
                    <NavLink to={`/login`}>
                      <div className="relative h-48 sm:h-56">
                        <img
                          src={item.images[0]}
                          alt={item.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="p-4">
                        <h2 className="text-3xl font-semibold text-gray-800 mb-2 truncate">
                          {item.title}
                        </h2>
                        <p className="text-gray-600 text-xl mb-2 underline">
                          {item.location.city}
                        </p>
                        <div className="flex justify-between items-center mb-2">
                          <p className="text-green-600 font-bold text-xl">
                            ₹{item.price?.toLocaleString()}
                          </p>
                          <p className="text-white text-lg bg-[#091d35] p-2 rounded-md underline">
                            {item.status}
                          </p>
                        </div>
                      </div>
                    </NavLink>
                  </motion.div>
                ))}
          </motion.div>
          {!loading && property.length > displayCount && (
            <div className="text-center mt-6">
              <NavLink
                to={"/login"}
                className="text-xl md:text-2xl border-0 py-2 md:py-3 px-4 md:px-6 rounded-2xl bg-[#FF6500] text-white font-bold mt-4 md:mt-6 duration-300 hover:bg-red-700"
              >
                Explorer
              </NavLink>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default Buy;
