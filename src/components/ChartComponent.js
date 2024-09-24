// src/components/ChartComponent.js
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';

const ChartComponent = () => {
  // for static data
  const data = [
    { crimeType: 'Robbery', count: 5 },
    { crimeType: 'Assault', count: 12 },
    { crimeType: 'Burglary', count: 8 },
  ];

  return (
    <div>
      <h2>Chart</h2>
    <BarChart width={600} height={300} data={data}>
      <XAxis dataKey="crimeType" />
      <YAxis />
      <Tooltip />
      <Legend />
      <Bar dataKey="count" fill="#8884d8" />
    </BarChart>
    </div>
  );
};

export default ChartComponent;
