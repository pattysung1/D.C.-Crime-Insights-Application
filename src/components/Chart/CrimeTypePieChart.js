import React from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import '../../styles/CrimeTypePieChart.css'; // Import styles

const CrimeTypePieChart = ({ crimeTypeData = [] }) => {
    // Define colors for different crime types
    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#FF5733', '#A133FF', '#00008B', '#FF9633', '#FF33A1'];

    // Ensure `crimeTypeData` is an array, and provide a fallback if it is not
    const safeCrimeTypeData = Array.isArray(crimeTypeData) ? crimeTypeData : [];

    // Debugging: Log the data to verify its structure
    console.log('crimeTypeData:', safeCrimeTypeData);

    return (
        <div className="crime-type-pie-chart-container">
            <h2 className="crime-type-pie-chart-title">Crime Types Distribution</h2>
            {/* Check if there is any data to render */}
            {safeCrimeTypeData.length > 0 ? (
                <ResponsiveContainer width="100%" height={400}>
                    <PieChart>
                        <Pie
                            data={safeCrimeTypeData}
                            dataKey="value"
                            nameKey="type"
                            cx="50%"
                            cy="50%"
                            outerRadius={150}
                            fill="#8884d8"
                            label
                        >
                            {safeCrimeTypeData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                    </PieChart>
                </ResponsiveContainer>
            ) : (
                // Message to display when there is no data
                <p>No data available to display the chart</p>
            )}
        </div>
    );
};

export default CrimeTypePieChart;
