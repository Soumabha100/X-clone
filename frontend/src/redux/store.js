import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice";
import tweetReducer from "./tweetSlice";
import notificationReducer from "./notificationSlice"; 
import uiReducer from "./uiSlice";

const store = configureStore({
  reducer: {
    user: userReducer,
    tweet: tweetReducer,
    notification: notificationReducer, 
    ui: uiReducer,
  },
});

export default store;
