import React, { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { useAuthStore } from "../store/auth.store";
import { FaArrowCircleLeft } from "react-icons/fa";
import GoogleLoginButton from "../components/common/GoogleLoginButton";

export default function Register() {
  const { savingUser, register } = useAuthStore();
  const [formData, setFormData] = useState({});
  const [profilePic, setProfilePic] = useState(null);
  const [url, setUrl] = useState(null);

  const sendData = new FormData();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setProfilePic(file);
    const url = URL.createObjectURL(file);
    setUrl(url);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      formData.userName &&
      formData.fullName &&
      formData.email &&
      formData.password &&
      formData.confirmPassword
    ) {
      sendData.append("userName", formData.userName);
      sendData.append("fullName", formData.fullName);
      sendData.append("email", formData.email);
      sendData.append("password", formData.password);
      sendData.append("confirmPassword", formData.confirmPassword);
    }

    if (profilePic) {
      sendData.append("profilePic", profilePic);
    }
    register(sendData);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center p-4 sm:p-6 md:p-8">
      <div className="max-w-[450px] w-full space-y-6 bg-white p-6 sm:p-8 md:p-10 rounded-2xl shadow-xl">
        <div className="relative text-center">
          <NavLink
            to="/"
            className="absolute left-0 top-1/2 -translate-y-1/2 text-xl sm:text-2xl text-slate-700 hover:text-slate-900 transition-colors"
          >
            <FaArrowCircleLeft className="size-6" />
          </NavLink>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-800 tracking-tight">
            Create Account
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-5">
          <div className="flex flex-col items-center gap-2 mb-6">
            <input
              type="file"
              accept="image/*"
              className="hidden"
              id="profilePic"
              onChange={handleImageChange}
            />
            <label
              htmlFor="profilePic"
              className="cursor-pointer flex flex-col items-center"
            >
              <img
                src={
                  url ||
                  "https://images.pexels.com/photos/771742/pexels-photo-771742.jpeg"
                }
                alt="profile"
                className="w-24 h-24 rounded-full object-cover border-4 border-slate-200 hover:border-slate-300 transition-colors"
              />
              <span className="text-sm text-slate-600 mt-2">
                Choose profile picture
              </span>
            </label>
          </div>

          <div className="space-y-5">
            <div>
              <label
                htmlFor="userName"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Username
              </label>
              <input
                type="text"
                id="userName"
                onChange={handleChange}
                className="block w-full px-4 py-3.5 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-slate-500 focus:border-slate-500 transition-all"
                placeholder="Enter your username"
              />
            </div>

            <div>
              <label
                htmlFor="fullName"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Full Name
              </label>
              <input
                type="text"
                id="fullName"
                onChange={handleChange}
                className="block w-full px-4 py-3.5 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-slate-500 focus:border-slate-500 transition-all"
                placeholder="Enter your full name"
              />
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                onChange={handleChange}
                className="block w-full px-4 py-3.5 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-slate-500 focus:border-slate-500 transition-all"
                placeholder="name@example.com"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                onChange={handleChange}
                className="block w-full px-4 py-3.5 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-slate-500 focus:border-slate-500 transition-all"
                placeholder="Create a password"
              />
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Confirm Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                onChange={handleChange}
                className="block w-full px-4 py-3.5 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-slate-500 focus:border-slate-500 transition-all"
                placeholder="Confirm your password"
              />
            </div>
          </div>

          <div className="pt-2">
            <button
              disabled={savingUser}
              className="w-full flex justify-center py-3.5 px-4 border border-transparent rounded-lg text-sm font-medium text-white bg-slate-700 hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {savingUser ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Creating account...
                </span>
              ) : (
                "Sign Up"
              )}
            </button>
          </div>
        </form>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-3 bg-white text-gray-500">
              Or continue with
            </span>
          </div>
        </div>

        <GoogleLoginButton buttonText="Sign up with Google" />

        <p className="text-xs text-center text-gray-500 mt-2">
          When you sign up with Google, we'll use your Google profile picture
          automatically.
        </p>

        <div className="text-center pt-2">
          <p className="text-sm text-gray-600">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-medium text-indigo-600 hover:text-indigo-500"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
