import React from 'react'
import { FaSearch } from "react-icons/fa";
const Explore = () => {
  return (
    <div className='width[50%] mt-2 '> 
      <div className='m-10px flex items-center  p-2 bg-neutral-600 rounded-full outline-none w-full  '>
            <FaSearch size={"20px"}/>
      <input type="text" className='bg bg-transparent outline-none px-2 '  placeholder="search" />
            
          </div>
          <br />
          <div className='font-extrabold flex  text-neutral-700 ' >
          <div >
            
            <h1 className=' hover:text-white mr-12'>For You</h1>
            <br />
           <div className='text-white font-bold '>

            <h1 className=' font-extrabold text-lg'>Today's News</h1>
           
<p>Text match result and Charges</p>
<p>Gambhir Clashes with oval curator over rules</p>
 
           </div>
          </div>
         
          <div >

<p className=' hover:text-white mr-12'>
  Trending
</p>
          </div>
          <div className=' hover:text-white mr-12'>
<h1 >News</h1>
          </div>
          <div >
<h1 className=' hover:text-white gap-12'>Sports</h1>
          </div>
          <div >
           <h1 className=' hover:text-white ml-12'>Entertainment</h1> 
          </div>
          </div>
          </div>
    
  )
}

export default Explore
