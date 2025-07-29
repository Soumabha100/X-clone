import React from "react";
import { IoIosSettings } from "react-icons/io";
import Avatar from "react-avatar";

const Notifications = () => {
  return (
    <div className='w-[60%]'>
      <div>
        <div className="flex items-center justify-between border border-neutral-700">
          <div className=" cursor-pointer  text-center px-4 py-3">
            <h1 className="font-bold text-lg">Following</h1>
          </div>
          <div className=" cursor-pointer  text-center px-4 py-3">
            <IoIosSettings />
          </div>
          
        </div>
        <div className="flex items-center justify-between border border-neutral-700">
            <div className=" cursor-pointer  hover:bg-neutral-800  transition-colors  duration-200 w-full text-center px-4 py-3">
            <h1 className="font-bold text-lg">All</h1>
          </div>
          <div className=" cursor-pointer  hover:bg-neutral-800  transition-colors  duration-200 w-full text-center px-4 py-3">
            Verified
          </div>
          <div className=" cursor-pointer  hover:bg-neutral-800  transition-colors  duration-200 w-full text-center px-4 py-3">
            Mentions
          </div>
        </div>
        
      </div>
    </div>
  );
};

export default Notifications;
