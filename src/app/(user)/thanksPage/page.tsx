'use client'
import React from 'react';
import { useRouter } from 'next/navigation';
import { useSearchParams } from 'next/navigation';

const ThankYouPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get('email') || '';

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-purple-400 via-pink-500 to-red-500">
      <div className="bg-white p-10 rounded-lg shadow-lg text-center animate-fade-in">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">Thank You!</h1>
        <p className="text-gray-600 mb-8">Your Trip payment successfull.</p>
        <button 
          className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-700 transition duration-300"
          onClick={() => router.push(`/home?email=${email}`)}
        >
          Go to Home
        </button>
      </div>
    </div>
  );
};

export default ThankYouPage;
