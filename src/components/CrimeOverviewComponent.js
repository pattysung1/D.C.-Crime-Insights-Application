import React from 'react';
import CardComponent from './CardComponent';  // 引入卡片組件
import '../styles/CrimeOverviewComponent.css'; // 確保引入樣式

const CrimeOverviewComponent = ({
    totalCrimes,
    topCrimeType,
    highCrimeZone,
    methodOfCrime,
    shift,
}) => {
    return (
        <div className="crime-overview-container">
            <h2>Crime Overview</h2>
            <div className="overview-cards">
                {/* 使用條件渲染來顯示替代內容 */}
                <CardComponent title="Total Crimes" value={totalCrimes !== null && totalCrimes !== undefined ? totalCrimes : "N/A"} />
                <CardComponent title="Top Crime Type" value={topCrimeType || "N/A"} />
                <CardComponent title="High Crime Zone" value={highCrimeZone || "N/A"} />
                <CardComponent title="Method of Crime" value={methodOfCrime || "N/A"} />
                <CardComponent title="Shift" value={shift || "N/A"} />
            </div>
        </div>
    );
};

export default CrimeOverviewComponent;
