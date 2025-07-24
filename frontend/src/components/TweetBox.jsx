import React, { useState } from 'react';
import './TweetBox.css';
import { CgProfile } from "react-icons/cg"; 

// Accept the onPost function from props
function TweetBox({ onPost }) { 
  const [tweetMessage, setTweetMessage] = useState('');

  const sendTweet = (e) => {
    e.preventDefault();
    
    // If there's no text, do nothing
    if (!tweetMessage.trim()) return;

    // Call the function passed from the parent (Feed.jsx)
    onPost(tweetMessage); 

    // Clear the input field after posting
    setTweetMessage('');
  };

  return (
    <div className="tweetBox">
      <form>
        <div className="tweetBox__input">
          <CgProfile size={40} />
          <input
            onChange={(e) => setTweetMessage(e.target.value)}
            value={tweetMessage}
            placeholder="What's happening?"
            type="text"
          />
        </div>
        <button 
          onClick={sendTweet} 
          type="submit" 
          className="tweetBox__tweetButton"
        >
          Post
        </button>
      </form>
    </div>
  );
}

export default TweetBox;