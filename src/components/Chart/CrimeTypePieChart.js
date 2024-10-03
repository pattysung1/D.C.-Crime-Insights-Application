// Show in Dashboard
import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import axios from 'axios';
import '../../styles/CrimeTypePieChart.css'; // 引入樣式

const CrimeTypePieChart = () => {
    const [crimeTypeData, setCrimeTypeData] = useState([]);

    // 定義顏色集，分配給不同的犯罪類型
    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#FF6384'];

    useEffect(() => {
        const fakeData = [
            { type: 'Burglary', value: 120 },
            { type: 'Assault', value: 150 },
            { type: 'Theft', value: 300 },
            { type: 'Vandalism', value: 100 },
            { type: 'Drugs', value: 80 },
        ];

        setCrimeTypeData(fakeData);
        // const fetchCrimeTypeData = async () => {
        //     try {
        //         const response = await axios.get('/api/crime-types');
        //         setCrimeTypeData(response.data);
        //     } catch (error) {
        //         console.error('Error fetching crime type data', error);
        //     }
        // };

        // fetchCrimeTypeData();
    }, []);

    return (
        <div className="crime-type-pie-chart-container">
            <h2 className="crime-type-pie-chart-title">Crime Types Distribution</h2>
            <ResponsiveContainer width="100%" height={400}>
                <PieChart>
                    <Pie
                        data={crimeTypeData}
                        dataKey="value"
                        nameKey="type"
                        cx="50%"
                        cy="50%"
                        outerRadius={150}
                        fill="#8884d8"
                        label
                    >
                        {crimeTypeData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
};

export default CrimeTypePieChart;
