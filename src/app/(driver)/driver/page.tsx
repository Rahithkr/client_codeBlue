'use client'
import Navbar from '@/components/landing-page/DriverNavbar'
import {useRouter} from 'next/navigation'
import React from 'react'

function driverlanding() {
  const router=useRouter()
const handleSubmit=(e:any)=>{
e.preventDefault()
router.push('/driversignup')
}

const handleLogin=(e:any)=>{
 e.preventDefault()
 router.push('/driverlogin')
}
  return (
    <div className="flex flex-col justify-center items-center py-8 mt-5 ">
      <Navbar email=''/>
    <div className="flex flex-col justify-center items-center py-8 mt-5 w-full bg-slate-800">
    <div className="flex flex-col md:flex-row justify-around items-center w-full max-w-screen-xl px-4 ">
      
      <div className="w-full md:w-1/2 py-5 mt-5">
        <h1  className="text-white text-center md:text-left text-5xl lg:text-5xl font-semibold font-sans  ">"Not all superheroes wear capes; some drive ambulances and save lives."</h1>
         <div className="flex flex-col justify-center items-center gap-5 mt-5 py-3 mr-20 ">
       
{/* <form className="flex items-center max-w-sm mx-auto">   
    <div className="relative w-full flex flex-col justify-center items-center gap-5">
        <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
           
        </div>
        <input type="text" id="simple-search" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Search branch name..." required />
        <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
           
           </div>
           <input type="text" id="simple-search" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Search branch name..." required />
    </div>
    
    
    <button type="submit" className="p-2.5 ms-2 text-sm font-medium text-white bg-blue-700 rounded-lg border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Choose Ride
     
    </button>
</form> */}


<button type="button" onClick={handleSubmit} className="text-white bg-black hover:bg-slate-600 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-full text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700 mt-16">Get Started</button>
<a href="">
<button onClick={handleLogin}><p className="text text-gray-300">Already have an account ? Sign in</p></button>

</a>






         
         
         </div>
      </div>
     
      <div className="w-full md:w-1/2 py-5 mt-5">
        <img 
          src="https://i0.wp.com/wmas.nhs.uk/wp-content/uploads/2024/01/Willenhall_0470.jpg?fit=2560%2C1656&ssl=1" 
          alt="Description of image" 
          className="object-cover object-center w-full h-auto rounded-lg shadow-lg" 
        />
      </div>
    </div>







    
  </div>
  




  <div className="flex flex-col justify-center items-center py-8 w-full bg-slate-100">
    <div className="flex flex-col md:flex-row justify-around items-center w-full max-w-screen-xl px-4 ">
      
  
     
      <div className="w-full md:w-1/2 py-5 mt-5">
        <img 
          src="https://www.fortis.edu/blog/healthcare/ambulance-drivers-common-movie-and-television-mistakes/_jcr_content/blog/image.transform/w1000/q85/img.jpeg" 
          alt="Description of image" 
          className="object-cover object-center w-full h-auto rounded-lg shadow-lg" 
        />
      </div>




      <div className="w-full md:w-1/2 py-5 mt-5">
        <h1  className="text-slate-600 text-center md:text-right text-5xl lg:text-5xl font-semibold font-sans  ">"Drive with confidence"</h1>
         <div className="flex flex-col justify-center items-center gap-5 mt-5 py-3 mr-20 ">
        


<p className="text text-center items-center font-light ml-24">"CodeBlue services provide a lifeline in emergencies, offering swift and professional medical care when it's needed most. Their rapid response and expert interventions save countless lives each day."</p>





<button type="button" onClick={handleSubmit} className="text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-full text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700">Get Started</button>
<a href="">
<button onClick={handleLogin}><p>Already have an account ? Sign in</p></button>

</a>
         
         
         </div>
      </div>


    </div>


























    
  </div>
  





{/* //next// */}



<div className="flex flex-col justify-center items-center py-8  w-full bg-slate-100">
    <div className="flex flex-col md:flex-row justify-around items-center w-full max-w-screen-xl px-4 ">
      
  
     
     




      <div className="w-full md:w-1/2 py-5 mt-5">
        <h1  className="text-slate-600 text-center md:text-left text-5xl lg:text-5xl font-semibold font-sans  ">"In times of crisis, we stand ready. We are here for you."</h1>
         <div className="flex flex-col justify-center items-center gap-5 mt-4 py-3 mr-16">
        


<p className="text text-center items-center font-light py-0 ">"Ambulance services are the unsung heroes of the healthcare system, delivering crucial medical support with compassion and efficiency. They bring the emergency room to your doorstep, ensuring you receive the best possible care immediately."</p>

<button type="button" onClick={handleSubmit} className="text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-full text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700">Get Started</button>
<a href="">
<button onClick={handleLogin}><p>Already have an account ? Sign in</p></button>

</a>



         
         
         </div>
      </div>




      <div className="w-full md:w-1/2 py-5 mt-5">
        <img 
          src="https://i.insider.com/5fec7e17b7ab82001943e8fd?width=700" 
          alt="Description of image" 
          className="object-cover object-center w-full h-auto rounded-lg shadow-lg" 
        />
      </div>



    </div>


























    
  </div>









  <div className="flex flex-col justify-center items-center py-8  w-full bg-slate-100">
    <div className="flex flex-col md:flex-row justify-around items-center w-full max-w-screen-xl px-4 ">
      
  
     
      <div className="w-full md:w-1/2 py-5 mt-5">
        <img 
          src="https://www.emergencyresponsedrivertraining.co.uk/wp-content/uploads/2019/02/ambulance-ceradl3-featured-image.jpg.webp" 
          alt="Description of image" 
          className="object-cover object-center w-full h-auto rounded-lg shadow-lg" 
        />
      </div>




      <div className="w-full md:w-1/2 py-5 mt-5">
        <h1  className="text-slate-600 text-center md:text-right text-5xl lg:text-5xl font-semibold font-sans  ">"The willingness to help others, even at personal risk, is true definition of heroism."</h1>
         <div className="flex flex-col justify-center items-center gap-5 mt-5 py-3 mr-20 ">
        


<p className="text text-center items-center font-light ml-24">"Ambulance services exemplify the spirit of readiness and dedication, offering timely and effective emergency medical care. Their presence ensures that communities are safer and more secure, knowing that expert help is available around the clock."</p>


<button type="button" onClick={handleSubmit} className="text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-full text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700">Get Started</button>
<a href="">
<button onClick={handleLogin}><p>Already have an account ? Sign in</p></button>

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
              {/* <a href="https://flowbite.com/" className="flex items-center">
                  <img src="https://flowbite.com/docs/images/logo.svg" className="h-8 me-3" alt="FlowBite Logo" />
                  <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">Flowbite</span>
              </a> */}
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

 

  )
}

export default driverlanding