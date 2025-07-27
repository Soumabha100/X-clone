import React from "react";
import Avatar from "react-avatar";
import { FaImages } from "react-icons/fa";
import { HiMiniGif } from "react-icons/hi2";
import { MdEmojiEmotions } from "react-icons/md";
import { RiCalendarScheduleFill } from "react-icons/ri";

const Post = () => {
  return (
    <div>
      <div>
        <div className="flex items-center justify-between border border-neutral-700">
          <div className=" cursor-pointer hover:bg-neutral-800  transition-colors  duration-200 w-full text-center px-4 py-3">
            <h1 className="font-semibold text-lg">For you</h1>
          </div>
          <div className=" cursor-pointer hover:bg-neutral-800  transition-colors  duration-200 w-full text-center px-4 py-3">
            <h1 className="font-semibold text-lg">Following</h1>
          </div>
        </div>
        <div className="px-4 pt-4 w-full border border-neutral-700">
          <div className="flex items-center border-b border-neutral-700 pb-4">
            <div>
              <Avatar
                src="https://pbs.twimg.com/profile_images/1925460603214176256/l0rQysUt_400x400.jpg"
                size="40"
                round={true}
              />
            </div>
            <input
              className="w-full outline-none border-none text-lg ml-4"
              type="text"
              placeholder="What's happening?"
            />
          </div>
          <div className="flex items-center justify-between py-3">
            <div className="flex items-center justify-between gap-3">
              <FaImages className="text-blue-500 text-xl cursor-pointer hover:opacity-80 transition-opacity duration-200"/>

              <HiMiniGif className="text-blue-500 text-xl cursor-pointer hover:opacity-80 transition-opacity duration-200"/>

              <MdEmojiEmotions className="text-blue-500 text-xl cursor-pointer hover:opacity-80 transition-opacity duration-200"/>

              <RiCalendarScheduleFill className="text-blue-500 text-xl cursor-pointer hover:opacity-80 transition-opacity duration-200"/>
            </div>

            <button className="my-2 px-4 py-3 border-none  text-white font-bold bg-blue-600 rounded-full w-[90px] cursor-pointer text-lg transition-colors duration-200 hover:bg-blue-700">
              Post
            </button>
          </div>
        </div>
      </div>
      <div></div>
    </div>
  );
};

export default Post;
