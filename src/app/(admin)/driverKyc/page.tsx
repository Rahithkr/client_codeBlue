



'use client'
import React, { useEffect, useState } from 'react';
import Sidebar from '@/components/sidebar/Sidebar';
import axios from 'axios';
import AdminNavbar from '@/components/landing-page/AdminHeader';
import Image from 'next/image'; // Importing Image from next/image
import { baseUrl } from '@/utils/baseUrl';

interface Driver {
    drivername: string;
    email: string;
    mobile: string;
    registration: Registration[];
}

interface Registration {
    documentNumber: string;
    documentImage: string;
    vehicleModel: string;
    vehicleNumber: string;
    status: string;
}

function DriverKyc() {
    const [drivers, setDrivers] = useState<Driver[]>([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedImage, setSelectedImage] = useState<string | undefined>(undefined);

    useEffect(() => {
        const fetchDrivers = async () => {
            try {
                const response = await axios.get<Driver[]>(`${baseUrl}/server/admin/driverKyc`);
                setDrivers(response.data);
            } catch (error) {
                console.error('Failed to fetch drivers', error);
            }
        };

        fetchDrivers();
    }, []);

    const handleStatusChange = async (email: string, documentNumber: string, status: string) => {
        try {
            await axios.put(`${baseUrl}/server/admin/update-kyc-status`, {
                email,
                documentNumber,
                status
            });
            
            // Update the local state to reflect the status change
            setDrivers(prevDrivers => 
                prevDrivers.map(driver => ({
                    ...driver,
                    registration: driver.registration.map(reg => 
                        reg.documentNumber === documentNumber ? { ...reg, status } : reg
                    )
                }))
            );
        } catch (error) {
            console.error('Failed to update status', error);
        }
    };

    const openImageModal = (imageUrl: string) => {
        setSelectedImage(imageUrl);
        setModalOpen(true);
    };

    const closeModal = () => {
        setSelectedImage(undefined); // Reset selectedImage to undefined
        setModalOpen(false);
    };
console.log("driver",drivers);

    return (
        <div className='mt-20 flex flex-col'>
            <Sidebar />
            <AdminNavbar/>
            <div className="relative overflow-x-auto shadow-md sm:rounded-lg sm:ml-60">
                <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                        <tr>
                            <th scope="col" className="px-6 py-3">
                                DRIVERNAME
                            </th>
                            <th scope="col" className="px-6 py-3">
                                EMAIL
                            </th>
                            <th scope="col" className="px-6 py-3">
                                MOBILE
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Document Image
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Document Number
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Vehicle Model
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Vehicle Number
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Status
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Action
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        
                        {drivers.map((driver) => (
                            driver.registration.map((reg, index) => (
                                <tr key={`${driver.email}-${index}`} className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700">
                                    <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                        {driver.drivername}
                                    </th>
                                    <td className="px-6 py-4">
                                        {driver.email}
                                    </td>
                                    <td className="px-6 py-4">
                                        {driver.mobile}
                                    </td>
                                    <td className="px-6 py-4">
                                        {/* <Image src={`${baseUrl}/img/${reg.documentImage}`}
                                        key={reg.documentNumber}
                                        className="h-20 w-20 object-cover cursor-pointer"
                                        width={80}
                                        height={80} 
                                        /> */}
                                        {/* <img height={100} width={100} src={`${baseUrl}/img/${reg.documentImage}`} alt="" /> */}
                                    <Image
                                            src={`${baseUrl}/img/${reg?.documentImage}`}
                                            alt="Document"
                                            key={reg.documentNumber}
                                            className="h-20 w-20 object-cover cursor-pointer"
                                            width={80}
                                            height={80}
                                            onClick={() => openImageModal(`${baseUrl}/img/${reg.documentImage}`)}
                                        />
                                    </td>
                                    <td className="px-6 py-4">
                                        {reg.documentNumber}
                                    </td>
                                    <td className="px-6 py-4">
                                        {reg.vehicleModel}
                                    </td>
                                    <td className="px-6 py-4">
                                        {reg.vehicleNumber}
                                    </td>
                                    <td className="px-6 py-4">
                                        {reg.status}
                                    </td>
                                    <td className="px-6 py-4">
                                        {reg.status === 'approved' && (
                                            <button className="font-medium text-red-600 dark:text-red-500 hover:underline" onClick={() => handleStatusChange(driver.email, reg.documentNumber, 'rejected')}>Reject</button>
                                        )}
                                        {reg.status === 'rejected' && (
                                            <button className="font-medium text-blue-600 dark:text-blue-500 hover:underline" onClick={() => handleStatusChange(driver.email, reg.documentNumber, 'approved')}>Approve</button>
                                        )}
                                        {reg.status !== 'approved' && reg.status !== 'rejected' && (
                                            <>
                                                <button className="font-medium text-blue-600 dark:text-blue-500 hover:underline" onClick={() => handleStatusChange(driver.email, reg.documentNumber, 'approved')}>Approve</button>
                                                <button className="font-medium text-red-600 dark:text-red-500 hover:underline ml-2" onClick={() => handleStatusChange(driver.email, reg.documentNumber, 'rejected')}>Reject</button>
                                            </>
                                        )}
                                    </td>
                                </tr>
                            ))
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Modal for displaying larger image */}
            {modalOpen && selectedImage && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="max-w-3xl mx-auto overflow-hidden bg-white rounded-lg shadow-lg">
                    <Image src={`${baseUrl}/img/${selectedImage}`} alt="Document" width={800} height={600} />
                    <button className="absolute text-2xl top-2 right-5 text-white hover:text-gray-800" onClick={closeModal}>Close</button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default DriverKyc;


