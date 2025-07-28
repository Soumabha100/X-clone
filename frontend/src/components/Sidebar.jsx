import React from 'react'
import { FaXTwitter } from "react-icons/fa6";
import { GoHomeFill } from "react-icons/go";
import { FaSearch } from "react-icons/fa";
import { IoMdNotifications } from "react-icons/io";
import { FaUser } from "react-icons/fa";
import { FaHeart } from "react-icons/fa";

const Sidebar = () => {
  return (
    <div className='w-[20%] sticky top-0 h-screen'>
      <div className='ml-5 mt-3'>
        <FaXTwitter size={32}/>
      </div>
      <div>
        <div className='flex items-center space-x-4 p-3 my-3 cursor-pointer hover:bg-neutral-800  transition-colors  duration-200 rounded-full'>
                <GoHomeFill size="28px"/>
            <h1 className='font-bold text-lg'>Home</h1>
        </div>
        <div className='flex items-center space-x-4 p-3 my-3 cursor-pointer hover:bg-neutral-800  transition-colors  duration-200 rounded-full'>
                <FaSearch size="28px"/>
            <h1 className='font-bold text-lg'>Explore</h1>
        </div>
        <div className='flex items-center space-x-4 p-3 my-3 cursor-pointer hover:bg-neutral-800  transition-colors  duration-200 rounded-full'>
                <IoMdNotifications size="28px"/>
            <h1 className='font-bold text-lg'>Notifications</h1>
        </div>
        <div className='flex items-center space-x-4 p-3 my-3 cursor-pointer hover:bg-neutral-800  transition-colors  duration-200 rounded-full'>
                <FaUser size="28px"/>
            <h1 className='font-bold text-lg'>Profile</h1>
        </div>
        <div className='flex items-center space-x-4 p-3 my-3 cursor-pointer hover:bg-neutral-800  transition-colors  duration-200 rounded-full'>
                <FaHeart size="28px"/>
            <h1 className='font-bold text-lg'>Premium</h1>
        </div>
        <div className='flex items-center pl-6'>

          <button className='my-2 px-4 py-3 border-none  text-white font-bold bg-blue-600 w-[110px] rounded-full cursor-pointer text-2xl transition-colors duration-200 hover:bg-blue-700'>Post</button>
      </div>

        </div>
        
    </div>
  ) 
}

export default Sidebar
