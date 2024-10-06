import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import '../../styles/CrimeTrendLineChart.css'; // Import styles

const CrimeTrendsChart = ({ crimeData }) => {
    // Use the passed crimeData prop or fallback to default data for testing
    const data = crimeData;

    return (
        <div className="crime-trends-chart-container" >
            <h2 className="crime-trends-chart-title">Crime Trends</h2>
            <ResponsiveContainer width="90%" height="90%">
                <LineChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    {/* Lines for each crime category */}
                    <Line type="monotone" dataKey="theft" stroke="#8884d8" activeDot={{ r: 8 }} />
                    <Line type="monotone" dataKey="assault" stroke="#82ca9d" />
                    <Line type="monotone" dataKey="vandalism" stroke="#ffc658" />
                    <Line type="monotone" dataKey="burglary" stroke="#ff7300" />
                    <Line type="monotone" dataKey="drugs" stroke="#d00000" />
                    <Line type="monotone" dataKey="arson" stroke="#ffa500" />
                    <Line type="monotone" dataKey="homicide" stroke="#800000" />
                    <Line type="monotone" dataKey="robbery" stroke="#00008b" />
                    <Line type="monotone" dataKey="sex_abuse" stroke="#ff1493" />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
};

export default CrimeTrendsChart;
