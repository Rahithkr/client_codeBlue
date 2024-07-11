'use client'
import AdminNavbar from '@/components/landing-page/AdminHeader';

import Sidebar from '@/components/sidebar/Sidebar'
import { baseUrl } from '@/utils/baseUrl';

import axios from 'axios';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'


type Position = {
    lat: number;
    lng: number;
    address: string;
  };
  
  interface TripDetails {
    _id: string;
    userEmail: string;
    pickupPosition: Position;
    destinationPosition: Position;
    tripAmount: number;
    createdAt: string;
  }
  
  interface Ticket {
    _id: string;
    tripId: string;
    description: string;
    reply?: string;
    status: string;
    tripDetails?: TripDetails;
  }

function TicketManagement() {
    const router=useRouter()
    
    const [tickets, setTickets] = useState<Ticket[]>([]);
  const [reply, setReply] = useState('');
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);
  

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const response = await axios.get<Ticket[]>(`${baseUrl}/server/admin/tickets`);
        setTickets(response.data);
      } catch (error) {
        console.error('Error fetching tickets:', error);
      }
    };
    fetchTickets();
  }, []);
  const handleReply = async () => {
    if (!selectedTicketId || !reply) return;
console.log("selectedid",selectedTicketId);

    try {
        const response = await axios.post(`${baseUrl}/server/admin/replyTicket`, {
            ticketId: selectedTicketId,
            reply,
            
        });

        // Update the tickets array with the new reply
        setTickets(prevTickets =>
            prevTickets.map(ticket =>
                ticket.tripId === selectedTicketId ? { ...ticket, reply: response.data.ticket.reply } : ticket
            )
        );

        setReply('');
        setSelectedTicketId(null);
    } catch (error) {
        console.error('Error sending reply:', error);
    }
};
const handleDeleteTicket = async (ticketId: string) => {
    try {
      await axios.delete(`http://localhost:5000/server/admin/deleteTicket/${ticketId}`);

      // Update tickets state by filtering out the deleted ticket
      setTickets(prevTickets => prevTickets.filter(ticket => ticket.tripId !== ticketId));
    } catch (error) {
      console.error('Error deleting ticket:', error);
    }
  };


    return (
        <div className='mt-20 flex flex-col'>
            <Sidebar/>
            
            <AdminNavbar/>
        
                        <div className="relative overflow-x-auto shadow-md sm:rounded-lg sm:ml-60">

                <div className="container mx-auto p-6">
      <h1 className="text-4xl font-bold mb-6 text-center">Admin Tickets</h1>
      <div className="bg-white shadow-md rounded-lg p-6">
        {tickets.length > 0 ? (
          <ul>
            {tickets.map((ticket) => (
              <li key={ticket._id} className="mb-4">
                <div className="text-lg font-semibold">Trip from ({ticket.tripDetails?.pickupPosition.address})</div>
                <div className="text-lg font-semibold">Trip to ({ticket.tripDetails?.destinationPosition.address})</div>
                <div className="text-lg text-gray-600">
                  <span className="text font-bold text-2xl text-lime-600">Amount: ${ticket.tripDetails?.tripAmount}</span><br />
                  <span>Driver: {ticket.tripDetails?.userEmail}</span><br />
                  <span className="text text-orange-600">Trip ID: {ticket.tripId}</span><br />
                  <span className="text text-blue-700"> Date: {ticket.tripDetails ? new Date(ticket.tripDetails.createdAt).toLocaleString() : 'N/A'}</span><br />
                  <span className="text text-2xl text-bold text-red-700">Description: {ticket.description}</span><br />
                  <span className="text text-green-700">Reply: {ticket.reply || 'No reply yet'}</span>
                </div>
                <button 
                  onClick={() => setSelectedTicketId(ticket.tripId)} 
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700 transition duration-300"
                >
                  Reply
                </button>
                <button onClick={() => handleDeleteTicket(ticket.tripId)} className="bg-red-500 text-white px-4 py-2 rounded  hover:bg-red-700 transition duration-300 ms-12">Close Ticket</button>
                {selectedTicketId === ticket.tripId && (
                  <div className="mt-4">
                    <textarea
                      value={reply}
                      onChange={(e) => setReply(e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded"
                      placeholder="Write your reply here..."
                    />
                    <button
                      onClick={handleReply}
                      className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-700 transition duration-300 mt-2"
                    >
                      Send Reply
                    </button>
                  </div>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-center text-gray-500">No tickets available.</p>
        )}
      </div>
    </div>
    </div>
        </div>
    )
}

export default TicketManagement;
