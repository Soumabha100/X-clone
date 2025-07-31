import React from 'react'
import { FaSearch } from "react-icons/fa";
const Explore = () => {
  return (
    <div className='width[50%] '> 
      <div className='m-10px flex items-center  p-2 bg-neutral-600 rounded-full outline-none w-full  '>
            <FaSearch size={"20px"}/>
      <input type="text" className='bg bg-transparent outline-none px-2 '  placeholder="search" />
            
          </div>
          <br />
          <div className='font-extrabold flex gap-12 text-neutral-700' >
          <div className=' hover:text-white'>
            <h1>For You</h1>
            <p>Today's News </p>
          </div>
          <div className=' hover:text-white'>
<h1>
  Trending
</h1>
          </div>
          <div className=' hover:text-white'>
            News
          </div>
          <div className=' hover:text-white'>
            Sports
          </div>
          <div className=' hover:text-white'>
            Entertainment
          </div>
          </div>
    </div>
  )
}

export default Explore
