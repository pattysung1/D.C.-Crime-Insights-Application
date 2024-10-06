import React, { useState } from 'react';
import Dashboard from '../pages/Dashboard';
import CrimeMap from '../pages/CrimeMap'; // Ensure the path is correct
import Reports from '../pages/Reports';
import Settings from '../pages/Settings';
import CrimePrediction from '../pages/CrimePrediction';
import PublicSafety from '../pages/PublicSafety';
import Sidebar from '../components/Sidebar'; // Import Sidebar component
import ChatBotComponent from '../components/ChatBotComponent';
import Header from '../components/Header'; // Import Header component

import '../styles/HomePage.css'; // CSS

const HomePage = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
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
    <div className="page-container">
      {/* Header fixed at the top */}
      <Header />

      <div className="main-container">
        {/* Sidebar on the left side */}
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

        <div className="main-content">
          {/* Render different tab content */}
          {activeTab === 'dashboard' && (
            <Dashboard
              filters={filters}
              handleFilterChange={handleFilterChange}
              handleCrimeTypeChange={handleCrimeTypeChange}
              handleZoneChange={handleZoneChange}
            />
          )}
          {activeTab === 'CrimeMap' && (
            <CrimeMap
              filters={filters}
              handleFilterChange={handleFilterChange}
              handleCrimeTypeChange={handleCrimeTypeChange}
              handleZoneChange={handleZoneChange}
            />
          )}
          {activeTab === 'reports' && <Reports filters={filters} />}
          {activeTab === 'CrimePrediction' && <CrimePrediction filters={filters} />}
          {activeTab === 'PublicSafety' && <PublicSafety />}
          {activeTab === 'settings' && <Settings />}
        </div>
        <div className="chatbot-section">
          <ChatBotComponent />
        </div>
      </div>
    </div>
  );
};

export default HomePage;
