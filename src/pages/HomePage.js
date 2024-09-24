import React, { useState } from 'react';
import GoogleMapComponent from '../components/GoogleMapComponent';
import TotalsComponent from '../components/TotalsComponent';
import CrimeMapComponent from '../components/CrimeMapComponent';
import SummaryComponent from '../components/SummaryComponent';
import FilterComponent from '../components/FilterComponent';
import '../styles/HomePage.css';  // CSS

const HomePage = () => {
  const [crimeStats, setCrimeStats] = useState([]);
  const [filters, setFilters] = useState({ crimeType: 'All Crimes', dates: [null, null] });

  const handleFilterChange = (newFilters) => {
    setFilters((prevFilters) => ({ ...prevFilters, ...newFilters }));
  };

  const handleCrimeTypeChange = (crimeType) => {
    setFilters((prevFilters) => ({ ...prevFilters, crimeType }));;
  };

  const handleZoneChange = (zone) => {
    setFilters((prevFilters) => ({ ...prevFilters, crimeZone: zone }));
  };

  return (
    <div className="dashboard-container">
      {/* 將三個篩選部分放入 filter-container */}
      <div className="header-container-section">
        <div className="date-filter-section">
          <DateFilterComponent onFilterChange={handleFilterChange} />
        </div>

        <div className="crime-type-section">
          <CrimeTypeDropdown onCrimeTypeChange={handleCrimeTypeChange} />
        </div>

        <div className="crime-zone-section">
          <CrimeZoneDropdown onZoneChange={handleZoneChange} />
        </div>
      </div>

      {/* components */}
      <div className="content-container">
        <div className="totals-section">
          <TotalsComponent crimeType={filters.crimeType} />
        </div>
        <div className="map-section">
          <CrimeMapComponent crimeType={filters.crimeType} />
        </div>
        <div className="summary-section">
          <SummaryComponent crimeType={filters.crimeType} />
        </div>
        <div className="chart-section">
          <ChartComponent />
        </div>
        <div className="chart-section">
          <ChartComponent />
        </div>
        <div className="chatbot-section">
        <ChatBotComponent />
        </div>
      </div>
        
        
      </div>

      



    
  );
};

export default HomePage;