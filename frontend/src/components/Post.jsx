import React, { useState } from "react";
import Avatar from "react-avatar";
import { FaImages } from "react-icons/fa";
import { HiMiniGif } from "react-icons/hi2";
import { MdEmojiEmotions } from "react-icons/md";
import { RiCalendarScheduleFill } from "react-icons/ri";
import axios from "axios";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { addTweet } from "../redux/tweetSlice";

const API_BASE_URL = "http://localhost:8000/api/v1";

/**
 * The Post component is the UI element for creating a new tweet.
 * It appears at the top of the main feed.
 */
const Post = () => {
  // State to hold the text content of the new tweet.
  const [description, setDescription] = useState("");
  // Get the currently logged-in user's data from the Redux store.
  const { user } = useSelector((store) => store.user);
  const dispatch = useDispatch();

  /**
   * Handles the submission of the new tweet to the backend.
   */
  const postTweetHandler = async () => {
    // Basic validation to prevent empty tweets.
    if (!description.trim()) {
      toast.error("Please enter a description.");
      return;
    }
    try {
      // Send a POST request to the backend's create tweet endpoint.
      const res = await axios.post(
        `${API_BASE_URL}/tweet/create`,
        {
          description: description,
          id: user?._id, // Pass the logged-in user's ID as the author.
        },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      // Dispatch an action to add the new tweet to the Redux store.
      // This provides an instant UI update without needing to re-fetch the entire feed.
      dispatch(addTweet(res.data.tweet));
      toast.success(res.data.message);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to post tweet.");
      console.error(error);
    }
    // Clear the input field after submission.
    setDescription("");
  };

  return (
    <div className="w-full px-4 pt-4 border-b border-neutral-700">
      <div className="flex items-center pb-4">
        <div>
          {/* The user's avatar. Currently static, can be made dynamic later. */}
          <Avatar
            src="https://pbs.twimg.com/profile_images/1925460603214176256/l0rQysUt_400x400.jpg"
            size="40"
            round={true}
          />
        </div>
        <input
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full ml-4 text-lg bg-transparent border-none outline-none"
          type="text"
          placeholder="What's happening?"
        />
      </div>
      <div className="flex items-center justify-between py-3">
        {/* Icons for attaching media, GIFs, etc. (currently placeholders). */}
        <div className="flex items-center justify-between gap-4">
          <FaImages className="text-xl text-blue-500 cursor-pointer hover:opacity-80" />
          <HiMiniGif className="text-xl text-blue-500 cursor-pointer hover:opacity-80" />
          <MdEmojiEmotions className="text-xl text-blue-500 cursor-pointer hover:opacity-80" />
          <RiCalendarScheduleFill className="text-xl text-blue-500 cursor-pointer hover:opacity-80" />
        </div>
        <button
          onClick={postTweetHandler}
          className="px-6 py-2 text-md font-bold text-white bg-blue-500 rounded-full hover:bg-blue-600"
        >
          Post
        </button>
      </div>
    </div>
  );
};

export default Post;
