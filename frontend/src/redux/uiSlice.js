import { createSlice } from "@reduxjs/toolkit";

/**
 * A Redux slice to manage global User Interface (UI) state.
 * This is primarily used for controlling the application-wide loading overlay.
 */
const uiSlice = createSlice({
  // The name of the slice, used in the Redux store.
  name: "ui",
  // The initial state for this slice.
  initialState: {
    isLoading: false, // A boolean to control the visibility of the loading overlay.
    loadingMessage: "", // The dynamic message to display on the loading overlay.
  },
  // Reducers are functions that define how the state can be updated.
  reducers: {
    /**
     * Sets the global loading state. This action can be dispatched from any
     * component to show or hide the loading overlay with a specific message.
     * @param {object} action.payload - Should be an object like { status: boolean, message: string }.
     */
    setLoading: (state, action) => {
      state.isLoading = action.payload.status;
      state.loadingMessage = action.payload.message || "";
    },
  },
});

// Export the action creator to be used in components (e.g., dispatch(setLoading(...))).
export const { setLoading } = uiSlice.actions;
// Export the reducer to be included in the main Redux store configuration.
export default uiSlice.reducer;
