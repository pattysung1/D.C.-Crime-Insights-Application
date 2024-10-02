import React from 'react';
import '../styles/Sidebar.css'; // 確保這裡引入了正確的 Sidebar 樣式

const Sidebar = ({ activeTab, setActiveTab }) => {
    return (
        <nav className="sidebar">
            <ul>
                <li className={activeTab === 'dashboard' ? 'active' : ''} onClick={() => setActiveTab('dashboard')}>
                    Dashboard
                </li>
                <li className={activeTab === 'crimeMap' ? 'active' : ''} onClick={() => setActiveTab('crimeMap')}>
                    CrimeMap
                </li>
                <li className={activeTab === 'reports' ? 'active' : ''} onClick={() => setActiveTab('reports')}>
                    Reports
                </li>
                <li className={activeTab === 'CrimePrediction' ? 'active' : ''} onClick={() => setActiveTab('CrimePrediction')}>
                    Crime Prediction
                </li>
                <li className={activeTab === 'PublicSafety' ? 'active' : ''} onClick={() => setActiveTab('PublicSafety')}>
                    Public Safety Resources
                </li>
                <li className={activeTab === 'settings' ? 'active' : ''} onClick={() => setActiveTab('settings')}>
                    Settings
                </li>
            </ul>
        </nav>
    );
};

export default Sidebar;
