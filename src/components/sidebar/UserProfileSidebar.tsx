'use client'

import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import axios from 'axios'
import Image from 'next/image';

function UserProfileSidebar() {
    const router=useRouter()
    const searchParams = useSearchParams();
    const email = searchParams.get('email') || '';

    const [user, setUser] = useState({
      username: '',
      mobile: ''
    });

    useEffect(() => {
      const fetchUserProfile = async () => {
        try {
          const response = await axios.get(`http://localhost:5000/server/user/userProfileSidebar/${email}`);
          setUser(response.data);
        } catch (error) {
          console.error('Failed to fetch user profile', error);
        }
      };
  
      fetchUserProfile();
    }, [email]);

    const handleProfile=(e:any)=>{
         e.preventDefault();
         router.push(`/editProfile?email=${email}`)
    }



    const handleBackHome=(e:any)=>{
      e.preventDefault(
        router.push(`/home?email=${email}`)
      )
    }
    const handleTripHistory=(e:any)=>{
  e.preventDefault()
     router.push(`/tripHistory?email=${email}`)
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
          <h2 className="mt-4 text-xl font-semibold text-gray-700">{user.username}</h2>
         
          <p className="text-gray-600">{email}</p>
        </div>
        <nav className="mt-6">
          <ul className="space-y-2">
            <li>
              <button
                  onClick={handleProfile} className="block w-full px-4 py-2 text-sm font-semibold text-gray-900 rounded-lg hover:bg-gray-300"
              >
                Edit Profile
              </button>
            </li>
            <li>
            
            </li>
            <li>
              <button
               onClick={handleTripHistory}  className="block w-full px-4 py-2 text-sm font-semibold text-gray-900 rounded-lg hover:bg-gray-300"
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

export default UserProfileSidebar