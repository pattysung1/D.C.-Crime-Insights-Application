import React, { useState } from 'react';
import { DatePickerInput } from '@mantine/dates';
import { MantineProvider } from '@mantine/core';
import '@mantine/core/styles.css';
import '@mantine/dates/styles.css';

const DateFilterComponent = ({ onDateChange }) => {
  const [dateRange, setDateRange] = useState([null, null]);

  // Calculate the date range for the last 30 days
  const today = new Date();
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(today.getDate() - 30);

  const handleDateChange = (newDateRange) => {
    setDateRange(newDateRange);
    onDateChange(newDateRange);
  };

  return (
    <MantineProvider>
      <div className="fancy-dropdown">
        <h2>Date Range</h2>
        <DatePickerInput
          type="range"
          placeholder="Pick dates range"
          value={dateRange}
          onChange={handleDateChange}
          minDate={thirtyDaysAgo}
          maxDate={today}
          mx="auto"
          maw={400}
        />
      </div>
    </MantineProvider>
  );
};

export default DateFilterComponent;
