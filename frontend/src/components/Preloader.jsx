import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { setTweets } from "../redux/tweetSlice";
import { FaXTwitter } from "react-icons/fa6";

const API_BASE_URL = "/api/v1";

const Preloader = ({ children }) => {
  const { user, isLoading: isUserLoading } = useSelector((store) => store.user);
  const { tweets } = useSelector((store) => store.tweet);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to login if auth check is done and there's no user
    if (!isUserLoading && !user) {
      navigate("/login");
    }

    // If we have a user but no tweets yet, fetch them.
    if (user && tweets === null) {
      const fetchInitialTweets = async () => {
        try {
          const res = await axios.get(
            `${API_BASE_URL}/tweet/public?page=1&limit=10`,
            {
              withCredentials: true,
            }
          );
          dispatch(setTweets(res.data.tweets));
        } catch (error) {
          console.error("Failed to fetch initial tweets:", error);
          dispatch(setTweets([])); // Set to empty array on error
        }
      };
      fetchInitialTweets();
    }
  }, [user, isUserLoading, tweets, dispatch, navigate]);

  // Show the app-wide loading screen ONLY if the user or initial tweets are not ready.
  // This is the key to eliminating the flash.
  if (isUserLoading || tweets === null) {
    return (
      <div className="flex flex-col items-center justify-center h-screen w-full bg-black text-white">
        <div className="animate-spin">
          <FaXTwitter size={60} />
        </div>
        <p className="mt-6 text-lg font-semibold">Preparing your feed...</p>
      </div>
    );
  }

  // Once all data is ready, render the actual application content.
  return children;
};

export default Preloader;
