import React from "react";
import Avatar from "react-avatar";
import { FaComment, FaHeart, FaBookmark } from "react-icons/fa";
import { BiRepost } from "react-icons/bi";

// The component now accepts a 'tweet' object as a prop to display its data
const Tweet = ({ tweet }) => {
  // Destructure the tweet object for easier access
  const { author, content, image, timestamp, stats } = tweet;

  return (
    <div className="flex px-4 py-4 border-b border-neutral-700">
      <Avatar src={author.avatar} size="40" round={true} />
      <div className="w-full px-3">
        {/* Tweet Header */}
        <div className="flex items-center">
          <h1 className="font-bold">{author.name}</h1>
          <p className="px-2 text-neutral-500">@{author.username}</p>
          <p className="text-neutral-600">· {timestamp}</p>
        </div>

        {/* Tweet Content */}
        <div className="py-2">
          <p>{content}</p>
          {/* Conditionally render the image if it exists */}
          {image && (
            <div className="my-2 overflow-hidden border rounded-2xl border-neutral-800">
              <img
                src={image}
                className="object-cover w-full h-auto"
                alt="tweet media"
              />
            </div>
          )}
        </div>

        {/* Tweet Actions/Stats */}
        <div className="flex justify-between my-3 text-neutral-500">
          <div className="flex items-center duration-200 cursor-pointer hover:text-blue-500 transition-colors">
            <FaComment size="18px" />
            <p className="ml-2 text-sm">{stats.comments}</p>
          </div>
          <div className="flex items-center duration-200 cursor-pointer hover:text-green-500 transition-colors">
            <BiRepost size="24px" />
            <p className="ml-2 text-sm">{stats.reposts}</p>
          </div>
          <div className="flex items-center duration-200 cursor-pointer hover:text-pink-600 transition-colors">
            <FaHeart size="18px" />
            <p className="ml-2 text-sm">{stats.likes}</p>
          </div>
          <div className="flex items-center duration-200 cursor-pointer hover:text-blue-500 transition-colors">
            <FaBookmark size="18px" />
            <p className="ml-2 text-sm">{stats.bookmarks}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Tweet;
