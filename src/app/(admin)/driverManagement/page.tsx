'use client'
import AdminNavbar from '@/components/landing-page/AdminHeader';
import Header from '@/components/landing-page/Header';
import Sidebar from '@/components/sidebar/Sidebar'
import { baseUrl } from '@/utils/baseUrl';
import axios from 'axios';
import React, { useEffect, useState } from 'react'

interface Driver {
  _id: string;
  drivername: string;
  email: string;
  mobile: number;
  isBlocked: boolean;
  latitude: number;
  longitude: number;
  registration: {
    status: string;
    vehicleModel:String;
    vehicleNumber:String;
  }[];
}

function DriverManagement() {
    const [drivers, setDrivers] = useState<Driver[]>([]);

    useEffect(() => {
        const fetchDrivers = async () => {
            try {
                const response = await axios.get(`${baseUrl}/server/admin/drivermanagement`);
                setDrivers(response.data);
            } catch (error) {
                console.error('Failed to fetch drivers', error);
            }
        };

        fetchDrivers();
    }, []);

    const handleBlockDriver = async (driverId: string) => {
        console.log("Blocking driver with ID:", driverId);
        try {
            await axios.post(`${baseUrl}/server/admin/blockDriver/${driverId}`);
            setDrivers(drivers.map(driver => driver._id === driverId ? { ...driver, isBlocked: true } : driver));
            console.log("Updated drivers after blocking:", drivers);
        } catch (error) {
            console.error('Failed to block driver', error);
        }
    };

    const handleUnblockDriver = async (driverId: string) => {
        console.log("Unblocking driver with ID:", driverId);
        try {
            await axios.post(`${baseUrl}/server/admin/unblockDriver/${driverId}`);
            setDrivers(drivers.map(driver => driver._id === driverId ? { ...driver, isBlocked: false } : driver));
        } catch (error) {
            console.error('Failed to unblock driver', error);
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
                            <th scope="col" className="px-6 py-3">DRIVER NAME</th>
                            <th scope="col" className="px-6 py-3">EMAIL</th>
                            <th scope="col" className="px-6 py-3">MOBILE</th>
                            <th scope="col" className="px-6 py-3">VEHICLE TYPE</th>
                            <th scope="col" className="px-6 py-3">VEHICLE NUMBER</th>
                            <th scope="col" className="px-6 py-3">DRIVER LOCATION</th>
                            <th scope="col" className="px-6 py-3">STATUS</th>
                            <th scope="col" className="px-6 py-3">ACTION</th>
                        </tr>
                    </thead>
                    <tbody>
                        {drivers.map((driver) => (
                            <tr key={driver._id} className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700">
                                <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                    {driver.drivername}
                                </th>
                                <td className="px-6 py-4">{driver.email}</td>
                                <td className="px-6 py-4">{driver.mobile}</td>
                                <td className="px-6 py-4">
                                        {driver.registration.map((reg, index) => (
                                            <div key={index}>
                                                {reg.vehicleModel}
                                            </div>
                                        ))}
                                    </td>
                                    <td className="px-6 py-4">
                                        {driver.registration.map((reg, index) => (
                                            <div key={index}>
                                                {reg.vehicleNumber}
                                            </div>
                                        ))}
                                    </td>
                                    <td className="px-6 py-4">
                                        {driver.latitude}, {driver.longitude}
                                    </td>
                                <td className="px-6 py-4">{driver.isBlocked ? 'Blocked' : 'Active'}</td>
                                <td className="px-6 py-4">
                                    {driver.isBlocked ? (
                                        <button onClick={() => handleUnblockDriver(driver._id)} className="font-medium text-blue-600 dark:text-blue-500 hover:underline">Unblock</button>
                                    ) : (
                                        <button onClick={() => handleBlockDriver(driver._id)} className="font-medium text-red-600 dark:text-red-500 hover:underline">Block</button>
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

export default DriverManagement;
