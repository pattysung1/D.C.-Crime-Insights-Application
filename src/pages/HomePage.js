import React, { useState } from 'react';
import Dashboard from '../pages/Dashboard';
import CrimeMap from './CrimeMap';
import Reports from '../pages/Reports';
import Settings from '../pages/Settings';
import CrimePrediction from './CrimePrediction';
import PublicSafety from './PublicSafety';
import Sidebar from '../components/Sidebar'; // 引入 Sidebar 組件
import ChatBotComponent from '../components/ChatBotComponent';

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
      <header className="header">
        <img src="/photo/dc.png" alt="Left Logo" className="logo left-logo" />
        <h1 className="project-title">District of Columbia Crime Monitor</h1>
        <img src="/photo/vt.png" alt="Right Logo" className="logo right-logo" />
      </header>

      <div className="main-container">
        {/* 左側頁籤欄位使用 Sidebar 組件 */}
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

        <div className="main-content">
          {activeTab === 'dashboard' && (
            <Dashboard
              filters={filters}
              handleFilterChange={handleFilterChange}
              handleCrimeTypeChange={handleCrimeTypeChange}
              handleZoneChange={handleZoneChange}
            />
          )}
          {activeTab === 'CrimeMap' && <CrimeMap />}
          {activeTab === 'reports' && <Reports />}
          {activeTab === 'CrimePrediction' && <CrimePrediction />}
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
