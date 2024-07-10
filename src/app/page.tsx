'use client'


import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from 'next/image'; // Import Image from next/image

export default function Home() {

  const router=useRouter()
  

  const handleSubmit=(e:any)=>{
    e.preventDefault()
    router.push('/signup')
  }

  const handleLoginUser=(e:any)=>{
  e.preventDefault()
  router.push('/login')
  }

  return (
    <div className="flex flex-col justify-center items-center py-8 mt-5 ">
    <div className="flex flex-col justify-center items-center py-8 mt-5 w-full bg-slate-800">
    <div className="flex flex-col md:flex-row justify-around items-center w-full max-w-screen-xl px-4 ">
      
      <div className="w-full md:w-1/2 py-5 mt-5">
        <h1  className="text-white text-center md:text-left text-5xl lg:text-5xl font-semibold font-sans  ">We are here for you, bringing hope and care.</h1>
         <div className="flex flex-col justify-center items-center gap-5 mt-5 py-3 mr-20 ">
        


<button type="button" onClick={handleSubmit} className="text-white bg-black hover:bg-slate-600 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-full text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700 mt-16">Get Started</button>
<a href="">
 <button onClick={handleLoginUser} ><p className="text text-gray-300">Already have an account ? Sign in</p></button>

</a>


         
         
         </div>
      </div>
     
      <div className="w-full md:w-1/2 py-5 mt-5">
      <Image
              src="https://b2866231.smushcdn.com/2866231/wp-content/uploads/2022/12/ambulance-services-dubai.jpg?lossy=1&strip=1&webp=1"
              alt="Description of image"
              width={1200}
              height={800}
              className="object-cover object-center w-full h-auto rounded-lg shadow-lg"
            />
      </div>
    </div>



    
  </div>
  




  <div className="flex flex-col justify-center items-center py-8 w-full bg-slate-100">
    <div className="flex flex-col md:flex-row justify-around items-center w-full max-w-screen-xl px-4 ">
      
  
     
      <div className="w-full md:w-1/2 py-5 mt-5">
      <Image
              src="https://cdn2.unrealengine.com/egs-ambulancelifeaparamedicsimulator-aesirinteractive-g1a-03-1920x1080-6595abf72b63.jpg?h=270&quality=medium&resize=1&w=480"
              alt="Description of image"
              width={480}
              height={270}
              className="object-cover object-center w-full h-auto rounded-lg shadow-lg"
            />
      </div>




      <div className="w-full md:w-1/2 py-5 mt-5">
        <h1  className="text-slate-600 text-center md:text-right text-5xl lg:text-5xl font-semibold font-sans  ">Heroes are those who risk their lives to save others.</h1>
         <div className="flex flex-col justify-center items-center gap-5 mt-5 py-3 mr-20 ">
        


<p className="text text-center items-center font-light ml-24">CodeBlue services provide a lifeline in emergencies, offering swift and professional medical care when its needed most. Their rapid response and expert interventions save countless lives each day.</p>





<button type="button" onClick={handleSubmit} className="text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-full text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700">Get Started</button>
<a href="">
<button onClick={handleLoginUser}><p>Already have an account ? Sign in</p></button>

</a>
         
         
         </div>
      </div>


    </div>




    
  </div>
  





{/* //next// */}



<div className="flex flex-col justify-center items-center py-8  w-full bg-slate-100">
    <div className="flex flex-col md:flex-row justify-around items-center w-full max-w-screen-xl px-4 ">
      


      <div className="w-full md:w-1/2 py-5 mt-5">
        <h1  className="text-slate-600 text-center md:text-left text-5xl lg:text-5xl font-semibold font-sans  ">In times of crisis, we stand ready. We are here for you.</h1>
         <div className="flex flex-col justify-center items-center gap-5 mt-4 py-3 mr-16">
        


<p className="text text-center items-center font-light py-0 ">Ambulance services are the unsung heroes of the healthcare system, delivering crucial medical support with compassion and efficiency. They bring the emergency room to your doorstep, ensuring you receive the best possible care immediately.</p>

<button type="button" onClick={handleSubmit} className="text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-full text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700">Get Started</button>
<a href="">
<button onClick={handleLoginUser}><p>Already have an account ? Sign in</p></button>

</a>

       
         </div>
      </div>

      <div className="w-full md:w-1/2 py-5 mt-5">
      <Image
              src="https://images.igdb.com/igdb/image/upload/t_original/scpqfy.webp"
              alt="Description of image"
              width={1920}
              height={1080}
              className="object-cover object-center w-full h-auto rounded-lg shadow-lg"
            />
      </div>



    </div>


    
  </div>


  <div className="flex flex-col justify-center items-center py-8  w-full bg-slate-100">
    <div className="flex flex-col md:flex-row justify-around items-center w-full max-w-screen-xl px-4 ">
      
     
      <div className="w-full md:w-1/2 py-5 mt-5">
      <Image
              src="https://cdn.cloudflare.steamstatic.com/steam/apps/1926520/ss_1aa32aa45f056c962b15ca7b94a9912e05deda3d.1920x1080.jpg?t=1711359274"
              alt="Description of image"
              width={1920}
              height={1080}
              className="object-cover object-center w-full h-auto rounded-lg shadow-lg"
            />
      </div>

      <div className="w-full md:w-1/2 py-5 mt-5">
        <h1  className="text-slate-600 text-center md:text-right text-5xl lg:text-5xl font-semibold font-sans  ">Day or night, rain or shine, we are here for you.</h1>
         <div className="flex flex-col justify-center items-center gap-5 mt-5 py-3 mr-20 ">
        


<p className="text text-center items-center font-light ml-24">Ambulance services exemplify the spirit of readiness and dedication, offering timely and effective emergency medical care. Their presence ensures that communities are safer and more secure, knowing that expert help is available around the clock.</p>


<button type="button" onClick={handleSubmit} className="text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-full text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700">Get Started</button>
<a href="">
<button onClick={handleLoginUser}><p>Already have an account ? Sign in</p></button>

</a>
      
         </div>
      </div>


    </div>

    
  </div>




{/* end */}



<footer className="bg-white dark:bg-gray-900 w-full">
    <div className="mx-auto w-full max-w-screen-xl p-4 py-6 lg:py-8">
        <div className="md:flex md:justify-between">
          <div className="mb-6 md:mb-0">
             
              <h1 className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white mt-20 ml-28">codeBlue</h1>
          </div>
          <div className="grid grid-cols-2 gap-8 sm:gap-6 sm:grid-cols-3">
              <div>
                  <h2 className="mb-6 text-sm font-semibold text-gray-900 uppercase dark:text-white">COMPANY</h2>
                  <ul className="text-gray-500 dark:text-gray-400 font-medium">
                      <li className="mb-4">
                          <a href="" className="hover:underline">About us</a>
                      </li>
                      <li>
                          <a href="" className="hover:underline">Service</a>
                      </li>
                      <li>
                          <a href="" className="hover:underline">Contact us</a>
                      </li>
                  </ul>
              </div>
              <div>
                  <h2 className="mb-6 text-sm font-semibold text-gray-900 uppercase dark:text-white">HELPS</h2>
                  <ul className="text-gray-500 dark:text-gray-400 font-medium">
                      <li className="mb-4">
                          <a href="" className="hover:underline ">Customer support</a>
                      </li>
                      <li>
                          <a href="" className="hover:underline">Ticket Raise</a>
                      </li>
                  </ul>
              </div>
              <div>
                  <h2 className="mb-6 text-sm font-semibold text-gray-900 uppercase dark:text-white">Legal</h2>
                  <ul className="text-gray-500 dark:text-gray-400 font-medium">
                      <li className="mb-4">
                          <a href="#" className="hover:underline">Privacy Policy</a>
                      </li>
                      <li>
                          <a href="#" className="hover:underline">Terms &amp; Conditions</a>
                      </li>
                  </ul>
              </div>
          </div>
      </div>
      
      <hr className="my-6 border-gray-200 sm:mx-auto dark:border-gray-700 lg:my-8" />
      <div className="sm:flex sm:items-center sm:justify-between">
      
      
      </div>
      
    </div>
   
</footer>





</div>

 


  

  );
}
