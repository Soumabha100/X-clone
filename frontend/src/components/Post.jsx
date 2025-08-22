import React, { useState, useRef } from "react";
import Avatar from "react-avatar";
import { FaImages, FaTimes, FaPencilAlt } from "react-icons/fa";
import { HiMiniGif } from "react-icons/hi2";
import { MdEmojiEmotions } from "react-icons/md";
import { RiCalendarScheduleFill } from "react-icons/ri";
import axios from "axios";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { addTweet } from "../redux/tweetSlice";
import { useSelector } from "react-redux";

const API_BASE_URL = "http://localhost:8000/api/v1";

const Post = () => {
  const { user: loggedInUser } = useSelector((store) => store.user);
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  const dispatch = useDispatch();
  const imageInputRef = useRef(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  // A dedicated function to handle removing the image and resetting the input.
  const removeImage = () => {
    setImage(null);
    setImagePreview("");
    // THIS IS THE FIX: We programmatically reset the file input's value.
    if (imageInputRef.current) {
      imageInputRef.current.value = "";
    }
  };

  const postTweetHandler = async () => {
    if (!description.trim() && !image) {
      toast.error("Please enter a description or select an image.");
      return;
    }

    setIsUploading(true);
    const formData = new FormData();
    formData.append("description", description);
    if (image) {
      formData.append("image", image);
    }

    try {
      const res = await axios.post(`${API_BASE_URL}/tweet/create`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });

      dispatch(addTweet(res.data.tweet));
      toast.success(res.data.message);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to post tweet.");
      console.error(error);
    } finally {
      setDescription("");
      setImage(null);
      setImagePreview("");
      setIsUploading(false);
      removeImage();
    }
  };

  return (
    <div className="w-full px-4 pt-4 border-b border-neutral-700">
      <div className="flex items-start pb-4">
        <div>
          <Avatar
            src={loggedInUser?.profileImg}
            name={loggedInUser?.name}
            size="40"
            round={true}
          />
        </div>
        <div className="w-full ml-4">
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            // --- ADD THIS onInput HANDLER ---
            onInput={(e) => {
              e.target.style.height = "auto";
              e.target.style.height = `${e.target.scrollHeight}px`;
            }}
            className="w-full text-lg bg-transparent border-none outline-none resize-none overflow-hidden" // <-- Add overflow-hidden
            placeholder="What's happening?"
            rows="1" // <-- Change rows to 1
          />
          {/* --- FINAL CORRECTED Image Preview Section --- */}
          {imagePreview && (
            <div className="relative mt-2">
              {/* The image is always visible */}
              <img
                src={imagePreview}
                alt="Preview"
                className="w-full h-auto rounded-2xl border border-gray-700"
              />

              {/* Edit button positioned at the top-left */}
              <button
                onClick={() => imageInputRef.current.click()}
                className="absolute top-2 left-2 flex items-center space-x-2 bg-black bg-opacity-70 text-white font-semibold py-1 px-3 rounded-full cursor-pointer hover:bg-neutral-800 transition-colors duration-200"
              >
                <FaPencilAlt size={12} />
                <span>Edit</span>
              </button>

              {/* Remove button positioned at the top-right */}
              <button
                onClick={() => {
                  setImage(null);
                  setImagePreview("");
                  removeImage();
                }}
                className="absolute top-2 right-2 p-1.5 bg-black bg-opacity-70 rounded-full text-white cursor-pointer hover:bg-neutral-800 transition-colors duration-200"
              >
                <FaTimes />
              </button>
            </div>
          )}
        </div>
      </div>
      <div className="flex items-center justify-between py-3">
        <div className="flex items-center justify-between gap-4">
          <input
            type="file"
            ref={imageInputRef}
            onChange={handleImageChange}
            className="hidden"
            accept="image/*"
          />
          <FaImages
            onClick={() => imageInputRef.current.click()}
            className="text-xl text-blue-500 cursor-pointer hover:opacity-80"
          />
          <HiMiniGif className="text-xl text-blue-500 cursor-pointer hover:opacity-80" />
          <MdEmojiEmotions className="text-xl text-blue-500 cursor-pointer hover:opacity-80" />
          <RiCalendarScheduleFill className="text-xl text-blue-500 cursor-pointer hover:opacity-80" />
        </div>
        <button
          onClick={postTweetHandler}
          disabled={isUploading}
          className={`px-6 py-2 text-md font-bold text-white bg-blue-500 rounded-full hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          {isUploading ? "Posting..." : "Post"}
        </button>
      </div>
    </div>
  );
};

export default Post;
