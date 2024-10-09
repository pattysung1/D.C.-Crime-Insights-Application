import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import '../styles/CrimeMap.css';
import { format } from 'date-fns';

// Create a custom red icon
const redIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const CrimeMapComponent = ({ crimeData }) => {
  return (
    <div className="crime-map-container" style={{ zIndex: 1 }}>
      <MapContainer center={[38.9072, -77.0369]} zoom={13} style={{ height: '600px', width: '100%', zIndex: 1 }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {crimeData.map((crime, index) => (
          <Marker key={index} position={[crime.lat, crime.lng]} icon={redIcon}>
            <Popup>
              <strong>Type:</strong> {crime.type}<br />
              <strong>Date:</strong> {format(new Date(crime.date), 'MMMM d, yyyy')}<br />
              <strong>Zone:</strong> {crime.zone}<br />
              <strong>Shift:</strong> {crime.shift}<br />
              <strong>Method:</strong> {crime.method}<br />
              <strong>ID:</strong> {crime.id}
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default CrimeMapComponent;
