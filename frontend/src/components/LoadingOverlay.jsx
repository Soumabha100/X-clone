    import React from 'react';
    import { FaXTwitter } from 'react-icons/fa6';
    import { useSelector } from 'react-redux';

    const LoadingOverlay = () => {
        // This component reads its state directly from the global UI store
        const { isLoading, loadingMessage } = useSelector(store => store.ui);

        // If not loading, render nothing
        if (!isLoading) {
            return null;
        }

        return (
            <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black bg-opacity-80 transition-opacity duration-300">
                <div className="animate-spin">
                    <FaXTwitter size={60} className="text-white" />
                </div>
                <p className="mt-6 text-xl font-semibold tracking-wider text-white">
                    {loadingMessage}
                </p>
            </div>
        );
    };

    export default LoadingOverlay;
    