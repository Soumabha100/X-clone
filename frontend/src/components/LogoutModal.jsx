import React from 'react';
import { FaXTwitter } from 'react-icons/fa6';

const LogoutModal = ({ onConfirm, onCancel }) => {
  return (
    // Main container with a semi-transparent backdrop
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      {/* Modal content with a smooth pop-in animation */}
      <div className="bg-black rounded-2xl p-8 w-full max-w-sm mx-4 text-center border border-gray-700 animate-pop-in">
        <div className="mx-auto mb-4">
            <FaXTwitter size={40} />
        </div>
        <h2 className="text-2xl font-bold mb-2">Log out of X?</h2>
        <p className="text-neutral-500 mb-6">
          You can always log back in at any time. If you just want to switch accounts, you can do that by adding an existing account.
        </p>
        <div className="flex flex-col space-y-4">
          <button
            onClick={onConfirm}
            className="w-full py-3 font-bold text-white bg-red-600 rounded-full hover:bg-red-700 transition-colors duration-200"
          >
            Log out
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

export default LogoutModal;
