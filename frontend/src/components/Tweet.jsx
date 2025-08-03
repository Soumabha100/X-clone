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

const Tweet = ({ tweet }) => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isCommentModalOpen, setIsCommentModalOpen] = useState(false);
  const [showComments, setShowComments] = useState(false);

  const { user: loggedInUser } = useSelector((store) => store.user);
  const dispatch = useDispatch();

  const {
    description,
    like,
    comments,
    userId: author,
    createdAt,
    isEdited,
    _id: tweetId,
  } = tweet;

  if (!author) return null;

  // Correctly implemented like/dislike handler
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

  // Correctly implemented delete handler
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

  const commentClickHandler = () => {
    if (comments && comments.length > 0) {
      setShowComments(!showComments);
    } else {
      setIsCommentModalOpen(true);
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
            <div className="py-2">
              <p>{description}</p>
            </div>
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
