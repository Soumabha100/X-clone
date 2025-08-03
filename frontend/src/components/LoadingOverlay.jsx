import React from 'react';
import { FaXTwitter } from 'react-icons/fa6';
import { useSelector } from 'react-redux';

/**
 * A global, full-screen loading overlay component.
 * Its visibility and message are controlled by the 'ui' slice in the Redux store,
 * allowing any component to trigger it.
 */
const LoadingOverlay = () => {
    // Subscribe to the 'ui' slice of the Redux store to get the current loading state.
    const { isLoading, loadingMessage } = useSelector(store => store.ui);

    // If the global isLoading flag is false, the component renders nothing.
    if (!isLoading) {
        return null;
    }

    // If isLoading is true, render the full-screen overlay.
    return (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black bg-opacity-80 transition-opacity duration-300">
            {/* A spinning 'X' logo for visual feedback. */}
            <div className="animate-spin">
                <FaXTwitter size={60} className="text-white" />
            </div>
            {/* The dynamic message passed from the component that triggered the loader. */}
            <p className="mt-6 text-xl font-semibold tracking-wider text-white">
                {loadingMessage}
            </p>
        </div>
    );
};

export default LoadingOverlay;
