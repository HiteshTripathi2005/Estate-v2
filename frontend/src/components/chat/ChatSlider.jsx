import React, { useState, useMemo } from "react";
import { FaSearch, FaTimes } from "react-icons/fa";
import useMessageStore from "../../store/message.store";
import { motion, AnimatePresence } from "framer-motion";
import { useAuthStore } from "../../store/auth.store";

const ChatSlider = ({ setShowSlider, setSelectedUser }) => {
  const { onlineUsers } = useAuthStore();
  const { sliderUsers, isLoading } = useMessageStore();
  const [search, setSearch] = useState("");

  // Filter users based on search input
  const filteredUsers = useMemo(() => {
    if (!search.trim()) return sliderUsers;

    return sliderUsers.filter(
      (user) =>
        user.friend?.fullName?.toLowerCase().includes(search.toLowerCase()) ||
        user.friend?.email?.toLowerCase().includes(search.toLowerCase())
    );
  }, [sliderUsers, search]);

  const handelClick = (user) => {
    setShowSlider(false);
    setSelectedUser(user);
    setSearch("");
  };

  const LoadingSkeleton = () => (
    <div className="animate-pulse">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="flex items-center p-4 border-b">
          <div className="w-14 h-14 rounded-full bg-gray-200"></div>
          <div className="ml-4 flex-1">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="mt-2 h-3 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <motion.div
      initial={{ x: "-100%", opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: "-100%", opacity: 0 }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 30,
        mass: 1,
      }}
      className="h-screen bg-white w-screen md:w-[350px] lg:w-[400px] shadow-xl fixed md:relative top-24 max-sm:top-20 left-0 z-40 border-r"
    >
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="p-5 border-b flex items-center justify-between bg-white/80 backdrop-blur-sm"
      >
        <h2 className="text-xl font-semibold text-gray-800">Messages</h2>
      </motion.div>

      <motion.div
        initial={{ y: -10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="p-4"
      >
        <div className="relative">
          <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search users..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-12 pr-4 py-3 border rounded-full focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 bg-gray-50 transition-all"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              aria-label="Clear search"
            >
              <FaTimes />
            </button>
          )}
        </div>
      </motion.div>

      <div className="overflow-y-auto h-[calc(100vh-180px)]">
        {isLoading ? (
          <LoadingSkeleton />
        ) : (
          <>
            <AnimatePresence mode="wait">
              {filteredUsers.length > 0 ? (
                <motion.div
                  key="user-list"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  {filteredUsers.map((user, index) => {
                    const isOnline =
                      user.friend && onlineUsers.includes(user.friend._id);
                    return (
                      <motion.div
                        key={user.friend?._id || index}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{
                          delay: index * 0.03,
                          duration: 0.2,
                        }}
                        whileHover={{
                          scale: 0.98,
                          backgroundColor: "rgba(249, 250, 251, 0.8)",
                        }}
                        whileTap={{ scale: 0.95 }}
                        className="flex items-center p-4 border-b hover:bg-gray-50 cursor-pointer"
                        onClick={() => handelClick(user)}
                      >
                        <div className="relative">
                          <img
                            src={
                              user.friend?.profilePic ||
                              "https://via.placeholder.com/50"
                            }
                            alt={user.friend?.fullName || "User"}
                            className="w-14 h-14 rounded-full object-cover border-2 border-gray-100"
                          />
                          <span
                            className={`absolute bottom-0 right-0 w-4 h-4 border-2 border-white rounded-full ${
                              isOnline ? "bg-green-500" : "bg-gray-400"
                            }`}
                          />
                        </div>
                        <div className="ml-4 flex-1">
                          <h3 className="font-semibold text-gray-800">
                            {user.friend?.fullName || "Unknown User"}
                          </h3>
                          <span className="text-sm text-gray-500 flex items-center gap-1">
                            <span
                              className={`w-2 h-2 ${
                                isOnline ? "bg-green-500" : "bg-gray-400"
                              } rounded-full`}
                            ></span>
                            {isOnline ? "Online" : "Offline"}
                          </span>
                        </div>
                      </motion.div>
                    );
                  })}
                </motion.div>
              ) : (
                <motion.div
                  key="empty-state"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="flex flex-col items-center justify-center h-full p-4"
                >
                  <div className="bg-gray-100 rounded-full p-6 mb-4">
                    <FaSearch className="text-gray-400 text-2xl" />
                  </div>
                  <p className="text-gray-700 font-medium text-center mb-1">
                    No users found
                  </p>
                  <p className="text-gray-500 text-sm text-center">
                    {search
                      ? `No results for "${search}"`
                      : "You don't have any conversations yet"}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </>
        )}
      </div>
    </motion.div>
  );
};

export default ChatSlider;
