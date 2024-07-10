'use client';
import React, { useState,Suspense } from 'react';
import axios from 'axios';
import { toast } from 'sonner';
import { useSearchParams, useRouter } from 'next/navigation';
import Loading from '@/components/loading/page';
const NewPassword: React.FC = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const email = searchParams.get('email') || '';
  const [newPassword, setNewPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');


  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match.');
      return;
    }


    try {
      const response = await axios.post('http://localhost:5000/server/user/reset-password', { email, newPassword });

      if (response.status === 200) {
        toast.success('Password updated successfully.');
        router.push('/login'); 
      } else {
        toast.error('Error updating password. Please try again.');
      }
    } catch (error) {
      console.error('Error updating password:', error);
      toast.error('An error occurred. Please try again.');
    }
  };

  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-slate-500">
      <form className="max-w-sm w-full bg-blue-400 p-8 rounded-lg shadow-md" onSubmit={handleSubmit}>
        <h1 className="text-4xl mb-8 text-gray-900 text-center">Set New Password</h1>
        <div className="mb-5">
          <label htmlFor="newPassword" className="block mb-2 text-sm font-medium text-gray-900">New Password</label>
          <input
            type="password"
            id="newPassword"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            placeholder="Enter new password"
            required
          />
        </div>
        <div className="mb-5">
          <label htmlFor="confirmPassword" className="block mb-2 text-sm font-medium text-gray-900">Confirm Password</label>
          <input
            type="password"
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            placeholder="Confirm new password"
            required
          />
        </div> 
        <button type="submit" className="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center">
          Set New Password
        </button>
      </form>
    </div>
  );
};
const NewPasswordForm  : React.FC = () => {
  return (
    
      <Suspense fallback={<Loading />}>
        <NewPassword />
      </Suspense>
   
  );
};
export default NewPasswordForm ;
