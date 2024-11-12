import React, { useState, useEffect } from "react";
import Filter from "../components/Filter/Filter"; // Include filter
import CrimeMapComponent from "../components/CrimeMapComponent"; // Map display component
import axios from "axios"; // Used to send requests to the backend// Make sure to create this CSS file if it doesn't exist

const CrimeMap = () => {
  const [crimeData, setCrimeData] = useState([]); // Store all crime data
  const [filteredData, setFilteredData] = useState([]); // Store filtered data
  const [crimeTypes, setCrimeTypes] = useState(["All Crimes"]); // Dynamic crime types
  const [crimeZones, setCrimeZones] = useState(["All Zones"]); // Dynamic crime zones
  const [filters, setFilters] = useState({
    crimeType: "All Crimes", // Default to show all crime types
    crimeZone: "All Zones", // Default to all zones
    dates: [null, null], // Default no date filter
  });

  // Fetch crime data and filter options from the backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [crimeDataResponse, crimeTypesResponse, crimeZonesResponse] =
          await Promise.all([
            axios.get("/api/crime-data"),
            axios.get("/api/crime-types"),
            axios.get("/api/crime-zones"),
          ]);

        setCrimeData(crimeDataResponse.data);
        setFilteredData(crimeDataResponse.data);
        setCrimeTypes([
          "All Crimes",
          ...crimeTypesResponse.data.map((type) => type.toString()),
        ]);

        // Check if 'All Zones' is already included in the response
        const zones = crimeZonesResponse.data.map((zone) => zone.toString());
        setCrimeZones(
          zones.includes("All Zones") ? zones : ["All Zones", ...zones]
        );

        // Log the fetched data
        console.log("Crime Types:", crimeTypesResponse.data);
        console.log("Crime Zones:", crimeZonesResponse.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const { crimeType, crimeZone, dates } = filters; // Extract filter conditions

    const filtered = crimeData.filter((crime) => {
      const matchType = crimeType === "All Crimes" || crime.type === crimeType; // If "All Crimes", don't filter by type
      const matchZone =
        crimeZone === "All Zones" ||
        (crime.zone && crime.zone.toString() === crimeZone); // Check if crime.zone exists before calling toString
      const matchDate =
        !dates[0] || // If no date filter, pass all data
        (new Date(crime.date) >= new Date(dates[0]) &&
          new Date(crime.date) <= new Date(dates[1])); // Filter data within date range

      return matchType && matchZone && matchDate; // Return only if all conditions match
    });

    setFilteredData(filtered); // Update filtered data
  }, [filters, crimeData]); // Re-filter whenever filters or crimeData change

  // Handle filter changes
  const handleFilterChange = (newFilters) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      ...newFilters, // Update filter values
    }));
  };

  return (
    <div className="crime-map-page">
      <div className="filter-section">
        <Filter
          filters={filters}
          handleFilterChange={handleFilterChange}
          crimeTypes={crimeTypes}
          crimeZones={crimeZones}
        />
      </div>
      <div className="map-section">
        <CrimeMapComponent crimeData={filteredData} />
      </div>
    </div>
  );
};

export default CrimeMap;
