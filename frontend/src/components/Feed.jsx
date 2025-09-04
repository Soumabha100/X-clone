import React, { useState, useEffect, useCallback } from "react";
import Post from "./Post";
import Tweet from "./Tweet";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { setTweets, addTweets } from "../redux/tweetSlice"; // Import addTweets
import TweetSkeleton from "./TweetSkeleton";
import InfiniteScroll from "react-infinite-scroll-component";

const API_BASE_URL = "/api/v1";

const Feed = () => {
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("For you");
  const { user } = useSelector((store) => store.user);
  const { tweets } = useSelector((store) => store.tweet);
  const dispatch = useDispatch();

  const fetchInitialTweets = useCallback(async () => {
    if (!user?._id || loading) return;
    setLoading(true);
    setPage(1);
    setHasMore(true);

    try {
      const endpoint =
        activeTab === "For you" ? "public" : `alltweets/${user._id}`;
      const res = await axios.get(
        `${API_BASE_URL}/tweet/${endpoint}?page=1&limit=10`,
        { withCredentials: true }
      );

      dispatch(setTweets(res.data.tweets));
      setHasMore(res.data.currentPage < res.data.totalPages);
    } catch (error) {
      console.error("Failed to fetch tweets:", error);
      dispatch(setTweets([])); // Clear tweets on error
    } finally {
      setLoading(false);
    }
  }, [user, activeTab, dispatch, loading]);

  useEffect(() => {
    fetchInitialTweets();
  }, [user, activeTab]); // Removed dispatch from dependency array for stability

  const fetchMoreTweets = async () => {
    if (!user?._id || loading) return;
    setLoading(true);
    const nextPage = page + 1;

    try {
      const endpoint =
        activeTab === "For you" ? "public" : `alltweets/${user._id}`;
      const res = await axios.get(
        `${API_BASE_URL}/tweet/${endpoint}?page=${nextPage}&limit=10`,
        { withCredentials: true }
      );

      // Use the new addTweets action to append data
      dispatch(addTweets(res.data.tweets));
      setPage(nextPage);
      setHasMore(res.data.currentPage < res.data.totalPages);
    } catch (error) {
      console.error("Failed to fetch more tweets:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleTabClick = (tab) => {
    dispatch(setTweets(null)); // Clear tweets immediately for a better UX
    setActiveTab(tab);
  };

  return (
    <div className="w-full md:w-[60%] border-l border-r border-neutral-800">
      <div className="sticky top-0 z-10 bg-black/80 backdrop-blur-md">
        <div className="flex items-center justify-between border-b border-neutral-700">
          <div
            onClick={() => handleTabClick("For you")}
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
            onClick={() => handleTabClick("Following")}
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

      {/* --- Infinite Scroll Implementation --- */}
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
