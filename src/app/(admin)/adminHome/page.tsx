import AdminNavbar from '@/components/landing-page/AdminHeader';
import Sidebar from '@/components/sidebar/Sidebar';
import React from 'react';

function admin() {
  
  return (
    <div className='mt-20'>
<Sidebar/>
<AdminNavbar/>

 <div className="p-4 sm:ml-64">
   <div className="p-4 border-2 border-gray-200 border-dashed rounded-lg dark:border-gray-700">
      <div className="grid grid-cols-3 gap-4 mb-4">
         <div className="flex items-center justify-center h-24 rounded bg-gray-50 dark:bg-gray-800">
        
            <div  className="card bg-white shadow-md rounded-lg p-4">
              <h3 className="text-lg font-semibold mb-2">User Management</h3>
              <p>User count: 05</p>
            
         </div>

      </div>




      <div className="flex items-center justify-center h-24 rounded bg-gray-50 dark:bg-gray-800">
        
        <div  className="card bg-white shadow-md rounded-lg p-4">
          <h3 className="text-lg font-semibold mb-2">Driver Management</h3>
          <p>Driver count: 03</p>
        
     </div>

  </div>

   </div>
</div> 
    </div>
    </div>
  );
}

export default admin;
