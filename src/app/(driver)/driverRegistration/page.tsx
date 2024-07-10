'use client'

import ProfileSidebar from '@/components/sidebar/ProfileSidebar'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'



interface FormData {
  email: string;
  documentNumber: string;
  vehicleModel: string;
  vehicleNumber: string;
  documentImage?: File; // Single file
}


function driverRegistration() {

    const router=useRouter()

    const [formData, setFormData] = useState<FormData>({
      email: '',
      documentNumber: '',
      vehicleModel: '',
      vehicleNumber: '',
    });
    const [file, setFile] = useState<File>();



console.log(formData);






console.log("file",file);






const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const { id, value, files } = e.target;

  if (id === 'documentImage' && files) {
    setFile(files[0]);
  } else {
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  }
};
const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();


const form = new FormData();
form.append('email', formData.email);
form.append('documentNumber', formData.documentNumber);
form.append('vehicleModel', formData.vehicleModel);
form.append('vehicleNumber', formData.vehicleNumber);

if (file) {
  form.append('documentImage', file);
}

console.log("FormData to be sent:", {
  ...formData,
  documentImage: file ? file.name : null,
});

try {
  const res = await axios.post('http://localhost:5000/server/driver/registration', form, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  const data = res.data;
  if (data.success) {
    router.push('/driverprofile');
  } else {
    // Handle error case
  }
} catch (error) {
  console.error(error);
}
};



  return (
    <div className="flex flex-col md:flex-row h-screen bg-gray-100">
       <ProfileSidebar/>
            <main className="flex-1 p-6 md:p-8">

        <div className="flex justify-center items-center w-full md:w-1/2 p-5">
      <form className="max-w-sm w-full"  onSubmit={handleSubmit}>
        <h1 className="text-4xl mb-8 text-gray-900 dark:text-white">KYC Registration</h1>
        <div className="mb-3">
          <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Driver's Email Id</label>
          <input onChange={handleChange} type="email" id="email" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required />
        </div>
        <div className="mb-3">
          <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Driving license number</label>
          <input onChange={handleChange} type="text" id="documentNumber" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required />
        </div>
        <div className="mb-3">
          <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Driving license Image</label>
          <input onChange={handleChange} type="file" multiple accept="image/*" name='documentImage' id="documentImage" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="name@flowbite.com" required />
          
        </div>
        <div className="mb-3">
          <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Vehicle Type</label>
          <input onChange={handleChange} type="text" id="vehicleModel" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required />
        </div>
        <div className="mb-5">
          <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Vehicle Number</label>
          <input onChange={handleChange} type="text" id="vehicleNumber" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required />
        </div>
     
    
        <div className="flex items-start justify-center mb-4">
          
        <button type="submit" className=" text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Register</button>
        </div>
        


      </form>

      
    </div>
    </main>
    </div>
  
  )}
export default driverRegistration