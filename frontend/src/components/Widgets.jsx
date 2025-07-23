import React from 'react';
import './Widgets.css'; // We will create this file next
import { FiSearch } from "react-icons/fi";
import { BsThreeDots } from "react-icons/bs";

// A small, reusable component for each trend item
function Trend({ category, title, posts }) {
  return (
    <div className="widgets__trend">
      <div className="widgets__trend-info">
        <span>{category} · Trending</span>
        <h4>{title}</h4>
        <span>{posts} posts</span>
      </div>
      <BsThreeDots size={18} />
    </div>
  );
}

function Widgets() {
  // Dummy data for trends - later this would come from an API
  const trends = [
    { category: 'Technology', title: '#ReactJS', posts: '125K' },
    { category: 'Web Development', title: '#MERNStack', posts: '55.7K' },
    { category: 'Gaming', title: 'New Zelda', posts: '89.1K' },
    { category: 'India', title: '#ISRO', posts: '32.4K' },
  ];

  return (
    <div className="widgets">
      {/* Search Bar */}
      <div className="widgets__search">
        <FiSearch className="widgets__search-icon" />
        <input placeholder="Search" type="text" />
      </div>

      {/* "What's happening" Container */}
      <div className="widgets__container">
        <h2>What's happening</h2>
        
        {/* We use .map() to render our list of trends from the array */}
        {trends.map((trend, index) => (
          <Trend 
            key={index}
            category={trend.category}
            title={trend.title}
            posts={trend.posts}
          />
        ))}

        <a href="#" className="widgets__show-more">Show more</a>
      </div>
    </div>
  );
}

export default Widgets;