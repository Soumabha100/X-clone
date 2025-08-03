import React, { useState } from "react";
import Avatar from "react-avatar";
import { MdClose } from "react-icons/md";
import axios from "axios";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { updateTweet } from "../redux/tweetSlice";
import { format } from "timeago.js";

const API_BASE_URL = "http://localhost:8000/api/v1";

const CommentModal = ({ tweet, onClose }) => {
  const [comment, setComment] = useState("");
  const { user: loggedInUser } = useSelector((store) => store.user);
  const dispatch = useDispatch();

  const submitHandler = async () => {
    try {
      const res = await axios.post(
        `${API_BASE_URL}/tweet/comment/${tweet._id}`,
        { comment },
        { withCredentials: true }
      );

      dispatch(updateTweet(res.data.tweet));
      toast.success(res.data.message);
      onClose();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to post comment.");
      console.error(error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-center pt-16 z-50">
      <div className="bg-black w-full max-w-lg rounded-2xl p-4 border border-gray-700 animate-pop-in">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-neutral-800"
          >
            <MdClose size="24px" />
          </button>
        </div>
        {/* Original Tweet Snippet */}
        <div className="flex mb-4">
          <Avatar name={tweet.userId.name} size="40" round={true} />
          <div className="ml-3">
            <div className="flex items-center">
              <h1 className="font-bold">{tweet.userId.name}</h1>
              <p className="text-neutral-500 ml-2">
                @{tweet.userId.username} · {format(tweet.createdAt)}
              </p>
            </div>
            <p className="text-white">{tweet.description}</p>
            <p className="mt-2 text-sm text-neutral-500">
              Replying to{" "}
              <span className="text-blue-500">@{tweet.userId.username}</span>
            </p>
          </div>
        </div>
        {/* Comment Input Area */}
        <div className="flex">
          <Avatar name={loggedInUser.name} size="40" round={true} />
          <div className="w-full ml-3">
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full bg-transparent text-lg resize-none outline-none min-h-[100px] focus:ring-0"
              placeholder="Post your reply"
            />
            <div className="text-right mt-2">
              <button
                onClick={submitHandler}
                disabled={!comment.trim()}
                className="px-4 py-2 text-md font-bold text-white bg-blue-500 rounded-full hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Reply
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommentModal;
