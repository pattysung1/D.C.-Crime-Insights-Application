import React from 'react';
import Filter from '../components/Filter/Filter'; // 引入 Filter 組件
// import '../styles/CrimeMap.css'; // 假設你有相關樣式

const CrimeMap = ({ filters, handleFilterChange, handleCrimeTypeChange, handleZoneChange }) => {
    return (
        <div className="crime-map-container">
            {/* 在 CrimeMap 中添加 Filter */}
            <Filter
                handleFilterChange={handleFilterChange}
                handleCrimeTypeChange={handleCrimeTypeChange}
                handleZoneChange={handleZoneChange}
            />

            {/* 這裡可以放你的地圖展示部分 */}
            <div className="map-display">
                {/* 地圖的代碼... */}
            </div>
        </div>
    );
};

export default CrimeMap;
