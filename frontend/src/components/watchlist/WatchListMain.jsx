import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { CiLocationOn } from "react-icons/ci";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import usePropertyStore from "../../store/property.store";
import { MdFavorite } from "react-icons/md";

const WatchListMain = () => {
  const { getWatchList, watchlistedProperties, removeWatchList } =
    usePropertyStore();
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchWatchlist = async () => {
      setIsLoading(true);
      await getWatchList();
      setIsLoading(false);
    };
    fetchWatchlist();
  }, []);

  const handleRemoveFromWatchlist = async (e, propertyId) => {
    e.stopPropagation();
    await removeWatchList(propertyId);
  };

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
      {[1, 2, 3, 4, 5, 6].map((n) => (
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
      className="flex flex-col items-center justify-center py-16 px-4"
    >
      <FaRegHeart className="w-20 h-20 text-gray-300 mb-6" />
      <h3 className="text-2xl font-bold text-gray-800 mb-3">
        No Saved Properties Yet
      </h3>
      <p className="text-gray-600 text-center max-w-md mb-8">
        When you find properties you love, save them here by clicking the heart
        icon. Start exploring your dream properties today!
      </p>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => navigate("/properties")}
        className="px-8 py-3 bg-blue-600 text-white rounded-full font-semibold 
                   hover:bg-blue-700 transition-colors duration-300 shadow-lg 
                   hover:shadow-xl flex items-center gap-2"
      >
        <span>Discover Properties</span>
        <span>→</span>
      </motion.button>
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
            Your Watchlist
          </h1>
        </motion.div>

        {isLoading ? (
          <LoadingSkeleton />
        ) : watchlistedProperties.length === 0 ? (
          <EmptyState />
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {watchlistedProperties.map((item) => (
              <motion.div
                key={item._id}
                variants={itemVariants}
                whileHover={{ y: -8 }}
                className="bg-white rounded-2xl shadow-lg overflow-hidden transform transition-all duration-75 hover:shadow-xl cursor-pointer"
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
                  <div className="absolute top-4 right-4 flex gap-2">
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
                    <button
                      onClick={(e) => handleRemoveFromWatchlist(e, item._id)}
                      className="rounded-full px-[6px] py-[1px] hover:bg-gray-100 transition-colors border-[1px]"
                    >
                      <MdFavorite className="text-red-500 mt-[5px] size-6" />
                    </button>
                  </div>
                  <div className="flex items-center text-gray-600">
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

export default WatchListMain;
