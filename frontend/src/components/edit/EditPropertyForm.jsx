import React, { useState, useEffect } from "react";
import { IoCloudUploadOutline } from "react-icons/io5";
import { FaXmark } from "react-icons/fa6";
import usePropertyStore from "../../store/property.store";
import { FaArrowCircleLeft } from "react-icons/fa";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import SyncLoader from "react-spinners/SyncLoader";
import LocationMap from "../upload/LocationMap";

const EditPropertyForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getPropertyInfo, updateProperty, info, infoLoading, updating } =
    usePropertyStore();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    location: {
      address: "",
      city: "",
      state: "",
      zipCode: "",
      latitude: null,
      longitude: null,
    },
    propertyType: "",
    status: "",
    features: {
      bedrooms: "",
      bathrooms: "",
      squareFeet: "",
      parking: false,
      furnished: false,
    },
    isActive: true,
  });

  const [images, setImages] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [keepExistingImages, setKeepExistingImages] = useState(true);
  const [locationSelected, setLocationSelected] = useState(false);

  useEffect(() => {
    // Fetch property data when component mounts
    getPropertyInfo(id);
  }, [id, getPropertyInfo]);

  useEffect(() => {
    // Populate form data when property info is loaded
    if (info && Object.keys(info).length > 0) {
      setFormData({
        title: info.title || "",
        description: info.description || "",
        price: info.price || "",
        location: {
          address: info.location?.address || "",
          city: info.location?.city || "",
          state: info.location?.state || "",
          zipCode: info.location?.zipCode || "",
          latitude: info.location?.latitude || null,
          longitude: info.location?.longitude || null,
        },
        propertyType: info.propertyType || "",
        status: info.status || "",
        features: {
          bedrooms: info.features?.bedrooms || "",
          bathrooms: info.features?.bathrooms || "",
          squareFeet: info.features?.squareFeet || "",
          parking: info.features?.parking || false,
          furnished: info.features?.furnished || false,
        },
        isActive: info.isActive !== undefined ? info.isActive : true,
      });

      if (info.location?.latitude && info.location?.longitude) {
        setLocationSelected(true);
      }

      if (info.images && info.images.length > 0) {
        setExistingImages(info.images);
      }
    }
  }, [info]);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);

    files.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImages((prevImages) => [...prevImages, reader.result]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (indexToRemove) => {
    setImages((prevImages) =>
      prevImages.filter((_, index) => index !== indexToRemove)
    );
  };

  const removeExistingImage = (indexToRemove) => {
    setExistingImages((prevImages) =>
      prevImages.filter((_, index) => index !== indexToRemove)
    );
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setFormData((prev) => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: type === "checkbox" ? checked : value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }));
    }
  };

  const handleLocationSelect = ({ latitude, longitude }) => {
    setFormData((prev) => ({
      ...prev,
      location: {
        ...prev.location,
        latitude,
        longitude,
      },
    }));
    setLocationSelected(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate that location is selected
    if (!formData.location.latitude || !formData.location.longitude) {
      alert("Please select a location on the map");
      return;
    }

    const propertyData = new FormData();

    // Add all form data
    Object.keys(formData).forEach((key) => {
      if (key !== "images") {
        if (typeof formData[key] === "object") {
          propertyData.append(key, JSON.stringify(formData[key]));
        } else {
          propertyData.append(key, formData[key]);
        }
      }
    });

    // Add new images if any
    for (let i = 0; i < images.length; i++) {
      const response = await fetch(images[i]);
      const blob = await response.blob();
      propertyData.append(`images`, blob);
    }

    // If keeping existing images and there are no new images, don't send images
    // If not keeping existing images, send new images (handled above)

    const updatedProperty = await updateProperty(id, propertyData);
    if (updatedProperty) {
      navigate(`/properties/${id}`);
    }
  };

  if (infoLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <SyncLoader color="#3B82F6" />
      </div>
    );
  }

  return (
    <>
      <div className="max-w-6xl mx-auto p-4 mt-24">
        <div className="flex items-center mb-6">
          <NavLink
            to={`/properties/${id}`}
            className="flex items-center text-blue-600 hover:underline"
          >
            <FaArrowCircleLeft className="mr-2" />
            Back to Property
          </NavLink>
          <h1 className="text-3xl font-bold text-center flex-1">
            Edit Property
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">
              Basic Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-700 mb-2">Title</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-2">Price (₹)</label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-gray-700 mb-2">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[100px]"
                  required
                ></textarea>
              </div>
            </div>
          </div>

          {/* Property Details */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">
              Property Details
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-700 mb-2">
                  Property Type
                </label>
                <select
                  name="propertyType"
                  value={formData.propertyType}
                  onChange={handleInputChange}
                  className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Select Type</option>
                  <option value="house">House</option>
                  <option value="apartment">Apartment</option>
                  <option value="condo">Condo</option>
                  <option value="villa">Villa</option>
                </select>
              </div>
              <div>
                <label className="block text-gray-700 mb-2">Status</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Select Status</option>
                  <option value="for-sale">For Sale</option>
                  <option value="for-rent">For Rent</option>
                </select>
              </div>
            </div>
          </div>

          {/* Location */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">
              Location
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-gray-700 mb-2">Address</label>
                <input
                  type="text"
                  name="location.address"
                  value={formData.location.address}
                  onChange={handleInputChange}
                  className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-2">City</label>
                <input
                  type="text"
                  name="location.city"
                  value={formData.location.city}
                  onChange={handleInputChange}
                  className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-2">State</label>
                <input
                  type="text"
                  name="location.state"
                  value={formData.location.state}
                  onChange={handleInputChange}
                  className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-2">Zip Code</label>
                <input
                  type="text"
                  name="location.zipCode"
                  value={formData.location.zipCode}
                  onChange={handleInputChange}
                  className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div className="md:col-span-2 mt-4">
                <label className="block text-gray-700 mb-2">
                  Property Location on Map
                </label>
                <p className="text-sm text-gray-600 mb-3">
                  Click on the map to pinpoint the exact location of your
                  property
                </p>
                <LocationMap onLocationSelect={handleLocationSelect} />
                {locationSelected && (
                  <div className="mt-2 text-sm text-green-600">
                    ✓ Location selected:{" "}
                    {formData.location.latitude?.toFixed(6)},{" "}
                    {formData.location.longitude?.toFixed(6)}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Features */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">
              Features
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-gray-700 mb-2">Bedrooms</label>
                <input
                  type="number"
                  name="features.bedrooms"
                  value={formData.features.bedrooms}
                  onChange={handleInputChange}
                  className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-2">Bathrooms</label>
                <input
                  type="number"
                  name="features.bathrooms"
                  value={formData.features.bathrooms}
                  onChange={handleInputChange}
                  className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-2">Square Feet</label>
                <input
                  type="number"
                  name="features.squareFeet"
                  value={formData.features.squareFeet}
                  onChange={handleInputChange}
                  className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="parking"
                  name="features.parking"
                  checked={formData.features.parking}
                  onChange={handleInputChange}
                  className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                />
                <label htmlFor="parking" className="ml-2 text-gray-700">
                  Parking Available
                </label>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="furnished"
                  name="features.furnished"
                  checked={formData.features.furnished}
                  onChange={handleInputChange}
                  className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                />
                <label htmlFor="furnished" className="ml-2 text-gray-700">
                  Furnished
                </label>
              </div>
            </div>
          </div>

          {/* Images */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Images</h2>

            {/* Existing Images */}
            {existingImages.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-medium mb-3">Current Images</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {existingImages.map((image, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={image}
                        alt={`Property ${index + 1}`}
                        className="w-full h-40 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => removeExistingImage(index)}
                        className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <FaXmark />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* New Images */}
            <div>
              <h3 className="text-lg font-medium mb-3">Add New Images</h3>
              <div className="border-2 border-dashed border-gray-300 p-6 rounded-lg text-center">
                <input
                  type="file"
                  id="images"
                  multiple
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
                <label
                  htmlFor="images"
                  className="flex flex-col items-center justify-center cursor-pointer"
                >
                  <IoCloudUploadOutline className="text-4xl text-gray-400 mb-2" />
                  <span className="text-gray-500">Click to upload images</span>
                </label>
              </div>

              {images.length > 0 && (
                <div className="mt-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {images.map((image, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={image}
                        alt={`New upload ${index + 1}`}
                        className="w-full h-40 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <FaXmark />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={updating}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-300 flex items-center"
            >
              {updating ? (
                <>
                  <SyncLoader color="#ffffff" size={8} margin={4} />
                  <span className="ml-2">Updating...</span>
                </>
              ) : (
                "Update Property"
              )}
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default EditPropertyForm;
