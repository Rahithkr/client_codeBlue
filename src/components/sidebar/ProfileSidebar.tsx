'use client'

import axios from 'axios';
import { useRouter, useSearchParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import Image from 'next/image';
import { baseUrl } from '@/utils/baseUrl';

function ProfileSidebar() {
    const router=useRouter()
    const searchParams = useSearchParams();
    const email = searchParams.get('email') || '';

    const [user, setUser] = useState({
      drivername: '',
      mobile: ''
    });
    useEffect(() => {
      const fetchUserProfile = async () => {
        try {
          const response = await axios.get(`${baseUrl}/server/driver/driverProfileSidebar/${email}`);
          setUser(response.data);
        } catch (error) {
          console.error('Failed to fetch user profile', error);
        }
      };
  
      fetchUserProfile();
    }, [email]);


    const handleProfile=(e:any)=>{
         e.preventDefault();
         router.push(`/driverprofile?email=${email}`)
    }

    const handleRegistration=(e:any)=>{
        e.preventDefault()
        router.push(`/driverRegistration?email=${email}`)
    }

    const handleBackHome=(e:any)=>{
      e.preventDefault(
        router.push(`/homepage?email=${email}`)
      )
    }
 const handleHistory=(e:any)=>{
 e.preventDefault()
 router.push(`/driverTripHistory?email=${email}`)
 }

  return (
    <div className='flex flex-col md:flex-row h-screen bg-gray-100'>
         <aside className="w-full md:w-64  bg-white shadow-md">
        <div className="p-6 flex flex-col items-center">
        <Image
            className="rounded-full"
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQGmtdzpTv68MPY036tXoBBqHOaD_lDETPwEw&s"
            alt="User Profile"
            width={128}
            height={128}
          />
          <h2 className="mt-4 text-xl font-semibold text-gray-700">{user.drivername}</h2>
          <p className="text-gray-600">{user.mobile}</p>
          <p className="text-gray-600">{email}</p>
        </div>
        <nav className="mt-6">
          <ul className="space-y-2">
            <li>
              <button
                  onClick={handleProfile} className="block w-full px-4 py-2 text-sm font-semibold text-gray-900 rounded-lg hover:bg-gray-300"
              >
                Profile
              </button>
            </li>
            <li>
              <button
               onClick={handleRegistration}  className="block w-full px-4 py-2 text-sm font-semibold text-gray-900 rounded-lg hover:bg-gray-300"
              >
                KYC Registration
              </button>
            </li>
            <li>
              <button
               onClick={handleHistory}  className="block w-full px-4 py-2 text-sm font-semibold text-gray-900 rounded-lg hover:bg-gray-300"
              >
                Trip History
              </button>
            </li>
            <li>
              <button
                 onClick={handleBackHome} className="block w-full px-4 py-2 text-sm font-semibold text-gray-900 rounded-lg hover:bg-gray-300"
              >
                Back  Home
              </button>
            </li>
          </ul>
        </nav>
      </aside>
    </div>
  )
}

export default ProfileSidebar