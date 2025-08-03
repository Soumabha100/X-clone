import { createSlice } from "@reduxjs/toolkit";

/**
 * A Redux slice to manage all state related to the authenticated user.
 * This includes the user's profile data and the initial authentication loading status.
 */
const userSlice = createSlice({
  // The name of the slice, used in the Redux store.
  name: "user",
  // The initial state for this slice.
  initialState: {
    user: null, // Holds the logged-in user's data object. Null if no user is logged in.
    // This flag tracks the initial authentication check that happens on page load.
    // It starts as 'true' and is set to 'false' once the check is complete.
    isLoading: true, 
  },
  // Reducers are functions that define how the state can be updated.
  reducers: {
    /**
     * Sets the authenticated user's data in the state.
     * This action also sets isLoading to false, signaling that the initial auth check is done.
     */
    setUser: (state, action) => {
      state.user = action.payload;
      state.isLoading = false;
    },
    /**
     * Clears the user data from the state, effectively logging them out.
     * This also sets isLoading to false.
     */
    clearUser: (state) => {
      state.user = null;
      state.isLoading = false;
    },
  },
});

// Export the action creators to be used in components (e.g., dispatch(setUser(...))).
export const { setUser, clearUser } = userSlice.actions;
// Export the reducer to be included in the main Redux store configuration.
export default userSlice.reducer;
