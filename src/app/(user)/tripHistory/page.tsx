


'use client'

import React, {Suspense, useEffect, useState } from 'react';
import axios from 'axios';
import { useSearchParams } from 'next/navigation';
import UserProfileSidebar from '@/components/sidebar/UserProfileSidebar';
import Loading from '@/components/loading/page';
type Position = {
  lat: number;
  lng: number;
  address: string;
};

interface Trip {
  tripId: string;
  drivername: string;
  pickupPosition: Position;
  destinationPosition: Position;
  tripAmount: number;
  createdAt: string;
}

const TripHistory = () => {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedTripId, setSelectedTripId] = useState<string | null>(null);
  const [ticketDescription, setTicketDescription] = useState('');
  const [ticketStatus, setTicketStatus] = useState<string>(''); // State for ticket status
  const searchParams = useSearchParams();
  const email = searchParams.get('email') || '';

  useEffect(() => {
    const fetchTripHistory = async () => {
      try {
        const response = await axios.get<Trip[]>(`http://localhost:5000/server/user/getTripHistory/${email}`);
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

  useEffect(() => {
    const fetchTicketStatus = async () => {
      if (selectedTripId) {
        try {
          const response = await axios.get(`http://localhost:5000/server/admin/getTicketStatus/${selectedTripId}`);
          console.log("respons",response);
          
          setTicketStatus(response.data.status);
        } catch (error) {
          console.error('Error fetching ticket status:', error);
        }
      }
    };

    fetchTicketStatus();
  }, [selectedTripId]);

  const handleTicket = (tripId: string) => {
    setSelectedTripId(tripId);
    
    
    setShowModal(true);
    setTicketStatus(''); // Reset ticket status when opening modal
  };
  
  const handleSubmitTicket = async () => {
    if (!selectedTripId || !ticketDescription) return;

    try {
      await axios.post('http://localhost:5000/server/admin/raiseTicket', {
        tripId: selectedTripId,
        description: ticketDescription,
      });
      setShowModal(false);
      setTicketDescription('');
     
      const response = await axios.get(`http://localhost:5000/server/admin/getTicketStatus/${selectedTripId}`);
      setTicketStatus(response.data.status);
    } catch (error) {
      console.error('Error sending ticket:', error);
    }
  };
console.log('ticker',ticketStatus);

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
      <UserProfileSidebar />
      <div className="container mx-auto p-6">
        <h1 className="text-4xl font-bold mb-6 text-center">Trip History</h1>
        <div className="bg-white shadow-md rounded-lg p-6">
          {trips.length > 0 ? (
            <ul>
              {trips.map((trip) => (
                <React.Fragment key={trip.tripId}>
                  <li className="mb-4 flex justify-between items-center">
                    <div>
                      <div className="text-lg font-semibold">Trip from ({trip.pickupPosition.address})</div>
                      <div className="text-lg font-semibold">Trip to ({trip.destinationPosition.address})</div>
                      <div className="text-lg text-gray-600">
                        <span className="text font-bold text-2xl text-lime-600">Amount: ${trip.tripAmount}</span><br />
                        <span>Driver: {trip.drivername}</span><br />
                        <span className="text text-orange-600">Trip ID: {trip.tripId}</span><br />
                        {/* <span className="text text-blue-700">Date: {new Date(trip.createdAt).toLocaleDateString()}</span> */}
                        <span className="text text-blue-700">
            Date: {new Date(trip.createdAt).toLocaleString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' })}
          </span>
                      </div>
                    </div>
                    <button
                      onClick={() => handleTicket(trip.tripId)}
                      className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700 transition duration-300"
                    >
                      {ticketStatus && selectedTripId === trip.tripId ? `Status: ${ticketStatus}` : 'Raise Ticket'}
                    </button>
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

      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg w-1/2">
            <h2 className="text-2xl mb-4">Raise Ticket</h2>
            <textarea
              className="w-full p-2 border border-gray-300 rounded"
              rows={4}
              value={ticketDescription}
              onChange={(e) => setTicketDescription(e.target.value)}
              placeholder="Describe your issue"
            />
            <div className="mt-4 flex justify-end">
              <button
                onClick={() => setShowModal(false)}
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded mr-2"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitTicket}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700 transition duration-300"
              >
                Submit Ticket
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
const TripHistoryData   : React.FC = () => {
  return (
    
      <Suspense fallback={<Loading />}>
        <TripHistory />
      </Suspense>
   
  );
};
export default TripHistoryData;
