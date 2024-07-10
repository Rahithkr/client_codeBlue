import { useGoogleMap } from '@react-google-maps/api';
import React, { useEffect } from 'react';

interface AdvancedMarkerProps {
    position: google.maps.LatLngLiteral;
    map: google.maps.Map | null;
  }
  
  const AdvancedMarker: React.FC<AdvancedMarkerProps> = ({ position, map }) => {
    useEffect(() => {
      if (!map) return;
  
      const marker = new google.maps.Marker({
        position,
        map,
        icon: {
          path: google.maps.SymbolPath.CIRCLE,
          scale: 8,
          fillColor: '#0000ff',
          fillOpacity: 1,
          strokeWeight: 0,
          anchor: new google.maps.Point(0, 0),
        },
      });
  
      return () => {
        marker.setMap(null);
      };
    }, [map, position]);
  
    return null;
  };
  

export default AdvancedMarker;
