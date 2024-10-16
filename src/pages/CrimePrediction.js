import React, { useState, useEffect } from "react";
import axios from "axios";

const CrimePrediction = () => {
  const [chartHtml, setChartHtml] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchChart = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8000/crime-prediction"
        );
        setChartHtml(response.data.chart); // Set the HTML for the chart
        setLoading(false);
      } catch (error) {
        console.error("Error fetching crime prediction chart:", error);
      }
    };
    fetchChart();
  }, []);

  return (
    <div>
      <h2>Crime Prediction</h2>
      {loading ? (
        <p>Loading chart...</p>
      ) : (
        // Render the chart HTML in an iframe to ensure proper JS execution
        <iframe
          srcDoc={chartHtml}
          style={{ width: "100%", height: "600px", border: "none" }}
          title="Crime Prediction Chart"
        />
      )}
    </div>
  );
};

export default CrimePrediction;
