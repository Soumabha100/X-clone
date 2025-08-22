import React, { useState, useEffect } from "react";
import Post from "./Post";
import Tweet from "./Tweet";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { setTweets } from "../redux/tweetSlice";
import TweetSkeleton from "./TweetSkeleton";

const API_BASE_URL = "http://localhost:8000/api/v1";

/**
 * The Feed component is the main content area of the application.
 * It displays the tweet creation component and the main tweet timeline.
 */
const Feed = () => {
  // State to manage which tab ("For you" or "Following") is currently active.
  const [activeTab, setActiveTab] = useState("For you");
  // Get the logged-in user and the current list of tweets from the Redux store.
  const { user } = useSelector((store) => store.user);
  const { tweets } = useSelector((store) => store.tweet);
  const dispatch = useDispatch();

  // This effect is responsible for fetching the correct set of tweets from the backend.
  useEffect(() => {
    const fetchTweets = async () => {
      // Guard clause: Don't attempt to fetch if there is no logged-in user.
      if (!user?._id) return;

      try {
        let res;
        if (activeTab === "For you") {
          // If the "For you" tab is active, fetch all public tweets from everyone.
          res = await axios.get(`${API_BASE_URL}/tweet/public`, {
            withCredentials: true,
          });
          // Dispatch the fetched tweets to the Redux store.
          dispatch(setTweets(res.data));
        } else {
          // If the "Following" tab is active, fetch the personalized feed for the user.
          res = await axios.get(`${API_BASE_URL}/tweet/alltweets/${user._id}`, {
            withCredentials: true,
          });
          dispatch(setTweets(res.data.tweets));
        }
      } catch (error) {
        console.error("Failed to fetch tweets:", error);
        // In case of an error, clear the feed to avoid showing stale data.
        dispatch(setTweets([]));
      }
    };

    fetchTweets();
    // This effect will re-run whenever the logged-in user, active tab, or dispatch function changes.
  }, [user, activeTab, dispatch]);

  return (
    <div className="w-full border-l border-r lg:w-[60%] border-neutral-700">
      {/* --- Sticky Header with Navigation Tabs --- */}
      <div className="sticky top-0 z-10 bg-black/80 backdrop-blur-md">
        <div className="flex items-center justify-between border-b border-neutral-700">
          {/* "For you" Tab */}
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
          {/* "Following" Tab */}
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

      {/* Renders the component for creating a new tweet. */}
      <Post />

      {/* --- SKELETON LOADER LOGIC --- */}
      {!tweets ? (
        // If tweets are null (loading for the first time), show 3 skeletons.
        <div>
          <TweetSkeleton />
          <TweetSkeleton />
          <TweetSkeleton />
        </div>
      ) : (
        // Otherwise, map over and display the actual tweets.
        tweets.map((tweet) => <Tweet key={tweet._id} tweet={tweet} />)
      )}
    </div>
  );
};

export default Feed;
