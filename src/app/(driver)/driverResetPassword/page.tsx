'use client';
import React, { useState,Suspense } from 'react';
import axios from 'axios';
import { toast } from 'sonner';
import { useSearchParams, useRouter } from 'next/navigation';

const NewPassword: React.FC = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const email = searchParams.get('email') || '';
  const [newPasswords, setNewPasswords] = useState<string>('');
  const [confirmPasswords, setConfirmPasswords] = useState<string>('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (newPasswords !== confirmPasswords) {
      toast.error('Passwords do not match.');
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/server/driver/resetPassword', { email, newPasswords });

      if (response.status === 200) {
        toast.success('Password updated successfully.');
        router.push('/driverlogin'); // Redirect to login page or another page
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
            id="newPasswords"
            value={newPasswords}
            onChange={(e) => setNewPasswords(e.target.value)}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            placeholder="Enter new password"
            required
          />
        </div>
        <div className="mb-5">
          <label htmlFor="confirmPasswords" className="block mb-2 text-sm font-medium text-gray-900">Confirm Password</label>
          <input
            type="password"
            id="confirmPasswords"
            value={confirmPasswords}
            onChange={(e) => setConfirmPasswords(e.target.value)}
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

const NewPasswordPage: React.FC = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <NewPassword />
    </Suspense>
  );
};
export default NewPasswordPage;
