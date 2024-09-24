import React from 'react';

const SummaryComponent = () => {
  // static data
  const summaryData = {
    trend: 'down',
    change: 4389,
    dateRange: '1/1/2024 - 9/24/2024',
    comparedTo: '1/1/2023 - 9/24/2023',
  };

  return (
    <div>
      <h2>In Summary</h2>
      <div style={{ backgroundColor: '#e8f5e9', padding: '10px', borderRadius: '8px' }}>
        <p>
          All crimes went <strong>{summaryData.trend}</strong> by{' '}
          <strong>{summaryData.change.toLocaleString()}</strong> citywide during the past 1 year
          to date when compared to the same dates a year before.
        </p>
      </div>
      <div>
        <h4>Your search</h4>
        <p>{summaryData.dateRange}</p>
        <h4>Compared to</h4>
        <p>{summaryData.comparedTo}</p>
      </div>
    </div>
  );
};

export default SummaryComponent;
