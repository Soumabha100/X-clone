import React, { useState, useCallback, memo, useEffect, useRef } from "react";
import Avatar from "react-avatar";
import {
  FaComment,
  FaHeart,
  FaBookmark,
  FaTrash,
  FaPencilAlt,
} from "react-icons/fa";
import { BiRepost } from "react-icons/bi";
import { FiMoreHorizontal } from "react-icons/fi";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import toast from "react-hot-toast";
import { format } from "timeago.js";
import { Link } from "react-router-dom";
import { removeTweet, updateTweet } from "../redux/tweetSlice";
import EditTweetModal from "./EditTweetModal";
import CommentModal from "./CommentModal";
import { setUser } from "../redux/userSlice";
import DeleteTweetModal from "./DeleteTweetModal";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "/api/v1";

const Tweet = memo(({ tweet }) => {
  // --- All hooks are defined at the top-level, before any conditions or returns ---
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isCommentModalOpen, setIsCommentModalOpen] = useState(false);
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [isOptionsOpen, setIsOptionsOpen] = useState(false);

  const { user: loggedInUser } = useSelector((store) => store.user);
  const dispatch = useDispatch();
  const optionsMenuRef = useRef(null);

  const tweetId = tweet?._id;

  const likeOrDislikeHandler = useCallback(async () => {
    if (!tweetId) return;
    try {
      const res = await axios.put(
        `${API_BASE_URL}/tweet/like/${tweetId}`,
        { id: loggedInUser?._id },
        { withCredentials: true }
      );
      dispatch(updateTweet(res.data.tweet));
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to like tweet.");
    }
  }, [dispatch, tweetId, loggedInUser?._id]);

  const deleteTweetHandler = useCallback(async () => {
    setIsDeleteModalOpen(false);
    if (!tweetId) return;
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
      }
    }
  }, [dispatch, tweetId]);

  const retweetHandler = useCallback(async () => {
    if (!tweetId) return;
    try {
      const res = await axios.post(
        `${API_BASE_URL}/tweet/retweet/${tweetId}`,
        { id: loggedInUser?._id },
        { withCredentials: true }
      );
      dispatch(updateTweet(res.data.tweet));
      toast.success(res.data.message);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to retweet.");
    }
  }, [dispatch, tweetId, loggedInUser?._id]);

  const bookmarkHandler = useCallback(async () => {
    if (!tweetId) return;
    try {
      const res = await axios.put(
        `${API_BASE_URL}/user/bookmark/${tweetId}`,
        {},
        { withCredentials: true }
      );
      dispatch(setUser(res.data.user));
      toast.success(res.data.message);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to save bookmark.");
    }
  }, [dispatch, tweetId]);

  const commentClickHandler = useCallback(() => {
    setIsCommentModalOpen(true);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        optionsMenuRef.current &&
        !optionsMenuRef.current.contains(event.target)
      ) {
        setIsOptionsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!tweet || !tweet.userId) {
    return null;
  }

  const {
    description,
    like,
    comments,
    image,
    retweetedBy,
    userId: author,
    createdAt,
    isEdited,
  } = tweet;
  const isRetweet =
    loggedInUser &&
    retweetedBy.includes(loggedInUser._id) &&
    author._id !== loggedInUser._id;

  return (
    <>
      <div className="border-b border-neutral-800 px-4 py-3 cursor-pointer transition-colors duration-200 hover:bg-neutral-900/50">
        {isRetweet && (
          <div className="flex items-center text-neutral-500 text-sm mb-2 ml-10">
            <BiRepost size="20px" className="mr-2" />
            <span>You Retweeted</span>
          </div>
        )}
        <div className="flex gap-3">
          <div>
            <Link to={`/home/profile/${author._id}`}>
              <Avatar
                src={author.profileImg}
                name={author.name}
                size="40"
                round={true}
              />
            </Link>
          </div>
          <div className="w-full">
            {/* --- START: NEW CSS GRID HEADER --- */}
            <div className="grid grid-cols-[1fr_auto] items-start">
              {/* This container handles both rows of text content */}
              <div className="min-w-0">
                <Link
                  to={`/home/profile/${author._id}`}
                  className="font-bold hover:underline truncate text-white block"
                >
                  {author.name}
                </Link>
                <div className="flex items-center gap-2 text-sm text-neutral-500">
                  <span className="truncate">@{author.username}</span>
                  <span>·</span>
                  <span className="whitespace-nowrap">{format(createdAt)}</span>
                  {isEdited && <span className="text-xs">(edited)</span>}
                </div>
              </div>

              {/* MORE OPTIONS MENU */}
              {loggedInUser?._id === author._id && (
                <div className="relative" ref={optionsMenuRef}>
                  <div
                    onClick={(e) => {
                      e.preventDefault();
                      setIsOptionsOpen((p) => !p);
                    }}
                    className="p-2 -mr-2 rounded-full hover:bg-sky-900/50 text-neutral-500 hover:text-sky-500"
                  >
                    <FiMoreHorizontal size="18px" />
                  </div>
                  {isOptionsOpen && (
                    <div className="absolute top-8 right-0 w-48 bg-black border border-neutral-800 rounded-xl shadow-lg z-10 animate-pop-in">
                      <div
                        onClick={(e) => {
                          e.preventDefault();
                          setIsOptionsOpen(false);
                          setIsEditModalOpen(true);
                        }}
                        className="flex items-center gap-3 px-4 py-3 text-white hover:bg-neutral-900 rounded-t-xl"
                      >
                        <FaPencilAlt />
                        <span className="font-bold">Edit</span>
                      </div>
                      <div
                        onClick={(e) => {
                          e.preventDefault();
                          setIsOptionsOpen(false);
                          setIsDeleteModalOpen(true);
                        }}
                        className="flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-neutral-900 rounded-b-xl"
                      >
                        <FaTrash />
                        <span className="font-bold">Delete</span>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
            {/* --- END: NEW CSS GRID HEADER --- */}

            <Link to={`/home/tweet/${tweetId}`} className="block">
              <div className="py-1">
                <p className="whitespace-pre-wrap text-white">{description}</p>
                {image && (
                  <div className="relative mt-3 w-full h-auto max-h-[400px] rounded-2xl border border-gray-700 overflow-hidden">
                    {!isImageLoaded && (
                      <div className="w-full h-full min-h-[200px] bg-neutral-800 animate-pulse"></div>
                    )}
                    <img
                      src={image.replace(
                        "/upload/",
                        "/upload/w_600,f_auto,q_auto/"
                      )}
                      alt="Tweet media"
                      onLoad={() => setIsImageLoaded(true)}
                      className={`w-full h-auto object-cover transition-opacity duration-500 ${
                        isImageLoaded ? "opacity-100" : "opacity-0"
                      }`}
                    />
                  </div>
                )}
              </div>
            </Link>

            <div className="flex justify-between mt-3 text-neutral-500">
              <div
                onClick={(e) => {
                  e.preventDefault();
                  commentClickHandler();
                }}
                className="flex items-center duration-200 cursor-pointer hover:text-blue-500 select-none"
              >
                <FaComment size="18px" />
                <p className="ml-2 text-sm">{comments?.length || 0}</p>
              </div>
              <div
                onClick={(e) => {
                  e.preventDefault();
                  retweetHandler();
                }}
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
                onClick={(e) => {
                  e.preventDefault();
                  likeOrDislikeHandler();
                }}
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
              <div
                onClick={(e) => {
                  e.preventDefault();
                  bookmarkHandler();
                }}
                className="flex items-center duration-200 cursor-pointer hover:text-blue-500 select-none"
              >
                <FaBookmark
                  size="18px"
                  className={
                    loggedInUser?.bookmarks?.includes(tweetId)
                      ? "text-blue-500"
                      : ""
                  }
                />
              </div>
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
      {isCommentModalOpen && (
        <CommentModal
          tweet={tweet}
          onClose={() => setIsCommentModalOpen(false)}
        />
      )}
      {isDeleteModalOpen && (
        <DeleteTweetModal
          onConfirm={deleteTweetHandler}
          onCancel={() => setIsDeleteModalOpen(false)}
        />
      )}
    </>
  );
});

export default Tweet;
