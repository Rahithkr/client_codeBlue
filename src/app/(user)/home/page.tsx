
'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import Header from '@/components/landing-page/Header';
import { signOut } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import UserMap from '@/app/UserMap/page';
import { Autocomplete, useLoadScript } from '@react-google-maps/api';
import axios from 'axios';
import socket from '../../../lib/socket';
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import dotenv from 'dotenv'

dotenv.config()

const libraries: ('places')[] = ['places'];

interface Position {
  lat: number;
  lng: number;
  address?: string;

}

interface Notification {
  message: string;
}
interface Registration {
  documentNumber: string;
  documentImage: string;
  vehicleModel: string;
  vehicleNumber: string;
  status: string;
}

interface Vehicle {
  _id: string;
  drivername: string;
  email: string;
  mobile: number;
  status: string;
  latitude: number;
  longitude: number;
  location: {
    type: string;
    coordinates: [number, number];
  };
  registration: Registration[];
}
type DriverInfo = {
  drivername: string;
  vehicleModel: string;
  vehicleNumber: string;
  mobile: string;
  otp:String;
  registration: Registration[];
  tripAmount: number;
  driverId: string; // Example, replace with actual type
  email:string
};
interface RideResponse {
  userSocketId: string;
  approved: boolean;
  driverInfo?: DriverInfo;
  tripAmount:number
}

function Home() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get('email') || '';

    
  const [pickupPosition, setPickupPosition] = useState<Position | null>(null);
  const [destinationPosition, setDestinationPosition] = useState<Position | null>(null);
  const [availableVehicles, setAvailableVehicles] = useState<Vehicle[]>([]);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [loading, setLoading] = useState(false);
  const [driverDetails, setDriverDetails] =  useState<DriverInfo | null>(null);
  const [amount,setAmount]=useState<any  >()
  const [tripId, setTripId] = useState<string | null>(null); // Add state for tripId
  const [incomingCall, setIncomingCall] = useState<{ handleCallRequests: any } | null>(null); // State for incoming call notification

console.log("driversdteails",driverDetails);

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAP_API_KEY ! ,
    libraries,                                           
  });

  const handleSignOut = async () => {
    await signOut({ redirect: false });
    router.push('/login');
  };




  const handlePlaceSelect = useCallback((autocompleteRef: any, type: 'pickup' | 'destination') => {
    const place = autocompleteRef.current?.getPlace();
    const location = place?.geometry?.location;
    if (location) {
      const newPosition = {
        lat: location.lat(),
        lng: location.lng(),
        address: place.formatted_address || place.name,
      };

      if (type === 'pickup') {
        setPickupPosition(newPosition);
        if (pickupInputRef.current) {
          pickupInputRef.current.value = place.name || place.formatted_address;
        }
      } else {
        setDestinationPosition(newPosition);
        if (destinationInputRef.current) {
          destinationInputRef.current.value = place.name || place.formatted_address;
        }
      }
    }
  }, []);





    
  const pickupAutocompleteRef = useRef<any>(null);
  const pickupInputRef = useRef<HTMLInputElement>(null);
  const destinationAutocompleteRef = useRef<any>(null);
  const destinationInputRef = useRef<HTMLInputElement>(null);




const handleGetCurrentLocation = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
  e.preventDefault();
  if (navigator.geolocation) {
    if (pickupInputRef.current) {
      pickupInputRef.current.value = 'Fetching current location...';
    }

    navigator.geolocation.getCurrentPosition((position) => {
      const newPosition = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
        address: `Lat: ${position.coords.latitude}, Lng: ${position.coords.longitude}`, // Example address
      };
      setPickupPosition(newPosition);
      

      if (pickupInputRef.current) {
        pickupInputRef.current.value = newPosition.address;
      }
    }, (error) => {
      console.error("Error getting current location:", error);
      if (pickupInputRef.current) {
        pickupInputRef.current.value = '';
      }
    });
  } else {
    console.error("Geolocation is not supported by this browser.");
  }
};


  useEffect(() => {
    const handleApproveRide = ({ rideResponse }: { rideResponse: RideResponse }) => {
      console.log('Received approveRide event:', rideResponse);
      console.log('amunnnt',rideResponse.tripAmount);
      
   setAmount(rideResponse.tripAmount)
   
      if (rideResponse && rideResponse.driverInfo) {
        console.log("Driver information received:", rideResponse.driverInfo);
        setDriverDetails(rideResponse.driverInfo);
       console.log("driverdetails",rideResponse);
       
       localStorage.setItem('rideResponse', JSON.stringify(rideResponse)); // Save rideResponse to localStorage




        axios.post('http://localhost:5000/server/user/getTripDetails', { email })
        .then(response => {
          const { tripId } = response.data;
          setTripId(tripId); // Set tripId in state
          console.log('wadsadtripid',tripId);
        })
        
        .catch(error => {
          console.error("Error fetching trip details:", error);
        });
        setLoading(false); // Hide loading state
        socket.off('approveRide', handleApproveRide); // Remove the listener
        // Clear ride request from all other drivers
        socket.emit('clearRideRequest', { email });
      } else {
        console.error("Driver information is missing or undefined in rideResponse:", rideResponse);
        setLoading(false); // Hide loading state
      }
    };

    socket.on('approveRide', handleApproveRide);
    socket.on('outCall', handleCallRequests);
    return () => {
      socket.off('approveRide', handleApproveRide); // Cleanup listener on unmount
      socket.off('outCall', handleCallRequests);

    };
  }, [email]);



  useEffect(() => {
    const storedRideResponse = localStorage.getItem('rideResponse');
    if (storedRideResponse) {
      const rideResponse = JSON.parse(storedRideResponse);
      if (rideResponse && rideResponse.tripAmount) {
        setAmount(rideResponse.tripAmount);
      }
      if (rideResponse && rideResponse.driverInfo) {
        setDriverDetails(rideResponse.driverInfo);
      }
      if (rideResponse && rideResponse.tripId) {
        setTripId(rideResponse.tripId);
      }
    }
  }, []);

  // useEffect(() => {
   
  //   if (amount !== null) {
  //     console.log('Amount updated:', amount);
  //   }
  // }, [amount]);


  const handleConfirmRide = async () => {
  
    setLoading(true); // Show loading state

    try {
      const response = await axios.post('http://localhost:5000/server/user/savedlocation', {
        pickupPosition,
        destinationPosition,
        email,
        
      });

      console.log('Location saved:', response.data.message);


      const userResponse = await axios.get(`http://localhost:5000/server/user/userDetails/${email}`);
      const userDetails = userResponse.data;


      socket.emit('rideRequest', {
        pickupPosition,
        destinationPosition,
        email,
        userSocketId: socket.id,
        userDetails,
      
      });
     
  
    }
catch (error) {
  console.error('Error saving location:', error);
  setLoading(false);
}
};

const handleCallRequests = (data: any) => {
  
  console.log('Incoming call data:', data);
  
  setIncomingCall(data); 
  console.log("calldata",data);
  const storedRideResponse = localStorage.getItem('rideResponse');
  if (storedRideResponse) {
    const rideResponse = JSON.parse(storedRideResponse);
console.log("storedRideResponse",storedRideResponse);

    // Update component state with rideResponse data
    if (rideResponse && rideResponse.tripAmount) {
      setAmount(rideResponse.tripAmount);
    }
    if (rideResponse && rideResponse.driverInfo) {
      setDriverDetails(rideResponse.driverInfo);
    }
    if (rideResponse && rideResponse.tripId) {
      setTripId(rideResponse.tripId);
    }
  } else {
   
    console.error('rideResponse not found in localStorage');
   
  }
};

// Function to accept the incoming call
const handleAcceptCall = () => {
 const mobile=incomingCall?.handleCallRequests.mobile
 console.log("mobile",mobile);
 
   router.push(`/Room/${mobile}`)
  socket.emit('callAccepted', { /* include necessary data */ });

  // Clear incoming call notification
  setIncomingCall(null);
  const storedRideResponse = localStorage.getItem('rideResponse');
  if (storedRideResponse) {
    const rideResponse = JSON.parse(storedRideResponse);
console.log("storedRideResponse",storedRideResponse);

    // Update component state with rideResponse data
    if (rideResponse && rideResponse.tripAmount) {
      setAmount(rideResponse.tripAmount);
    }
    if (rideResponse && rideResponse.driverInfo) {
      setDriverDetails(rideResponse.driverInfo);
    }
    if (rideResponse && rideResponse.tripId) {
      setTripId(rideResponse.tripId);
    }
  } else {
   
    console.error('rideResponse not found in localStorage');
   
  }

};

// Function to reject the incoming call
const handleRejectCall = () => {
  

  socket.emit('callRejected', { /* include necessary data */ });

  // Clear incoming call notification
  setIncomingCall(null);
};


const handleCancelRide = () => {
  // Implement cancel ride logic here
  localStorage.removeItem('rideResponse');
  setDriverDetails(null);
  setSelectedVehicle(null);

  
  socket.emit('cancelRide', { email });
};




  const handlePickupPositionChange = (position: Position) => {
    setPickupPosition(position);

    if (pickupInputRef.current) {
      pickupInputRef.current.value = `Lat: ${position.lat}, Lng: ${position.lng}`;
    }
  };

  if (loadError) {
    return <div>Error loading maps</div>;
  }

  console.log("setslectedvehicle",selectedVehicle);
  


  const handleCall = () => {
    // Check if driverDetails is available
    if (driverDetails) {
      const roomID=driverDetails.mobile
      router.push(`/Room/${roomID}`)
      socket.emit('callDriver', {
        email: driverDetails.email,
        mobile:driverDetails.mobile 
        
      });
    
    } else {
      console.error("Driver details not available to make a call.");
     
    }
  };

  

  return (
    <div className='mt-1'>
      <Header email={email}/>
      <button onClick={handleSignOut} className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded">
        Sign Out
      </button>
      <div className="flex flex-col lg:flex-row justify-start items-start mt-20 mx-4 lg:mx-8 gap-8 bg-indigo-300">
        <div className="w-full h-5/6 mt-16 ms-2 lg:w-1/4 p-6 bg-slate-300 shadow rounded-lg">
          <h1 className="text-xl font-bold mb-4">Pointer</h1>
          {isLoaded ? (
            <>
              <div className="mb-4 gap-4 relative">
                <Autocomplete
                  onLoad={ref => pickupAutocompleteRef.current = ref}
                  onPlaceChanged={() => handlePlaceSelect(pickupAutocompleteRef, 'pickup')}
                >
                  <input
                    ref={pickupInputRef}
                    type="text"
                    placeholder="Pickup Location"
                    className="w-full p-2 border border-gray-300 rounded mb-2"
                  />
                </Autocomplete>
                <button
                  onClick={handleGetCurrentLocation}
                  className="absolute right-0 w-13 top-0 mt-2 mr-2 bg-blue-500 hover:bg-blue-600 text-white px-1 py-1 rounded"
                >
                   📍
                </button>
                <Autocomplete
                  onLoad={ref => destinationAutocompleteRef.current = ref}
                  onPlaceChanged={() => handlePlaceSelect(destinationAutocompleteRef, 'destination')}
                >
                  <input
                    type="text"
                    placeholder="Destination Location"
                    className="w-full p-2 border border-gray-300 rounded"
                  />
                </Autocomplete>
              </div>



<button
                onClick={driverDetails ? handleCancelRide : handleConfirmRide}
                className={`mt-4 ${driverDetails ? 'bg-red-500 hover:bg-red-600' : 'bg-blue-500 hover:bg-blue-600'} text-white px-4 py-2 rounded`}
                disabled={loading}
              >
                {incomingCall && (
            <div className="fixed inset-0 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-8 shadow-lg">
                <p>You have an incoming call!</p>
                <div className="mt-4 flex justify-center gap-4">
                  <button onClick={handleAcceptCall} className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600">
                    Accept
                  </button>
                  <button onClick={handleRejectCall} className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600">
                    Reject
                  </button>
                </div>
              </div>
            </div>
          )}
                {driverDetails ? 'Cancel Ride' : 'Confirm Ride'}
              </button>
              {driverDetails && (
                <div className="mt-4 p-4 bg-white shadow rounded-lg">
                  <h3 className="text-lg text-lime-700  font-bold mb-2"> <p><strong>OTP:</strong> {driverDetails.otp}</p></h3>
                  {tripId && <p className='text text-orange-600'><strong>Trip ID:</strong> {tripId}</p>}
                  <h2 className="text-lg font-semibold mb-2">Driver Details</h2>
                  <p><strong>Name:</strong> {driverDetails.drivername}</p>
                 
                  <p><strong>Mobile:</strong> {driverDetails.mobile}</p>
                  <p><strong>Vehicle Model:</strong> {driverDetails.registration[0]?.vehicleModel}</p>
                  <p><strong>Vehicle Number:</strong> {driverDetails.registration[0]?.vehicleNumber}</p>
                  <p><strong>Driver is on the way!</strong></p>
                  <p><strong>Amount</strong>{amount}</p>
                  <button
                    onClick={handleCall}
                    className="mt-4 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
                  >
                    Make a Call
                  </button>
                  <PayPalScriptProvider options={{ clientId:`${process.env.NEXT_PUBLIC_PAYPAL_CLIENTID}` }}>
                  <PayPalButtons
        createOrder={(data, actions) => {
          return actions.order.create({
            purchase_units: [{
              amount: {
                currency_code: "USD", // Specify the currency code
                value: amount.toString(), // Ensure this is a string
              },
            }],
            intent:"CAPTURE"
          });
        }}
        onApprove={async (data, actions) => {
          if (actions.order) {
            const details = await actions.order.capture();
            const payerName = details.payer?.name?.given_name;
            if (payerName) {
              alert("Transaction completed by " + payerName);
             
              localStorage.removeItem('rideResponse');
                router.push(`/thanksPage?email=${email}`)
            } else {
              alert("Transaction completed, but payer's name is not available.");
            }
          } else {
            console.error('PayPal actions.order is undefined.');
            alert('An error occurred with the PayPal payment. Please try again.');
          }
        }}
        onError={(err) => {
          console.error('PayPal payment error:', err);
          alert('An error occurred with the PayPal payment. Please try again.');
        }}
      />
            </PayPalScriptProvider>
                </div>
              )}
            </>
          ) : (
            <div>Loading...</div>
          )}
      



        </div>
        <div className="w-full lg:w-3/4 h-96 lg:h-full bg-gray-200 shadow rounded-lg">
          {isLoaded && (
            <UserMap
            email={email}
              pickupPosition={pickupPosition}
              destinationPosition={destinationPosition}
              onPickupPositionChange={handlePickupPositionChange}
            />
          )}
        </div>
      </div>
      <footer className="bg-gray-900 mt-12">
         <div className="mx-auto w-full max-w-screen-xl p-4 py-6 lg:py-8">
           <div className="md:flex md:justify-between">
             <div className="mb-6 md:mb-0">
               <a href="" className="flex items-center">            
                 <span className="self-center text-2xl font-semibold whitespace-nowrap text-white">CodeBlue</span>
               </a>
             </div>
             <div className="grid grid-cols-2 gap-8 sm:gap-6 sm:grid-cols-3">
               <div>
                 <h2 className="mb-6 text-sm font-semibold text-gray-900 uppercase dark:text-white">Resources</h2>
                 <ul className="text-white dark:text-gray-400 font-medium">
                   <li className="mb-4">
                     <a href="https://flowbite.com/" className="hover:underline">Flowbite</a>
                   </li>
                   <li>
                     <a href="https://tailwindcss.com/" className="hover:underline">Tailwind CSS</a>
                   </li>
                 </ul>
               </div>
               <div>
                 <h2 className="mb-6 text-sm font-semibold text-gray-900 uppercase dark:text-white">Follow us</h2>
                 <ul className="text-white dark:text-gray-400 font-medium">
                   <li className="mb-4">
                     <a href="https://github.com/themesberg/flowbite" className="hover:underline">Github</a>
                   </li>
                   <li>
                     <a href="https://discord.gg/4eeurUVvTy" className="hover:underline">Discord</a>
                   </li>
                 </ul>
               </div>
               <div>
                 <h2 className="mb-6 text-sm font-semibold text-gray-900 uppercase dark:text-white">Legal</h2>
                 <ul className="text-white dark:text-gray-400 font-medium">
                   <li className="mb-4">
                     <a href="#" className="hover:underline">Privacy Policy</a>
                   </li>
                   <li>
                     <a href="#" className="hover:underline">Terms &amp; Conditions</a>
                   </li>
                 </ul>
               </div>
             </div>
           </div>
           <hr className="my-6 border-gray-200 sm:mx-auto dark:border-gray-700 lg:my-8" />
           <div className="sm:flex sm:items-center sm:justify-between">
             <span className="text-sm text-gray-500 sm:text-center dark:text-gray-400">© 2023 <a href="https://flowbite.com/" className="hover:underline">Flowbite</a>. All Rights Reserved.</span>
             <div className="flex mt-4 space-x-5 sm:justify-center sm:mt-0">
               <a href="#" className="text-gray-500 hover:text-gray-900 dark:hover:text-white">
                 <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 8 19" aria-hidden="true">
                   <path fillRule="evenodd" d="M5.164 18.75V9.765h3.163L8.5 6.326H5.164V4.35c0-.927.267-1.558 1.646-1.558H8.5V.237C8.176.196 7.176 0 6.005 0 3.676 0 2.09 1.408 2.09 3.993v2.333H0v3.439h2.09V18.75h3.074z" clipRule="evenodd" />
                 </svg>
                 <span className="sr-only">Facebook page</span>
               </a>
               <a href="#" className="text-gray-500 hover:text-gray-900 dark:hover:text-white">
                 <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 21 16" aria-hidden="true">
                   <path d="M7.34 12.27l-4.81-4.78L0 9.97l7.34 7.27L21 3.65l-2.53-2.44z" />
                 </svg>
                 <span className="sr-only">Twitter page</span>
               </a>
               <a href="#" className="text-gray-500 hover:text-gray-900 dark:hover:text-white">
                 <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                   <path fillRule="evenodd" d="M10 0C4.477 0 0 4.478 0 10s4.477 10 10 10 10-4.478 10-10S15.523 0 10 0zm0 18.125a8.125 8.125 0 1 1 0-16.25 8.125 8.125 0 0 1 0 16.25zm-1.25-8.334v4.167H6.667V9.792h2.083zm-1.042-2.083a1.042 1.042 0 1 1 2.083 0 1.042 1.042 0 0 1-2.083 0zm7.292 2.083v4.167H13.75v-2.5a1.25 1.25 0 0 0-2.5 0v2.5H8.333v-4.167H9.79v.677a2.71 2.71 0 0 1 2.5-1.46 2.71 2.71 0 0 1 2.5 1.46v-.677h1.667z" clipRule="evenodd" />
                 </svg>
                 <span className="sr-only">LinkedIn page</span>
               </a>
             </div>
           </div>
         </div>
       </footer>
    </div>
    
  );
}

export default Home;
























// 'use client';

// import React, { useEffect, useRef, useState, useCallback } from 'react';
// import Header from '@/components/landing-page/Header';
// import { signOut } from 'next-auth/react';
// import { useRouter, useSearchParams } from 'next/navigation';
// import UserMap from '@/app/UserMap/page';
// import { Autocomplete, useLoadScript } from '@react-google-maps/api';
// import axios from 'axios';
// import socket from '../../../lib/socket';

// const libraries: ('places')[] = ['places'];

// interface Position {
//   lat: number;
//   lng: number;
// }

// interface Vehicle {
//   vehicleModel: string;
//   vehicleNumber: string;
//   drivername: string;
//   email: string;
// }

// function Home() {
//   const router = useRouter();
//   const searchParams = useSearchParams();
//   const email = searchParams.get('email') || '';

//   const [pickupPosition, setPickupPosition] = useState<Position | null>(null);
//   const [destinationPosition, setDestinationPosition] = useState<Position | null>(null);
//   const [vehicles, setVehicles] = useState<Vehicle[]>([]);
//   const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);

//   const { isLoaded, loadError } = useLoadScript({
//     googleMapsApiKey: process.env.GOOGLE_MAP_API_KEY || 'AIzaSyCAzgjpFOMCqPpDdaoI-ZPS6ihQygdp0rY',
//     libraries,
//   });

//   useEffect(() => {
//     if (pickupPosition && destinationPosition) {
//       fetchAvailableVehicles();
//     }
//   }, [pickupPosition, destinationPosition]);

//   const fetchAvailableVehicles = async () => {
//     try {
//       const response = await axios.get('http://localhost:5000/server/availableVehicles', {
//         params: {
//           pickupPosition,
//           destinationPosition,
//         },
//       });
//       setVehicles(response.data.vehicles);
//     } catch (error) {
//       console.error('Error fetching available vehicles:', error);
//     }
//   };

//   const handleSignOut = async () => {
//     await signOut({ redirect: false });
//     router.push('/login');
//   };

//   const handlePlaceSelect = useCallback((autocompleteRef: React.MutableRefObject<google.maps.places.Autocomplete | null>, type: 'pickup' | 'destination') => {
//     const place = autocompleteRef.current?.getPlace();
//     const location = place?.geometry?.location;
//     if (location) {
//       const newPosition = {
//         lat: location.lat(),
//         lng: location.lng(),
//       };

//       if (type === 'pickup') {
//         setPickupPosition(newPosition);
//       } else {
//         setDestinationPosition(newPosition);
//       }
//     }
//   }, []);

//   const pickupAutocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
//   const pickupInputRef = useRef<HTMLInputElement | null>(null);
//   const destinationAutocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);

//   const handleGetCurrentLocation = (e: any) => {
//     e.preventDefault();
//     if (navigator.geolocation) {
//       if (pickupInputRef.current) {
//         pickupInputRef.current.value = 'Fetching current location...';
//       }
  
//       navigator.geolocation.getCurrentPosition((position) => {
//         const newPosition = {
//           lat: position.coords.latitude,
//           lng: position.coords.longitude,
//         };
//         setPickupPosition(newPosition);
  
//         if (pickupInputRef.current) {
//           pickupInputRef.current.value = `Lat: ${newPosition.lat}, Lng: ${newPosition.lng}`;
//         }
//       }, (error) => {
//         console.error("Error getting current location:", error);
//         if (pickupInputRef.current) {
//           pickupInputRef.current.value = '';
//         }
//       });
//     } else {
//       console.error("Geolocation is not supported by this browser.");
//     }
//   };

//   const handleConfirmRide = async () => {
//     if (!pickupPosition || !destinationPosition || !selectedVehicle) {
//       console.error("Pickup, destination, and vehicle type are required.");
//       return;
//     }

//     try {
//       const response = await axios.post('http://localhost:5000/server/user/savedlocation', {
//         pickupPosition,
//         destinationPosition,
//         email,
//         vehicleType: selectedVehicle.vehicleModel,
//       });

//       console.log('Location saved:', response.data.message);

//       socket.emit('rideRequest', {
//         pickupPosition,
//         destinationPosition,
//         email,
//         vehicleType: selectedVehicle.vehicleModel,
//         userSocketId: socket.id,
//       });

//     } catch (error) {
//       console.error('Error saving location:', error);
//     }
//   };

//   const handlePickupPositionChange = (position: Position) => {
//     setPickupPosition(position);

//     if (pickupInputRef.current) {
//       pickupInputRef.current.value = `Lat: ${position.lat}, Lng: ${position.lng}`;
//     }
//   };

//   if (loadError) {
//     return <div>Error loading maps</div>;
//   }

//   return (
//     <div className='mt-1'>
//       <Header />
//       <button onClick={handleSignOut} className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded">
//         Sign Out
//       </button>
//       <div className="flex flex-col lg:flex-row justify-start items-start mt-20 mx-4 lg:mx-8 gap-8 bg-indigo-300">
//         <div className="w-full h-5/6 mt-16 ms-2 lg:w-1/4 p-6 bg-slate-300 shadow rounded-lg">
//           <h1 className="text-xl font-bold mb-4">Pointer</h1>
//           {isLoaded ? (
//             <>
//               <div className="mb-4 gap-4 relative">
//                 <Autocomplete
//                   onLoad={ref => pickupAutocompleteRef.current = ref}
//                   onPlaceChanged={() => handlePlaceSelect(pickupAutocompleteRef, 'pickup')}
//                 >
//                   <input
//                     ref={pickupInputRef}
//                     type="text"
//                     placeholder="Pickup Location"
//                     className="w-full p-2 border border-gray-300 rounded mb-2"
//                   />
//                 </Autocomplete>
//                 <button
//                   onClick={handleGetCurrentLocation}
//                   className="absolute right-0 top-0 mt-2 mr-2 text-white p-2 rounded"
//                 >
//                   📍
//                 </button>
//               </div>
//               <div className="mb-4">
//                 <Autocomplete
//                   onLoad={ref => destinationAutocompleteRef.current = ref}
//                   onPlaceChanged={() => handlePlaceSelect(destinationAutocompleteRef, 'destination')}
//                 >
//                   <input
//                     type="text"
//                     placeholder="Destination Location"
//                     className="w-full p-2 border border-gray-300 rounded"
//                   />
//                 </Autocomplete>
//               </div>
//               <div className="mb-4">
//                 <h2 className="text-lg font-semibold mb-2">Select Vehicle Type</h2>
//                 <div className="grid gap-2">
//                   {vehicles.map((vehicle) => (
//                     <div
//                       key={vehicle.vehicleNumber}
//                       className={`p-2 border rounded-lg cursor-pointer ${selectedVehicle?.vehicleNumber === vehicle.vehicleNumber ? 'bg-green-500 text-white' : 'bg-white'}`}
//                       onClick={() => setSelectedVehicle(vehicle)}
//                     >
//                       {vehicle.vehicleModel} ({vehicle.vehicleNumber})
//                     </div>
//                   ))}
//                 </div>
//               </div>
//               <button
//                 onClick={handleConfirmRide}
//                 className="bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded-lg"
//               >
//                 Confirm Ride
//               </button>
//             </>
//           ) : (
//             <div>Loading...</div>
//           )}
//         </div>
//         <div className="w-full lg:w-3/4 h-full mt-8 lg:mt-0 lg:ml-8 bg-slate-300 shadow rounded-lg">
//           {isLoaded && (
//             <UserMap
//               email={email}
//               pickupPosition={pickupPosition}
//               destinationPosition={destinationPosition}
//               onPickupPositionChange={handlePickupPositionChange}
//             />
//           )}
//         </div>
//       </div>
//       <footer className="bg-gray-900 mt-24">
//         <div className="mx-auto w-full max-w-screen-xl p-4 py-6 lg:py-8">
//           <div className="md:flex md:justify-between">
//             <div className="mb-6 md:mb-0">
//               <a href="" className="flex items-center">
              
//                 <span className="self-center text-2xl font-semibold whitespace-nowrap text-white">CodeBlue</span>
//               </a>
//             </div>
//             <div className="grid grid-cols-2 gap-8 sm:gap-6 sm:grid-cols-3">
//               <div>
//                 <h2 className="mb-6 text-sm font-semibold text-gray-900 uppercase dark:text-white">Resources</h2>
//                 <ul className="text-white dark:text-gray-400 font-medium">
//                   <li className="mb-4">
//                     <a href="https://flowbite.com/" className="hover:underline">Flowbite</a>
//                   </li>
//                   <li>
//                     <a href="https://tailwindcss.com/" className="hover:underline">Tailwind CSS</a>
//                   </li>
//                 </ul>
//               </div>
//               <div>
//                 <h2 className="mb-6 text-sm font-semibold text-gray-900 uppercase dark:text-white">Follow us</h2>
//                 <ul className="text-white dark:text-gray-400 font-medium">
//                   <li className="mb-4">
//                     <a href="https://github.com/themesberg/flowbite" className="hover:underline">Github</a>
//                   </li>
//                   <li>
//                     <a href="https://discord.gg/4eeurUVvTy" className="hover:underline">Discord</a>
//                   </li>
//                 </ul>
//               </div>
//               <div>
//                 <h2 className="mb-6 text-sm font-semibold text-gray-900 uppercase dark:text-white">Legal</h2>
//                 <ul className="text-white dark:text-gray-400 font-medium">
//                   <li className="mb-4">
//                     <a href="#" className="hover:underline">Privacy Policy</a>
//                   </li>
//                   <li>
//                     <a href="#" className="hover:underline">Terms &amp; Conditions</a>
//                   </li>
//                 </ul>
//               </div>
//             </div>
//           </div>
//           <hr className="my-6 border-gray-200 sm:mx-auto dark:border-gray-700 lg:my-8" />
//           <div className="sm:flex sm:items-center sm:justify-between">
//             <span className="text-sm text-gray-500 sm:text-center dark:text-gray-400">© 2023 <a href="https://flowbite.com/" className="hover:underline">Flowbite</a>. All Rights Reserved.</span>
//             <div className="flex mt-4 space-x-5 sm:justify-center sm:mt-0">
//               <a href="#" className="text-gray-500 hover:text-gray-900 dark:hover:text-white">
//                 <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 8 19" aria-hidden="true">
//                   <path fillRule="evenodd" d="M5.164 18.75V9.765h3.163L8.5 6.326H5.164V4.35c0-.927.267-1.558 1.646-1.558H8.5V.237C8.176.196 7.176 0 6.005 0 3.676 0 2.09 1.408 2.09 3.993v2.333H0v3.439h2.09V18.75h3.074z" clipRule="evenodd" />
//                 </svg>
//                 <span className="sr-only">Facebook page</span>
//               </a>
//               <a href="#" className="text-gray-500 hover:text-gray-900 dark:hover:text-white">
//                 <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 21 16" aria-hidden="true">
//                   <path d="M7.34 12.27l-4.81-4.78L0 9.97l7.34 7.27L21 3.65l-2.53-2.44z" />
//                 </svg>
//                 <span className="sr-only">Twitter page</span>
//               </a>
//               <a href="#" className="text-gray-500 hover:text-gray-900 dark:hover:text-white">
//                 <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
//                   <path fillRule="evenodd" d="M10 0C4.477 0 0 4.478 0 10s4.477 10 10 10 10-4.478 10-10S15.523 0 10 0zm0 18.125a8.125 8.125 0 1 1 0-16.25 8.125 8.125 0 0 1 0 16.25zm-1.25-8.334v4.167H6.667V9.792h2.083zm-1.042-2.083a1.042 1.042 0 1 1 2.083 0 1.042 1.042 0 0 1-2.083 0zm7.292 2.083v4.167H13.75v-2.5a1.25 1.25 0 0 0-2.5 0v2.5H8.333v-4.167H9.79v.677a2.71 2.71 0 0 1 2.5-1.46 2.71 2.71 0 0 1 2.5 1.46v-.677h1.667z" clipRule="evenodd" />
//                 </svg>
//                 <span className="sr-only">LinkedIn page</span>
//               </a>
//             </div>
//           </div>
//         </div>
//       </footer>
//     </div>
//   );
// }

// export default Home;




// 'use client';

// import React, { useEffect, useRef, useState, useCallback } from 'react';
// import Header from '@/components/landing-page/Header';
// import { signOut } from 'next-auth/react';
// import { useRouter, useSearchParams } from 'next/navigation';
// import UserMap from '@/app/UserMap/page';
// import { Autocomplete, useLoadScript } from '@react-google-maps/api';
// import axios from 'axios';
// // import { FaLocationArrow } from 'react-icons/fa'; // Import the icon
// import socket from '../../../lib/socket';

// const libraries: ('places')[] = ['places'];

// interface Position {
//   lat: number;
//   lng: number;
// }

// function Home() {
//   const router = useRouter();
//   const searchParams = useSearchParams();
//   const email = searchParams.get('email') || '';

//   const [pickupPosition, setPickupPosition] = useState<Position | null>(null);
//   const [destinationPosition, setDestinationPosition] = useState<Position | null>(null);

//   const { isLoaded, loadError } = useLoadScript({
//     googleMapsApiKey: process.env.GOOGLE_MAP_API_KEY || 'AIzaSyCAzgjpFOMCqPpDdaoI-ZPS6ihQygdp0rY',
//     libraries,
//   });

//   const handleSignOut = async () => {
//     await signOut({ redirect: false });
//     router.push('/login');
//   };

//   const handlePlaceSelect = useCallback((autocompleteRef: React.MutableRefObject<google.maps.places.Autocomplete | null>, type: 'pickup' | 'destination') => {
//     const place = autocompleteRef.current?.getPlace();
//     const location = place?.geometry?.location;
//     if (location) {
//       const newPosition = {
//         lat: location.lat(),
//         lng: location.lng(),
//       };

//       if (type === 'pickup') {
//         setPickupPosition(newPosition);
//       } else {
//         setDestinationPosition(newPosition);
//       }
//     }
//   }, []);

//   const pickupAutocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
//   const pickupInputRef = useRef<HTMLInputElement | null>(null);
//   const destinationAutocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);

//   const handleGetCurrentLocation = (e: any) => {
//     e.preventDefault();
//     if (navigator.geolocation) {
//       // Show "Fetching current location..." message immediately
//       if (pickupInputRef.current) {
//         pickupInputRef.current.value = 'Fetching current location...';
//       }
  
//       navigator.geolocation.getCurrentPosition((position) => {
//         const newPosition = {
//           lat: position.coords.latitude,
//           lng: position.coords.longitude,
//         };
//         setPickupPosition(newPosition);
  
//         if (pickupInputRef.current) {
//           // Update input field with current location
//           pickupInputRef.current.value = `Lat: ${newPosition.lat}, Lng: ${newPosition.lng}`;
//         }
//       }, (error) => {
//         console.error("Error getting current location:", error);
//         if (pickupInputRef.current) {
//           // Reset input field if there is an error
//           pickupInputRef.current.value = '';
//         }
//       });
//     } else {
//       console.error("Geolocation is not supported by this browser.");
//     }
//   };
  

//   // const handleGetCurrentLocation = (e: any) => {
//   //   e.preventDefault();
//   //   if (navigator.geolocation) {
//   //     navigator.geolocation.getCurrentPosition((position) => {
//   //       const newPosition = {
//   //         lat: position.coords.latitude,
//   //         lng: position.coords.longitude,
//   //       };
//   //       setPickupPosition(newPosition);

//   //       if (pickupInputRef.current) {
//   //         // Set the value of the input field to the coordinates of the new position
//   //         pickupInputRef.current.value = `Lat: ${newPosition.lat}, Lng: ${newPosition.lng}`;
//   //       }
//   //     }, (error) => {
//   //       console.error("Error getting current location:", error);
//   //     });
//   //   } else {
//   //     console.error("Geolocation is not supported by this browser.");
//   //   }
//   // };

//   const handleConfirmRide = async () => {
//     if (!pickupPosition || !destinationPosition) {
//       console.error("Both pickup and destination positions are required.");
//       return;
//     }

//     try {
//       const response = await axios.post('http://localhost:5000/server/user/savedlocation', {
//         pickupPosition,
//         destinationPosition,
//         email,
//       });

//       console.log('Location saved:', response.data.message);

//       socket.emit('rideRequest', {
//         pickupPosition,
//         destinationPosition,
//         email,
//         userSocketId: socket.id,
//       });

//     } catch (error) {
//       console.error('Error saving location:', error);
//     }
//   };

//   const handlePickupPositionChange = (position: Position) => {
//     setPickupPosition(position);

//     if (pickupInputRef.current) {
//       pickupInputRef.current.value = `Lat: ${position.lat}, Lng: ${position.lng}`;
//     }
//   };

//   if (loadError) {
//     return <div>Error loading maps</div>;
//   }

//   return (
//     <div className='mt-1'>
//       <Header />
//       <button onClick={handleSignOut} className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded">
//         Sign Out
//       </button>
//       <div className="flex flex-col lg:flex-row justify-start items-start mt-20 mx-4 lg:mx-8 gap-8 bg-indigo-300">
//         <div className="w-full h-5/6 mt-16 ms-2 lg:w-1/4 p-6 bg-slate-300 shadow rounded-lg">
//           <h1 className="text-xl font-bold mb-4">Pointer</h1>
//           {isLoaded ? (
//             <>
//               <div className="mb-4 gap-4 relative">
//                 <Autocomplete
//                   onLoad={ref => pickupAutocompleteRef.current = ref}
//                   onPlaceChanged={() => handlePlaceSelect(pickupAutocompleteRef, 'pickup')}
//                 >
//                   <input
//                     ref={pickupInputRef}
//                     type="text"
//                     placeholder="Pickup Location"
//                     className="w-full p-2 border border-gray-300 rounded mb-2"
//                   />
//                 </Autocomplete>
//                 <button
//                   onClick={handleGetCurrentLocation}
//                   className="absolute right-0 top-0 mt-2 mr-2 text-white p-2 rounded"
//                 >
//                  📍
//                 </button>
//               </div>
//               <div className="mb-4">
//                 <Autocomplete
//                   onLoad={ref => destinationAutocompleteRef.current = ref}
//                   onPlaceChanged={() => handlePlaceSelect(destinationAutocompleteRef, 'destination')}
//                 >
//                   <input
//                     type="text"
//                     placeholder="Destination Location"
//                     className="w-full p-2 border border-gray-300 rounded"
//                   />
//                 </Autocomplete>
//               </div>
//               <button
//                 onClick={handleConfirmRide}
//                 className=" bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded-lg"
//               >
//                 Confirm Ride
//               </button>
//             </>
//           ) : (
//             <div>Loading...</div>
//           )}
//         </div>
//         <div className="w-full lg:w-3/4 h-full mt-8 lg:mt-0 lg:ml-8 bg-slate-300 shadow rounded-lg">
//           {isLoaded && (
//             <UserMap
//               email={email}
//               pickupPosition={pickupPosition}
//               destinationPosition={destinationPosition}
//               onPickupPositionChange={handlePickupPositionChange}
//             />
//           )}
//         </div>
//       </div>
//       <footer className="bg-gray-900 mt-24">
//         <div className="mx-auto w-full max-w-screen-xl p-4 py-6 lg:py-8">
//           <div className="md:flex md:justify-between">
//             <div className="mb-6 md:mb-0">
//               <a href="" className="flex items-center">
              
//                 <span className="self-center text-2xl font-semibold whitespace-nowrap text-white">CodeBlue</span>
//               </a>
//             </div>
//             <div className="grid grid-cols-2 gap-8 sm:gap-6 sm:grid-cols-3">
//               <div>
//                 <h2 className="mb-6 text-sm font-semibold text-gray-900 uppercase dark:text-white">Resources</h2>
//                 <ul className="text-white dark:text-gray-400 font-medium">
//                   <li className="mb-4">
//                     <a href="https://flowbite.com/" className="hover:underline">Flowbite</a>
//                   </li>
//                   <li>
//                     <a href="https://tailwindcss.com/" className="hover:underline">Tailwind CSS</a>
//                   </li>
//                 </ul>
//               </div>
//               <div>
//                 <h2 className="mb-6 text-sm font-semibold text-gray-900 uppercase dark:text-white">Follow us</h2>
//                 <ul className="text-white dark:text-gray-400 font-medium">
//                   <li className="mb-4">
//                     <a href="https://github.com/themesberg/flowbite" className="hover:underline">Github</a>
//                   </li>
//                   <li>
//                     <a href="https://discord.gg/4eeurUVvTy" className="hover:underline">Discord</a>
//                   </li>
//                 </ul>
//               </div>
//               <div>
//                 <h2 className="mb-6 text-sm font-semibold text-gray-900 uppercase dark:text-white">Legal</h2>
//                 <ul className="text-white dark:text-gray-400 font-medium">
//                   <li className="mb-4">
//                     <a href="#" className="hover:underline">Privacy Policy</a>
//                   </li>
//                   <li>
//                     <a href="#" className="hover:underline">Terms &amp; Conditions</a>
//                   </li>
//                 </ul>
//               </div>
//             </div>
//           </div>
//           <hr className="my-6 border-gray-200 sm:mx-auto dark:border-gray-700 lg:my-8" />
//           <div className="sm:flex sm:items-center sm:justify-between">
//             <span className="text-sm text-gray-500 sm:text-center dark:text-gray-400">© 2023 <a href="https://flowbite.com/" className="hover:underline">Flowbite</a>. All Rights Reserved.</span>
//             <div className="flex mt-4 space-x-5 sm:justify-center sm:mt-0">
//               <a href="#" className="text-gray-500 hover:text-gray-900 dark:hover:text-white">
//                 <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 8 19" aria-hidden="true">
//                   <path fillRule="evenodd" d="M5.164 18.75V9.765h3.163L8.5 6.326H5.164V4.35c0-.927.267-1.558 1.646-1.558H8.5V.237C8.176.196 7.176 0 6.005 0 3.676 0 2.09 1.408 2.09 3.993v2.333H0v3.439h2.09V18.75h3.074z" clipRule="evenodd" />
//                 </svg>
//                 <span className="sr-only">Facebook page</span>
//               </a>
//               <a href="#" className="text-gray-500 hover:text-gray-900 dark:hover:text-white">
//                 <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 21 16" aria-hidden="true">
//                   <path d="M7.34 12.27l-4.81-4.78L0 9.97l7.34 7.27L21 3.65l-2.53-2.44z" />
//                 </svg>
//                 <span className="sr-only">Twitter page</span>
//               </a>
//               <a href="#" className="text-gray-500 hover:text-gray-900 dark:hover:text-white">
//                 <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
//                   <path fillRule="evenodd" d="M10 0C4.477 0 0 4.478 0 10s4.477 10 10 10 10-4.478 10-10S15.523 0 10 0zm0 18.125a8.125 8.125 0 1 1 0-16.25 8.125 8.125 0 0 1 0 16.25zm-1.25-8.334v4.167H6.667V9.792h2.083zm-1.042-2.083a1.042 1.042 0 1 1 2.083 0 1.042 1.042 0 0 1-2.083 0zm7.292 2.083v4.167H13.75v-2.5a1.25 1.25 0 0 0-2.5 0v2.5H8.333v-4.167H9.79v.677a2.71 2.71 0 0 1 2.5-1.46 2.71 2.71 0 0 1 2.5 1.46v-.677h1.667z" clipRule="evenodd" />
//                 </svg>
//                 <span className="sr-only">LinkedIn page</span>
//               </a>
//             </div>
//           </div>
//         </div>
//       </footer>
//     </div>
//   );
// }

// export default Home;




// 'use client';

// import React, { useEffect, useRef, useState, useCallback } from 'react';
// import Header from '@/components/landing-page/Header';
// import { signOut } from 'next-auth/react';
// import { useRouter, useSearchParams } from 'next/navigation';
// import UserMap from '@/app/UserMap/page';
// import { Autocomplete, useLoadScript } from '@react-google-maps/api';
// import axios from 'axios';
// import socket from '../../../lib/socket';

// const libraries: ('places')[] = ['places'];

// interface Position {
//   lat: number;
//   lng: number;
// }

// function Home() {
//   const router = useRouter();
//   const searchParams = useSearchParams();
//   const email = searchParams.get('email') || '';

//   const [pickupPosition, setPickupPosition] = useState<Position | null>(null);
//   const [destinationPosition, setDestinationPosition] = useState<Position | null>(null);

//   const { isLoaded, loadError } = useLoadScript({
//     googleMapsApiKey: process.env.GOOGLE_MAP_API_KEY || 'AIzaSyCAzgjpFOMCqPpDdaoI-ZPS6ihQygdp0rY',
//     libraries,
//   });

//   const handleSignOut = async () => {
//     await signOut({ redirect: false });
//     router.push('/login');
//   };

//   const handlePlaceSelect = useCallback((autocompleteRef: React.MutableRefObject<google.maps.places.Autocomplete | null>, type: 'pickup' | 'destination') => {
//     const place = autocompleteRef.current?.getPlace();
//     const location = place?.geometry?.location;
//     if (location) {
//       const newPosition = {
//         lat: location.lat(),
//         lng: location.lng(),
//       };

//       if (type === 'pickup') {
//         setPickupPosition(newPosition);
//       } else {
//         setDestinationPosition(newPosition);
//       }
//     }
//   }, []);

//   const pickupAutocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
//   const pickupInputRef = useRef<HTMLInputElement | null>(null);
//   const destinationAutocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);

//   const handleGetCurrentLocation = (e: any) => {
//     e.preventDefault();
//     if (navigator.geolocation) {
//       navigator.geolocation.getCurrentPosition((position) => {
//         const newPosition = {
//           lat: position.coords.latitude,
//           lng: position.coords.longitude,
//         };
//         setPickupPosition(newPosition);

//         if (pickupInputRef.current) {
//           // Set the value of the input field to the coordinates of the new position
//           pickupInputRef.current.value = `Lat: ${newPosition.lat}, Lng: ${newPosition.lng}`;
//         }
//       }, (error) => {
//         console.error("Error getting current location:", error);
//       });
//     } else {
//       console.error("Geolocation is not supported by this browser.");
//     }
//   };

//   const handleConfirmRide = async () => {
//     if (!pickupPosition || !destinationPosition) {
//       console.error("Both pickup and destination positions are required.");
//       return;
//     }

//     try {
//       const response = await axios.post('http://localhost:5000/server/user/savedlocation', {
//         pickupPosition,
//         destinationPosition,
//         email,
//       });

//       console.log('Location saved:', response.data.message);

//       socket.emit('rideRequest', {
//         pickupPosition,
//         destinationPosition,
//         email,
//         userSocketId: socket.id,
//       });

//     } catch (error) {
//       console.error('Error saving location:', error);
//     }
//   };

//   const handlePickupPositionChange = (position: Position) => {
//     setPickupPosition(position);

//     if (pickupInputRef.current) {
//       pickupInputRef.current.value = `Lat: ${position.lat}, Lng: ${position.lng}`;
//     }
//   };

//   if (loadError) {
//     return <div>Error loading maps</div>;
//   }

//   return (
//     <div className='mt-3'>
//       <Header />
//       <button onClick={handleSignOut} className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded">
//         Sign Out
//       </button>
//       <div className="flex flex-col lg:flex-row justify-start items-start mt-24 mx-4 lg:mx-8 gap-8 bg-indigo-300">
//         <div className="w-full h-5/6 mt-16 ms-2 lg:w-1/4 p-6 bg-slate-300 shadow rounded-lg">
//           <h1 className="text-xl font-bold mb-4">Pointer</h1>
//           {isLoaded ? (
//             <>
//               <div className="mb-4 gap-4 relative">
//                 <Autocomplete
//                   onLoad={ref => pickupAutocompleteRef.current = ref}
//                   onPlaceChanged={() => handlePlaceSelect(pickupAutocompleteRef, 'pickup')}
//                 >
//                   <input
//                     ref={pickupInputRef}
//                     type="text"
//                     placeholder="Pickup Location"
//                     className="w-full p-2 border border-gray-300 rounded mb-2"
//                   />
//                 </Autocomplete>
//                 <button
//                   onClick={handleGetCurrentLocation}
//                   className="absolute right-0 top-0 mt-2 mr-2 text-white p-2 rounded"
//                 >
//                   Current Location
//                 </button>
//               </div>
//               <div className="mb-4">
//                 <Autocomplete
//                   onLoad={ref => destinationAutocompleteRef.current = ref}
//                   onPlaceChanged={() => handlePlaceSelect(destinationAutocompleteRef, 'destination')}
//                 >
//                   <input
//                     type="text"
//                     placeholder="Destination Location"
//                     className="w-full p-2 border border-gray-300 rounded"
//                   />
//                 </Autocomplete>
//               </div>
//               <button
//                 onClick={handleConfirmRide}
//                 className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
//               >
//                 Confirm Ride
//               </button>
//             </>
//           ) : (
//             <div>Loading...</div>
//           )}
//         </div>
//         <div className="w-full lg:w-3/4 h-full mt-8 lg:mt-0 lg:ml-8 bg-slate-300 shadow rounded-lg">
//           {isLoaded && (
//             <UserMap
//               email={email}
//               pickupPosition={pickupPosition}
//               destinationPosition={destinationPosition}
//               onPickupPositionChange={handlePickupPositionChange}
//             />
//           )}
//         </div>
//       </div>
//       <footer className="bg-gray-900 mt-24">
//         <div className="mx-auto w-full max-w-screen-xl p-4 py-6 lg:py-8">
//           <div className="md:flex md:justify-between">
//             <div className="mb-6 md:mb-0">
//               <a href="https://flowbite.com/" className="flex items-center">
//                 <img src="https://flowbite.com/docs/images/logo.svg" className="h-8 mr-3" alt="FlowBite Logo" />
//                 <span className="self-center text-2xl font-semibold whitespace-nowrap text-white">Flowbite</span>
//               </a>
//             </div>
//             <div className="grid grid-cols-2 gap-8 sm:gap-6 sm:grid-cols-3">
//               <div>
//                 <h2 className="mb-6 text-sm font-semibold text-gray-900 uppercase dark:text-white">Resources</h2>
//                 <ul className="text-white dark:text-gray-400 font-medium">
//                   <li className="mb-4">
//                     <a href="https://flowbite.com/" className="hover:underline">Flowbite</a>
//                   </li>
//                   <li>
//                     <a href="https://tailwindcss.com/" className="hover:underline">Tailwind CSS</a>
//                   </li>
//                 </ul>
//               </div>
//               <div>
//                 <h2 className="mb-6 text-sm font-semibold text-gray-900 uppercase dark:text-white">Follow us</h2>
//                 <ul className="text-white dark:text-gray-400 font-medium">
//                   <li className="mb-4">
//                     <a href="https://github.com/themesberg/flowbite" className="hover:underline">Github</a>
//                   </li>
//                   <li>
//                     <a href="https://discord.gg/4eeurUVvTy" className="hover:underline">Discord</a>
//                   </li>
//                 </ul>
//               </div>
//               <div>
//                 <h2 className="mb-6 text-sm font-semibold text-gray-900 uppercase dark:text-white">Legal</h2>
//                 <ul className="text-white dark:text-gray-400 font-medium">
//                   <li className="mb-4">
//                     <a href="#" className="hover:underline">Privacy Policy</a>
//                   </li>
//                   <li>
//                     <a href="#" className="hover:underline">Terms &amp; Conditions</a>
//                   </li>
//                 </ul>
//               </div>
//             </div>
//           </div>
//           <hr className="my-6 border-gray-200 sm:mx-auto dark:border-gray-700 lg:my-8" />
//           <div className="sm:flex sm:items-center sm:justify-between">
//             <span className="text-sm text-gray-500 sm:text-center dark:text-gray-400">© 2023 <a href="https://flowbite.com/" className="hover:underline">Flowbite</a>. All Rights Reserved.</span>
//             <div className="flex mt-4 space-x-5 sm:justify-center sm:mt-0">
//               <a href="#" className="text-gray-500 hover:text-gray-900 dark:hover:text-white">
//                 <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 8 19" aria-hidden="true">
//                   <path fillRule="evenodd" d="M5.164 18.75V9.765h3.163L8.5 6.326H5.164V4.35c0-.927.267-1.558 1.646-1.558H8.5V.237C8.176.196 7.176 0 6.005 0 3.676 0 2.09 1.408 2.09 3.993v2.333H0v3.439h2.09V18.75h3.074z" clipRule="evenodd" />
//                 </svg>
//                 <span className="sr-only">Facebook page</span>
//               </a>
//               <a href="#" className="text-gray-500 hover:text-gray-900 dark:hover:text-white">
//                 <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 21 16" aria-hidden="true">
//                   <path d="M7.34 12.27l-4.81-4.78L0 9.97l7.34 7.27L21 3.65l-2.53-2.44z" />
//                 </svg>
//                 <span className="sr-only">Twitter page</span>
//               </a>
//               <a href="#" className="text-gray-500 hover:text-gray-900 dark:hover:text-white">
//                 <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
//                   <path fillRule="evenodd" d="M10 0C4.477 0 0 4.478 0 10s4.477 10 10 10 10-4.478 10-10S15.523 0 10 0zm0 18.125a8.125 8.125 0 1 1 0-16.25 8.125 8.125 0 0 1 0 16.25zm-1.25-8.334v4.167H6.667V9.792h2.083zm-1.042-2.083a1.042 1.042 0 1 1 2.083 0 1.042 1.042 0 0 1-2.083 0zm7.292 2.083v4.167H13.75v-2.5a1.25 1.25 0 0 0-2.5 0v2.5H8.333v-4.167H9.79v.677a2.71 2.71 0 0 1 2.5-1.46 2.71 2.71 0 0 1 2.5 1.46v-.677h1.667z" clipRule="evenodd" />
//                 </svg>
//                 <span className="sr-only">LinkedIn page</span>
//               </a>
//             </div>
//           </div>
//         </div>
//       </footer>
//     </div>
//   );
// }

// export default Home;





// 'use client'

// // import { io } from 'socket.io-client';
// import React, { useEffect, useRef, useState, useCallback } from 'react';
// import Header from '@/components/landing-page/Header';
// import { signOut } from 'next-auth/react';
// import { useRouter, useSearchParams } from 'next/navigation';
// import UserMap from '@/app/UserMap/page';
// import { LoadScript, Autocomplete } from '@react-google-maps/api';
// import axios from 'axios';
// import socket from '../../../lib/socket'

// interface Position {
//   lat: number;
//   lng: number;
// }

// // const socket = io('http://localhost:5000', { withCredentials: true });


// const libraries: ('places')[] = ['places'];

// function Home() {
//   const router = useRouter();
//   const searchParams = useSearchParams();
//   const email = searchParams.get('email') || '';

//   const [pickupPosition, setPickupPosition] = useState<Position | null>(null);
//   const [destinationPosition, setDestinationPosition] = useState<Position | null>(null);

//   const [autocompleteLoaded, setAutocompleteLoaded] = useState(false);

//   useEffect(() => {
//     const handleAutocompleteLoad = () => {
//       setAutocompleteLoaded(true);
//     };

//     if (!autocompleteLoaded && window.google) {
//       handleAutocompleteLoad();
//     } else {
//       window.addEventListener('google:load', handleAutocompleteLoad);
//     }

//     return () => {
//       window.removeEventListener('google:load', handleAutocompleteLoad);
//     };
//   }, [autocompleteLoaded]);

//   const handleSignOut = async () => {
//     await signOut({ redirect: false });
//     router.push('/login');
//   };

//   const handlePlaceSelect = useCallback((autocompleteRef: React.MutableRefObject<google.maps.places.Autocomplete | null>, type: 'pickup' | 'destination') => {
//     const place = autocompleteRef.current?.getPlace();
//     const location = place?.geometry?.location;
//     if (location) {
//       const newPosition = {
//         lat: location.lat(),
//         lng: location.lng(),
//       };

//       if (type === 'pickup') {
//         setPickupPosition(newPosition);
//       } else {
//         setDestinationPosition(newPosition);
//       }
//     }
//   }, []);

//   const pickupAutocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
//   const pickupInputRef = useRef<HTMLInputElement | null>(null);
//   const destinationAutocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);

//   const handleGetCurrentLocation = () => {
//     if (navigator.geolocation) {
//       navigator.geolocation.getCurrentPosition((position) => {
//         const newPosition = {
//           lat: position.coords.latitude,
//           lng: position.coords.longitude,
//         };
//         setPickupPosition(newPosition);

//         if (pickupInputRef.current) {
//           pickupInputRef.current.value = `Lat: ${newPosition.lat}, Lng: ${newPosition.lng}`;
//         }
//       }, (error) => {
//         console.error("Error getting current location:", error);
//       });
//     } else {
//       console.error("Geolocation is not supported by this browser.");
//     }
//   };

//   const handleConfirmRide = async () => {
//     if (!pickupPosition || !destinationPosition) {
//       console.error("Both pickup and destination positions are required.");
//       return;
//     }

//     try {
//       const response = await axios.post('http://localhost:5000/server/user/savedlocation', {
//         pickupPosition,
//         destinationPosition,
//         email,
     
//       });

//       console.log('Location saved:', response.data.message);

//       // Emit ride confirmation to the server
//       socket.emit('rideRequest', {
//         pickupPosition,
//         destinationPosition,
//         email,

//         userSocketId: socket.id,
//       });
      
//     } catch (error) {
//       console.error('Error saving location:', error);
//     }
//   };

//   return (
//     <LoadScript googleMapsApiKey={process.env.GOOGLE_MAP_API_KEY || 'AIzaSyCAzgjpFOMCqPpDdaoI-ZPS6ihQygdp0rY'} libraries={libraries}>
//       <div className='mt-3'>
//         <Header />
//         <button onClick={handleSignOut} className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded">
//           Sign Out
//         </button>
//         <div className="flex flex-col lg:flex-row justify-start items-start mt-24 mx-4 lg:mx-8 gap-8 bg-indigo-300">
//           <div className="w-full h-5/6 mt-16 ms-2 lg:w-1/4 p-6 bg-slate-300 shadow rounded-lg">
//             <h1 className="text-xl font-bold mb-4">Pointer</h1>
//             <div className="mb-4 gap-4 relative">
//               <Autocomplete
//                 onLoad={ref => pickupAutocompleteRef.current = ref}
//                 onPlaceChanged={() => handlePlaceSelect(pickupAutocompleteRef, 'pickup')}
//               >
//                 <input
//                   ref={pickupInputRef}
//                   type="text"
//                   placeholder="Pickup Location"
//                   className="w-full p-2 border border-gray-300 rounded mb-2"
//                 />
//               </Autocomplete>
//               <button
//                 onClick={handleGetCurrentLocation}
//                 className="absolute right-0 top-0 mt-2 mr-2 text-white p-2 rounded"
//               >
//                 📍
//               </button>
//             </div>
//             <div className='gap-4'>
//               <Autocomplete
//                 onLoad={ref => destinationAutocompleteRef.current = ref}
//                 onPlaceChanged={() => handlePlaceSelect(destinationAutocompleteRef, 'destination')}
//               >
//                 <input
//                   type="text"
//                   placeholder="Destination Location"
//                   className="w-full p-2 border border-gray-300 rounded mb-2"
//                 />
//               </Autocomplete>
//               <button className="w-full bg-slate-800 text-white py-2 rounded" onClick={handleConfirmRide}>
//                 Confirm Ride
//               </button>
//             </div>
//           </div>
//           <div className="w-full h-5/6 lg:w-3/4 p-4 mt-10 bg-slate-300 shadow rounded-lg">
//             <UserMap email={email} pickupPosition={pickupPosition} destinationPosition={destinationPosition} />
//           </div>
//         </div>
//         <footer className="bg-white dark:bg-gray-900 w-full">
//           <div className="mx-auto bg-slate-500 w-full max-w-screen-xl p-4 py-6 lg:py-8">
//             <div className="md:flex md:justify-between">
//               <div className="mb-6 md:mb-0">
//                 <h1 className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white mt-20 ml-28">codeBlue</h1>
//               </div>
//               <div className="grid grid-cols-2 gap-8 sm:gap-6 sm:grid-cols-3">
//                 <div>
//                   <h2 className="mb-6 text-sm font-semibold text-gray-900 uppercase dark:text-white">COMPANY</h2>
//                   <ul className="text-white dark:text-gray-400 font-medium">
//                     <li className="mb-4">
//                       <a href="" className="hover:underline">About us</a>
//                     </li>
//                     <li>
//                       <a href="" className="hover:underline">Service</a>
//                     </li>
//                     <li>
//                       <a href="" className="hover:underline">Contact us</a>
//                     </li>
//                   </ul>
//                 </div>
//                 <div>
//                   <h2 className="mb-6 text-sm font-semibold text-gray-900 uppercase dark:text-white">HELPS</h2>
//                   <ul className="text-white dark:text-gray-400 font-medium">
//                     <li className="mb-4">
//                       <a href="" className="hover:underline ">Customer support</a>
//                     </li>
//                     <li>
//                       <a href="" className="hover:underline">Ticket Raise</a>
//                     </li>
//                   </ul>
//                 </div>
//                 <div>
//                   <h2 className="mb-6 text-sm font-semibold text-gray-900 uppercase dark:text-white">Legal</h2>
//                   <ul className="text-white dark:text-gray-400 font-medium">
//                     <li className="mb-4">
//                       <a href="#" className="hover:underline">Privacy Policy</a>
//                     </li>
//                     <li>
//                       <a href="#" className="hover:underline">Terms &amp; Conditions</a>
//                     </li>
//                   </ul>
//                 </div>
//               </div>
//             </div>
//             <hr className="my-6 border-gray-200 sm:mx-auto dark:border-gray-700 lg:my-8" />
//             <div className="sm:flex sm:items-center sm:justify-between">
//               <span className="text-sm text-gray-500 sm:text-center dark:text-gray-400">© 2023 <a href="" className="hover:underline">codeBlue</a>. All Rights Reserved.</span>
//               <div className="flex mt-4 space-x-5 sm:justify-center sm:mt-0">
//                 <a href="#" className="text-gray-500 hover:text-gray-900 dark:hover:text-white">
//                   <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 8 19" aria-hidden="true">
//                     <path fillRule="evenodd" d="M5.164 18.75V9.765h3.163L8.5 6.326H5.164V4.35c0-.927.267-1.558 1.646-1.558H8.5V.237C8.176.196 7.176 0 6.005 0 3.676 0 2.09 1.408 2.09 3.993v2.333H0v3.439h2.09V18.75h3.074z" clipRule="evenodd" />
//                   </svg>
//                   <span className="sr-only">Facebook page</span>
//                 </a>
//                 <a href="#" className="text-gray-500 hover:text-gray-900 dark:hover:text-white">
//                   <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 21 16" aria-hidden="true">
//                     <path d="M7.34 12.27l-4.81-4.78L0 9.97l7.34 7.27L21 3.65l-2.53-2.44z" />
//                   </svg>
//                   <span className="sr-only">Twitter page</span>
//                 </a>
//                 <a href="#" className="text-gray-500 hover:text-gray-900 dark:hover:text-white">
//                   <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
//                     <path fillRule="evenodd" d="M10 0C4.477 0 0 4.478 0 10s4.477 10 10 10 10-4.478 10-10S15.523 0 10 0zm0 18.125a8.125 8.125 0 1 1 0-16.25 8.125 8.125 0 0 1 0 16.25zm-1.25-8.334v4.167H6.667V9.792h2.083zm-1.042-2.083a1.042 1.042 0 1 1 2.083 0 1.042 1.042 0 0 1-2.083 0zm7.292 2.083v4.167H13.75v-2.5a1.25 1.25 0 0 0-2.5 0v2.5H8.333v-4.167H9.79v.677a2.71 2.71 0 0 1 2.5-1.46 2.71 2.71 0 0 1 2.5 1.46v-.677h1.667z" clipRule="evenodd" />
//                   </svg>
//                   <span className="sr-only">LinkedIn page</span>
//                 </a>
//               </div>
//             </div>
//           </div>
//         </footer>
//       </div>
//     </LoadScript>
//   );
// }

// export default Home;


// 'use client';
// import Header from '@/components/landing-page/Header';
// import { signOut } from 'next-auth/react';
// import { useRouter, useSearchParams } from 'next/navigation';
// import React, { useState, useRef, useCallback, useEffect } from 'react';
// import UserMap from '@/app/UserMap/page';
// import { LoadScript, Autocomplete } from '@react-google-maps/api';
// import axios from 'axios';

// interface Position {
//   lat: number;
//   lng: number;
// }

// const libraries: ('places')[] = ['places'];

// function Home() {
//   const router = useRouter();
//   const searchParams = useSearchParams();
//   const email = searchParams.get('email') || '';
//   console.log("email:", email);

//   const [pickupPosition, setPickupPosition] = useState<Position | null>(null);
//   const [destinationPosition, setDestinationPosition] = useState<Position | null>(null);



//   const [autocompleteLoaded, setAutocompleteLoaded] = useState(false);

//   useEffect(() => {
//     const handleAutocompleteLoad = () => {
//       setAutocompleteLoaded(true);
//     };

//     if (!autocompleteLoaded && window.google) {
//       handleAutocompleteLoad();
//     } else {
//       window.addEventListener('google:load', handleAutocompleteLoad);
//     }

//     return () => {
//       window.removeEventListener('google:load', handleAutocompleteLoad);
//     };
//   }, [autocompleteLoaded]);


//   const handleSignOut = async () => {
//     await signOut({ redirect: false });
//     router.push('/login');
//   };

//   const handlePlaceSelect = useCallback((autocompleteRef: React.MutableRefObject<google.maps.places.Autocomplete | null>, type: 'pickup' | 'destination') => {
//     const place = autocompleteRef.current?.getPlace();
//     const location = place?.geometry?.location;
//     if (location) {
//       const newPosition = {
//         lat: location.lat(),
//         lng: location.lng(),
//       };

//       if (type === 'pickup') {
//         setPickupPosition(newPosition);
//       } else {
//         setDestinationPosition(newPosition);
//       }
//     }
//   }, []);

//   const pickupAutocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
//   const pickupInputRef = useRef<HTMLInputElement | null>(null);
//   const destinationAutocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);

//   const handleGetCurrentLocation = () => {
//     if (navigator.geolocation) {
//       navigator.geolocation.getCurrentPosition((position) => {
//         const newPosition = {
//           lat: position.coords.latitude,
//           lng: position.coords.longitude,
//         };
//         setPickupPosition(newPosition);

//         // Update the pickup input field with the new position
//         if (pickupInputRef.current) {
//           pickupInputRef.current.value = `Lat: ${newPosition.lat}, Lng: ${newPosition.lng}`;
//         }
//       }, (error) => {
//         console.error("Error getting current location:", error);
//       });
//     } else {
//       console.error("Geolocation is not supported by this browser.");
//     }
//   };
  

//   const handleConfirmRide = async () => {
//     if (!pickupPosition || !destinationPosition) {
//       console.error("Both pickup and destination positions are required.");
//       return;
//     }
  
//     try {
//       const response = await axios.post('http://localhost:5000/server/user/savedlocation', {
//         pickupPosition,
//         destinationPosition,
//         email,
//       });
  
//       console.log('Location saved:', response.data.message);
//     } catch (error) {
//       console.error('Error saving location:', error);
//     }
//   };
  
//   return (
//     <LoadScript googleMapsApiKey={process.env.GOOGLE_MAP_API_KEY || 'AIzaSyCAzgjpFOMCqPpDdaoI-ZPS6ihQygdp0rY'} libraries={libraries}>
//       <div className='mt-3'>
//         <Header />
//         <button onClick={handleSignOut} className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded">
//           Sign Out
//         </button>
//         <div className="flex flex-col lg:flex-row justify-start items-start mt-24 mx-4 lg:mx-8 gap-8 bg-indigo-300">
//           <div className="w-full h-5/6 mt-16 ms-2 lg:w-1/4 p-6 bg-slate-300 shadow rounded-lg">
//             <h1 className="text-xl font-bold mb-4">Pointer</h1>
//             <div className="mb-4 gap-4 relative">
//               <Autocomplete
//                 onLoad={ref => pickupAutocompleteRef.current = ref}
//                 onPlaceChanged={() => handlePlaceSelect(pickupAutocompleteRef, 'pickup')}
//               >
//                 <input
//                   ref={pickupInputRef}
//                   type="text"
//                   placeholder="Pickup Location"
//                   className="w-full p-2 border border-gray-300 rounded mb-2"
//                 />
//               </Autocomplete>
//               <button
//                 onClick={handleGetCurrentLocation}
//                 className="absolute right-0 top-0 mt-2 mr-2 text-white p-2 rounded"
//               >
//                 📍
//               </button>
//               {/* <button className="w-full gap-4 bg-slate-800 text-white py-2 rounded" onClick={() => { }}>
//                 Set Pickup
//               </button> */}
//             </div>
//             <div className='gap-4'>
//               <Autocomplete
//                 onLoad={ref => destinationAutocompleteRef.current = ref}
//                 onPlaceChanged={() => handlePlaceSelect(destinationAutocompleteRef, 'destination')}
//               >
//                 <input
//                   type="text"
//                   placeholder="Destination Location"
//                   className="w-full p-2 border border-gray-300 rounded mb-2"
//                 />
//               </Autocomplete>
//               <button className="w-full bg-slate-800 text-white py-2 rounded" onClick={handleConfirmRide}>
//                 Confirm Ride
//               </button>
//             </div>
//           </div>
//           <div className="w-full h-5/6 lg:w-3/4 p-4 mt-10 bg-slate-300 shadow rounded-lg">
//             <UserMap email={email} pickupPosition={pickupPosition} destinationPosition={destinationPosition} />
//           </div>
//         </div>
//         <footer className="bg-white dark:bg-gray-900 w-full ">
//           <div className="mx-auto bg-slate-500 w-full max-w-screen-xl p-4 py-6 lg:py-8">
//             <div className="md:flex md:justify-between">
//               <div className="mb-6 md:mb-0">
//                 <h1 className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white mt-20 ml-28">codeBlue</h1>
//               </div>
//               <div className="grid grid-cols-2 gap-8 sm:gap-6 sm:grid-cols-3">
//                 <div>
//                   <h2 className="mb-6 text-sm font-semibold text-gray-900 uppercase dark:text-white">COMPANY</h2>
//                   <ul className="text-white dark:text-gray-400 font-medium">
//                     <li className="mb-4">
//                       <a href="" className="hover:underline">About us</a>
//                     </li>
//                     <li>
//                       <a href="" className="hover:underline">Service</a>
//                     </li>
//                     <li>
//                       <a href="" className="hover:underline">Contact us</a>
//                     </li>
//                   </ul>
//                 </div>
//                 <div>
//                   <h2 className="mb-6 text-sm font-semibold text-gray-900 uppercase dark:text-white">HELPS</h2>
//                   <ul className="text-white dark:text-gray-400 font-medium">
//                     <li className="mb-4">
//                       <a href="" className="hover:underline ">Customer support</a>
//                     </li>
//                     <li>
//                       <a href="" className="hover:underline">Ticket Raise</a>
//                     </li>
//                   </ul>
//                 </div>
//                 <div>
//                   <h2 className="mb-6 text-sm font-semibold text-gray-900 uppercase dark:text-white">Legal</h2>
//                   <ul className="text-white dark:text-gray-400 font-medium">
//                     <li className="mb-4">
//                       <a href="#" className="hover:underline">Privacy Policy</a>
//                     </li>
//                     <li>
//                       <a href="#" className="hover:underline">Terms &amp; Conditions</a>
//                     </li>
//                   </ul>
//                 </div>
//               </div>
//             </div>

//             <hr className="my-6 border-gray-200 sm:mx-auto dark:border-gray-700 lg:my-8" />
//             <div className="sm:flex sm:items-center sm:justify-between">

//             </div>
//           </div>
//         </footer>
//       </div>
//     </LoadScript>
//   );
// }

// export default Home;



