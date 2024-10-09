import React from 'react';
import { MantineProvider } from '@mantine/core';
import CrimeTypeDropdown from './CrimeTypeDropdown';  // 類別篩選器
import CrimeZoneDropdown from './CrimeZoneDropdown';  // 區域篩選器
import DateFilterComponent from './DateFilterComponent';  // 日期篩選器
import '../../styles/Filter.css';
import '@mantine/core/styles.css';  // Add this line

const Filter = ({ filters, handleFilterChange, crimeTypes, crimeZones }) => {
    console.log('Filter props:', { filters, crimeTypes, crimeZones });

    const handleCrimeTypeChange = (crimeType) => {
        handleFilterChange({ crimeType });
    };

    const handleZoneChange = (crimeZone) => {
        handleFilterChange({ crimeZone });
    };

    const handleDateChange = (dateRange) => {
        handleFilterChange({ dates: dateRange });
    };

    return (
        <MantineProvider>
            <div className="filter-container">
                <div className="filter-item">
                    <CrimeTypeDropdown
                        onCrimeTypeChange={handleCrimeTypeChange}
                        crimeTypes={crimeTypes}
                        selectedCrimeType={filters.crimeType}
                    />
                </div>
                <div className="filter-item">
                    <CrimeZoneDropdown
                        onZoneChange={handleZoneChange}
                        crimeZones={crimeZones}
                        selectedCrimeZone={filters.crimeZone}
                    />
                </div>
                <div className="filter-item">
                    <DateFilterComponent
                        onDateChange={handleDateChange}
                        initialDateRange={filters.dates}
                    />
                </div>
            </div>
        </MantineProvider>
    );
};

export default Filter;
