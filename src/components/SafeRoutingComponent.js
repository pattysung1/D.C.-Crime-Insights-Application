import React, { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from "react-leaflet";
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

const SafeRoutingComponent = ({ route, isLoading, error }) => {
  // Fit map bounds to the route
  const MapBounds = () => {
    const map = useMap();

    useEffect(() => {
      if (route && route.length > 0) {
        const bounds = L.latLngBounds(route.map((point) => [point.lat, point.lng]));
        map.fitBounds(bounds);
      }
    }, [route, map]);

    return null;
  };

  // Default map center and zoom level
  const defaultCenter = [38.9072, -77.0369]; // Washington, DC
  const defaultZoom = 13;

  return (
    <MapContainer
      center={defaultCenter}
      zoom={defaultZoom}
      style={{ height: "600px", width: "100%" }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />

      {/* Add dynamic map bounds */}
      {route && route.length > 0 && <MapBounds />}

      {/* Route */}
      {route && route.length > 0 && (
        <Polyline
          positions={route.map((point) => [point.lat, point.lng])}
          color="blue"
          weight={4}
          dashArray="5, 10" // Makes the route a dashed line
        />
      )}

      {/* Start Point */}
      {route && route.length > 0 && (
        <Marker position={[route[0].lat, route[0].lng]} icon={greenIcon}>
          <Popup>Start Point</Popup>
        </Marker>
      )}

      {/* End Point */}
      {route && route.length > 0 && (
        <Marker position={[route[route.length - 1].lat, route[route.length - 1].lng]} icon={greenIcon}>
          <Popup>Destination</Popup>
        </Marker>
      )}

      {/* Default map message */}
      {!route && !isLoading && !error && (
        <div className="default-map-message">
          <p style={{ textAlign: "center", marginTop: "20px" }}>
            Enter a start and destination to find a safe route.
          </p>
        </div>
      )}
    </MapContainer>
  );
};

export default SafeRoutingComponent;
