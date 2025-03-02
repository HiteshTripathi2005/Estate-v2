import React from "react";
import { FaBath, FaBed, FaParking, FaRulerCombined } from "react-icons/fa";
import { MdChair } from "react-icons/md";
import { motion } from "framer-motion";

const Features = (props) => {
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
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 py-4 sm:py-6 border-t border-b"
    >
      {[
        {
          icon: <FaBed className="text-xl sm:text-2xl text-blue-500" />,
          label: `${props.info.features?.bedrooms} Beds`,
        },
        {
          icon: <FaBath className="text-xl sm:text-2xl text-blue-500" />,
          label: `${props.info.features?.bathrooms} Baths`,
        },
        {
          icon: (
            <FaRulerCombined className="text-xl sm:text-2xl text-blue-500" />
          ),
          label: `${props.info.features?.squareFeet} sqft`,
        },
        {
          icon: <FaParking className="text-xl sm:text-2xl text-blue-500" />,
          label: props.info.features?.parking ? "Parking" : "No Parking",
        },
        {
          icon: <MdChair className="text-xl sm:text-2xl text-blue-500" />,
          label: props.info.features?.furnished ? "Furnished" : "Unfurnished",
        },
      ].map((feature, index) => (
        <motion.div
          key={index}
          variants={item}
          className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
        >
          {feature.icon}
          <span className="text-sm sm:text-base font-medium">
            {feature.label}
          </span>
        </motion.div>
      ))}
    </motion.div>
  );
};

export default Features;
