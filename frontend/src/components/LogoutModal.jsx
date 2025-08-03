import React from "react";
import { FaXTwitter } from "react-icons/fa6";

/**
 * A reusable modal component that asks the user for confirmation before logging out.
 * @param {object} props - The component's props.
 * @param {function} props.onConfirm - The function to call when the user confirms the logout.
 * @param {function} props.onCancel - The function to call when the user cancels the action.
 */
const LogoutModal = ({ onConfirm, onCancel }) => {
  return (
    // The main container for the modal, including a semi-transparent backdrop
    // to focus the user's attention on the dialog.
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      {/* The modal content itself, with a border and a pop-in animation. */}
      <div className="bg-black rounded-2xl p-8 w-full max-w-sm mx-4 text-center border border-gray-700 animate-pop-in">
        <div className="mx-auto mb-4">
          <FaXTwitter size={40} />
        </div>
        <h2 className="text-2xl font-bold mb-2">Log out of X?</h2>
        <p className="text-neutral-500 mb-6">
          You can always log back in at any time. If you just want to switch
          accounts, you can do that by adding an existing account.
        </p>
        {/* Container for the action buttons. */}
        <div className="flex flex-col space-y-4">
          {/* The confirmation button, styled in red to indicate a significant action. */}
          <button
            onClick={onConfirm}
            className="w-full py-3 font-bold text-white bg-red-600 rounded-full hover:bg-red-700 transition-colors duration-200"
          >
            Log out
          </button>
          {/* The cancel button, styled neutrally. */}
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

export default LogoutModal;
