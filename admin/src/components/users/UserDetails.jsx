import React from "react";
import {
  MdPerson,
  MdEmail,
  MdPhone,
  MdLocationOn,
  MdDelete,
} from "react-icons/md";
import UserProperties from "./UserProperties";

const UserDetails = ({
  selectedUser,
  isEditing,
  userProperties,
  loadingProperties,
  closeUserDetails,
  toggleEditMode,
  handleUserAction,
}) => {
  if (isEditing) {
    return null; // UserEdit component will handle this case
  }

  // Use the isActive flag to determine user's login status
  const isActive = selectedUser.isActive === true;

  return (
    <div className="bg-white p-6 rounded-lg">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <button
            onClick={closeUserDetails}
            className="mr-4 p-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            &larr; Back to Users
          </button>
          <h2 className="text-2xl font-semibold">User Details</h2>
        </div>

        <div className="flex space-x-2">
          <button
            onClick={() => handleUserAction(selectedUser._id, "delete")}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors flex items-center gap-2"
          >
            <MdDelete size={18} />
            Delete
          </button>
        </div>
      </div>

      <div>
        <div className="bg-gray-50 p-4 rounded-lg mb-6">
          <div className="flex flex-col md:flex-row md:items-center">
            <div className="flex-shrink-0 mb-4 md:mb-0 md:mr-6">
              {selectedUser.profilePic ? (
                <img
                  src={selectedUser.profilePic}
                  alt="Profile"
                  className="h-24 w-24 rounded-full object-cover border-4 border-white shadow"
                />
              ) : (
                <div className="h-24 w-24 rounded-full bg-blue-100 flex items-center justify-center border-4 border-white shadow">
                  <MdPerson className="text-blue-500" size={40} />
                </div>
              )}
            </div>

            <div>
              <h3 className="text-xl font-bold text-gray-900">
                {selectedUser.fullName}
              </h3>
              <div className="flex flex-wrap gap-2 my-2">
                <span
                  className={`px-2 py-1 text-xs font-semibold rounded-full ${
                    isActive
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {isActive ? "Active" : "Inactive"}
                </span>

                {selectedUser.isVerified && (
                  <span className="px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                    Verified
                  </span>
                )}

                {selectedUser.role === "premium" && (
                  <span className="px-2 py-1 text-xs font-semibold rounded-full bg-purple-100 text-purple-800">
                    Premium User
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-500">
                Member since{" "}
                {new Date(selectedUser.createdAt).toLocaleDateString()}
              </p>
              {selectedUser.lastLogin && (
                <p className="text-sm text-gray-500 mt-1">
                  Last login:{" "}
                  {new Date(selectedUser.lastLogin).toLocaleString()}
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
          <div>
            <h3 className="text-lg font-semibold mb-3">Contact Information</h3>
            <div className="space-y-3">
              <div className="flex items-start">
                <MdEmail className="text-gray-400 mr-2 mt-1" size={18} />
                <div>
                  <p className="text-sm font-medium text-gray-500">Email</p>
                  <p className="text-sm text-gray-900">{selectedUser.email}</p>
                </div>
              </div>

              <div className="flex items-start">
                <MdPhone className="text-gray-400 mr-2 mt-1" size={18} />
                <div>
                  <p className="text-sm font-medium text-gray-500">Phone</p>
                  <p className="text-sm text-gray-900">
                    {selectedUser.phone || "Not provided"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-3">Address</h3>
            <div className="flex items-start">
              <MdLocationOn className="text-gray-400 mr-2 mt-1" size={18} />
              <div>
                <p className="text-sm text-gray-900">
                  {selectedUser.address ? (
                    <>
                      {selectedUser.address}
                      <br />
                      {selectedUser.city && `${selectedUser.city}, `}
                      {selectedUser.state}
                    </>
                  ) : (
                    "No address provided"
                  )}
                </p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-3">Account Details</h3>
            <dl className="grid grid-cols-2 gap-x-4 gap-y-2">
              <div>
                <dt className="text-sm font-medium text-gray-500">User ID</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {selectedUser._id}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">
                  Last Login
                </dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {selectedUser.lastLogin
                    ? new Date(selectedUser.lastLogin).toLocaleString()
                    : "Never"}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">
                  Email Verified
                </dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {selectedUser.isVerified ? "Yes" : "No"}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Role</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {selectedUser.role?.charAt(0).toUpperCase() +
                    selectedUser.role?.slice(1)}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">
                  Login Status
                </dt>
                <dd className="mt-1 text-sm">
                  <span
                    className={`px-2 py-1 text-xs font-semibold rounded-full ${
                      isActive
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {isActive ? "Online" : "Offline"}
                  </span>
                </dd>
              </div>
            </dl>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-3">Stats</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div className="bg-blue-50 p-3 rounded-lg">
                <p className="text-sm font-medium text-blue-800">Properties</p>
                <p className="text-2xl font-bold text-blue-600">
                  {userProperties?.length || 0}
                </p>
              </div>
              <div className="bg-green-50 p-3 rounded-lg">
                <p className="text-sm font-medium text-green-800">Watchlist</p>
                <p className="text-2xl font-bold text-green-600">
                  {selectedUser.watchlistCount || 0}
                </p>
              </div>
              <div className="bg-purple-50 p-3 rounded-lg">
                <p className="text-sm font-medium text-purple-800">Activity</p>
                <p className="text-2xl font-bold text-purple-600">
                  {selectedUser.activityCount || 0}
                </p>
              </div>
            </div>
          </div>
        </div>

        <UserProperties
          userProperties={userProperties}
          loadingProperties={loadingProperties}
        />
      </div>
    </div>
  );
};

export default UserDetails;
