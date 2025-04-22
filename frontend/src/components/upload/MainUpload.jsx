import React, { useState } from "react";
import { IoCloudUploadOutline } from "react-icons/io5";
import { FaXmark } from "react-icons/fa6";
import usePropertyStore from "../../store/property.store";
import { FaArrowCircleLeft } from "react-icons/fa";
import { NavLink } from "react-router-dom";
import LocationMap from "./LocationMap";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";
import {
  FaBed,
  FaBath,
  FaRulerCombined,
  FaMoneyBillWave,
  FaMapMarkerAlt,
  FaHome,
} from "react-icons/fa";
import { TbHomeCheck } from "react-icons/tb";
import {
  MdTitle,
  MdDescription,
  MdOutlineApartment,
  MdLocationCity,
} from "react-icons/md";

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
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [step, setStep] = useState(1);

  // Validation functions
  const validateField = (name, value) => {
    let error = "";

    // Extract field name if nested
    const fieldName = name.includes(".") ? name.split(".")[1] : name;

    switch (fieldName) {
      case "title":
        if (!value.trim()) error = "Property title is required";
        else if (value.length < 5)
          error = "Title should be at least 5 characters";
        else if (value.length > 100)
          error = "Title should not exceed 100 characters";
        break;

      case "description":
        if (!value.trim()) error = "Property description is required";
        else if (value.length < 20)
          error = "Description should be at least 20 characters";
        break;

      case "price":
        if (!value) error = "Price is required";
        else if (isNaN(value) || value <= 0)
          error = "Please enter a valid price";
        break;

      case "propertyType":
        if (!value) error = "Please select a property type";
        break;

      case "status":
        if (!value) error = "Please select a status (For Sale/Rent)";
        break;

      case "bedrooms":
        if (!value) error = "Number of bedrooms is required";
        else if (value < 0) error = "Bedrooms cannot be negative";
        else if (value > 20)
          error = "Please enter a realistic number of bedrooms";
        break;

      case "bathrooms":
        if (!value) error = "Number of bathrooms is required";
        else if (value < 0) error = "Bathrooms cannot be negative";
        else if (value > 20)
          error = "Please enter a realistic number of bathrooms";
        break;

      case "squareFeet":
        if (!value) error = "Square footage is required";
        else if (value < 50) error = "Square footage seems too small";
        else if (value > 50000)
          error = "Please enter a realistic square footage";
        break;

      case "address":
        if (!value.trim()) error = "Property address is required";
        break;

      case "city":
        if (!value.trim()) error = "City is required";
        break;

      case "state":
        if (!value.trim()) error = "State is required";
        break;

      case "zipCode":
        if (!value.trim()) error = "Zip code is required";
        else if (
          !/^\d{6}(-\d{4})?$/.test(value) &&
          !/^[A-Z]\d[A-Z] \d[A-Z]\d$/.test(value)
        ) {
          error = "Please enter a valid zip/postal code";
        }
        break;

      default:
        break;
    }

    return error;
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched({ ...touched, [name]: true });
    const error = validateField(name, value);
    setErrors({ ...errors, [name]: error });
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);

    // Validate number of images
    if (images.length + files.length > 10) {
      toast.error("Maximum 10 images allowed");
      return;
    }

    // Validate file size and type
    for (const file of files) {
      if (file.size > 5 * 1024 * 1024) {
        // 5MB limit
        toast.error(`${file.name} is too large (max 5MB)`);
        return;
      }

      if (!file.type.startsWith("image/")) {
        toast.error(`${file.name} is not a valid image`);
        return;
      }
    }

    files.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImages((prevImages) => [...prevImages, reader.result]);
      };
      reader.readAsDataURL(file);
    });

    setTouched({ ...touched, images: true });
    setErrors({ ...errors, images: "" });
  };

  const removeImage = (indexToRemove) => {
    setImages((prevImages) =>
      prevImages.filter((_, index) => index !== indexToRemove)
    );
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;

    // Update form data
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

    // If field has been touched, validate it
    if (touched[name]) {
      const error = validateField(name, type === "checkbox" ? checked : value);
      setErrors({ ...errors, [name]: error });
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
    setErrors({ ...errors, locationMap: "" });
  };

  const validateStep = (currentStep) => {
    let stepErrors = {};
    let isValid = true;

    switch (currentStep) {
      case 1: // Basic Information
        const basicFields = ["title", "price", "propertyType", "status"];
        basicFields.forEach((field) => {
          const error = validateField(field, formData[field]);
          if (error) {
            stepErrors[field] = error;
            isValid = false;
          }
        });
        break;

      case 2: // Property Details
        const featureFields = [
          "features.bedrooms",
          "features.bathrooms",
          "features.squareFeet",
        ];
        featureFields.forEach((field) => {
          const [parent, child] = field.split(".");
          const error = validateField(field, formData[parent][child]);
          if (error) {
            stepErrors[field] = error;
            isValid = false;
          }
        });

        const descError = validateField("description", formData.description);
        if (descError) {
          stepErrors.description = descError;
          isValid = false;
        }
        break;

      case 3: // Location
        const locationFields = [
          "location.address",
          "location.city",
          "location.state",
          "location.zipCode",
        ];
        locationFields.forEach((field) => {
          const [parent, child] = field.split(".");
          const error = validateField(field, formData[parent][child]);
          if (error) {
            stepErrors[field] = error;
            isValid = false;
          }
        });

        if (!formData.location.latitude || !formData.location.longitude) {
          stepErrors.locationMap = "Please select a location on the map";
          isValid = false;
        }
        break;

      case 4: // Images
        if (images.length === 0) {
          stepErrors.images = "Please upload at least one image";
          isValid = false;
        }
        break;
    }

    setErrors({ ...errors, ...stepErrors });
    return isValid;
  };

  const nextStep = () => {
    if (validateStep(step)) {
      setStep(step + 1);
      window.scrollTo(0, 0);
    } else {
      // Mark all fields in the current step as touched
      const touchFields = {};

      switch (step) {
        case 1:
          ["title", "price", "propertyType", "status"].forEach((field) => {
            touchFields[field] = true;
          });
          break;
        case 2:
          [
            "features.bedrooms",
            "features.bathrooms",
            "features.squareFeet",
            "description",
          ].forEach((field) => {
            touchFields[field] = true;
          });
          break;
        case 3:
          [
            "location.address",
            "location.city",
            "location.state",
            "location.zipCode",
          ].forEach((field) => {
            touchFields[field] = true;
          });
          touchFields.locationMap = true;
          break;
        case 4:
          touchFields.images = true;
          break;
      }

      setTouched({ ...touched, ...touchFields });
    }
  };

  const prevStep = () => {
    setStep(step - 1);
    window.scrollTo(0, 0);
  };

  const validateForm = () => {
    // Validate all steps
    for (let i = 1; i <= 4; i++) {
      if (!validateStep(i)) {
        setStep(i);
        return false;
      }
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

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
    if (images.length === 0) {
      toast.error("Please upload at least one image");
      return;
    }

    try {
      // Add images
      for (let i = 0; i < images.length; i++) {
        const response = await fetch(images[i]);
        const blob = await response.blob();
        propertyData.append(`images`, blob);
      }

      uploadProperty(propertyData);
    } catch (error) {
      toast.error("Failed to upload property");
      console.error(error);
    }
  };

  // Progress bar calculation
  const progress = ((step - 1) / 3) * 100;

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 0.5 },
    },
    exit: {
      opacity: 0,
      transition: { duration: 0.3 },
    },
  };

  // Render form steps
  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="flex items-center mb-4">
              <MdTitle className="text-blue-600 text-2xl mr-3" />
              <h2 className="text-xl font-semibold">Basic Information</h2>
            </div>

            <div className="space-y-4">
              <div>
                <label
                  htmlFor="title"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Property Title
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  placeholder="Enter an attractive title for your property"
                  className={`w-full p-3 border ${
                    errors.title && touched.title
                      ? "border-red-500"
                      : "border-gray-300"
                  } rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all`}
                />
                {errors.title && touched.title && (
                  <p className="mt-1 text-sm text-red-500">{errors.title}</p>
                )}
              </div>

              <div>
                <label
                  htmlFor="price"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Price
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-3 text-gray-500">
                    <FaMoneyBillWave />
                  </span>
                  <input
                    type="number"
                    id="price"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    placeholder="Enter the property price"
                    className={`w-full p-3 pl-10 border ${
                      errors.price && touched.price
                        ? "border-red-500"
                        : "border-gray-300"
                    } rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all`}
                  />
                </div>
                {errors.price && touched.price && (
                  <p className="mt-1 text-sm text-red-500">{errors.price}</p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="propertyType"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Property Type
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-3 text-gray-500">
                      <FaHome />
                    </span>
                    <select
                      id="propertyType"
                      name="propertyType"
                      value={formData.propertyType}
                      onChange={handleInputChange}
                      onBlur={handleBlur}
                      className={`w-full p-3 pl-10 border ${
                        errors.propertyType && touched.propertyType
                          ? "border-red-500"
                          : "border-gray-300"
                      } rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all appearance-none`}
                    >
                      <option value="">Select Property Type</option>
                      <option value="house">House</option>
                      <option value="apartment">Apartment</option>
                      <option value="condo">Condo</option>
                      <option value="villa">Villa</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                      <svg
                        className="w-5 h-5 text-gray-400"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                  </div>
                  {errors.propertyType && touched.propertyType && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.propertyType}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="status"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Listing Status
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-3 text-gray-500">
                      <TbHomeCheck />
                    </span>
                    <select
                      id="status"
                      name="status"
                      value={formData.status}
                      onChange={handleInputChange}
                      onBlur={handleBlur}
                      className={`w-full p-3 pl-10 border ${
                        errors.status && touched.status
                          ? "border-red-500"
                          : "border-gray-300"
                      } rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all appearance-none`}
                    >
                      <option value="">Select Status</option>
                      <option value="for-sale">For Sale</option>
                      <option value="for-rent">For Rent</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                      <svg
                        className="w-5 h-5 text-gray-400"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                  </div>
                  {errors.status && touched.status && (
                    <p className="mt-1 text-sm text-red-500">{errors.status}</p>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        );

      case 2:
        return (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="flex items-center mb-4">
              <MdOutlineApartment className="text-blue-600 text-2xl mr-3" />
              <h2 className="text-xl font-semibold">Property Details</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label
                  htmlFor="features.bedrooms"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Bedrooms
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-3 text-gray-500">
                    <FaBed />
                  </span>
                  <input
                    type="number"
                    id="features.bedrooms"
                    name="features.bedrooms"
                    value={formData.features.bedrooms}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    placeholder="Number of bedrooms"
                    className={`w-full p-3 pl-10 border ${
                      errors["features.bedrooms"] &&
                      touched["features.bedrooms"]
                        ? "border-red-500"
                        : "border-gray-300"
                    } rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all`}
                  />
                </div>
                {errors["features.bedrooms"] &&
                  touched["features.bedrooms"] && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors["features.bedrooms"]}
                    </p>
                  )}
              </div>

              <div>
                <label
                  htmlFor="features.bathrooms"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Bathrooms
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-3 text-gray-500">
                    <FaBath />
                  </span>
                  <input
                    type="number"
                    id="features.bathrooms"
                    name="features.bathrooms"
                    value={formData.features.bathrooms}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    placeholder="Number of bathrooms"
                    className={`w-full p-3 pl-10 border ${
                      errors["features.bathrooms"] &&
                      touched["features.bathrooms"]
                        ? "border-red-500"
                        : "border-gray-300"
                    } rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all`}
                  />
                </div>
                {errors["features.bathrooms"] &&
                  touched["features.bathrooms"] && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors["features.bathrooms"]}
                    </p>
                  )}
              </div>

              <div>
                <label
                  htmlFor="features.squareFeet"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Square Feet
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-3 text-gray-500">
                    <FaRulerCombined />
                  </span>
                  <input
                    type="number"
                    id="features.squareFeet"
                    name="features.squareFeet"
                    value={formData.features.squareFeet}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    placeholder="Property size in sq.ft"
                    className={`w-full p-3 pl-10 border ${
                      errors["features.squareFeet"] &&
                      touched["features.squareFeet"]
                        ? "border-red-500"
                        : "border-gray-300"
                    } rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all`}
                  />
                </div>
                {errors["features.squareFeet"] &&
                  touched["features.squareFeet"] && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors["features.squareFeet"]}
                    </p>
                  )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6 mt-4">
              <label className="flex items-center space-x-2 bg-gray-50 p-3 rounded-lg border border-gray-200 hover:bg-gray-100 transition cursor-pointer">
                <input
                  type="checkbox"
                  name="features.parking"
                  checked={formData.features.parking}
                  onChange={handleInputChange}
                  className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                />
                <span className="text-gray-700 font-medium">
                  Parking Available
                </span>
              </label>

              <label className="flex items-center space-x-2 bg-gray-50 p-3 rounded-lg border border-gray-200 hover:bg-gray-100 transition cursor-pointer">
                <input
                  type="checkbox"
                  name="features.furnished"
                  checked={formData.features.furnished}
                  onChange={handleInputChange}
                  className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                />
                <span className="text-gray-700 font-medium">Furnished</span>
              </label>
            </div>

            <div className="mt-6">
              <label
                htmlFor="description"
                className="flex items-center text-sm font-medium text-gray-700 mb-1"
              >
                <MdDescription className="mr-2" /> Property Description
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                onBlur={handleBlur}
                placeholder="Provide a detailed description of your property"
                rows="5"
                className={`w-full p-3 border ${
                  errors.description && touched.description
                    ? "border-red-500"
                    : "border-gray-300"
                } rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all`}
              ></textarea>
              {errors.description && touched.description && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.description}
                </p>
              )}
              <p className="text-xs text-gray-500 mt-2">
                Tip: Include unique features, renovations, neighborhood
                amenities, and other selling points.
              </p>
            </div>
          </motion.div>
        );

      case 3:
        return (
          <motion.div
            key="step3"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="flex items-center mb-4">
              <FaMapMarkerAlt className="text-blue-600 text-2xl mr-3" />
              <h2 className="text-xl font-semibold">Property Location</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label
                  htmlFor="location.address"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Street Address
                </label>
                <input
                  type="text"
                  id="location.address"
                  name="location.address"
                  value={formData.location.address}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  placeholder="123 Example Street"
                  className={`w-full p-3 border ${
                    errors["location.address"] && touched["location.address"]
                      ? "border-red-500"
                      : "border-gray-300"
                  } rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all`}
                />
                {errors["location.address"] && touched["location.address"] && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors["location.address"]}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="location.city"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  City
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-3 text-gray-500">
                    <MdLocationCity />
                  </span>
                  <input
                    type="text"
                    id="location.city"
                    name="location.city"
                    value={formData.location.city}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    placeholder="City name"
                    className={`w-full p-3 pl-10 border ${
                      errors["location.city"] && touched["location.city"]
                        ? "border-red-500"
                        : "border-gray-300"
                    } rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all`}
                  />
                </div>
                {errors["location.city"] && touched["location.city"] && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors["location.city"]}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="location.state"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  State/Province
                </label>
                <input
                  type="text"
                  id="location.state"
                  name="location.state"
                  value={formData.location.state}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  placeholder="State or Province"
                  className={`w-full p-3 border ${
                    errors["location.state"] && touched["location.state"]
                      ? "border-red-500"
                      : "border-gray-300"
                  } rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all`}
                />
                {errors["location.state"] && touched["location.state"] && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors["location.state"]}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="location.zipCode"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Zip/Postal Code
                </label>
                <input
                  type="text"
                  id="location.zipCode"
                  name="location.zipCode"
                  value={formData.location.zipCode}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  placeholder="Zip or postal code"
                  className={`w-full p-3 border ${
                    errors["location.zipCode"] && touched["location.zipCode"]
                      ? "border-red-500"
                      : "border-gray-300"
                  } rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all`}
                />
                {errors["location.zipCode"] && touched["location.zipCode"] && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors["location.zipCode"]}
                  </p>
                )}
              </div>
            </div>

            <div className="mt-6">
              <h3 className="text-lg font-medium mb-3 flex items-center">
                <FaMapMarkerAlt className="mr-2 text-blue-600" />
                Pin Location on Map
              </h3>
              <div
                className={`border ${
                  errors.locationMap ? "border-red-500" : "border-gray-300"
                } rounded-lg overflow-hidden`}
              >
                <LocationMap onLocationSelect={handleLocationSelect} />
              </div>
              {locationSelected ? (
                <div className="mt-2 text-sm text-green-600 flex items-center">
                  <svg
                    className="w-5 h-5 mr-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    ></path>
                  </svg>
                  Location pinned successfully
                </div>
              ) : (
                errors.locationMap && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.locationMap}
                  </p>
                )
              )}
              <p className="text-xs text-gray-500 mt-2">
                Click on the map to accurately pinpoint your property's
                location.
              </p>
            </div>
          </motion.div>
        );

      case 4:
        return (
          <motion.div
            key="step4"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="flex items-center mb-4">
              <IoCloudUploadOutline className="text-blue-600 text-2xl mr-3" />
              <h2 className="text-xl font-semibold">Upload Property Images</h2>
            </div>

            <div
              className={`border-2 border-dashed ${
                errors.images && touched.images
                  ? "border-red-500"
                  : "border-gray-300"
              } p-8 text-center rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors duration-200`}
            >
              <div className="flex flex-col items-center">
                <IoCloudUploadOutline className="text-5xl text-blue-500 mb-3" />
                <p className="text-gray-600 mb-2 font-medium">
                  Drag and drop your property images here
                </p>
                <p className="text-gray-500 text-sm mb-4">
                  Upload high-quality images to showcase your property (max 10
                  images, 5MB each)
                </p>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                  id="image-upload"
                  onBlur={() => setTouched({ ...touched, images: true })}
                />
                <label
                  htmlFor="image-upload"
                  className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg shadow hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all cursor-pointer"
                >
                  Select Images
                </label>
              </div>
            </div>
            {errors.images && touched.images && (
              <p className="mt-1 text-sm text-red-500">{errors.images}</p>
            )}

            {/* Image Preview Section */}
            {images.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="mt-8"
              >
                <h3 className="text-lg font-medium mb-4 flex items-center">
                  <svg
                    className="w-5 h-5 mr-2 text-green-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    ></path>
                  </svg>
                  Selected Images ({images.length}/10)
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {images.map((img, index) => (
                    <motion.div
                      key={index}
                      className="relative group rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-all"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ scale: 1.03 }}
                    >
                      <img
                        src={img}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-40 object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity"
                        aria-label="Remove image"
                      >
                        <FaXmark />
                      </button>
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-2">
                        <p className="text-white text-xs font-medium">
                          Image {index + 1}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            <div className="mt-8 border-t border-gray-200 pt-6">
              <h3 className="font-medium text-gray-900 mb-3">
                Property Summary
              </h3>
              <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 text-sm text-blue-800">
                <ul className="space-y-1">
                  <li>
                    <strong>Title:</strong> {formData.title || "Not specified"}
                  </li>
                  <li>
                    <strong>Type:</strong>{" "}
                    {formData.propertyType
                      ? formData.propertyType.charAt(0).toUpperCase() +
                        formData.propertyType.slice(1)
                      : "Not specified"}
                  </li>
                  <li>
                    <strong>Status:</strong>{" "}
                    {formData.status === "for-sale"
                      ? "For Sale"
                      : formData.status === "for-rent"
                      ? "For Rent"
                      : "Not specified"}
                  </li>
                  <li>
                    <strong>Price:</strong> $
                    {formData.price
                      ? parseFloat(formData.price).toLocaleString()
                      : "0"}
                  </li>
                  <li>
                    <strong>Size:</strong>{" "}
                    {formData.features.squareFeet
                      ? `${formData.features.squareFeet} sqft`
                      : "Not specified"}
                  </li>
                  <li>
                    <strong>Location:</strong>{" "}
                    {formData.location.city
                      ? `${formData.location.city}, ${formData.location.state}`
                      : "Not specified"}
                  </li>
                </ul>
              </div>
            </div>
          </motion.div>
        );
    }
  };

  return (
    <>
      {uploading === false ? (
        <motion.div
          className="max-w-4xl mx-auto p-6 mt-14 mb-10"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          <div className="flex items-center mb-6">
            <NavLink
              to={"/profile"}
              className="mr-4 text-blue-600 hover:text-blue-800 transition-colors"
            >
              <FaArrowCircleLeft size={24} />
            </NavLink>
            <h1 className="text-3xl font-bold text-gray-900">
              Upload Your Property
            </h1>
          </div>

          {/* Progress bar */}
          <div className="mb-8">
            <div className="flex justify-between mb-1 text-sm">
              <span className="font-medium text-blue-600">
                Step {step} of 4
              </span>
              <span className="text-gray-600">
                {step === 1
                  ? "Basic Information"
                  : step === 2
                  ? "Property Details"
                  : step === 3
                  ? "Location"
                  : "Images"}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div
                className="bg-blue-600 h-2.5 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <div className="flex justify-between mt-2">
              <div
                className={`text-xs font-medium ${
                  step >= 1 ? "text-blue-600" : "text-gray-400"
                }`}
              >
                Info
              </div>
              <div
                className={`text-xs font-medium ${
                  step >= 2 ? "text-blue-600" : "text-gray-400"
                }`}
              >
                Details
              </div>
              <div
                className={`text-xs font-medium ${
                  step >= 3 ? "text-blue-600" : "text-gray-400"
                }`}
              >
                Location
              </div>
              <div
                className={`text-xs font-medium ${
                  step >= 4 ? "text-blue-600" : "text-gray-400"
                }`}
              >
                Images
              </div>
            </div>
          </div>

          {/* Main form content */}
          <div className="bg-white p-8 rounded-xl shadow-lg">
            <form onSubmit={handleSubmit}>
              {renderStep()}

              {/* Navigation buttons */}
              <div className="mt-10 flex justify-between border-t border-gray-100 pt-6">
                {step > 1 ? (
                  <button
                    type="button"
                    onClick={prevStep}
                    className="px-6 py-2.5 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                  >
                    Previous
                  </button>
                ) : (
                  <div></div> // Empty div for spacing
                )}

                {step < 4 ? (
                  <button
                    type="button"
                    onClick={nextStep}
                    className="px-6 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Continue
                  </button>
                ) : (
                  <button
                    type="submit"
                    className="px-8 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 flex items-center space-x-2"
                  >
                    <span>Upload Property</span>
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M14 5l7 7m0 0l-7 7m7-7H3"
                      ></path>
                    </svg>
                  </button>
                )}
              </div>
            </form>
          </div>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center h-[80vh]"
        >
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-6"></div>
          <h1 className="text-2xl font-semibold text-center mb-3">
            Uploading Your Property...
          </h1>
          <p className="text-gray-500">
            Please wait while we process your submission.
          </p>
        </motion.div>
      )}
    </>
  );
};

export default MainUpload;
