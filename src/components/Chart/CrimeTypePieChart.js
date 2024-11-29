import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import "../../styles/CrimeTypePieChart.css"; // Import styles
import { CRIME_TYPES_CONFIG } from '../../utils/chartConfig';

const CrimeTypePieChart = ({ crimeTypeData = [] }) => {
  // Normalize crime type names and filter out zero values
  const filteredCrimeData = Array.isArray(crimeTypeData)
    ? crimeTypeData
      .map(crime => ({
        ...crime,
        // Normalize the type name
        type: crime.type === "theft auto" ? "theft (auto)" : crime.type
      }))
      .filter(crime => crime.value > 0)
      .sort((a, b) => {
        return CRIME_TYPES_CONFIG.order.indexOf(a.type) - CRIME_TYPES_CONFIG.order.indexOf(b.type);
      })
    : [];

  // Debugging: Log the filtered data
  console.log("Filtered crimeTypeData:", filteredCrimeData);

  return (
    <div className="crime-type-pie-chart-container">
      <h2 className="crime-type-pie-chart-title">
        Crime Types Distribution (Past 30 Days)
      </h2>
      {filteredCrimeData.length > 0 ? (
        <ResponsiveContainer width="100%" height={400}>
          <PieChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
            <Pie
              data={filteredCrimeData}
              dataKey="value"
              nameKey="type"
              cx="50%"
              cy="50%"
              outerRadius={140}
              innerRadius={0}
              fill="#8884d8"
              label={{
                position: 'outside',
                offset: 20
              }}
            >
              {filteredCrimeData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={CRIME_TYPES_CONFIG.colors[entry.type]}
                />
              ))}
            </Pie>
            <Tooltip />
            <Legend verticalAlign="bottom" height={36} />
          </PieChart>
        </ResponsiveContainer>
      ) : (
        <p>No data available to display the chart</p>
      )}
    </div>
  );
};

export default CrimeTypePieChart;
