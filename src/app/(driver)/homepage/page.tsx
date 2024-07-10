
'use client'
import React, { useEffect, useState } from 'react';
import DriverNavbar from '@/components/landing-page/DriverNavbar';
import Request from '../../Request/page';
import { useRouter, useSearchParams } from 'next/navigation';
import socket from '../../../lib/socket';
import axios from 'axios';
import { AlertCircle } from "lucide-react";
import { generateRandomId } from '@/lib/randomTripId';
import dotenv from 'dotenv'

dotenv.config()
// Simulated Google Maps API key
// const GOOGLE_MAP_API_KEY = 'AIzaSyCAzgjpFOMCqPpDdaoI-ZPS6ihQygdp0rY';

interface RideRequest {
  data: {
    destinationPosition: {
      lat: number;
      lng: number;
      address: string;
    };
    email: string;
    pickupPosition: {
      lat: number;
      lng: number;
      address: string;
    };
    // userDetails: {
    //   username: string;
    //   mobile: String;
    // };
  userDetails:UserDetails
  };
  userSocketId: string;
}

interface DriverInfo {
  drivername: string;
  vehicleModel: string;
  vehicleNumber: string;
  mobile: string;
  otp: string;
  registrationStatus: string;
}

interface RideResponse {
  userSocketId: string;
  approved: boolean;
  driverInfo?: DriverInfo;
  tripAmount?: number | null;
}
interface UserDetails {
  username: string;
  mobile: string;
}
const RATE_PER_KILOMETER = 20;
const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
  const R = 6371; // Radius of the Earth in kilometers
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c; // Distance in kilometers
  console.log(`Calculated distance: ${distance} km (from ${lat1}, ${lon1} to ${lat2}, ${lon2})`); // Log calculated distance
  return distance;
};



const calculateTripAmount = (pickupPosition: { lat: number; lng: number }, destinationPosition: { lat: number; lng: number }): number => {
  const distance = calculateDistance(pickupPosition.lat, pickupPosition.lng, destinationPosition.lat, destinationPosition.lng);
  const amount = distance * RATE_PER_KILOMETER;
  const roundedAmount = Math.round(amount); // Round the amount to the nearest whole number
  console.log(`Calculated amount: ${amount} (rounded to ${roundedAmount})`);
  return roundedAmount;
};

function Homepage() {
  const router=useRouter()
  const searchParams = useSearchParams();
  const email = searchParams.get('email') || '';
  const [rideRequests, setRideRequests] = useState<RideRequest[]>([]);
  const [isOnline, setIsOnline] = useState<boolean>(false);
  const [registrationStatus, setRegistrationStatus] = useState<string | null>(null);
  const [approvedRequest, setApprovedRequest] = useState<RideRequest | null>(null);
  const [driverInfo, setDriverInfo] = useState<DriverInfo | null>(null); // State to hold driver information
  const [otpInput, setOtpInput] = useState<string>('');
  const [otpVerified, setOtpVerified] = useState<boolean>(false);
  const [showOtpField, setShowOtpField] = useState<boolean>(false);
  const [tripAmount, setTripAmount] = useState<number | null>(null); // State to hold trip amount
  const [driverLocation, setDriverLocation] = useState<{ lat: number; lng: number }>({ lat: 0, lng: 0 }); // State to hold driver's current location
  const [incomingCall, setIncomingCall] = useState<{ handleCallRequest: any } | null>(null); // State for incoming call notification

console.log("tripsmount",tripAmount);

  useEffect(() => {
    const fetchDriverInfo = async () => {
      try {
        const response = await axios.get<{ registrationStatus: string }>(`http://localhost:5000/server/driver/driverkycinfo/${email}`);
        const { registrationStatus } = response.data;
        setRegistrationStatus(registrationStatus);
      } catch (error) {
        console.error('Failed to fetch driver info:', error);
      }
    };

    fetchDriverInfo();

  const savedRequests = localStorage.getItem('RideRequest');
  if (savedRequests) {
    setRideRequests(JSON.parse(savedRequests));
    console.log('savedrequest', savedRequests);
  }

  const savedOnlineStatus = localStorage.getItem('isOnline');
  if (savedOnlineStatus) {
    setIsOnline(savedOnlineStatus === 'true');
  }
  const handleRideRequest = (data: RideRequest) => {
    console.log('data', data);
    localStorage.setItem('RideRequests', JSON.stringify(data)); // Save rideResponse to localStorage

    if (isOnline) {
      setRideRequests((prevRequests) => {
        const currentRequests = Array.isArray(prevRequests) ? prevRequests : []; // Ensure prevRequests is an array
        const newRequests = [...currentRequests, data];
       
        return newRequests;
      });
    }
  };

    socket.on('rideRequestClient', handleRideRequest);
    socket.on('incomingCall', handleCallRequest);


    const fetchDriverLocation = async () => {
      try {
        // Example: Fetch driver's location using navigator.geolocation.getCurrentPosition
        navigator.geolocation.getCurrentPosition((position) => {
          const newDriverLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          console.log('Fetched driver location:', newDriverLocation); // Log the fetched driver location
          setDriverLocation(newDriverLocation);
        });
      } catch (error) {
        console.error('Error fetching driver location:', error);
      }
    };

    fetchDriverLocation();



    return () => {
      socket.off('rideRequestClient', handleRideRequest);
      socket.off('incomingCall', handleCallRequest);

    };
  }, [isOnline, email]);
  useEffect(() => {
    const storedApprovedRequest = localStorage.getItem('approvedRequest');
    console.log("type",typeof(storedApprovedRequest));
    
    console.log('storedApprovedRequest',storedApprovedRequest);
    
    if (storedApprovedRequest) {
      setApprovedRequest(JSON.parse(storedApprovedRequest));
      console.log("appprrrovvestate",approvedRequest);
      
    }
    const driverInf=localStorage.getItem('rideResponsed')
 if(driverInf){
  setDriverInfo(JSON.parse(driverInf))
  setTripAmount(Number(tripAmount))
 }
  }, []);
 

  const handleApprove = async (request: RideRequest) => {
    try {
      const response = await axios.get<DriverInfo>(`http://localhost:5000/server/driver/driverInfo/${email}`);
      const driverInfo = response.data;
      console.log('driverInfo', driverInfo);
      const amount = calculateTripAmount(request.data.pickupPosition, request.data.destinationPosition);
      
      const rideResponse: RideResponse = {
        userSocketId: request.userSocketId,
        approved: true,
        driverInfo: driverInfo,
        tripAmount:amount
       
      };
console.log("rideResponse",rideResponse),rideResponse;
console.log("rideResponsed",request);
localStorage.setItem('rideResponsed', JSON.stringify(rideResponse)); // Save rideResponse to localStorage

      socket.emit('rideApproved', rideResponse);

      setApprovedRequest(request);
     
     
      console.log("setApprovedRequest",approvedRequest);
      localStorage.setItem('approvedRequest', JSON.stringify(request)); // Save rideResponse to localStorage

      setDriverInfo(driverInfo); // Store driver information in state
      
     
      setTripAmount(amount);
console.log("setTripAmount",tripAmount);

const tripIds=generateRandomId()
console.log("tripIds",tripIds);

const saveTripDetailsResponse=await axios.post('http://localhost:5000/server/driver/saveTripDetails', {
  email,
  tripDetails: {
    userEmail: request.data.email,
    pickupPosition: request.data.pickupPosition,
    destinationPosition: request.data.destinationPosition,
    tripAmount: amount,
    tripId:tripIds
  }
});


const tripId = saveTripDetailsResponse.data.driver.tripDetails.slice(-1)[0].tripId;


await axios.post('http://localhost:5000/server/user/updateTripId', {
  email: request.data.email,
  tripDetails: {
    drivername: driverInfo.drivername,
    pickupPosition: request.data.pickupPosition,
    destinationPosition: request.data.destinationPosition,
    tripAmount: amount,
    tripId: tripId
  }
});

      setRideRequests((prevRequests) => {
        const newRequests = prevRequests.filter((r) => r !== request);
        localStorage.setItem('rideRequests', JSON.stringify(newRequests));
        return newRequests;
      });
    
    } catch (error) {
      console.error('Error approving ride request:', error);
    }
  };
  
  


  const handleReject = (request: RideRequest) => {
    const response: RideResponse = {
      userSocketId: request.userSocketId,
      approved: false,
    };
    socket.emit('rideRejected', response);
    setRideRequests((prevRequests) => {
      const newRequests = prevRequests.filter((r) => r !== request);
      localStorage.setItem('rideRequests', JSON.stringify(newRequests));
      return newRequests;
    });
  };


  const handleCallRequest = (data: any) => {
    // Logic to handle incoming call data
    console.log('Incoming call data:', data);
  
    setIncomingCall(data);
    console.log("calldata",data);
  };

  // Function to accept the incoming call
  const handleAcceptCall = () => {
   const mobile=incomingCall?.handleCallRequest.mobile
   console.log("mobile",mobile);
   
     router.push(`/Room/${mobile}`)
    socket.emit('callAccepted', { /* include necessary data */ });

    // Clear incoming call notification
    setIncomingCall(null);
  };

  // Function to reject the incoming call
  const handleRejectCall = () => {
  
    socket.emit('callRejected', { /* include necessary data */ });

    // Clear incoming call notification
    setIncomingCall(null);
  };


  const toggleOnlineStatus = async () => {
    const newStatus = !isOnline ? 'available' : 'unavailable';
    

    try {
      await axios.post('http://localhost:5000/server/driver/isOnlineOffline', { email, status: newStatus });
      setIsOnline(!isOnline);
      localStorage.setItem('isOnline', (!isOnline).toString());

    } catch (error) {
      console.error('Failed to update status:', error);
    }
  };

  const handleNavigateToPickup = (pickupPosition: { lat: number; lng: number }) => {
    console.log('Navigating to pickup location:', pickupPosition);
    window.open(`https://www.google.com/maps/dir/?api=1&destination=${pickupPosition.lat},${pickupPosition.lng}`, '_blank');
  };

  const handleNavigateToDestination = (destinationPosition: { lat: number; lng: number }) => {
    console.log('Navigating to destination location:', destinationPosition);
    window.open(`https://www.google.com/maps/dir/?api=1&destination=${destinationPosition.lat},${destinationPosition.lng}`, '_blank');
  };



  const handleReachedPickup = () => {
    console.log('Driver has reached the pickup location');
    if (approvedRequest) {
      socket.emit('driverReachedPickup', {
        userSocketId: approvedRequest.userSocketId,
        message: 'Driver has reached the pickup location',
      });
    }
    setShowOtpField(true);
  };


  const handleOtpChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setOtpInput(event.target.value);
  };

  const handleOtpVerify = async () => {
    if (driverInfo && driverInfo.otp?.toString() === otpInput) {
      setOtpVerified(true);
      const amount = calculateTripAmount(approvedRequest!.data.pickupPosition, approvedRequest!.data.destinationPosition);
      setTripAmount(amount);
      console.log('OTP verified successfully');
    } else {
      console.log('Invalid OTP');
    }
  };
  const handleHome=()=>{
    localStorage.removeItem('Riderequests');
  setRideRequests([]);
  setApprovedRequest(null);
  setTripAmount(null)
    router.push(`/homepage?email=${email}`)
  }
  const handleCall = () => {
    // Check if driverDetails is available
    console.log('rideRequests:', rideRequests);
    if (approvedRequest) {
      
      
      const userDetails = approvedRequest.data.userDetails;
      const roomID = userDetails.mobile.toString(); // Convert mobile number to string
  
      console.log("room", roomID);
  
      router.push(`/Room/${roomID}`);
      socket.emit('callUser', {
        email: email,
        mobile: userDetails.mobile,
       
      });
      
    } else {
      console.error("No ride requests available to make a call.");
      
    }
  };

  return (
    <>
      <div className=''>
        <DriverNavbar email={email} />
      </div>

      <div className="flex flex-col lg:flex-row justify-start items-start mt-24 mx-4 lg:mx-8 gap-8 bg-indigo-300">
        <div className="w-full h-5/6 mt-16 lg:w-1/4 p-6 bg-slate-300 shadow rounded-lg">
          {registrationStatus === 'pending' || registrationStatus === 'rejected' ? (
            <div className="bg-red-500 text-white p-4 rounded-lg m-4">
              <AlertCircle className="inline-block mr-2" />
              Your registration is {registrationStatus}. Please complete your KYC registration from your Profile.
            </div>
          ) : null}

          <button
            onClick={toggleOnlineStatus}
            className={`p-2 rounded-full border-2 ${isOnline ? 'bg-green-500 border-green-700' : 'bg-red-500 border-red-700'} text-white font-semibold shadow-lg transition duration-300 ease-in-out transform hover:scale-105 hover:shadow-xl`}
          >
            {isOnline ? 'Go Offline' : 'Go Online'}
          </button>

          <h1 className="text-xl font-bold mb-4">Pointer</h1>
          <div className="mb-4 gap-4">
            <h1>Ride Requests</h1>
            {rideRequests.length > 0 ? (
              rideRequests.map((request: RideRequest, index: number) => {
                const { data } = request;
                const { destinationPosition, email = 'N/A', pickupPosition } = data;


                const distanceToPickup = pickupPosition ? calculateDistance(driverLocation.lat, driverLocation.lng, pickupPosition.lat, pickupPosition.lng) : 0;
                console.log(`Driver Location: ${driverLocation.lat}, ${driverLocation.lng}`);
                console.log(`Pickup Location: ${pickupPosition.lat}, ${pickupPosition.lng}`);
                console.log(`Distance to Pickup: ${distanceToPickup}`);

                return (
                  <div key={index} className="ride-request">
                    <p>User Email: {email}</p>
                    {pickupPosition && destinationPosition ? (
                      <>
                        <p>Pickup Location: Lat {pickupPosition.address}</p>
                        <p>Destination Location: Lat {destinationPosition.address}</p>
                        <p>Distance to Pickup: {calculateDistance(driverLocation.lat, driverLocation.lng, request.data.pickupPosition.lat, request.data.pickupPosition.lng)} km</p>
                        <button onClick={() => handleApprove(request)} className="bg-green-500 text-white px-4 py-2 rounded mr-2">Approve</button>
                        <button onClick={() => handleReject(request)} className="bg-red-500 text-white px-4 py-2 rounded">Reject</button>
                      </>
                    ) : (
                      <p>Invalid location data</p>
                    )}
                  </div>
                );
              })
            ) : (
              <p>No ride requests available.</p>
            )}
          </div>
          {/* Display incoming call notification */}
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
        

          {approvedRequest && driverInfo &&  (
            <div className="bg-indigo-100 p-4 mt-4 rounded-lg">
              <h2 className="text-lg font-bold mb-2">Approved Ride Details</h2>
              
              <p><span className="font-semibold">UserName:</span> {approvedRequest.data.userDetails.username}</p>
      <p><span className="font-semibold">Email:</span> {approvedRequest.data.email}</p>
      <p><span className="font-semibold">Pickup Location:</span> Lat {approvedRequest.data.pickupPosition.address}</p>
      <p><span className="font-semibold">Destination Location:</span> Lat {approvedRequest.data.destinationPosition.address}</p>
      <p><span className="font-semibold">User Mobile:</span> {approvedRequest.data.userDetails.mobile}</p>
   

              <button onClick={() => handleNavigateToPickup(approvedRequest.data.pickupPosition)} className="bg-blue-500 text-white px-4 py-2 rounded mt-2">Navigate to Pickup</button>
              <button onClick={handleReachedPickup} className="bg-green-500 text-white px-4 py-2 rounded mt-2">Reached Pickup Location</button>
                      <button
                    onClick={handleCall}
                    className="mt-4 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
                  >
                    Make a Call
                  </button>
              {showOtpField && (
                <>
                  {otpVerified ? (
                    <div>
                      <p>OTP verified successfully</p>
                      <button onClick={() => handleNavigateToDestination(approvedRequest.data.destinationPosition)} className="bg-blue-500 text-white px-4 py-2 rounded mt-2">Navigate to Destination</button>
                    </div>
                  ) : (
                    <>
                      <input
                        type="text"
                        placeholder="Enter OTP"
                        value={otpInput}
                        onChange={handleOtpChange}
                        className="border p-2 rounded mt-2"
                      />
                      <button onClick={handleOtpVerify} className="bg-green-500 text-white px-4 py-2 rounded mt-2">Verify OTP</button>
                    </>
                  )}
                </>
              )}
              
            </div>
          )}
                 {otpVerified && tripAmount !== null && (
                   <div className="mt-4 p-4 bg-white rounded-lg ">
                <h2 className="text-lg font-bold mb-2">Trip Amount</h2>
                <p>The trip amount is: RS:{tripAmount.toFixed(2)}</p>
                <button onClick={handleHome} className='bg-green-500 text-white px-4 py-2 rounded mt-2'>Trip Completed Go Home</button>
              </div>
            )}
          </div>
        
        <div className="w-full h-5/6 lg:w-3/4 p-4 mt-10 bg-slate-300 shadow rounded-lg">
          <Request email={email} />
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
     
    </>
  );
}

export default Homepage;
