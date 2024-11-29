import React, { useState, useEffect } from "react";
import axios from "axios";
import Plotly from "plotly.js-dist";
import "../styles/CrimePrediction.css"; // Import custom CSS file for styling

const CrimePrediction = () => {
  const [activeTab, setActiveTab] = useState("linearRegression"); // Tab state
  const [offenseData, setOffenseData] = useState({});
  const [selectedOffenses, setSelectedOffenses] = useState(["theft/other"]);
  const [loadingGraph, setLoadingGraph] = useState(true);
  const [area, setArea] = useState("ward");
  const [timeframe, setTimeframe] = useState("year");
  const [predictions, setPredictions] = useState({});
  const [loadingPredictions, setLoadingPredictions] = useState(false);

  // Fetch data for the linear regression graph
  useEffect(() => {
    const fetchCrimeData = async () => {
      try {
        const response = await axios.get("/api/crime-prediction");
        setOffenseData(response.data);
        setLoadingGraph(false);
      } catch (error) {
        console.error("Error fetching crime prediction data:", error);
      }
    };
    fetchCrimeData();
  }, []);

  const handleCheckboxChange = (offense) => {
    setSelectedOffenses((prevSelected) =>
      prevSelected.includes(offense)
        ? prevSelected.filter((o) => o !== offense)
        : [...prevSelected, offense]
    );
  };

  // Render the linear regression graph
  useEffect(() => {
    if (!loadingGraph && activeTab === "linearRegression") {
      const traces = selectedOffenses.flatMap((offense) => {
        const data = offenseData[offense];
        if (!data) return []; // Skip offenses with no data

        const slopeText = `Slope: ${data.slope.toFixed(2)}`;

        return [
          {
            x: data.points.x,
            y: data.points.y,
            mode: "markers",
            type: "scatter",
            name: `${offense} (Points)`,
            marker: { color: data.points.color },
            hovertext: data.points.x.map(
              (date, i) => `Week: ${date}<br>Total Crimes: ${data.points.y[i]}`
            ),
            hoverinfo: "text",
          },
          {
            x: data.regression.x,
            y: data.regression.y,
            mode: "lines",
            name: `${offense} (Trend Line)`,
            line: { color: data.regression.color },
            hovertext: data.regression.x.map(() => slopeText),
            hoverinfo: "text",
          },
          {
            x: data.future.x,
            y: data.future.y,
            mode: "lines",
            name: `${offense} (Prediction)`,
            line: { dash: "dot", color: data.future.color }, // Prediction line style
            hovertext: data.future.x.map((date, i) => {
              const predictedCrime =
                data.future.y[i] !== undefined
                  ? data.future.y[i].toFixed(0)
                  : "N/A";
              return `Week: ${date}<br>Predicted Crimes: ${predictedCrime}`;
            }),
            hoverinfo: "text",
          },
        ];
      });

      Plotly.react("crimeChart", traces, {
        title:
          "Linear Regression Graph of Weekly Crime Totals by Offense (Past 2 Years) and Future Predictions",
        xaxis: { title: "Week", tickformat: "%Y-%m-%d" },
        yaxis: { title: "Total Crimes" },
      });
    }
  }, [selectedOffenses, offenseData, loadingGraph, activeTab]);

  // Fetch advanced predictions for the table
  const fetchPredictions = async () => {
    setLoadingPredictions(true);
    try {
      const response = await axios.get(
        `/api/area-time-crime-prediction?area=${area}&timeframe=${timeframe}`
      );
      setPredictions(response.data.data || {});
    } catch (error) {
      console.error("Error fetching area and time-based predictions:", error);
      setPredictions({});
    }
    setLoadingPredictions(false);
  };

  // Extract areas and offenses from the predictions
  let areas = [];
  let offenses = [];

  if (Object.keys(predictions).length > 0) {
    areas = Object.keys(predictions).sort((a, b) => {
      const clusterNumberA = parseInt(a.replace(/\D/g, ""), 10); // Extract numbers from strings
      const clusterNumberB = parseInt(b.replace(/\D/g, ""), 10);

      return clusterNumberA - clusterNumberB; // Sort numerically
    });
    const offensesSet = new Set();
    areas.forEach((area) => {
      const offensesInArea = Object.keys(predictions[area]);
      offensesInArea.forEach((offense) => offensesSet.add(offense));
    });
    offenses = Array.from(offensesSet);
  }

  return (
    <div>
      {/* Tab Navigation */}
      <div style={{ marginBottom: "20px" }}>
        <button
          style={{
            marginRight: "10px",
            backgroundColor:
              activeTab === "linearRegression" ? "#007BFF" : "#CCC",
            color: "white",
            border: "none",
            padding: "10px 15px",
            cursor: "pointer",
          }}
          onClick={() => setActiveTab("linearRegression")}
        >
          Linear Regression Graph
        </button>
        <button
          style={{
            backgroundColor:
              activeTab === "advancedPredictions" ? "#007BFF" : "#CCC",
            color: "white",
            border: "none",
            padding: "10px 15px",
            cursor: "pointer",
          }}
          onClick={() => setActiveTab("advancedPredictions")}
        >
          Advanced Predictions
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === "linearRegression" && (
        <>
          <h2>Linear Regression Graph</h2>
          {loadingGraph ? (
            <p>Loading graph...</p>
          ) : (
            <div>
              <div>
                {Object.keys(offenseData).map((offense) => (
                  <label key={offense}>
                    <input
                      type="checkbox"
                      checked={selectedOffenses.includes(offense)}
                      onChange={() => handleCheckboxChange(offense)}
                    />
                    {offense}
                  </label>
                ))}
              </div>
              <div id="crimeChart" style={{ width: "100%", height: "600px" }} />
            </div>
          )}
        </>
      )}

      {activeTab === "advancedPredictions" && (
        <>
          <h2>Predict Number of Crimes by Area and Time Frame</h2>
          <div className="prediction-filters">
            <label>
              Area:
              <select
                value={area}
                onChange={(e) => setArea(e.target.value)}
                className="dropdown"
              >
                <option value="ward">Ward</option>
                <option value="neighborhood_clusters">
                  Neighborhood Clusters
                </option>
                <option value="anc">ANC</option>
                <option value="psa">PSA</option>
              </select>
            </label>
            <label>
              Timeframe:
              <select
                value={timeframe}
                onChange={(e) => setTimeframe(e.target.value)}
                className="dropdown"
              >
                <option value="week">Week</option>
                <option value="month">Month</option>
                <option value="6 months">6 Months</option>
                <option value="year">Year</option>
                <option value="two years">Two Years</option>
                <option value="five years">Five Years</option>
              </select>
            </label>
            <button onClick={fetchPredictions} className="fetch-button">
              Get Predictions
            </button>
          </div>

          {loadingPredictions ? (
            <p>Generating Predictions...</p>
          ) : Object.keys(predictions).length > 0 ? (
            <div className="table-container">
              <table className="predictions-table">
                <thead>
                  <tr>
                    <th>Area</th>
                    {offenses.map((offense) => (
                      <th key={offense}>{offense}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {areas.map((area) => (
                    <tr key={area}>
                      <td className="area-cell">{area}</td>
                      {offenses.map((offense) => (
                        <td
                          key={offense}
                          className="crime-cell"
                          title={`Predicted crimes for ${offense} in ${area}`}
                        >
                          {predictions[area][offense] !== undefined
                            ? predictions[area][offense].toFixed(2)
                            : "N/A"}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p>No predictions available</p>
          )}
        </>
      )}
    </div>
  );
};

export default CrimePrediction;
