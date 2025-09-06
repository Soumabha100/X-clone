import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { setTweets } from "../redux/tweetSlice";
import { setInitialLoadComplete } from "../redux/uiSlice";
import { FaXTwitter } from "react-icons/fa6";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "/api/v1";

const Preloader = ({ children }) => {
  const { user, isLoading: isUserLoading } = useSelector((store) => store.user);
  const { isInitialLoadComplete } = useSelector((store) => store.ui);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isUserLoading && !user) {
      navigate("/login");
      return;
    }

    if (user && !isInitialLoadComplete) {
      const fetchInitialData = async () => {
        try {
          // *** THE FIX IS HERE ***
          // We now call the correct /feed endpoint for the "For you" tab.
          const res = await axios.get(
            `${API_BASE_URL}/tweet/feed?feedType=public&page=1&limit=10`,
            {
              withCredentials: true,
            }
          );
          dispatch(setTweets(res.data.tweets));
          dispatch(setInitialLoadComplete());
        } catch (error) {
          console.error("Failed to fetch initial data:", error);
          dispatch(setTweets([]));
          dispatch(setInitialLoadComplete());
        }
      };
      fetchInitialData();
    }
  }, [user, isUserLoading, isInitialLoadComplete, dispatch, navigate]);

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

  return children;
};

export default Preloader;
