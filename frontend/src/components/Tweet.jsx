import React from "react";
import Avatar from "react-avatar";
import { FaComment } from "react-icons/fa";
import { FaHeart } from "react-icons/fa";
import { FaBookmark } from "react-icons/fa";
import { BiRepost } from "react-icons/bi";

const Tweet = () => {
  return (
    <div>
      <div>
        <div className="flex px-4 py-4 border border-neutral-700">
          <Avatar
            src="https://pbs.twimg.com/profile_images/1925460603214176256/l0rQysUt_400x400.jpg"
            size="40"
            round={true}
          />
          <div className="px-3  w-full">
            <div className="flex items-center">
              <h1 className="font-bold size ">Elon Musk</h1>
              <p className="px-2 text-neutral-500">@elommuskofficial</p>
              <p className="text-neutral-600"> .2m</p>
            </div>

            <div className="py-2">
              <p>Hello this is Elon!</p>
            </div>

            <div className="flex justify-between my-3">
              <div className="flex items-center cursor-pointer hover:text-blue-500 rounded-full transition-colors duration-200 ">
                <FaComment size="18px" />

                <p className="ml-2">0</p>
              </div>

              <div className="flex items-center cursor-pointer hover:text-green-500 rounded-full transition-colors duration-200">
                <BiRepost size="24px" />
                <p className="ml-2">0</p>
              </div>

              <div className="flex items-center cursor-pointer hover:text-pink-600 rounded-full transition-colors duration-200">
                <FaHeart size="18px" />
                <p className="ml-2">0</p>
              </div>

              <div className="flex items-center cursor-pointer hover:text-blue-500 rounded-full transition-colors duration-200">
                <FaBookmark size="18px" />
                <p className="ml-2">0</p>
              </div>
            </div>
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
            <div className="flex items-center">
              <h1 className="font-bold size ">Elon Musk</h1>
              <p className="px-2 text-neutral-500">@elommuskofficial</p>
              <p className="text-neutral-600"> .2m</p>
            </div>

            <div className="py-2">
              <p>This is the future</p>

              <div className="my-2 rounded-2xl overflow-hidden border border-neutral-800">
                <img
                  src="https://pbs.twimg.com/media/Gw6Mi6EXIAADcg1?format=jpg&name=900x900"
                  className="w-full h-auto object-cover"
                  alt=""
                />
              </div>
            </div>

            <div className="flex justify-between my-3">
              <div className="flex items-center cursor-pointer hover:text-blue-500 rounded-full transition-colors duration-200 ">
                <FaComment size="18px" />

                <p className="ml-2">2643</p>
              </div>

              <div className="flex items-center cursor-pointer hover:text-green-500 rounded-full transition-colors duration-200">
                <BiRepost size="24px" />
                <p className="ml-2">1.2k</p>
              </div>

              <div className="flex items-center cursor-pointer hover:text-pink-600 rounded-full transition-colors duration-200">
                <FaHeart size="18px" />
                <p className="ml-2">25.6k</p>
              </div>

              <div className="flex items-center cursor-pointer hover:text-blue-500 rounded-full transition-colors duration-200">
                <FaBookmark size="18px" />
                <p className="ml-2">3.2k</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Tweet;
