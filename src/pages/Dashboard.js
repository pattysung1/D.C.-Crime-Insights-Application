import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CrimeOverviewComponent from '../components/CrimeOverviewComponent';
import CrimeTrendsChart from '../components/Chart/CrimeTrendLineChart';
import CrimeTypePieChart from '../components/Chart/CrimeTypePieChart';
import StackedBarChart from '../components/Chart/StackedBarChart';  // Import the new component
import '../styles/Dashboard.css';

const Dashboard = () => {
    const [dashboardData, setDashboardData] = useState(null);
    const [monthlyCrimeData, setMonthlyCrimeData] = useState([]);  // State for monthly crime data
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Fetch data from the backend
        const fetchDashboardData = async () => {
            try {
                const response = await axios.get('/api/dashboard');
                setDashboardData(response.data.dashboard);
            } catch (error) {
                console.error('Error fetching dashboard data:', error);
                setError('Failed to fetch dashboard data');
            } finally {
                setLoading(false);
            }
        };

        const fetchMonthlyCrimeData = async () => {
            try {
                const response = await axios.get('/api/monthly-crime-data');
                setMonthlyCrimeData(response.data);
            } catch (error) {
                console.error('Error fetching monthly crime data:', error);
                setError('Failed to fetch monthly crime data');
            }
        };

        fetchDashboardData();
        fetchMonthlyCrimeData();
    }, []);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    // Transform the crime distribution data for CrimeTypePieChart
    const crimeTypeData = dashboardData && dashboardData.distribution
        ? Object.entries(dashboardData.distribution).map(([type, value]) => ({
            type,
            value
        }))
        : [];

    // Set trend data for CrimeTrendsChart
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

                {/* Use flexbox layout */}
                <div className="chart-row">
                    <section className="trends-section">
                        <CrimeTrendsChart crimeData={trendData} />
                    </section>

                    <section className="crime-type-pie-section">
                        <CrimeTypePieChart crimeTypeData={crimeTypeData} />
                    </section>
                </div>

                {/* Add StackedBarChart for monthly crime distribution */}
                <div className="stacked-bar-chart-section">
                    <StackedBarChart monthlyCrimeData={monthlyCrimeData} />
                </div>
            </div>
        </>
    );
};

export default Dashboard;
