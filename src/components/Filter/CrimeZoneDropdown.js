import React from 'react';
import { Select } from '@mantine/core';

const CrimeZoneDropdown = ({ onZoneChange, crimeZones, selectedCrimeZone }) => {
    const handleChange = (value) => {
        onZoneChange(value);
    };

    // Sort the crime zones numerically
    const sortedCrimeZones = [...crimeZones].sort((a, b) => {
        return parseInt(a) - parseInt(b);
    });

    return (
        <div className="fancy-dropdown">
            <h2>Crime Zone</h2>
            <Select
                data={sortedCrimeZones.map(zone => ({ value: zone, label: zone }))}
                value={selectedCrimeZone}
                onChange={handleChange}
                placeholder="All Zones"
                searchable
                nothingFound="No options"
                maxDropdownHeight={280}
            />
        </div>
    );
};

export default CrimeZoneDropdown;
