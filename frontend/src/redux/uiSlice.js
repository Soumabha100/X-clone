import { createSlice } from "@reduxjs/toolkit";

const uiSlice = createSlice({
  name: "ui",
  initialState: {
    isLoading: false,
    loadingMessage: "",
    isCreatePostModalOpen: false,
    isInitialLoadComplete: false, // <-- ADD THIS NEW STATE
  },
  reducers: {
    setLoading: (state, action) => {
      state.isLoading = action.payload.status;
      state.loadingMessage = action.payload.message || "";
    },
    openCreatePostModal: (state) => {
      state.isCreatePostModalOpen = true;
    },
    closeCreatePostModal: (state) => {
      state.isCreatePostModalOpen = false;
    },
    // ADD THIS NEW ACTION vvv
    // This will be called ONLY ONCE by the Preloader when it's done.
    setInitialLoadComplete: (state) => {
      state.isInitialLoadComplete = true;
    },
  },
});

export const {
  setLoading,
  openCreatePostModal,
  closeCreatePostModal,
  setInitialLoadComplete, // <-- EXPORT THE NEW ACTION
} = uiSlice.actions;

export default uiSlice.reducer;
