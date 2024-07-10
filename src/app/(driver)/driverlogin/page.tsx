'use client'
import axios from 'axios';
import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import Image from 'next/image';

interface formData {
 
  email: string;
 
  password: string;
}



interface Errors {
 
  email?: string;

  password?: string;
}

function DriverLogin() {
  const router = useRouter();

  const {status,data:session}=useSession();
  console.log("succes",status);
  
  useEffect(()=>{
    if(status==='authenticated'){
      router.push('/homepage')
    }else{
      router.push('/driverlogin')
    }
  },[status,router])
  const [formData, setFormData] = useState<formData>({
    email: '',
    password: ''
  });
    const [errors, setErrors] = useState<Errors>({});
    const [errorMessage, setErrorMessage] = useState<string>("");

    const handleForgotPassword=(e:any)=>{
   e.preventDefault()
   router.push('/driverForgot')
    }

const  handleChange=(e:React.ChangeEvent<HTMLInputElement>)=>{
  setFormData({...formData,[e.target.id]:e.target.value})
}

const handleSubmit=async(e:React.FormEvent<HTMLFormElement>)=>{
e.preventDefault();
const validationErrors:Errors = {};
if (!formData.email) {
  validationErrors.email = "Email is required";
}
if (!formData.password) {
  validationErrors.password = "Password is required";
}
setErrors(validationErrors);

try{
  const res= await axios.post('http://localhost:5000/server/driver/signin',formData,{
    headers:{

    'Content-Type':'application/json'
    }
  })

  
  const data=res.data
  console.log(data)
  if(!data.token){
    setErrorMessage("Invalid email or password");
    return
  }
  localStorage.setItem('codeBlue-token', data.token);
  document.cookie=`codeBlue-token=${data.token};path=/;`
  router.push(`/homepage?email=${formData.email}`)
}catch(error:any){
  console.log(error)
  
  if (error.response.status === 401) {
    // Display specific error message for 401 (Unauthorized)
    setErrorMessage("Please enter correct email or password");
  } else {
    // Display a generic error message for other errors
    setErrorMessage("An error occurred. Please try again later.");
  }
}

}
  return (
    <div className="flex flex-col md:flex-row justify-center items-center min-h-screen bg-slate-400">
    
      <div className="flex justify-center items-center w-full md:w-1/2 p-5">
      <Image
    src="https://img.freepik.com/premium-vector/ambulance-staff-car-couple-doctors-doctor-with-emergency-bag-assistant-night-shift-vector_916026-443.jpg"
    alt="Ambulance staff"
    width={700}
    height={475}
    className="max-w-full h-auto"
  />      </div>

      
      <div className="flex justify-center items-center w-full md:w-1/2 p-5">
        <form className="max-w-sm w-full" onSubmit={handleSubmit}>
          <h1 className="text-4xl mb-8 text-gray-900 dark:text-white">Driver Login</h1>
          <div className="mb-5">
            <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your email</label>
            <input onChange={handleChange} type="email" id="email" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="name@flowbite.com"  />
            {errors.email && <p className="text-red-500">{errors.email}</p>}

          </div>
          <div className="mb-5">
            <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your password</label>
            <input  onChange={handleChange} type="password" id="password" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"  />
            {errors.password && <p className="text-red-500">{errors.password}</p>}

          </div>
          <div className="flex items-start justify-center mb-5">
            
          <button type="submit" className=" text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Submit</button>
          <button onClick={handleForgotPassword}><a href="#" className="text-sm text-gray-900 dark:text-white mt-2 ms-8">Forgot password?</a></button>
          </div>
          {errorMessage && <p className="text-red-500">{errorMessage}</p>}
          <p className='text text-slate-900 mt-3' >Don&#39;t have an account ?<a href="/driversignup"><span className='text text-blue-700'> Sign up </span></a></p>

          <button onClick={()=>signIn("google")} type="button" className="text-white bg-[#4285F4] hover:bg-[#4285F4]/90 focus:ring-4 focus:outline-none focus:ring-[#4285F4]/50 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:focus:ring-[#4285F4]/55 ms-10 me-2 mb-2">
<svg className="w-10 ms-3 h-4 me-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 18 19">
<path fill-rule="evenodd" d="M8.842 18.083a8.8 8.8 0 0 1-8.65-8.948 8.841 8.841 0 0 1 8.8-8.652h.153a8.464 8.464 0 0 1 5.7 2.257l-2.193 2.038A5.27 5.27 0 0 0 9.09 3.4a5.882 5.882 0 0 0-.2 11.76h.124a5.091 5.091 0 0 0 5.248-4.057L14.3 11H9V8h8.34c.066.543.095 1.09.088 1.636-.086 5.053-3.463 8.449-8.4 8.449l-.186-.002Z" clip-rule="evenodd"/>
</svg>
Sign in with Google
</button>
        </form>
       
      </div>
    </div>
  );
}

export default DriverLogin;

