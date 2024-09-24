// src/components/GoogleMapComponent.js
import React from 'react';
import { GoogleMap, useLoadScript, Marker } from '@react-google-maps/api';

const containerStyle = {
  width: '100%',
  height: '500px',
};

const center = {
  lat: 38.9072, // location of Whashington DC
  lng: -77.0369,
};

const GoogleMapComponent = () => {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: 'AIzaSyCHlL5PC4A9jE1rSRTxQT1dcILKiL17V2A',
  });

  // static data
  const crimeData = [
    { id: 1, lat: 38.912, lng: -77.038, type: 'Robbery' },
    { id: 2, lat: 38.907, lng: -77.041, type: 'Assault' },
  ];

  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  return (
    <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={12}>
      {crimeData.map((crime) => (
        <Marker key={crime.id} position={{ lat: crime.lat, lng: crime.lng }} />
      ))}
    </GoogleMap>
  );
};

export default GoogleMapComponent;
