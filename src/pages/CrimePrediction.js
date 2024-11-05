import React, { useState, useEffect } from "react";
import axios from "axios";
import Plotly from "plotly.js-dist";

const CrimePrediction = () => {
  const [offenseData, setOffenseData] = useState({});
  const [selectedOffenses, setSelectedOffenses] = useState(["theft/other"]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("/api/crime-prediction");
        setOffenseData(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching crime prediction data:", error);
      }
    };
    fetchData();
  }, []);

  const handleCheckboxChange = (offense) => {
    setSelectedOffenses((prevSelected) =>
      prevSelected.includes(offense)
        ? prevSelected.filter((o) => o !== offense)
        : [...prevSelected, offense]
    );
  };

  useEffect(() => {
    if (!loading) {
      const traces = selectedOffenses.flatMap((offense) => {
        const data = offenseData[offense];
        return [
          {
            x: data.points.x,
            y: data.points.y,
            mode: "markers",
            type: "scatter",
            name: `${offense} (Points)`,
            marker: { color: data.points.color },
          },
          {
            x: data.regression.x,
            y: data.regression.y,
            mode: "lines",
            name: `${offense} (Trend Line)`,
            line: { color: data.regression.color },
          },
        ];
      });

      Plotly.react("crimeChart", traces, {
        title:
          "Weekly Crime Totals with Linear Regression by Offense (Past 2 Years)",
        xaxis: { title: "Week", tickformat: "%Y-%m-%d" },
        yaxis: { title: "Total Crimes" },
      });
    }
  }, [selectedOffenses, offenseData, loading]);

  return (
    <div>
      <h2>Crime Prediction</h2>
      {loading ? (
        <p>Loading chart...</p>
      ) : (
        <>
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
        </>
      )}
    </div>
  );
};

export default CrimePrediction;
