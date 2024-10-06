import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';

// Define the style of the map container
const containerStyle = {
  width: '100%',
  height: '500px',
};

// Set the center point to Washington DC
const center = {
  lat: 38.9072,
  lng: -77.0369,
};

// Customize Marker icon (Leaflet requires manual specification)
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

const LeafletOpenStreetMapComponent = ({ crimeData }) => {
  return (
    <MapContainer center={center} zoom={12} style={containerStyle}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      {crimeData.map((crime) => (
        <Marker key={crime.id} position={[crime.lat, crime.lng]}>
          <Popup>
            <div>
              <strong>Crime Type:</strong> {crime.type}<br />
              <strong>Latitude:</strong> {crime.lat}<br />
              <strong>Longitude:</strong> {crime.lng}<br />
              <strong>Shift:</strong> {crime.shift}
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default LeafletOpenStreetMapComponent;
