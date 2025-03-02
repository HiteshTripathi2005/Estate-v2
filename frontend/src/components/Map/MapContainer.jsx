import React, { useEffect } from "react";
import {
  MapContainer as LeafletMap,
  Marker,
  Popup,
  TileLayer,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "./map.css";

// Fix for default marker icon in Leaflet with React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
});

// Create a custom icon with proper popup anchor
const createPropertyIcon = () => {
  return L.icon({
    iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
    iconRetinaUrl:
      "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
    shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  });
};

const MapContainer = ({ latitude, longitude, address }) => {
  // Use provided coordinates or default to Mumbai, India
  const position =
    latitude && longitude ? [latitude, longitude] : [19.054999, 72.8692035];

  // Add CSS to ensure popups are visible
  useEffect(() => {
    // Add a style element to ensure leaflet popups have a high z-index
    const style = document.createElement("style");
    style.innerHTML = `
      .leaflet-popup {
        z-index: 1000 !important;
      }
      .leaflet-popup-content-wrapper {
        z-index: 1001 !important;
      }
      .leaflet-popup-tip {
        z-index: 1001 !important;
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);

  return (
    <div className="h-full w-full relative">
      <LeafletMap
        center={position}
        zoom={15}
        scrollWheelZoom={false}
        style={{ height: "100%", width: "100%" }}
        className="rounded-lg z-0"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={position} icon={createPropertyIcon()}>
          <Popup className="property-popup" autoOpen={true}>
            <div className="font-medium">Property Location</div>
            <div className="text-gray-600">
              {address || "Click to get directions"}
            </div>
          </Popup>
        </Marker>
      </LeafletMap>
    </div>
  );
};

export default MapContainer;
