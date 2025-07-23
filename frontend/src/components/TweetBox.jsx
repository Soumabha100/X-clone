import React, { useState } from 'react';
import './TweetBox.css'; 

// Using a generic avatar for now
import { CgProfile } from "react-icons/cg"; 

function TweetBox() {
  const [tweetMessage, setTweetMessage] = useState('');

  const sendTweet = (e) => {
    e.preventDefault(); // Prevent the form from refreshing the page
    
    // For now, we'll just log it. Later we'll send this to the backend.
    console.log("Posting tweet:", tweetMessage); 

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