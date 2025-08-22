import React from 'react';

const TweetSkeleton = () => {
  return (
    <div className="flex flex-col p-4 border-b border-neutral-800 animate-pulse">
      <div className="flex">
        <div className="w-10 h-10 bg-neutral-700 rounded-full mr-3"></div>
        <div className="w-full">
          <div className="flex items-center">
            <div className="h-4 bg-neutral-700 rounded w-1/4"></div>
            <div className="h-3 bg-neutral-700 rounded w-1/4 ml-2"></div>
          </div>
          <div className="h-4 bg-neutral-700 rounded w-full mt-2"></div>
          <div className="h-4 bg-neutral-700 rounded w-3/4 mt-2"></div>
        </div>
      </div>
    </div>
  );
};

export default TweetSkeleton;