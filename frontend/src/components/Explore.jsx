import React, { useState } from "react";
import { FaSearch } from "react-icons/fa";
import { IoIosSettings } from "react-icons/io";
import { FiMoreHorizontal } from "react-icons/fi";

/**
 * The Explore component serves as the discovery page of the application,
 * showcasing trending topics and news.
 * Note: This component currently uses static mock data for demonstration.
 */
const Explore = () => {
  // State to manage which navigation tab is currently active (e.g., "For You", "Trending").
  const [activeTab, setActiveTab] = useState("For You");

  // An array of strings representing the navigation tabs.
  const tabs = ["For You", "Trending", "News", "Sports", "Entertainment"];

  // Mock data array to simulate a list of trending topics.
  // In a real application, this data would be fetched from a backend API.
  const trends = [
    {
      category: "Trending in India",
      title: "#INDvENG",
      posts: "21.4K posts",
    },
    { category: "Technology", title: "React 19", posts: "15K posts" },
    {
      category: "Entertainment",
      title: "New Movie Trailer",
      posts: "128K posts",
    },
    {
      category: "Politics",
      title: "Election Results",
      posts: "55.2K posts",
    },
    {
      category: "Business & finance",
      title: "Stock Market",
      posts: "9,874 posts",
    },
    {
      category: "Web Development",
      title: "Tailwind CSS",
      posts: "32.1K posts",
    },
  ];

  return (
    // Main container for the Explore page.
    <div className="w-full min-h-screen text-white border-l border-r border-neutral-800">
      {/* --- Sticky Header Section --- */}
      {/* This header contains the search bar and settings icon and stays at the top on scroll. */}
      <div className="sticky top-0 z-10 px-4 py-2 bg-black/80 backdrop-blur-md">
        <div className="flex items-center justify-between gap-4">
          {/* Search Bar */}
          <div className="flex items-center w-full px-4 py-2 bg-neutral-800 rounded-full">
            <FaSearch className="text-neutral-500" />
            <input
              type="text"
              placeholder="Search"
              className="w-full ml-4 text-white bg-transparent outline-none"
            />
          </div>
          {/* Settings Icon */}
          <div className="p-2 rounded-full cursor-pointer hover:bg-neutral-800">
            <IoIosSettings size="20px" />
          </div>
        </div>
      </div>

      {/* --- Navigation Tabs Section --- */}
      <nav className="flex justify-around border-b border-neutral-800">
        {tabs.map((tab) => (
          <div
            key={tab}
            onClick={() => setActiveTab(tab)}
            className="w-full text-center transition-colors duration-200 cursor-pointer hover:bg-neutral-900"
          >
            <div
              className={`py-4 font-bold relative ${
                activeTab === tab ? "text-white" : "text-neutral-500"
              }`}
            >
              {tab}
              {/* This div renders a blue underline for the currently active tab. */}
              {activeTab === tab && (
                <div className="absolute bottom-0 left-0 w-full h-1 bg-blue-500 rounded-full"></div>
              )}
            </div>
          </div>
        ))}
      </nav>

      {/* --- Content Section --- */}
      <div>
        <div className="p-4 border-b border-neutral-800">
          <h1 className="text-xl font-extrabold">Trends for you</h1>
        </div>

        {/* Map over the mock 'trends' data to render each trending topic. */}
        {trends.map((trend, index) => (
          <div
            key={index}
            className="flex items-center justify-between p-4 transition-colors duration-200 border-b cursor-pointer border-neutral-800 hover:bg-neutral-900/50"
          >
            <div>
              <p className="text-sm text-neutral-500">{trend.category}</p>
              <p className="text-md font-bold">{trend.title}</p>
              <p className="text-sm text-neutral-500">{trend.posts}</p>
            </div>
            <div className="p-2 text-neutral-500 rounded-full hover:bg-blue-500/10 hover:text-blue-500">
              <FiMoreHorizontal size="20px" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Explore;
