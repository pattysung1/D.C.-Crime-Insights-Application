import React, { useState, useEffect } from "react";
import axios from "axios";
import Plotly from "plotly.js-dist";

const CrimePrediction = () => {
  const [activeTab, setActiveTab] = useState("linearRegression"); // Tab state
  const [offenseData, setOffenseData] = useState({});
  const [selectedOffenses, setSelectedOffenses] = useState(["theft/other"]);
  const [loadingGraph, setLoadingGraph] = useState(true);
  const [area, setArea] = useState("ward");
  const [timeframe, setTimeframe] = useState("year");
  const [predictions, setPredictions] = useState([]);
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

  useEffect(() => {
    if (!loadingGraph && activeTab === "linearRegression") {
      const traces = selectedOffenses.flatMap((offense) => {
        const data = offenseData[offense];
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

  const fetchPredictions = async () => {
    setLoadingPredictions(true);
    try {
      const response = await axios.get(
        `/api/area-time-crime-prediction?area=${area}&timeframe=${timeframe}`
      );
      setPredictions(response.data.data || []);
    } catch (error) {
      console.error("Error fetching area and time-based predictions:", error);
    }
    setLoadingPredictions(false);
  };

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
          <h2>Advanced Predictions</h2>
          <div>
            <label>
              Area:
              <select value={area} onChange={(e) => setArea(e.target.value)}>
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
              >
                <option value="week">Week</option>
                <option value="month">Month</option>
                <option value="6 months">6 Months</option>
                <option value="year">Year</option>
                <option value="two years">Two Years</option>
                <option value="five years">Five Years</option>
              </select>
            </label>
            <button onClick={fetchPredictions}>Get Predictions</button>
          </div>

          {loadingPredictions ? (
            <p>Loading predictions...</p>
          ) : predictions.length > 0 ? (
            <table>
              <thead>
                <tr>
                  <th>Offense</th>
                  <th>Predicted Crimes</th>
                </tr>
              </thead>
              <tbody>
                {predictions.map((prediction, index) => (
                  <tr key={index}>
                    <td>{prediction.offense}</td>
                    <td>{prediction.predicted_crimes}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No predictions available</p>
          )}
        </>
      )}
    </div>
  );
};

export default CrimePrediction;
