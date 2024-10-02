import React from 'react';
import GoogleMapComponent from '../components/GoogleMapComponent';
import TotalsComponent from '../components/TotalsComponent';
import CrimeMapComponent from '../components/CrimeMapComponent';
import SummaryComponent from '../components/SummaryComponent';
import DateFilterComponent from '../components/DateFilterComponent';
import CrimeTypeDropdown from '../components/CrimeTypeDropdown';
import CrimeZoneDropdown from '../components/CrimeZoneDropdown';
import ChartComponent from '../components/ChartComponent';

const Dashboard = ({ filters, handleFilterChange, handleCrimeTypeChange, handleZoneChange }) => {
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

            </div>
        </>
    );
};

export default Dashboard;
