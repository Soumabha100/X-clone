import { createSlice } from "@reduxjs/toolkit";

/**
 * A Redux slice to manage all state related to the application's tweets.
 * This includes fetching, creating, updating, and deleting tweets from the feed.
 */
const tweetSlice = createSlice({
  name: "tweet",
  initialState: {
    tweets: null,
  },
  reducers: {
    setTweets: (state, action) => {
      state.tweets = action.payload;
    },
    // Add this new action to append tweets for infinite scroll
    addTweets: (state, action) => {
        if(state.tweets){
            state.tweets.push(...action.payload);
        }
    },
    addTweet: (state, action) => {
      if (Array.isArray(state.tweets)) {
        state.tweets.unshift(action.payload);
      }
    },
    removeTweet: (state, action) => {
      state.tweets = state.tweets.filter(tweet => tweet._id !== action.payload);
    },
    updateTweet: (state, action) => {
      const updatedTweet = action.payload;
      if (Array.isArray(state.tweets)) {
        state.tweets = state.tweets.map(tweet => 
          tweet._id === updatedTweet._id ? updatedTweet : tweet
        );
      }
    },
  },
});

// Export the action creators to be used in components (e.g., dispatch(addTweet(...))).
export const { setTweets, addTweet, removeTweet, updateTweet, addTweets } = tweetSlice.actions;
// Export the reducer to be included in the main Redux store configuration.
export default tweetSlice.reducer;
