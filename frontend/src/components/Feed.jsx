import React, { useState } from "react";
import Post from "./Post";
import Tweet from "./Tweet";

// Mock data for the tweet feed. In a real app, this would come from an API.
const tweetsData = [
  {
    id: 1,
    author: {
      name: "Elon Musk",
      username: "elonmusk",
      avatar:
        "https://pbs.twimg.com/profile_images/1780044485541699584/p78MCn3B_400x400.jpg",
    },
    content: "This is the future!",
    image:
      "https://pbs.twimg.com/media/Gw6Mi6EXIAADcg1?format=jpg&name=900x900",
    timestamp: "2m",
    stats: {
      comments: "2,643",
      reposts: "1.2K",
      likes: "25.6K",
      bookmarks: "3.2K",
    },
  },
  {
    id: 2,
    author: {
      name: "Donald J. Trump",
      username: "realDonaldTrump",
      avatar:
        "https://pbs.twimg.com/profile_images/874276197357596672/kUuht00m_400x400.jpg",
    },
    content: "Due to a massive earthquake that occurred in the Pacific Ocean, a Tsunami Warning is in effect for those living in Hawaii. A Tsunami Watch is in effect for Alaska and the Pacific Coast of the United States. Japan is also in the way.",
    image: null,
    timestamp: "1h",
    stats: {
      comments: "1,024",
      reposts: "876",
      likes: "12.1K",
      bookmarks: "980",
    },
  },
];

const Feed = () => {
  // State to track the active tab, now managed in the parent Feed component
  const [activeTab, setActiveTab] = useState("For you");

  return (
    <div className="w-full border-l border-r lg:w-[60%] border-neutral-700">
      {/* --- Sticky Header with Tabs --- */}
      <div className="sticky top-0 z-10 bg-black/80 backdrop-blur-md">
        <div className="flex items-center justify-between border-b border-neutral-700">
          {/* "For you" Tab */}
          <div
            onClick={() => setActiveTab("For you")}
            className="w-full text-center transition-colors duration-200 cursor-pointer hover:bg-neutral-900"
          >
            <h1
              className={`py-4 font-semibold text-lg relative ${
                activeTab === "For you" ? "text-white" : "text-neutral-500"
              }`}
            >
              For you
              {activeTab === "For you" && (
                <div className="absolute bottom-0 left-0 w-full h-1 bg-blue-500 rounded-full"></div>
              )}
            </h1>
          </div>
          {/* "Following" Tab */}
          <div
            onClick={() => setActiveTab("Following")}
            className="w-full text-center transition-colors duration-200 cursor-pointer hover:bg-neutral-900"
          >
            <h1
              className={`py-4 font-semibold text-lg relative ${
                activeTab === "Following" ? "text-white" : "text-neutral-500"
              }`}
            >
              Following
              {activeTab === "Following" && (
                <div className="absolute bottom-0 left-0 w-full h-1 bg-blue-500 rounded-full"></div>
              )}
            </h1>
          </div>
        </div>
      </div>

      {/* --- Post Creation Component --- */}
      <Post />

      {/* --- List of Tweets --- */}
      {/* We now map over the tweets data to render each Tweet component */}
      {tweetsData.map((tweet) => (
        <Tweet key={tweet.id} tweet={tweet} />
      ))}
    </div>
  );
};

export default Feed;
