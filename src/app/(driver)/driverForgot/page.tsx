'use client'
import React, { useState } from 'react';
import axios from 'axios';
import {toast} from 'sonner'
import { useRouter } from 'next/navigation';

const ForgotPassword: React.FC = () => {
const router=useRouter()

  const [email, setEmail] = useState<string>('');
  const [message, setMessage] = useState<string>('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
        const response = await axios.post('http://localhost:5000/server/driver/forgotpassword', { email });
    
        if (response.status === 200) {
          toast('Check your email for the reset otp.');
          router.push(`/forgotOtp?email=${email}`)
        } else {
            toast('Failed to send reset email.');
        }
      } catch (error) {
        console.error('Error sending reset email:', error);
        toast('An error occurred. Please try again.');
      }
  };

  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-slate-400">
      <form className="max-w-sm w-full bg-white p-8 rounded-lg shadow-md" onSubmit={handleSubmit}>
        <h1 className="text-4xl mb-8 text-gray-900 text-center">Forgot Password</h1>
        <div className="mb-5">
          <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900">Your email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            placeholder="name@example.com"
            required
          />
        </div>
        <button type="submit" className="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center">
          Submit
        </button>
        {message && <p className="mt-5 text-red-500">{message}</p>}
      </form>
    </div>
  );
};

export default ForgotPassword;
