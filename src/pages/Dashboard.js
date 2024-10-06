import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CrimeOverviewComponent from '../components/CrimeOverviewComponent';
import CrimeTrendsChart from '../components/Chart/CrimeTrendLineChart';
import CrimeTypePieChart from '../components/Chart/CrimeTypePieChart';
import '../styles/Dashboard.css';

const Dashboard = () => {
    const [dashboardData, setDashboardData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Fetch data from the backend
        const fetchDashboardData = async () => {
            try {
                const response = await axios.get('http://127.0.0.1:8000/dashboard');
                setDashboardData(response.data.dashboard);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching data:', error);
                setError('Failed to fetch data');
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    // Add safe checks to ensure data exists before transforming
    const crimeTypeData = dashboardData && dashboardData.distribution
        ? Object.entries(dashboardData.distribution).map(([type, value]) => ({
            type,
            value
        }))
        : [];


    const trendData = dashboardData && dashboardData.trends ? dashboardData.trends : [];

    return (
        <>
            <div className="content-container">
                {/* Pass specific props to CrimeOverviewComponent */}
                <CrimeOverviewComponent
                    totalCrimes={dashboardData?.overview?.total_crimes || 0}
                    topCrimeType={dashboardData?.overview?.top_crime_type || "N/A"}
                    highCrimeZone={dashboardData?.overview?.high_crime_zone || "N/A"}
                    methodOfCrime={dashboardData?.overview?.top_method || "N/A"}
                    shift={dashboardData?.overview?.top_shift || "N/A"}
                />

                {/* 使用 flexbox 進行佈局 */}
                <div className="chart-row">
                    <section className="trends-section">
                        <CrimeTrendsChart crimeData={trendData} />
                    </section>

                    <section className="crime-type-pie-section">
                        <CrimeTypePieChart crimeTypeData={crimeTypeData} />
                    </section>
                </div>
            </div>
        </>
    );
};

export default Dashboard;
