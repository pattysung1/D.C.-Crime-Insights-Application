// import React, { useEffect } from "react";
// import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from "react-leaflet";
// import L from "leaflet";
// import "leaflet/dist/leaflet.css";

// // Custom icons for start and end points
// const greenIcon = new L.Icon({
//   iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png",
//   iconSize: [25, 41],
//   iconAnchor: [12, 41],
//   popupAnchor: [1, -34],
//   shadowSize: [41, 41],
// });

// const SafeRoutingComponent = ({ route, isLoading, error }) => {
//   // Fit map bounds to the route
//   const MapBounds = () => {
//     const map = useMap();

//     useEffect(() => {
//       if (route && route.length > 0) {
//         const bounds = L.latLngBounds(route.map((point) => [point.lat, point.lng]));
//         map.fitBounds(bounds);
//       }
//     }, [route, map]);

//     return null;
//   };

//   // Default map center and zoom level
//   const defaultCenter = [38.9072, -77.0369]; // Washington, DC
//   const defaultZoom = 13;

//   return (
//     <MapContainer
//       center={defaultCenter}
//       zoom={defaultZoom}
//       style={{ height: "600px", width: "100%" }}
//     >
//       <TileLayer
//         url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//         attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
//       />

//       {/* Add dynamic map bounds */}
//       {route && route.length > 0 && <MapBounds />}

//       {/* Route */}
//       {route && route.length > 0 && (
//         <Polyline
//           positions={route.map((point) => [point.lat, point.lng])}
//           color="blue"
//           weight={4}
//           dashArray="5, 10" // Makes the route a dashed line
//         />
//       )}

//       {/* Start Point */}
//       {route && route.length > 0 && (
//         <Marker position={[route[0].lat, route[0].lng]} icon={greenIcon}>
//           <Popup>Start Point</Popup>
//         </Marker>
//       )}

//       {/* End Point */}
//       {route && route.length > 0 && (
//         <Marker position={[route[route.length - 1].lat, route[route.length - 1].lng]} icon={greenIcon}>
//           <Popup>Destination</Popup>
//         </Marker>
//       )}

//       {/* Default map message */}
//       {!route && !isLoading && !error && (
//         <div className="default-map-message">
//           <p style={{ textAlign: "center", marginTop: "20px" }}>
//             Enter a start and destination to find a safe route.
//           </p>
//         </div>
//       )}
//     </MapContainer>
//   );
// };

// export default SafeRoutingComponent;
// -------------------------------------mmmmm===========================================================================================
// import React, { useEffect } from "react";
// import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from "react-leaflet";
// import L from "leaflet";
// import "leaflet/dist/leaflet.css";

// // Custom icons for start and end points
// const greenIcon = new L.Icon({
//   iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png",
//   iconSize: [25, 41],
//   iconAnchor: [12, 41],
//   popupAnchor: [1, -34],
//   shadowSize: [41, 41],
// });

// const SafeRoutingComponent = ({ safeRoute, regularRoute, isLoading, error }) => {
//   const MapBounds = () => {
//     const map = useMap();

//     useEffect(() => {
//       if ((safeRoute && safeRoute.length > 0) || (regularRoute && regularRoute.length > 0)) {
//         const bounds = L.latLngBounds([
//           ...(safeRoute || []).map((point) => [point.lat, point.lng]),
//           ...(regularRoute || []).map((point) => [point.lat, point.lng]),
//         ]);
//         map.fitBounds(bounds);
//       }
//     }, [safeRoute, regularRoute, map]);

//     return null;
//   };

//   const defaultCenter = [38.9072, -77.0369]; // Washington, DC
//   const defaultZoom = 13;

//   return (
//     <MapContainer center={defaultCenter} zoom={defaultZoom} style={{ height: "600px", width: "100%" }}>
//       <TileLayer
//         url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//         attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
//       />

//       <MapBounds />

//       {/* Safe Route */}
//       {safeRoute && safeRoute.length > 0 && (
//         <Polyline
//           positions={safeRoute.map((point) => [point.lat, point.lng])}
//           color="blue"
//           weight={4}
//           dashArray="5, 10"
//         />
//       )}

//       {/* Regular Route */}
//       {regularRoute && regularRoute.length > 0 && (
//         <Polyline
//           positions={regularRoute.map((point) => [point.lat, point.lng])}
//           color="green"
//           weight={4}
//         />
//       )}

//       {/* Start and End Markers */}
//       {(safeRoute || regularRoute) && (
//         <>
//           <Marker
//             position={[safeRoute?.[0]?.lat || regularRoute?.[0]?.lat, safeRoute?.[0]?.lng || regularRoute?.[0]?.lng]}
//             icon={greenIcon}
//           >
//             <Popup>Start Point</Popup>
//           </Marker>
//           <Marker
//             position={[
//               safeRoute?.[safeRoute.length - 1]?.lat || regularRoute?.[regularRoute.length - 1]?.lat,
//               safeRoute?.[safeRoute.length - 1]?.lng || regularRoute?.[regularRoute.length - 1]?.lng,
//             ]}
//             icon={greenIcon}
//           >
//             <Popup>Destination</Popup>
//           </Marker>
//         </>
//       )}

//       {!safeRoute && !regularRoute && !isLoading && !error && (
//         <div className="default-map-message">
//           <p style={{ textAlign: "center", marginTop: "20px" }}>
//             Enter a start and destination to find routes.
//           </p>
//         </div>
//       )}
//     </MapContainer>
//   );
// };

// export default SafeRoutingComponent;

// =======


















// import React, { useEffect } from "react";
// import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from "react-leaflet";
// import L from "leaflet";
// import "leaflet/dist/leaflet.css";

// // Custom icons for start and end points
// const greenIcon = new L.Icon({
//   iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png",
//   iconSize: [25, 41],
//   iconAnchor: [12, 41],
//   popupAnchor: [1, -34],
//   shadowSize: [41, 41],
// });

// const SafeRoutingComponent = ({ safeRoute, regularRoute, regularRouteColor, isLoading, error }) => {
//   const MapBounds = () => {
//     const map = useMap();

//     useEffect(() => {
//       if ((safeRoute && safeRoute.length > 0) || (regularRoute && regularRoute.length > 0)) {
//         const bounds = L.latLngBounds([
//           ...(safeRoute || []).map((point) => [point.lat, point.lng]),
//           ...(regularRoute || []).map((point) => [point.lat, point.lng]),
//         ]);
//         map.fitBounds(bounds);
//       }
//     }, [safeRoute, regularRoute, map]);

//     return null;
//   };

//   const defaultCenter = [38.9072, -77.0369]; // Washington, DC
//   const defaultZoom = 13;

//   return (
//     <MapContainer center={defaultCenter} zoom={defaultZoom} style={{ height: "600px", width: "100%" }}>
//       <TileLayer
//         url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//         attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
//       />

//       <MapBounds />

//       {/* Safe Route */}
//       {safeRoute && safeRoute.length > 0 && (
//         <Polyline
//           positions={safeRoute.map((point) => [point.lat, point.lng])}
//           color="blue"
//           weight={4}
//           dashArray="5, 10"
//         />
//       )}

//       {/* Regular Route */}
//       {regularRoute && regularRoute.length > 0 && (
//         <Polyline
//           positions={regularRoute.map((point) => [point.lat, point.lng])}
//           color={regularRouteColor || "red"} // Use dynamic color from backend or fallback to red
//           weight={4}
//         />
//       )}

//       {/* Start and End Markers */}
//       {(safeRoute || regularRoute) && (
//         <>
//           <Marker
//             position={[safeRoute?.[0]?.lat || regularRoute?.[0]?.lat, safeRoute?.[0]?.lng || regularRoute?.[0]?.lng]}
//             icon={greenIcon}
//           >
//             <Popup>Start Point</Popup>
//           </Marker>
//           <Marker
//             position={[
//               safeRoute?.[safeRoute.length - 1]?.lat || regularRoute?.[regularRoute.length - 1]?.lat,
//               safeRoute?.[safeRoute.length - 1]?.lng || regularRoute?.[regularRoute.length - 1]?.lng,
//             ]}
//             icon={greenIcon}
//           >
//             <Popup>Destination</Popup>
//           </Marker>
//         </>
//       )}

//       {!safeRoute && !regularRoute && !isLoading && !error && (
//         <div className="default-map-message">
//           <p style={{ textAlign: "center", marginTop: "20px" }}>
//             Enter a start and destination to find routes.
//           </p>
//         </div>
//       )}
//     </MapContainer>
//   );
// };

// export default SafeRoutingComponent;



// ===

// import React, { useEffect } from "react";
// import { MapContainer, TileLayer, Polyline, useMap } from "react-leaflet";
// import "leaflet/dist/leaflet.css";

// const SafeRoutingComponent = ({ safeRoute, regularRoute }) => {
//   const MapBounds = () => {
//     const map = useMap();

//     useEffect(() => {
//       if ((safeRoute && safeRoute.length > 0) || (regularRoute && regularRoute.length > 0)) {
//         const bounds = L.latLngBounds([
//           ...(safeRoute || []).map((point) => [point.lat, point.lng]),
//           ...(regularRoute || []).map((point) => [point.lat, point.lng]),
//         ]);
//         map.fitBounds(bounds);
//       }
//     }, [safeRoute, regularRoute, map]);

//     return null;
//   };

//   const defaultCenter = [38.8977, -77.0365]; // Center map on Washington, DC
//   const defaultZoom = 13;

//   return (
//     <MapContainer center={defaultCenter} zoom={defaultZoom} style={{ height: "600px", width: "100%" }}>
//       <TileLayer
//         url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//         attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
//       />

//       <MapBounds />

//       {/* Render Safe Route */}
//       {/* {safeRoute && safeRoute.length > 0 && (
//         <Polyline
//           positions={safeRoute.map((point) => [point.lat, point.lng])}
//           color="green" // Safe route in green
//           weight={4}
//           dashArray="10, 5" // Dashed line for distinction
//         />
//       )} */}
//       {safeRoute && safeRoute.length > 0 && (
//         <Polyline
//           positions={safeRoute.map((point) => [point.lat, point.lng])}
//           color="green" // Safe route in green
//           weight={4}
//           dashArray="10, 5" // Dashed line for distinction
//         />
//       )}

//       {/* Render Regular Route
//       {regularRoute && regularRoute.length > 0 && (
//         <Polyline
//           positions={regularRoute.map((point) => [point.lat, point.lng])}
//           color="red" // Regular route in red
//           weight={4}
//         />
//       )} */}
//       {regularRoute && regularRoute.length > 0 && (
//         <Polyline
//           positions={regularRoute.map((point) => [point.lat, point.lng])}
//           color="red" // Regular route in red
//           weight={4}
//           opacity={0.7} // Add transparency
//         />
//       )}
//     </MapContainer>
//   );
// };

// export default SafeRoutingComponent;


// import React, { useEffect } from "react";
// import { MapContainer, TileLayer, Polyline, useMap } from "react-leaflet";
// import "leaflet/dist/leaflet.css";

// const SafeRoutingComponent = ({ safeRoute }) => {
//   const MapBounds = () => {
//     const map = useMap();

//     useEffect(() => {
//       if (safeRoute && safeRoute.length > 0) {
//         const bounds = L.latLngBounds(safeRoute.map((point) => [point.lat, point.lng]));
//         map.fitBounds(bounds);
//       }
//     }, [safeRoute, map]);

//     return null;
//   };

//   const defaultCenter = [38.8977, -77.0365]; // Center map on Washington, DC
//   const defaultZoom = 13;

//   return (
//     <MapContainer center={defaultCenter} zoom={defaultZoom} style={{ height: "600px", width: "100%" }}>
//       <TileLayer
//         url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//         attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
//       />

//       <MapBounds />

//       {/* Render Only Safe Route */}
//       {safeRoute && safeRoute.length > 0 && (
//         <Polyline
//           positions={safeRoute.map((point) => [point.lat, point.lng])}
//           color="green" // Safe route in green
//           weight={5}
//           dashArray="10, 5" // Dashed pattern for distinction
//         />
//       )}
//     </MapContainer>
//   );
// };

// export default SafeRoutingComponent;

import React, { useEffect } from "react";
import { MapContainer, TileLayer, Polyline, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";

const SafeRoutingComponent = ({ safeRoute, regularRoute }) => {
  const MapBounds = () => {
    const map = useMap();

    useEffect(() => {
      if ((safeRoute && safeRoute.length > 0) || (regularRoute && regularRoute.length > 0)) {
        const bounds = L.latLngBounds([
          ...(safeRoute || []).map((point) => [point.lat, point.lng]),
          ...(regularRoute || []).map((point) => [point.lat, point.lng]),
        ]);
        map.fitBounds(bounds);
      }
    }, [safeRoute, regularRoute, map]);

    return null;
  };

  const defaultCenter = [38.8977, -77.0365]; // Center map on Washington, DC
  const defaultZoom = 13;

  return (
    <MapContainer center={defaultCenter} zoom={defaultZoom} style={{ height: "600px", width: "100%" }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />

      <MapBounds />

      {/* Safe Route */}
      {safeRoute && safeRoute.length > 0 && (
        <Polyline
          positions={safeRoute.map((point) => [point.lat, point.lng])}
          color="green" // Safe route in green
          weight={5}
          dashArray="10, 5" // Dashed pattern for distinction
        />
      )}

      {/* Regular Route */}
      {regularRoute && regularRoute.length > 0 && (
        <Polyline
          positions={regularRoute.map((point) => [point.lat, point.lng])}
          color="red" // Regular route in red
          weight={4}
          opacity={0.7} // Add transparency
        />
      )}
    </MapContainer>
  );
};

export default SafeRoutingComponent;
