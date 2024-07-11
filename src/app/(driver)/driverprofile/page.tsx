'use client'
import ProfileSidebar from '@/components/sidebar/ProfileSidebar'
import axios from 'axios';
import { useSearchParams } from 'next/navigation';
import React, { Suspense,useEffect, useState } from 'react'
import Loading from '@/components/loading/page';
import { baseUrl } from '@/utils/baseUrl';
function DriverProfile() {
  const searchParams = useSearchParams();
  const email = searchParams.get('email') || '';

  const [user, setUser] = useState({
    drivername: '',
    email: '',
    mobile: '',
  });

  useEffect(() => {
    const fetchUsers = async () => {
        try {
            const response = await axios.get(`${baseUrl}/server/driver/driverProfile/${email}`);
            setUser(response.data);
        } catch (error) {
            console.error('Failed to fetch users', error);
        }
    };

    fetchUsers();
}, [email]);
  return (
    <div className="flex flex-col md:flex-row h-screen bg-gray-100">

      <ProfileSidebar/>
     
      <main className="flex-1 p-6 md:p-8">
        <h1 className="text-2xl font-bold">Profile</h1>
        <div className="mt-8 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <div className="mt-1">
              <input
                type="text"
                readOnly
                value={user.drivername}
                className="block md:w-full  px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-opacity-50"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <div className="mt-1">
              <input
                type="email"
                readOnly
                value={user.email}
                className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-opacity-50"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Phone</label>
            <div className="mt-1">
              <input
                type="tel"
                readOnly
                value={user.mobile}
                className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-opacity-50"
              />
            </div>
          </div>
          <div>
           
          </div>
        </div>
      </main>
    </div>
  )
}
const DriverProfilePage: React.FC = () => {
  return (
    <Suspense fallback={<Loading />}>
      <DriverProfile />
    </Suspense>
  );
};
export default DriverProfilePage
