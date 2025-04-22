import React, { useState, useEffect, useRef, useCallback } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import toast from "react-hot-toast";

// Fix for default marker icon in Leaflet with React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
});

const LocationMarker = ({ position, setPosition }) => {
  const map = useMapEvents({
    click(e) {
      setPosition([e.latlng.lat, e.latlng.lng]);
    },
  });

  return position ? <Marker position={position} /> : null;
};

const LocationMap = ({ onLocationSelect }) => {
  const [position, setPosition] = useState(null);
  const [mapCenter, setMapCenter] = useState([20.5937, 78.9629]); // Default center (India)
  const [zoom, setZoom] = useState(5);
  const mapRef = useRef(null);

  // Use a ref to track if we've already called onLocationSelect for this position
  const positionReported = useRef(false);

  // Handle position changes
  const handlePositionChange = useCallback(
    (newPosition) => {
      setPosition(newPosition);

      // Only report position change if it's new
      if (newPosition && !positionReported.current) {
        onLocationSelect({
          latitude: newPosition[0],
          longitude: newPosition[1],
        });
        positionReported.current = true;
      }
    },
    [onLocationSelect]
  );

  // Try to get user's current location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setMapCenter([latitude, longitude]);
          setZoom(13);
        },
        (error) => {
          // Handle geolocation errors more gracefully
          let errorMessage;

          switch (error.code) {
            case error.PERMISSION_DENIED:
              errorMessage =
                "Location access was denied. Using default map view.";
              break;
            case error.POSITION_UNAVAILABLE:
              errorMessage =
                "Location information is unavailable. Using default map view.";
              break;
            case error.TIMEOUT:
              errorMessage =
                "Location request timed out. Using default map view.";
              break;
            default:
              errorMessage =
                "An unknown error occurred. Using default map view.";
          }

          // Use toast() instead of toast.info()
          toast(errorMessage, {
            duration: 4000,
            position: "bottom-center",
          });

          // Keep default map center and zoom values
          // We already initialized these with default values,
          // so we don't need to do anything here
        },
        // Additional options for geolocation request
        {
          enableHighAccuracy: false, // Using low accuracy is faster and saves battery
          timeout: 10000, // 10 seconds
          maximumAge: 300000, // Cache location data for 5 minutes
        }
      );
    } else {
      // Use toast() instead of toast.info()
      toast(
        "Geolocation is not supported by your browser. Using default map view.",
        {
          duration: 4000,
          position: "bottom-center",
        }
      );
    }
  }, []);

  return (
    <div className="w-full h-96 rounded-lg overflow-hidden border border-gray-300">
      <MapContainer
        center={mapCenter}
        zoom={zoom}
        style={{ height: "100%", width: "100%" }}
        ref={mapRef}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <LocationMarker
          position={position}
          setPosition={handlePositionChange}
        />
      </MapContainer>
      <div className="p-2 text-sm text-gray-600 bg-white bg-opacity-80 rounded-t-md">
        {position
          ? `Selected Location: ${position[0].toFixed(
              6
            )}, ${position[1].toFixed(6)}`
          : "Click on the map to select property location"}
      </div>
    </div>
  );
};

export default LocationMap;
