import { configureStore } from "@reduxjs/toolkit";
import userReducer from './userSlice';
import tweetReducer from './tweetSlice'; // Import the new reducer

const store = configureStore({
    reducer: {
        user: userReducer,
        tweet: tweetReducer, // Add the tweet reducer
    }
});

export default store;
