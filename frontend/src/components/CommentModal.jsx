import React, { useState, useEffect, useRef } from "react";
import Avatar from "react-avatar";
import { MdClose } from "react-icons/md";
import axios from "axios";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { updateTweet } from "../redux/tweetSlice";
import { format } from "timeago.js";

const API_BASE_URL = "http://localhost:8000/api/v1";

/**
 * A modal component that allows a user to post a reply to a specific tweet.
 * @param {object} props - The component's props.
 * @param {object} props.tweet - The tweet object being commented on.
 * @param {function} props.onClose - A function to close the modal.
 */
const CommentModal = ({ tweet, onClose }) => {
  // State to hold the text content of the user's reply.
  const [comment, setComment] = useState("");
  // Get the currently logged-in user's data from the Redux store.
  const { user: loggedInUser } = useSelector((store) => store.user);
  const dispatch = useDispatch();
  // Create a ref to attach to the textarea element for autofocusing.
  const textareaRef = useRef(null);

  // This effect runs once when the modal opens to automatically focus the input field.
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  }, []);

  /**
   * Handles the submission of the new comment to the backend.
   */
  const submitHandler = async () => {
    try {
      // Post the new comment to the backend API.
      const res = await axios.post(
        `${API_BASE_URL}/tweet/comment/${tweet._id}`,
        { comment },
        { withCredentials: true }
      );

      // Dispatch an action to update the tweet in the Redux store with the new comment data.
      dispatch(updateTweet(res.data.tweet));
      toast.success(res.data.message);
      onClose(); // Close the modal after a successful submission.
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to post comment.");
      console.error(error);
    }
  };

  return (
    // The main container for the modal, including a semi-transparent backdrop.
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

        {/* This section displays a snippet of the original tweet being replied to. */}
        <div className="flex">
          {/* Left side with the original author's avatar and a vertical connecting line. */}
          <div className="flex flex-col items-center mr-4">
            <Avatar name={tweet.userId.name} size="40" round={true} />
            <div className="w-0.5 h-full bg-gray-700 my-2"></div>
          </div>

          {/* Right side with the original tweet's content. */}
          <div className="w-full">
            <div className="flex items-center">
              <h1 className="font-bold">{tweet.userId.name}</h1>
              <p className="text-neutral-500 ml-2">
                @{tweet.userId.username} · {format(tweet.createdAt)}
              </p>
            </div>
            <p className="text-white mt-1">{tweet.description}</p>
            <p className="mt-4 text-sm text-neutral-500">
              Replying to{" "}
              <span className="text-blue-500">@{tweet.userId.username}</span>
            </p>
          </div>
        </div>

        {/* This section is for the user to write their new comment. */}
        <div className="flex mt-4">
          <Avatar name={loggedInUser.name} size="40" round={true} />
          <div className="w-full ml-4">
            <textarea
              ref={textareaRef} // Assign the ref for autofocus.
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full bg-transparent text-lg resize-none outline-none min-h-[80px] focus:ring-0"
              placeholder="Post your reply"
            />
            <div className="text-right mt-2 border-t border-gray-700 pt-4">
              <button
                onClick={submitHandler}
                // The button is disabled if the comment text is empty.
                disabled={!comment.trim()}
                className="px-5 py-2 text-md font-bold text-white bg-blue-500 rounded-full hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
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
