import React, { useState, useEffect } from 'react';
import LeafletOpenStreetMapComponent from './LeafletOpenStreetMapComponent';
import axios from 'axios';

const CrimeMapComponent = () => {
  const [crimeData, setCrimeData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCrimeData = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/crime-data');  // 確認後端URL
        setCrimeData(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to fetch crime data');
        setLoading(false);
      }
    };

    fetchCrimeData();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h2>Crime Map</h2>
      <LeafletOpenStreetMapComponent crimeData={crimeData} />
    </div>
  );
};

export default CrimeMapComponent;
