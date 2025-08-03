import React, { useState } from "react";
import Avatar from "react-avatar";
import { MdClose } from "react-icons/md";
import axios from "axios";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { updateTweet } from "../redux/tweetSlice";

const API_BASE_URL = "http://localhost:8000/api/v1";

/**
 * A modal component for editing the description of an existing tweet.
 * @param {object} props - The component's props.
 * @param {object} props.tweet - The full tweet object to be edited.
 * @param {function} props.onClose - A function to close the modal.
 */
const EditTweetModal = ({ tweet, onClose }) => {
  // State to hold the edited text. It's initialized with the tweet's current description.
  const [editedDescription, setEditedDescription] = useState(tweet.description);
  const dispatch = useDispatch();

  /**
   * Handles the submission of the edited tweet to the backend.
   */
  const submitHandler = async () => {
    try {
      // Send a PUT request to the backend's edit endpoint.
      const res = await axios.put(
        `${API_BASE_URL}/tweet/edit/${tweet._id}`,
        {
          description: editedDescription,
        },
        {
          withCredentials: true,
        }
      );

      // Dispatch an action to update the tweet in the global Redux store.
      // This ensures the UI updates instantly without a page refresh.
      dispatch(updateTweet(res.data.tweet));
      toast.success(res.data.message);
      onClose(); // Close the modal after a successful update.
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update tweet.");
      console.error(error);
    }
  };

  return (
    // The main container for the modal, including a semi-transparent backdrop.
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-center pt-16 z-50">
      <div className="bg-black w-full max-w-lg rounded-2xl p-4 border border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-neutral-800"
          >
            <MdClose size="24px" />
          </button>
        </div>
        <div className="flex">
          <Avatar name={tweet.userId.name} size="40" round={true} />
          <div className="w-full ml-3">
            <textarea
              value={editedDescription}
              onChange={(e) => setEditedDescription(e.target.value)}
              className="w-full bg-transparent text-lg resize-none outline-none min-h-[100px]"
              placeholder="What's happening?"
            />
            <div className="text-right mt-2">
              <button
                onClick={submitHandler}
                className="px-4 py-2 text-md font-bold text-white bg-blue-500 rounded-full hover:bg-blue-600"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditTweetModal;
