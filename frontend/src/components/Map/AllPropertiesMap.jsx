import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { Link } from "react-router-dom";
import usePropertyStore from "../../store/property.store";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "./map.css";
import { FaBed, FaBath, FaRulerCombined, FaFilter } from "react-icons/fa";
import { MdLocationOn } from "react-icons/md";

// Fix for default marker icon in Leaflet with React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
});

// Custom icons for different property types
const createCustomIcon = (propertyType) => {
  const iconUrl =
    {
      house: "https://cdn-icons-png.flaticon.com/512/619/619034.png",
      apartment: "https://cdn-icons-png.flaticon.com/512/1040/1040993.png",
      condo: "https://cdn-icons-png.flaticon.com/512/3177/3177361.png",
      villa: "https://cdn-icons-png.flaticon.com/512/2286/2286105.png",
    }[propertyType] ||
    "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png";

  return L.icon({
    iconUrl,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  });
};

const AllPropertiesMap = () => {
  const { getAllProperties, property, loading } = usePropertyStore();
  const [mapCenter, setMapCenter] = useState([37.0902, -95.7129]);
  const [zoom, setZoom] = useState(4);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    propertyType: "",
    status: "",
    minPrice: "",
    maxPrice: "",
    bedrooms: "",
  });

  useEffect(() => {
    getAllProperties();
  }, [getAllProperties]);

  // Try to get user's current location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setMapCenter([latitude, longitude]);
          setZoom(10);
        },
        (error) => {
          console.error("Error getting location:", error);
        }
      );
    }
  }, []);

  // Format price with commas
  const formatPrice = (price) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const resetFilters = () => {
    setFilters({
      propertyType: "",
      status: "",
      minPrice: "",
      maxPrice: "",
      bedrooms: "",
    });
  };

  // Filter properties based on selected filters
  const filteredProperties = property.filter((prop) => {
    // Filter by property type
    if (filters.propertyType && prop.propertyType !== filters.propertyType) {
      return false;
    }

    // Filter by status
    if (filters.status && prop.status !== filters.status) {
      return false;
    }

    // Filter by min price
    if (filters.minPrice && prop.price < parseInt(filters.minPrice)) {
      return false;
    }

    // Filter by max price
    if (filters.maxPrice && prop.price > parseInt(filters.maxPrice)) {
      return false;
    }

    // Filter by bedrooms
    if (
      filters.bedrooms &&
      prop.features?.bedrooms < parseInt(filters.bedrooms)
    ) {
      return false;
    }

    return true;
  });

  // Filter properties that have valid coordinates
  const propertiesWithCoordinates = filteredProperties.filter(
    (prop) => prop.location?.latitude && prop.location?.longitude
  );

  const missingCoordinatesCount =
    filteredProperties.length - propertiesWithCoordinates.length;

  return (
    <div className="h-full w-full relative">
      {/* Filter Button */}
      <div className="absolute top-4 right-4 z-10">
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="bg-white p-2 rounded-full shadow-md hover:bg-gray-100 transition-colors"
          title="Filter Properties"
        >
          <FaFilter
            className={`text-xl ${
              showFilters ? "text-blue-600" : "text-gray-700"
            }`}
          />
        </button>
      </div>

      {/* Filter Panel */}
      {showFilters && (
        <div className="absolute top-16 right-4 z-10 bg-white p-4 rounded-lg shadow-lg w-64">
          <h3 className="font-semibold text-lg mb-3">Filter Properties</h3>

          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Property Type
              </label>
              <select
                name="propertyType"
                value={filters.propertyType}
                onChange={handleFilterChange}
                className="w-full p-2 border rounded-md text-sm"
              >
                <option value="">All Types</option>
                <option value="house">House</option>
                <option value="apartment">Apartment</option>
                <option value="condo">Condo</option>
                <option value="villa">Villa</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                name="status"
                value={filters.status}
                onChange={handleFilterChange}
                className="w-full p-2 border rounded-md text-sm"
              >
                <option value="">All</option>
                <option value="for-sale">For Sale</option>
                <option value="for-rent">For Rent</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Min Price
                </label>
                <input
                  type="number"
                  name="minPrice"
                  value={filters.minPrice}
                  onChange={handleFilterChange}
                  placeholder="₹"
                  className="w-full p-2 border rounded-md text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Max Price
                </label>
                <input
                  type="number"
                  name="maxPrice"
                  value={filters.maxPrice}
                  onChange={handleFilterChange}
                  placeholder="₹"
                  className="w-full p-2 border rounded-md text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Bedrooms
              </label>
              <select
                name="bedrooms"
                value={filters.bedrooms}
                onChange={handleFilterChange}
                className="w-full p-2 border rounded-md text-sm"
              >
                <option value="">Any</option>
                <option value="1">1+</option>
                <option value="2">2+</option>
                <option value="3">3+</option>
                <option value="4">4+</option>
                <option value="5">5+</option>
              </select>
            </div>

            <div className="pt-2">
              <button
                onClick={resetFilters}
                className="w-full bg-gray-200 text-gray-800 py-2 rounded-md hover:bg-gray-300 transition-colors text-sm"
              >
                Reset Filters
              </button>
            </div>
          </div>

          <div className="mt-3 text-sm text-gray-600">
            {propertiesWithCoordinates.length} properties found
            {missingCoordinatesCount > 0 && (
              <div className="text-amber-600 mt-1">
                {missingCoordinatesCount} properties not shown (missing
                coordinates)
              </div>
            )}
          </div>
        </div>
      )}

      {/* Properties Count */}
      <div className="absolute bottom-4 left-4 z-10 bg-white px-3 py-2 rounded-lg shadow-md">
        <span className="font-medium">{propertiesWithCoordinates.length}</span>{" "}
        properties on map
        {missingCoordinatesCount > 0 && (
          <div className="text-xs text-amber-600">
            {missingCoordinatesCount} properties not shown (missing coordinates)
          </div>
        )}
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-full">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <MapContainer
          center={mapCenter}
          zoom={zoom}
          style={{ height: "100%", width: "100%" }}
          className="z-0"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {propertiesWithCoordinates.map((prop) => (
            <Marker
              key={prop._id}
              position={[prop.location.latitude, prop.location.longitude]}
              icon={createCustomIcon(prop.propertyType)}
            >
              <Popup className="property-popup" minWidth={250} maxWidth={300}>
                <div className="p-1">
                  {prop.images && prop.images.length > 0 && (
                    <img
                      src={prop.images[0]}
                      alt={prop.title}
                      className="w-full h-32 object-cover rounded-md mb-2"
                    />
                  )}
                  <h3 className="font-semibold text-lg mb-1">{prop.title}</h3>
                  <div className="flex items-center text-gray-600 mb-1">
                    <MdLocationOn className="mr-1" />
                    <span className="text-sm">{prop.location.city}</span>
                  </div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-bold text-blue-600">
                      ₹{formatPrice(prop.price)}
                      {prop.status === "for-rent" && "/month"}
                    </span>
                    <span className="text-xs px-2 py-1 bg-gray-200 rounded-full">
                      {prop.status === "for-sale" ? "For Sale" : "For Rent"}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm mb-2">
                    {prop.features && (
                      <>
                        <div className="flex items-center">
                          <FaBed className="mr-1" />
                          <span>{prop.features.bedrooms} Beds</span>
                        </div>
                        <div className="flex items-center">
                          <FaBath className="mr-1" />
                          <span>{prop.features.bathrooms} Baths</span>
                        </div>
                        <div className="flex items-center">
                          <FaRulerCombined className="mr-1" />
                          <span>{prop.features.squareFeet} sqft</span>
                        </div>
                      </>
                    )}
                  </div>
                  <Link
                    to={`/properties/${prop._id}`}
                    className="block text-center bg-blue-600 text-white py-1 px-3 rounded-md hover:bg-blue-700 transition-colors text-sm mt-2"
                  >
                    View Details
                  </Link>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      )}
    </div>
  );
};

export default AllPropertiesMap;
