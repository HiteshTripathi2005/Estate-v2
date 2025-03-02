import React, { useState } from "react";
import { IoCloudUploadOutline } from "react-icons/io5";
import { FaXmark } from "react-icons/fa6";
import usePropertyStore from "../../store/property.store";
import { FaArrowCircleLeft } from "react-icons/fa";
import { NavLink } from "react-router-dom";
import LocationMap from "./LocationMap";

const MainUpload = () => {
  const { uploadProperty, uploading } = usePropertyStore();

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
    images: [],
  });

  const [images, setImages] = useState([]);
  const [locationSelected, setLocationSelected] = useState(false);

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

    // Add images
    for (let i = 0; i < images.length; i++) {
      const response = await fetch(images[i]);
      const blob = await response.blob();
      propertyData.append(`images`, blob);
    }

    uploadProperty(propertyData);
  };

  return (
    <>
      {uploading === false ? (
        <div className="max-w-4xl mx-auto p-6 mt-20">
          <h1 className="text-3xl font-semibold mb-8 text-center">
            Upload Property
          </h1>
          <div className="bg-white p-8 rounded-lg shadow-md">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <NavLink to={"/profile"} className="text-xl">
                  <FaArrowCircleLeft />
                </NavLink>
                <h2 className="text-xl font-medium mb-4">Basic Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <input
                    type="text"
                    name="title"
                    required
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="Property Title"
                    className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="number"
                    name="price"
                    required
                    value={formData.price}
                    onChange={handleInputChange}
                    placeholder="Price"
                    className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <select
                    name="propertyType"
                    required
                    value={formData.propertyType}
                    onChange={handleInputChange}
                    className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Property Type</option>
                    <option value="house">House</option>
                    <option value="apartment">Apartment</option>
                    <option value="condo">Condo</option>
                  </select>
                  <select
                    name="status"
                    required
                    value={formData.status}
                    onChange={handleInputChange}
                    className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">For Sale/Rent</option>
                    <option value="for-sale">For Sale</option>
                    <option value="for-rent">For Rent</option>
                  </select>
                </div>
              </div>

              <div>
                <h2 className="text-xl font-medium mb-4">Property Details</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <input
                    type="number"
                    name="features.bedrooms"
                    required
                    value={formData.features.bedrooms}
                    onChange={handleInputChange}
                    placeholder="Bedrooms"
                    className="w-full p-3 border rounded-md"
                  />
                  <input
                    type="number"
                    name="features.bathrooms"
                    required
                    value={formData.features.bathrooms}
                    onChange={handleInputChange}
                    placeholder="Bathrooms"
                    className="w-full p-3 border rounded-md"
                  />
                  <input
                    type="number"
                    name="features.squareFeet"
                    required
                    value={formData.features.squareFeet}
                    onChange={handleInputChange}
                    placeholder="Square Feet"
                    className="w-full p-3 border rounded-md"
                  />
                </div>
                <div className="grid grid-cols-2 gap-6 mt-4">
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      name="features.parking"
                      required
                      checked={formData.features.parking}
                      onChange={handleInputChange}
                      className="form-checkbox"
                    />
                    <span>Parking Available</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      name="features.furnished"
                      required
                      checked={formData.features.furnished}
                      onChange={handleInputChange}
                      className="form-checkbox"
                    />
                    <span>Furnished</span>
                  </label>
                </div>
              </div>

              <div>
                <h2 className="text-xl font-medium mb-4">Location</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <input
                    type="text"
                    name="location.address"
                    required
                    value={formData.location.address}
                    onChange={handleInputChange}
                    placeholder="Address"
                    className="w-full p-3 border rounded-md"
                  />
                  <input
                    type="text"
                    name="location.city"
                    required
                    value={formData.location.city}
                    onChange={handleInputChange}
                    placeholder="City"
                    className="w-full p-3 border rounded-md"
                  />
                  <input
                    type="text"
                    name="location.state"
                    required
                    value={formData.location.state}
                    onChange={handleInputChange}
                    placeholder="State"
                    className="w-full p-3 border rounded-md"
                  />
                  <input
                    type="text"
                    name="location.zipCode"
                    required
                    value={formData.location.zipCode}
                    onChange={handleInputChange}
                    placeholder="Zip Code"
                    className="w-full p-3 border rounded-md"
                  />
                </div>

                <div className="mt-6">
                  <h3 className="text-lg font-medium mb-3">
                    Select Property Location on Map
                  </h3>
                  <p className="text-sm text-gray-600 mb-3">
                    Click on the map to pinpoint the exact location of your
                    property
                  </p>
                  <LocationMap onLocationSelect={handleLocationSelect} />
                  {locationSelected && (
                    <div className="mt-2 text-sm text-green-600">
                      ✓ Location selected successfully
                    </div>
                  )}
                </div>

                <textarea
                  name="description"
                  required
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Description"
                  rows="4"
                  className="w-full p-3 border rounded-md mt-6"
                ></textarea>
              </div>

              <div>
                <h2 className="text-xl font-medium mb-4">Images</h2>
                <div className="border-2 border-dashed border-gray-300 p-8 text-center rounded-lg">
                  <div className="flex flex-col items-center">
                    <IoCloudUploadOutline className="text-4xl text-gray-400 mb-2" />
                    <p className="text-gray-600 mb-2">
                      Drag and drop your images here
                    </p>
                    <p className="text-gray-400 text-sm">or</p>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                      id="image-upload"
                    />
                    <label
                      htmlFor="image-upload"
                      className="mt-2 px-4 py-2 text-sm text-blue-600 font-medium hover:bg-blue-50 rounded-md cursor-pointer"
                    >
                      Browse Files
                    </label>
                  </div>
                </div>

                {/* Image Preview Section */}
                {images.length > 0 && (
                  <div className="mt-6">
                    <h3 className="text-lg font-medium mb-3">
                      Selected Images
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {images.map((img, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={img}
                            alt={`Preview ${index + 1}`}
                            className="w-full h-32 object-cover rounded-lg"
                          />
                          <button
                            type="button" // Add this line
                            onClick={() => removeImage(index)}
                            className="absolute top-2 right-2 bg-red-500 text-white rounded-full px-[4px] py-[3px] opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <FaXmark />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition-colors"
                >
                  Upload Property
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-[80vh]">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
          <h1 className="text-3xl font-semibold text-center">
            Uploading Property...
          </h1>
        </div>
      )}
    </>
  );
};

export default MainUpload;
