import React, { useState } from 'react';
import '../../styles/Dropdown.css'; // Import the new CSS file

const CrimeTypeDropdown = ({ onCrimeTypeChange }) => {
    const [selectedCrimeType, setSelectedCrimeType] = useState('');

    const crimeTypes = [
        'All Crimes',
        'Burglary',
        'Assault',
        'Theft',
        'Vandalism',
        'Drugs',
        // Add other crime types as needed
    ];

    const handleCrimeTypeChange = (e) => {
        setSelectedCrimeType(e.target.value);
        // Pass the selected crime type to the parent component
        onCrimeTypeChange(e.target.value);
    };

    return (
        <div className="dropdown">
            <h2>Crime Type</h2>
            <select id="crime-type" value={selectedCrimeType} onChange={handleCrimeTypeChange}>
                {crimeTypes.map((type) => (
                    <option key={type} value={type}>
                        {type}
                    </option>
                ))}
            </select>
        </div>
    );
};

export default CrimeTypeDropdown;
