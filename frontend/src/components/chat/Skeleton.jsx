import React from "react";
import { motion } from "framer-motion";

const Skeleton = () => {
  return (
    <div className="animate-pulse space-y-6">
      {[...Array(5)].map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: i * 0.1 }}
          className={`flex ${i % 2 === 0 ? "justify-end" : "justify-start"}`}
        >
          <div
            className={`w-fit p-4 shadow-sm ${
              i % 2 === 0
                ? "ml-auto bg-gradient-to-r from-blue-200 to-blue-300 rounded-tl-lg rounded-bl-lg rounded-tr-sm w-[40%]"
                : "mr-auto bg-gradient-to-r from-gray-100 to-gray-200 rounded-tr-lg rounded-br-lg rounded-tl-sm w-[50%]"
            }`}
          >
            <div className="space-y-3">
              <div className="h-5 bg-gray-300/50 rounded-full w-full"></div>
              <div className="h-5 bg-gray-300/50 rounded-full w-[80%]"></div>
              <div className="h-3 bg-gray-300/50 rounded-full w-[30%] mt-4"></div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default Skeleton;
