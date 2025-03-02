import React from "react";
import { motion } from "framer-motion";
import MapContainer from "../Map/MapContainer";
import { MdLocationOn } from "react-icons/md";

const Location = (props) => {
  const { location } = props.info;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-gray-50 p-3 sm:p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow relative"
    >
      <h2 className="text-lg sm:text-xl md:text-2xl font-semibold mb-4 sm:mb-6 text-gray-800 flex items-center gap-2">
        <MdLocationOn className="text-blue-500" />
        Location
      </h2>
      <div className="flex flex-col lg:flex-row gap-4 sm:gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="space-y-3 lg:w-1/3"
        >
          <div className="p-3 sm:p-4 bg-white rounded-lg shadow-sm">
            <p className="text-base sm:text-lg font-medium text-gray-800 mb-2">
              Address
            </p>
            <p className="text-sm sm:text-base text-gray-600">
              {location?.address}
            </p>
            <div className="mt-2 pt-2 border-t">
              <p className="text-sm sm:text-base text-gray-600">
                {location?.city}, {location?.state} {location?.zipCode}
              </p>
            </div>
            {location?.latitude && location?.longitude && (
              <div className="mt-2 pt-2 border-t">
                <p className="text-xs sm:text-sm text-gray-600">
                  Coordinates: {location.latitude.toFixed(6)},{" "}
                  {location.longitude.toFixed(6)}
                </p>
              </div>
            )}
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="lg:w-2/3 h-[250px] sm:h-[300px] lg:h-[400px] rounded-lg overflow-hidden shadow-sm relative"
          style={{ zIndex: 0 }}
        >
          <MapContainer
            latitude={location?.latitude}
            longitude={location?.longitude}
            address={location?.address}
          />
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Location;
