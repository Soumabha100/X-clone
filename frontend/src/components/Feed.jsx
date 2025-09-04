import React, { useState, useEffect, useCallback, useRef } from "react";
import Post from "./Post";
import Tweet from "./Tweet";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { setTweets, addTweets } from "../redux/tweetSlice";
import TweetSkeleton from "./TweetSkeleton";
import InfiniteScroll from "react-infinite-scroll-component";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "/api/v1";

const Feed = () => {
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [activeTab, setActiveTab] = useState("For you");

  const { user } = useSelector((store) => store.user);
  const { tweets } = useSelector((store) => store.tweet);
  const dispatch = useDispatch();

  // Use a ref to track if this is the first render.
  const isInitialMount = useRef(true);

  // This function is now responsible for fetching tweets when a tab is clicked.
  const fetchTabTweets = useCallback(async () => {
    if (!user?._id) return;
    try {
      dispatch(setTweets(null)); // Clear tweets for a clean loading state
      setPage(1);
      setHasMore(true);
      const endpoint =
        activeTab === "For you" ? "public" : `alltweets/${user._id}`;
      const res = await axios.get(
        `${API_BASE_URL}/tweet/${endpoint}?page=1&limit=10`,
        { withCredentials: true }
      );

      dispatch(setTweets(res.data.tweets));
      setHasMore(res.data.currentPage < res.data.totalPages);
    } catch (error) {
      console.error("Failed to fetch tab tweets:", error);
      dispatch(setTweets([]));
    }
  }, [user, activeTab, dispatch]);

  // This useEffect now correctly handles the tab switching logic.
  useEffect(() => {
    // If this is the first render, do nothing. The Preloader handled it.
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    // On subsequent renders (tab switches), fetch the new data.
    fetchTabTweets();
  }, [activeTab, fetchTabTweets]); // Changed dependency to activeTab

  const fetchMoreTweets = async () => {
    if (!user?._id) return;
    const nextPage = page + 1;
    try {
      const endpoint =
        activeTab === "For you" ? "public" : `alltweets/${user._id}`;
      const res = await axios.get(
        `${API_BASE_URL}/tweet/${endpoint}?page=${nextPage}&limit=10`,
        { withCredentials: true }
      );

      dispatch(addTweets(res.data.tweets));
      setPage(nextPage);
      setHasMore(res.data.currentPage < res.data.totalPages);
    } catch (error) {
      console.error("Failed to fetch more tweets:", error);
    }
  };

  return (
    <div className="w-full md:w-[60%] border-l border-r border-neutral-800">
      <div className="sticky top-0 z-10 bg-black/80 backdrop-blur-md">
        <div className="flex items-center justify-between border-b border-neutral-700">
          <div
            onClick={() => setActiveTab("For you")}
            className="w-full text-center cursor-pointer hover:bg-neutral-900"
          >
            <h1
              className={`py-4 font-semibold text-lg relative ${
                activeTab === "For you" ? "text-white" : "text-neutral-500"
              }`}
            >
              For you
              {activeTab === "For you" && (
                <div className="absolute bottom-0 left-0 w-full h-1 bg-blue-500 rounded-full"></div>
              )}
            </h1>
          </div>
          <div
            onClick={() => setActiveTab("Following")}
            className="w-full text-center cursor-pointer hover:bg-neutral-900"
          >
            <h1
              className={`py-4 font-semibold text-lg relative ${
                activeTab === "Following" ? "text-white" : "text-neutral-500"
              }`}
            >
              Following
              {activeTab === "Following" && (
                <div className="absolute bottom-0 left-0 w-full h-1 bg-blue-500 rounded-full"></div>
              )}
            </h1>
          </div>
        </div>
      </div>
      <Post />

      {!tweets ? (
        <div>
          <TweetSkeleton />
          <TweetSkeleton />
          <TweetSkeleton />
        </div>
      ) : (
        <InfiniteScroll
          dataLength={tweets.length}
          next={fetchMoreTweets}
          hasMore={hasMore}
          loader={<TweetSkeleton />}
          endMessage={
            <p className="text-center text-neutral-500 py-4">
              <b>You have seen it all!</b>
            </p>
          }
        >
          {tweets.map((tweet) => (
            <Tweet key={tweet._id} tweet={tweet} />
          ))}
        </InfiniteScroll>
      )}
    </div>
  );
};

export default Feed;
