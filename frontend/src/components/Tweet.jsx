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
import { removeTweet, updateTweet } from "../redux/tweetSlice";
import EditTweetModal from "./EditTweetModal";
import CommentModal from "./CommentModal";

const API_BASE_URL = "http://localhost:8000/api/v1";

/**
 * The Tweet component is responsible for rendering a single tweet in the feed.
 * It handles all user interactions for that tweet, such as liking, commenting,
 * editing, and deleting, and also displays any existing comments.
 * @param {object} props - The component's props.
 * @param {object} props.tweet - The full tweet object to be rendered.
 */
const Tweet = ({ tweet }) => {
  // State to manage the visibility of the edit and comment modals.
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isCommentModalOpen, setIsCommentModalOpen] = useState(false);
  // State to toggle the visibility of the comments section below the tweet.
  const [showComments, setShowComments] = useState(false);

  // Get the currently logged-in user's data from the Redux store.
  const { user: loggedInUser } = useSelector((store) => store.user);
  const dispatch = useDispatch();

  // Destructure all necessary properties from the tweet prop for easy access.
  const {
    description,
    like,
    comments,
    userId: author,
    createdAt,
    isEdited,
    _id: tweetId,
  } = tweet;

  // Safeguard: If for some reason the tweet data is missing its author, render nothing.
  if (!author) return null;

  /**
   * Handles the API call for liking or disliking a tweet and updates the global state.
   */
  const likeOrDislikeHandler = async () => {
    try {
      const res = await axios.put(
        `${API_BASE_URL}/tweet/like/${tweetId}`,
        { id: loggedInUser?._id },
        { withCredentials: true }
      );
      // Dispatch an action to update this specific tweet in the Redux store.
      dispatch(updateTweet(res.data.tweet));
      toast.success(res.data.message);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to like tweet.");
      console.error(error);
    }
  };

  /**
   * Handles the API call for deleting a tweet and updates the global state.
   */
  const deleteTweetHandler = async () => {
    // Use a confirmation dialog to prevent accidental deletions.
    if (window.confirm("Are you sure you want to delete this tweet?")) {
      try {
        const res = await axios.delete(
          `${API_BASE_URL}/tweet/delete/${tweetId}`,
          { withCredentials: true }
        );
        // Dispatch an action to remove this tweet from the Redux store.
        dispatch(removeTweet(tweetId));
        toast.success(res.data.message);
      } catch (error) {
        toast.error(error.response?.data?.message || "Failed to delete tweet.");
        console.error(error);
      }
    }
  };

  /**
   * Handles clicks on the comment icon. It either shows existing comments
   * or opens the comment modal if there are no comments yet.
   */
  const commentClickHandler = () => {
    if (comments && comments.length > 0) {
      setShowComments(!showComments); // Toggle visibility of the comments section.
    } else {
      setIsCommentModalOpen(true); // Open the modal to add the first comment.
    }
  };

  return (
    <>
      <div className="flex flex-col p-4 border-b border-neutral-800">
        <div className="flex">
          <Link to={`/home/profile/${author._id}`}>
            <Avatar
              name={author.name}
              size="40"
              round={true}
              className="cursor-pointer"
            />
          </Link>
          <div className="w-full px-3">
            {/* --- Tweet Header --- */}
            <div className="flex items-center">
              <Link
                to={`/home/profile/${author._id}`}
                className="flex items-center"
              >
                <h1 className="font-bold hover:underline cursor-pointer whitespace-nowrap">
                  {author.name}
                </h1>
                <p className="px-2 text-neutral-500 hover:underline cursor-pointer truncate">
                  @{author.username}
                </p>
              </Link>
              <p className="text-neutral-600">·</p>
              <p className="ml-1 text-neutral-500 hover:underline cursor-pointer whitespace-nowrap">
                {format(createdAt)}
              </p>
              {/* Conditionally render the '(edited)' text if the tweet has been modified. */}
              {isEdited && (
                <p className="ml-2 text-xs text-neutral-600">(edited)</p>
              )}
              {/* The Edit and Delete icons are only rendered if the logged-in user is the author. */}
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
            {/* --- Tweet Content --- */}
            <div className="py-2">
              <p>{description}</p>
            </div>
            {/* --- Tweet Action Buttons --- */}
            <div className="flex justify-between my-3 text-neutral-500">
              <div
                onClick={commentClickHandler}
                className="flex items-center duration-200 cursor-pointer hover:text-blue-500 select-none"
              >
                <FaComment size="18px" />
                <p className="ml-2 text-sm">{comments?.length || 0}</p>
              </div>
              <div className="flex items-center duration-200 cursor-pointer hover:text-green-500 select-none">
                <BiRepost size="24px" />
                <p className="ml-2 text-sm">0</p>
              </div>
              <div
                onClick={likeOrDislikeHandler}
                className="flex items-center duration-200 cursor-pointer hover:text-pink-600 select-none"
              >
                <FaHeart
                  size="18px"
                  className={
                    like.includes(loggedInUser?._id) ? "text-pink-600" : ""
                  }
                />
                <p className="ml-2 text-sm">{like.length}</p>
              </div>
              <div className="flex items-center duration-200 cursor-pointer hover:text-blue-500 select-none">
                <FaBookmark size="18px" />
                <p className="ml-2 text-sm">0</p>
              </div>
            </div>
          </div>
        </div>

        {/* --- Comments Dropdown Section --- */}
        {/* This section is only rendered if showComments is true and there are comments to display. */}
        {showComments && comments && comments.length > 0 && (
          <div className="mt-4 pl-10 animate-fade-in">
            {comments.map((comment) => (
              <div
                key={comment._id}
                className="flex p-2 border-t border-neutral-800"
              >
                <Link to={`/home/profile/${comment.userId._id}`}>
                  <Avatar
                    name={comment.userId.name}
                    size="32"
                    round={true}
                    className="cursor-pointer"
                  />
                </Link>
                <div className="w-full px-3">
                  <div className="flex items-center">
                    <Link
                      to={`/home/profile/${comment.userId._id}`}
                      className="flex items-center"
                    >
                      <h1 className="font-bold text-sm hover:underline cursor-pointer whitespace-nowrap">
                        {comment.userId.name}
                      </h1>
                      <p className="px-2 text-xs text-neutral-500 hover:underline cursor-pointer truncate">
                        @{comment.userId.username}
                      </p>
                    </Link>
                    <p className="text-xs text-neutral-600">
                      · {format(comment.createdAt)}
                    </p>
                  </div>
                  <p className="text-white text-sm mt-1">{comment.content}</p>
                </div>
              </div>
            ))}
            {/* A link to open the comment modal to add another reply. */}
            <div
              onClick={() => setIsCommentModalOpen(true)}
              className="text-center text-blue-500 hover:underline cursor-pointer text-sm p-2"
            >
              Post your reply
            </div>
          </div>
        )}
      </div>

      {/* The Edit and Comment modals are only rendered when their respective state flags are true. */}
      {isEditModalOpen && (
        <EditTweetModal
          tweet={tweet}
          onClose={() => setIsEditModalOpen(false)}
        />
      )}
      {isCommentModalOpen && (
        <CommentModal
          tweet={tweet}
          onClose={() => setIsCommentModalOpen(false)}
        />
      )}
    </>
  );
};

export default Tweet;
