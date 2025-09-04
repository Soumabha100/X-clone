import React from "react";

const DeleteTweetModal = ({ onConfirm, onCancel }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-black rounded-2xl p-8 w-full max-w-sm mx-4 text-center border border-gray-700 animate-pop-in">
        <h2 className="text-2xl font-bold mb-2">Delete Post?</h2>
        <p className="text-neutral-500 mb-6">
          This can’t be undone and it will be removed from your profile, the
          timeline of any accounts that follow you, and from search results.
        </p>
        <div className="flex flex-col space-y-4">
          <button
            onClick={onConfirm}
            className="w-full py-3 font-bold text-white bg-red-600 rounded-full hover:bg-red-700 transition-colors duration-200"
          >
            Delete
          </button>
          <button
            onClick={onCancel}
            className="w-full py-3 font-bold text-white bg-transparent border border-gray-500 rounded-full hover:bg-neutral-800 transition-colors duration-200"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteTweetModal;
