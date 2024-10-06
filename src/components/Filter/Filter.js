import React from 'react';
import CrimeTypeDropdown from './CrimeTypeDropdown';  // 類別篩選器
import CrimeZoneDropdown from './CrimeZoneDropdown';  // 區域篩選器
import DateFilterComponent from './DateFilterComponent';  // 日期篩選器

const Filter = ({ filters, handleFilterChange }) => {
    const handleCrimeTypeChange = (crimeType) => {
        handleFilterChange({ crimeType });  // 更新犯罪類型篩選
    };

    const handleZoneChange = (crimeZone) => {
        handleFilterChange({ crimeZone });  // 更新區域篩選
    };

    const handleDateChange = (dates) => {
        handleFilterChange({ dates });  // 更新日期篩選
    };

    return (
        <div className="filter-container">
            <CrimeTypeDropdown onCrimeTypeChange={handleCrimeTypeChange} />
            <CrimeZoneDropdown onZoneChange={handleZoneChange} />
            <DateFilterComponent onDateChange={handleDateChange} />
        </div>
    );
};

export default Filter;
