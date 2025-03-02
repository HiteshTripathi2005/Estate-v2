import React from "react";
import { motion } from "framer-motion";
import PersonalInfo from "../components/profile/PersonalInfo";
import UploadedProperty from "../components/profile/UploadedProperty";
import AuthNavbar from "../components/common/AuthNavbar";

export default function Profile() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <AuthNavbar />
      <motion.div
        className="max-w-6xl mx-auto p-3 sm:p-4 md:p-6 max-sm:mt-15 max-lg:mt-16 mt-12"
        initial={{ y: 20 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <motion.h1
          className="text-2xl sm:text-3xl font-semibold text-center my-5 sm:mt-7 sm:mb-5 underline"
          initial={{ y: -20 }}
          animate={{ y: 0 }}
          transition={{ delay: 0.2 }}
        >
          Profile
        </motion.h1>
        <div className="flex flex-col lg:flex-row gap-4 sm:gap-6 lg:gap-8">
          <PersonalInfo />
          <UploadedProperty />
        </div>
      </motion.div>
    </motion.div>
  );
}
