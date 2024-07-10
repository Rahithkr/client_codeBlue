'use client'
import AdminNavbar from '@/components/landing-page/AdminHeader';
import Header from '@/components/landing-page/Header';
import Sidebar from '@/components/sidebar/Sidebar'
import axios from 'axios';
import React, { useEffect, useState } from 'react'




interface User {
    _id: string;
    username: string;
    email: string;
    mobile: string;
    isBlocked: boolean;
}
function usermanagement() {
    const [users, setUsers] = useState<User[]>([]);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axios.get('http://localhost:5000/server/admin/userMangement');
                setUsers(response.data);
            } catch (error) {
                console.error('Failed to fetch users', error);
            }
        };

        fetchUsers();
    }, []);

    const handleBlockUser = async (userId: string) => {
        console.log("Blocking user with ID:", userId); // Debug log
        try {
        
            await axios.post(`http://localhost:5000/server/admin/blockUser/${userId}`);
            setUsers(users.map(user => user._id === userId ? { ...user, isBlocked: true } : user));
            console.log("Updated users after blocking:", users);
        } catch (error) {
            console.error('Failed to block user', error);
        }
    };

    const handleUnblockUser = async (userId: string) => {
        console.log("Unblocking user with ID:", userId); // Debug log
        try {
            await axios.post(`http://localhost:5000/server/admin/unblockUser/${userId}`);
            setUsers(users.map(user => user._id === userId ? { ...user, isBlocked: false } : user));
        } catch (error) {
            console.error('Failed to unblock user', error);
        }
    };

  return (
   
<div className='mt-20 flex flex-col'>
    <Sidebar/>
    <AdminNavbar/>
<div className="relative overflow-x-auto shadow-md sm:rounded-lg sm:ml-60">
    <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
                <th scope="col" className="px-6 py-3">
                 USERNAME
                </th>
                <th scope="col" className="px-6 py-3">
                    EMAIL
                </th>
                <th scope="col" className="px-6 py-3">
                    MOBILE
                </th>
                <th scope="col" className="px-6 py-3">
                    STATUS
                </th>
                <th scope="col" className="px-6 py-3">
                    Action
                </th>
            </tr>
        </thead>
        <tbody>
            {users.map((user)=>(

                <tr key={user._id} className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700">
                <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                    {user.username}
                </th>
                <td className="px-6 py-4">
                   {user.email}
                </td>
                <td className="px-6 py-4">
                    {user.mobile}
                </td>
                <td className="px-6 py-4">
                {user.isBlocked ? 'Blocked' : 'Active'}
                </td>
                <td className="px-6 py-4">
                {user.isBlocked ? (
                                        <button onClick={() => handleUnblockUser(user._id)} className="font-medium text-blue-600 dark:text-blue-500 hover:underline">Unblock</button>
                                    ) : (
                                        <button onClick={() => handleBlockUser(user._id)} className="font-medium text-red-600 dark:text-red-500 hover:underline">Block</button>
                                    )}
                </td>
            </tr>
            ))}

        </tbody>
    </table>
</div>
</div>
  )
}

export default usermanagement