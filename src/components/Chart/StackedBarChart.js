import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts";
import "../../styles/StackedBarChart.css"; // Optional: Add a CSS file for styling

const StackedBarChart = ({ monthlyCrimeData }) => {
  return (
    <div className="stacked-bar-chart-container">
      <h2 className="stacked-bar-chart-title">Monthly Crime Distribution (This Year)</h2>
      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={monthlyCrimeData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="month" 
            tickFormatter={(tick) => {
                const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
                return monthNames[tick - 1]; // Adjust month numbering (1-based to 0-based)
            }}
          />
          <YAxis />
          <Tooltip />
          <Legend />
          {/* Ensure that each dataKey matches the backend JSON */}
          <Bar dataKey="theft (non auto)" stackId="a" fill="#8884d8" />
          <Bar dataKey="theft auto" stackId="a" fill="#82ca9d" />
          <Bar dataKey="assault with weapon" stackId="a" fill="#ffc658" />
          <Bar dataKey="homicide" stackId="a" fill="#ff8042" />
          <Bar dataKey="motor vehicle theft" stackId="a" fill="#d00000" />
          <Bar dataKey="burglary" stackId="a" fill="#ff1493" />
          <Bar dataKey="robbery" stackId="a" fill="#00008b" />
          <Bar dataKey="sex abuse" stackId="a" fill="#ff9633" />
          <Bar dataKey="arson" stackId="a" fill="#0088FE" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default StackedBarChart;
