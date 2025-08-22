import React, { useState, useRef } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { addTweet } from "../redux/tweetSlice";
import { MdClose } from "react-icons/md";
import Avatar from "react-avatar";

const API_BASE_URL = "http://localhost:8000/api/v1";

const CreatePostModal = ({ onClose }) => {
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const { user: loggedInUser } = useSelector((store) => store.user);
  const dispatch = useDispatch();
  const imageInputRef = useRef(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const postTweetHandler = async () => {
    if (!description.trim()) return;
    setIsUploading(true);
    const formData = new FormData();
    formData.append("description", description);
    if (image) formData.append("image", image);

    try {
      const res = await axios.post(`${API_BASE_URL}/tweet/create`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });
      dispatch(addTweet(res.data.tweet));
      toast.success(res.data.message);
      onClose();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to post tweet.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-center pt-16 z-50">
      <div className="bg-black w-full max-w-lg rounded-2xl border border-gray-700">
        <div className="p-2 border-b border-neutral-800">
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-neutral-800"
          >
            <MdClose size="24px" />
          </button>
        </div>
        <div className="p-4 flex">
          <Avatar
            src={loggedInUser?.profileImg}
            name={loggedInUser?.name}
            size="40"
            round={true}
          />
          <div className="w-full ml-3">
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-transparent text-lg resize-none outline-none min-h-[120px]"
              placeholder="What's happening?"
            />
            {imagePreview && (
              <div className="relative mt-2">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-full h-auto rounded-2xl"
                />
                <button
                  onClick={() => {
                    setImage(null);
                    setImagePreview("");
                  }}
                  className="absolute top-2 right-2 p-1.5 bg-black bg-opacity-70 rounded-full text-white"
                >
                  <MdClose />
                </button>
              </div>
            )}
            <div className="flex justify-between items-center mt-2 pt-2 border-t border-neutral-800">
              <input
                type="file"
                ref={imageInputRef}
                onChange={handleImageChange}
                className="hidden"
                accept="image/*"
              />
              {/* Add icons here if you want */}
              <button
                onClick={postTweetHandler}
                disabled={isUploading || !description.trim()}
                className="px-6 py-2 text-md font-bold text-white bg-blue-500 rounded-full hover:bg-blue-600 disabled:opacity-50"
              >
                {isUploading ? "Posting..." : "Post"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatePostModal;
