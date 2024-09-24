// src/components/FilterComponent.js
import React, { useState } from 'react';
import { DatePicker, Button } from 'antd';

const { RangePicker } = DatePicker;

const FilterComponent = ({ onFilterChange }) => {
  const [dates, setDates] = useState(null);

  const handleFilter = () => {
    // Pass the selected dates back to the main page
    onFilterChange(dates);
    // TODO: Backend data filtering API
    // axios.get('/api/crime-stats', { params: { startDate: dates[0], endDate: dates[1] } });
  };

  return (
    <div style={{ marginBottom: '20px' }}>
      <h2>Data Filter</h2>
      <RangePicker onChange={(dates) => setDates(dates)} />
      <Button type="primary" onClick={handleFilter} style={{ marginLeft: '10px' }}>
        Filter
      </Button>
    </div>
  );
};

export default FilterComponent;
