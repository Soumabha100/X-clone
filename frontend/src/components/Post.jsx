import React from "react";
import Avatar from "react-avatar";
import { FaImages } from "react-icons/fa";
import { HiMiniGif } from "react-icons/hi2";
import { MdEmojiEmotions } from "react-icons/md";
import { RiCalendarScheduleFill } from "react-icons/ri";

const Post = () => {
  return (
    // The component now only contains the post creation area.
    <div className="w-full px-4 pt-4 border-b border-neutral-700">
      <div className="flex items-center pb-4 ">
        <div>
          <Avatar
            src="https://pbs.twimg.com/profile_images/1925460603214176256/l0rQysUt_400x400.jpg"
            size="40"
            round={true}
          />
        </div>
        <input
          className="w-full ml-4 text-lg bg-transparent border-none outline-none"
          type="text"
          placeholder="What's happening?"
        />
      </div>
      <div className="flex items-center justify-between py-3">
        <div className="flex items-center justify-between gap-4">
          <FaImages className="text-xl text-blue-500 duration-200 cursor-pointer hover:opacity-80 transition-opacity" />
          <HiMiniGif className="text-xl text-blue-500 duration-200 cursor-pointer hover:opacity-80 transition-opacity" />
          <MdEmojiEmotions className="text-xl text-blue-500 duration-200 cursor-pointer hover:opacity-80 transition-opacity" />
          <RiCalendarScheduleFill className="text-xl text-blue-500 duration-200 cursor-pointer hover:opacity-80 transition-opacity" />
        </div>
        <button className="px-6 py-2 my-2 text-md font-bold text-white bg-blue-500 border-none rounded-full cursor-pointer transition-colors duration-200 hover:bg-blue-600">
          Post
        </button>
      </div>
    </div>
  );
};

export default Post;
