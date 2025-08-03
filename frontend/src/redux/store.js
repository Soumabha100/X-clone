import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice";
import tweetReducer from "./tweetSlice";
import notificationReducer from "./notificationSlice"; 
import uiReducer from "./uiSlice";

/**
 * The main Redux store for the application.
 * This is the single source of truth for all global state.
 */
const store = configureStore({
  // The 'reducer' object combines all the individual slice reducers into one root reducer.
  // Each key here will correspond to a top-level state object in the Redux store.
  reducer: {
    // The 'user' slice will manage all state related to the authenticated user.
    user: userReducer,
    // The 'tweet' slice will manage the state for the feed of tweets.
    tweet: tweetReducer,
    // The 'notification' slice handles the state for notifications and the unread count.
    notification: notificationReducer, 
    // The 'ui' slice manages global UI state, like the loading overlay.
    ui: uiReducer,
  },
});

// Export the configured store so it can be provided to the entire React application.
export default store;
