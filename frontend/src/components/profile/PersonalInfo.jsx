import React, { useState } from "react";
import { FaCamera } from "react-icons/fa";
import { useAuthStore } from "../../store/auth.store";
import { motion } from "framer-motion";
import { NavLink } from "react-router-dom";

const PersonalInfo = () => {
  const { user, updateUser, updatingUser } = useAuthStore();
  const [formData, setFormData] = useState({});

  const handleSubmit = (e) => {
    e.preventDefault();

    const data = new FormData();
    if (formData.userName) {
      data.append("userName", formData.userName);
    }

    if (formData.avatar) {
      data.append("profilePic", formData.avatar);
    }

    updateUser(data);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="flex-1 bg-white p-4 sm:p-6 rounded-lg shadow-md hover:shadow-lg transition-all"
    >
      <motion.h2
        initial={{ y: -10 }}
        animate={{ y: 0 }}
        className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-6"
      >
        Personal Information
      </motion.h2>
      <motion.form
        initial={{ y: 20 }}
        animate={{ y: 0 }}
        transition={{ delay: 0.2 }}
        className="flex flex-col gap-4"
      >
        <motion.div
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 300 }}
          className="flex flex-col items-center"
        >
          <div className="relative group">
            <img
              src={
                user?.profilePic ||
                "https://images.pexels.com/photos/771742/pexels-photo-771742.jpeg"
              }
              alt="profile"
              className="rounded-full h-24 w-24 sm:h-32 sm:w-32 object-cover cursor-pointer transition-transform hover:scale-105"
            />
            <div className="absolute bottom-0 right-0 pl-[8.5px] pr-[8.5px] pb-[4px] pt-2 bg-white rounded-full shadow-md cursor-pointer hover:bg-slate-50 transition-colors">
              <input
                type="file"
                id="avatar"
                name="profilePic"
                accept="image/png, image/jpeg"
                className="hidden"
                onChange={(e) =>
                  setFormData({ ...formData, avatar: e.target.files[0] })
                }
              />

              <label htmlFor="avatar">
                <FaCamera className="text-slate-700 text-xl" />
              </label>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ x: -20 }}
          animate={{ x: 0 }}
          transition={{ delay: 0.3 }}
          className="flex flex-col gap-2 text-xl max-sm:text-lg"
        >
          <label className="font-semibold text-gray-700">Username</label>
          <input
            type="text"
            placeholder={user.userName}
            onChange={(e) =>
              setFormData({ ...formData, userName: e.target.value })
            }
            className="border p-[6px] rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-600 transition-all text-xl max-sm:text-lg"
          />
        </motion.div>

        <motion.div
          initial={{ x: -20 }}
          animate={{ x: 0 }}
          transition={{ delay: 0.4 }}
          className="flex flex-col gap-2 text-xl max-sm:text-lg"
        >
          <label className="font-semibold text-gray-700">Email</label>
          <input
            type="email"
            placeholder="email"
            value={user.email}
            disabled
            className="border p-[6px] rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-600 transition-all text-xl max-sm:text-lg"
          />
        </motion.div>

        <motion.div
          initial={{ x: -20 }}
          animate={{ x: 0 }}
          transition={{ delay: 0.5 }}
          className="flex flex-col gap-2 text-xl max-sm:text-lg"
        >
          <label className="font-semibold text-gray-700">Join Date</label>
          <input
            type="text"
            placeholder="joined date"
            disabled
            value={new Date(user.createdAt).toDateString()}
            className="border p-[6px] rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-600 transition-all text-xl max-sm:text-lg"
          />
        </motion.div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 hover:bg-slate-800 transition-colors mt-6"
          onClick={handleSubmit}
          disabled={updatingUser}
        >
          {updatingUser ? "Updating..." : "Update"}
        </motion.button>
      </motion.form>

      <div className="flex justify-between mt-6 pt-6 border-t">
        <NavLink to={"/watchlist"}>
          <button className="bg-slate-700 text-base text-white p-1 rounded-lg hover:bg-red-600  font-medium transition-colors">
            Watchlist
          </button>
        </NavLink>
        <button className="bg-slate-700 text-base text-white p-1 rounded-lg hover:bg-red-600  font-medium transition-colors">
          Delete account
        </button>
      </div>
    </motion.div>
  );
};

export default PersonalInfo;
