


// 'use client';

// import React, { useCallback, useEffect, useRef, useState } from 'react';
// import { GoogleMap, useLoadScript, Marker } from '@react-google-maps/api';
// import axios from 'axios';
// import { Libraries } from "@react-google-maps/api";
// import dotenv from 'dotenv'

// dotenv.config()
// const libraries: Libraries = ["places"];
// interface Props {
//   email: string;
// }
// const mapContainerStyle = {
//   width: '100%',
//   height: '700px',
// };

// const defaultCenter = {
//   lat: 8.521633420171844,
//   lng: 76.93652626927961
// };

// const DriverMap = ({ email }: Props) => {
//   const { isLoaded, loadError } = useLoadScript({
//     googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAP_API_KEY !,
//     libraries,
//   });

//   const [driverPosition, setDriverPosition] = useState(defaultCenter);
//   const [markerPosition, setMarkerPosition] = useState<null | google.maps.LatLngLiteral>(null);
//   const mapRef = useRef(null);

//   const onMapLoad = useCallback((map:any) => {
//     mapRef.current = map;
//   }, []);

//   const onMapClick = useCallback((event: google.maps.MapMouseEvent) => {
//     if (event.latLng) {
//       const newMarkerPosition = {
//         lat: event.latLng.lat(),
//         lng: event.latLng.lng(),
//       };
//       setMarkerPosition(newMarkerPosition);
//     }
//   }, []);

//   const updateDriverPosition = (position:any) => {
//     const newDriverPosition = {
//       lat: position.coords.latitude,
//       lng: position.coords.longitude,
//     };
//     setDriverPosition(newDriverPosition);

//     // Send updated position to the backend
//     updateDriverLocation(newDriverPosition, email);
//   };

//   const updateDriverLocation = async (newPosition: any, email: any) => {
//     try {
//       await axios.post('http://localhost:5000/server/driver/location', {
//         email,
//         latitude: newPosition.lat,
//         longitude: newPosition.lng,
//       });
//     } catch (error) {
//       console.error('Error updating driver location:', error);
//     }
//   };

//   useEffect(() => {
//     if (navigator.geolocation) {
//       const watchId = navigator.geolocation.watchPosition(updateDriverPosition, console.error, {
//         enableHighAccuracy: true,
//         maximumAge: 10000,
//         timeout: 5000,
//       });

//       // Clean up the watcher on unmount
//       return () => navigator.geolocation.clearWatch(watchId);
//     }
//   }, []);

//   if (loadError) return <div>Error loading maps</div>;
//   if (!isLoaded) return <div>Loading maps</div>;

//   return (
//     <div className=''>
//       <GoogleMap
//         mapContainerStyle={mapContainerStyle}
//         zoom={14}
//         center={driverPosition}
//         onLoad={onMapLoad}
//         onClick={onMapClick}
//       >
//         <Marker position={driverPosition} />
//         {markerPosition && <Marker position={markerPosition} />}
//       </GoogleMap>
//       {markerPosition && (
//         <div>
//           <h3>Selected Location</h3>
//           <p>Latitude: {markerPosition.lat}</p>
//           <p>Longitude: {markerPosition.lng}</p>
//         </div>
//       )}
//     </div>
//   );
// };

// export default DriverMap;


'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { GoogleMap, useLoadScript, Marker } from '@react-google-maps/api';
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();
const libraries: ["places"] = ["places"];

const mapContainerStyle = {
  width: '100%',
  height: '700px',
};

const defaultCenter = {
  lat: 8.521633420171844,
  lng: 76.93652626927961
};

interface DriverMapProps {
  email: string;
}

const DriverMap: React.FC<any> = ({ email })  => {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAP_API_KEY!,
    libraries,
  });

  const [driverPosition, setDriverPosition] = useState(defaultCenter);
  const [markerPosition, setMarkerPosition] = useState<google.maps.LatLngLiteral | null>(null);
  const mapRef = useRef<google.maps.Map | null>(null);

  const onMapLoad = useCallback((map: google.maps.Map) => {
    mapRef.current = map;
  }, []);

  const onMapClick = useCallback((event: google.maps.MapMouseEvent) => {
    if (event.latLng) {
      const newMarkerPosition = {
        lat: event.latLng.lat(),
        lng: event.latLng.lng(),
      };
      setMarkerPosition(newMarkerPosition);
    }
  }, []);

  

  const updateDriverPosition = useCallback((position: GeolocationPosition) => {
    const newDriverPosition = {
      lat: position.coords.latitude,
      lng: position.coords.longitude,
    };
    setDriverPosition(newDriverPosition);

    // Send updated position to the backend
    updateDriverLocation(newDriverPosition, email);
  }, [email]);

  const updateDriverLocation = async (newPosition: { lat: number; lng: number }, email: string) => {
    try {
      await axios.post('http://localhost:5000/server/driver/location', {
        email,
        latitude: newPosition.lat,
        longitude: newPosition.lng,
      });
    } catch (error) {
      console.error('Error updating driver location:', error);
    }
  };

  useEffect(() => {
    if (navigator.geolocation) {
      const watchId = navigator.geolocation.watchPosition(updateDriverPosition, console.error, {
        enableHighAccuracy: true,
        maximumAge: 10000,
        timeout: 5000,
      });

      // Clean up the watcher on unmount
      return () => navigator.geolocation.clearWatch(watchId);
    }
  }, [updateDriverPosition]);

  if (loadError) return <div>Error loading maps</div>;
  if (!isLoaded) return <div>Loading maps</div>;

  return (
    <div className=''>
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        zoom={14}
        center={driverPosition}
        onLoad={onMapLoad}
        onClick={onMapClick}
      >
        <Marker position={driverPosition} />
        {markerPosition && <Marker position={markerPosition} />}
      </GoogleMap>
      {markerPosition && (
        <div>
          <h3>Selected Location</h3>
          <p>Latitude: {markerPosition.lat}</p>
          <p>Longitude: {markerPosition.lng}</p>
        </div>
      )}
    </div>
  );
};

export default DriverMap;
