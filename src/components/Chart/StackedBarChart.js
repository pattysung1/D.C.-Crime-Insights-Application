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
import "../../styles/StackedBarChart.css";
import { CRIME_TYPES_CONFIG } from '../../utils/chartConfig';

const StackedBarChart = ({ monthlyCrimeData }) => {
  // Normalize the data to handle inconsistent naming
  const normalizedData = monthlyCrimeData.map(monthData => {
    const newData = { ...monthData };
    // If "theft auto" exists, rename it to "theft (auto)"
    if ('theft auto' in newData) {
      newData['theft (auto)'] = newData['theft auto'];
      delete newData['theft auto'];
    }
    return newData;
  });

  // Filter out crime types with zero values
  const activeCrimeTypes = CRIME_TYPES_CONFIG.order.filter(crimeType => {
    return normalizedData.some(dataPoint => dataPoint[crimeType] > 0);
  });

  return (
    <div className="stacked-bar-chart-container">
      <h2 className="stacked-bar-chart-title">Monthly Crime Distribution (This Year)</h2>
      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={normalizedData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="month"
            tickFormatter={(tick) => {
              const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
              return monthNames[tick - 1];
            }}
          />
          <YAxis />
          <Tooltip />
          <Legend />
          {activeCrimeTypes.map(crimeType => (
            <Bar
              key={crimeType}
              dataKey={crimeType}
              stackId="a"
              fill={CRIME_TYPES_CONFIG.colors[crimeType]}
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default StackedBarChart;
