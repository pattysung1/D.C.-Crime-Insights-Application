import React from 'react';
import TotalsComponent from '../components/TotalsComponent';
import '../styles/Reports.css'; // CSS

const Reports = ({filters}) => {
    return (
        <div>
            <h2>Reports</h2>
            <p>This is the Reports page content.</p>
            <div className="totals-section">
                    <TotalsComponent crimeType={filters.crimeType} crimeZone={filters.crimeZone} />
                </div>
            {/* 你可以在這裡加入 Reports 相關的內容 */}
        </div>
    );
};

export default Reports;
