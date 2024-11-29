import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import "../../styles/CrimeTrendLineChart.css";
import { CRIME_TYPES_CONFIG } from '../../utils/chartConfig';

const CrimeTrendsChart = ({ crimeData }) => {
  // Filter out crime types with zero values
  const activeCrimeTypes = CRIME_TYPES_CONFIG.order.filter(crimeType => {
    return crimeData.some(dataPoint => dataPoint[crimeType] > 0);
  });

  return (
    <div className="crime-trends-chart-container">
      <h2 className="crime-trends-chart-title">Crime Trends</h2>
      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={crimeData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Legend />
          {/* Only render lines for crime types with non-zero values */}
          {activeCrimeTypes.map(crimeType => (
            <Line
              key={crimeType}
              type="monotone"
              dataKey={crimeType}
              stroke={CRIME_TYPES_CONFIG.colors[crimeType]}
              activeDot={{ r: 8 }}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CrimeTrendsChart;
