import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  MdDashboard,
  MdPeople,
  MdLogout,
  MdHome,
  MdAnalytics,
  MdSupervisedUserCircle,
} from "react-icons/md";
import useAdminStore from "../store/useAdmin";

const DashboardLayout = ({ children }) => {
  const navigate = useNavigate();
  const { admin, logout } = useAdminStore();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const navItems = [
    { path: "/", icon: <MdDashboard size={20} />, label: "Dashboard" },
    {
      path: "/activities",
      icon: <MdAnalytics size={20} />,
      label: "User Activities",
    },
    { path: "/users", icon: <MdPeople size={20} />, label: "Users" },
    { path: "/properties", icon: <MdHome size={20} />, label: "Properties" },
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="hidden md:flex flex-col w-64 bg-white shadow-md">
        <div className="p-4 border-b">
          <div className="flex items-center">
            <img src="/vite.svg" alt="Logo" className="h-8 w-8 mr-2" />
            <h1 className="text-xl font-semibold">Estate Admin</h1>
          </div>
        </div>
        <div className="flex-grow flex flex-col justify-between py-4">
          <div className="space-y-1 px-3">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center px-4 py-3 rounded-md transition-colors ${
                    isActive
                      ? "bg-blue-500 text-white"
                      : "text-gray-600 hover:bg-gray-100"
                  }`
                }
                end={item.path === "/"}
              >
                {item.icon}
                <span className="ml-3">{item.label}</span>
              </NavLink>
            ))}
          </div>
          <div className="px-3 mt-auto">
            <button
              onClick={handleLogout}
              className="flex w-full items-center px-4 py-3 text-gray-600 rounded-md hover:bg-gray-100 transition-colors"
            >
              <MdLogout size={20} />
              <span className="ml-3">Logout</span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile sidebar */}
      <div className="md:hidden fixed bottom-0 w-full bg-white shadow-lg border-t z-10">
        <div className="flex justify-around">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex flex-col items-center p-2 ${
                  isActive ? "text-blue-500" : "text-gray-600"
                }`
              }
              end={item.path === "/"}
            >
              {item.icon}
              <span className="text-xs mt-1">{item.label}</span>
            </NavLink>
          ))}
          <button
            onClick={handleLogout}
            className="flex flex-col items-center p-2 text-gray-600"
          >
            <MdLogout size={20} />
            <span className="text-xs mt-1">Logout</span>
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white shadow-sm p-4 flex items-center justify-between">
          <h1 className="text-xl font-semibold">Admin Dashboard</h1>
          {admin && (
            <div className="flex items-center space-x-4">
              <span className="hidden md:inline text-gray-600">
                Welcome, {admin.userName}
              </span>
              <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white">
                {admin.userName.charAt(0).toUpperCase()}
              </div>
            </div>
          )}
        </header>

        {/* Content */}
        <main className="flex-1 overflow-auto p-4">{children}</main>
      </div>
    </div>
  );
};

export default DashboardLayout;
