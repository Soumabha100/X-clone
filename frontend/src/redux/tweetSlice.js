import { createSlice } from "@reduxjs/toolkit";

const tweetSlice = createSlice({
    name: "tweet",
    initialState: {
        tweets: null,
    },
    reducers: {
        setTweets: (state, action) => {
            state.tweets = action.payload;
        },
        addTweet: (state, action) => {
            // Ensure tweets is an array before trying to unshift
            if (Array.isArray(state.tweets)) {
                state.tweets.unshift(action.payload);
            }
        },
        removeTweet: (state, action) => {
            state.tweets = state.tweets.filter(tweet => tweet._id !== action.payload);
        },
        // ADD THIS NEW ACTION
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

// Export the new action
export const { setTweets, addTweet, removeTweet, updateTweet } = tweetSlice.actions;
export default tweetSlice.reducer;
