

'use client'
import UserProfileSidebar from '@/components/sidebar/UserProfileSidebar';
import axios from 'axios';
import React, { Suspense,useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import {toast} from 'sonner'
import Loading from '@/components/loading/page';
import { baseUrl } from '@/utils/baseUrl';
function EditProfile() {
  const searchParams = useSearchParams();
  const email = searchParams.get('email') || '';

  const [user, setUser] = useState({
    username: '',
    email: '',
    mobile: '',
  });

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await axios.get(`${baseUrl}/server/user/userProfile/${email}`);
        setUser(response.data);
      } catch (error) {
        console.error('Failed to fetch user details', error);
      }
    };

    fetchUserDetails();
  }, [email]);

  const handleFormSubmit = async (event:any) => {
    event.preventDefault();
    try {
      await axios.put(`${baseUrl}/server/user/updateProfile/${email}`, user);
      toast('Profile updated successfully!');
    } catch (error) {
      console.error('Failed to update profile', error);
    }
  };

  const handleInputChange = (event:any) => {
    const { name, value } = event.target;
    setUser((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));
  };

  return (
    <div className="flex flex-col md:flex-row h-screen bg-gray-100">
      <UserProfileSidebar />
      <main className="flex-1 p-6 md:p-8">
        <h1 className="text-2xl font-bold">Edit Profile</h1>
        <form onSubmit={handleFormSubmit} className="mt-8 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <div className="mt-1">
              <input
                type="text"
                name="username"
                value={user.username}
                onChange={handleInputChange}
                className="block md:w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-opacity-50"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <div className="mt-1">
              <input
                type="email"
                name="email"
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
                name="mobile"
                value={user.mobile}
                onChange={handleInputChange}
                className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-opacity-50"
              />
            </div>
          </div>
          <div>
            <button
              type="submit"
              className="inline-block bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              Save Changes
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
const EditProfileForm : React.FC = () => {
  return (
    
      <Suspense fallback={<Loading />}>
        <EditProfile />
      </Suspense>
   
  );
};
export default EditProfileForm;
