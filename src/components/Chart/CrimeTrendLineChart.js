import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import '../../styles/CrimeTrendLineChart.css'; // 確保引入樣式

const CrimeTrendsChart = ({ crimeData }) => {
    const data = crimeData || [
        { date: '2024-01', theft: 20, assault: 5, vandalism: 10, burglary: 15, drugs: 8 },
        { date: '2024-02', theft: 30, assault: 8, vandalism: 15, burglary: 18, drugs: 10 },
        { date: '2024-03', theft: 25, assault: 12, vandalism: 20, burglary: 22, drugs: 15 },
        { date: '2024-04', theft: 35, assault: 18, vandalism: 25, burglary: 30, drugs: 20 },
        { date: '2024-05', theft: 40, assault: 22, vandalism: 30, burglary: 35, drugs: 25 },
    ];

    return (
        <div className="crime-trends-chart-container">
            <h2 className="crime-trends-chart-title">Crime Trends</h2>
            <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="theft" stroke="#8884d8" activeDot={{ r: 8 }} />
                    <Line type="monotone" dataKey="assault" stroke="#82ca9d" />
                    <Line type="monotone" dataKey="vandalism" stroke="#ffc658" />
                    <Line type="monotone" dataKey="burglary" stroke="#ff7300" />
                    <Line type="monotone" dataKey="drugs" stroke="#d00000" />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
};

export default CrimeTrendsChart;
