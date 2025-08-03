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
            state.tweets.unshift(action.payload);
        },
        // Add the new removeTweet action
        removeTweet: (state, action) => {
            // Filter out the tweet with the matching ID
            state.tweets = state.tweets.filter(tweet => tweet._id !== action.payload);
        },
    },
});

// Export the new action
export const { setTweets, addTweet, removeTweet } = tweetSlice.actions;
export default tweetSlice.reducer;
