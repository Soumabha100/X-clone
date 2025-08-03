import { createSlice } from "@reduxjs/toolkit";

/**
 * A Redux slice to manage all state related to user notifications.
 * This includes the list of notifications and the count of unread ones.
 */
const notificationSlice = createSlice({
  // The name of the slice, used in the Redux store.
  name: "notification",
  // The initial state for this slice.
  initialState: {
    notifications: [], // Holds the array of notification objects for the notifications page.
    unreadCount: 0, // Holds the number of unread notifications for the sidebar badge.
  },
  // Reducers are functions that define how the state can be updated.
  reducers: {
    /**
     * Replaces the entire list of notifications with a new array.
     * This is typically called when the user navigates to the notifications page.
     * It also resets the unread count to 0, as viewing the page marks them as read.
     */
    setNotifications: (state, action) => {
      state.notifications = action.payload;
      state.unreadCount = 0;
    },
    /**
     * Updates only the unread notification count.
     * This is used by the background polling in the Sidebar to keep the badge updated.
     */
    setUnreadCount: (state, action) => {
      state.unreadCount = action.payload;
    },
  },
});

// Export the action creators to be used in components (e.g., dispatch(setNotifications(...))).
export const { setNotifications, setUnreadCount } = notificationSlice.actions;
// Export the reducer to be included in the main Redux store configuration.
export default notificationSlice.reducer;
