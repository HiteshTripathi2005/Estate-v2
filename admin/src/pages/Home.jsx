import React, { useEffect, useState } from "react";
import {
  MdPeople,
  MdHome,
  MdPerson,
  MdShoppingCart,
  MdVisibility,
  MdMessage,
  MdFavorite,
} from "react-icons/md";
import DashboardLayout from "../components/DashboardLayout";
import useActivityStore from "../store/useActivity";
import { format } from "date-fns";
import { Link } from "react-router-dom";

const Home = () => {
  const { activitySummary, loading, getActivitySummary } = useActivityStore();

  useEffect(() => {
    getActivitySummary();
  }, [getActivitySummary]);

  // Format action name for display
  const formatAction = (action) => {
    return action
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  // Get appropriate icon and color for stats cards
  const getIconAndColor = (key) => {
    switch (key) {
      case "totalUsers":
        return { icon: <MdPeople size={24} />, color: "bg-blue-500" };
      case "activeUsers":
        return { icon: <MdPerson size={24} />, color: "bg-green-500" };
      case "purchase_property":
        return { icon: <MdShoppingCart size={24} />, color: "bg-purple-500" };
      case "view_property":
        return { icon: <MdVisibility size={24} />, color: "bg-yellow-500" };
      case "add_to_watchlist":
        return { icon: <MdFavorite size={24} />, color: "bg-pink-500" };
      case "send_message":
        return { icon: <MdMessage size={24} />, color: "bg-indigo-500" };
      default:
        return { icon: <MdPeople size={24} />, color: "bg-gray-500" };
    }
  };

  // Define which stats to show in the top cards
  const mainStats = [
    { key: "totalUsers", label: "Total Users" },
    { key: "activeUsers", label: "Active Users (30d)" },
  ];

  // Function to get key stats from activity counts
  const getActivityStats = () => {
    if (!activitySummary?.activityCounts) return [];

    // Pick the most important activity types to display
    const importantActivities = [
      "purchase_property",
      "view_property",
      "add_to_watchlist",
      "send_message",
    ];

    return importantActivities
      .filter((key) => activitySummary.activityCounts[key])
      .map((key) => ({
        key,
        label: formatAction(key),
        value: activitySummary.activityCounts[key],
      }));
  };

  return (
    <DashboardLayout>
      <div>
        <h1 className="text-2xl font-bold text-gray-800 mb-6">
          Admin Dashboard
        </h1>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {mainStats.map((stat) => {
                const { icon, color } = getIconAndColor(stat.key);
                return (
                  <div
                    key={stat.key}
                    className="bg-white rounded-lg shadow-sm p-6"
                  >
                    <div className="flex items-center">
                      <div
                        className={`${color} p-3 rounded-lg text-white mr-4`}
                      >
                        {icon}
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 font-medium">
                          {stat.label}
                        </p>
                        <p className="text-2xl font-bold text-gray-800">
                          {activitySummary?.[stat.key]?.toLocaleString() || "0"}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}

              {getActivityStats().map((stat) => {
                const { icon, color } = getIconAndColor(stat.key);
                return (
                  <div
                    key={stat.key}
                    className="bg-white rounded-lg shadow-sm p-6"
                  >
                    <div className="flex items-center">
                      <div
                        className={`${color} p-3 rounded-lg text-white mr-4`}
                      >
                        {icon}
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 font-medium">
                          {stat.label}
                        </p>
                        <p className="text-2xl font-bold text-gray-800">
                          {stat.value.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Activities */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-lg font-semibold text-gray-800">
                    Recent Activities
                  </h2>
                  <Link
                    to="/activities"
                    className="text-blue-500 hover:text-blue-700 text-sm font-medium"
                  >
                    View All
                  </Link>
                </div>

                <div className="space-y-4">
                  {activitySummary?.recentActivity?.map((activity) => (
                    <div
                      key={activity._id}
                      className="border-b pb-4 last:border-b-0"
                    >
                      <div className="flex items-start">
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
                        <div className="ml-3 flex-1">
                          <div className="flex justify-between items-baseline">
                            <div>
                              <span className="text-sm font-medium text-gray-900">
                                {activity.user?.fullName || "Unknown User"}
                              </span>
                              <span className="text-sm text-gray-500 ml-2">
                                {activity.user?.email}
                              </span>
                            </div>
                            <span className="text-xs text-gray-500">
                              {format(
                                new Date(activity.createdAt),
                                "MMM d, h:mm a"
                              )}
                            </span>
                          </div>
                          <p className="text-sm text-gray-700 mt-1">
                            <span className="font-semibold">
                              {formatAction(activity.action)}
                            </span>
                            {activity.propertyId && (
                              <span className="ml-1">
                                on property{" "}
                                <span className="font-medium">
                                  {typeof activity.propertyId === "string"
                                    ? activity.propertyId
                                    : activity.propertyId.title ||
                                      activity.propertyId._id}
                                </span>
                              </span>
                            )}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}

                  {(!activitySummary?.recentActivity ||
                    activitySummary.recentActivity.length === 0) && (
                    <div className="text-center py-4">
                      <p className="text-gray-500">No recent activities</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Activity Chart */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-lg font-semibold text-gray-800 mb-6">
                  Activity by Type
                </h2>

                {activitySummary?.activityCounts &&
                Object.keys(activitySummary.activityCounts).length > 0 ? (
                  <div className="space-y-4">
                    {Object.entries(activitySummary.activityCounts)
                      .sort((a, b) => b[1] - a[1]) // Sort by count, descending
                      .map(([action, count]) => (
                        <div key={action} className="flex items-center">
                          <div className="w-36 md:w-48 text-sm text-gray-600">
                            {formatAction(action)}
                          </div>
                          <div className="flex-1 ml-2">
                            <div className="bg-gray-200 rounded-full h-4 overflow-hidden">
                              <div
                                className="bg-blue-500 h-4 rounded-full"
                                style={{
                                  width: `${Math.min(
                                    (count /
                                      Math.max(
                                        ...Object.values(
                                          activitySummary.activityCounts
                                        )
                                      )) *
                                      100,
                                    100
                                  )}%`,
                                }}
                              />
                            </div>
                          </div>
                          <div className="w-12 ml-2 text-sm font-medium text-gray-900 text-right">
                            {count}
                          </div>
                        </div>
                      ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <p className="text-gray-500">No activity data available</p>
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Home;
