'use client'
import axios from 'axios';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react'

function driverlogin() {

  const router=useRouter()

 const [formData,setFormData]=useState({
  email:"",
  password:""
 });

 const handleChange=(e:any)=>{
  setFormData({...formData,[e.target.id]:e.target.value})

 }

 const handleSubmit=async(e:any)=>{
  e.preventDefault()
  try {
    const res=await axios.post('http://localhost:5000/server/admin/adminsignin',formData,{
      headers:{
  
      'Content-Type':'application/json'
      }
    })
  
    
    const data=res.data
    console.log(data)
    if(!data.token){
      return
    }
    localStorage.setItem('codeBlueAdmin-token', data.token);
    document.cookie=`codeBlueAdmin-token=${data.token};path=/;`
    router.push("/adminHome")
  }catch(error){
    console.log(error)
    
  }
    
  
 }

  return (
    <div className="flex flex-col md:flex-row justify-center items-center min-h-screen bg-slate-400">
      {/* Left side - Image */}
      <div className="flex justify-center items-center w-full md:w-1/2 p-5">
        <img src="https://img.freepik.com/premium-vector/ambulance-staff-car-couple-doctors-doctor-with-emergency-bag-assistant-night-shift-vector_916026-443.jpg" alt="Ambulance staff" className="max-w-full h-auto" />
      </div>

      {/* Right side - Form */}
      <div className="flex justify-center items-center w-full md:w-1/2 p-5">
        <form className="max-w-sm w-full" onSubmit={handleSubmit}>
          <h1 className="text-4xl mb-8 text-gray-900 dark:text-white">Admin Login</h1>
          <div className="mb-5">
            <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your email</label>
            <input onChange={handleChange} type="email" id="email" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="name@flowbite.com" required />
          </div>
          <div className="mb-5">
            <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your password</label>
            <input onChange={handleChange} type="password" id="password" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required />
          </div>
          <div className="flex items-start justify-center mb-5">
            
          <button type="submit" className=" text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Submit</button>
          {/* <a href="#" className="text-sm text-gray-900 dark:text-white mt-2 ms-8">Forgot password?</a> */}
          </div>
          
          {/* <p className='text text-slate-900 mt-3' >Don't have an account ?<a href=""><span className='text text-blue-700'> Sign up </span></a></p> */}
        </form>
      </div>
    </div>
  )
}

export default driverlogin