// HomePage.js
import React, { useState } from 'react';
import GoogleMapComponent from '../components/GoogleMapComponent';
import TotalsComponent from '../components/TotalsComponent';
import CrimeMapComponent from '../components/CrimeMapComponent';
import SummaryComponent from '../components/SummaryComponent';
import FilterComponent from '../components/FilterComponent';
import '../styles/HomePage.css';  // CSS

const HomePage = () => {
  const [crimeStats, setCrimeStats] = useState([]);

  const handleFilterChange = (dates) => {
    console.log('篩選日期:', dates);
    // TODO: API from backend
    // axios.get('/api/crime-stats', { params: { startDate: dates[0], endDate: dates[1] } });
  };

  return (
    <div className="dashboard-container">
      {/* Filter component at top */}
      <div className="filter-section">
        <FilterComponent />
      </div>
      
      {/* components */}
      <div className="content-container">
        <div className="totals-section">
          <TotalsComponent />
        </div>
        <div className="map-section">
          <CrimeMapComponent />
        </div>
        <div className="summary-section">
          <SummaryComponent />
        </div>
      </div>
    </div>
  );
};

export default HomePage;
