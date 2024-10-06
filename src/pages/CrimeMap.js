import React, { useState, useEffect } from 'react';
import Filter from '../components/Filter/Filter';  // 包含篩選器
import CrimeMapComponent from '../components/CrimeMapComponent';  // 地圖顯示組件
import axios from 'axios';  // 用於向後端發送請求

const CrimeMap = () => {
    const [crimeData, setCrimeData] = useState([]);  // 存儲所有犯罪數據
    const [filteredData, setFilteredData] = useState([]);  // 存儲篩選後的數據
    const [filters, setFilters] = useState({
        crimeType: 'All Crimes',  // 默認為顯示所有犯罪類型
        crimeZone: 'All Zones',  // 默認為所有區域
        dates: [null, null],  // 默認無日期篩選
    });

    // 從後端獲取犯罪數據
    useEffect(() => {
        const fetchCrimeData = async () => {
            try {
                const response = await axios.get('http://127.0.0.1:8000/crime-data');  // 獲取後端的所有犯罪數據
                setCrimeData(response.data);  // 存儲所有數據
                setFilteredData(response.data);  // 初次顯示所有數據
            } catch (error) {
                console.error('Error fetching crime data:', error);  // 如果有錯誤則顯示
            }
        };

        fetchCrimeData();
    }, []);

    // 根據篩選器條件過濾數據
    useEffect(() => {
        const { crimeType, crimeZone, dates } = filters;  // 提取篩選條件

        const filtered = crimeData.filter((crime) => {
            const matchType = crimeType === 'All Crimes' || crime.type === crimeType;  // 如果是 "All Crimes" 則不篩選類別
            const matchZone = crimeZone === 'All Zones' || crime.zone === crimeZone;  // 如果是 "All Zones" 則不篩選區域
            const matchDate = !dates[0] ||  // 如果沒有日期篩選，則通過所有數據
                (new Date(crime.date) >= new Date(dates[0]) && new Date(crime.date) <= new Date(dates[1]));  // 篩選日期範圍內的數據

            return matchType && matchZone && matchDate;  // 所有條件都匹配才返回
        });

        setFilteredData(filtered);  // 更新篩選後的數據
    }, [filters, crimeData]);  // 每當 filters 或 crimeData 變化時重新篩選

    // 處理篩選器的變更
    const handleFilterChange = (newFilters) => {
        setFilters((prevFilters) => ({
            ...prevFilters,
            ...newFilters,  // 更新篩選器的值
        }));
    };

    return (
        <div className="crime-map-container">
            {/* 篩選器 */}
            <Filter filters={filters} handleFilterChange={handleFilterChange} />

            {/* 地圖展示區域，顯示篩選後的數據 */}
            <CrimeMapComponent crimeData={filteredData} />
        </div>
    );
};

export default CrimeMap;
