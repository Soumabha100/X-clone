import { createSlice } from "@reduxjs/toolkit";

const uiSlice = createSlice({
  name: "ui",
  initialState: {
    isLoading: false,
    loadingMessage: "",
  },
  reducers: {
    setLoading: (state, action) => {
      state.isLoading = action.payload.status;
      state.loadingMessage = action.payload.message || "";
    },
  },
});

export const { setLoading } = uiSlice.actions;
export default uiSlice.reducer;
