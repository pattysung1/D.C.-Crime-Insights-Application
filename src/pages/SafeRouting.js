// import React, { useState } from "react";
// import SafeRoutingComponent from "../components/SafeRoutingComponent"; // 地圖組件
// import "../styles/SafeRouting.css"; // 自定義樣式

// const SafeRouting = () => {
//   const [startLocation, setStartLocation] = useState("");
//   const [destinationLocation, setDestinationLocation] = useState("");
//   const [safeRoute, setSafeRoute] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");

//   // 處理輸入框變化
//   const handleInputChange = (e, type) => {
//     if (type === "start") {
//       setStartLocation(e.target.value);
//     } else {
//       setDestinationLocation(e.target.value);
//     }
//   };

//   // 提交路線請求
//   const handleRouteSubmit = async () => {
//     if (!startLocation || !destinationLocation) {
//       setError("Please provide both start and destination locations.");
//       return;
//     }

//     setError(""); // 清空錯誤
//     setLoading(true); // 設置加載狀態

//     try {
//       const response = await fetch(
//         `/api/safe-route?start=${encodeURIComponent(
//           startLocation
//         )}&destination=${encodeURIComponent(destinationLocation)}`
//       );

//       if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(errorData.detail || "Failed to calculate safe route.");
//       }

//       const data = await response.json();
//       setSafeRoute(data.safe_route); // 更新安全路線
//     } catch (err) {
//       console.error(err);
//       setError(err.message || "Unable to calculate the route. Please try again.");
//     } finally {
//       setLoading(false); // 重置加載狀態
//     }
//   };

//   return (
//     <div className="safe-routing-container">
//       <h2>Safe Route Planner</h2>

//       {/* 輸入框容器 */}
//       <div className="input-container">
//         <div className="input-group">
//           <label htmlFor="start">Start Location: </label>
//           <input
//             id="start"
//             type="text"
//             placeholder="e.g., White House"
//             value={startLocation}
//             onChange={(e) => handleInputChange(e, "start")}
//           />
//         </div>

//         <div className="input-group">
//           <label htmlFor="destination">Destination: </label>
//           <input
//             id="destination"
//             type="text"
//             placeholder="e.g., Capitol Building"
//             value={destinationLocation}
//             onChange={(e) => handleInputChange(e, "destination")}
//           />
//         </div>

//         <button onClick={handleRouteSubmit} disabled={loading}>
//           {loading ? "Calculating..." : "Find Safe Route"}
//         </button>
//       </div>

//       {/* 錯誤信息 */}
//       {error && <p className="error-message">{error}</p>}

//       {/* 地圖組件 */}
//       <SafeRoutingComponent
//         route={safeRoute}
//         isLoading={loading}
//         error={error}
//       />
//     </div>
//   );
// };

// export default SafeRouting;
// ===========================================================================================================================================
// import React, { useState } from "react";
// import SafeRoutingComponent from "../components/SafeRoutingComponent";
// import "../styles/SafeRouting.css";

// const SafeRouting = () => {
//   const [startLocation, setStartLocation] = useState("");
//   const [destinationLocation, setDestinationLocation] = useState("");
//   const [safeRoute, setSafeRoute] = useState(null);
//   const [regularRoute, setRegularRoute] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");

//   const handleInputChange = (e, type) => {
//     if (type === "start") {
//       setStartLocation(e.target.value);
//     } else {
//       setDestinationLocation(e.target.value);
//     }
//   };

//   const handleRouteSubmit = async () => {
//     if (!startLocation || !destinationLocation) {
//       setError("Please provide both start and destination locations.");
//       return;
//     }

//     setError(""); // Clear errors
//     setLoading(true); // Show loading state

//     try {
//       const response = await fetch(
//         `/api/routes?start=${encodeURIComponent(startLocation)}&destination=${encodeURIComponent(destinationLocation)}`
//       );

//       if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(errorData.detail || "Failed to fetch routes.");
//       }

//       const data = await response.json();
//       setSafeRoute(data.safe_route); // Safe route
//       setRegularRoute(data.regular_route); // Regular route
//     } catch (err) {
//       console.error(err);
//       setError(err.message || "Unable to fetch routes. Please try again.");
//     } finally {
//       setLoading(false); // Reset loading state
//     }
//   };

//   return (
//     <div className="safe-routing-container">
//       <h2>Safe and Regular Route Planner</h2>

//       <div className="input-container">
//         <div className="input-group">
//           <label htmlFor="start">Start Location: </label>
//           <input
//             id="start"
//             type="text"
//             placeholder="e.g., White House"
//             value={startLocation}
//             onChange={(e) => handleInputChange(e, "start")}
//           />
//         </div>

//         <div className="input-group">
//           <label htmlFor="destination">Destination: </label>
//           <input
//             id="destination"
//             type="text"
//             placeholder="e.g., Capitol Building"
//             value={destinationLocation}
//             onChange={(e) => handleInputChange(e, "destination")}
//           />
//         </div>

//         <button onClick={handleRouteSubmit} disabled={loading}>
//           {loading ? "Calculating..." : "Find Routes"}
//         </button>
//       </div>

//       {error && <p className="error-message">{error}</p>}

//       <SafeRoutingComponent
//         safeRoute={safeRoute}
//         regularRoute={regularRoute}
//         isLoading={loading}
//         error={error}
//       />
//     </div>
//   );
// };

// export default SafeRouting;


// ====================================================

// import React, { useState } from "react";
// import SafeRoutingComponent from "../components/SafeRoutingComponent";
// import "../styles/SafeRouting.css";

// const SafeRouting = () => {
//   const [startLocation, setStartLocation] = useState("");
//   const [destinationLocation, setDestinationLocation] = useState("");
//   const [safeRoute, setSafeRoute] = useState(null);
//   const [regularRoute, setRegularRoute] = useState(null);
//   const [regularRouteColor, setRegularRouteColor] = useState(""); // Added for dynamic color
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");

//   const handleInputChange = (e, type) => {
//     if (type === "start") {
//       setStartLocation(e.target.value);
//     } else {
//       setDestinationLocation(e.target.value);
//     }
//   };

//   const handleRouteSubmit = async () => {
//     if (!startLocation || !destinationLocation) {
//       setError("Please provide both start and destination locations.");
//       return;
//     }

//     setError(""); // Clear errors
//     setLoading(true); // Show loading state

//     try {
//       const response = await fetch(
//         `/api/routes?start=${encodeURIComponent(startLocation)}&destination=${encodeURIComponent(destinationLocation)}`
//       );

//       if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(errorData.detail || "Failed to fetch routes.");
//       }

//       const data = await response.json();
//       setSafeRoute(data.safe_route); // Safe route
//       setRegularRoute(data.regular_route); // Regular route
//       setRegularRouteColor(data.regular_route_color || "red"); // Set regular route color dynamically
//     } catch (err) {
//       console.error(err);
//       setError(err.message || "Unable to fetch routes. Please try again.");
//     } finally {
//       setLoading(false); // Reset loading state
//     }
//   };

//   return (
//     <div className="safe-routing-container">
//       <h2>Safe and Regular Route Planner</h2>

//       <div className="input-container">
//         <div className="input-group">
//           <label htmlFor="start">Start Location: </label>
//           <input
//             id="start"
//             type="text"
//             placeholder="e.g., White House"
//             value={startLocation}
//             onChange={(e) => handleInputChange(e, "start")}
//           />
//         </div>

//         <div className="input-group">
//           <label htmlFor="destination">Destination: </label>
//           <input
//             id="destination"
//             type="text"
//             placeholder="e.g., Capitol Building"
//             value={destinationLocation}
//             onChange={(e) => handleInputChange(e, "destination")}
//           />
//         </div>

//         <button onClick={handleRouteSubmit} disabled={loading}>
//           {loading ? "Calculating..." : "Find Routes"}
//         </button>
//       </div>

//       {error && <p className="error-message">{error}</p>}

//       <SafeRoutingComponent
//         safeRoute={safeRoute}
//         regularRoute={regularRoute}
//         regularRouteColor={regularRouteColor} // Pass the dynamic color to the component
//         isLoading={loading}
//         error={error}
//       />
//     </div>
//   );
// };

// export default SafeRouting;


// import React, { useState } from "react";
// import SafeRoutingComponent from "../components/SafeRoutingComponent";
// import "../styles/SafeRouting.css";

// const SafeRouting = () => {
//   const [startLocation, setStartLocation] = useState("");
//   const [destinationLocation, setDestinationLocation] = useState("");
//   const [safeRoute, setSafeRoute] = useState(null);
//   const [regularRoute, setRegularRoute] = useState(null);
//   const [error, setError] = useState("");
//   const [loading, setLoading] = useState(false);

//   const handleInputChange = (e, type) => {
//     if (type === "start") {
//       setStartLocation(e.target.value);
//     } else {
//       setDestinationLocation(e.target.value);
//     }
//   };

//   const fetchRoutes = async () => {
//     if (!startLocation || !destinationLocation) {
//       setError("Please provide both start and destination locations.");
//       return;
//     }

//     setError(""); // Clear previous errors
//     setLoading(true);

//     try {
//       // Fetch safe route
//       const safeRouteResponse = await fetch(
//         `/api/safe-route?start=${encodeURIComponent(startLocation)}&destination=${encodeURIComponent(destinationLocation)}`
//       );
//       if (!safeRouteResponse.ok) {
//         throw new Error("Failed to fetch the safe route.");
//       }
//       const safeRouteData = await safeRouteResponse.json();

//       // Fetch regular route
//       const regularRouteResponse = await fetch(
//         `/api/regular-route?start=${encodeURIComponent(startLocation)}&destination=${encodeURIComponent(destinationLocation)}`
//       );
//       if (!regularRouteResponse.ok) {
//         throw new Error("Failed to fetch the regular route.");
//       }
//       const regularRouteData = await regularRouteResponse.json();

//       // Set routes
//       setSafeRoute(safeRouteData.safe_route);
//       setRegularRoute(regularRouteData.route);
//     } catch (err) {
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="safe-routing-container">
//       <h2>Safe and Regular Route Planner</h2>

//       <div className="input-container">
//         <div className="input-group">
//           <label htmlFor="start">Start Location:</label>
//           <input
//             id="start"
//             type="text"
//             placeholder="e.g., White House"
//             value={startLocation}
//             onChange={(e) => handleInputChange(e, "start")}
//           />
//         </div>

//         <div className="input-group">
//           <label htmlFor="destination">Destination:</label>
//           <input
//             id="destination"
//             type="text"
//             placeholder="e.g., Capitol Building"
//             value={destinationLocation}
//             onChange={(e) => handleInputChange(e, "destination")}
//           />
//         </div>

//         <button onClick={fetchRoutes} disabled={loading}>
//           {loading ? "Loading..." : "Find Routes"}
//         </button>
//       </div>

//       {error && <p className="error-message">{error}</p>}

//       <SafeRoutingComponent safeRoute={safeRoute} regularRoute={regularRoute} />
//     </div>
//   );
// };

// export default SafeRouting;


// import React, { useState } from "react";
// import SafeRoutingComponent from "../components/SafeRoutingComponent";
// import "../styles/SafeRouting.css";

// const SafeRouting = () => {
//   const [startLocation, setStartLocation] = useState("");
//   const [destinationLocation, setDestinationLocation] = useState("");
//   const [safeRoute, setSafeRoute] = useState(null);
//   const [error, setError] = useState("");
//   const [loading, setLoading] = useState(false);

//   const handleInputChange = (e, type) => {
//     if (type === "start") {
//       setStartLocation(e.target.value);
//     } else {
//       setDestinationLocation(e.target.value);
//     }
//   };

//   const fetchSafeRoute = async () => {
//     if (!startLocation || !destinationLocation) {
//       setError("Please provide both start and destination locations.");
//       return;
//     }

//     setError(""); // Clear previous errors
//     setLoading(true);

//     try {
//       const response = await fetch(
//         `/api/safe-route?start=${encodeURIComponent(startLocation)}&destination=${encodeURIComponent(destinationLocation)}`
//       );
//       if (!response.ok) {
//         throw new Error("Failed to fetch the safe route.");
//       }
//       const data = await response.json();
//       setSafeRoute(data.safe_route); // Set safe route data
//     } catch (err) {
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="safe-routing-container">
//       <h2>Safe Route Planner</h2>

//       <div className="input-container">
//         <div className="input-group">
//           <label htmlFor="start">Start Location:</label>
//           <input
//             id="start"
//             type="text"
//             placeholder="e.g., White House"
//             value={startLocation}
//             onChange={(e) => handleInputChange(e, "start")}
//           />
//         </div>

//         <div className="input-group">
//           <label htmlFor="destination">Destination:</label>
//           <input
//             id="destination"
//             type="text"
//             placeholder="e.g., Capitol Building"
//             value={destinationLocation}
//             onChange={(e) => handleInputChange(e, "destination")}
//           />
//         </div>

//         <button onClick={fetchSafeRoute} disabled={loading}>
//           {loading ? "Loading..." : "Find Safe Route"}
//         </button>
//       </div>

//       {error && <p className="error-message">{error}</p>}

//       <SafeRoutingComponent safeRoute={safeRoute} />
//     </div>
//   );
// };

// export default SafeRouting;
import React, { useState } from "react";
import SafeRoutingComponent from "../components/SafeRoutingComponent";
import "../styles/SafeRouting.css";

const SafeRouting = () => {
  const [startLocation, setStartLocation] = useState("");
  const [destinationLocation, setDestinationLocation] = useState("");
  const [safeRoute, setSafeRoute] = useState(null);
  const [regularRoute, setRegularRoute] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e, type) => {
    if (type === "start") {
      setStartLocation(e.target.value);
    } else {
      setDestinationLocation(e.target.value);
    }
  };

  const fetchRoutes = async () => {
    if (!startLocation || !destinationLocation) {
      setError("Please provide both start and destination locations.");
      return;
    }

    setError(""); // Clear previous errors
    setLoading(true);

    try {
      // Fetch safe route
      const safeResponse = await fetch(
        `/api/safe-route?start=${encodeURIComponent(startLocation)}&destination=${encodeURIComponent(destinationLocation)}`
      );
      if (!safeResponse.ok) {
        throw new Error("Failed to fetch the safe route.");
      }
      const safeData = await safeResponse.json();
      setSafeRoute(safeData.safe_route);

      // Fetch regular route
      const regularResponse = await fetch(
        `/api/regular-route?start=${encodeURIComponent(startLocation)}&destination=${encodeURIComponent(destinationLocation)}`
      );
      if (!regularResponse.ok) {
        throw new Error("Failed to fetch the regular route.");
      }
      const regularData = await regularResponse.json();
      setRegularRoute(regularData.route);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="safe-routing-container">
      <h2>Safe and Regular Route Planner</h2>

      <div className="input-container">
        <div className="input-group">
          <label htmlFor="start">Start Location:</label>
          <input
            id="start"
            type="text"
            placeholder="e.g., White House"
            value={startLocation}
            onChange={(e) => handleInputChange(e, "start")}
          />
        </div>

        <div className="input-group">
          <label htmlFor="destination">Destination:</label>
          <input
            id="destination"
            type="text"
            placeholder="e.g., Capitol Building"
            value={destinationLocation}
            onChange={(e) => handleInputChange(e, "destination")}
          />
        </div>

        <button onClick={fetchRoutes} disabled={loading}>
          {loading ? "Loading..." : "Find Routes"}
        </button>
      </div>

      {error && <p className="error-message">{error}</p>}

      <SafeRoutingComponent safeRoute={safeRoute} regularRoute={regularRoute} />
    </div>
  );
};

export default SafeRouting;
