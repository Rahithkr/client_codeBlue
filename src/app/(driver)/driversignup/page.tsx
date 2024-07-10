




'use client';
import React, { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

interface formData {
  drivername: string;
  email: string;
  mobile: string;
  password: string;
}

interface Errors {
  drivername?: string;
  email?: string;
  mobile?: string;
  password?: string;
}

const DriverSignup: React.FC = () => {
  const router = useRouter();
  const [formData, setFormData] = useState<formData>({
    drivername: '',
    email: '',
    mobile: '',
    password: '',
  });

  const [errors, setErrors] = useState<Errors>({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const validationErrors: Errors = {};
    if (!formData.drivername) {
      validationErrors.drivername = "Username is required";
    }
    if (!formData.email) {
      validationErrors.email = "Email is required";
    }
    if (!formData.mobile) {
      validationErrors.mobile = "Number is required";
    }
    if (!formData.password) {
      validationErrors.password = "Password is required";
    }
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      return; // Stop submission if there are validation errors
    }

    try {
      setLoading(true); // Start loading
      const res = await axios.post('http://localhost:5000/server/driver/signup', formData, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      const data = res.data;
      if (data.success) {
        console.log('formData.email',formData.email);
        
        router.push(`/signupOtpVerify?email=${formData.email}`);
      } else {
        alert('Signup failed');
      }
    } catch (error) {
      console.error('Error during signup:', error);
      alert('An error occurred during signup');
    } finally {
      setLoading(false); // Stop loading
    }
  };

  return (
    <div className="flex flex-col md:flex-row justify-center items-center min-h-screen bg-slate-400">
      <div className="flex justify-center items-center w-full md:w-1/2 p-5">
        <form className="max-w-sm w-full" onSubmit={handleSubmit}>
          <h1 className="text-4xl mb-8 text-gray-900 dark:text-white">Driver Sign up</h1>
          <div className="mb-3">
            <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your Name</label>
            <input onChange={handleChange} type="text" id="drivername" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />
            {errors.drivername && <p className='text-red-500'>{errors.drivername}</p>}
          </div>
          <div className="mb-3">
            <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your email</label>
            <input onChange={handleChange} type="email" id="email" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="name@flowbite.com" />
            {errors.email && <p className='text-red-500'>{errors.email}</p>}
          </div>
          <div className="mb-3">
            <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your Mobile</label>
            <input onChange={handleChange} type="number" id="mobile" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />
            {errors.mobile && <p className='text-red-500'>{errors.mobile}</p>}
          </div>
          <div className="mb-5">
            <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your password</label>
            <input onChange={handleChange} type="password" id="password" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />
            {errors.password && <p className='text-red-500'>{errors.password}</p>}
          </div>

          <div className="flex items-start justify-center mb-4">
            <button type="submit" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Get OTP</button>
          </div>

          <p className='text text-slate-900 ms-5 mt-3'>Already have an account?<a href="/driverlogin"><span className='text text-blue-700'> Sign in </span></a></p>
        </form>
      </div>
      <div className="flex justify-center items-center w-full md:w-1/2 p-5">
        <img src="https://i2-prod.walesonline.co.uk/incoming/article25253902.ece/ALTERNATES/s1200c/0_400890Ambulance-S10.jpg" alt="Ambulance staff" className="max-w-full h-auto" />
      </div>
    </div>
  );
};

export default DriverSignup;


