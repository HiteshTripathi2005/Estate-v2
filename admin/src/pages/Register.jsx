import { useState } from "react";
import { Link } from "react-router-dom";
import { FaHome, FaUserPlus } from "react-icons/fa";

const Register = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
    } catch (error) {
      console.error("Registration error:", error);
    } finally {
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <div className="flex flex-col items-center mb-6">
          <div className="bg-green-600 p-3 rounded-full mb-4">
            <FaHome className="text-white text-3xl" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800">
            Admin Registration
          </h1>
          <p className="text-gray-600 mt-2">Create your admin account</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Username"
              className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              id="username"
              value={formData.username}
              onChange={handleChange}
              required
            />
          </div>
          <div className="relative">
            <input
              type="email"
              placeholder="Email"
              className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              id="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="relative">
            <input
              type="password"
              placeholder="Password"
              className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              id="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          <button
            disabled={loading}
            className="bg-green-600 text-white py-3 rounded-lg font-semibold flex items-center justify-center gap-2 hover:bg-green-700 transition duration-200 disabled:bg-green-400"
          >
            {loading ? (
              "Loading..."
            ) : (
              <>
                <FaUserPlus /> Register
              </>
            )}
          </button>
        </form>

        <div className="mt-6 text-center py-3 border-t">
          <p className="text-gray-600">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-green-600 font-medium hover:underline"
            >
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
