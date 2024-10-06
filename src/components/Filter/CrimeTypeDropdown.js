import React, { useState, useEffect } from 'react';
import axios from 'axios';  // 用於從後端獲取數據
import '../../styles/Dropdown.css';  // 引入樣式

const CrimeTypeDropdown = ({ onCrimeTypeChange }) => {
    const [selectedCrimeType, setSelectedCrimeType] = useState('All Crimes');
    const [crimeTypes, setCrimeTypes] = useState(['All Crimes']);  // 初始化包含 "All Crimes"

    // 使用 useEffect 動態獲取犯罪類型
    useEffect(() => {
        const fetchCrimeTypes = async () => {
            try {
                const response = await axios.get('http://127.0.0.1:8000/crime-types');  // 從後端獲取數據
                setCrimeTypes(['All Crimes', ...response.data]);  // 將 "All Crimes" 放在列表頂部
            } catch (error) {
                console.error("Error fetching crime types:", error);
            }
        };

        fetchCrimeTypes();
    }, []);  // 空依賴數組確保只在組件加載時運行一次

    const handleCrimeTypeChange = (e) => {
        setSelectedCrimeType(e.target.value);
        onCrimeTypeChange(e.target.value);  // 傳遞選中的值給父組件
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
