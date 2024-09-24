// src/components/FilterComponent.js
import React, { useState } from 'react';
import { DatePicker, Button } from 'antd';

const { RangePicker } = DatePicker;

const DateFilterComponent = ({ onFilterChange }) => {
  const [dates, setDates] = useState(null);

  const handleFilter = () => {
    // Pass the selected dates back to the main page
    onFilterChange(dates);
    // TODO: Backend data filtering API
    // axios.get('/api/crime-stats', { params: { startDate: dates[0], endDate: dates[1] } });
  };

  return (
    <div style={{ marginBottom: '20px' }}>
      <h2>Date Filter</h2>
      <RangePicker onChange={(dates) => setDates(dates)} />
      <Button type="primary" onClick={handleFilter} style={{ marginLeft: '10px' }}>
        Search
      </Button>
    </div>
  );
};

export default DateFilterComponent;
