import React from 'react';
import CardComponent from '../components/CardComponent';
import DateFilterComponent from '../components/DateFilterComponent';
import CrimeTypeDropdown from '../components/CrimeTypeDropdown';
import CrimeZoneDropdown from '../components/CrimeZoneDropdown';
import CrimeTrendsChart from '../components/CrimeTrendLineChart';
import '../styles/Dashboard.css'; // 確保引入樣式

// 假設有一個完整的 crimeData 數據集
const crimeData = [
    { date: '2024-01', crimeType: 'Theft', zone: 'Northwest', count: 20 },
    { date: '2024-02', crimeType: 'Assault', zone: 'Southwest', count: 15 },
    { date: '2024-03', crimeType: 'Theft', zone: 'Northeast', count: 35 },
    { date: '2024-04', crimeType: 'Vandalism', zone: 'Northwest', count: 25 },
    // 更多數據...
];

const Dashboard = ({ filters, handleFilterChange, handleCrimeTypeChange, handleZoneChange }) => {
    // 根據 filters 過濾犯罪數據
    const filteredCrimeData = crimeData.filter(item => {
        const matchType = filters.crimeType === 'All Crimes' || item.crimeType === filters.crimeType;
        const matchZone = filters.crimeZone === 'All Zones' || item.zone === filters.crimeZone;
        const matchDate = !filters.dates[0] ||
            (new Date(item.date) >= new Date(filters.dates[0]) &&
                new Date(item.date) <= new Date(filters.dates[1]));
        return matchType && matchZone && matchDate;
    });

    return (
        <>
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

            <div className="content-container">
                {/* Crime Overview */}
                <section className="overview-section">
                    <h2>Crime Overview</h2>
                    <div className="overview-cards">
                        <CardComponent title="Total Crimes" value={filteredCrimeData.length} />
                        <CardComponent title="Top Crime Type" value="Theft" />
                        <CardComponent title="High Crime Zone" value="Northwest" />
                        <CardComponent title="Case Resolution" value="78%" />
                    </div>
                </section>

                {/* Crime Trends */}
                <section className="trends-section">
                    <h2>Crime Trends</h2>
                    <CrimeTrendsChart crimeData={filteredCrimeData} />
                </section>
            </div>
        </>
    );
};

export default Dashboard;
