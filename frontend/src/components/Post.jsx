import React, { useState, useRef, useEffect } from "react";
import Avatar from "react-avatar";
import { FaImages, FaTimes, FaPencilAlt } from "react-icons/fa";
import { HiMiniGif } from "react-icons/hi2";
import { MdEmojiEmotions } from "react-icons/md";
import { RiCalendarScheduleFill } from "react-icons/ri";
import axios from "axios";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { addTweet } from "../redux/tweetSlice";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "/api/v1";

const Post = () => {
  const { user: loggedInUser } = useSelector((store) => store.user);
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const dispatch = useDispatch();
  const imageInputRef = useRef(null);

  // --- PROFESSIONAL POLISH ---
  // This effect will clean up the blob URL to prevent memory leaks
  // when the component unmounts or the image is changed.
  useEffect(() => {
    // This is the cleanup function.
    return () => {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // If there's an old preview, revoke it first.
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const removeImage = () => {
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
    }
    setImage(null);
    setImagePreview("");
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
    } finally {
      setDescription("");
      setIsUploading(false);
      removeImage(); // This will now also handle revoking the URL
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
            onInput={(e) => {
              e.target.style.height = "auto";
              e.target.style.height = `${e.target.scrollHeight}px`;
            }}
            className="w-full text-lg bg-transparent border-none outline-none resize-none overflow-hidden"
            placeholder="What's happening?"
            rows="1"
          />
          {imagePreview && (
            <div className="relative mt-2">
              <img
                src={imagePreview}
                alt="Preview"
                className="w-full h-auto rounded-2xl border border-gray-700"
              />
              <button
                onClick={() => imageInputRef.current.click()}
                className="absolute top-2 left-2 flex items-center space-x-2 bg-black bg-opacity-70 text-white font-semibold py-1 px-3 rounded-full cursor-pointer hover:bg-neutral-800 transition-colors duration-200"
              >
                <FaPencilAlt size={12} />
                <span>Edit</span>
              </button>
              <button
                onClick={removeImage}
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
          disabled={isUploading || (!description.trim() && !image)}
          className={`px-6 py-2 text-md font-bold text-white bg-blue-500 rounded-full hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          {isUploading ? "Posting..." : "Post"}
        </button>
      </div>
    </div>
  );
};

export default Post;
