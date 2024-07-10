
'use client'
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'sonner';
import { useSearchParams, useRouter } from 'next/navigation';

const OtpVerification: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get('email') || '';

  const [otp, setOtp] = useState<string>('');
  const [timer, setTimer] = useState(60);
  const [isResendEnabled, setIsResendEnabled] = useState<boolean>(false);

  useEffect(() => {
    let countdown: NodeJS.Timeout;

    if (!isResendEnabled) {
      countdown = setInterval(() => {
        setTimer(prevTimer => {
          if (prevTimer <= 0) {
            clearInterval(countdown); // Stop the countdown
            setIsResendEnabled(true); // Enable the resend button
            return 0;
          }
          return prevTimer - 1;
        });
      }, 1000);
    }

    return () => clearInterval(countdown);
  }, [isResendEnabled]);

  const handleResendOtp = async () => {
    try {
      const response = await axios.post('http://localhost:5000/server/user/forgotpasswordresend-otp', { email });

      if (response.status === 200) {
        toast.success('OTP resent successfully.');
        setTimer(60); // Reset the timer
        setIsResendEnabled(false); // Disable the resend button until timer reaches 0
      } else {
        toast.error('Failed to resend OTP. Please try again.');
      }
    } catch (error) {
      console.error('Error resending OTP:', error);
      toast.error('An error occurred while resending OTP. Please try again.');
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/server/user/forgotpassword-otp', { email, otp });

      if (response.status === 200) {
        toast.success('OTP verified successfully.');
        router.push(`/newPassword?email=${email}`);
      } else {
        toast.error('Invalid OTP. Please try again.');
      }
    } catch (error) {
      console.error('Error verifying OTP:', error);
      toast.error('An error occurred. Please try again.');
    }
  };

  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-slate-500">
      <form className="max-w-sm w-full bg-blue-400 p-8 rounded-lg shadow-md" onSubmit={handleSubmit}>
        <h1 className="text-4xl mb-8 text-gray-900 text-center">OTP Verification</h1>
        <div className="mb-5">
          <label htmlFor="otp" className="block mb-2 text-sm font-medium text-gray-900">Enter OTP</label>
          <input
            type="text"
            id="otp"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            placeholder="Enter OTP"
            required
          />
        </div>
        <div className="flex justify-between items-center mb-5">
          <button type="button" onClick={handleResendOtp} disabled={!isResendEnabled} className={`text-blue-700 ${!isResendEnabled && 'opacity-50 cursor-not-allowed'}`}>Resend OTP</button>
          <span>{`Resend OTP in ${timer}s`}</span>
        </div>
        <button type="submit" className="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center">
          Verify
        </button>
      </form>
    </div>
  );
};

export default OtpVerification;

