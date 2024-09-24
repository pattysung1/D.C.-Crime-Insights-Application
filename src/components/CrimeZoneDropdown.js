import React, { useState } from 'react';
import '../styles/Dropdown.css'; // 新增的 CSS 文件

const CrimeZoneDropdown = ({ onZoneChange }) => {
    const [selectedZone, setSelectedZone] = useState('');

    const crimeZones = ['District of Columbia', 'Maryland', 'Virginia'];

    const handleZoneChange = (e) => {
        setSelectedZone(e.target.value);
        // 傳遞選擇的區域給父組件
        onZoneChange(e.target.value);
    };

    return (
        <div className="dropdown">
            <h2>Crime Zone</h2>
            <select id="crime-zone" value={selectedZone} onChange={handleZoneChange}>
                <option value="">Select a zone</option>
                {crimeZones.map((zone) => (
                    <option key={zone} value={zone}>
                        {zone}
                    </option>
                ))}
            </select>
        </div>
    );
};

export default CrimeZoneDropdown;
