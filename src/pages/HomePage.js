import React, { useState } from 'react';
import GoogleMapComponent from '../components/GoogleMapComponent';
import TotalsComponent from '../components/TotalsComponent';
import CrimeMapComponent from '../components/CrimeMapComponent';
import SummaryComponent from '../components/SummaryComponent';
import DateFilterComponent from '../components/DateFilterComponent';
import CrimeTypeDropdown from '../components/CrimeTypeDropdown'; // 引入犯罪類型篩選組件
import CrimeZoneDropdown from '../components/CrimeZoneDropdown'; // 引入犯罪區域篩選組件
import ChartComponent from '../components/ChartComponent';
import ChatBotComponent from '../components/ChatBotComponent';
import '../styles/HomePage.css';  // CSS

const HomePage = () => {
  const [filters, setFilters] = useState({ crimeType: 'All Crimes', dates: [null, null], crimeZone: 'All Zones' });

  const handleFilterChange = (newFilters) => {
    setFilters((prevFilters) => ({ ...prevFilters, ...newFilters }));
  };

  const handleCrimeTypeChange = (crimeType) => {
    setFilters((prevFilters) => ({ ...prevFilters, crimeType }));
  };

  const handleZoneChange = (zone) => {
    setFilters((prevFilters) => ({ ...prevFilters, crimeZone: zone }));
  };

  return (
    <div className="dashboard-container">
      {/* 篩選部分 */}
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

      {/* 內容部分 */}
      <div className="content-container">
        <div className="totals-section">
          <TotalsComponent crimeType={filters.crimeType} crimeZone={filters.crimeZone} />
        </div>
        <div className="map-section">
          <CrimeMapComponent crimeType={filters.crimeType} crimeZone={filters.crimeZone} />
        </div>
        <div className="summary-section">
          <SummaryComponent crimeType={filters.crimeType} crimeZone={filters.crimeZone} />
        </div>
        <div className="chart-section">
          <ChartComponent crimeType={filters.crimeType} crimeZone={filters.crimeZone} />
        </div>
        <div className="chatbot-section">
          <ChatBotComponent />
        </div>
      </div>
    </div>
  );
};

export default HomePage;
