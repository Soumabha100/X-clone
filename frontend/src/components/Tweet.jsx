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
import { setUser } from "../redux/userSlice";

const API_BASE_URL = "http://localhost:8000/api/v1";

const Tweet = ({ tweet }) => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isCommentModalOpen, setIsCommentModalOpen] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [isImageLoaded, setIsImageLoaded] = useState(false);

  const { user: loggedInUser } = useSelector((store) => store.user);
  const dispatch = useDispatch();

  // Destructure the new 'image' property from the tweet.
  const {
    description,
    like,
    comments,
    image,
    retweetedBy,
    userId: author,
    createdAt,
    isEdited,
    _id: tweetId,
  } = tweet;

  if (!author) return null;

  const likeOrDislikeHandler = async () => {
    try {
      const res = await axios.put(
        `${API_BASE_URL}/tweet/like/${tweetId}`,
        { id: loggedInUser?._id },
        { withCredentials: true }
      );
      dispatch(updateTweet(res.data.tweet));
      toast.success(res.data.message);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to like tweet.");
      console.error(error);
    }
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

  const retweetHandler = async () => {
    try {
      const res = await axios.post(
        `${API_BASE_URL}/tweet/retweet/${tweetId}`,
        { id: loggedInUser?._id }, // The body is not strictly needed but good practice
        { withCredentials: true }
      );
      dispatch(updateTweet(res.data.tweet));
      toast.success(res.data.message);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to retweet.");
      console.error(error);
    }
  };

  const commentClickHandler = () => {
    if (comments && comments.length > 0) {
      setShowComments(!showComments);
    } else {
      setIsCommentModalOpen(true);
    }
  };

  const bookmarkHandler = async () => {
    try {
      const res = await axios.put(
        `${API_BASE_URL}/user/bookmark/${tweetId}`,
        {}, // The body is empty, user ID is from the cookie
        { withCredentials: true }
      );
      // Dispatch the updated user object to the Redux store
      dispatch(setUser(res.data.user));
      toast.success(res.data.message);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to save bookmark.");
      console.error(error);
    }
  };

  // Find which of the users we follow (or ourselves) retweeted this tweet.
  const relevantRetweeterId = loggedInUser?.following
    .concat(loggedInUser?._id)
    .find((id) => tweet.retweetedBy.includes(id));
  const retweeter = tweet.retweetedBy.includes(relevantRetweeterId)
    ? loggedInUser.following.find((u) => u._id === relevantRetweeterId) ||
      loggedInUser
    : null;
  const isRetweet =
    tweet.retweetedBy.length > 0 &&
    retweeter &&
    retweeter._id !== tweet.userId._id;

  // A helper to get the retweeter's name. It checks if it's you or someone else.
  const getRetweeterName = () => {
    if (!isRetweet) return '';
    return relevantRetweeterId === loggedInUser._id ? 'You' : retweeter?.name;
  };

  return (
    <>
      {/* --- RETWEET BANNER --- */}
      <div className="flex flex-col p-4 border-b border-neutral-800">
        {isRetweet && (
          <div className="flex items-center text-neutral-500 text-sm mb-2 ml-4">
            <BiRepost size="20px" className="mr-2" />
            <span>{getRetweeterName()} Retweeted</span>
          </div>
        )}

        <div className="flex">
          <Link to={`/home/profile/${author._id}`}>
            <Avatar
              src={author.profileImg}
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
            {/* --- Tweet Content --- */}
            <div className="py-2">
              <p>{description}</p>
              {/* --- Image container with skeleton loading --- */}
              {image && (
                <div className="relative mt-3 w-full h-auto max-h-[400px] rounded-2xl border border-gray-700 overflow-hidden">
                  {/* The skeleton placeholder, visible by default */}
                  {!isImageLoaded && (
                    <div className="w-full h-full min-h-[200px] bg-neutral-800 animate-pulse"></div>
                  )}
                  {/* The actual image, hidden until it loads */}
                  <img
                    src={image}
                    alt="Tweet media"
                    // When the image finishes loading, this event fires.
                    onLoad={() => setIsImageLoaded(true)}
                    // Smoothly transition the opacity when isImageLoaded becomes true.
                    className={`w-full h-auto object-cover transition-opacity duration-500 ${
                      isImageLoaded ? "opacity-100" : "opacity-0"
                    }`}
                  />
                </div>
              )}
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
              <div
                onClick={retweetHandler}
                className="flex items-center duration-200 cursor-pointer hover:text-green-500 select-none"
              >
                <BiRepost
                  size="24px"
                  className={
                    retweetedBy.includes(loggedInUser?._id)
                      ? "text-green-500"
                      : ""
                  }
                />
                <p className="ml-2 text-sm">{retweetedBy.length}</p>
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
              {/* --- UPDATED BOOKMARK BUTTON --- */}
              <div
                onClick={bookmarkHandler}
                className="flex items-center duration-200 cursor-pointer hover:text-blue-500 select-none"
              >
                <FaBookmark
                  size="18px"
                  // THE FIX: Check if loggedInUser.bookmarks exists and is an array before calling .includes()
                  className={
                    loggedInUser?.bookmarks &&
                    loggedInUser.bookmarks.includes(tweetId)
                      ? "text-blue-500"
                      : ""
                  }
                />
              </div>
            </div>
          </div>
        </div>
        {/* --- Comments Dropdown Section --- */}
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
            <div
              onClick={() => setIsCommentModalOpen(true)}
              className="text-center text-blue-500 hover:underline cursor-pointer text-sm p-2"
            >
              Post your reply
            </div>
          </div>
        )}
      </div>
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
