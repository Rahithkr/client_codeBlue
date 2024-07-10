'use client';
import React, { Suspense,useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter, useSearchParams } from 'next/navigation';
import Loading from '@/components/loading/page';
const VerifyOtp: React.FC = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const email = searchParams.get('email') || '';
  const [otp, setOtp] = useState('');
  const [timer, setTimer] = useState(60);
  const [isResendEnabled, setIsResendEnabled] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let countdown: NodeJS.Timeout;
    if (timer > 0) {
      countdown = setInterval(() => {
        setTimer(prevTimer => prevTimer - 1);
      }, 1000);
    } else if (timer === 0) {
      setIsResendEnabled(true);
    }
    return () => clearInterval(countdown);
  }, [timer]);

  const handleOtpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setOtp(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      setLoading(true); // Start loading
      const res = await axios.post('http://localhost:5000/server/driver/verify-otp', { email, otp }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      const data = res.data;

      if (data.success) {
        router.push('/driverlogin');
      } else {
        alert('Invalid OTP');
      }
    } catch (error) {
      console.error('Error verifying OTP:', error);
      alert('An error occurred while verifying OTP');
    } finally {
      setLoading(false); // Stop loading
    }
  };

  const handleResendOtp = async () => {
    try {
      setLoading(true); // Start loading
      const res = await axios.post('http://localhost:5000/server/driver/resend-otp', { email }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      const data = res.data;
      if (data.success) {
        setTimer(60);
        setIsResendEnabled(false);
      } else {
        alert('Failed to resend OTP');
      }
    } catch (error) {
      console.error('Error resending OTP:', error);
      alert('An error occurred while resending OTP');
    } finally {
      setLoading(false); // Stop loading
    }
  };

  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-slate-400">
      <form className="max-w-sm w-full  bg-blue-400 p-8 rounded-lg shadow-md " onSubmit={handleSubmit}>
        <h1 className="text-4xl mb-8 text-gray-900 dark:text-white">Verify OTP</h1>

        {loading ? (
          <div className="flex justify-center items-center mb-5">
            <div className="loader border-t-transparent border-solid border-blue-600 rounded-full animate-spin border-4 h-8 w-8"></div>
          </div>
        ) : (
          <>
            <div className="mb-5">
              <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">OTP</label>
              <input onChange={handleOtpChange} type="text" id="otp" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required />
            </div>
            <div className="flex justify-between items-center mb-5">
              <span>{`Resend OTP in ${timer}s`}</span>
              <button type="button" onClick={handleResendOtp} disabled={!isResendEnabled} className={`text-blue-700 ${!isResendEnabled && 'opacity-50 cursor-not-allowed'}`}>Resend OTP</button>
            </div>
            <div className="flex items-start justify-center mb-4">
              <button type="submit" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Verify OTP</button>
            </div>
          </>
        )}
      </form>
    </div>
  );
};
const OtpVerification: React.FC = () => {
  return (
    
      <Suspense fallback={<Loading />}>
        <VerifyOtp />
      </Suspense>
   
  );
};


export default OtpVerification;
