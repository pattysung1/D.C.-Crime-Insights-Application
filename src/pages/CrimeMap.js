import React from 'react';
import Filter from '../components/Filter/Filter'; // Import the Filter component
// import '../styles/CrimeMap.css'; // Assuming you have relevant styles
import CrimeMapComponent from '../components/CrimeMapComponent';

const CrimeMap = ({ filters, handleFilterChange, handleCrimeTypeChange, handleZoneChange }) => {
    return (
        <div className="crime-map-container">
            {/* Add Filter in CrimeMap */}
            <Filter
                handleFilterChange={handleFilterChange}
                handleCrimeTypeChange={handleCrimeTypeChange}
                handleZoneChange={handleZoneChange}
            />

            {/* Here you can place your map display section */}
            <div className="map-display">
                {/* Map code... */}
                <p>This is the CrimeMap page content.</p>
                <CrimeMapComponent />
            </div>
        </div>
    );
};

export default CrimeMap;
