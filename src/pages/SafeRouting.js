import React, { useState } from "react";
import SafeRoutingComponent from "../components/SafeRoutingComponent"; // 地圖組件
import "../styles/SafeRouting.css"; // 自定義樣式

const SafeRouting = () => {
  const [startLocation, setStartLocation] = useState("");
  const [destinationLocation, setDestinationLocation] = useState("");
  const [safeRoute, setSafeRoute] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // 處理輸入框變化
  const handleInputChange = (e, type) => {
    if (type === "start") {
      setStartLocation(e.target.value);
    } else {
      setDestinationLocation(e.target.value);
    }
  };

  // 提交路線請求
  const handleRouteSubmit = async () => {
    if (!startLocation || !destinationLocation) {
      setError("Please provide both start and destination locations.");
      return;
    }

    setError(""); // 清空錯誤
    setLoading(true); // 設置加載狀態

    try {
      const response = await fetch(
        `/api/safe-route?start=${encodeURIComponent(
          startLocation
        )}&destination=${encodeURIComponent(destinationLocation)}`
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Failed to calculate safe route.");
      }

      const data = await response.json();
      setSafeRoute(data.safe_route); // 更新安全路線
    } catch (err) {
      console.error(err);
      setError(err.message || "Unable to calculate the route. Please try again.");
    } finally {
      setLoading(false); // 重置加載狀態
    }
  };

  return (
    <div className="safe-routing-container">
      <h2>Safe Route Planner</h2>

      {/* 輸入框容器 */}
      <div className="input-container">
        <div className="input-group">
          <label htmlFor="start">Start Location: </label>
          <input
            id="start"
            type="text"
            placeholder="e.g., White House"
            value={startLocation}
            onChange={(e) => handleInputChange(e, "start")}
          />
        </div>

        <div className="input-group">
          <label htmlFor="destination">Destination: </label>
          <input
            id="destination"
            type="text"
            placeholder="e.g., Capitol Building"
            value={destinationLocation}
            onChange={(e) => handleInputChange(e, "destination")}
          />
        </div>

        <button onClick={handleRouteSubmit} disabled={loading}>
          {loading ? "Calculating..." : "Find Safe Route"}
        </button>
      </div>

      {/* 錯誤信息 */}
      {error && <p className="error-message">{error}</p>}

      {/* 地圖組件 */}
      <SafeRoutingComponent
        route={safeRoute}
        isLoading={loading}
        error={error}
      />
    </div>
  );
};

export default SafeRouting;
