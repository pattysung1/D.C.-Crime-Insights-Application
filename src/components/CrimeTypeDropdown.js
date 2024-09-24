import React, { useState } from 'react';
import '../styles/Dropdown.css'; // 新增的 CSS 文件

const CrimeTypeDropdown = ({ onCrimeTypeChange }) => {
    const [selectedCrimeType, setSelectedCrimeType] = useState('');

    const crimeTypes = [
        'All Crimes',
        'Burglary',
        'Assault',
        'Theft',
        'Vandalism',
        'Drugs',
        // 根據實際需求新增其他犯罪類型
    ];

    const handleCrimeTypeChange = (e) => {
        setSelectedCrimeType(e.target.value);
        // 傳遞選擇的犯罪類型給父組件
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
