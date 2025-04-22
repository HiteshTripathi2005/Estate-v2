import React, { useEffect, useState } from "react";
import { MdSearch, MdFilterList, MdLock } from "react-icons/md";
import DashboardLayout from "../components/DashboardLayout";
import instance from "../utils/axios";
import toast from "react-hot-toast";
import { useLocation, useNavigate } from "react-router-dom";

// Import the components we created
import UsersList from "../components/users/UsersList";
import FilterPanel from "../components/users/FilterPanel";
import UserDetails from "../components/users/UserDetails";
import UserEdit from "../components/users/UserEdit";
import Pagination from "../components/users/Pagination";
import PasswordResetModal from "../components/users/PasswordResetModal";

const Users = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const userId = queryParams.get("id");

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    status: "",
    role: "",
    sortBy: "createdAt",
    order: "desc",
  });
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalUsers: 0,
    perPage: 10,
  });
  const [selectedUser, setSelectedUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [userProperties, setUserProperties] = useState([]);
  const [loadingProperties, setLoadingProperties] = useState(false);
  const [showPasswordReset, setShowPasswordReset] = useState(false);
  const [resetPasswordEmail, setResetPasswordEmail] = useState("");
  const [resetLoading, setResetLoading] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, [pagination.currentPage, filters]);

  useEffect(() => {
    // If userId is provided in URL, fetch and select that user
    if (userId) {
      fetchUserById(userId);
    }
  }, [userId]);

  const fetchUsers = async () => {
    try {
      setLoading(true);

      // Build query params
      const queryParams = new URLSearchParams({
        page: pagination.currentPage,
        limit: pagination.perPage,
        sortBy: filters.sortBy,
        order: filters.order,
        status: filters.status,
        role: filters.role,
      }).toString();

      const response = await instance.get(`/auth/admin/all?${queryParams}`);

      setUsers(response.data.data || []);
      setPagination({
        ...pagination,
        totalUsers: response.data.totalUsers || 0,
        totalPages: response.data.totalPages || 1,
      });

      setError(null);
    } catch (err) {
      console.error("Error fetching users:", err);
      setError("Failed to fetch users. Please try again later.");
      toast.error("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  const fetchUserById = async (id) => {
    try {
      setLoading(true);
      const response = await instance.get(`/auth/admin/${id}`);
      if (response.data && response.data.data) {
        setSelectedUser(response.data.data);
        fetchUserProperties(id);
      }
    } catch (err) {
      console.error("Error fetching user details:", err);
      toast.error("Failed to fetch user details");
    } finally {
      setLoading(false);
    }
  };

  const fetchUserProperties = async (userId) => {
    try {
      setLoadingProperties(true);
      const response = await instance.get(`/property/admin/user/${userId}`);
      setUserProperties(response.data.data || []);
    } catch (err) {
      console.error("Error fetching user properties:", err);
      toast.error("Failed to fetch user properties");
    } finally {
      setLoadingProperties(false);
    }
  };

  const handlePageChange = (newPage) => {
    setPagination({
      ...pagination,
      currentPage: newPage,
    });
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const applyFilters = () => {
    setPagination({
      ...pagination,
      currentPage: 1, // Reset to first page when filters change
    });
  };

  const resetFilters = () => {
    setFilters({
      status: "",
      role: "",
      sortBy: "createdAt",
      order: "desc",
    });
    setSearchTerm("");
  };

  const handleUserAction = async (userId, action) => {
    try {
      if (action === "delete") {
        if (
          !window.confirm(
            "Are you sure you want to delete this user? This action cannot be undone."
          )
        ) {
          return;
        }

        await instance.delete(`/auth/admin/delete/${userId}`);
        toast.success("User deleted successfully");

        if (selectedUser && selectedUser._id === userId) {
          setSelectedUser(null);
        }

        fetchUsers();
      } else if (action === "block") {
        await instance.put(`/auth/admin/block/${userId}`);
        toast.success("User blocked successfully");

        if (selectedUser && selectedUser._id === userId) {
          setSelectedUser({
            ...selectedUser,
            isActive: false,
          });
        }

        fetchUsers();
      } else if (action === "unblock") {
        await instance.put(`/auth/admin/unblock/${userId}`);
        toast.success("User unblocked successfully");

        if (selectedUser && selectedUser._id === userId) {
          setSelectedUser({
            ...selectedUser,
            isActive: true,
          });
        }

        fetchUsers();
      } else if (action === "verify") {
        await instance.put(`/auth/admin/verify/${userId}`);
        toast.success("User verified successfully");

        if (selectedUser && selectedUser._id === userId) {
          setSelectedUser({
            ...selectedUser,
            isVerified: true,
          });
        }

        fetchUsers();
      }
    } catch (err) {
      console.error(`Error performing ${action} on user:`, err);
      toast.error(`Failed to ${action} user`);
    }
  };

  const openUserDetails = (user) => {
    setSelectedUser(user);
    setIsEditing(false);
    fetchUserProperties(user._id);

    // Update URL to include the user ID
    navigate(`/users?id=${user._id}`, { replace: true });
  };

  const closeUserDetails = () => {
    setSelectedUser(null);
    setIsEditing(false);

    // Remove the user ID from URL
    navigate("/users", { replace: true });
  };

  const toggleEditMode = () => {
    setIsEditing(!isEditing);
  };

  const handleUserUpdate = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData(e.target);
      const userData = {
        fullName: formData.get("fullName"),
        email: formData.get("email"),
        phone: formData.get("phone"),
        address: formData.get("address"),
        city: formData.get("city"),
        state: formData.get("state"),
        isActive: formData.get("isActive") === "true",
        isVerified: formData.get("isVerified") === "true",
      };

      await instance.put(`/auth/admin/update/${selectedUser._id}`, userData);

      toast.success("User updated successfully");
      setIsEditing(false);
      fetchUserById(selectedUser._id);
    } catch (err) {
      console.error("Error updating user:", err);
      toast.error("Failed to update user");
    }
  };

  const handleSendPasswordReset = async () => {
    try {
      setResetLoading(true);
      await instance.post("/admin/send-password-reset", {
        email: resetPasswordEmail,
      });
      toast.success("Password reset email sent successfully");
      setShowPasswordReset(false);
      setResetPasswordEmail("");
    } catch (err) {
      console.error("Error sending password reset:", err);
      toast.error("Failed to send password reset email");
    } finally {
      setResetLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-4 md:mb-0">
            User Management
          </h1>

          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative">
              <input
                type="text"
                placeholder="Search users..."
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
          <FilterPanel
            filters={filters}
            handleFilterChange={handleFilterChange}
            resetFilters={resetFilters}
            applyFilters={applyFilters}
          />
        )}

        {/* Conditionally render different views */}
        {selectedUser ? (
          isEditing ? (
            <UserEdit
              selectedUser={selectedUser}
              setIsEditing={setIsEditing}
              handleUserUpdate={handleUserUpdate}
            />
          ) : (
            <UserDetails
              selectedUser={selectedUser}
              isEditing={isEditing}
              userProperties={userProperties}
              loadingProperties={loadingProperties}
              closeUserDetails={closeUserDetails}
              toggleEditMode={toggleEditMode}
              handleUserAction={handleUserAction}
            />
          )
        ) : (
          <>
            <UsersList
              users={users}
              loading={loading}
              error={error}
              searchTerm={searchTerm}
              fetchUsers={fetchUsers}
              setSearchTerm={setSearchTerm}
              openUserDetails={openUserDetails}
              handleUserAction={handleUserAction}
            />

            {/* Pagination - only show when users list is displayed */}
            {!loading && !error && users.length > 0 && (
              <Pagination
                currentPage={pagination.currentPage}
                totalPages={pagination.totalPages}
                totalItems={pagination.totalUsers}
                perPage={pagination.perPage}
                onPageChange={handlePageChange}
              />
            )}
          </>
        )}
      </div>

      {/* Password Reset Modal */}
      <PasswordResetModal
        showPasswordReset={showPasswordReset}
        resetPasswordEmail={resetPasswordEmail}
        resetLoading={resetLoading}
        setShowPasswordReset={setShowPasswordReset}
        setResetPasswordEmail={setResetPasswordEmail}
        handleSendPasswordReset={handleSendPasswordReset}
      />
    </DashboardLayout>
  );
};

export default Users;
