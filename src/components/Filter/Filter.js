import React from 'react';
import DateFilterComponent from './DateFilterComponent';
import CrimeTypeDropdown from './CrimeTypeDropdown';
import CrimeZoneDropdown from './CrimeZoneDropdown';
import '../../styles/Filter.css';

const Filter = ({ handleFilterChange, handleCrimeTypeChange, handleZoneChange }) => {
    return (
        <div className="filter-container">
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
    );
};

export default Filter;
