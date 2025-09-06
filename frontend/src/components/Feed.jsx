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

  const { tweets } = useSelector((store) => store.tweet);
  const dispatch = useDispatch();
  const isInitialMount = useRef(true);

  const fetchTabTweets = useCallback(
    async (tab) => {
      try {
        dispatch(setTweets(null));
        setPage(1);
        setHasMore(true);

        // Determine feed type for the API call
        const feedType = tab === "For you" ? "public" : "following";

        const res = await axios.get(
          `${API_BASE_URL}/tweet/feed?feedType=${feedType}&page=1&limit=10`,
          { withCredentials: true }
        );

        dispatch(setTweets(res.data.tweets));
        setHasMore(res.data.currentPage < res.data.totalPages);
      } catch (error) {
        console.error("Failed to fetch tab tweets:", error);
        dispatch(setTweets([]));
      }
    },
    [dispatch]
  );

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    fetchTabTweets(activeTab);
  }, [activeTab, fetchTabTweets]);

  const fetchMoreTweets = async () => {
    const nextPage = page + 1;
    try {
      const feedType = activeTab === "For you" ? "public" : "following";

      const res = await axios.get(
        `${API_BASE_URL}/tweet/feed?feedType=${feedType}&page=${nextPage}&limit=10`,
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
