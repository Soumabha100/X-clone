import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice";
import tweetReducer from "./tweetSlice";
import uiReducer from "./uiSlice"; // Import the new UI reducer

const store = configureStore({
  reducer: {
    user: userReducer,
    tweet: tweetReducer,
    ui: uiReducer, // Add the new reducer to the store
  },
});

export default store;
