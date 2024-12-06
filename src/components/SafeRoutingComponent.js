import React, { useEffect } from "react";
import { MapContainer, TileLayer, Polyline, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Custom icons for start and end points
const greenIcon = new L.Icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const SafeRoutingComponent = ({ safeRoute = [], regularRoute = [] }) => {
  // Component to adjust the map bounds based on the routes
  const MapBounds = () => {
    const map = useMap();

    useEffect(() => {
      // If there are routes, fit the map to their bounds
      if (safeRoute.length > 0 || regularRoute.length > 0) {
        const bounds = L.latLngBounds([
          ...safeRoute.map((point) => [point.lat, point.lng]),
          ...regularRoute.map((point) => [point.lat, point.lng]),
        ]);
        map.fitBounds(bounds);
      }
    }, [safeRoute, regularRoute, map]);

    return null;
  };

  // Default map center and zoom level (Washington, DC)
  const defaultCenter = [38.8977, -77.0365];
  const defaultZoom = 13;

  // Extract the start and end points from the safe route
  const startPoint = safeRoute.length > 0 ? safeRoute[0] : null;
  const endPoint = safeRoute.length > 0 ? safeRoute[safeRoute.length - 1] : null;

  return (
    <MapContainer center={defaultCenter} zoom={defaultZoom} style={{ height: "600px", width: "100%" }}>
      <TileLayer
        // Use OpenStreetMap tiles for the map
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />

      {/* Adjust map bounds based on the routes */}
      <MapBounds />

      {/* Marker for the starting point */}
      {startPoint && (
        <Marker position={[startPoint.lat, startPoint.lng]} icon={greenIcon}>
          <Popup>Start</Popup>
        </Marker>
      )}

      {/* Marker for the destination point */}
      {endPoint && (
        <Marker position={[endPoint.lat, endPoint.lng]} icon={greenIcon}>
          <Popup>Destination</Popup>
        </Marker>
      )}

      {/* Polyline for the safe route */}
      {safeRoute.length > 0 && (
        <Polyline
          positions={safeRoute.map((point) => [point.lat, point.lng])}
          color="green" // Green for the safe route
          weight={5} // Line thickness
          dashArray="10, 5" // Dashed pattern for distinction
        />
      )}

      {/* Polyline for the regular route */}
      {/* {regularRoute.length > 0 && (
        <Polyline
          positions={regularRoute.map((point) => [point.lat, point.lng])}
          color="red" // Red for the regular route
          weight={4} // Line thickness
          opacity={0.7} // Semi-transparent for visibility
        />
      )} */}

      {/* Default map message */}
      {!safeRoute.length && !regularRoute.length && (
        <div className="default-map-message">
          <p style={{ textAlign: "center", marginTop: "20px" }}>
            Enter a start and destination to find routes.
          </p>
        </div>
      )}
    </MapContainer>
  );
};

export default SafeRoutingComponent;
