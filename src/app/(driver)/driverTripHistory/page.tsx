

'use client'
import React, { Suspense,useEffect, useState } from 'react';
import axios from 'axios';
import { useSearchParams } from 'next/navigation';
import ProfileSidebar from '@/components/sidebar/ProfileSidebar';

type Position = {
  lat: number;
  lng: number;
  address:string;
};

interface Trip {
  tripId: string;
  userEmail: string;
  pickupPosition: Position;
  destinationPosition: Position;
  tripAmount: number;
  createdAt: string;
}

const TripHistory = () => {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);
  const searchParams = useSearchParams();
  const email = searchParams.get('email') || '';

  useEffect(() => {
    const fetchTripHistory = async () => {
      try {
        const response = await axios.get<Trip[]>(`http://localhost:5000/server/driver/tripHistory/${email}`);
        
        
        setTrips(response.data);
      } catch (error) {
        console.error('Error fetching trip history:', error);
      } finally {
        setLoading(false);
      }
    };

    if (email) {
      fetchTripHistory();
    }
  }, [email]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full" role="status">
          <span className="visually-hidden"></span>
        </div>
      </div>
    );
  }


  return (
    <div className="flex flex-col md:flex-row h-screen bg-gray-100">
       <ProfileSidebar/>
    <div className="container mx-auto p-6">
      <h1 className="text-4xl font-bold mb-6 text-center">Trip History</h1>
      <div className="bg-white shadow-md rounded-lg p-6">
        {trips.length > 0 ? (
          <ul>
            {trips.map((trip) => (
              <React.Fragment key={trip.tripId}>
                <li className="mb-4">
                <div className="text-lg font-semibold">Trip from ({trip.pickupPosition.address})</div>

                  <div className="text-lg font-semibold">Trip to ({trip.destinationPosition.address})</div>
                  <div className="text-lg text-gray-600">
                    <span className='text font-bold text-2xl text-lime-600'>Amount: ${trip.tripAmount}</span><br />
                    <span className='text text-orange-600'>userName: {trip.userEmail}</span><br />
                    {/* <span className='text text-orange-600'>Trip ID: {trip.tripId}</span><br /> */}

                    <span className='text text-blue-700'>Date: {new Date(trip.createdAt).toLocaleDateString()}</span>
                  </div>
                </li>
                <hr className="border-gray-300" />
              </React.Fragment>
            ))}
          </ul>
        ) : (
          <p className="text-center text-gray-500">No trip history available.</p>
        )}
      </div>
    </div>
    </div>
  );
};

const TripHistoryPage: React.FC = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <TripHistory />
    </Suspense>
  );
};
export default TripHistoryPage;


