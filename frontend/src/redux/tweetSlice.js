import { createSlice } from "@reduxjs/toolkit";

const tweetSlice = createSlice({
    name: "tweet",
    initialState: {
        tweets: null,
    },
    reducers: {
        // Action to set all tweets
        setTweets: (state, action) => {
            state.tweets = action.payload;
        },
        // Action to add a new tweet to the top of the list
        addTweet: (state, action) => {
            // unshift adds the new tweet to the beginning of the array
            state.tweets.unshift(action.payload);
        },
    },
});

export const { setTweets, addTweet } = tweetSlice.actions;
export default tweetSlice.reducer;
