import React from 'react';
import '../styles/Sidebar.css';

const Sidebar = ({ activeTab, setActiveTab }) => {
    return (
        <nav className="sidebar">
            <ul>
                <li className={activeTab === 'dashboard' ? 'active' : ''} onClick={() => setActiveTab('dashboard')}>
                    Dashboard
                </li>
                <li className={activeTab === 'CrimeMap' ? 'active' : ''} onClick={() => setActiveTab('CrimeMap')}>
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
