import React from 'react';
import { Select } from '@mantine/core';

const CrimeTypeDropdown = ({ onCrimeTypeChange, crimeTypes, selectedCrimeType }) => {
    const handleChange = (value) => {
        onCrimeTypeChange(value);
    };

    return (
        <div className="fancy-dropdown">
            <h2>Crime Type</h2>
            <Select
                data={crimeTypes.map(type => ({ value: type, label: type }))}
                value={selectedCrimeType}
                onChange={handleChange}
                placeholder="Select crime type"
                searchable
                nothingFound="No options"
                maxDropdownHeight={280}
            />
        </div>
    );
};

export default CrimeTypeDropdown;
