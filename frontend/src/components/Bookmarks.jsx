// frontend/src/components/Bookmarks.jsx

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import Tweet from "./Tweet";
import TweetSkeleton from "./TweetSkeleton";
import { IoSettingsOutline } from "react-icons/io5";

const API_BASE_URL = "/api/v1";

const Bookmarks = () => {
  const [bookmarkedTweets, setBookmarkedTweets] = useState(null);
  const { user } = useSelector((store) => store.user);

  useEffect(() => {
    const fetchBookmarkedTweets = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/user/bookmarks`, {
          withCredentials: true,
        });
        setBookmarkedTweets(res.data);
      } catch (error) {
        console.error("Failed to fetch bookmarks:", error);
        setBookmarkedTweets([]); // Set to empty array on error
      }
    };

    fetchBookmarkedTweets();
  }, []);

  return (
    <div className="w-full lg:w-[60%] border-l border-r border-neutral-800">
      {/* --- Professional Header --- */}
      <div className="sticky top-0 z-10 bg-black/80 backdrop-blur-md">
        <div className="flex items-center justify-between p-4 border-b border-neutral-800">
          <div>
            <h1 className="font-bold text-xl">Bookmarks</h1>
            <p className="text-neutral-500 text-sm">@{user?.username}</p>
          </div>
          <div className="p-2 rounded-full cursor-pointer hover:bg-neutral-800">
            <IoSettingsOutline size="20px" />
          </div>
        </div>
      </div>

      {/* --- Bookmarked Tweets Feed --- */}
      <div>
        {!bookmarkedTweets ? (
          <div>
            <TweetSkeleton />
            <TweetSkeleton />
            <TweetSkeleton />
          </div>
        ) : bookmarkedTweets.length === 0 ? (
          <div className="text-center p-8 mt-10">
            <h2 className="font-bold text-3xl">No Bookmarks Yet</h2>
            <p className="text-neutral-500 mt-2">
              When you save a tweet, it'll show up here.
            </p>
          </div>
        ) : (
          bookmarkedTweets.map((tweet) => (
            <Tweet key={tweet._id} tweet={tweet} />
          ))
        )}
      </div>
    </div>
  );
};

export default Bookmarks;
