import React, { useEffect } from "react";
import { MapContainer, TileLayer, Polyline, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Custom icon for markers
const greenIcon = new L.Icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const SafeRoutingComponent = ({ safeRoute = [], regularRoute = [] }) => {
  const MapBounds = () => {
    const map = useMap();

    useEffect(() => {
      if ((Array.isArray(safeRoute) && safeRoute.length > 0) || (Array.isArray(regularRoute) && regularRoute.length > 0)) {
        const bounds = L.latLngBounds([
          ...(safeRoute || []).map((point) => [point.lat, point.lng]),
          ...(regularRoute || []).map((point) => [point.lat, point.lng]),
        ]);
        map.fitBounds(bounds);
      }
    }, [safeRoute, regularRoute, map]);

    return null;
  };

  const defaultCenter = [38.8977, -77.0365];
  const defaultZoom = 13;

  // Determine start and end points
  const startPoint = Array.isArray(safeRoute) && safeRoute.length > 0 ? safeRoute[0] : null;
  const endPoint = Array.isArray(safeRoute) && safeRoute.length > 0 ? safeRoute[safeRoute.length - 1] : null;

  return (
    <MapContainer center={defaultCenter} zoom={defaultZoom} style={{ height: "600px", width: "100%" }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />

      <MapBounds />

      {/* Marker for Start Point */}
      {startPoint && (
        <Marker position={[startPoint.lat, startPoint.lng]} icon={greenIcon}>
          <Popup>
            <b>Start</b>
            <br />
            Latitude: {startPoint.lat}
            <br />
            Longitude: {startPoint.lng}
          </Popup>
        </Marker>
      )}

      {/* Marker for End Point */}
      {endPoint && (
        <Marker position={[endPoint.lat, endPoint.lng]} icon={greenIcon}>
          <Popup>
            <b>Destination</b>
            <br />
            Latitude: {endPoint.lat}
            <br />
            Longitude: {endPoint.lng}
          </Popup>
        </Marker>
      )}

      {/* Polyline for the Safe Route */}
      {Array.isArray(safeRoute) && safeRoute.length > 0 && (
        <Polyline
          positions={safeRoute.map((point) => [point.lat, point.lng])}
          color="green"
          weight={5}
          dashArray="10, 5"
        />
      )}

      {/* Polyline for the Regular Route */}
      {/* {Array.isArray(regularRoute) && regularRoute.length > 0 && (
        <Polyline
          positions={regularRoute.map((point) => [point.lat, point.lng])}
          color="red"
          weight={4}
          opacity={0.7}
        />
      )} */}

      {/* Default Message */}
      {!Array.isArray(safeRoute) && !Array.isArray(regularRoute) && (
        <div className="default-map-message">
          <p style={{ textAlign: "center", marginTop: "20px", color: "gray" }}>
            Enter a start and destination to find routes.
          </p>
        </div>
      )}
    </MapContainer>
  );
};

export default SafeRoutingComponent;
