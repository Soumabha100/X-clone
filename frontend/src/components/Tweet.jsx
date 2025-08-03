import React, { useState } from "react";
import Avatar from "react-avatar";
import {
  FaComment,
  FaHeart,
  FaBookmark,
  FaTrash,
  FaPencilAlt,
} from "react-icons/fa";
import { BiRepost } from "react-icons/bi";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import toast from "react-hot-toast";
import { format } from "timeago.js";
import { Link } from "react-router-dom";
import { removeTweet } from "../redux/tweetSlice";
import EditTweetModal from "./EditTweetModal";

const API_BASE_URL = "http://localhost:8000/api/v1";

const Tweet = ({ tweet }) => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const { user: loggedInUser } = useSelector((store) => store.user);
  const dispatch = useDispatch();

  // Destructure the new isEdited field
  const {
    description,
    like,
    userId: author,
    createdAt,
    isEdited,
    _id: tweetId,
  } = tweet;

  if (!author) return null;

  const likeOrDislikeHandler = async () => {
    /* ... existing logic ... */
  };

  const deleteTweetHandler = async () => {
    if (window.confirm("Are you sure you want to delete this tweet?")) {
      try {
        const res = await axios.delete(
          `${API_BASE_URL}/tweet/delete/${tweetId}`,
          { withCredentials: true }
        );
        dispatch(removeTweet(tweetId));
        toast.success(res.data.message);
      } catch (error) {
        toast.error(error.response?.data?.message || "Failed to delete tweet.");
        console.error(error);
      }
    }
  };

  return (
    <>
      <div className="flex p-4 border-b border-neutral-800">
        <Link to={`/home/profile/${author._id}`}>
          <Avatar
            name={author.name}
            size="40"
            round={true}
            className="cursor-pointer"
          />
        </Link>
        <div className="w-full px-3">
          <div className="flex items-center">
            <Link
              to={`/home/profile/${author._id}`}
              className="flex items-center"
            >
              {/* Corrected: Added whitespace-nowrap to prevent the name from wrapping */}
              <h1 className="font-bold hover:underline cursor-pointer whitespace-nowrap">
                {author.name}
              </h1>
              {/* Corrected: Added truncate to gracefully handle long usernames */}
              <p className="px-2 text-neutral-500 hover:underline cursor-pointer truncate">
                @{author.username}
              </p>
            </Link>
            <p className="text-neutral-600">·</p>
            {/* Corrected: Added whitespace-nowrap to the timestamp as well */}
            <p className="ml-1 text-neutral-500 hover:underline cursor-pointer whitespace-nowrap">
              {format(createdAt)}
            </p>

            {/* Conditionally render the (edited) text */}
            {isEdited && (
              <p className="ml-2 text-xs text-neutral-600">(edited)</p>
            )}

            {loggedInUser?._id === author._id && (
              <div className="ml-auto flex items-center space-x-2">
                <div
                  onClick={() => setIsEditModalOpen(true)}
                  className="p-2 rounded-full hover:bg-blue-900/50 hover:text-blue-500 cursor-pointer"
                >
                  <FaPencilAlt size="16px" />
                </div>
                <div
                  onClick={deleteTweetHandler}
                  className="p-2 rounded-full hover:bg-red-900/50 hover:text-red-500 cursor-pointer"
                >
                  <FaTrash size="16px" />
                </div>
              </div>
            )}
          </div>

          <div className="py-2">
            <p>{description}</p>
          </div>

          <div className="flex justify-between my-3 text-neutral-500">
            <div className="flex items-center duration-200 cursor-pointer hover:text-blue-500">
              <FaComment size="18px" />
              <p className="ml-2 text-sm">0</p>
            </div>
            <div className="flex items-center duration-200 cursor-pointer hover:text-green-500">
              <BiRepost size="24px" />
              <p className="ml-2 text-sm">0</p>
            </div>
            <div
              onClick={likeOrDislikeHandler}
              className="flex items-center duration-200 cursor-pointer hover:text-pink-600"
            >
              <FaHeart
                size="18px"
                className={
                  like.includes(loggedInUser?._id) ? "text-pink-600" : ""
                }
              />
              <p className="ml-2 text-sm">{like.length}</p>
            </div>
            <div className="flex items-center duration-200 cursor-pointer hover:text-blue-500">
              <FaBookmark size="18px" />
              <p className="ml-2 text-sm">0</p>
            </div>
          </div>
        </div>
      </div>
      {isEditModalOpen && (
        <EditTweetModal
          tweet={tweet}
          onClose={() => setIsEditModalOpen(false)}
        />
      )}
    </>
  );
};

export default Tweet;
