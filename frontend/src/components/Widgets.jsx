import React from 'react'
import { FaSearch } from "react-icons/fa";
import Avatar from 'react-avatar';

const Widgets = () => {
  return (
    <div className='w[20%] pt-1'>
    <div className='ml-10 flex items-center  p-2 bg-neutral-600 rounded-full outline-none w-full '>
      <FaSearch size={"20px"}/>
<input type="text" className='bg bg-transparent outline-none px-2 '  placeholder="search" />
      
    </div>
    <div className='p-4 ml-10  bg-neutral-600 rounded-3xl my-4 w-full' >
      <h1 className='text-lg font-extrabold'>Who to Follow</h1>
<div className='flex items-center justify-between'> 
  <div className='flex'>
    <div className='mt-3'>
           <Avatar  className='mr-2'
                src="https://pbs.twimg.com/profile_images/1925460603214176256/l0rQysUt_400x400.jpg"
                size="40"
                round={true}
                />
    </div>
                <div className='mt-3'>
                  <h1 className='font-bold'> Soumabha Mjumder </h1>
                  <p className='text-sm'>@soumabha04</p>
                 
             </div>               
  </div>
  <div>
  <button className=' px-5 py-1.5 bg-black text-white rounded-full font-extrabold '>profile</button>
  </div>
</div>
<div className='flex items-center justify-between'> 
  <div className='flex'>
    <div className='mt-3'>
           <Avatar  className='mr-2'
                src="https://pbs.twimg.com/profile_images/1925460603214176256/l0rQysUt_400x400.jpg"
                size="40"
                round={true}
                />
    </div>
                <div className='mt-3'>
                  <h1 className='font-bold'> Tamalika Das </h1>
                  <p className='text-sm'>@tama32</p>                
                </div>            
                
  </div>
  <div>
  <button className=' px-5 py-1.5 bg-black text-white rounded-full font-extrabold '>profile</button>
  </div>

</div>
<div className='flex items-center justify-between'> 
  <div className='flex'>
    <div className='mt-3'>
           <Avatar  className='mr-2'
                src="https://pbs.twimg.com/profile_images/1925460603214176256/l0rQysUt_400x400.jpg"
                size="40"
                round={true}
                />
    </div>
                <div className='mt-3'>
                  <h1 className='font-bold'> Suman Bera </h1>
                  <p className='text-sm'>@sumon03</p>
                 
             </div>               
  </div>
  <div>
  <button className=' px-5 py-1.5 bg-black text-white rounded-full font-extrabold '>profile</button>
  </div>
</div>

      </div>
      
      <div>

      </div>
    </div>
  )
}

export default Widgets
