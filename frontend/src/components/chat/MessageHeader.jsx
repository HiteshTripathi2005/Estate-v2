import React from "react";
import { IoMdArrowRoundBack } from "react-icons/io";
import { motion, AnimatePresence } from "framer-motion";
import { useAuthStore } from "../../store/auth.store";

const MessageHeader = ({ setShowSlider, selectedUser, isLoading }) => {
  const { onlineUsers } = useAuthStore();

  const online = onlineUsers.includes(selectedUser?.friend?._id);

  const HeaderSkeleton = () => (
    <div className="flex items-center">
      <div className="w-10 h-10 rounded-full bg-gray-200 animate-pulse"></div>
      <div className="ml-3 flex-1">
        <div className="h-4 bg-gray-200 rounded w-24 mb-2 animate-pulse"></div>
        <div className="h-3 bg-gray-200 rounded w-12 animate-pulse"></div>
      </div>
    </div>
  );

  return (
    <div className="bg-white shadow-sm p-4 flex items-center border-b">
      <button
        onClick={() => setShowSlider(true)}
        className="md:hidden mr-4 w-8 h-8 flex items-center justify-center rounded-full border-0 hover:bg-gray-100"
      >
        <IoMdArrowRoundBack size={20} />
      </button>
      <AnimatePresence mode="wait">
        {isLoading ? (
          <HeaderSkeleton />
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="flex items-center flex-1"
          >
            <img
              src={selectedUser?.friend?.profilePic}
              alt="User"
              className="w-10 h-10 rounded-full object-cover border"
            />
            <div className="ml-3 flex-1">
              <h3 className="font-semibold">
                {selectedUser?.friend?.fullName}
              </h3>
              <p className={online ? "text-green-500" : "text-gray-500"}>
                {online ? "Online" : "Offline"}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MessageHeader;
