import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: {
    user: null, // Holds the logged-in user's data
    isLoading: true, // Tracks the initial auth check
    visitedProfiles: {}, // ADD THIS: A cache for visited user profiles
  },
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
      state.isLoading = false;
    },
    clearUser: (state) => {
      state.user = null;
      state.isLoading = false;
    },
    // ADD THIS NEW REDUCER vvv
    // This action will save a fetched profile into our cache.
    setVisitedProfile: (state, action) => {
      const { profileId, profileData } = action.payload;
      state.visitedProfiles[profileId] = profileData;
    },
  },
});

export const { setUser, clearUser, setVisitedProfile } = userSlice.actions;

export default userSlice.reducer;
