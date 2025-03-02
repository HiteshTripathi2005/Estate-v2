import React, { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { useAuthStore } from "../store/auth.store";
import { FaArrowCircleLeft } from "react-icons/fa";
import GoogleLoginButton from "../components/common/GoogleLoginButton";

export default function Login() {
  const { fetchingUser, login } = useAuthStore();
  const [formData, setFormData] = useState({});

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    login(formData);
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
            Welcome Back
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-5">
          <div className="space-y-5">
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
                placeholder="Enter your password"
              />
            </div>
          </div>

          <div className="pt-2">
            <button
              disabled={fetchingUser}
              className="w-full flex justify-center py-3.5 px-4 border border-transparent rounded-lg text-sm font-medium text-white bg-slate-700 hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {fetchingUser ? (
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
                  Signing in...
                </span>
              ) : (
                "Sign In"
              )}
            </button>
          </div>
        </form>

        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">
                Or continue with
              </span>
            </div>
          </div>

          <GoogleLoginButton buttonText="Sign in with Google" />
        </div>

        <p className="text-center text-sm text-gray-600 mt-6">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="font-medium text-indigo-600 hover:text-indigo-500"
          >
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
