import React, { useEffect, useState } from "react";
import {
  MdSearch,
  MdFilterList,
  MdPerson,
  MdHome,
  MdRefresh,
  MdArrowForward,
  MdVisibility,
  MdFavorite,
  MdShoppingCart,
  MdEdit,
  MdDelete,
  MdLogin,
  MdPersonAdd,
  MdSend,
  MdInfo,
} from "react-icons/md";
import DashboardLayout from "../components/DashboardLayout";
import useActivityStore from "../store/useActivity";
import { format } from "date-fns";

const UserActivities = () => {
  const { activities, loading, pagination, getAllActivities } =
    useActivityStore();

  const [filters, setFilters] = useState({
    action: "",
    userId: "",
    startDate: "",
    endDate: "",
  });

  const [showFilters, setShowFilters] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredActivities, setFilteredActivities] = useState([]);

  useEffect(() => {
    getAllActivities(1, 20);
  }, [getAllActivities]);

  useEffect(() => {
    // Filter activities based on search term
    if (searchTerm.trim() === "") {
      setFilteredActivities(activities);
    } else {
      const lowerSearchTerm = searchTerm.toLowerCase();
      setFilteredActivities(
        activities.filter(
          (activity) =>
            // Search in user details
            activity.user?.fullName?.toLowerCase().includes(lowerSearchTerm) ||
            activity.user?.email?.toLowerCase().includes(lowerSearchTerm) ||
            activity.user?._id?.toLowerCase().includes(lowerSearchTerm) ||
            // Search in action
            activity.action?.toLowerCase().includes(lowerSearchTerm) ||
            // Search in property details
            (activity.propertyId &&
              typeof activity.propertyId === "object" &&
              activity.propertyId.title
                ?.toLowerCase()
                .includes(lowerSearchTerm)) ||
            // Search in formatted action
            formatAction(activity.action)
              .toLowerCase()
              .includes(lowerSearchTerm)
        )
      );
    }
  }, [searchTerm, activities]);

  const handlePageChange = (page) => {
    getAllActivities(page, pagination.perPage, filters);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const applyFilters = () => {
    getAllActivities(1, pagination.perPage, filters);
  };

  const resetFilters = () => {
    setFilters({
      action: "",
      userId: "",
      startDate: "",
      endDate: "",
    });
    setSearchTerm("");
    getAllActivities(1, pagination.perPage, {});
  };

  // Function to get appropriate icon for each action type
  const getActionIcon = (action) => {
    switch (action) {
      case "login":
        return <MdLogin className="text-blue-500" />;
      case "register":
        return <MdPersonAdd className="text-green-500" />;
      case "upload_property":
        return <MdHome className="text-purple-500" />;
      case "update_property":
        return <MdEdit className="text-orange-500" />;
      case "delete_property":
        return <MdDelete className="text-red-500" />;
      case "add_to_watchlist":
        return <MdFavorite className="text-pink-500" />;
      case "remove_from_watchlist":
        return <MdFavorite className="text-gray-500" />;
      case "purchase_property":
        return <MdShoppingCart className="text-green-500" />;
      case "view_property":
        return <MdVisibility className="text-blue-500" />;
      case "send_message":
        return <MdSend className="text-blue-500" />;
      default:
        return <MdInfo className="text-gray-500" />;
    }
  };

  // Function to format the action for display
  const formatAction = (action) => {
    return action
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  return (
    <DashboardLayout>
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-4 md:mb-0">
            User Activities
          </h1>

          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative">
              <input
                type="text"
                placeholder="Search activities..."
                className="pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none w-full"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <MdSearch
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={20}
              />
            </div>

            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              <MdFilterList size={20} />
              <span>Filters</span>
            </button>
          </div>
        </div>

        {showFilters && (
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <h2 className="text-lg font-semibold mb-4">Filter Activities</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Action Type
                </label>
                <select
                  name="action"
                  value={filters.action}
                  onChange={handleFilterChange}
                  className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                >
                  <option value="">All Actions</option>
                  <option value="login">Login</option>
                  <option value="register">Register</option>
                  <option value="upload_property">Upload Property</option>
                  <option value="update_property">Update Property</option>
                  <option value="delete_property">Delete Property</option>
                  <option value="add_to_watchlist">Add to Watchlist</option>
                  <option value="remove_from_watchlist">
                    Remove from Watchlist
                  </option>
                  <option value="purchase_property">Purchase Property</option>
                  <option value="view_property">View Property</option>
                  <option value="send_message">Send Message</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  User ID
                </label>
                <input
                  type="text"
                  name="userId"
                  value={filters.userId}
                  onChange={handleFilterChange}
                  placeholder="Enter user ID"
                  className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Start Date
                </label>
                <input
                  type="date"
                  name="startDate"
                  value={filters.startDate}
                  onChange={handleFilterChange}
                  className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  End Date
                </label>
                <input
                  type="date"
                  name="endDate"
                  value={filters.endDate}
                  onChange={handleFilterChange}
                  className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="flex gap-2 mt-4 justify-end">
              <button
                onClick={resetFilters}
                className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Reset
              </button>
              <button
                onClick={applyFilters}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                Apply Filters
              </button>
            </div>
          </div>
        )}

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : filteredActivities.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No activities found</p>
            <button
              onClick={resetFilters}
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2 mx-auto"
            >
              <MdRefresh size={20} />
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Action
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date & Time
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Details
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredActivities.map((activity) => (
                  <tr key={activity._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 relative">
                          {activity.user?.profilePic ? (
                            <img
                              className="h-10 w-10 rounded-full"
                              src={activity.user.profilePic}
                              alt=""
                            />
                          ) : (
                            <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                              <MdPerson className="text-blue-500" size={20} />
                            </div>
                          )}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {activity.user?.fullName || "Unknown User"}
                          </div>
                          <div className="text-sm text-gray-500">
                            {activity.user?.email || "No email"}
                          </div>
                          <div className="text-xs text-gray-400">
                            ID: {activity.user?._id || activity.user}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="mr-2">
                          {getActionIcon(activity.action)}
                        </div>
                        <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                          {formatAction(activity.action)}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {format(
                        new Date(activity.createdAt),
                        "MMM d, yyyy h:mm a"
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">
                        {activity.propertyId ? (
                          <div className="flex items-center">
                            <MdHome className="mr-1 text-blue-500" />
                            <span>
                              {activity.propertyId.title ||
                                `Property ID: ${activity.propertyId}`}
                            </span>
                          </div>
                        ) : (
                          <span>-</span>
                        )}
                      </div>
                      <div className="text-xs text-gray-500">
                        {activity.details &&
                        Object.keys(activity.details).length > 0 ? (
                          <pre className="whitespace-pre-wrap font-sans">
                            {JSON.stringify(activity.details, null, 2)}
                          </pre>
                        ) : (
                          "No additional details"
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {!loading && activities.length > 0 && (
          <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6 mt-4">
            <div className="flex flex-1 justify-between sm:hidden">
              <button
                onClick={() => handlePageChange(pagination.currentPage - 1)}
                disabled={pagination.currentPage === 1}
                className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <button
                onClick={() => handlePageChange(pagination.currentPage + 1)}
                disabled={pagination.currentPage === pagination.totalPages}
                className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
            <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Showing{" "}
                  <span className="font-medium">
                    {filteredActivities.length > 0
                      ? (pagination.currentPage - 1) * pagination.perPage + 1
                      : 0}
                  </span>{" "}
                  to{" "}
                  <span className="font-medium">
                    {Math.min(
                      pagination.currentPage * pagination.perPage,
                      pagination.totalActivities
                    )}
                  </span>{" "}
                  of{" "}
                  <span className="font-medium">
                    {pagination.totalActivities}
                  </span>{" "}
                  results
                </p>
              </div>
              <div>
                <nav
                  className="isolate inline-flex -space-x-px rounded-md shadow-sm"
                  aria-label="Pagination"
                >
                  <button
                    onClick={() => handlePageChange(pagination.currentPage - 1)}
                    disabled={pagination.currentPage === 1}
                    className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span className="sr-only">Previous</span>
                    &larr;
                  </button>

                  {/* Generate pagination buttons */}
                  {[...Array(pagination.totalPages).keys()].map((page) => (
                    <button
                      key={page + 1}
                      onClick={() => handlePageChange(page + 1)}
                      className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ${
                        pagination.currentPage === page + 1
                          ? "bg-blue-500 text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500"
                          : "text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
                      }`}
                    >
                      {page + 1}
                    </button>
                  ))}

                  <button
                    onClick={() => handlePageChange(pagination.currentPage + 1)}
                    disabled={pagination.currentPage === pagination.totalPages}
                    className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span className="sr-only">Next</span>
                    &rarr;
                  </button>
                </nav>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default UserActivities;
