import React from "react";
import { Select } from "@mantine/core";

const CrimeZoneDropdown = ({ onZoneChange, crimeZones, selectedCrimeZone }) => {
  const handleChange = (value) => {
    onZoneChange(value);
  };

  // Sort the crime zones numerically
  const sortedCrimeZones = [
    "All Zones",
    ...[...crimeZones]
      .map((zone) => parseInt(zone)) // Convert to integers for sorting
      .filter((zone) => zone >= 1 && zone <= 8) // Only include zones between 1-8
      .sort((a, b) => a - b) // Sort numerically
      .map((zone) => zone.toString()), // Convert the final values back to strings
  ];

  return (
    <div className="fancy-dropdown">
      <h2>Crime Zone</h2>
      <Select
        data={sortedCrimeZones.map((zone) => ({ value: zone, label: zone }))}
        value={selectedCrimeZone}
        onChange={handleChange}
        placeholder="All Zones"
        searchable
        nothingFound="No options"
        maxDropdownHeight={280}
      />
    </div>
  );
};

export default CrimeZoneDropdown;
