import { createSlice } from "@reduxjs/toolkit";

const notificationSlice = createSlice({
  name: "notification",
  initialState: {
    notifications: [],
    unreadCount: 0,
  },
  reducers: {
    setNotifications: (state, action) => {
      state.notifications = action.payload;
      state.unreadCount = 0; // Reset count when notifications page is viewed
    },
    // Add this new action to update the count
    setUnreadCount: (state, action) => {
      state.unreadCount = action.payload;
    },
  },
});

export const { setNotifications, setUnreadCount } = notificationSlice.actions;
export default notificationSlice.reducer;
