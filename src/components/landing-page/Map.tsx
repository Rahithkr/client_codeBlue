// components/Map.js
import React, { useMemo } from 'react';
import { GoogleMap, Marker } from '@react-google-maps/api';

export default function Map() {
  const center = useMemo(() => ({ lat: 8.52876353530688, lng: 76.94133278788837 }), []);
  
  return (
    <div style={{ width: '100%', height: '400px' }}>
      <GoogleMap
        zoom={10}
        center={center}
        mapContainerStyle={{ width: '100%', height: '100%' }}
      >
        <Marker position={center} />
      </GoogleMap>
    </div>
  );
}
