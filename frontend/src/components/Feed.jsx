import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import './Feed.css';
import TweetBox from './TweetBox';
import Post from './Post';

const initialPosts = [
  {
    id: 1, // Add unique IDs
    displayName: 'Gemini',
    username: 'gemini',
    verified: true,
    text: 'Just built a Twitter clone with React! #MERN #ReactJS',
    image: 'http://googleusercontent.com/file_content/1',
    avatar: 'https://cdn.iconscout.com/icon/free/png-256/free-google-3215467-2673820.png',
    likes: 27,
    isLiked: false,
  },
  {
    id: 2,
    displayName: 'React',
    username: 'reactjs',
    verified: true,
    text: 'The key to a great UI is reusable components.',
    avatar: 'https://upload.wikimedia.org/wikipedia/commons/a/a7/React-icon.svg',
    likes: 156,
    isLiked: true, // Let's make this one liked by default
  }
];

function Feed() {
  const [posts, setPosts] = useState(initialPosts);

  const handleAddPost = (tweetText) => {
    const newPost = {
      id: uuidv4(), // Use uuid for a robust unique ID
      displayName: 'Your Name',
      username: 'yourusername',
      verified: false,
      text: tweetText,
      avatar: 'https://cdn.iconscout.com/icon/free/png-256/free-cg-461783.png',
      likes: 0,
      isLiked: false,
    };
    setPosts([newPost, ...posts]);
  };

  // Function to handle the like action
  const handleLikeToggle = (postId) => {
    setPosts(posts.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          isLiked: !post.isLiked,
          likes: post.isLiked ? post.likes - 1 : post.likes + 1,
        };
      }
      return post;
    }));
  };

  return (
    <div className="feed">
      <div className="feed__header">
        <h2>Home</h2>
      </div>
      <TweetBox onPost={handleAddPost} />
      {posts.map((post) => (
        <Post
          key={post.id} // Use the unique ID for the key
          {...post} // Pass all post properties as props
          onLikeToggle={() => handleLikeToggle(post.id)} // Pass the handler
        />
      ))}
    </div>
  );
}

export default Feed;