



// 'use client'

// import React, { useCallback, useEffect, useRef, useState } from 'react';
// import { GoogleMap, useLoadScript ,Marker} from '@react-google-maps/api';
// import axios from 'axios';
// import { Libraries } from "@react-google-maps/api";
// import dotenv from 'dotenv'

// dotenv.config()
// const libraries: Libraries = ["places"];
// interface Props {
//   email: string;
//   pickupPosition: Position | null;
//   destinationPosition: Position | null;
//   onPickupPositionChange: (position: Position) => void;
// }

// const mapContainerStyle = {
//   width: '100%',
//   height: '700px',
// };

// const defaultCenter = {
//   lat: 8.527065900911122,
//   lng: 76.95403572880213
// };

// interface Position {
//   lat: number;
//   lng: number;
// }

// const UserMap = ({ email, pickupPosition, destinationPosition, onPickupPositionChange }: Props) => {
//   const { isLoaded, loadError } = useLoadScript({
//     googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAP_API_KEY !,
//     libraries,
//   });

  

//   const [userPosition, setUserPosition] = useState<Position | null>(null);
//   const mapRef = useRef<google.maps.Map | null>(null);
//   const hasChosenPickupLocation = pickupPosition !== null;


//  useEffect(() => {
//     if (navigator.geolocation) {
//       const options = {
//         enableHighAccuracy: true,
//         timeout: 10000,  // 10 seconds
//         maximumAge: 0,   // Don't use cached positions
//       };

//       navigator.geolocation.getCurrentPosition(
//         (position) => {
//           updateUserPosition(position);
//         },
//         (error) => {
//           console.error("Error getting current location:", error);
//         },
//         options
//       );

//       const watchId = navigator.geolocation.watchPosition(
//         updateUserPosition,
//         (error) => {
//           console.error("Error watching position:", error);
//         },
//         options
//       );

//       return () => navigator.geolocation.clearWatch(watchId);
//     } else {
//       console.error("Geolocation is not supported by this browser.");
//     }
//   }, [email, hasChosenPickupLocation]);

//   const onMapLoad = useCallback((map: google.maps.Map) => {
//     mapRef.current = map;
//   }, []);

//   const updateUserPosition = (position: GeolocationPosition) => {
//     const newUserPosition = {
//       lat: position.coords.latitude,
//       lng: position.coords.longitude,
//     };
//     setUserPosition(newUserPosition);

    
//     if (!hasChosenPickupLocation) {
//       updateUserLocation(newUserPosition, email);
//     }
//   };

// ;

//   const updateUserLocation = async (newPosition: Position, email: string) => {
//     console.log("frontend update location");
//     console.log("email:", email);

//     try {
//       await axios.post('http://localhost:5000/server/user/location', {
//         email,
//         latitude: newPosition.lat,
//         longitude: newPosition.lng,
//       });
//     } catch (error) {
//       console.error('Error updating user location:', error);
//     }
//   };

//   const handleMapClick = (event: google.maps.MapMouseEvent) => {
//     if (!hasChosenPickupLocation && event.latLng) {
//       const clickedPosition = {
//         lat: event.latLng.lat(),
//         lng: event.latLng.lng(),
//       };

//       // Set the pickup position
//       onPickupPositionChange(clickedPosition);
//     }
//   };

//   useEffect(() => {
//     if (navigator.geolocation) {
//       navigator.geolocation.getCurrentPosition((position) => {
//         updateUserPosition(position);
//       }, console.error, {
//         enableHighAccuracy: true,
//       });

//       const watchId = navigator.geolocation.watchPosition(updateUserPosition, console.error, {
//         enableHighAccuracy: true,
//         maximumAge: 10000,
//         timeout: 5000,
//       });

//       return () => navigator.geolocation.clearWatch(watchId);
//     }
//   }, []);

//   if (loadError) return <div>Error loading maps</div>;
//   if (!isLoaded) return <div>Loading maps</div>;

//   return (
//     <div className=''>
//       <GoogleMap
//         mapContainerStyle={mapContainerStyle}
//         zoom={16}
//         center={userPosition || defaultCenter}
//         onLoad={onMapLoad}
//         onClick={handleMapClick}
//       >
//         {!hasChosenPickupLocation && userPosition && <Marker position={userPosition} />}
//         {pickupPosition && <Marker position={pickupPosition} />}
//         {destinationPosition && <Marker position={destinationPosition} />}
//       </GoogleMap>
//     </div>
//   );
// };

// export default UserMap;


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
  lat: 8.527065900911122,
  lng: 76.95403572880213
};

interface Position {
  lat: number;
  lng: number;
}

interface Props {
  email: string;
  pickupPosition: Position | null;
  destinationPosition: Position | null;
  onPickupPositionChange: (position: Position) => void;
}

const UserMap: React.FC<any> = ({ email, pickupPosition, destinationPosition, onPickupPositionChange }) => {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAP_API_KEY!,
    libraries,
  });

  const [userPosition, setUserPosition] = useState<Position | null>(null);
  const mapRef = useRef<google.maps.Map | null>(null);
  const hasChosenPickupLocation = pickupPosition !== null;

  const updateUserPosition = useCallback((position: GeolocationPosition) => {
    const newUserPosition = {
      lat: position.coords.latitude,
      lng: position.coords.longitude,
    };
    setUserPosition(newUserPosition);

    if (!hasChosenPickupLocation) {
      updateUserLocation(newUserPosition, email);
    }
  }, [email, hasChosenPickupLocation]);

  useEffect(() => {
    if (navigator.geolocation) {
      const options = {
        enableHighAccuracy: true,
        timeout: 10000,  // 10 seconds
        maximumAge: 0,   // Don't use cached positions
      };

      navigator.geolocation.getCurrentPosition(
        (position) => {
          updateUserPosition(position);
        },
        (error) => {
          console.error("Error getting current location:", error);
        },
        options
      );

      const watchId = navigator.geolocation.watchPosition(
        updateUserPosition,
        (error) => {
          console.error("Error watching position:", error);
        },
        options
      );

      return () => navigator.geolocation.clearWatch(watchId);
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  }, [updateUserPosition]);

  const onMapLoad = useCallback((map: google.maps.Map) => {
    mapRef.current = map;
  }, []);

  const updateUserLocation = async (newPosition: Position, email: string) => {
    console.log("frontend update location");
    console.log("email:", email);

    try {
      await axios.post('http://localhost:5000/server/user/location', {
        email,
        latitude: newPosition.lat,
        longitude: newPosition.lng,
      });
    } catch (error) {
      console.error('Error updating user location:', error);
    }
  };

  const handleMapClick = (event: google.maps.MapMouseEvent) => {
    if (!hasChosenPickupLocation && event.latLng) {
      const clickedPosition = {
        lat: event.latLng.lat(),
        lng: event.latLng.lng(),
      };

      // Set the pickup position
      onPickupPositionChange(clickedPosition);
    }
  };

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        updateUserPosition(position);
      }, console.error, {
        enableHighAccuracy: true,
      });

      const watchId = navigator.geolocation.watchPosition(updateUserPosition, console.error, {
        enableHighAccuracy: true,
        maximumAge: 10000,
        timeout: 5000,
      });

      return () => navigator.geolocation.clearWatch(watchId);
    }
  }, [updateUserPosition]);

  if (loadError) return <div>Error loading maps</div>;
  if (!isLoaded) return <div>Loading maps</div>;

  return (
    <div className=''>
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        zoom={16}
        center={userPosition || defaultCenter}
        onLoad={onMapLoad}
        onClick={handleMapClick}
      >
        {!hasChosenPickupLocation && userPosition && <Marker position={userPosition} />}
        {pickupPosition && <Marker position={pickupPosition} />}
        {destinationPosition && <Marker position={destinationPosition} />}
      </GoogleMap>
    </div>
  );
};

export default UserMap;
