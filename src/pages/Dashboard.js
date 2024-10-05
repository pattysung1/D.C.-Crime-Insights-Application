import React from 'react';
import CrimeOverviewComponent from '../components/CrimeOverviewComponent';
import CrimeTrendsChart from '../components/Chart/CrimeTrendLineChart';
import CrimeTypePieChart from '../components/Chart/CrimeTypePieChart'; // 引入新組件
// import '../styles/Dashboard.css';

const Dashboard = () => {
    return (
        <>
            <div className="content-container">
                <CrimeOverviewComponent /* 傳遞你的數據 */ />

                <section className="trends-section">
                    <CrimeTrendsChart /* 傳遞你的數據 */ />
                </section>

                <section className="crime-type-pie-section">
                    <CrimeTypePieChart />
                </section>
            </div>
        </>
    );
};

export default Dashboard;
