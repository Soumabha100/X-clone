import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { setTweets } from "../redux/tweetSlice";
import { setInitialLoadComplete } from "../redux/uiSlice"; // <-- IMPORT THE NEW ACTION
import { FaXTwitter } from "react-icons/fa6";

const API_BASE_URL = "/api/v1";

const Preloader = ({ children }) => {
  const { user, isLoading: isUserLoading } = useSelector((store) => store.user);
  const { isInitialLoadComplete } = useSelector((store) => store.ui); // Use the new state
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect if auth check is done and there's no user.
    if (!isUserLoading && !user) {
      navigate("/login");
      return;
    }

    // --- THIS IS THE KEY LOGIC ---
    // Only run the initial data fetch if we have a user AND the initial load is NOT yet complete.
    if (user && !isInitialLoadComplete) {
      const fetchInitialData = async () => {
        try {
          // Fetch the first page of the default ("For you") feed.
          const res = await axios.get(
            `${API_BASE_URL}/tweet/public?page=1&limit=10`,
            {
              withCredentials: true,
            }
          );
          dispatch(setTweets(res.data.tweets));
          // Once done, set the global flag. This useEffect will not run again for this session.
          dispatch(setInitialLoadComplete());
        } catch (error) {
          console.error("Failed to fetch initial data:", error);
          dispatch(setTweets([])); // Set empty on error to avoid getting stuck
          dispatch(setInitialLoadComplete()); // Still mark as complete to avoid loop
        }
      };
      fetchInitialData();
    }
  }, [user, isUserLoading, isInitialLoadComplete, dispatch, navigate]);

  // The loading condition is now simple and will not re-trigger after the first load.
  if (!isInitialLoadComplete) {
    return (
      <div className="flex flex-col items-center justify-center h-screen w-full bg-black text-white">
        <div className="animate-spin">
          <FaXTwitter size={60} />
        </div>
        <p className="mt-6 text-lg font-semibold">Preparing your feed...</p>
      </div>
    );
  }

  // When the initial load is complete, render the actual app.
  return children;
};

export default Preloader;
