import { createSlice } from "@reduxjs/toolkit";

/**
 * A Redux slice to manage all state related to the application's tweets.
 * This includes fetching, creating, updating, and deleting tweets from the feed.
 */
const tweetSlice = createSlice({
  // The name of the slice, used in the Redux store.
  name: "tweet",
  // The initial state for this slice. 'null' indicates that no tweets have been fetched yet.
  initialState: {
    tweets: null,
  },
  // Reducers are functions that define how the state can be updated.
  reducers: {
    /**
     * Replaces the entire list of tweets with a new array.
     * This is typically called after fetching tweets from the backend.
     */
    setTweets: (state, action) => {
      state.tweets = action.payload;
    },
    /**
     * Adds a single new tweet to the beginning of the tweets array.
     * This is used for an instant UI update after a user posts a new tweet.
     */
    addTweet: (state, action) => {
      // A safeguard to ensure 'tweets' is an array before using array methods.
      if (Array.isArray(state.tweets)) {
        state.tweets.unshift(action.payload);
      }
    },
    /**
     * Removes a single tweet from the array by its ID.
     * Used for an instant UI update after a user deletes a tweet.
     */
    removeTweet: (state, action) => {
      state.tweets = state.tweets.filter(tweet => tweet._id !== action.payload);
    },
    /**
     * Finds a tweet in the array by its ID and replaces it with an updated version.
     * This is a versatile action used for updates like liking, commenting, or editing.
     */
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
export const { setTweets, addTweet, removeTweet, updateTweet } = tweetSlice.actions;
// Export the reducer to be included in the main Redux store configuration.
export default tweetSlice.reducer;
