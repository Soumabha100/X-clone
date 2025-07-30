import React from "react";
import { FaXTwitter } from "react-icons/fa6";
import { GoHomeFill } from "react-icons/go";
import { FaSearch } from "react-icons/fa";
import { IoMdNotifications } from "react-icons/io";
import { FaUser } from "react-icons/fa";
import { FaHeart } from "react-icons/fa";
import { Link } from "react-router-dom";

const Sidebar = () => {
  return (
    <div className="w-[20%] sticky top-0 h-screen">
      <div className="ml-5 mt-3">
        <Link to="/">
          <FaXTwitter size={32} />
        </Link>
      </div>
      <div>
        <Link
          to="/"
          className="flex items-center space-x-4 p-3 my-3 cursor-pointer hover:bg-neutral-800  transition-colors  duration-200 rounded-full"
        >
          <GoHomeFill size="28px" />
          <h1 className="font-bold text-lg">Home</h1>
        </Link>
        <Link
          to="/explore"
          className="flex items-center space-x-4 p-3 my-3 cursor-pointer hover:bg-neutral-800  transition-colors  duration-200 rounded-full"
        >
          <FaSearch size="28px" />
          <h1 className="font-bold text-lg">Explore</h1>
        </Link>
        <Link
          to="/notifications"
          className="flex items-center space-x-4 p-3 my-3 cursor-pointer hover:bg-neutral-800  transition-colors  duration-200 rounded-full"
        >
          <IoMdNotifications size="28px" />
          <h1 className="font-bold text-lg">Notifications</h1>
        </Link>
        <Link
          to="/profile"
          className="flex items-center space-x-4 p-3 my-3 cursor-pointer hover:bg-neutral-800  transition-colors  duration-200 rounded-full"
        >
          <FaUser size="28px" />
          <h1 className="font-bold text-lg">Profile</h1>
        </Link>
        <Link
          to="/"
          className="flex items-center space-x-4 p-3 my-3 cursor-pointer hover:bg-neutral-800  transition-colors  duration-200 rounded-full"
        >
          <FaHeart size="28px" />
          <h1 className="font-bold text-lg">Premium</h1>
        </Link>
        <div className="flex items-center pl-6">
          <button className="my-2 px-4 py-3 border-none  text-white font-bold bg-blue-600 w-[110px] rounded-full cursor-pointer text-2xl transition-colors duration-200 hover:bg-blue-700">
            Post
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
