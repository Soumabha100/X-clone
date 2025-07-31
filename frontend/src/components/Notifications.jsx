import React from "react";
import { IoIosSettings } from "react-icons/io";
import Avatar from "react-avatar";

const Notifications = () => {
  return (
    <div className='w-[60%]'>
      <div>
        <div className="flex items-center justify-between border border-neutral-700">
          <div className=" cursor-pointer  text-center px-4 py-3">
            <h1 className="font-bold text-xl">Notifications</h1>
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
            <h1 className="font-bold text-lg">Verified</h1>
          </div>
          <div className=" cursor-pointer  hover:bg-neutral-800  transition-colors  duration-200 w-full text-center px-4 py-3">
            <h1 className="font-bold text-lg">Mentions</h1>
          </div>
        </div>
        
      </div>

      <div>
        <div className="flex px-4 py-4 border border-neutral-700">
          <Avatar
            src="https://pbs.twimg.com/profile_images/1925460603214176256/l0rQysUt_400x400.jpg"
            size="40"
            round={true}
          />
          <div className="px-3  w-full">
            <div className="flex items-center justify-between">
              <h1 className="font-bold size ">Elon Musk</h1>
              <p className="text-neutral-500"> 2h</p>
            </div>

            <div className="py-2">
              <p className=" font-semibold text-neutral-500">Hello, if you see this message then the notifications are working 🤗</p>
            </div>
          </div>
        </div>
      </div>
      <div>
        <div className="flex px-4 py-4 border border-neutral-700">
          <Avatar
            src="https://pbs.twimg.com/profile_images/1683899100922511378/5lY42eHs_400x400.jpg"
            size="40"
            round={true}
          />
          <div className="px-3  w-full">
            <div className="flex items-center justify-between">
              <h1 className="font-bold size ">X Premium</h1>
              <p className="text-neutral-500"> 9h</p>
            </div>

            <div className="py-2">
              <p className=" font-semibold text-neutral-500">Hello, try our new premium features! 🤗</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Notifications;
