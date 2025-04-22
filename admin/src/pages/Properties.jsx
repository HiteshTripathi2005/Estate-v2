import React, { useEffect, useState } from "react";
import {
  MdSearch,
  MdFilterList,
  MdRefresh,
  MdHome,
  MdEdit,
  MdDelete,
  MdVisibility,
  MdCheck,
  MdClose,
} from "react-icons/md";
import DashboardLayout from "../components/DashboardLayout";
import instance from "../utils/axios";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";

const Properties = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    status: "",
    category: "",
    minPrice: "",
    maxPrice: "",
    sortBy: "createdAt",
    order: "desc",
  });
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalProperties: 0,
    perPage: 10,
  });
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetchProperties();
  }, [pagination.currentPage, filters]);

  const fetchProperties = async () => {
    try {
      setLoading(true);

      // Build query params
      const queryParams = new URLSearchParams({
        page: pagination.currentPage,
        limit: pagination.perPage,
        sortBy: filters.sortBy,
        order: filters.order,
        status: filters.status,
        category: filters.category,
        minPrice: filters.minPrice,
        maxPrice: filters.maxPrice,
      }).toString();

      const response = await instance.get(`/property/admin/all?${queryParams}`);

      setProperties(response.data.data || []);
      setPagination({
        ...pagination,
        totalProperties: response.data.totalProperties || 0,
        totalPages: response.data.totalPages || 1,
      });

      setError(null);
    } catch (err) {
      console.error("Error fetching properties:", err);
      setError("Failed to fetch properties. Please try again later.");
      toast.error("Failed to fetch properties");
    } finally {
      setLoading(false);
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
      category: "",
      minPrice: "",
      maxPrice: "",
      sortBy: "createdAt",
      order: "desc",
    });
    setSearchTerm("");
  };

  const handlePropertyAction = async (propertyId, action) => {
    try {
      if (
        !window.confirm(
          "Are you sure you want to delete this property? This action cannot be undone."
        )
      ) {
        return;
      }

      await instance.delete(`/property/admin/delete/${propertyId}`);
      toast.success("Property deleted successfully");
      fetchProperties();

      // Close the details modal if it's open
      if (selectedProperty && selectedProperty._id === propertyId) {
        setSelectedProperty(null);
      }
    } catch (err) {
      console.error("Error deleting property:", err);
      toast.error("Failed to delete property");
    }
  };

  const openPropertyDetails = (property) => {
    setSelectedProperty(property);
    setIsEditing(false);
  };

  const closePropertyDetails = () => {
    setSelectedProperty(null);
    setIsEditing(false);
  };

  const toggleEditMode = () => {
    setIsEditing(!isEditing);
  };

  const handlePropertyUpdate = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData(e.target);
      await instance.put(
        `/property/admin/update/${selectedProperty._id}`,
        formData
      );

      toast.success("Property updated successfully");
      setIsEditing(false);
      fetchProperties();
    } catch (err) {
      console.error("Error updating property:", err);
      toast.error("Failed to update property");
    }
  };

  // Filter properties based on search term
  const filteredProperties = properties.filter((property) => {
    if (!searchTerm) return true;

    const lowercaseSearch = searchTerm.toLowerCase();
    return (
      property.title?.toLowerCase().includes(lowercaseSearch) ||
      property.location?.city?.toLowerCase().includes(lowercaseSearch) ||
      property.location?.state?.toLowerCase().includes(lowercaseSearch)
    );
  });

  return (
    <DashboardLayout>
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-4 md:mb-0">
            Property Management
          </h1>

          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative">
              <input
                type="text"
                placeholder="Search properties..."
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
            <h2 className="text-lg font-semibold mb-4">Filter Properties</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  name="status"
                  value={filters.status}
                  onChange={handleFilterChange}
                  className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                >
                  <option value="">All Statuses</option>
                  <option value="available">Available</option>
                  <option value="sold">Sold</option>
                  <option value="pending">Pending</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category
                </label>
                <select
                  name="category"
                  value={filters.category}
                  onChange={handleFilterChange}
                  className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                >
                  <option value="">All Categories</option>
                  <option value="house">House</option>
                  <option value="apartment">Apartment</option>
                  <option value="villa">Villa</option>
                  <option value="commercial">Commercial</option>
                  <option value="land">Land</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Sort By
                </label>
                <select
                  name="sortBy"
                  value={filters.sortBy}
                  onChange={handleFilterChange}
                  className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                >
                  <option value="createdAt">Date Added</option>
                  <option value="price">Price</option>
                  <option value="title">Title</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Order
                </label>
                <select
                  name="order"
                  value={filters.order}
                  onChange={handleFilterChange}
                  className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                >
                  <option value="asc">Ascending</option>
                  <option value="desc">Descending</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Min Price (₹)
                </label>
                <input
                  type="number"
                  name="minPrice"
                  value={filters.minPrice}
                  onChange={handleFilterChange}
                  placeholder="Min Price"
                  className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Max Price (₹)
                </label>
                <input
                  type="number"
                  name="maxPrice"
                  value={filters.maxPrice}
                  onChange={handleFilterChange}
                  placeholder="Max Price"
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
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-red-500 text-lg">{error}</p>
            <button
              onClick={fetchProperties}
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2 mx-auto"
            >
              <MdRefresh size={20} />
              Try Again
            </button>
          </div>
        ) : filteredProperties.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No properties found</p>
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2 mx-auto"
              >
                <MdRefresh size={20} />
                Clear Search
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Property
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Price
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Owner
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Listed On
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredProperties.map((property) => (
                  <tr key={property._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          {property.images && property.images.length > 0 ? (
                            <img
                              className="h-10 w-10 rounded-md object-cover"
                              src={property.images[0]}
                              alt=""
                            />
                          ) : (
                            <div className="h-10 w-10 rounded-md bg-blue-100 flex items-center justify-center">
                              <MdHome className="text-blue-500" size={20} />
                            </div>
                          )}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900 line-clamp-1">
                            {property.title}
                          </div>
                          <div className="text-xs text-gray-500">
                            {property.location?.city},{" "}
                            {property.location?.state}
                          </div>
                          <div className="text-xs text-gray-400">
                            ID: {property._id.substring(0, 10)}...
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-900">
                        ₹{property.price?.toLocaleString()}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          property.status === "available"
                            ? "bg-green-100 text-green-800"
                            : property.status === "sold"
                            ? "bg-red-100 text-red-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {property.status?.charAt(0).toUpperCase() +
                          property.status?.slice(1)}
                      </span>
                      {property.isVerified && (
                        <span className="ml-2 px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                          Verified
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {property.owner?.fullName || "Unknown"}
                      </div>
                      <div className="text-xs text-gray-500">
                        {property.owner?.email}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(property.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() =>
                            handlePropertyAction(property._id, "delete")
                          }
                          className="text-red-600 hover:text-red-900"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {!loading && !error && filteredProperties.length > 0 && (
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
                    {(pagination.currentPage - 1) * pagination.perPage + 1}
                  </span>{" "}
                  to{" "}
                  <span className="font-medium">
                    {Math.min(
                      pagination.currentPage * pagination.perPage,
                      pagination.totalProperties
                    )}
                  </span>{" "}
                  of{" "}
                  <span className="font-medium">
                    {pagination.totalProperties}
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

                  {/* Generate pagination buttons - limit to a reasonable number */}
                  {Array.from({
                    length: Math.min(5, pagination.totalPages),
                  }).map((_, idx) => {
                    // Logic to determine which page numbers to show
                    let pageNumber;
                    if (pagination.totalPages <= 5) {
                      pageNumber = idx + 1;
                    } else if (pagination.currentPage <= 3) {
                      pageNumber = idx + 1;
                    } else if (
                      pagination.currentPage >=
                      pagination.totalPages - 2
                    ) {
                      pageNumber = pagination.totalPages - 4 + idx;
                    } else {
                      pageNumber = pagination.currentPage - 2 + idx;
                    }

                    return (
                      <button
                        key={pageNumber}
                        onClick={() => handlePageChange(pageNumber)}
                        className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ${
                          pagination.currentPage === pageNumber
                            ? "bg-blue-500 text-white  focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500"
                            : "text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
                        }`}
                      >
                        {pageNumber}
                      </button>
                    );
                  })}

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

      {/* Property Details Modal */}
      {selectedProperty && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">
                  {isEditing ? "Edit Property" : "Property Details"}
                </h2>
                <button
                  onClick={closePropertyDetails}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <MdClose size={24} />
                </button>
              </div>

              {isEditing ? (
                <form onSubmit={handlePropertyUpdate}>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Title
                      </label>
                      <input
                        type="text"
                        name="title"
                        defaultValue={selectedProperty.title}
                        className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Description
                      </label>
                      <textarea
                        name="description"
                        defaultValue={selectedProperty.description}
                        rows={4}
                        className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Price (₹)
                        </label>
                        <input
                          type="number"
                          name="price"
                          defaultValue={selectedProperty.price}
                          className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Status
                        </label>
                        <select
                          name="status"
                          defaultValue={selectedProperty.status}
                          className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                          required
                        >
                          <option value="available">Available</option>
                          <option value="sold">Sold</option>
                          <option value="pending">Pending</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Category
                      </label>
                      <select
                        name="category"
                        defaultValue={selectedProperty.category}
                        className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        required
                      >
                        <option value="house">House</option>
                        <option value="apartment">Apartment</option>
                        <option value="villa">Villa</option>
                        <option value="commercial">Commercial</option>
                        <option value="land">Land</option>
                      </select>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          City
                        </label>
                        <input
                          type="text"
                          name="city"
                          defaultValue={selectedProperty.location?.city}
                          className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          State
                        </label>
                        <input
                          type="text"
                          name="state"
                          defaultValue={selectedProperty.location?.state}
                          className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Verified Status
                      </label>
                      <select
                        name="isVerified"
                        defaultValue={
                          selectedProperty.isVerified ? "true" : "false"
                        }
                        className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      >
                        <option value="true">Verified</option>
                        <option value="false">Unverified</option>
                      </select>
                    </div>

                    <div className="flex justify-end space-x-3 pt-4">
                      <button
                        type="button"
                        onClick={() => setIsEditing(false)}
                        className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                      >
                        Save Changes
                      </button>
                    </div>
                  </div>
                </form>
              ) : (
                <div>
                  {/* Property Image Gallery */}
                  {selectedProperty.images &&
                    selectedProperty.images.length > 0 && (
                      <div className="mb-6">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                          {selectedProperty.images
                            .slice(0, 6)
                            .map((image, index) => (
                              <div
                                key={index}
                                className="relative h-40 rounded-lg overflow-hidden"
                              >
                                <img
                                  src={image}
                                  alt={`Property ${index + 1}`}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            ))}
                          {selectedProperty.images.length > 6 && (
                            <div className="relative h-40 bg-gray-100 rounded-lg flex items-center justify-center">
                              <span className="text-gray-600 font-medium">
                                +{selectedProperty.images.length - 6} more
                                images
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                  <div className="mb-6">
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">
                      {selectedProperty.title}
                    </h3>
                    <div className="flex flex-wrap items-center gap-3 mb-4">
                      <span className="text-lg font-bold text-blue-600">
                        ₹{selectedProperty.price?.toLocaleString()}
                      </span>
                      <span
                        className={`px-2 py-1 text-xs font-semibold rounded-full ${
                          selectedProperty.status === "available"
                            ? "bg-green-100 text-green-800"
                            : selectedProperty.status === "sold"
                            ? "bg-red-100 text-red-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {selectedProperty.status?.charAt(0).toUpperCase() +
                          selectedProperty.status?.slice(1)}
                      </span>
                      {selectedProperty.isVerified && (
                        <span className="px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                          Verified
                        </span>
                      )}
                      <span className="px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">
                        {selectedProperty.category?.charAt(0).toUpperCase() +
                          selectedProperty.category?.slice(1)}
                      </span>
                    </div>
                    <p className="text-gray-600 mb-4">
                      {selectedProperty.description}
                    </p>
                    <div className="text-sm text-gray-500">
                      <p>
                        Location: {selectedProperty.location?.address},{" "}
                        {selectedProperty.location?.city},{" "}
                        {selectedProperty.location?.state}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <h4 className="text-lg font-semibold mb-3">Features</h4>
                      <ul className="space-y-2">
                        {selectedProperty.features?.map((feature, idx) => (
                          <li key={idx} className="flex items-center">
                            <MdCheck className="text-green-500 mr-2" />
                            <span className="text-gray-700">{feature}</span>
                          </li>
                        ))}
                        {(!selectedProperty.features ||
                          selectedProperty.features.length === 0) && (
                          <li className="text-gray-500">No features listed</li>
                        )}
                      </ul>
                    </div>

                    <div>
                      <h4 className="text-lg font-semibold mb-3">
                        Owner Information
                      </h4>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="flex items-center mb-3">
                          <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                            <MdPerson className="text-blue-500" size={20} />
                          </div>
                          <div>
                            <p className="font-medium">
                              {selectedProperty.owner?.fullName || "Unknown"}
                            </p>
                            <p className="text-sm text-gray-500">
                              {selectedProperty.owner?.email}
                            </p>
                          </div>
                        </div>
                        <Link
                          to={`/users?id=${selectedProperty.owner?._id}`}
                          className="text-sm text-blue-600 hover:underline"
                        >
                          View Owner Profile
                        </Link>
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-gray-200 pt-4">
                    <h4 className="text-lg font-semibold mb-3">
                      Property Information
                    </h4>
                    <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-3">
                      <div>
                        <dt className="text-sm font-medium text-gray-500">
                          Property ID
                        </dt>
                        <dd className="mt-1 text-sm text-gray-900">
                          {selectedProperty._id}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-gray-500">
                          Listed On
                        </dt>
                        <dd className="mt-1 text-sm text-gray-900">
                          {new Date(
                            selectedProperty.createdAt
                          ).toLocaleDateString()}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-gray-500">
                          Last Updated
                        </dt>
                        <dd className="mt-1 text-sm text-gray-900">
                          {new Date(
                            selectedProperty.updatedAt
                          ).toLocaleDateString()}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-gray-500">
                          Views
                        </dt>
                        <dd className="mt-1 text-sm text-gray-900">
                          {selectedProperty.views || 0}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-gray-500">
                          Watchlist Count
                        </dt>
                        <dd className="mt-1 text-sm text-gray-900">
                          {selectedProperty.watchlistCount || 0}
                        </dd>
                      </div>
                    </dl>
                  </div>

                  <div className="flex justify-end space-x-3 pt-6">
                    <button
                      onClick={() =>
                        handlePropertyAction(selectedProperty._id, "delete")
                      }
                      className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 flex items-center gap-1"
                    >
                      <MdDelete size={18} />
                      Delete Property
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default Properties;
